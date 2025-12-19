import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { desc, eq } from "drizzle-orm";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";
import { Button } from "@/components/ui/button";
import { externalResources } from "@/db/schema";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
const TYPE_VALUE = "活动-年度论坛";
const PAGE_SIZE = 6;

const formatDate = (value: Date | string | null) => {
  if (!value) return "日期待定";
  const date = value instanceof Date ? value : new Date(value);
  return Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(date);
};

interface ActivitiesForumPageProps {
  searchParams?: {
    page?: string;
  };
}

export default async function ActivitiesForumPage({ searchParams }: ActivitiesForumPageProps) {
  const page = Math.max(1, Number.parseInt(searchParams?.page ?? "1", 10) || 1);

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          title="特色活动 · 年度论坛"
          subtitle="年度论坛聚焦人文与当代议题，这里汇总每届论坛的嘉宾阵容、议程亮点与精选推文回顾。"
        />

        <Section
          description="后台将按推文类型“活动-年度论坛”自动同步，点击卡片即可跳转微信公众号阅读全文。"
          title="年度论坛推文 / Forum Highlights"
        >
          <Suspense fallback={<ListFallback message="年度论坛推文加载中..." />}>
            <ForumFeed page={page} />
          </Suspense>
        </Section>
      </PageEnter>
    </PageShell>
  );
}

const ForumFeed = async ({ page }: { page: number }) => {
  const offset = (page - 1) * PAGE_SIZE;

  const rows = await db
    .select({
      title: externalResources.title,
      summary: externalResources.summary,
      url: externalResources.url,
      publishedAt: externalResources.publishedAt,
    })
    .from(externalResources)
    .where(eq(externalResources.type, TYPE_VALUE))
    .orderBy(desc(externalResources.publishedAt), desc(externalResources.createdAt))
    .limit(PAGE_SIZE + 1)
    .offset(offset);

  const hasNext = rows.length > PAGE_SIZE;
  const resources = rows.slice(0, PAGE_SIZE);

  if (resources.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无年度论坛推文，上传后会自动显示最近内容。</Panel>;
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
              </div>
              <ExternalLink className="mt-1 h-4 w-4 text-ink/50 group-hover:text-primary" />
            </div>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{item.summary || "点击查看完整论坛回顾。"}</p>
          </Link>
        ))}
      </div>

      <Pagination page={page} hasNext={hasNext} basePath="/activities/forum" />
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
