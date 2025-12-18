import { count, desc, eq, isNotNull, sql } from "drizzle-orm";

import { AlumniCardList } from "@/components/alumni/alumni-card-list";
import { alumniProfiles, mediaAssets } from "@/db/schema";
import { db } from "@/lib/db";
import { getSignedMediaUrl } from "@/lib/storage";

interface AlumniDataProps {
  cohort: number | null;
  take: number;
}

export const AlumniData = async ({ cohort, take }: AlumniDataProps) => {
  if (cohort === null) {
    return (
      <div className="rounded-xl border border-dashed border-stone bg-canvas/pure p-6 text-sm text-ink/70">
        请选择期数 / Please select a cohort
      </div>
    );
  }

  const photoCount =
    (
      await db
        .select({ value: count() })
        .from(alumniProfiles)
        .where(sql`${alumniProfiles.cohort} = ${cohort} and ${alumniProfiles.photoAssetId} is not null`)
    )[0]?.value ?? 0;

  const photoTake = Math.min(take, photoCount);
  const noPhotoTake = Math.max(0, take - photoTake);

  const photoRows = await db
    .select({
      id: alumniProfiles.id,
      name: alumniProfiles.name,
      cohort: alumniProfiles.cohort,
      major: alumniProfiles.major,
      bioZh: alumniProfiles.bioZh,
      storagePath: mediaAssets.storagePath,
      websiteUrl: alumniProfiles.websiteUrl,
    })
    .from(alumniProfiles)
    .innerJoin(mediaAssets, eq(alumniProfiles.photoAssetId, mediaAssets.id))
    .where(eq(alumniProfiles.cohort, cohort))
    .orderBy(desc(alumniProfiles.submissionTs))
    .limit(photoTake);

  const noPhotoRows =
    noPhotoTake > 0
      ? await db
          .select({
            id: alumniProfiles.id,
            name: alumniProfiles.name,
            cohort: alumniProfiles.cohort,
            major: alumniProfiles.major,
            bioZh: alumniProfiles.bioZh,
            websiteUrl: alumniProfiles.websiteUrl,
          })
          .from(alumniProfiles)
          .where(sql`${alumniProfiles.cohort} = ${cohort} and ${alumniProfiles.photoAssetId} is null`)
          .orderBy(desc(alumniProfiles.submissionTs))
          .limit(noPhotoTake)
      : [];

  const photoWithUrls = await Promise.all(
    photoRows.map(async (row) => {
      try {
        const signed = await getSignedMediaUrl(row.storagePath, 60 * 60);
        return { ...row, photoUrl: signed };
      } catch {
        return { ...row, photoUrl: null as string | null };
      }
    }),
  );

  return (
    <AlumniCardList
      noPhotoCards={noPhotoRows.map((row) => ({
        id: row.id,
        name: row.name,
        cohort: row.cohort,
        major: row.major,
        bioZh: row.bioZh,
        websiteUrl: row.websiteUrl,
      }))}
      photoCards={photoWithUrls.map((row) => ({
        id: row.id,
        name: row.name,
        cohort: row.cohort,
        major: row.major,
        bioZh: row.bioZh,
        photoUrl: row.photoUrl,
        websiteUrl: row.websiteUrl,
      }))}
    />
  );
};


