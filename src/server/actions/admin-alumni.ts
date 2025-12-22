"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { alumniEducations, alumniExperiences, alumniProfiles, uploadBatches } from "@/db/schema";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/admin-session";
import { hasScope } from "@/lib/admin-auth";
import { processAndStoreImage } from "@/lib/uploads";

const MAX_ALUMNI_PHOTO_BYTES = 1 * 1024 * 1024; // 1MB

export interface AlumniActionState {
  error?: string;
  success?: boolean;
}

const alumniSchema = z.object({
  name: z.string().min(1, "姓名必填 / Name is required"),
  cohort: z.coerce.number().int().min(1, "期数需为数字 / Cohort must be >= 1"),
  email: z.string().email("邮箱格式错误 / Invalid email"),
  gender: z.string().max(20).optional(),
  major: z.string().max(120).optional(),
  city: z.string().max(120).optional(),
  industry: z.string().max(120).optional(),
  occupation: z.string().max(180).optional(),
  websiteUrl: z
    .string()
    .url("个人链接需为合法 URL / Website must be valid URL")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  bioZh: z.string().optional(),
  bioEn: z.string().optional(),
  allowBio: z.boolean().default(true),
  allowPhoto: z.boolean().default(true),
  isArchived: z.boolean().default(false),
});

const ensureAlumniAccess = () => {
  const session = getAdminSession();
  if (!session || !hasScope(session.role, "alumni")) {
    throw new Error("无权执行该操作 / Permission denied");
  }
  return session;
};

const sanitizeBoolean = (value: FormDataEntryValue | null) => value === "on" || value === "true" || value === "1";

const parseListField = (value: string | undefined | null) =>
  (value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

const createManualBatch = async (submittedBy: string, sourceFilename: string) => {
  const [batch] = await db
    .insert(uploadBatches)
    .values({
      batchType: "alumni_manual_entry",
      sourceFilename,
      submittedBy,
      totalRows: 1,
      status: "processing",
      startedAt: new Date(),
    })
    .returning({ id: uploadBatches.id });

  return batch.id;
};

const finalizeManualBatch = async (batchId: number, acceptedRows: number, error?: string) => {
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

const processAlumniPhoto = async (file: File, submittedBy: string) => {
  if (file.size > MAX_ALUMNI_PHOTO_BYTES) {
    throw new Error("照片超过 1MB 限制 / Photo exceeds 1MB");
  }

  const batchId = await createManualBatch(submittedBy, file.name);
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await processAndStoreImage({
      buffer,
      usage: "alumni_photo",
      batchId,
      fileName: file.name,
      maxBytes: MAX_ALUMNI_PHOTO_BYTES,
      target: {
        width: 1000,
        height: 1400,
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      },
    });
    await finalizeManualBatch(batchId, 1);
    return { assetId: asset.assetId, batchId };
  } catch (error) {
    await finalizeManualBatch(batchId, 0, (error as Error).message);
    throw error;
  }
};

const parseAlumniFormData = (formData: FormData) =>
  alumniSchema.safeParse({
    name: formData.get("name"),
    cohort: formData.get("cohort"),
    email: formData.get("email"),
    gender: formData.get("gender"),
    major: formData.get("major"),
    city: formData.get("city"),
    industry: formData.get("industry"),
    occupation: formData.get("occupation"),
    websiteUrl: formData.get("website_url"),
    bioZh: formData.get("bio_zh"),
    bioEn: formData.get("bio_en"),
    allowBio: sanitizeBoolean(formData.get("allow_bio")),
    allowPhoto: sanitizeBoolean(formData.get("allow_photo")),
    isArchived: sanitizeBoolean(formData.get("is_archived")),
  });

const buildProfileValues = (data: z.infer<typeof alumniSchema>) => ({
  name: data.name.trim(),
  cohort: data.cohort,
  email: data.email.trim(),
  gender: data.gender?.trim() ?? null,
  major: data.major?.trim() ?? null,
  city: data.city?.trim() ?? null,
  industry: data.industry?.trim() ?? null,
  occupation: data.occupation?.trim() ?? null,
  websiteUrl: data.websiteUrl?.trim() ?? null,
  bioZh: data.bioZh?.trim() ?? null,
  bioEn: data.bioEn?.trim() ?? null,
  allowBio: data.allowBio,
  allowPhoto: data.allowPhoto,
  isArchived: data.isArchived,
});

const upsertProfileRelations = async (profileId: number, educations: string[], experiences: string[]) => {
  await db.delete(alumniEducations).where(eq(alumniEducations.profileId, profileId));
  await db.delete(alumniExperiences).where(eq(alumniExperiences.profileId, profileId));

  if (educations.length > 0) {
    await db.insert(alumniEducations).values(
      educations.map((description, index) => ({
        profileId,
        order: index + 1,
        description,
      })),
    );
  }

  if (experiences.length > 0) {
    await db.insert(alumniExperiences).values(
      experiences.map((description, index) => ({
        profileId,
        order: index + 1,
        description,
      })),
    );
  }
};

export const createAlumniProfileAction = async (_prev: AlumniActionState, formData: FormData): Promise<AlumniActionState> => {
  const session = ensureAlumniAccess();
  const parsed = parseAlumniFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败 / Validation failed" };
  }

  const educationList = parseListField(formData.get("educations")?.toString());
  const experienceList = parseListField(formData.get("experiences")?.toString());

  let photoReference: { assetId: number; batchId: number | null } | null = null;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    try {
      const processed = await processAlumniPhoto(file, session.username);
      photoReference = processed;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  const submissionTs = new Date();

  const [profile] = await db
    .insert(alumniProfiles)
    .values({
      ...buildProfileValues(parsed.data),
      photoAssetId: photoReference?.assetId ?? null,
      batchId: photoReference?.batchId ?? null,
      submissionEmail: parsed.data.email,
      submissionTs,
      allowBio: parsed.data.allowBio,
      allowPhoto: parsed.data.allowPhoto,
      createdAt: submissionTs,
      updatedAt: submissionTs,
    })
    .returning({ id: alumniProfiles.id });

  await upsertProfileRelations(profile.id, educationList, experienceList);
  revalidatePath("/admin/alumni");
  return { success: true };
};

export const updateAlumniProfileAction = async (
  profileId: number,
  _prev: AlumniActionState,
  formData: FormData,
): Promise<AlumniActionState> => {
  const session = ensureAlumniAccess();
  const parsed = parseAlumniFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "表单校验失败 / Validation failed" };
  }

  const educationList = parseListField(formData.get("educations")?.toString());
  const experienceList = parseListField(formData.get("experiences")?.toString());

  const file = formData.get("photo");
  let photoReference: { assetId: number; batchId: number | null } | null = null;

  if (file instanceof File && file.size > 0) {
    try {
      photoReference = await processAlumniPhoto(file, session.username);
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  await db.transaction(async (tx) => {
    await tx
      .update(alumniProfiles)
      .set({
        ...buildProfileValues(parsed.data),
        photoAssetId: photoReference?.assetId ?? undefined,
        batchId: photoReference?.batchId ?? undefined,
        submissionEmail: parsed.data.email,
        updatedAt: new Date(),
      })
      .where(eq(alumniProfiles.id, profileId));

    await tx.delete(alumniEducations).where(eq(alumniEducations.profileId, profileId));
    await tx.delete(alumniExperiences).where(eq(alumniExperiences.profileId, profileId));

    if (educationList.length > 0) {
      await tx.insert(alumniEducations).values(
        educationList.map((description, index) => ({
          profileId,
          order: index + 1,
          description,
        })),
      );
    }

    if (experienceList.length > 0) {
      await tx.insert(alumniExperiences).values(
        experienceList.map((description, index) => ({
          profileId,
          order: index + 1,
          description,
        })),
      );
    }
  });

  revalidatePath("/admin/alumni");
  return { success: true };
};

export const setAlumniArchiveStateAction = async (profileId: number, archived: boolean) => {
  ensureAlumniAccess();

  await db
    .update(alumniProfiles)
    .set({ isArchived: archived, updatedAt: new Date() })
    .where(eq(alumniProfiles.id, profileId));

  revalidatePath("/admin/alumni");
};

