import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
import { PageEnter } from "@/components/shared/page-enter";
import { PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

interface ExternalResource {
  title: string;
  description: string;
  href: string;
  tag: string;
}

export default function HomePage() {
  const slides: HeroSlide[] = [
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

  const latestUpdates: ExternalResource[] = [
    {
      title: "课程场记｜示例链接 01",
      description: "以外部链接引用微信公众号推文（占位数据）。",
      href: "https://mp.weixin.qq.com/",
      tag: "课程教学",
    },
    {
      title: "特色活动｜示例链接 02",
      description: "展示项目活力与对外交流成果（占位数据）。",
      href: "https://mp.weixin.qq.com/",
      tag: "特色活动",
    },
    {
      title: "校友随笔｜示例链接 03",
      description: "混合内容策略：部分内容为固定页面，部分为外链（占位数据）。",
      href: "https://mp.weixin.qq.com/",
      tag: "学员风采",
    },
  ];

  return (
    <div>
      {/* 顶部品牌标语带 / Slogan band */}
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
        <HeroCarousel slides={slides} />
      </div>

      <PageShell className="pt-12">
        <PageEnter>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Panel className="lg:col-span-2">
              <h2 className="text-section text-ink">文化中国介绍 / Project Overview</h2>
              <p className="mt-4 max-w-4xl text-base leading-relaxed tracking-wide text-ink/85">
                “晨兴文化中国人才计划”是一个非学分制、精英化的跨学科教育项目，旨在培养具有全球视野且认同中华传统文化的未来领袖。
              </p>
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-ink/75">
                It is an interdisciplinary program designed to cultivate future leaders with a global horizon and a deep
                commitment to Chinese cultural traditions.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button asChild size="lg">
                  <Link href="/intro">了解更多 / Learn more</Link>
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
                <Image
                  alt="Banner / 横幅"
                  className="h-52 w-full object-cover"
                  height={520}
                  src="/images/branding/banner.png"
                  width={1000}
                />
              </div>
            </Panel>
          </div>

          <Section
            description="聚合课程教学、特色活动等最新内容；当前为占位数据，后续将对接 resources 表。"
            title="近期活动动态 / Latest Updates"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {latestUpdates.map((item) => (
                <Link
                  key={item.title}
                  className="group block rounded-xl border border-stone bg-canvas/pure p-7 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  href={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium tracking-wide text-accent">{item.tag}</p>
                      <h3 className="mt-3 text-lg font-serif font-semibold text-ink group-hover:text-primary">
                        {item.title}
                      </h3>
                    </div>
                    <ExternalLink className="mt-1 h-4 w-4 text-ink/50 transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-ink/75">{item.description}</p>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild size="lg" variant="secondary">
                <Link href="/activities">查看全部活动 / View all activities</Link>
              </Button>
            </div>
          </Section>

          <Section
            description="展示师资密度与社群底蕴；当前为占位，后续将对接 faculty/alumni 表。"
            title="校友与师资 / Alumni & Community"
          >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <Panel className="lg:col-span-2">
                <h3 className="text-xl font-serif font-semibold text-ink">师资墙 / Faculty Wall</h3>
                <p className="mt-3 text-base leading-relaxed text-ink/75">
                  横向滚动展示导师头像（示例），后续可加入详情页与筛选。
                </p>

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
                        <Image
                          alt="导师头像 / Faculty avatar"
                          className="object-cover"
                          fill
                          sizes="80px"
                          src={src}
                        />
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
                <p className="mt-6 text-base leading-relaxed text-ink/75">
                  这里将接入后台录入的结构化数据，用于真实展示与运营配置（置顶/推荐）。
                </p>
              </Panel>
            </div>
          </Section>

          {/* 结尾引导语 / Closing mantra */}
          <div className="mt-16 overflow-hidden rounded-3xl border border-stone/60 bg-gradient-to-r from-canvas via-primary/8 to-canvas shadow-sm">
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center sm:py-14">
              <p className="text-2xl font-serif font-semibold text-ink">认知 · 体验 · 反思 · 笃行</p>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-ink/70">
                COGNITION · EXPERIENCE · REFLECTION · PRACTICE
              </p>
            </div>
          </div>
        </PageEnter>
      </PageShell>
    </div>
  );
}


