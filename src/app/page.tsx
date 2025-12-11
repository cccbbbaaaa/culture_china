import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { HeroCarousel, type HeroSlide } from "@/components/home/hero-carousel";
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
    },
    {
      src: "/images/events/visits/2024-hk1.jpg",
      alt: "访学交流剪影 / Study visit moment",
      title: "以经典为骨，以世界为镜",
      subtitle: "以人文与学术的方式，培养具有全球视野的未来领袖。",
    },
    {
      src: "/images/events/course/bao-20251202.jpeg",
      alt: "课程教学现场 / Curriculum session moment",
      title: "知行合一，笃行致远",
      subtitle: "认知 → 体验 → 反思 → 笃行",
    },
    {
      src: "/images/events/visits/2023-us2.jpg",
      alt: "海外访学剪影 / Overseas study visit moment",
      title: "在世界现场，回到文化中国",
      subtitle: "以体验与反思连接传统与当代。",
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
      <HeroCarousel isFullBleed slides={slides} />

      <PageShell className="pt-10">
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Panel className="lg:col-span-2">
            <h2 className="text-section text-ink">文化中国介绍 / Project Overview</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed tracking-wide text-ink/80">
              “晨兴文化中国人才计划”是一个非学分制、精英化的跨学科教育项目，旨在培养具有全球视野且认同中华传统文化的未来领袖。
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild>
                <Link href="/intro">了解更多 / Learn more</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/intro/mission">使命背景 / Mission</Link>
              </Button>
            </div>
          </Panel>

          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">品牌视觉 / Visual</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              以“新中式”留白与沉稳配色为基调，强化高端、学术与人文的品牌气质。
            </p>
            <div className="relative mt-5 overflow-hidden rounded-xl border border-stone">
              <Image
                alt="Banner / 横幅"
                className="h-44 w-full object-cover"
                height={400}
                src="/images/branding/banner.png"
                width={800}
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
                className="group block rounded-xl border border-stone bg-canvas/pure p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium tracking-wide text-accent">{item.tag}</p>
                    <h3 className="mt-2 text-base font-serif font-semibold text-ink group-hover:text-primary">
                      {item.title}
                    </h3>
                  </div>
                  <ExternalLink className="mt-1 h-4 w-4 text-ink/50 transition-colors group-hover:text-primary" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{item.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Button asChild variant="secondary">
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
              <h3 className="text-lg font-serif font-semibold text-ink">师资墙 / Faculty Wall</h3>
              <p className="mt-2 text-sm text-ink/70">
                横向滚动展示导师头像（占位），后续可加入详情页与筛选。
              </p>

              <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
                {(
                  [
                    "/images/people/faculty/duweiming.png",
                    "/images/people/faculty/zhengpeikai.png",
                    "/images/people/faculty/liangyuansheng.png",
                    "/images/people/faculty/chenqizong.jpg",
                    "/images/people/faculty/jiangyuexiang.jpeg",
                  ] as const
                ).map((src, index) => (
                  <div key={index} className="min-w-[120px]">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full border border-stone">
                      <Image
                        alt="导师头像占位 / Faculty avatar placeholder"
                        className="object-cover"
                        fill
                        sizes="64px"
                        src={src}
                      />
                    </div>
                    <p className="mt-2 text-sm font-medium text-ink">导师 {index + 1}</p>
                    <p className="text-xs text-ink/60">Title / Affiliation</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild variant="outline">
                  <Link href="/intro">查看师资 / Faculty</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/alumni">学员风采 / Alumni</Link>
                </Button>
              </div>
            </Panel>

            <Panel>
              <h3 className="text-lg font-serif font-semibold text-ink">社群概览 / Community</h3>
              <dl className="mt-4 space-y-4">
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm text-ink/70">已培养期数</dt>
                  <dd className="text-2xl font-serif font-semibold text-primary">XX</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm text-ink/70">覆盖行业</dt>
                  <dd className="text-2xl font-serif font-semibold text-primary">XX</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt className="text-sm text-ink/70">年度活动</dt>
                  <dd className="text-2xl font-serif font-semibold text-primary">XX</dd>
                </div>
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-ink/70">
                这里将接入后台录入的结构化数据，用于真实展示与运营配置（置顶/推荐）。
              </p>
            </Panel>
          </div>
        </Section>
      </PageShell>
    </div>
  );
}


