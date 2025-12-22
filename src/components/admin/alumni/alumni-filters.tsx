import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AlumniFiltersProps {
  cohorts: number[];
  filters: {
    cohort: number | null;
    query: string;
    showArchived: boolean;
  };
}

export const AlumniFilters = ({ cohorts, filters }: AlumniFiltersProps) => {
  return (
    <form className="rounded-3xl border border-stone/50 bg-canvas/90 p-6 shadow-sm" method="get">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80" htmlFor="cohort">
            期数 / Cohort
          </label>
          <select
            className="h-10 w-full rounded-md border border-stone bg-canvas px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            defaultValue={filters.cohort?.toString() ?? ""}
            id="cohort"
            name="cohort"
          >
            <option value="">全部期数</option>
            {cohorts.map((cohort) => (
              <option key={cohort} value={cohort.toString()}>
                第 {cohort} 期
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-ink/80" htmlFor="q">
            搜索 / Keyword
          </label>
          <Input defaultValue={filters.query} id="q" name="q" placeholder="姓名、邮箱、行业、城市" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-ink/80">归档 / Archived</label>
          <div className="flex h-10 items-center gap-2 rounded-md border border-stone px-3 text-sm text-ink/80">
            <input defaultChecked={filters.showArchived} id="showArchived" name="showArchived" type="checkbox" value="true" />
            <label className="cursor-pointer select-none" htmlFor="showArchived">
              包含已归档
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit">筛选</Button>
        <Button asChild type="button" variant="ghost">
          <Link href="/admin/alumni">重置筛选</Link>
        </Button>
      </div>
    </form>
  );
};

