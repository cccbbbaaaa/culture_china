import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { activityMedia, externalResources, mediaAssets } from "@/db/schema";
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

        <Section description="内容由运维后台「活动媒体管理 · /activities 图库」维护。" title="图库 / Gallery">
          <Suspense fallback={<ListFallback message="图库加载中..." />}>
            <GalleryGrid />
          </Suspense>
        </Section>

        <Section description="已与 external_resources 表对接，可通过后台推文控制展示与排序。" title="活动列表 / Activity Feed">
          <Suspense fallback={<ListFallback message="活动内容加载中..." />}>
            <ActivitiesFeed page={page} />
          </Suspense>
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

const GalleryGrid = async () => {
  const galleryItems = await db
    .select({
      id: activityMedia.id,
      title: activityMedia.title,
      subtitle: activityMedia.subtitle,
      linkUrl: activityMedia.linkUrl,
      mediaId: activityMedia.mediaId,
      width: mediaAssets.width,
      height: mediaAssets.height,
      ratio: mediaAssets.ratio,
    })
    .from(activityMedia)
    .leftJoin(mediaAssets, eq(activityMedia.mediaId, mediaAssets.id))
    .where(and(eq(activityMedia.slotKey, "activities_gallery"), eq(activityMedia.isActive, true)))
    .orderBy(asc(activityMedia.sortOrder), desc(activityMedia.updatedAt));

  if (galleryItems.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">图库暂无内容，请在后台上传活动图片。</Panel>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {galleryItems.map((item) => {
        const ratio = item.ratio ?? (item.width && item.height ? item.width / item.height : 4 / 3);
        const paddingTop = `${(1 / ratio) * 100}%`;
        const cardContent = (
          <>
            <div className="relative w-full" style={{ paddingTop }}>
              <Image
                alt={item.title}
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                fill
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                src={`/api/media/${item.mediaId}`}
              />
            </div>
            <div className="space-y-2 px-4 py-5">
              <p className="text-xs uppercase tracking-[0.3em] text-ink/50">Gallery</p>
              <h3 className="text-lg font-serif font-semibold text-ink">{item.title}</h3>
              {item.subtitle ? <p className="text-sm text-ink/70">{item.subtitle}</p> : null}
              {item.linkUrl ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  查看详情 <ExternalLink className="h-4 w-4" />
                </span>
              ) : null}
            </div>
          </>
        );

        if (item.linkUrl) {
          return (
            <a
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-stone/40 bg-canvas shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              href={item.linkUrl}
              rel="noreferrer"
              target="_blank"
            >
              {cardContent}
            </a>
          );
        }

        return (
          <div
            key={item.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-stone/40 bg-canvas shadow-sm"
          >
            {cardContent}
          </div>
        );
      })}
    </div>
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
