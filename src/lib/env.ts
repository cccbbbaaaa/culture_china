import { z } from "zod";

const envSchema = z.object({
  // 数据库连接字符串 / Database connection string
  // 优先使用 POSTGRES_URL（Vercel Postgres 自动提供），否则使用 DATABASE_URL
  // Prefer POSTGRES_URL (auto-provided by Vercel Postgres), fallback to DATABASE_URL
  DATABASE_URL: z.string().url(),
});

/**
 * 运行时环境变量（已校验）
 * Runtime env (validated)
 */
export const env = envSchema.parse({
  // Vercel Postgres 提供 POSTGRES_URL，本地开发使用 DATABASE_URL
  // Vercel Postgres provides POSTGRES_URL, local dev uses DATABASE_URL
  DATABASE_URL: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});


