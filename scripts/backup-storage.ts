/**
 * Supabase Storage 备份脚本 / Supabase Storage Backup Script
 * 
 * 使用方法 / Usage:
 *   pnpm tsx scripts/backup-storage.ts
 * 
 * 功能 / Features:
 * - 从数据库读取所有 media_assets 记录
 * - 从 Supabase Storage 下载所有图片文件
 * - 保持原有的目录结构
 * - 生成备份清单文件
 * 
 * 注意 / Note:
 * - 需要配置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY
 * - 备份文件保存在 ./backups/storage/ 目录下
 * - 备份清单保存在 ./backups/storage_manifest.json
 */

import { mkdirSync, writeFileSync, createWriteStream, existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import postgres from "postgres";
import { createClient } from "@supabase/supabase-js";

// 加载 .env 文件（如果存在）
const envPath = join(process.cwd(), ".env");
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, ""); // 移除引号
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

// 检查必要的环境变量
const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || "media";
const databaseUrl: string = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ 错误：未找到 Supabase 配置");
  console.error("   请设置 SUPABASE_URL 和 SUPABASE_SERVICE_ROLE_KEY 环境变量");
  process.exit(1);
}

if (!databaseUrl) {
  console.error("❌ 错误：未找到数据库连接字符串");
  console.error("   请设置 POSTGRES_URL 或 DATABASE_URL 环境变量");
  process.exit(1);
}

// 生成备份目录
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupDir = join(process.cwd(), "backups", "storage", timestamp);
const manifestFile = join(process.cwd(), "backups", `storage_manifest_${timestamp}.json`);

console.log("📦 开始备份 Supabase Storage...");
console.log(`   Supabase URL: ${supabaseUrl}`);
console.log(`   Bucket: ${bucketName}`);
console.log(`   备份目录: ${backupDir}`);
console.log(`   清单文件: ${manifestFile}\n`);

async function backupStorage() {
  // 确保备份目录存在
  mkdirSync(backupDir, { recursive: true });

  // 创建数据库连接
  const sql = postgres(databaseUrl, { max: 1 });

  // 创建 Supabase 客户端
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  try {
    console.log("⏳ 正在从数据库读取媒体资源列表...");

    // 获取所有媒体资源
    const mediaAssets = await sql`
      SELECT id, storage_path, width, height, filesize, ratio, usage, created_at
      FROM media_assets
      ORDER BY id;
    `;

    if (mediaAssets.length === 0) {
      console.warn("⚠️  警告：未找到任何媒体资源");
      return;
    }

    console.log(`   找到 ${mediaAssets.length} 个媒体资源\n`);

    const manifest: Array<{
      id: number;
      storagePath: string;
      localPath: string;
      size: number;
      width: number | null;
      height: number | null;
      usage: string;
      success: boolean;
      error?: string;
    }> = [];

    let successCount = 0;
    let failCount = 0;

    // 下载每个文件
    for (let i = 0; i < mediaAssets.length; i++) {
      const asset = mediaAssets[i];
      const storagePath = asset.storage_path;
      const localPath = join(backupDir, storagePath);

      process.stdout.write(`\r   下载中: [${i + 1}/${mediaAssets.length}] ${storagePath}...`);

      try {
        // 确保本地目录存在
        mkdirSync(dirname(localPath), { recursive: true });

        // 从 Supabase Storage 下载文件
        const { data, error } = await supabase.storage.from(bucketName).download(storagePath);

        if (error || !data) {
          throw new Error(error?.message || "下载失败");
        }

        // 将文件保存到本地
        const arrayBuffer = await data.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        writeFileSync(localPath, buffer);

        manifest.push({
          id: asset.id,
          storagePath,
          localPath: localPath.replace(process.cwd(), "."),
          size: buffer.length,
          width: asset.width,
          height: asset.height,
          usage: asset.usage,
          success: true,
        });

        successCount++;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`\n   ❌ 下载失败: ${storagePath} - ${errorMessage}`);

        manifest.push({
          id: asset.id,
          storagePath,
          localPath: localPath.replace(process.cwd(), "."),
          size: 0,
          width: asset.width,
          height: asset.height,
          usage: asset.usage,
          success: false,
          error: errorMessage,
        });

        failCount++;
      }
    }

    console.log("\n");

    // 保存备份清单
    const manifestData = {
      timestamp: new Date().toISOString(),
      supabaseUrl,
      bucketName,
      total: mediaAssets.length,
      success: successCount,
      failed: failCount,
      backupDir: backupDir.replace(process.cwd(), "."),
      files: manifest,
    };

    writeFileSync(manifestFile, JSON.stringify(manifestData, null, 2), "utf8");

    // 计算总大小
    const totalSize = manifest.reduce((sum, item) => sum + item.size, 0);
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

    console.log("✅ 备份完成！");
    console.log(`   成功: ${successCount} 个文件`);
    console.log(`   失败: ${failCount} 个文件`);
    console.log(`   总大小: ${totalSizeMB} MB`);
    console.log(`   备份目录: ${backupDir}`);
    console.log(`   清单文件: ${manifestFile}`);
    console.log(`\n💡 提示：备份文件已保存，可用于数据恢复或迁移`);
  } catch (error: unknown) {
    console.error("\n❌ 备份失败:", error);
    if (error instanceof Error) {
      console.error("   错误信息:", error.message);
    }
    throw error;
  } finally {
    await sql.end();
  }
}

// 执行备份
backupStorage()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("备份过程中发生错误:", error);
    process.exit(1);
  });

