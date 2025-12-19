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

const CURRICULUM_TYPES = getTypesBySection("curriculum");
const PAGE_SIZE = 6;

export const dynamic = "force-dynamic";

interface CurriculumPageProps {
  searchParams?: {
    page?: string;
  };
}

const formatDate = (value: Date | string | null) => {
  if (!value) return "日期待定";
  const date = value instanceof Date ? value : new Date(value);
  return Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(date);
};

export default async function CurriculumPage({ searchParams }: CurriculumPageProps) {
  const page = Math.max(1, Number.parseInt(searchParams?.page ?? "1", 10) || 1);

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "课程教学", href: "/curriculum" }]}
          subtitle="历史资料归档与轻量化展示；主要通过外部链接引用微信公众号内容。"
          title="课程教学 / Curriculum"
        />

        <Section description="以时间轴/列表的方式呈现课程活动与教学内容。" title="新闻场记 / Notes">
          <Suspense fallback={<ListFallback message="课程内容加载中..." />}>
            <CurriculumFeed page={page} />
          </Suspense>
        </Section>

        <Section title="课程介绍 / Overview">
          <Panel className="border-dashed">
            <p className="text-sm leading-relaxed text-ink/70">
              预留：按年份归档课程大纲、师资与阅读清单等。
            </p>
          </Panel>
        </Section>
      </PageEnter>
    </PageShell>
  );
}

const CurriculumFeed = async ({ page }: { page: number }) => {
  const offset = (page - 1) * PAGE_SIZE;
  const rows = CURRICULUM_TYPES.length
    ? await db
        .select({
          title: externalResources.title,
          summary: externalResources.summary,
          url: externalResources.url,
          type: externalResources.type,
          publishedAt: externalResources.publishedAt,
        })
        .from(externalResources)
        .where(inArray(externalResources.type, CURRICULUM_TYPES))
        .orderBy(desc(externalResources.publishedAt), desc(externalResources.createdAt))
        .limit(PAGE_SIZE + 1)
        .offset(offset)
    : [];

  const hasNext = rows.length > PAGE_SIZE;
  const resources = rows.slice(0, PAGE_SIZE);

  if (resources.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无课程推文，待后台录入。</Panel>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {resources.map((item) => (
          <Link
            key={`${item.title}-${item.url}`}
            className="group block rounded-xl border border-stone bg-canvas/pure p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={item.url}
            prefetch={false}
            rel="noreferrer"
            target="_blank"
          >
            <div className="flex items-start justify之间 gap-4">
              <div>
                <p className="text-xs font-medium text-ink/60">{formatDate(item.publishedAt)}</p>
                <h3 className="mt-2 text-base font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
                <p className="mt-2 text-xs text-ink/55">{getResourceTypeLabel(item.type)}</p>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 text-ink/50 group-hover:text-primary" />
            </div>
            <p className="mt-3 text-sm text-ink/70">{item.summary || "点击查看完整课程回顾。"}</p>
          </Link>
        ))}
      </div>

      <Pagination page={page} hasNext={hasNext} basePath="/curriculum" />
    </>
  );
};

const Pagination = ({ page, hasNext, basePath }: { page: number; hasNext: boolean; basePath: string }) => {
  const prevDisabled = page <= 1;
  const nextDisabled = !hasNext;

  return (
    <div className="mt-8 flex items-center justify-between">
      {prevDisabled ? (
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

      {nextDisabled ? (
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
};

const ListFallback = ({ message }: { message: string }) => (
  <Panel className="border-dashed py-16 text-center text-sm text-ink/60">
    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone border-t-primary" />
    <p className="mt-4">{message}</p>
  </Panel>
);
