#!/usr/bin/env tsx

/**
 * 上传学员样本数据（Excel + Zip）
 * Upload alumni sample data (Excel + Zip)
 */

import { readFileSync } from "fs";
import { join } from "path";

const API_BASE = process.env.API_BASE || "http://localhost:3000";
const UPLOAD_ENDPOINT = `${API_BASE}/api/admin/alumni/upload`;

const ROOT = process.cwd();
const sampleDir = join(ROOT, "temp", "sample");
const excelPath = join(sampleDir, "alumni-sample.xlsx");
const zipPath = join(sampleDir, "alumni-photos-sample.zip");

async function uploadAlumni() {
  console.log("🚀 开始上传学员样本数据 / Starting alumni sample upload");
  console.log(`📡 API 端点 / API Endpoint: ${UPLOAD_ENDPOINT}\n`);

  try {
    // 检查文件是否存在
    const excelExists = require("fs").existsSync(excelPath);
    const zipExists = require("fs").existsSync(zipPath);

    if (!excelExists) {
      throw new Error(`Excel 文件不存在 / Excel not found: ${excelPath}`);
    }

    console.log(`📄 Excel: ${excelPath} (${excelExists ? "✅" : "❌"})`);
    console.log(`📦 Zip: ${zipPath} (${zipExists ? "✅" : "❌"})`);

    const formData = new FormData();
    const excelBuffer = readFileSync(excelPath);
    const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    formData.append("excel", excelBlob, "alumni-sample.xlsx");

    if (zipExists) {
      const zipBuffer = readFileSync(zipPath);
      const zipBlob = new Blob([zipBuffer], { type: "application/zip" });
      formData.append("photos_zip", zipBlob, "alumni-photos-sample.zip");
      console.log(`\n📤 上传 Excel + Zip...`);
    } else {
      console.log(`\n📤 上传 Excel（无图片包）...`);
    }

    formData.append("submittedBy", "script-upload-alumni-sample");

    console.log("⏳ 正在上传，请稍候...");

    const response = await fetch(UPLOAD_ENDPOINT, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    console.log("\n" + "=".repeat(60));
    console.log("✅ 上传成功 / Upload successful!");
    console.log(`📊 批次 ID / Batch ID: ${result.batchId}`);
    console.log(`✅ 已接受 / Accepted: ${result.accepted ?? "N/A"}`);
    console.log(`⏭️  已跳过 / Skipped: ${result.skipped ?? "N/A"}`);
    if (result.errors && result.errors.length > 0) {
      console.log(`❌ 错误 / Errors: ${result.errors.length}`);
      result.errors.slice(0, 5).forEach((err: string) => {
        console.log(`   - ${err}`);
      });
      if (result.errors.length > 5) {
        console.log(`   ... 还有 ${result.errors.length - 5} 个错误`);
      }
    }
    console.log("=".repeat(60));
  } catch (error) {
    console.error("\n❌ 上传失败 / Upload failed:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

uploadAlumni().catch((error) => {
  console.error("💥 脚本执行失败 / Script execution failed:", error);
  process.exit(1);
});


