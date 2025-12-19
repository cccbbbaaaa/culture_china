"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface CohortFilterProps {
  cohorts: number[];
  currentCohort: number | null;
}

export const CohortFilter = ({ cohorts, currentCohort }: CohortFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleChange = (cohort: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("cohort", cohort.toString());
      params.set("take", "6");
      router.push(`/alumni/profiles?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink/70" htmlFor="cohort-select">
        选择期数 / Select cohort
      </label>
      <div className="relative w-full max-w-xs">
        <select
          id="cohort-select"
          className="w-full appearance-none rounded-xl border border-stone bg-canvas/pure px-4 py-2 text-sm text-ink shadow-sm transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
          defaultValue={currentCohort ?? ""}
          disabled={isPending}
          onChange={(event) => {
            const value = Number.parseInt(event.target.value, 10);
            if (!Number.isNaN(value)) {
              handleChange(value);
            }
          }}
        >
          {currentCohort === null ? <option value="">选择期数</option> : null}
          {cohorts.map((cohort) => (
            <option key={cohort} value={cohort}>
              第 {cohort} 期
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-ink/50">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center pt-2">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone/30 border-t-primary" />
            <p className="text-xs text-ink/60">加载中 / Loading...</p>
          </div>
        </div>
      ) : null}
    </div>
  );
};



