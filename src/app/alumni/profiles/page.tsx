import { Suspense } from "react";

import { and, count, eq, isNotNull } from "drizzle-orm";

import { AlumniData } from "@/components/alumni/alumni-data";
import { CohortFilter } from "@/components/alumni/cohort-filter";
import { ShowMoreButton } from "@/components/alumni/show-more-button";
import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { alumniProfiles } from "@/db/schema";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface AlumniProfilesPageProps {
  searchParams?: {
    cohort?: string;
    take?: string;
  };
}

const parsePositiveInt = (value: string | undefined | null) => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

export default async function AlumniProfilesPage({ searchParams }: AlumniProfilesPageProps) {
  const cohortsRaw = await db
    .selectDistinct({ cohort: alumniProfiles.cohort })
    .from(alumniProfiles)
    .where(and(isNotNull(alumniProfiles.cohort), eq(alumniProfiles.isArchived, false)));

  const cohorts = cohortsRaw
    .map((item) => item.cohort)
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => b - a);

  const defaultCohort = cohorts[0] ?? null;
  const cohortFilter = parsePositiveInt(searchParams?.cohort ?? null) ?? defaultCohort;
  const take = Math.max(6, parsePositiveInt(searchParams?.take ?? null) ?? 6);
  const totalCount =
    cohortFilter !== null
      ? (
          await db
            .select({ value: count() })
            .from(alumniProfiles)
            .where(and(eq(alumniProfiles.cohort, cohortFilter), eq(alumniProfiles.isArchived, false)))
        )[0]?.value ?? 0
      : 0;

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[
            { label: "首页", href: "/" },
            { label: "学员风采", href: "/alumni" },
            { label: "各期学员", href: "/alumni/profiles" },
          ]}
          subtitle="按期数浏览学员名录；每次加载 6 个，点击“显示更多”逐步展开。"
          title="各期学员 / Alumni Profiles"
        />

        <Section
          description="有照片学员优先展示；无照片学员会统一排列在列表底部（不影响入库）。"
          title="按期数查看 / Browse by Cohort"
        >
          <Panel>
            <CohortFilter cohorts={cohorts} currentCohort={cohortFilter} />

            <div className="mt-6">
              <Suspense
                fallback={
                  <div className="flex min-h-[400px] items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-12 w-12 animate-spin rounded-full border-4 border-stone/30 border-t-primary" />
                      <p className="text-sm text-ink/60">加载中 / Loading...</p>
                    </div>
                  </div>
                }
              >
                <AlumniData cohort={cohortFilter} take={take} />
              </Suspense>
            </div>

            {cohortFilter !== null ? (
              <ShowMoreButton cohort={cohortFilter} currentTake={take} totalCount={totalCount} />
            ) : null}
          </Panel>
        </Section>
      </PageEnter>
    </PageShell>
  );
}




