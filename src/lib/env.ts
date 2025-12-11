import { z } from "zod";

const envSchema = z.object({
  // 数据库连接字符串 / Database connection string
  DATABASE_URL: z.string().url(),
});

/**
 * 运行时环境变量（已校验）
 * Runtime env (validated)
 */
export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
});


