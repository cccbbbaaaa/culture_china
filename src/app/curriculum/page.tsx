import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { PageEnter } from "@/components/shared/page-enter";
import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

interface CurriculumItem {
  title: string;
  dateLabel: string;
  href: string;
}

export default function CurriculumPage() {
  const items: CurriculumItem[] = [
    {
      title: "新闻场记｜示例链接",
      dateLabel: "2025-XX-XX",
      href: "https://mp.weixin.qq.com/",
    },
    {
      title: "课程大纲｜示例链接",
      dateLabel: "2024-XX-XX",
      href: "https://mp.weixin.qq.com/",
    },
  ];

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "课程教学", href: "/curriculum" }]}
          subtitle="历史资料归档与轻量化展示；主要通过外部链接引用微信公众号内容。"
          title="课程教学 / Curriculum"
        />

        <Section description="以时间轴/列表的方式呈现课程活动与教学内容。" title="新闻场记 / Notes">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {items.map((item) => (
              <Link
                key={item.title}
                className="group block rounded-xl border border-stone bg-canvas/pure p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                href={item.href}
                rel="noreferrer"
                target="_blank"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs text-ink/60">{item.dateLabel}</p>
                    <h3 className="mt-2 text-base font-serif font-semibold text-ink group-hover:text-primary">
                      {item.title}
                    </h3>
                  </div>
                  <ExternalLink className="mt-1 h-4 w-4 text-ink/50 group-hover:text-primary" />
                </div>
                <p className="mt-3 text-sm text-ink/70">说明占位：点击跳转到微信公众号推文。</p>
              </Link>
            ))}
          </div>
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
