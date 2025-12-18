"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";

interface CohortFilterProps {
  cohorts: number[];
  currentCohort: number | null;
}

export const CohortFilter = ({ cohorts, currentCohort }: CohortFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleCohortClick = (cohort: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("cohort", cohort.toString());
      params.set("take", "6");
      router.push(`/alumni/profiles?${params.toString()}`);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {cohorts.slice(0, 28).map((c) => (
          <button
            key={c}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              currentCohort === c
                ? "border-primary bg-primary text-canvas"
                : "border-stone bg-canvas/70 text-ink/70 hover:border-stone/80 hover:bg-stone/20 hover:text-ink",
              isPending && "opacity-60",
            )}
            disabled={isPending}
            onClick={() => handleCohortClick(c)}
            type="button"
          >
            第 {c} 期
          </button>
        ))}
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



