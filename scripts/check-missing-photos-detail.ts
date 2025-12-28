/**
 * 详细检查缺图的学员记录（包含 Excel 原始字段值）
 * Detailed check for missing photos (including original Excel field values)
 */

import { existsSync } from "node:fs";
import path from "node:path";

import { isNull } from "drizzle-orm";
import xlsx from "xlsx";

import { db } from "@/lib/db";
import { alumniProfiles } from "@/db/schema";

const ROOT = process.cwd();
const excelPath = path.join(ROOT, "temp", "data", "学员风采", "校友信息库更新（源收集结果）.xlsx");

const FIELD_MAP = {
  name: "姓名（必填）",
  email: "电子邮箱（必填）",
  photo: "个人照片",
  submissionTime: "提交时间（自动）",
  submissionEmail: "提交者（自动）",
};

const main = async () => {
  // 查询数据库中缺图的记录
  const missing = await db
    .select({
      id: alumniProfiles.id,
      name: alumniProfiles.name,
      email: alumniProfiles.email,
      cohort: alumniProfiles.cohort,
      submissionEmail: alumniProfiles.submissionEmail,
      submissionTs: alumniProfiles.submissionTs,
    })
    .from(alumniProfiles)
    .where(isNull(alumniProfiles.photoAssetId));

  console.log(`缺图记录数 / Missing photos count: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log("所有记录都有照片 / All records have photos.");
    return;
  }

  // 读取原始 Excel 以获取「个人照片」字段值（优先读取样本 Excel，因为那 50 条是从那里来的）
  const sampleExcelPath = path.join(ROOT, "temp", "sample", "alumni-sample.xlsx");
  const targetExcel = existsSync(sampleExcelPath) ? sampleExcelPath : excelPath;

  let excelData: Map<string, Record<string, unknown>> = new Map();
  if (existsSync(targetExcel)) {
    const workbook = xlsx.readFile(targetExcel);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });

    // 使用邮箱作为主键（因为邮箱应该是唯一的）
    for (const row of rows) {
      const email = row[FIELD_MAP.email]?.toString().trim().toLowerCase() ?? "";
      if (email) {
        excelData.set(email, row);
      }
    }
  }

  console.log(`使用 Excel 文件: ${targetExcel}\n`);
  console.log("缺图记录详情 / Missing photo details:\n");
  for (const record of missing) {
    console.log(`- ID: ${record.id}`);
    console.log(`  姓名: ${record.name}`);
    console.log(`  邮箱: ${record.email}`);
    console.log(`  期数: ${record.cohort ?? "未知"}`);
    console.log(`  提交邮箱: ${record.submissionEmail ?? "未知"}`);
    console.log(`  提交时间: ${record.submissionTs?.toISOString() ?? "未知"}`);

    // 尝试从 Excel 中找到对应的「个人照片」字段值（按邮箱匹配）
    const emailKey = record.email.toLowerCase();
    const excelRow = excelData.get(emailKey);
    if (excelRow) {
      const photoField = excelRow[FIELD_MAP.photo]?.toString().trim() ?? "";
      console.log(`  Excel「个人照片」字段: ${photoField || "（空）"}`);
      if (photoField) {
        const fileName = photoField.split("/").pop()?.trim().toLowerCase() ?? "";
        console.log(`  提取的文件名: ${fileName || "（无法提取）"}`);
      }
    } else {
      console.log(`  Excel「个人照片」字段: （未在 Excel 中找到匹配记录，邮箱: ${record.email}）`);
    }
    console.log("");
  }

  console.log("\n提示：请检查这些记录的「个人照片」字段值，确认：");
  console.log("1. 文件名是否正确（大小写、扩展名）");
  console.log("2. 文件是否存在于 temp/data/学员风采/图片/ 目录中");
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });




