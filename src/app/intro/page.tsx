import Link from "next/link";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

export default function IntroPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[{ label: "首页", href: "/" }, { label: "计划介绍", href: "/intro" }]}
        subtitle="非学分制、跨学科精英培养：秉承中华文化精神，具全球视野。"
        title="计划介绍 / Program Introduction"
      />

      <Section title="项目概览 / Overview">
        <Panel>
          <div className="space-y-3 text-base leading-relaxed text-ink/85">
            <p>浙江大学晨兴文化中国人才计划（2008 年创办），致力于培养秉承中华文化精神、具全球视野的未来社会各界领袖。</p>
            <p className="text-sm text-ink/65">
              最新动态请关注公众号“文化中国成才俱乐部”，以当期推文为准（课程/访学/招生时间等）。
            </p>
          </div>
        </Panel>
      </Section>

      <Section title="核心理念 / Mission & Principles">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">使命 / Mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              “为天地立心，为生民立命，为往圣继绝学，为万世开太平。” 培养兼具理想与担当的未来领袖。
            </p>
          </Panel>
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">培养维度 / Horizon · Empathy · Perspective</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">视域（全球广度）· 情感（文化认同）· 观点（独立思考）。</p>
            <p className="mt-1 text-sm leading-relaxed text-ink/70">教学路径：认知 → 体验 → 反思 → 笃行。</p>
          </Panel>
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">导师与社群</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              邀请国内外学者、企业家、社会领袖担任导师，形成高黏性的“文中人”校友网络与终身关注。
            </p>
          </Panel>
        </div>
      </Section>

      <Section
        description="从使命背景到培养宗旨，帮助访客快速理解项目定位与价值。"
        title="核心页面 / Core Pages"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">使命背景 / Mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">项目历史、愿景与精神坐标。</p>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href="/intro/mission">进入 / Open</Link>
              </Button>
            </div>
          </Panel>

          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">培养宗旨 / Purpose</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">核心教育理念与培养维度。</p>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href="/intro/purpose">进入 / Open</Link>
              </Button>
            </div>
          </Panel>

          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">儒商中心 / Center</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">相关平台介绍与资源导览。</p>
            <div className="mt-4">
              <Button asChild variant="outline">
                <Link href="/intro/center">进入 / Open</Link>
              </Button>
            </div>
          </Panel>
        </div>
      </Section>

      <Section title="运作与成果 / Operations & Outcomes">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">选拔与培养</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink/70">
              <li>· 每年全校跨专业选拔约 30 人，独立成班，导师制+小班研讨。</li>
              <li>· 核心活动：经典会读、年度论坛、海外/境外访学、公益实践、内部沙龙。</li>
              <li>· 教学原则：认知—体验—反思—笃行，强调知行合一。</li>
            </ul>
          </Panel>
          <Panel>
            <h3 className="text-lg font-serif font-semibold text-ink">校友与去向</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink/70">
              <li>· 已培养 16 期 489 人，结业 424 人。</li>
              <li>· 50% 赴哈佛、MIT、斯坦福、耶鲁、牛津、剑桥等深造；34% 北大/清华/浙大等；16% 创业或就业。</li>
              <li>· 涌现罗德学者、富布莱特学者、海内外高校教师、企业家与公益发起人。</li>
            </ul>
          </Panel>
        </div>
      </Section>

      <Section title="资料与专栏 / Resources">
        <Panel className="border-dashed">
          <ul className="space-y-2 text-sm leading-relaxed text-ink/70">
            <li>· 师资嘉宾 / Faculty（导师名录，近期将补充）</li>
            <li>· 周老师专栏 / Column（观点文章与随笔，待上线）</li>
            <li>· 项目历史 / Archive（历届活动、论坛、访学资料，逐步整理）</li>
          </ul>
        </Panel>
      </Section>
    </PageShell>
  );
}
