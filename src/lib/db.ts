import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { env } from "@/lib/env";

const createUnavailableDb = () => {
  return new Proxy(
    {},
    {
      get() {
        throw new Error("Database is not configured. Set POSTGRES_URL/DATABASE_URL for server rendering.");
      },
    },
  );
};

/**
 * 数据库实例（惰性：无 DATABASE_URL 时不在 import 阶段崩溃）
 * Lazy DB init: don't crash at import time when DATABASE_URL is missing.
 */
export const db = env.DATABASE_URL
  ? drizzle(
      postgres(env.DATABASE_URL, {
        max: 1, // 对于 Server Components，使用单个连接即可 / Single connection is enough for RSC
      }),
      { schema },
    )
  : (createUnavailableDb() as unknown as ReturnType<typeof drizzle>);


