import { sql } from "drizzle-orm";

import { db } from "@/lib/db";

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return "Unknown error";
};

/**
 * 数据库健康检查 / Database healthcheck
 * GET /api/health/db
 */
export const GET = async () => {
  try {
    await db.execute(sql`select 1 as ok`);
    return Response.json({ ok: true });
  } catch (error: unknown) {
    return Response.json({ ok: false, error: getErrorMessage(error) }, { status: 500 });
  }
};






