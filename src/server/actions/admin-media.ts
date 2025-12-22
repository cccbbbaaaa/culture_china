"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { activityMedia, uploadBatches } from "@/db/schema";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import { hasScope } from "@/lib/admin-auth";
import { processAndStoreImage } from "@/lib/uploads";

export interface MediaActionState {
  error?: string;
  success?: boolean;
}

const MAX_PROCESSED_IMAGE_BYTES = 1 * 1024 * 1024; // 1MB
const MAX_SOURCE_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB hard limit
const ALLOWED_SLOTS = ["home_hero", "activities_gallery"] as const;

const mediaSchema = z.object({
  slotKey: z.enum(ALLOWED_SLOTS, {
    errorMap: () => ({ message: "slot_key 非法 / Slot key invalid" }),
  }),
  title: z.string().min(1, "标题必填 / Title is required"),
  subtitle: z.string().optional(),
  linkUrl: z
    .string()
    .url("链接格式不正确 / URL invalid")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

const sanitizeBoolean = (value: FormDataEntryValue | null) => value === "on" || value === "true" || value === "1";

const parseMediaForm = (formData: FormData) =>
  mediaSchema.safeParse({
    slotKey: formData.get("slot_key")?.toString(),
    title: formData.get("title")?.toString() ?? "",
    subtitle: formData.get("subtitle")?.toString(),
    linkUrl: formData.get("link_url")?.toString(),
    sortOrder: formData.get("sort_order")?.toString() ?? "0",
    isActive: sanitizeBoolean(formData.get("is_active")),
  });

const ensureMediaAccess = () => {
  const session = getAdminSession();
  if (!session || !hasScope(session.role, "media")) {
    throw new Error("无权执行该操作 / Permission denied");
  }
  return session;
};

const createBatch = async (submittedBy: string, sourceFilename: string) => {
  const [batch] = await db
    .insert(uploadBatches)
    .values({
      batchType: "activity_media",
      sourceFilename,
      submittedBy,
      totalRows: 1,
      status: "processing",
      startedAt: new Date(),
    })
    .returning({ id: uploadBatches.id });

  return batch.id;
};

const finalizeBatch = async (batchId: number, acceptedRows: number, error?: string) => {
  await db
    .update(uploadBatches)
    .set({
      acceptedRows,
      status: error ? "failed" : "completed",
      notes: error,
      finishedAt: new Date(),
    })
    .where(eq(uploadBatches.id, batchId));
};

export const createActivityMediaAction = async (_prev: MediaActionState, formData: FormData): Promise<MediaActionState> => {
  const session = ensureMediaAccess();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return { error: "请上传轮播图片 / Image is required" };
  }

  if (image.size > MAX_SOURCE_IMAGE_BYTES) {
    return { error: "原始图片超过 8MB 限制，请压缩后重试。" };
  }

  const parsed = parseMediaForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败 / Validation failed" };
  }

  const batchId = await createBatch(session.username, image.name);

  try {
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
      title: parsed.data.title.trim(),
      subtitle: parsed.data.subtitle?.trim() || null,
      linkUrl: parsed.data.linkUrl?.trim() ?? null,
      mediaId: asset.assetId,
      slotKey: parsed.data.slotKey,
      sortOrder: parsed.data.sortOrder,
      isActive: parsed.data.isActive,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await finalizeBatch(batchId, 1);
    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    await finalizeBatch(batchId, 0, (error as Error).message);
    return { error: (error as Error).message };
  }
};

export const updateActivityMediaAction = async (
  mediaId: number,
  _prev: MediaActionState,
  formData: FormData,
): Promise<MediaActionState> => {
  const session = ensureMediaAccess();
  const parsed = parseMediaForm(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败 / Validation failed" };
  }

  const image = formData.get("image");
  let newMediaId: number | undefined;
  let batchId: number | null = null;

  try {
    if (image instanceof File && image.size > 0) {
      if (image.size > MAX_SOURCE_IMAGE_BYTES) {
        return { error: "原始图片超过 8MB 限制，请压缩后重试。" };
      }

      batchId = await createBatch(session.username, image.name);
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
      newMediaId = asset.assetId;
      await finalizeBatch(batchId, 1);
    }

    await db
      .update(activityMedia)
      .set({
        title: parsed.data.title.trim(),
        subtitle: parsed.data.subtitle?.trim() || null,
        linkUrl: parsed.data.linkUrl?.trim() ?? null,
        slotKey: parsed.data.slotKey,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
        mediaId: newMediaId ?? undefined,
        updatedAt: new Date(),
      })
      .where(eq(activityMedia.id, mediaId));

    revalidatePath("/admin/media");
    return { success: true };
  } catch (error) {
    if (batchId) {
      await finalizeBatch(batchId, 0, (error as Error).message);
    }
    return { error: (error as Error).message };
  }
};

export const deleteActivityMediaAction = async (mediaId: number, _prev: MediaActionState): Promise<MediaActionState> => {
  ensureMediaAccess();
  await db.delete(activityMedia).where(eq(activityMedia.id, mediaId));
  revalidatePath("/admin/media");
  return { success: true };
};

