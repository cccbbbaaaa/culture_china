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

const STORY_TYPES = getTypesBySection("stories");
const PAGE_SIZE = 6;

export const dynamic = "force-dynamic";

interface AlumniStoriesPageProps {
  searchParams?: {
    page?: string;
  };
}

const formatDate = (value: Date | string | null) => {
  if (!value) return "日期待定";
  const date = value instanceof Date ? value : new Date(value);
  return Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(date);
};

export default async function AlumniStoriesPage({ searchParams }: AlumniStoriesPageProps) {
  const page = Math.max(1, Number.parseInt(searchParams?.page ?? "1", 10) || 1);

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[
            { label: "首页", href: "/" },
            { label: "学员风采", href: "/alumni" },
            { label: "校友故事", href: "/alumni/stories" },
          ]}
          subtitle="沉淀于公众号的校友随笔、访谈与专栏，在这里集中浏览。"
          title="校友故事 / Stories"
        />

        <Section description="后台使用“校友故事/随笔/专栏”类型推文，即可同步至此。" title="精选推文 / Articles">
          <Suspense fallback={<ListFallback message="校友故事加载中..." />}>
            <StoriesFeed page={page} />
          </Suspense>
        </Section>
      </PageEnter>
    </PageShell>
  );
}

const StoriesFeed = async ({ page }: { page: number }) => {
  if (STORY_TYPES.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">尚未配置校友故事类型。</Panel>;
  }

  const offset = (page - 1) * PAGE_SIZE;
  const rows = await db
    .select({
      title: externalResources.title,
      summary: externalResources.summary,
      url: externalResources.url,
      type: externalResources.type,
      publishedAt: externalResources.publishedAt,
    })
    .from(externalResources)
    .where(inArray(externalResources.type, STORY_TYPES))
    .orderBy(desc(externalResources.publishedAt), desc(externalResources.createdAt))
    .limit(PAGE_SIZE + 1)
    .offset(offset);

  const hasNext = rows.length > PAGE_SIZE;
  const resources = rows.slice(0, PAGE_SIZE);

  if (resources.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无校友故事推文，待后台录入。</Panel>;
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-ink/60">{formatDate(item.publishedAt)}</p>
                <h3 className="mt-2 text-base font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
                <p className="mt-1 text-xs text-ink/55">{getResourceTypeLabel(item.type)}</p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 text-ink/50 group-hover:text-primary" />
            </div>
            <p className="mt-3 flex-1 text-sm text-ink/70">{item.summary || "点击查看完整文章。"}</p>
          </Link>
        ))}
      </div>

      <Pagination page={page} hasNext={hasNext} basePath="/alumni/stories" />
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

