import { z } from "zod";

const envSchema = z.object({
  // 数据库连接字符串 / Database connection string
  // 优先使用 POSTGRES_URL（Vercel Postgres 自动提供），否则使用 DATABASE_URL
  // Prefer POSTGRES_URL (auto-provided by Vercel Postgres), fallback to DATABASE_URL
  DATABASE_URL: z.string().url(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().optional(),
  // 管理员账号配置可选；若未配置则后台登录不可用，但前台不受影响
  // Admin credentials are optional; when missing, admin login will be disabled but frontend still works.
  ADMIN_MEDIA_USER: z.string().optional(),
  ADMIN_MEDIA_PASSWORD: z.string().optional(),
  ADMIN_ROOT_USER: z.string().optional(),
  ADMIN_ROOT_PASSWORD: z.string().optional(),
  ADMIN_SESSION_SECRET: z.string().optional(),
});

/**
 * 运行时环境变量（已校验）
 * Runtime env (validated)
 */
export const env = envSchema.parse({
  // Vercel Postgres 提供 POSTGRES_URL，本地开发使用 DATABASE_URL
  // Vercel Postgres provides POSTGRES_URL, local dev uses DATABASE_URL
  DATABASE_URL: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET,
  ADMIN_MEDIA_USER: process.env.ADMIN_MEDIA_USER,
  ADMIN_MEDIA_PASSWORD: process.env.ADMIN_MEDIA_PASSWORD,
  ADMIN_ROOT_USER: process.env.ADMIN_ROOT_USER,
  ADMIN_ROOT_PASSWORD: process.env.ADMIN_ROOT_PASSWORD,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
});






