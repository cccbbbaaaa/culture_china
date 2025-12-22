"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

const buildHref = (basePath: string, searchParams: Record<string, string | undefined>, targetPage: number) => {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value) {
      params.set(key, value);
    }
  }

  if (targetPage <= 1) {
    params.delete("page");
  } else {
    params.set("page", targetPage.toString());
  }

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
};

export const PaginationControls = ({ page, hasPrev, hasNext, basePath, searchParams }: PaginationControlsProps) => {
  if (!hasPrev && !hasNext) {
    return null;
  }

  return (
    <div className="mt-6 flex items-center justify-end gap-3">
      <Button asChild disabled={!hasPrev} size="sm" variant="outline">
        <Link href={buildHref(basePath, searchParams, page - 1)}>上一页</Link>
      </Button>
      <span className="text-sm text-ink/70">第 {page} 页</span>
      <Button asChild disabled={!hasNext} size="sm" variant="outline">
        <Link href={buildHref(basePath, searchParams, page + 1)}>下一页</Link>
      </Button>
    </div>
  );
};

