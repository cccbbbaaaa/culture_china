import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { ExternalLink } from "lucide-react";
import { desc, inArray } from "drizzle-orm";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";
import { Button } from "@/components/ui/button";
import { externalResources } from "@/db/schema";
import { db } from "@/lib/db";
import { getResourceTypeLabel, getTypesBySection } from "@/lib/resource-types";

interface TimelineStep {
  title: string;
  description: string;
  period?: string;
  note?: string;
}

const ADMISSION_TYPES = getTypesBySection("admissions");

export const dynamic = "force-dynamic";

const formatDate = (value: Date | string | null) => {
  if (!value) return "日期待定";
  const date = value instanceof Date ? value : new Date(value);
  return Intl.DateTimeFormat("zh-CN", { dateStyle: "medium" }).format(date);
};

export default async function AdmissionsPage() {
  const steps: TimelineStep[] = [
    {
      title: "关注信息 / Follow",
      description: "请以官方微信公众号的当期招生推文为准，获取时间节点与报名表链接。",
      period: "每年 3 月 启动招生",
    },
    {
      title: "招生活动与报名提交 / Application Submission",
      description: "参加招生活动，全面了解文化中国项目，并按推文指引提交报名表。",
      period: "3 月 - 4 月",
    },
    {
      title: "选拔面试 / Interview",
      description: "3-5 月集中安排，短信/邮件通知，请保持联络畅通。",
      period: "4 月 - 5 月上旬",

    },
    {
      title: "录取名单公示与入班 / Admission",
      description: "录取后入班，参与课程、访学、论坛与导师制培养。",
      period: "5 - 6 月",

    },
  ];

  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[{ label: "首页", href: "/" }, { label: "招生信息", href: "/admissions" }]}
          subtitle="最新招生讯息，以微信公众号当期推文为准"
          title="招生信息 / Admissions"
        />



        <Section title="招生对象与规模">
          <Panel>
            <ul className="space-y-2 text-base leading-relaxed text-ink/80">
              <li>· 每年全校范围选拔约 30 名学生（低年级/高年级均可，需至少 1 年在校）。</li>
              <li>· 认同中华文化精神，致力于成为具全球视野的未来领袖人才。</li>
              <li>· 入班需保持出勤；如有 ≥4 个月线下交流计划，建议暂缓报名。</li>
            </ul>
          </Panel>
        </Section>

        <Section title="项目亮点 / Highlights">
          <Panel>
            <ul className="space-y-2 text-base leading-relaxed text-ink/80">
              <li>· 自 2008 年起已培养 16 期、489 名学员；已结业 424 人。</li>
              <li>· 50% 赴哈佛、MIT、斯坦福、耶鲁、牛津、剑桥等留学；34% 在北大、清华、浙大等深造。</li>
              <li>· 16% 自主创业或就业，涌现罗德学者、富布莱特学者、海内外高校教师、企业家与公益发起人。</li>
              <li>· 课程 + 访学 + 论坛 + 公益实践 + 导师制，全程关注与个别指导。</li>
            </ul>
          </Panel>
        </Section>

        <Section
          description="时间节点以当期公众号推文为准，以下为往年招生流程。"
          title="招生流程 / Timeline"
        >
          <div className="mx-auto max-w-2xl">
            <div className="relative space-y-8">
              {/* 居中的时间轴线 */}
              <div className="absolute left-8 top-0 h-full w-0.5 bg-stone/60"></div>
              {steps.map((step, index) => (
                <div key={step.title} className="relative flex items-start gap-6 pl-4">
                  {/* 时间轴节点 */}
                  <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-canvas">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  {/* 内容区域 */}
                  <div className="flex-1">
                    <div className="flex h-6 items-center">
                      {step.period && (
                        <p className="font-serif text-sm font-medium leading-none tracking-wide text-primary/90">
                          {step.period}
                        </p>
                      )}
                    </div>
                    <h4 className="mt-1 text-lg font-serif font-semibold text-ink">{step.title}</h4>
                    <p className="mt-2 font-serif text-sm leading-relaxed text-ink/75">{step.description}</p>
                    {step.note && <p className="mt-2 text-xs text-ink/50">{step.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>



        <Section  title="关注公众号 / Follow ">
          <Panel>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="relative h-28 w-28 overflow-hidden rounded border border-stone">
                <Image alt="公众号二维码 / WeChat QR" fill sizes="112px" src="/images/branding/wechat_code.jpg" />
              </div>
              <div>
                <p className="text-sm leading-relaxed text-ink/80">扫码关注获取最新招生动态与咨询入口（以最新推文为准）。</p>
                <p className="mt-2 text-sm text-ink/60">Scan for the latest admissions updates; follow the newest WeChat post.</p>
              </div>
            </div>
          </Panel>
        </Section>

        <Section description="同步公众号招生活动推文，方便快速获取报名相关动态。" title="往年招生回顾 / Recruitment Highlights">
          <Suspense fallback={<ListFallback message="招生活动加载中..." />}>
            <AdmissionsHighlights />
          </Suspense>
        </Section>
      </PageEnter>
    </PageShell>
  );
}

const AdmissionsHighlights = async () => {
  const resources = ADMISSION_TYPES.length
    ? await db
        .select({
          title: externalResources.title,
          summary: externalResources.summary,
          url: externalResources.url,
          type: externalResources.type,
          publishedAt: externalResources.publishedAt,
        })
        .from(externalResources)
        .where(inArray(externalResources.type, ADMISSION_TYPES))
        .orderBy(desc(externalResources.publishedAt), desc(externalResources.createdAt))
        .limit(6)
    : [];

  if (resources.length === 0) {
    return <Panel className="border-dashed text-sm text-ink/60">暂无招生活动推文。</Panel>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {resources.map((item) => (
        <Link
          key={`${item.title}-${item.url}`}
          className="group flex h-full flex-col rounded-xl border border-stone bg-canvas/pure p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          href={item.url}
          prefetch={false}
          rel="noreferrer"
          target="_blank"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-ink/60">{formatDate(item.publishedAt)}</p>
              <h3 className="mt-2 text-base font-serif font-semibold text-ink group-hover:text-primary">{item.title}</h3>
              <p className="mt-1 text-xs text-ink/55">{getResourceTypeLabel(item.type)}</p>
            </div>
            <ExternalLink className="mt-1 h-4 w-4 text-ink/50 group-hover:text-primary" />
          </div>
          <p className="mt-3 flex-1 text-sm text-ink/70">{item.summary || "点击查看微信公众号上的招生活动详情。"}</p>
        </Link>
      ))}
    </div>
  );
};

const ListFallback = ({ message }: { message: string }) => (
  <Panel className="border-dashed py-16 text-center text-sm text-ink/60">
    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-stone border-t-primary" />
    <p className="mt-4">{message}</p>
  </Panel>
);
