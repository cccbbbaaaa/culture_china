import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

interface ActivityItem {
  title: string;
  category: "年度论坛" | "访学交流" | "其他活动";
  coverSrc: string;
  href: string;
}

export default function ActivitiesPage() {
  const items: ActivityItem[] = [
    {
      title: "年度论坛｜2025 合影",
      category: "年度论坛",
      coverSrc: "/images/events/annual/2025-group-photo.png",
      href: "https://mp.weixin.qq.com/",
    },
    {
      title: "访学交流｜2023 US",
      category: "访学交流",
      coverSrc: "/images/events/visits/2023-us.jpg",
      href: "https://mp.weixin.qq.com/",
    },
    {
      title: "课程活动｜示例",
      category: "其他活动",
      coverSrc: "/images/events/course/bao-20251202.jpeg",
      href: "https://mp.weixin.qq.com/",
    },
  ];

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "特色活动", href: "/activities" }]}
          subtitle="展现项目活力与对外交流成果；图片可作为图库入口（当前为骨架占位）。"
          title="特色活动 / Featured Activities"
        />

        <Section description="后续将对接 resources 表并支持置顶/推荐。" title="活动列表 / Activity Feed">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.title}
                className="group block overflow-hidden rounded-xl border border-stone bg-canvas/pure shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                <div className="relative h-44">
                  <Image alt={`${item.title} 封面 / cover`} className="object-cover" fill sizes="(min-width: 768px) 33vw, 100vw" src={item.coverSrc} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <p className="text-xs font-medium tracking-wide text-accent">{item.category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-base font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
                    <ExternalLink className="mt-1 h-4 w-4 text-ink/50 group-hover:text-primary" />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-ink/70">说明占位：点击跳转到微信公众号推文。</p>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        <Section description="访学交流建议用 Gallery 形式展示精彩瞬间。" title="图库 / Gallery">
          <Panel className="border-dashed">
            <p className="text-sm text-ink/70">预留：瀑布流/灯箱预览、按年份筛选等。</p>
          </Panel>
        </Section>
      </PageEnter>
    </PageShell>
  );
}




