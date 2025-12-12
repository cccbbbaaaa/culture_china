import Image from "next/image";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

interface TimelineStep {
  title: string;
  description: string;
  date: string;
  note?: string;
}

export default function AdmissionsPage() {
  const steps: TimelineStep[] = [
    {
      title: "关注信息 / Follow",
      description: "请以官方微信公众号的当期招生推文为准，获取时间节点与报名表链接。",
      date: "以推文为准",
    },
    {
      title: "建议提交 / Early Submit",
      description: "优先安排首轮面试，建议按推文推荐时间提交报名表与在线表单。",
      date: "推荐：3/16 23:59",
      note: "具体以当期推文为准",
    },
    {
      title: "最终截止 / Deadline",
      description: "按推文指引完成报名表与在线表单提交。",
      date: "最终：3/23 23:59",
      note: "以当期推文时间为准",
    },
    {
      title: "选拔面试 / Interview",
      description: "3-5 月集中安排，短信/邮件通知，请保持联络畅通。",
      date: "3 月下旬 - 5 月上旬",
      note: "以推文通知为准",
    },
    {
      title: "录取与入班 / Admission",
      description: "录取后入班，参与课程、访学、论坛与导师制培养。",
      date: "滚动通知",
    },
  ];

  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[{ label: "首页", href: "/" }, { label: "招生信息", href: "/admissions" }]}
        subtitle="最新招生时间与表单以微信公众号当期推文为准；下方为概要说明。"
        title="招生信息 / Admissions"
      />

      <Section title="招生概览 / Overview">
        <Panel>
          <div className="space-y-3 text-base leading-relaxed text-ink/85">
            <p>“培养秉承中华文化之精神、具全球视野的未来社会各界领袖人才。” 你好，这里是文化中国。</p>
            <p className="text-sm text-ink/65">
              最新信息请以公众号招生推文为准；本页为概要，时间节点与表单链接以当期推文为准。
            </p>
          </div>
        </Panel>
      </Section>

      <Section title="招生对象与规模">
        <Panel>
          <ul className="space-y-2 text-base leading-relaxed text-ink/80">
            <li>· 每年全校范围选拔约 30 名学生（低年级/高年级均可，需至少 1 年在校）。</li>
            <li>· 认同中华文化精神，致力于成为具全球视野的未来领袖人才。</li>
            <li>· 入班需保持出勤；如有 ≥4 个月线下交流计划，建议暂缓报名（以推文要求为准）。</li>
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

      <Section title="招生流程 / Timeline" description="时间节点以当期公众号推文为准，以下为典型节奏示例。">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <Panel key={step.title} className="flex h-full flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-serif font-semibold text-ink">{step.title}</h3>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary/90">{step.date}</span>
              </div>
              <p className="text-sm leading-relaxed text-ink/70">{step.description}</p>
              {step.note ? <p className="text-xs text-ink/50">{step.note}</p> : null}
            </Panel>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink/60">以上时间为示例，请以公众号当期招生推文为准。</p>
      </Section>

      <Section title="报名提示 / How to Apply">
        <Panel>
          <div className="space-y-2 text-base leading-relaxed text-ink/80">
            <p>· 报名表与在线表单链接以当期公众号推文为准，请优先查阅最新推文。</p>
            <p>· 建议在推文中的“建议提交时间”前提交，便于尽早安排首轮面试。</p>
            <p className="text-sm text-ink/65">
              Note: 请关注“文化中国成才俱乐部”公众号，最新招生推文和表单链接以公众号发布为准。
            </p>
          </div>
        </Panel>
      </Section>

      <Section description="突出公众号二维码与咨询方式（后续替换为真实二维码）。" title="关注引导 / CTA">
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
    </PageShell>
  );
}
