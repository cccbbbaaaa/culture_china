import Image from "next/image";

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
        <Section title="核心理念 / Core Philosophy">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Panel className="relative overflow-hidden rounded-[28px] border border-stone bg-gradient-to-b from-canvas/pure to-stone/5 shadow-[0_25px_70px_-50px_rgba(15,23,42,0.35)] transition hover:-translate-y-0.5 hover:shadow-md lg:col-span-2">
              {/* 装饰纹理与高光 / Decorative texture and highlight */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/30" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,136,118,0.09),_transparent_60%)]" />
              
              <div className="relative z-10 space-y-5">
                <div className="flex flex-wrap items-baseline gap-3">
                  <h2 className="text-3xl font-serif font-bold tracking-tight text-ink">培养理念</h2>
                  <span className="text-xs font-sans uppercase tracking-[0.35em] text-ink/50">Educational Philosophy</span>
                </div>
                
                <div className="space-y-4 text-base leading-relaxed tracking-wide text-ink/85">
                  <p className="font-serif text-xl text-primary">
                    &ldquo;为天地立心，为生民立命，为往圣继绝学，为万世开太平。&rdquo;
                  </p>
                  <p className="font-serif">
                    文化中国以
                    <span className="mx-1 font-serif font-bold text-primary underline decoration-primary/30 underline-offset-4">认知 · 体验 · 反思 · 笃行</span>
                    为教学主线，邀请海内外学者与社会实践者担任导师，在跨学科课堂、访学实践与公益行动中浸润文化精神。
                  </p>
                  <p className="font-serif">
                    从中华传统治理之道到当代国际政治，从苏子的精神世界到多语境文化比较——同学们在丰厚的经典与现实议题之间自由穿梭，徜徉于无涯之知。
                  </p>
                  <p className="font-serif">
                    &ldquo;时而风乎舞雩，论道西子湖畔；时而荧屏传音，不拘山高水远；纵贯古今，上下俯仰；川流不息，渊澄取映。&rdquo; 这是文化中国独有的精神风景。
                  </p>
                </div>
              </div>
            </Panel>

            <Panel className="relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-primary/10 bg-gradient-to-b from-[#fffefd] via-[#fbf7f2] to-[#f7f1ec] shadow-[0_25px_70px_-55px_rgba(150,46,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-md">
              {/* 寄语背景纹理 / Background texture */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(180,117,80,0.12),_transparent_65%)]" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-primary/50">Core Motto</p>
                    <h3 className="mt-1 text-xl font-serif font-semibold text-primary">核心要旨</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden text-sm tracking-[0.6em] text-primary/30 [writing-mode:vertical-rl] sm:inline-flex">文化中国</span>
                    <div className="relative h-12 w-12">
                      <Image alt="Project Icon" className="object-contain" fill src="/images/branding/icon.svg" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="font-serif text-lg leading-relaxed text-ink/85">
                    视域（Horizon）· 情感（Empathy）· 观点（Perspective）——在全球化视野中重建中华文化自信。
                  </p>
                  <div className="space-y-2 border-t border-primary/10 pt-4 text-sm text-ink/70">
                    <p>・ 17 期 · 500+ “文中人”</p>
                    <p>・ 每期 30 位学员，导师制关注</p>
                    <p>・ 海内外导师、跨界嘉宾共同参与</p>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </Section>

        {/* 培养路径 / Pathways */}
        <Section title="培养路径 / Learning Journey" description="从课堂到世界现场，四个环节循环递进。">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              { id: "01", title: "认知 · Cognition", body: "经典阅读、讲座与问题研讨，建立文化与思想的参照系。" },
              { id: "02", title: "体验 · Experience", body: "国内外访学、社区实践，以身临其境的方式感知时代现场。" },
              { id: "03", title: "反思 · Reflection", body: "导师工作坊、写作与对谈，在多维视角中自我校准。" },
              { id: "04", title: "笃行 · Practice", body: "公益行动与跨界合作，把理念落到真实的社会议题与项目中。" },
            ].map((item) => (
              <Panel
                key={item.id}
                className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-stone/60 bg-gradient-to-br from-canvas/pure to-white/70 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-md"
              >
                <div className="relative z-10 flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-primary/40">Pathway</p>
                      <h3 className="mt-1 text-lg font-serif font-semibold text-primary">{item.title}</h3>
                    </div>
                    <span className="rounded-full border border-primary/15 bg-primary/5 px-3 py-1 font-serif text-sm text-primary/60">
                      {item.id}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ink/75">{item.body}</p>
                </div>
              </Panel>
            ))}
          </div>
        </Section>
      </PageEnter>
    </PageShell>
  );
}
