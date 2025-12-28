import sharp from "sharp";

import { db } from "@/lib/db";
import { mediaAssets } from "@/db/schema";
import { getSupabaseAdminClient } from "@/lib/storage";
import { env } from "@/lib/env";

const DEFAULT_BUCKET = "media";

const toSafeFileName = (value: string) => {
  return value
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
};

interface ProcessImageOptions {
  buffer: Buffer;
  usage: string;
  batchId: number;
  fileName: string;
  maxBytes: number;
  format?: "jpeg" | "webp";
  target?: {
    width?: number;
    height?: number;
    fit?: keyof sharp.FitEnum;
    withoutEnlargement?: boolean;
    background?: sharp.Color;
  };
}

const encodeImage = async (
  buffer: Buffer,
  format: "jpeg" | "webp",
  target: ProcessImageOptions["target"],
  quality: number,
) => {
  let transformer = sharp(buffer).rotate();

  if (target) {
    transformer = transformer.resize({
      width: target.width,
      height: target.height,
      fit: target.fit,
      withoutEnlargement: target.withoutEnlargement,
      background: target.background,
    });
  }

  if (format === "webp") {
    return transformer.webp({ quality }).toBuffer();
  }

  return transformer.jpeg({ quality }).toBuffer();
};

export const processAndStoreImage = async (options: ProcessImageOptions) => {
  const supabase = getSupabaseAdminClient();
  const bucket = env.SUPABASE_STORAGE_BUCKET || DEFAULT_BUCKET;
  const format = options.format ?? "jpeg";

  let quality = 82;
  let processedBuffer = await encodeImage(options.buffer, format, options.target, quality);
  while (processedBuffer.length > options.maxBytes && quality > 50) {
    quality -= 8;
    processedBuffer = await encodeImage(options.buffer, format, options.target, quality);
  }

  if (processedBuffer.length > options.maxBytes) {
    throw new Error(`图片仍大于限制，请更换更小文件 (>${Math.round(processedBuffer.length / 1024)} KB)。`);
  }

  const safeName = toSafeFileName(options.fileName);
  const storagePath = `${options.usage}/${options.batchId}/${Date.now()}-${safeName || "image"}.${format === "jpeg" ? "jpg" : "webp"}`;

  const { error } = await supabase.storage.from(bucket).upload(storagePath, processedBuffer, {
    cacheControl: "3600",
    upsert: true,
    contentType: format === "jpeg" ? "image/jpeg" : "image/webp",
  });

  if (error) {
    throw new Error(`Supabase 上传失败：${error.message}`);
  }

  const metadata = await sharp(processedBuffer).metadata();
  const width = metadata.width ?? null;
  const height = metadata.height ?? null;
  const ratio = width && height ? Number((width / height).toFixed(3)) : null;

  const [asset] = await db
    .insert(mediaAssets)
    .values({
      storagePath,
      width,
      height,
      fileSize: processedBuffer.length,
      ratio,
      usage: options.usage,
      batchId: options.batchId,
    })
    .returning({ id: mediaAssets.id });

  return {
    assetId: asset.id,
    storagePath,
    width,
    height,
    fileSize: processedBuffer.length,
  };
};




