import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function PurposePage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[
            { label: "首页", href: "/" },
            { label: "计划介绍", href: "/intro" },
            { label: "培养宗旨", href: "/intro/purpose" },
          ]}
          title="培养宗旨 / Purpose"
        />

        {/* 引言部分 / Introduction */}
        <div className="bg-gradient-to-r from-primary-dark via-primary to-primary-light text-canvas shadow-inner">
          <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <p className="text-left font-serif text-xl leading-relaxed text-canvas md:text-2xl">
                晨兴文化中国人才计划
                <br />
                旨在培养秉承中华文化之精神，
                <br />
                具有全球视野的未来社会各界的领袖人才。
              </p>
            </div>
          </div>
        </div>

        {/* 核心内容 / Core Content */}
        <section className="py-10">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[2fr,1fr]">
            <Panel className="space-y-4 border-stone/70 bg-canvas/pure text-base leading-relaxed tracking-wide text-ink/85">
              <p className="font-serif text-xl text-primary">
                “为天地立心，为生民立命，为往圣继绝学，为万世开太平。”
              </p>
              <p className="font-serif">
                文化中国以“认知 · 体验 · 反思 · 笃行”为教学主线，邀请海内外学者与社会实践者担任导师，在跨学科课堂、访学实践与公益行动中浸润文化精神。
              </p>
              <p className="font-serif">
                从中华传统治理之道到当代国际政治，从苏子的精神世界到多语境文化比较——同学们在丰厚的经典与现实议题之间自由穿梭，徜徉于无涯之知。
              </p>
              <p className="font-serif">
                “时而风乎舞雩，论道西子湖畔；时而荧屏传音，不拘山高水远；纵贯古今，上下俯仰；川流不息，渊澄取映。” 这是文化中国独有的精神风景。
              </p>
            </Panel>

            <Panel className="border-dashed border-primary/40 bg-gradient-to-b from-primary/10 to-transparent">
              <p className="text-sm uppercase tracking-[0.3em] text-primary">Core Motto</p>
              <p className="mt-4 font-serif text-lg leading-relaxed text-ink/85">
                视域（Horizon）· 情感（Empathy）· 观点（Perspective）——在全球化视野中重建中华文化自信。
              </p>
              <div className="mt-6 space-y-2 text-sm text-ink/70">
                <p>・ 17 期 · 500+ “文中人”</p>
                <p>・ 每期 30 位学员，导师制关注</p>
                <p>・ 海内外导师、跨界嘉宾共同参与</p>
              </div>
            </Panel>
          </div>
        </section>

        {/* 培养路径 / Pathways */}
        <Section title="培养路径 / Learning Journey" description="从课堂到世界现场，四个环节循环递进。">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              { title: "认知 · Cognition", body: "经典阅读、讲座与问题研讨，建立文化与思想的参照系。" },
              { title: "体验 · Experience", body: "国内外访学、社区实践，以身临其境的方式感知时代现场。" },
              { title: "反思 · Reflection", body: "导师工作坊、写作与对谈，在多维视角中自我校准。" },
              { title: "笃行 · Practice", body: "公益行动与跨界合作，把理念落到真实的社会议题与项目中。" },
            ].map((item) => (
              <Panel key={item.title} className="border-stone bg-canvas/pure shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <h3 className="font-serif text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.body}</p>
              </Panel>
            ))}
          </div>
        </Section>
      </PageEnter>
    </PageShell>
  );
}
