import { and, desc, eq } from "drizzle-orm";

import { ResourceList } from "@/components/admin/resources/resource-list";
import { PaginationControls } from "@/components/admin/pagination-controls";
import { db } from "@/lib/db";
import { externalResources } from "@/db/schema";

const PAGE_SIZE = 10;

interface ResourceTableProps {
  filters: {
    typeFilter: string | null;
    featuredFilter: string | null;
    pinnedFilter: string | null;
  };
  page: number;
  typeOptions: string[];
  searchParams: Record<string, string | undefined>;
}

export const ResourceTable = async ({ filters, page, typeOptions, searchParams }: ResourceTableProps) => {
  const { typeFilter, featuredFilter, pinnedFilter } = filters;
  const conditions = [];

  if (typeFilter) {
    conditions.push(eq(externalResources.type, typeFilter));
  }
  if (featuredFilter) {
    conditions.push(eq(externalResources.isFeatured, featuredFilter === "true"));
  }
  if (pinnedFilter) {
    conditions.push(eq(externalResources.isPinned, pinnedFilter === "true"));
  }

  const offset = (page - 1) * PAGE_SIZE;
  let query = db
    .select()
    .from(externalResources)
    .orderBy(desc(externalResources.updatedAt))
    .limit(PAGE_SIZE + 1)
    .offset(offset);

  if (conditions.length === 1) {
    query = query.where(conditions[0]);
  } else if (conditions.length > 1) {
    query = query.where(and(...conditions));
  }

  const rows = await query;
  const resources = rows.slice(0, PAGE_SIZE);
  const hasNext = rows.length > PAGE_SIZE;
  const hasPrev = page > 1;

  return (
    <>
      <ResourceList resources={resources} typeOptions={typeOptions} />
      <PaginationControls
        page={page}
        hasPrev={hasPrev}
        hasNext={hasNext}
        basePath="/admin/resources"
        searchParams={searchParams}
      />
    </>
  );
};

