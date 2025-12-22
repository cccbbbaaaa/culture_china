import { Suspense } from "react";
import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";

import { AlumniCreatePanel } from "@/components/admin/alumni/alumni-create-panel";
import { AlumniFilters } from "@/components/admin/alumni/alumni-filters";
import { AlumniTable } from "@/components/admin/alumni/alumni-table";
import { hasScope } from "@/lib/admin-auth";
import { getAdminSession } from "@/lib/admin-session";
import { db } from "@/lib/db";
import { alumniProfiles } from "@/db/schema";

interface AdminAlumniPageProps {
  searchParams?: {
    cohort?: string;
    q?: string;
    showArchived?: string;
    page?: string;
  };
}

const parseCohort = (value: string | undefined) => {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const parsePage = (value: string | undefined) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const AlumniTableFallback = () => (
  <div className="rounded-3xl border border-dashed border-stone/40 bg-stone/10 p-6 text-sm text-ink/60">学员列表加载中...</div>
);

export default async function AdminAlumniPage({ searchParams }: AdminAlumniPageProps) {
  const session = getAdminSession();
  if (!session || !hasScope(session.role, "alumni")) {
    redirect("/admin");
  }

  const cohortsRaw = await db
    .selectDistinct({ cohort: alumniProfiles.cohort })
    .from(alumniProfiles)
    .where(eq(alumniProfiles.isArchived, false))
    .orderBy(desc(alumniProfiles.cohort));

  const cohortOptions = cohortsRaw
    .map((item) => item.cohort)
    .filter((value): value is number => typeof value === "number")
    .sort((a, b) => b - a);

  const cohortFilter = parseCohort(searchParams?.cohort);
  const query = searchParams?.q?.trim() ?? "";
  const showArchived = searchParams?.showArchived === "true";
  const page = parsePage(searchParams?.page);

  const preservedParams = {
    cohort: searchParams?.cohort,
    q: searchParams?.q,
    showArchived: searchParams?.showArchived,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-semibold text-ink">学员风采管理 · Alumni Profiles</h1>
        <p className="text-sm text-ink/70">支持查询、归档、手动录入与照片替换。</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <AlumniFilters
          cohorts={cohortOptions}
          filters={{
            cohort: cohortFilter,
            query,
            showArchived,
          }}
        />

        <div className="rounded-3xl border border-stone/40 bg-canvas/90 p-4 shadow-sm">
          <p className="text-sm font-serif font-semibold text-ink">新增学员档案</p>
          <p className="text-xs text-ink/60">点击按钮弹出表单，支持上传照片。</p>
          <div className="mt-4">
            <AlumniCreatePanel defaultCohort={cohortFilter ?? cohortOptions[0]} />
          </div>
        </div>
      </div>

      <Suspense fallback={<AlumniTableFallback />}>
        <AlumniTable filters={{ cohortFilter, query, showArchived }} page={page} searchParams={preservedParams} />
      </Suspense>
    </div>
  );
}

