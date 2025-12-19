import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { and, desc, eq } from "drizzle-orm";

import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { PageEnter } from "@/components/shared/page-enter";
import { PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { activityMedia, externalResources, mediaAssets } from "@/db/schema";
import { db } from "@/lib/db";
import { getSignedMediaUrl } from "@/lib/storage";

export const dynamic = "force-dynamic";

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    src: "/images/events/annual/2025-group-photo.png",
    alt: "年度论坛合影 / Annual forum group photo",
    title: "浙江大学晨兴文化中国人才计划",
    subtitle: "Zhejiang University Morningside Cultural China Scholars Program",
    caption: "年度论坛 · 2025（示例图片 / sample image）",
  },
  {
    src: "/images/events/visits/2024-hk1.jpg",
    alt: "访学交流剪影 / Study visit moment",
    title: "以经典为骨，以世界为镜",
    subtitle: "以人文与学术的方式，培养具有全球视野的未来领袖。",
    caption: "访学交流 · 2024（示例图片 / sample image）",
  },
  {
    src: "/images/events/course/bao-20251202.jpeg",
    alt: "课程教学现场 / Curriculum session moment",
    title: "知行合一，笃行致远",
    subtitle: "认知 → 体验 → 反思 → 笃行",
    caption: "课程教学 · 2025.12.02（示例图片 / sample image）",
  },
  {
    src: "/images/events/visits/2023-us2.jpg",
    alt: "海外访学剪影 / Overseas study visit moment",
    title: "在世界现场，回到文化中国",
    subtitle: "以体验与反思连接传统与当代。",
    caption: "海外访学 · 2023（示例图片 / sample image）",
  },
];

export default async function HomePage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-canvas shadow-inner">
        <PageShell className="py-24">
          <PageEnter
            className="w-full"
            initial={{ opacity: 0, x: -48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-10 md:pl-6 lg:pl-10">
              <div className="space-y-4 md:w-3/4 lg:w-2/3">
                <h1 className="text-4xl font-serif font-semibold leading-tight sm:text-5xl lg:text-6xl">
                  沉潜人文，观照当代
                </h1>
                <p className="text-lg leading-relaxed text-canvas/95 sm:text-xl">
                  <span className="block">培养秉承中华文化之精神、具有全球视野的未来社会各界领袖人才。</span>
                  <span className="block">Cultivating future leaders grounded in Chinese culture and equipped with a global horizon.</span>
                </p>
              </div>

              <div className="flex w-full flex-wrap items-start gap-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/intro">了解文化中国</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/admissions">加入文化中国</Link>
                </Button>
              </div>
            </div>
          </PageEnter>
        </PageShell>
      </div>

      <div className="bg-gradient-to-b from-canvas via-canvas to-stone/20 py-10">
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection fallbackSlides={FALLBACK_SLIDES} />
        </Suspense>
      </div>

      <PageShell className="pt-12">
        <PageEnter>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <h2 className="text-section text-ink">文化中国介绍 / Program Overview</h2>
              <p className="mt-4 max-w-4xl text-base leading-relaxed tracking-wide text-ink/85">
                浙江大学晨兴文化中国人才计划（2008 年创办）是一个非学分制、跨学科的精英培养项目，秉承“视域 · 情感 · 观点”三位一体的培养理念，帮助同学在全球化语境中重建文化自信。
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-ink/75">
                <li>每年全校范围选拔约 30 名学员，导师制 + 小班研讨，强调“认知 → 体验 → 反思 → 笃行”。</li>
                <li>核心活动涵盖经典会读、年度论坛、国内外访学、公益实践、内部沙龙等，形成高黏性的“文中人”社群。</li>
                <li>已累计培养 17 期 500+ 学员，50% 赴哈佛 / MIT / 剑桥等深造，34% 在北大 / 清华 / 浙大等继续求学，其余投身创业与公共服务。</li>
              </ul>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/intro">了解计划 / Learn more</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/intro/mission">使命背景 / Mission</Link>
                </Button>
              </div>
            </Panel>

            <Panel>
              <h3 className="text-xl font-serif font-semibold text-ink">品牌视觉 / Visual</h3>
              <p className="mt-3 text-base leading-relaxed text-ink/75">
                以“新中式”留白与沉稳配色为基调，强化高端、学术与人文的品牌气质。
              </p>
              <p className="mt-2 text-base leading-relaxed text-ink/70">
                A modern “New Chinese” aesthetic: calm tones, generous whitespace, and editorial typography.
              </p>
              <div className="relative mt-5 overflow-hidden rounded-xl border border-stone">
                <Image alt="Banner / 横幅" className="h-52 w-full object-cover" height={520} src="/images/branding/banner.png" width={1000} />
              </div>
            </Panel>
          </div>

          <Section
            className="mt-10"
            description="从使命到师资，帮助访客迅速了解核心价值。"
            title="计划亮点 / Highlights"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Panel>
                <h3 className="text-lg font-serif font-semibold text-ink">使命与精神</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  “为天地立心，为生民立命，为往圣继绝学，为万世开太平。”——项目以中华文化的精神坐标为核心，培养兼具理想与担当的未来领袖。
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/intro/mission">了解使命</Link>
                </Button>
              </Panel>
              <Panel>
                <h3 className="text-lg font-serif font-semibold text-ink">培养路径</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  视域（全球广度）· 情感（文化认同）· 观点（独立思考）。通过课程、访学、论坛、公益实践形成“认知—体验—反思—笃行”的行动闭环。
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/intro/purpose">培养宗旨</Link>
                </Button>
              </Panel>
              <Panel>
                <h3 className="text-lg font-serif font-semibold text-ink">导师与社群</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  邀请海内外学者、企业家、社会领袖担任导师，形成高黏性的校友网络，支持学员长期成长。
                </p>
                <Button asChild className="mt-4" variant="outline">
                  <Link href="/intro/faculty">查看师资</Link>
                </Button>
              </Panel>
            </div>
          </Section>

          <Section
            description="聚合课程教学、特色活动等最新内容；当前已对接 external_resources 表。"
            title="近期活动动态 / Latest Updates"
          >
            <Suspense fallback={<UpdatesSkeleton />}>
              <LatestUpdatesSection />
            </Suspense>
          </Section>

          <Section description="展示师资密度与社群底蕴；当前为占位，后续将对接 faculty/alumni 表。" title="校友与师资 / Alumni & Community">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Panel className="lg:col-span-2">
                <h3 className="text-xl font-serif font-semibold text-ink">师资墙 / Faculty Wall</h3>
                <p className="mt-3 text-base leading-relaxed text-ink/75">横向滚动展示导师头像（示例），后续可加入详情页与筛选。</p>

                <div className="mt-6 flex gap-6 overflow-x-auto pb-2">
                  {(
                    [
                      "/images/people/faculty/duweiming.png",
                      "/images/people/faculty/zhengpeikai.png",
                      "/images/people/faculty/liangyuansheng.png",
                      "/images/people/faculty/chenqizong.jpg",
                      "/images/people/faculty/jiangyuexiang.jpeg",
                    ] as const
                  ).map((src, index) => (
                    <div key={index} className="min-w-[150px]">
                      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-stone">
                        <Image alt="导师头像 / Faculty avatar" className="object-cover" fill sizes="80px" src={src} />
                      </div>
                      <p className="mt-3 text-base font-medium text-ink">导师 {index + 1}</p>
                      <p className="text-sm text-ink/60">Title / Affiliation</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" variant="outline">
                    <Link href="/intro">查看师资 / Faculty</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/alumni">学员风采 / Alumni</Link>
                  </Button>
                </div>
              </Panel>

              <Panel>
                <h3 className="text-xl font-serif font-semibold text-ink">社群概览 / Community</h3>
                <dl className="mt-5 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <dt className="text-base text-ink/70">已培养期数</dt>
                    <dd className="text-3xl font-serif font-semibold text-primary">XX</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-base text-ink/70">覆盖行业</dt>
                    <dd className="text-3xl font-serif font-semibold text-primary">XX</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-base text-ink/70">年度活动</dt>
                    <dd className="text-3xl font-serif font-semibold text-primary">XX</dd>
                  </div>
                </dl>
                <p className="mt-6 text-base leading-relaxed text-ink/75">这里将接入后台录入的结构化数据，用于真实展示与运营配置（置顶/推荐）。</p>
              </Panel>
            </div>
          </Section>

          <div className="mt-16 overflow-hidden rounded-3xl border border-stone/60 bg-gradient-to-r from-canvas via-primary/8 to-canvas shadow-sm">
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center sm:py-14">
              <p className="text-2xl font-serif font-semibold text-ink">认知 · 体验 · 反思 · 笃行</p>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ink/70">COGNITION · EXPERIENCE · REFLECTION · PRACTICE</p>
            </div>
          </div>
        </PageEnter>
      </PageShell>
    </div>
  );
}

const HeroSection = async ({ fallbackSlides }: { fallbackSlides: HeroSlide[] }) => {
  const heroRows = await db
    .select({
      title: activityMedia.title,
      subtitle: activityMedia.subtitle,
      linkUrl: activityMedia.linkUrl,
      storagePath: mediaAssets.storagePath,
    })
    .from(activityMedia)
    .innerJoin(mediaAssets, eq(activityMedia.mediaId, mediaAssets.id))
    .where(and(eq(activityMedia.isActive, true), eq(activityMedia.slotKey, "home_hero")))
    .orderBy(activityMedia.sortOrder)
    .limit(10);

  const heroSlides: HeroSlide[] = await Promise.all(
    heroRows.map(async (row, index) => {
      const src = await getSignedMediaUrl(row.storagePath, 60 * 60);
      return {
        src,
        alt: `${row.title} / 轮播图片`,
        title: row.title,
        subtitle: row.subtitle ?? undefined,
        caption: row.linkUrl ? `点击跳转 / Click to open` : `Slide ${index + 1}`,
      };
    }),
  );

  return <HeroCarousel slides={heroSlides.length > 0 ? heroSlides : fallbackSlides} />;
};

const LatestUpdatesSection = async () => {
  const rows = await db
    .select({
      title: externalResources.title,
      description: externalResources.summary,
      href: externalResources.url,
      tag: externalResources.type,
    })
    .from(externalResources)
    .orderBy(desc(externalResources.publishedAt), desc(externalResources.createdAt))
    .limit(3);

  if (rows.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无最新动态。</Panel>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {rows.map((item) => (
          <Link
            key={`${item.title}-${item.href}`}
            className="group block rounded-xl border border-stone bg-canvas/pure p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href={item.href}
            prefetch={false}
            rel="noreferrer"
            target="_blank"
          >
            <div className="flex items-start justify之间 gap-4">
              <div>
                <p className="text-xs font-medium tracking-wide text-accent">{item.tag || "动态"}</p>
                <h3 className="mt-3 text-lg font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
              </div>
              <ExternalLink className="mt-1 h-4 w-4 text-ink/50 transition-colors group-hover:text-primary" />
            </div>
            <p className="mt-4 text-base leading-relaxed text-ink/75">{item.description ?? "点击查看详情"}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Button asChild size="lg" variant="secondary">
          <Link href="/activities">查看全部活动 / View all activities</Link>
        </Button>
      </div>
    </>
  );
};

const HeroSkeleton = () => (
  <div className="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
    <div className="h-[clamp(380px,58vh,620px)] animate-pulse rounded-3xl border border-dashed border-stone bg-stone/10" />
  </div>
);

const UpdatesSkeleton = () => (
  <Panel className="border-dashed py-16 text-center text-sm text-ink/60">
    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone border-t-primary" />
    <p className="mt-4">近期动态加载中...</p>
  </Panel>
);
