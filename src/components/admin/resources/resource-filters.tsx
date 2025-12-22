import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ResourceFiltersProps {
  typeOptions: string[];
  filters: {
    type: string;
    featured: string;
    pinned: string;
  };
}

export const ResourceFilters = ({ typeOptions, filters }: ResourceFiltersProps) => {
  return (
    <form className="rounded-3xl border border-stone/40 bg-canvas/90 p-4 shadow-sm" method="get">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-ink/70" htmlFor="type">
            类型筛选 / Type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={filters.type}
            className="h-10 w-full rounded-lg border border-stone bg-canvas px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="all">全部类型</option>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-ink/70" htmlFor="featured">
            Featured
          </label>
          <select
            id="featured"
            name="featured"
            defaultValue={filters.featured}
            className="h-10 w-full rounded-lg border border-stone bg-canvas px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="all">全部</option>
            <option value="true">仅显示推荐</option>
            <option value="false">不显示推荐</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-ink/70" htmlFor="pinned">
            Pinned
          </label>
          <select
            id="pinned"
            name="pinned"
            defaultValue={filters.pinned}
            className="h-10 w-full rounded-lg border border-stone bg-canvas px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="all">全部</option>
            <option value="true">仅显示置顶</option>
            <option value="false">不显示置顶</option>
          </select>
        </div>
        <div className="flex items-end gap-3">
          <Button className="flex-1" type="submit">
            筛选
          </Button>
          <Button asChild type="button" variant="outline">
            <Link href="/admin/resources">重置</Link>
          </Button>
        </div>
      </div>
    </form>
  );
};

