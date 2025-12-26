import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { and, desc, eq } from "drizzle-orm";

import { FacultyCarousel } from "@/components/alumni/faculty-carousel";
import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { PageEnter } from "@/components/shared/page-enter";
import { PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";
import { activityMedia, externalResources, mediaAssets } from "@/db/schema";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    src: "/images/events/annual/2025-group-photo.png",
    alt: "年度论坛合影 / Annual forum group photo",
    title: "年度论坛 · 经世与人文",
    subtitle: "2025 年度论坛 · 顶级导师与学员共襄盛举",
    caption: "沉浸式高端对话，围绕历史使命感与当代责任展开",
  },
  {
    src: "/images/events/visits/2024-hk1.jpg",
    alt: "访学交流剪影 / Study visit moment",
    title: "访学交流 · 港澳与世界现场",
    subtitle: "浙大学子与港澳导师共研经典与现实",
    caption: "跨区域访学，以当下议题为纽带，连接思想与文化",
  },
  {
    src: "/images/events/course/bao-20251202.jpeg",
    alt: "课程教学现场 / Curriculum session moment",
    title: "课程教学 · 经典与现实并行",
    subtitle: "认知 → 体验 → 反思 → 笃行",
    caption: "沉浸式课程结合专业研讨与社会调研，强化行动闭环",
  },
  {
    src: "/images/events/visits/2023-us2.jpg",
    alt: "海外访学剪影 / Overseas study visit moment",
    title: "海外访学 · 世界视野",
    subtitle: "哈佛 · 牛津 · 斯坦福等世界名校站点",
    caption: "用世界现场映照中华传统，在全球语境中重构文化自信",
  },
];

export default async function HomePage() {
  return (
    <div>
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-dark via-primary to-primary-light text-canvas shadow-inner">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[url('/images/branding/paper-texture.svg')] bg-[length:280px_280px] bg-repeat opacity-60 mix-blend-multiply" />
        </div>
        <PageShell className="relative z-10 py-24 md:py-28">
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
        <div className="relative -mt-12 px-4 md:px-0">
          <Suspense fallback={<HeroSkeleton />}>
            <HeroSection fallbackSlides={FALLBACK_SLIDES} />
          </Suspense>
        </div>
      </div>

      <PageShell className="pt-12">
        <PageEnter>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Panel className="relative lg:col-span-2 overflow-hidden">
              {/* 背景装饰线 / Background Decorative Lines */}
              <div className="pointer-events-none absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-stone-300/60 via-stone-200/40 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-baseline gap-3">
                  <h2 className="text-3xl font-serif font-bold tracking-tight text-ink">计划简介</h2>
                  <span className="text-sm font-sans uppercase tracking-widest text-ink/40">Program Overview</span>
                </div>
                
                <div className="mt-6 max-w-3xl space-y-4">
                  <p className="text-[1.05rem] leading-relaxed text-ink/85">
                    浙江大学晨兴文化中国人才计划于 2008 年创办，是一个非学分制、跨学科的精英培养项目，至今已累计培养 17 期 500 余位杰出学子。
                  </p>
                  <p className="text-[1.05rem] leading-relaxed text-ink/85">
                    我们致力于在全校范围内选拔优秀学子，秉承
                    <span className="mx-1 font-serif font-bold text-primary underline underline-offset-4 decoration-primary/30">视域 · 情感 · 观点</span>
                    三位一体的培养理念，在全球化语境中重建文化自信。
                  </p>

                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-stone/50 pt-8">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                      <span className="font-serif font-bold text-lg">01</span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-ink">精英选拔与导师制</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">每年选拔约 30 名学员，强调“认知 → 体验 → 反思 → 笃行”的行动闭环。</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/5 text-primary">
                      <span className="font-serif font-bold text-lg">02</span>
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-ink">高黏性文中人社群</h4>
                      <p className="mt-1 text-sm leading-relaxed text-ink/60">涵盖经典会读、年度论坛、国内外访学及公益实践，形成终身受益的社群链接。</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button asChild size="lg" className="px-8 shadow-sm transition-all hover:opacity-90">
                    <Link href="/intro">了解计划</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-8 border-stone-300 transition-all hover:bg-stone-50 hover:text-primary">
                    <Link href="/intro/mission">使命背景</Link>
                  </Button>
                </div>
              </div>
            </Panel>

            <Panel className="relative flex flex-col justify-between overflow-hidden">
              {/* 背景装饰引号 / Decorative Background Quotes */}
              <div className="pointer-events-none absolute -right-4 -top-6 select-none font-serif text-[120px] leading-none text-primary/5">
                ”
              </div>
              <div className="pointer-events-none absolute -bottom-10 -left-4 select-none font-serif text-[120px] leading-none text-primary/5">
                “
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-serif font-semibold text-primary">创办人寄语</h3>
                  {/* 项目 Logo 恢复原色 / Project Logo back to original */}
                  <div className="relative h-10 w-10">
                    <Image src="/images/branding/icon.svg" alt="Project Icon" fill className="object-contain" />
                  </div>
                </div>
                
                <div className="mt-2 h-px w-full bg-primary/10"></div>

                <div className="mt-8">
                  <p className="font-serif text-[1.15rem] font-medium leading-relaxed tracking-wide text-ink/90">
                    中国的复兴不仅需要专业技术人才，更需要具有
                    <span className="mx-1 border-b border-primary/30 pb-0.5 text-primary">历史使命感</span>
                    、
                    <span className="mx-1 border-b border-primary/30 pb-0.5 text-primary">社会责任感</span>
                    与卓越领导能力的未来领袖。
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-end gap-3">
                  <div className="h-px w-6 bg-primary/40"></div>
                  <p className="font-serif text-lg text-primary">杜维明 · 周生春</p>
                </div>
              </div>

              <div className="relative z-10 mt-10 flex justify-end border-t border-stone/30 pt-4">
                <Button asChild size="sm" variant="ghost" className="text-ink/60 hover:text-primary hover:bg-primary/5">
                  <Link href="/intro/mission">阅读完整背景 / Full Story →</Link>
                </Button>
              </div>
            </Panel>
          </div>
          <Section
            className="mt-10"

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
                <p className="mt-3 text-base leading-relaxed text-ink/75">海内外学者、企业家、社会领袖担任导师，提供长期陪伴式指导。</p>

                <FacultyCarousel
                  faculty={[
                    { name: "陈启宗", title: "香港恒隆集团主席", img: "/images/people/faculty_portrait/chenqizong.png" },
                    { name: "杜维明", title: "哈佛燕京学社前社长", img: "/images/people/faculty_portrait/duweiming.png" },
                    { name: "蒋岳祥", title: "浙江大学经济学院教授", img: "/images/people/faculty_portrait/jiangyuexiang.png" },
                    { name: "梁元生", title: "香港中文大学教授", img: "/images/people/faculty_portrait/liangyuansheng.png" },
                    { name: "郑培凯", title: "香港城市大学教授", img: "/images/people/faculty_portrait/zhengpeikai.png" },
                  ]}
                />

                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" variant="outline">
                    <Link href="/intro/faculty">查看师资 / Faculty</Link>
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
                    <dd className="text-3xl font-serif font-semibold text-primary">17</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-base text-ink/70">培养学员</dt>
                    <dd className="text-3xl font-serif font-semibold text-primary">519</dd>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <dt className="text-base text-ink/70">年度活动</dt>
                    <dd className="text-3xl font-serif font-semibold text-primary">50+</dd>
                  </div>
                </dl>
                <p className="mt-6 text-base leading-relaxed text-ink/75">已累计培养 17 期 519 名学员，50% 赴哈佛 / MIT / 剑桥等深造，34% 在北大 / 清华 / 浙大等继续求学。</p>
              </Panel>
            </div>
          </Section>
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
      assetId: mediaAssets.id,
    })
    .from(activityMedia)
    .innerJoin(mediaAssets, eq(activityMedia.mediaId, mediaAssets.id))
    .where(and(eq(activityMedia.isActive, true), eq(activityMedia.slotKey, "home_hero")))
    .orderBy(activityMedia.sortOrder)
    .limit(10);

  const heroSlides: HeroSlide[] = heroRows.map((row, index) => ({
    // 使用本地 API 代理访问 Storage，避免浏览器端 signed URL 400 / Proxy through our API to avoid signed URL 400
    src: `/api/media/${row.assetId}`,
    alt: `${row.title} / 轮播图片`,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    caption: row.linkUrl ? `点击跳转 / Click to open` : `Slide ${index + 1}`,
  }));

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
            <div className="flex items-start justify-between gap-4">
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
