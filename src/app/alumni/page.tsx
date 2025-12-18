import Image from "next/image";
import Link from "next/link";

import { eq, isNotNull, sql } from "drizzle-orm";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { alumniProfiles, mediaAssets } from "@/db/schema";
import { getSignedMediaUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

interface AlumniPageProps {
  searchParams?: {
    // 用于“换一批”触发重新随机 / Used to force re-randomization
    refresh?: string;
  };
}

const splitBioLines = (bio: string) => {
  // 约定：中文分号“；”表示换行 / Convention: Chinese semicolon means newline
  // 兼容已有换行 / Also support existing newlines
  return bio
    .split(/\n|；/g)
    .map((line) => line.trim())
    .filter(Boolean);
};

export default async function AlumniPage({ searchParams }: AlumniPageProps) {
  // refresh 参数仅用于改变 URL（防止某些环境下缓存命中）
  // refresh param only changes URL to avoid cache hits in some environments
  void searchParams?.refresh;

  // 默认页面：每次进入随机显示 6 条（仅有照片的学员）
  // Default page: random 6 alumni WITH photos only
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
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "学员风采", href: "/alumni" }]}
          subtitle="随机展示部分学员风采；更多内容可按期数查看。"
          title="学员风采 / Alumni Showcase"
        />

        <Section
          description="数据来自 Supabase（Drizzle 直查）。默认每次进入页面随机展示 6 位（仅展示有照片学员）。"
          title="学员名录 / Directory"
        >
          <Panel>
            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              {photoWithUrls.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone bg-canvas/pure p-6 text-sm text-ink/70">
                  暂无数据
                </div>
              ) : null}
              {photoWithUrls.map((row) => {
                const bioLines = splitBioLines(row.bioZh ?? "");
                const previewLines = bioLines.slice(0, 5);
                return (
                  <div
                    key={row.id}
                    className="flex flex-col gap-4 overflow-hidden rounded-xl border border-stone bg-canvas/pure shadow-sm sm:flex-row sm:gap-5"
                  >
                    {/* 左侧照片 / Left photo */}
                    {/* 固定 5:7 比例容器，统一视觉 / Fixed 5:7 frame for consistency */}
                    <div className="relative h-56 w-full bg-canvas sm:h-[196px] sm:w-[140px] sm:shrink-0">
                      {row.photoUrl ? (
                        <Image
                          alt={`${row.name} 照片 / photo`}
                          className="object-contain"
                          fill
                          sizes="(max-width: 640px) 100vw, 140px"
                          src={row.photoUrl}
                        />
                      ) : null}
                    </div>

                    {/* 右侧文本 / Right content */}
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
                          <a
                            className="ml-2 break-all text-primary hover:underline"
                            href={row.websiteUrl}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {row.websiteUrl}
                          </a>
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 操作按钮：放在随机样本下方 / Controls under the cards */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" variant="outline">
                <Link href={`/alumni?refresh=${Date.now()}`}>换一批</Link>
              </Button>
              <Button asChild size="lg" variant="default">
                <Link href="/alumni/profiles">按期数查看</Link>
              </Button>
            </div>
          </Panel>
        </Section>

        <Section description="一部分为外链跳转，一部分为固定 blog（后续实现）。" title="校友故事 / Stories">
          <Panel className="border-dashed">
            <p className="text-sm text-ink/70">预留：故事列表、标签、跳转微信公众号等。</p>
          </Panel>
        </Section>
      </PageEnter>
    </PageShell>
  );
}




