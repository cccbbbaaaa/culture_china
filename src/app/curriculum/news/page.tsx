import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { desc, inArray } from "drizzle-orm";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { externalResources } from "@/db/schema";
import { db } from "@/lib/db";
import { getTypesBySection } from "@/lib/resource-types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 6;
const CURRICULUM_TYPES = getTypesBySection("curriculum");

const formatDate = (value: Date | string | null) => {
  if (!value) return "日期待定";
  const date = value instanceof Date ? value : new Date(value);
  return Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(date);
};

interface CurriculumNewsPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function CurriculumNewsPage({ searchParams }: CurriculumNewsPageProps) {
  const page = Math.max(1, Number.parseInt(searchParams?.page ?? "1", 10) || 1);

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "课程教学", href: "/curriculum" }, { label: "新闻场记", href: "/curriculum/news" }]}
          subtitle="课堂纪实与教学快讯集中发布，来源于公众号推文。"
          title="课程教学 · 新闻场记"
        />

        <Section description="管理后台上传“课程-课程回顾/新闻场记”推文后，这里会自动同步。" title="课程新闻 / Course Notes">
          <Suspense fallback={<ListFallback message="课程新闻加载中..." />}>
            <CurriculumNewsFeed page={page} />
          </Suspense>
        </Section>
      </PageEnter>
    </PageShell>
  );
}

const CurriculumNewsFeed = async ({ page }: { page: number }) => {
  if (CURRICULUM_TYPES.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无课程新闻类型配置。</Panel>;
  }

  const offset = (page - 1) * PAGE_SIZE;
  const rows = await db
    .select({
      title: externalResources.title,
      summary: externalResources.summary,
      url: externalResources.url,
      publishedAt: externalResources.publishedAt,
    })
    .from(externalResources)
    .where(inArray(externalResources.type, CURRICULUM_TYPES))
    .orderBy(desc(externalResources.publishedAt), desc(externalResources.createdAt))
    .limit(PAGE_SIZE + 1)
    .offset(offset);

  const hasNext = rows.length > PAGE_SIZE;
  const resources = rows.slice(0, PAGE_SIZE);

  if (resources.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无课程新闻推文。</Panel>;
  }

  return (
    <>
      <div className="space-y-4">
        {resources.map((item) => (
          <Link
            key={`${item.title}-${item.url}`}
            className="group block rounded-xl border border-stone bg-canvas/pure p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={item.url}
            prefetch={false}
            rel="noreferrer"
            target="_blank"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-ink/60">{formatDate(item.publishedAt)}</p>
                <h3 className="mt-2 text-lg font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 text-ink/50 group-hover:text-primary" />
            </div>
            <p className="mt-3 text-sm text-ink/70">{item.summary || "点击查看完整课堂回顾。"}</p>
          </Link>
        ))}
      </div>

      <Pagination page={page} hasNext={hasNext} basePath="/curriculum/news" />
    </>
  );
};

const Pagination = ({ page, hasNext, basePath }: { page: number; hasNext: boolean; basePath: string }) => (
  <div className="mt-8 flex items-center justify-between">
    {page <= 1 ? (
      <Button disabled variant="outline">
        上一页
      </Button>
    ) : (
      <Button asChild variant="outline">
        <Link prefetch={false} href={`${basePath}?page=${page - 1}`} scroll={false}>
          上一页
        </Link>
      </Button>
    )}

    <div className="text-sm text-ink/60">第 {page} 页</div>

    {!hasNext ? (
      <Button disabled variant="outline">
        下一页
      </Button>
    ) : (
      <Button asChild variant="outline">
        <Link prefetch={false} href={`${basePath}?page=${page + 1}`} scroll={false}>
          下一页
        </Link>
      </Button>
    )}
  </div>
);

const ListFallback = ({ message }: { message: string }) => (
  <Panel className="border-dashed py-16 text-center text-sm text-ink/60">
    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone border-t-primary" />
    <p className="mt-4">{message}</p>
  </Panel>
);

