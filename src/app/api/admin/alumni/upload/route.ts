import AdmZip from "adm-zip";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";

import { db } from "@/lib/db";
import {
  alumniEducations,
  alumniExperiences,
  alumniProfiles,
  uploadBatches,
} from "@/db/schema";
import { processAndStoreImage } from "@/lib/uploads";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1GB
const MAX_PHOTO_BYTES = 1024 * 1024; // 1MB

const FIELD_MAP = {
  submissionTime: "提交时间（自动）",
  name: "姓名（必填）",
  gender: "性别（必填）",
  cohort: "期数（必填）",
  major: "本科专业（必填）",
  email: "电子邮箱（必填）",
  city: "当前所在城市",
  industry: "当前工作行业",
  occupation: "当前职业",
  bioZh: "请填写一段简短的自我介绍（中文）",
  bioEn: "请填写一段简短的自我介绍（英文）",
  allowBio: "您是否愿意在校友网站上展示自我介绍？（必填）",
  allowPhoto: "您是否愿意在校友网站上展示个人照片？（必填）",
  website: "个人网站链接（如有）",
  websiteConsent: "您是否愿意将个人网站链接展示于公开校友网站？",
  photo: "个人照片",
  submissionEmail: "提交者（自动）",
};

const EDUCATION_FIELDS = [
  "教育经历1（ZJU本科后）",
  "教育经历2（如有）",
  "教育经历3（如有）",
  "教育经历4（如有）",
  "教育经历5（如有）",
] as const;

const EXPERIENCE_FIELDS = [
  "工作经历1（当前职业之前）",
  "工作经历2（如有）",
  "工作经历3（如有）",
  "工作经历4（如有）",
  "工作经历5（如有）",
] as const;

const chineseDigitMap: Record<string, number> = {
  零: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
};

const parseChineseNumber = (input: string) => {
  if (!input) {
    return null;
  }
  if (input === "十") {
    return 10;
  }
  if (input.startsWith("十")) {
    const unit = chineseDigitMap[input[1]] ?? 0;
    return 10 + unit;
  }
  if (input.endsWith("十")) {
    const tens = chineseDigitMap[input[0]] ?? 0;
    return tens * 10;
  }
  const idx = input.indexOf("十");
  if (idx >= 0) {
    const tens = idx === 0 ? 1 : chineseDigitMap[input[idx - 1]] ?? 0;
    const unit = idx === input.length - 1 ? 0 : chineseDigitMap[input[idx + 1]] ?? 0;
    return tens * 10 + unit;
  }
  return chineseDigitMap[input[0]] ?? null;
};

const parseCohort = (value: string) => {
  if (!value) {
    return null;
  }
  const numericMatch = value.match(/\d+/);
  if (numericMatch) {
    return Number(numericMatch[0]);
  }
  const chinese = value.replace(/[^零一二三四五六七八九十]/g, "");
  return parseChineseNumber(chinese);
};

const parseSubmissionTime = (value: string) => {
  if (!value) {
    return null;
  }
  const regex = /(\d{4})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{1,2})/;
  const match = value.match(regex);
  if (match) {
    const [, year, month, day, hour, minute] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    );
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

const hasConsent = (text: string) => text?.includes("愿意");

const getCellString = (value: unknown) => {
  if (value === undefined || value === null) {
    return "";
  }
  return value.toString().trim();
};

const buildPhotoMap = async (zipFile?: File) => {
  if (!zipFile) {
    return new Map<string, Buffer>();
  }
  if (zipFile.size > MAX_UPLOAD_BYTES) {
    throw new Error("图片压缩包大于 1GB，请拆分后再上传。");
  }
  const buffer = Buffer.from(await zipFile.arrayBuffer());
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();
  const map = new Map<string, Buffer>();
  for (const entry of entries) {
    if (entry.isDirectory) {
      continue;
    }
    const baseName = entry.entryName.split("/").pop()?.toLowerCase();
    if (baseName) {
      map.set(baseName, entry.getData());
    }
  }
  return map;
};

const getFileBuffer = async (file: File) => Buffer.from(await file.arrayBuffer());

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const excelFile = formData.get("excel");
    const photosZip = formData.get("photos_zip");
    const submittedBy = formData.get("submittedBy")?.toString() ?? "unknown";

    if (!(excelFile instanceof File)) {
      return NextResponse.json({ error: "缺少 Excel 文件 / Excel file is required." }, { status: 400 });
    }

    if (excelFile.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "Excel 文件超过 1GB 限制 / Excel exceeds 1GB." }, { status: 400 });
    }

    const batch = await db
      .insert(uploadBatches)
      .values({
        batchType: "alumni_excel",
        sourceFilename: excelFile.name,
        submittedBy,
        status: "processing",
        startedAt: new Date(),
      })
      .returning({ id: uploadBatches.id });

    const batchId = batch[0].id;
    const excelBuffer = await getFileBuffer(excelFile);
    const workbook = XLSX.read(excelBuffer, { type: "buffer" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet, { defval: "", raw: false });

    const filteredRows = rows.filter(
      (row) => hasConsent(getCellString(row[FIELD_MAP.allowBio])) && hasConsent(getCellString(row[FIELD_MAP.allowPhoto])),
    );

    const photoMap = await buildPhotoMap(photosZip instanceof File ? photosZip : undefined);

    let accepted = 0;
    const errors: string[] = [];

    for (const row of filteredRows) {
      try {
        const email = getCellString(row[FIELD_MAP.email]);
        const submissionTs = parseSubmissionTime(getCellString(row[FIELD_MAP.submissionTime]));

        if (!email || !submissionTs) {
          throw new Error("缺少邮箱或提交时间 / Missing email or submission timestamp.");
        }

        const cohort = parseCohort(getCellString(row[FIELD_MAP.cohort]));
        const websiteConsent = hasConsent(getCellString(row[FIELD_MAP.websiteConsent]));
        const website = websiteConsent ? getCellString(row[FIELD_MAP.website]) : "";

        const educationList = EDUCATION_FIELDS.map((field) => getCellString(row[field])).filter(Boolean);
        const experienceList = EXPERIENCE_FIELDS.map((field) => getCellString(row[field])).filter(Boolean);

        const rawPhotoName = getCellString(row[FIELD_MAP.photo]);
        const photoFileName = rawPhotoName ? rawPhotoName.split("/").pop()?.trim().toLowerCase() : "";
        let photoAssetId: number | undefined;

        if (photoFileName) {
          const photoBuffer = photoMap.get(photoFileName);
          if (photoBuffer) {
            const asset = await processAndStoreImage({
              buffer: photoBuffer,
              usage: "alumni_photo",
              batchId,
              fileName: photoFileName,
              maxBytes: MAX_PHOTO_BYTES,
              target: {
                width: 1000,
                height: 1400,
                fit: "contain",
                background: { r: 255, g: 255, b: 255, alpha: 1 },
              },
            });
            photoAssetId = asset.assetId;
          }
        }

        const insertPayload = {
          name: getCellString(row[FIELD_MAP.name]),
          cohort,
          gender: getCellString(row[FIELD_MAP.gender]),
          major: getCellString(row[FIELD_MAP.major]),
          email,
          city: getCellString(row[FIELD_MAP.city]),
          industry: getCellString(row[FIELD_MAP.industry]),
          occupation: getCellString(row[FIELD_MAP.occupation]),
          bioZh: getCellString(row[FIELD_MAP.bioZh]),
          bioEn: getCellString(row[FIELD_MAP.bioEn]),
          allowBio: true,
          allowPhoto: true,
          websiteUrl: website,
          photoAssetId,
          submissionEmail: getCellString(row[FIELD_MAP.submissionEmail]),
          submissionTs,
          batchId,
          updatedAt: new Date(),
        };

        const updatePayload = { ...insertPayload };
        if (!photoAssetId) {
          delete updatePayload.photoAssetId;
        }

        const [profile] = await db
          .insert(alumniProfiles)
          .values(insertPayload)
          .onConflictDoUpdate({
            target: [alumniProfiles.email, alumniProfiles.submissionTs],
            set: updatePayload,
          })
          .returning({ id: alumniProfiles.id });

        await db.delete(alumniEducations).where(eq(alumniEducations.profileId, profile.id));
        await db.delete(alumniExperiences).where(eq(alumniExperiences.profileId, profile.id));

        if (educationList.length) {
          await db.insert(alumniEducations).values(
            educationList.map((description, index) => ({
              profileId: profile.id,
              order: index + 1,
              description,
            })),
          );
        }

        if (experienceList.length) {
          await db.insert(alumniExperiences).values(
            experienceList.map((description, index) => ({
              profileId: profile.id,
              order: index + 1,
              description,
            })),
          );
        }

        accepted += 1;
      } catch (error) {
        errors.push((error as Error).message);
      }
    }

    await db
      .update(uploadBatches)
      .set({
        totalRows: rows.length,
        acceptedRows: accepted,
        status: "completed",
        finishedAt: new Date(),
        notes: errors.join("\n"),
      })
      .where(eq(uploadBatches.id, batchId));

    return NextResponse.json({
      success: true,
      batchId,
      total: rows.length,
      filtered: filteredRows.length,
      accepted,
      skipped: filteredRows.length - accepted,
      errors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


