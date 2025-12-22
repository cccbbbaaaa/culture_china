import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";

import { AlumniList } from "@/components/admin/alumni/alumni-list";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { db } from "@/lib/db";
import { alumniEducations, alumniExperiences, alumniProfiles } from "@/db/schema";

const PAGE_SIZE = 24;

interface AlumniTableProps {
  filters: {
    cohortFilter: number | null;
    query: string;
    showArchived: boolean;
  };
  page: number;
  searchParams: Record<string, string | undefined>;
}

export const AlumniTable = async ({ filters, page, searchParams }: AlumniTableProps) => {
  const { cohortFilter, query, showArchived } = filters;
  const conditions = [];
  if (!showArchived) {
    conditions.push(eq(alumniProfiles.isArchived, false));
  }
  if (cohortFilter) {
    conditions.push(eq(alumniProfiles.cohort, cohortFilter));
  }
  if (query) {
    const likeValue = `%${query}%`;
    conditions.push(
      or(
        ilike(alumniProfiles.name, likeValue),
        ilike(alumniProfiles.email, likeValue),
        ilike(alumniProfiles.industry, likeValue),
        ilike(alumniProfiles.city, likeValue),
      ),
    );
  }

  const offset = (page - 1) * PAGE_SIZE;
  let profileQuery = db
    .select({
      id: alumniProfiles.id,
      name: alumniProfiles.name,
      cohort: alumniProfiles.cohort,
      email: alumniProfiles.email,
      gender: alumniProfiles.gender,
      major: alumniProfiles.major,
      city: alumniProfiles.city,
      industry: alumniProfiles.industry,
      occupation: alumniProfiles.occupation,
      websiteUrl: alumniProfiles.websiteUrl,
      bioZh: alumniProfiles.bioZh,
      bioEn: alumniProfiles.bioEn,
      allowBio: alumniProfiles.allowBio,
      allowPhoto: alumniProfiles.allowPhoto,
      isArchived: alumniProfiles.isArchived,
      updatedAt: alumniProfiles.updatedAt,
      submissionTs: alumniProfiles.submissionTs,
      photoAssetId: alumniProfiles.photoAssetId,
    })
    .from(alumniProfiles)
    .orderBy(desc(alumniProfiles.updatedAt))
    .limit(PAGE_SIZE + 1)
    .offset(offset);

  if (conditions.length === 1) {
    profileQuery = profileQuery.where(conditions[0]);
  } else if (conditions.length > 1) {
    profileQuery = profileQuery.where(and(...conditions));
  }

  const rows = await profileQuery;
  const profiles = rows.slice(0, PAGE_SIZE);
  const profileIds = profiles.map((profile) => profile.id);

  const [educationRows, experienceRows] =
    profileIds.length > 0
      ? await Promise.all([
          db
            .select()
            .from(alumniEducations)
            .where(inArray(alumniEducations.profileId, profileIds))
            .orderBy(alumniEducations.profileId, alumniEducations.order),
          db
            .select()
            .from(alumniExperiences)
            .where(inArray(alumniExperiences.profileId, profileIds))
            .orderBy(alumniExperiences.profileId, alumniExperiences.order),
        ])
      : [[], []];

  const educationMap = educationRows.reduce<Record<number, typeof educationRows[number][]>>((acc, row) => {
    if (!acc[row.profileId]) acc[row.profileId] = [];
    acc[row.profileId].push(row);
    return acc;
  }, {});

  const experienceMap = experienceRows.reduce<Record<number, typeof experienceRows[number][]>>((acc, row) => {
    if (!acc[row.profileId]) acc[row.profileId] = [];
    acc[row.profileId].push(row);
    return acc;
  }, {});

  const hasPrev = page > 1;
  const hasNext = rows.length > PAGE_SIZE;

  return (
    <>
      <AlumniList profiles={profiles} educations={educationMap} experiences={experienceMap} />
      <PaginationControls basePath="/admin/alumni" page={page} hasPrev={hasPrev} hasNext={hasNext} searchParams={searchParams} />
    </>
  );
};

