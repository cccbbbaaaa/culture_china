import { eq } from "drizzle-orm";
import { parse } from "csv-parse/sync";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { externalResources, uploadBatches } from "@/db/schema";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // 1GB

const FIELD_MAP = {
  title: "标题",
  type: "推文类型",
  publishedAt: "推文发布日期",
  url: "推文链接",
  summary: "推文简介",
  year: "年份",
};

const parseDate = (value: string) => {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const csvFile = formData.get("csv");
    const submittedBy = formData.get("submittedBy")?.toString() ?? "unknown";

    if (!(csvFile instanceof File)) {
      return NextResponse.json({ error: "缺少 CSV 文件 / CSV file is required." }, { status: 400 });
    }

    if (csvFile.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "CSV 文件超过 1GB 限制 / CSV exceeds 1GB." }, { status: 400 });
    }

    const csvBuffer = Buffer.from(await csvFile.arrayBuffer());
    const records = parse(csvBuffer, {
      columns: true,
      bom: true,
      skip_empty_lines: true,
      trim: true,
    }) as Record<string, string>[];

    const batch = await db
      .insert(uploadBatches)
      .values({
        batchType: "resource_csv",
        sourceFilename: csvFile.name,
        submittedBy,
        totalRows: records.length,
        status: "processing",
        startedAt: new Date(),
      })
      .returning({ id: uploadBatches.id });

    const batchId = batch[0].id;
    let accepted = 0;
    const errors: string[] = [];

    for (const record of records) {
      try {
        const title = record[FIELD_MAP.title]?.trim();
        const url = record[FIELD_MAP.url]?.trim();

        if (!title || !url) {
          throw new Error("缺少标题或链接 / Missing title or URL.");
        }

        const publishedAt = parseDate(record[FIELD_MAP.publishedAt]);
        const year = Number.parseInt(record[FIELD_MAP.year] ?? "", 10) || publishedAt?.getFullYear() || undefined;

        const insertPayload = {
          title,
          type: record[FIELD_MAP.type]?.trim() ?? "未分类",
          summary: record[FIELD_MAP.summary]?.trim() ?? "",
          url,
          publishedAt: publishedAt ?? null,
          year,
          batchId,
          updatedAt: new Date(),
        };

        await db
          .insert(externalResources)
          .values(insertPayload)
          .onConflictDoUpdate({
            target: externalResources.url,
            set: insertPayload,
          });

        accepted += 1;
      } catch (error) {
        errors.push((error as Error).message);
      }
    }

    await db
      .update(uploadBatches)
      .set({
        acceptedRows: accepted,
        status: "completed",
        finishedAt: new Date(),
        notes: errors.join("\n"),
      })
      .where(eq(uploadBatches.id, batchId));

    return NextResponse.json({
      success: true,
      batchId,
      total: records.length,
      accepted,
      skipped: records.length - accepted,
      errors,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}



