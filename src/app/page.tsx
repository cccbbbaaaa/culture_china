import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { and, desc, eq } from "drizzle-orm";

import { FacultyCarousel, type Faculty } from "@/components/alumni/faculty-carousel";
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

interface ProgramPillar {
  /**
   * 序号 / Display number
   */
  id: string;
  /**
   * 标题 / Pillar title
   */
  title: string;
  /**
   * 描述 / Supporting copy
   */
  description: string;
}

// 首页亮点数据 / Pillar highlights for overview section
const PROGRAM_PILLARS: ProgramPillar[] = [
  {
    id: "01",
    title: "精英选拔与导师制",
    description: "每年从浙江大学全校选拔约 30 名学员，独立成班，导师制+小班研讨，进行终身制培养",
  },
  {
    id: "02",
    title: "高黏性文中人社群",
    description: "涵盖经典会读、年度论坛、国内外访学及公益实践，形成终身受益的社群链接",
  },
];

interface HighlightCard {
  /**
   * 标题 / Card heading
   */
  title: string;
  /**
   * 摘要 / Primary summary
   */
  summary: string;
  /**
   * 补充描述 / Supporting copy
   */
  support: string;
  /**
   * CTA 文字 / CTA label
   */
  cta: string;
  /**
   * 跳转链接 / CTA href
   */
  href: string;
}

const HIGHLIGHT_CARDS: HighlightCard[] = [
  {
    title: "使命与精神",
    summary: "“为天地立心，为生民立命，为往圣继绝学，为万世开太平”",
    support: "以中华文化精神为核心，培养兼具理想与担当的未来领袖",
    cta: "了解使命",
    href: "/intro/mission",
  },
  {
    title: "培养路径",
    summary: "全球广度· 文化认同· 独立思考",
    support: "课程、访学、实践构成“认知—体验—反思—笃行”的闭环",
    cta: "培养宗旨",
    href: "/intro/purpose",
  },
  {
    title: "导师与社群",
    summary: "导师来自海内外学者、企业家与社会领袖",
    support: "构建高黏性的“文中人”校友网络，持续提供成长陪伴",
    cta: "查看师资",
    href: "/intro/faculty",
  },
];

export default async function HomePage() {
  return (
    <div>
      <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-canvas shadow-inner">
        <PageShell className="py-28">
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
                  <span className="block">培养秉承中华文化之精神、具有全球视野的未来社会各界领袖人才</span>
                  <span className="block">Cultivating future leaders grounded in Chinese culture and equipped with a global horizon</span>
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
            <Panel className="relative overflow-hidden rounded-[28px] border border-stone bg-gradient-to-b from-canvas/pure to-stone/5 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:shadow-md lg:col-span-2">
              {/* 装饰纹理与高光 / Decorative texture and highlight */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/30" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,136,118,0.09),_transparent_60%)]" />

              <div className="relative z-10">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-serif font-bold tracking-tight text-ink">计划简介</h2>
                  <span className="text-xs font-sans uppercase tracking-[0.35em] text-ink/50">Program Overview</span>
                </div>

                <div className="mt-6 max-w-3xl space-y-4 text-[1.05rem] leading-relaxed text-ink/85">
                  <p>浙江大学晨兴文化中国人才计划于 2008 年创办，是一个非学分制、跨学科的精英培养项目，至今已累计培养 17 期 500 余位杰出学子。</p>
                  <p>
                    我们致力于在全校范围内选拔优秀学子，秉承
                    <span className="mx-1 font-serif font-bold text-primary underline decoration-primary/30 underline-offset-4">视域 · 情感 · 观点</span>
                    三位一体的培养理念，在全球化语境中重建文化自信。
                  </p>
                </div>

                <div className="mt-8 grid gap-4 border-t border-stone/40 pt-8 sm:grid-cols-2">
                  {PROGRAM_PILLARS.map((pillar) => (
                    <div
                      key={pillar.id}
                      className="group relative flex gap-4 rounded-2xl border border-transparent p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="font-serif text-lg font-bold">{pillar.id}</span>
                      </div>
                      <div>
                        <h4 className="font-serif font-semibold text-ink group-hover:text-primary">{pillar.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-ink/65">{pillar.description}</p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-4 left-10 hidden w-px bg-primary/15 sm:block"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-5">
                  <Button asChild size="lg" className="px-8 shadow-md shadow-primary/15 transition hover:-translate-y-0.5">
                    <Link href="/intro">了解计划</Link>
                  </Button>
                  <Link
                    className="inline-flex items-center text-base font-semibold text-primary/80 transition hover:text-primary"
                    href="/intro/mission"
                  >
                    <span>使命背景</span>
                    <span aria-hidden="true" className="ml-2 text-xl">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </Panel>

            <Panel className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-primary/10 bg-gradient-to-b from-[#fffefd] via-[#fbf7f2] to-[#f7f1ec] shadow-[0_25px_70px_-55px_rgba(150,46,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-md">
              {/* 寄语背景纹理 / Background texture for founder message */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(180,117,80,0.12),_transparent_65%)]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/50">Founder Message</p>
                    <h3 className="mt-1 text-xl font-serif font-semibold text-primary">创办人寄语</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden text-sm tracking-[0.6em] text-primary/30 [writing-mode:vertical-rl] sm:inline-flex">文化中国</span>
                    {/* 项目 Logo 恢复原色 / Project logo */}
                    <div className="relative h-12 w-12">
                      <Image alt="Project Icon" className="object-contain" fill src="/images/branding/icon.svg" />
                    </div>
                  </div>
                </div>

                <blockquote className="font-serif text-[1.05rem] leading-relaxed text-ink/90">
                  <span aria-hidden="true" className="mr-2 text-4xl leading-none text-primary/25">
                    “
                  </span>
                  中国的复兴不仅需要专业技术人才，更需要具有
                  <span className="mx-1 border-b border-primary/30 pb-0.5 text-primary">历史使命感</span>
                  、
                  <span className="mx-1 border-b border-primary/30 pb-0.5 text-primary">社会责任感</span>
                  与卓越领导能力的未来领袖。
                  <span aria-hidden="true" className="ml-2 text-4xl leading-none text-primary/25">
                    ”
                  </span>
                </blockquote>

                <div className="flex items-center justify-end gap-3">
                  <div className="h-px w-8 bg-primary/30" />
                  <p className="font-serif text-lg text-primary">杜维明 · 周生春</p>
                </div>
              </div>

              <div className="relative z-10 mt-6 flex justify-end border-t border-primary/10 pt-4">
                <Button asChild size="sm" variant="ghost" className="text-ink/70 transition hover:text-primary hover:bg-primary/5">
                  <Link href="/intro/mission">阅读完整背景 → </Link>
                </Button>
              </div>
            </Panel>
          </div>
          <Section className="mt-10" title="计划亮点 / Highlights">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {HIGHLIGHT_CARDS.map((card, index) => (
                <Panel
                  key={card.title}
                  className="group relative flex h-full flex-col rounded-[26px] border border-stone bg-canvas/pure p-8 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex flex-1 flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/40">Highlight</p>
                        <h3 className="mt-1 text-lg font-serif font-semibold text-ink">{card.title}</h3>
                      </div>
                      <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 font-serif text-sm text-primary/60">
                        {`0${index + 1}`}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-ink/70">{card.summary}</p>
                    <p className="text-sm leading-relaxed text-ink/60">{card.support}</p>
                  </div>
                  <Button
                    asChild
                    className="mt-6 w-full justify-center border-primary/20 text-primary transition group-hover:-translate-y-0.5 group-hover:border-primary group-hover:bg-primary/5 group-hover:text-primary"
                    variant="outline"
                  >
                    <Link href={card.href}>{card.cta}</Link>
                  </Button>
                </Panel>
              ))}
            </div>
          </Section>


          <Section
            title="近期活动动态 / Latest Updates"
          >
            <Suspense fallback={<UpdatesSkeleton />}>
              <LatestUpdatesSection />
            </Suspense>
          </Section>

          <Section  title="校友与师资 / Alumni & Community">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Panel className="lg:col-span-2 hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-xl font-serif font-semibold text-ink">师资墙</h3>
                <p className="mt-3 text-base leading-relaxed text-ink/75">海内外学者、企业家、社会领袖担任导师，提供长期陪伴式指导。</p>

                <FacultyCarousel
                  faculty={[
                    {
                      name: "陈启宗",
                      title: "香港恒隆集团主席",
                      img: "/images/people/faculty_portrait/chenqizong.png",
                      url: "https://zh.wikipedia.org/wiki/%E9%99%B3%E5%95%9F%E5%AE%97",
                    },
                    {
                      name: "杜维明",
                      title: "哈佛燕京学社前社长",
                      img: "/images/people/faculty_portrait/duweiming.png",
                      url: "https://zh.wikipedia.org/wiki/%E6%9D%9C%E7%BB%B4%E6%98%8E",
                    },
                    {
                      name: "蒋岳祥",
                      title: "浙江大学经济学院教授",
                      img: "/images/people/faculty_portrait/jiangyuexiang.png",
                      url: "https://baike.baidu.com/item/%E8%92%8B%E5%B2%B3%E7%A5%A5/148831",
                    },
                    {
                      name: "梁元生",
                      title: "香港中文大学教授",
                      img: "/images/people/faculty_portrait/liangyuansheng.png",
                      url: "https://zh.wikipedia.org/wiki/%E6%A2%81%E5%85%83%E7%94%9F",
                    },
                    {
                      name: "郑培凯",
                      title: "香港城市大学教授",
                      img: "/images/people/faculty_portrait/zhengpeikai.png",
                      url: "https://baike.baidu.com/item/%E9%83%91%E5%9F%B9%E5%87%AF/10222268",
                    },
                  ]}
                />

                <div className="mt-8">
                  <Button
                    asChild
                    className="group w-full border-primary/20 text-primary transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-md sm:w-auto"
                    size="lg"
                    variant="outline"
                  >
                    <Link className="inline-flex items-center gap-2" href="/intro/faculty">
                      <span>查看师资详情</span>
                      <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </Button>
                </div>
              </Panel>

              <Panel className="flex h-full flex-col hover:-translate-y-1 hover:shadow-xl">
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-semibold text-ink">社群概览</h3>
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
                </div>
                <div className="mt-8">
                  <Button
                    asChild
                    className="group w-full border-primary/20 text-primary transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-md"
                    size="lg"
                    variant="outline"
                  >
                    <Link className="inline-flex items-center gap-2" href="/alumni">
                      <span>学员风采</span>
                      <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </Button>
                </div>
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

      <div className="mt-8 flex justify-center">
        <Button
          asChild
          className="group border-primary/20 text-primary transition hover:-translate-y-0.5 hover:border-primary hover:bg-primary/5 hover:shadow-md"
          size="lg"
          variant="outline"
        >
          <Link className="inline-flex items-center gap-2" href="/activities">
            <span>查 看 全 部 活 动</span>

          </Link>
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
