/**
 * 数据库备份脚本 / Database Backup Script
 * 
 * 使用方法 / Usage:
 *   pnpm tsx scripts/backup-database.ts
 * 
 * 功能 / Features:
 * - 从环境变量读取数据库连接（优先 POSTGRES_URL，否则 DATABASE_URL）
 * - 使用 Node.js postgres 库导出完整的数据库结构和数据
 * - 生成带时间戳的备份文件
 * 
 * 注意 / Note:
 * - 此脚本会备份所有表的结构和数据
 * - 备份文件保存在 ./backups/ 目录下
 * - 备份文件包含时间戳，格式：culture_china_backup_YYYY-MM-DDTHH-MM-SS.sql
 */

import { mkdirSync, writeFileSync, statSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import postgres from "postgres";

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

// 从环境变量读取数据库连接
const databaseUrl: string = process.env.POSTGRES_URL || process.env.DATABASE_URL || "";

if (!databaseUrl) {
  console.error("❌ 错误：未找到数据库连接字符串");
  console.error("   请设置 POSTGRES_URL 或 DATABASE_URL 环境变量");
  process.exit(1);
}

// 解析数据库连接字符串
const parseDatabaseUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return {
      host: parsed.hostname,
      port: Number.parseInt(parsed.port || "5432", 10),
      database: parsed.pathname.slice(1) || "postgres",
      user: parsed.username,
      password: parsed.password,
      ssl: url.includes("sslmode=require") ? "require" : undefined,
    };
  } catch (error) {
    console.error("❌ 无法解析数据库连接字符串:", error);
    process.exit(1);
  }
};

const dbConfig = parseDatabaseUrl(databaseUrl);

// 生成备份文件名（带时间戳）
const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupDir = join(process.cwd(), "backups");
const backupFile = join(backupDir, `culture_china_backup_${timestamp}.sql`);

console.log("📦 开始备份数据库...");
console.log(`   数据库: ${dbConfig.database}`);
console.log(`   主机: ${dbConfig.host}:${dbConfig.port}`);
console.log(`   备份文件: ${backupFile}\n`);

async function backupDatabase() {
  // 确保备份目录存在
  mkdirSync(backupDir, { recursive: true });

  // 创建数据库连接
  const sqlOptions: Parameters<typeof postgres>[1] = {
    max: 1,
  };
  
  if (dbConfig.ssl === "require") {
    sqlOptions.ssl = "require";
  }
  
  const sql = postgres(databaseUrl, sqlOptions);

  try {
    console.log("⏳ 正在连接数据库...");

    // 获取所有表名
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    if (tables.length === 0) {
      console.warn("⚠️  警告：未找到任何表");
    }

    console.log(`   找到 ${tables.length} 个表\n`);

    const backupLines: string[] = [];

    // 添加备份头部信息
    backupLines.push("-- ============================================");
    backupLines.push(`-- 数据库备份 / Database Backup`);
    backupLines.push(`-- 时间 / Time: ${new Date().toISOString()}`);
    backupLines.push(`-- 数据库 / Database: ${dbConfig.database}`);
    backupLines.push(`-- 主机 / Host: ${dbConfig.host}:${dbConfig.port}`);
    backupLines.push("-- ============================================\n");

    // 备份每个表
    for (const table of tables) {
      const tableName = table.tablename;
      console.log(`   备份表: ${tableName}...`);

      // 获取表结构（CREATE TABLE 语句）
      const createTable = await sql`
        SELECT 
          'CREATE TABLE ' || quote_ident(table_name) || ' (' ||
          string_agg(
            quote_ident(column_name) || ' ' || 
            CASE 
              WHEN data_type = 'USER-DEFINED' THEN udt_name
              ELSE data_type
            END ||
            CASE 
              WHEN character_maximum_length IS NOT NULL 
              THEN '(' || character_maximum_length || ')'
              ELSE ''
            END ||
            CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END ||
            CASE 
              WHEN column_default IS NOT NULL 
              THEN ' DEFAULT ' || column_default
              ELSE ''
            END,
            ', '
          ) || ');' as create_statement
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = ${tableName}
        GROUP BY table_name;
      `;

      if (createTable.length > 0) {
        backupLines.push(`\n-- ============================================`);
        backupLines.push(`-- 表结构 / Table Structure: ${tableName}`);
        backupLines.push(`-- ============================================`);
        backupLines.push(createTable[0].create_statement);
        backupLines.push("");
      }

      // 获取表数据
      const rows = await sql.unsafe(`SELECT * FROM "${tableName}"`);
      
      if (rows.length > 0) {
        backupLines.push(`-- ============================================`);
        backupLines.push(`-- 表数据 / Table Data: ${tableName} (${rows.length} 行)`);
        backupLines.push(`-- ============================================`);

        // 获取列名
        const columns = Object.keys(rows[0]);
        const columnNames = columns.map((col) => `"${col}"`).join(", ");

        // 生成 INSERT 语句
        for (const row of rows) {
          const values = columns
            .map((col) => {
              const value = row[col];
              if (value === null) return "NULL";
              if (typeof value === "string") {
                return `'${value.replace(/'/g, "''")}'`;
              }
              if (value instanceof Date) {
                return `'${value.toISOString()}'`;
              }
              if (typeof value === "object") {
                return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
              }
              return String(value);
            })
            .join(", ");

          backupLines.push(`INSERT INTO "${tableName}" (${columnNames}) VALUES (${values});`);
        }
        backupLines.push("");
      } else {
        backupLines.push(`-- 表 ${tableName} 无数据 / No data in table ${tableName}\n`);
      }
    }

    // 写入备份文件
    const backupContent = backupLines.join("\n");
    writeFileSync(backupFile, backupContent, "utf8");

    // 获取文件大小
    const stats = statSync(backupFile);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log("\n✅ 备份完成！");
    console.log(`   文件: ${backupFile}`);
    console.log(`   大小: ${fileSizeMB} MB`);
    console.log(`   表数量: ${tables.length}`);
    console.log(`\n💡 提示：备份文件已保存，可用于数据恢复或迁移`);
  } catch (error: unknown) {
    console.error("\n❌ 备份失败:", error);
    if (error instanceof Error) {
      console.error("   错误信息:", error.message);
    }
    console.error("\n💡 提示：");
    console.error("   1. 检查数据库连接字符串是否正确");
    console.error("   2. 确认网络连接和数据库访问权限");
    console.error("   3. 确保数据库服务正在运行");
    throw error;
  } finally {
    await sql.end();
  }
}

// 执行备份
backupDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("备份过程中发生错误:", error);
    process.exit(1);
  });

