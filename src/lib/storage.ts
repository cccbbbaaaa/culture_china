import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

let supabaseClient: SupabaseClient | null = null;

export const getSupabaseAdminClient = () => {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Supabase Storage credentials are missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  if (!supabaseClient) {
    supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }

  return supabaseClient;
};

export const getSupabaseBucketName = () => {
  return env.SUPABASE_STORAGE_BUCKET || "media";
};

/**
 * 获取媒体资源的可访问 URL（优先 Signed URL）
 * Get an accessible media URL (prefer signed URL).
 *
 * - 默认生成 1 小时有效期的 Signed URL，兼容私有 bucket
 * - 仅在服务端调用 / Server-side only
 */
export const getSignedMediaUrl = async (storagePath: string, expiresInSeconds = 60 * 60) => {
  const supabase = getSupabaseAdminClient();
  const bucket = getSupabaseBucketName();

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(storagePath, expiresInSeconds);
  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed URL: ${error?.message ?? "unknown error"}`);
  }

  return data.signedUrl;
};



