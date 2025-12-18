/**
 * 随机抽样生成学员上传包（Excel + photos.zip）
 * Create a random sample upload package (Excel + photos.zip)
 *
 * - 从原始 Excel 中筛选“双愿意”记录
 * - 随机抽取 N 条（默认 50）
 * - 生成 sample.xlsx 与 sample-photos.zip
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

import AdmZip from "adm-zip";
import xlsx from "xlsx";

const SAMPLE_SIZE = Number.parseInt(process.env.SAMPLE_SIZE ?? "50", 10);

const ROOT = process.cwd();
const alumniDir = path.join(ROOT, "temp", "data", "学员风采");
const excelPath = path.join(alumniDir, "校友信息库更新（源收集结果）.xlsx");
const photosDir = path.join(alumniDir, "图片");

const outDir = path.join(ROOT, "temp", "sample");
const outExcelPath = path.join(outDir, "alumni-sample.xlsx");
const outZipPath = path.join(outDir, "alumni-photos-sample.zip");

const bioConsentField = "您是否愿意在校友网站上展示自我介绍？（必填）";
const photoConsentField = "您是否愿意在校友网站上展示个人照片？（必填）";
const photoField = "个人照片";

const shuffleInPlace = <T>(arr: T[]) => {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const hasConsent = (value: unknown) => value?.toString().includes("愿意");

const walkFiles = (dir: string, baseDir: string, map: Map<string, string>) => {
  const children = readdirSync(dir);
  for (const child of children) {
    const abs = path.join(dir, child);
    const st = statSync(abs);
    if (st.isDirectory()) {
      walkFiles(abs, baseDir, map);
      continue;
    }
    const lower = child.toLowerCase();
    if (!map.has(lower)) {
      map.set(lower, abs);
    }
  }
};

const main = () => {
  if (!existsSync(excelPath)) {
    throw new Error(`Excel not found: ${excelPath}`);
  }
  if (!existsSync(photosDir)) {
    throw new Error(`Photos dir not found: ${photosDir}`);
  }
  mkdirSync(outDir, { recursive: true });

  const workbook = xlsx.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });

  const consenting = rows.filter((row) => hasConsent(row[bioConsentField]) && hasConsent(row[photoConsentField]));
  shuffleInPlace(consenting);
  const sample = consenting.slice(0, Math.min(SAMPLE_SIZE, consenting.length));

  const sampleSheet = xlsx.utils.json_to_sheet(sample);
  const outWb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(outWb, sampleSheet, "sample");
  xlsx.writeFile(outWb, outExcelPath);

  const fileIndex = new Map<string, string>();
  walkFiles(photosDir, photosDir, fileIndex);

  const zip = new AdmZip();
  let included = 0;
  let missing = 0;

  for (const row of sample) {
    const name = row["姓名（必填）"]?.toString() ?? "";
    const fileNameRaw = row[photoField]?.toString() ?? "";
    const baseName = fileNameRaw.split("/").pop()?.trim().toLowerCase() ?? "";
    if (!baseName) {
      missing += 1;
      continue;
    }
    const abs = fileIndex.get(baseName);
    if (!abs) {
      missing += 1;
      continue;
    }
    // 维持 temp 标准嵌套结构：压缩包内以 “图片/xxx” 为根
    const relUnderPhotos = path.relative(photosDir, abs);
    const zipPath = path.join("图片", relUnderPhotos).replaceAll("\\", "/");
    zip.addFile(zipPath, readFileSync(abs));
    included += 1;

    // 防止异常大文件快速撑爆配额：输出时仅统计
    void name;
  }

  zip.writeZip(outZipPath);

  console.log("Sample generated:");
  console.log("- excel:", outExcelPath);
  console.log("- zip:", outZipPath);
  console.log("- sample rows:", sample.length);
  console.log("- included photos:", included);
  console.log("- missing photos:", missing);
};

main();


