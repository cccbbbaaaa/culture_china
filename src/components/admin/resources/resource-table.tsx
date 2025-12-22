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
  const whereClause =
    conditions.length === 0 ? undefined : conditions.length === 1 ? conditions[0] : and(...conditions);

  const baseQuery = db.select().from(externalResources);
  const filteredQuery = whereClause ? baseQuery.where(whereClause) : baseQuery;

  const rows = await filteredQuery
    .orderBy(desc(externalResources.updatedAt))
    .limit(PAGE_SIZE + 1)
    .offset(offset);
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

