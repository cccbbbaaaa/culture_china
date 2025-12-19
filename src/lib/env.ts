import { z } from "zod";

export const isEdgeStaticDeploy = process.env.NEXT_PUBLIC_EDGE_DEPLOY === "true";

const envSchema = z
  .object({
    // 数据库连接字符串 / Database connection string
    // 优先使用 POSTGRES_URL（Vercel Postgres 自动提供），否则使用 DATABASE_URL
    // Prefer POSTGRES_URL (auto-provided by Vercel Postgres), fallback to DATABASE_URL
    //
    // EdgeOne 纯静态部署可能没有运行时 DB，因此允许缺省 / Allow missing DB in static edge deploys
    DATABASE_URL: z.string().url().optional(),
    SUPABASE_URL: z.string().url().optional(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
    SUPABASE_STORAGE_BUCKET: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    if (!isEdgeStaticDeploy && !values.DATABASE_URL) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DATABASE_URL is required (or POSTGRES_URL) for server rendering.",
        path: ["DATABASE_URL"],
      });
    }
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
});






