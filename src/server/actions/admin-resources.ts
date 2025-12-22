"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { externalResources } from "@/db/schema";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import { hasScope } from "@/lib/admin-auth";

export interface ResourceActionState {
  error?: string;
  success?: boolean;
}

const ACCESS_DENIED_MESSAGE = "无权执行该操作 / Permission denied";

const resourceSchema = z.object({
  title: z.string().min(1, "标题必填 / Title is required"),
  type: z.string().min(1, "请选择类别 / Type is required"),
  summary: z.string().optional(),
  url: z.string().url("请输入合法链接 / URL is invalid"),
  publishedAt: z.string().optional(),
  year: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPinned: z.boolean().default(false),
});

const ensureResourceAccess = () => {
  const session = getAdminSession();
  if (!session || !hasScope(session.role, "resources")) {
    throw new Error(ACCESS_DENIED_MESSAGE);
  }
  return session;
};

const sanitizeBoolean = (value: FormDataEntryValue | null) => value === "on" || value === "true" || value === "1";

const parseFormData = (formData: FormData) =>
  resourceSchema.safeParse({
    title: formData.get("title")?.toString() ?? "",
    type: formData.get("type")?.toString() ?? "",
    summary: formData.get("summary")?.toString(),
    url: formData.get("url")?.toString() ?? "",
    publishedAt: formData.get("published_at")?.toString(),
    year: formData.get("year")?.toString(),
    isFeatured: sanitizeBoolean(formData.get("is_featured")),
    isPinned: sanitizeBoolean(formData.get("is_pinned")),
  });

const buildResourceValues = (data: z.infer<typeof resourceSchema>) => {
  const summary = data.summary?.trim() || null;

  let publishedAt: Date | null = null;
  if (data.publishedAt) {
    const parsed = new Date(data.publishedAt);
    if (Number.isNaN(parsed.getTime())) {
      return { error: "发布日期格式不正确 / Invalid publish date" } as const;
    }
    publishedAt = parsed;
  }

  let year: number | null = null;
  if (data.year && data.year.trim().length > 0) {
    const parsedYear = Number.parseInt(data.year, 10);
    if (Number.isNaN(parsedYear)) {
      return { error: "年份必须为数字 / Year must be a number" } as const;
    }
    year = parsedYear;
  } else if (publishedAt) {
    year = publishedAt.getFullYear();
  }

  return {
    values: {
      title: data.title.trim(),
      type: data.type,
      summary,
      url: data.url.trim(),
      publishedAt,
      year,
      isFeatured: data.isFeatured,
      isPinned: data.isPinned,
      updatedAt: new Date(),
    },
  } as const;
};

const isDuplicateError = (error: unknown) => {
  return typeof error === "object" && error !== null && "code" in error && (error as { code: string }).code === "23505";
};

export const createResourceAction = async (_prev: ResourceActionState, formData: FormData): Promise<ResourceActionState> => {
  ensureResourceAccess();
  const parsed = parseFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败 / Validation failed" };
  }

  const { values, error } = buildResourceValues(parsed.data);
  if (error) {
    return { error };
  }

  try {
    await db.insert(externalResources).values({
      ...values,
      createdAt: new Date(),
    });
  } catch (err) {
    if (isDuplicateError(err)) {
      return { error: "该链接已存在，请勿重复上传。" };
    }
    throw err;
  }

  revalidatePath("/admin/resources");
  return { success: true };
};

export const updateResourceAction = async (
  resourceId: number,
  _prev: ResourceActionState,
  formData: FormData,
): Promise<ResourceActionState> => {
  ensureResourceAccess();

  const parsed = parseFormData(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败 / Validation failed" };
  }

  const { values, error } = buildResourceValues(parsed.data);
  if (error) {
    return { error };
  }

  try {
    await db
      .update(externalResources)
      .set(values)
      .where(eq(externalResources.id, resourceId));
  } catch (err) {
    if (isDuplicateError(err)) {
      return { error: "该链接已存在，请勿重复上传。" };
    }
    throw err;
  }

  revalidatePath("/admin/resources");
  return { success: true };
};

export const deleteResourceAction = async (resourceId: number, _prev: ResourceActionState): Promise<ResourceActionState> => {
  ensureResourceAccess();
  await db.delete(externalResources).where(eq(externalResources.id, resourceId));
  revalidatePath("/admin/resources");
  return { success: true };
};

