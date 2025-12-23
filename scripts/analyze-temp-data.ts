/**
 * 临时数据洞察脚本 / Temporary data insight script
 *
 * 目标 / Goal:
 * 1. 解析 temp/data 中的问卷导出，输出字段列表与统计信息。
 * 2. 帮助数据库建模阶段确认需要保留的字段与图片资源。
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";
import xlsx from "xlsx";

/**
 * 解析学员风采的 Excel 文件，提取核心字段。
 * Parse alumni showcase Excel export and extract essential insights.
 */
const analyzeAlumniWorkbook = () => {
  const alumniDir = path.join(process.cwd(), "temp", "data", "学员风采");
  const workbook = xlsx.readFile(path.join(alumniDir, "校友信息库更新（源收集结果）.xlsx"));
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(firstSheet, {
    defval: "",
    raw: false,
  });

  const bioConsentField = "您是否愿意在校友网站上展示自我介绍？（必填）";
  const photoConsentField = "您是否愿意在校友网站上展示个人照片？（必填）";
  const photoField = "个人照片";

  const consentingRows = rows.filter(
    (row) => row[bioConsentField]?.toString().includes("愿意") && row[photoConsentField]?.toString().includes("愿意"),
  );

  const sampleRecord = consentingRows[0] ?? rows[0];
  const columns = Object.keys(sampleRecord ?? {});

  const photosDir = path.join(alumniDir, "图片");
  const missingPhotos = consentingRows.slice(0, 20).reduce<string[]>((acc, row) => {
    const filename = row[photoField]?.toString().trim();
    if (!filename) {
      acc.push("（空文件名 / empty filename）");
      return acc;
    }
    const exists = existsSync(path.join(photosDir, filename));
    if (!exists) {
      acc.push(filename);
    }
    return acc;
  }, []);

  console.log("=== 学员风采数据概览 / Alumni dataset overview ===");
  console.log("总记录数 / total rows:", rows.length);
  console.log("同意展示人数 / consenting rows:", consentingRows.length);
  console.log("示例记录字段 / sample record keys:", columns);
  console.log("缺失图片（前 20 条）/ missing photos (first 20 rows):", missingPhotos);
  console.log("示例记录 / sample record:", sampleRecord);
};

/**
 * 解析公众号推文 CSV，输出字段结构。
 * Parse WeChat article CSV export and output field structure.
 */
const analyzeResourceCsv = () => {
  const csvPath = path.join(process.cwd(), "temp", "data", "外链资源", "公众号推文.csv");
  const csvBuffer = readFileSync(csvPath);
  const records = parse(csvBuffer, {
    bom: true,
    columns: true,
    skip_empty_lines: true,
  }) as Record<string, string>[];

  console.log("\n=== 外链资源数据概览 / External resource dataset overview ===");
  console.log("总记录数 / total rows:", records.length);
  console.log("字段列表 / columns:", Object.keys(records[0] ?? {}));
  console.log("示例记录 / sample record:", records[0]);
};

analyzeAlumniWorkbook();
analyzeResourceCsv();



