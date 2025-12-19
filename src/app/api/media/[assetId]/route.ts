import { eq } from "drizzle-orm";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { mediaAssets } from "@/db/schema";
import { db } from "@/lib/db";
import { getSupabaseAdminClient, getSupabaseBucketName } from "@/lib/storage";

export const runtime = "nodejs";

const paramsSchema = z.object({
  assetId: z.string().regex(/^\d+$/, "assetId must be a number"),
});

/**
 * 通过服务端代理读取 Supabase Storage 图片，避免 signed URL 在浏览器侧 400。
 * Proxy media download via server to avoid signed URL 400 in browser.
 *
 * - URL: /api/media/:assetId
 * - 仅允许访问已入库的 media_assets 记录 / Only allow assets in DB
 */
export async function GET(_req: NextRequest, ctx: { params: { assetId: string } }) {
  const parsed = paramsSchema.safeParse(ctx.params);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid asset id" }, { status: 400 });
  }

  const assetId = Number(parsed.data.assetId);
  const rows = await db
    .select({ storagePath: mediaAssets.storagePath })
    .from(mediaAssets)
    .where(eq(mediaAssets.id, assetId))
    .limit(1);

  if (rows.length === 0) {
    return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
  }

  const supabase = getSupabaseAdminClient();
  const bucket = getSupabaseBucketName();
  const storagePath = rows[0].storagePath;

  const { data, error } = await supabase.storage.from(bucket).download(storagePath);
  if (error || !data) {
    return NextResponse.json(
      { error: `Failed to download media: ${error?.message ?? "unknown error"}` },
      { status: 502 },
    );
  }

  const arrayBuffer = await data.arrayBuffer();
  const contentType = data.type || "application/octet-stream";

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      // 允许 CDN/浏览器缓存，降低对 Storage 的压力 / Allow caching to reduce Storage load
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

