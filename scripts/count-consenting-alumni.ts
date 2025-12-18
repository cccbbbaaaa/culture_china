#!/usr/bin/env tsx

/**
 * 统计"双愿意"学员总数
 * Count total consenting alumni records
 */

import { existsSync } from "node:fs";
import path from "node:path";

import xlsx from "xlsx";

const ROOT = process.cwd();
const excelPath = path.join(ROOT, "temp", "data", "学员风采", "校友信息库更新（源收集结果）.xlsx");

const bioConsentField = "您是否愿意在校友网站上展示自我介绍？（必填）";
const photoConsentField = "您是否愿意在校友网站上展示个人照片？（必填）";

const hasConsent = (value: unknown) => value?.toString().includes("愿意");

const main = () => {
  if (!existsSync(excelPath)) {
    throw new Error(`Excel not found: ${excelPath}`);
  }

  const workbook = xlsx.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });

  const total = rows.length;
  const consenting = rows.filter((row) => hasConsent(row[bioConsentField]) && hasConsent(row[photoConsentField]));

  console.log("📊 统计数据 / Statistics:");
  console.log(`   总记录数 / Total records: ${total}`);
  console.log(`   双愿意记录 / Double consent: ${consenting.length}`);
  console.log(`   可上传数量 / Uploadable: ${consenting.length}`);
};

main();
