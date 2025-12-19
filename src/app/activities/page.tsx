import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { desc, inArray } from "drizzle-orm";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { externalResources } from "@/db/schema";
import { db } from "@/lib/db";
import { getResourceTypeLabel, getTypesBySection } from "@/lib/resource-types";

const ACTIVITY_TYPES = getTypesBySection("activities");
const PAGE_SIZE = 6;

export const dynamic = "force-dynamic";

interface ActivitiesPageProps {
  searchParams?: {
    page?: string;
  };
}

const formatDate = (value: Date | string | null) => {
  if (!value) return "日期待定";
  const date = value instanceof Date ? value : new Date(value);
  return Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(date);
};

export default async function ActivitiesPage({ searchParams }: ActivitiesPageProps) {
  const page = Math.max(1, Number.parseInt(searchParams?.page ?? "1", 10) || 1);

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "特色活动", href: "/activities" }]}
          subtitle="展现项目活力与对外交流成果；图片可作为图库入口（当前为骨架占位）。"
          title="特色活动 / Featured Activities"
        />

        <Section description="已与 external_resources 表对接，可通过后台推文控制展示与排序。" title="活动列表 / Activity Feed">
          <Suspense fallback={<ListFallback message="活动内容加载中..." />}>
            <ActivitiesFeed page={page} />
          </Suspense>
        </Section>

        <Section description="访学交流建议用 Gallery 形式展示精彩瞬间。" title="图库 / Gallery">
          <Panel className="border-dashed">
            <p className="text-sm text-ink/70">预留：瀑布流/灯箱预览、按年份筛选等。</p>
          </Panel>
        </Section>
      </PageEnter>
    </PageShell>
  );
}

const ActivitiesFeed = async ({ page }: { page: number }) => {
  const offset = (page - 1) * PAGE_SIZE;
  const rows = ACTIVITY_TYPES.length
    ? await db
        .select({
          title: externalResources.title,
          summary: externalResources.summary,
          url: externalResources.url,
          type: externalResources.type,
          publishedAt: externalResources.publishedAt,
        })
        .from(externalResources)
        .where(inArray(externalResources.type, ACTIVITY_TYPES))
        .orderBy(desc(externalResources.publishedAt), desc(externalResources.createdAt))
        .limit(PAGE_SIZE + 1)
        .offset(offset)
    : [];

  const hasNext = rows.length > PAGE_SIZE;
  const resources = rows.slice(0, PAGE_SIZE);

  if (resources.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无数据，待后台录入后自动展示。</Panel>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {resources.map((item) => (
          <Link
            key={`${item.title}-${item.url}`}
            className="group flex h-full flex-col rounded-xl border border-stone bg-canvas/pure p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={item.url}
            prefetch={false}
            rel="noreferrer"
            target="_blank"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-xs font-medium tracking-wide text-accent">{getResourceTypeLabel(item.type) ?? "活动"}</p>
              <span className="text-xs text-ink/55">{formatDate(item.publishedAt)}</span>
            </div>
            <h3 className="mt-3 text-lg font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{item.summary || "点击查看公众号完整内容。"}</p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
              立即查看 <ExternalLink className="h-4 w-4" />
            </div>
          </Link>
        ))}
      </div>

      <Pagination page={page} hasNext={hasNext} basePath="/activities" />
    </>
  );
};

const Pagination = ({ page, hasNext, basePath }: { page: number; hasNext: boolean; basePath: string }) => {
  const prevDisabled = page <= 1;
  const nextDisabled = !hasNext;

  const prevButton = prevDisabled ? (
    <Button disabled variant="outline">
      上一页
    </Button>
  ) : (
    <Button asChild variant="outline">
      <Link prefetch={false} href={`${basePath}?page=${page - 1}`} scroll={false}>
        上一页
      </Link>
    </Button>
  );

  const nextButton = nextDisabled ? (
    <Button disabled variant="outline">
      下一页
    </Button>
  ) : (
    <Button asChild variant="outline">
      <Link prefetch={false} href={`${basePath}?page=${page + 1}`} scroll={false}>
        下一页
      </Link>
    </Button>
  );

  return (
    <div className="mt-8 flex items-center justify-between">
      {prevButton}
      <div className="text-sm text-ink/60">第 {page} 页</div>
      {nextButton}
    </div>
  );
};

const ListFallback = ({ message }: { message: string }) => (
  <Panel className="border-dashed py-16 text-center text-sm text-ink/60">
    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone border-t-primary" />
    <p className="mt-4">{message}</p>
  </Panel>
);
