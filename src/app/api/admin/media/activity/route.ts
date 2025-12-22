import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/db";
import { activityMedia, uploadBatches } from "@/db/schema";
import { processAndStoreImage } from "@/lib/uploads";

export const runtime = "nodejs";

const MAX_PROCESSED_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB
const MAX_SOURCE_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB 硬限制
const ALLOWED_SLOTS = new Set(["home_hero", "activities_gallery"]);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const slotKey = formData.get("slot_key")?.toString();
    const title = formData.get("title")?.toString() ?? "";
    const subtitle = formData.get("subtitle")?.toString() ?? "";
    const linkUrl = formData.get("link_url")?.toString() ?? "";
    const sortOrder = Number.parseInt(formData.get("sort_order")?.toString() ?? "0", 10);
    const isActive = formData.get("is_active")?.toString() !== "false";
    const submittedBy = formData.get("submittedBy")?.toString() ?? "unknown";

    if (!(image instanceof File)) {
      return NextResponse.json({ error: "缺少图片文件 / Image file is required." }, { status: 400 });
    }

    if (!slotKey || !ALLOWED_SLOTS.has(slotKey)) {
      return NextResponse.json(
        { error: "slot_key 非法，请使用 home_hero 或 activities_gallery。" },
        { status: 400 },
      );
    }

    if (image.size > MAX_SOURCE_IMAGE_BYTES) {
      return NextResponse.json({ error: "原始图片超过 8MB 限制 / Source image exceeds 8MB." }, { status: 400 });
    }

    const batch = await db
      .insert(uploadBatches)
      .values({
        batchType: "activity_media",
        sourceFilename: image.name,
        submittedBy,
        totalRows: 1,
        status: "processing",
        startedAt: new Date(),
      })
      .returning({ id: uploadBatches.id });

    const batchId = batch[0].id;
    const buffer = Buffer.from(await image.arrayBuffer());
    const asset = await processAndStoreImage({
      buffer,
      usage: "activity_banner",
      batchId,
      fileName: image.name,
      maxBytes: MAX_PROCESSED_IMAGE_BYTES,
      target: {
        width: 2000,
        height: 1200,
        fit: "cover",
        withoutEnlargement: true,
      },
    });

    await db.insert(activityMedia).values({
      title,
      subtitle,
      linkUrl,
      mediaId: asset.assetId,
      slotKey,
      sortOrder: Number.isNaN(sortOrder) ? 0 : sortOrder,
      isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await db
      .update(uploadBatches)
      .set({
        acceptedRows: 1,
        status: "completed",
        finishedAt: new Date(),
      })
      .where(eq(uploadBatches.id, batchId));

    return NextResponse.json({
      success: true,
      batchId,
      mediaId: asset.assetId,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}



