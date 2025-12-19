import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { desc, eq, inArray, isNotNull, sql } from "drizzle-orm";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { alumniProfiles, externalResources, mediaAssets } from "@/db/schema";
import { getResourceTypeLabel, getTypesBySection } from "@/lib/resource-types";
import { getSignedMediaUrl } from "@/lib/storage";
const STORY_TYPES = getTypesBySection("stories");

export const dynamic = "force-dynamic";

interface AlumniPageProps {
  searchParams?: {
    refresh?: string;
  };
}

const splitBioLines = (bio: string) =>
  bio
    .split(/\n|；/g)
    .map((line) => line.trim())
    .filter(Boolean);

export default async function AlumniPage({ searchParams }: AlumniPageProps) {
  void searchParams?.refresh;

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "学员风采", href: "/alumni" }]}
          subtitle="默认随机展示 6 位有照片的学员，支持一键换一批或跳转按期数查看。"
          title="学员风采 / Alumni Showcase"
        />

        <Suspense fallback={<LoadingPanel message="学员数据加载中..." />}>
          <RandomAlumniGrid />
        </Suspense>

        <Section
          className="mt-12"
          description="收录学员的随笔、故事与专栏精选，内容来源于后台上传的微信公众号推文。"
          title="校友故事 / Stories"
        >
          <Suspense fallback={<LoadingPanel message="校友故事加载中..." />}>
            <StoriesPreview />
          </Suspense>
        </Section>
      </PageEnter>
    </PageShell>
  );
}

const RandomAlumniGrid = async () => {
  const randomLimit = 6;
  const photoRows = await db
    .select({
      id: alumniProfiles.id,
      name: alumniProfiles.name,
      cohort: alumniProfiles.cohort,
      major: alumniProfiles.major,
      bioZh: alumniProfiles.bioZh,
      storagePath: mediaAssets.storagePath,
      websiteUrl: alumniProfiles.websiteUrl,
    })
    .from(alumniProfiles)
    .innerJoin(mediaAssets, eq(alumniProfiles.photoAssetId, mediaAssets.id))
    .where(isNotNull(alumniProfiles.photoAssetId))
    .orderBy(sql`random()`)
    .limit(randomLimit);

  const photoWithUrls = await Promise.all(
    photoRows.map(async (row) => {
      try {
        const signed = await getSignedMediaUrl(row.storagePath, 60 * 60);
        return { ...row, photoUrl: signed };
      } catch {
        return { ...row, photoUrl: null as string | null };
      }
    }),
  );

  return (
    <>
      <Panel className="mb-6 text-sm text-ink/70">
        每次进入页面都会随机展示 6 位学员，如需按期数查看请切换至“按期数查看”页面。
      </Panel>

      {photoWithUrls.length === 0 ? (
        <Panel className="border-dashed text-sm text-ink/60">暂无已上传照片的学员。</Panel>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {photoWithUrls.map((row) => {
            const bioLines = splitBioLines(row.bioZh ?? "");
            const previewLines = bioLines.slice(0, 5);
            return (
              <div
                key={row.id}
                className="flex flex-col gap-4 overflow-hidden rounded-xl border border-stone bg-canvas/pure shadow-sm sm:flex-row sm:gap-5"
              >
                <div className="relative h-56 w-full bg-canvas sm:h-[196px] sm:w-[140px] sm:shrink-0">
                  {row.photoUrl ? (
                    <Image alt={`${row.name} 照片 / photo`} className="object-contain" fill sizes="(max-width: 640px) 100vw, 140px" src={row.photoUrl} />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 px-5 pb-5 sm:p-5">
                  <p className="text-xl font-serif font-semibold tracking-wide text-ink">{row.name}</p>
                  <p className="mt-2 text-sm text-ink/70">
                    {row.cohort ? `${row.cohort} 期` : "期数未知"}
                    {row.major ? `  ${row.major}` : ""}
                  </p>

                  <div className="mt-3 space-y-1 text-sm leading-relaxed text-ink/70">
                    {previewLines.length > 0 ? (
                      previewLines.map((line, index) => (
                        <p key={index} className="break-words">
                          {line}
                        </p>
                      ))
                    ) : (
                      <p className="text-ink/55">（暂无简介 / No bio）</p>
                    )}
                    {bioLines.length > previewLines.length ? <p className="text-ink/55">……</p> : null}
                  </div>

                  {row.websiteUrl ? (
                    <p className="mt-3 text-sm text-ink/70">
                      个人主页：
                      <a className="ml-2 break-all text-primary hover:underline" href={row.websiteUrl} rel="noreferrer" target="_blank">
                        {row.websiteUrl}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button asChild variant="outline">
          <Link prefetch={false} href={`/alumni?refresh=${Date.now()}`}>换一批</Link>
        </Button>
        <Button asChild>
          <Link prefetch={false} href="/alumni/profiles">
            按期数查看
          </Link>
        </Button>
      </div>
    </>
  );
};

const StoriesPreview = async () => {
  if (STORY_TYPES.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无校友故事类型配置。</Panel>;
  }

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
    .limit(3);

  if (rows.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无校友随笔，待后台录入后自动展示。</Panel>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {rows.map((item) => (
          <Link
            key={`${item.title}-${item.url}`}
            className="group flex h-full flex-col rounded-xl border border-stone bg-canvas/pure p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={item.url}
            prefetch={false}
            rel="noreferrer"
            target="_blank"
          >
            <p className="text-xs font-medium text-ink/60">
              {new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(item.publishedAt ?? new Date())}
            </p>
            <h3 className="mt-2 text-base font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/70">{item.summary || "点击阅读完整故事。"}</p>
            <div className="mt-4 text-xs text-ink/55">{getResourceTypeLabel(item.type)}</div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button asChild size="lg">
          <Link prefetch={false} href="/alumni/stories">
            查看全部校友故事
          </Link>
        </Button>
      </div>
    </>
  );
};

const LoadingPanel = ({ message }: { message: string }) => (
  <Panel className="border-dashed py-16 text-center text-sm text-ink/60">
    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone border-t-primary" />
    <p className="mt-4">{message}</p>
  </Panel>
);
