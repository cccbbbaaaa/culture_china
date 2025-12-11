import Link from "next/link";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { Button } from "@/components/ui/button";

export default function IntroPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[{ label: "首页", href: "/" }, { label: "计划介绍", href: "/intro" }]}
        subtitle="静态内容为主，强调图文排版；后续可逐步补齐师资嘉宾与专栏内容。"
        title="计划介绍 / Program Introduction"
      />

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

      <Section
        description="后续将补齐：师资嘉宾（导师名录）、周老师专栏、项目历史资料等。"
        title="待扩展 / Coming Soon"
      >
        <Panel className="border-dashed">
          <p className="text-sm leading-relaxed text-ink/70">
            这里预留“师资嘉宾 / Faculty”、“专栏 / Column”等入口。当前阶段先保证路由连通与版式基线。
          </p>
        </Panel>
      </Section>
    </PageShell>
  );
}
