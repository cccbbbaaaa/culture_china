import { Suspense } from "react";
import { redirect } from "next/navigation";

import { ResourceFilters } from "@/components/admin/resources/resource-filters";
import { ResourceCreatePanel } from "@/components/admin/resources/resource-create-panel";
import { ResourceTable } from "@/components/admin/resources/resource-table";
import { hasScope } from "@/lib/admin-auth";
import { getAdminSession } from "@/lib/admin-session";
import { RESOURCE_TYPE_MAP } from "@/lib/resource-types";

interface AdminResourcesPageProps {
  searchParams?: {
    type?: string;
    featured?: string;
    pinned?: string;
    page?: string;
  };
}

const parsePage = (value: string | undefined) => {
  const parsed = Number.parseInt(value ?? "1", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
};

const ResourceTableFallback = () => (
  <div className="rounded-3xl border border-dashed border-stone/40 bg-stone/10 p-6 text-sm text-ink/60">资源列表加载中...</div>
);

export default async function AdminResourcesPage({ searchParams }: AdminResourcesPageProps) {
  const session = getAdminSession();

  if (!session || !hasScope(session.role, "resources")) {
    redirect("/admin");
  }

  const typeFilter = searchParams?.type && searchParams.type !== "all" ? searchParams.type : null;
  const featuredFilter = searchParams?.featured && searchParams.featured !== "all" ? searchParams.featured : null;
  const pinnedFilter = searchParams?.pinned && searchParams.pinned !== "all" ? searchParams.pinned : null;
  const page = parsePage(searchParams?.page);
  const typeOptions = Object.keys(RESOURCE_TYPE_MAP);

  const preservedParams = {
    type: searchParams?.type,
    featured: searchParams?.featured,
    pinned: searchParams?.pinned,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-ink">外链资源管理 · Resources</h1>
        <p className="text-sm text-ink/70">新增 / 编辑公众号推文，控制首页推荐与置顶。</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <ResourceFilters
          typeOptions={typeOptions}
          filters={{
            type: typeFilter ?? "all",
            featured: featuredFilter ?? "all",
            pinned: pinnedFilter ?? "all",
          }}
        />
        <div className="rounded-3xl border border-stone/40 bg-canvas/90 p-4 shadow-sm">
          <p className="text-sm font-serif font-semibold text-ink">新增外链资源</p>
          <p className="text-xs text-ink/60">点击展开弹窗，填表后保存。</p>
          <div className="mt-4">
            <ResourceCreatePanel typeOptions={typeOptions} />
          </div>
        </div>
      </div>
      <Suspense fallback={<ResourceTableFallback />}>
        <ResourceTable
          filters={{ typeFilter, featuredFilter, pinnedFilter }}
          page={page}
          typeOptions={typeOptions}
          searchParams={preservedParams}
        />
      </Suspense>
    </div>
  );
}

