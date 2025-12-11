import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";
import { env } from "@/lib/env";

// 创建 postgres 客户端
// Create postgres client
const client = postgres(env.DATABASE_URL, {
  max: 1, // 对于 Server Components，使用单个连接即可 / Single connection is enough for RSC
});

// 创建 Drizzle 实例
// Create Drizzle instance
export const db = drizzle(client, { schema });


