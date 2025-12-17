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
        <section className="py-8">
          <div className="mx-auto max-w-3xl space-y-5 font-serif text-base leading-relaxed tracking-wide text-ink/85">
            <p>
              为天地立心，为生民立命，为往圣继绝学，为万世开太平。
            </p>
            <p>
              文化中国从认知、体验、反思、笃行的教学原则着手设置课程，邀请海内外著名学者、社会各界杰出人士传道授业，担任导师。
            </p>
            <p>
              从中华传统治理之道到国际政治，从苏子的精神世界到世界视域下的东亚语言文化……徜徉于无涯之知，无尽之学。
            </p>
            <p>
              时而风乎舞雩，论道西子湖畔；时而荧屏传音，不拘山高水远；纵贯古今，上下俯仰；川流不息，渊澄取映。
            </p>
          </div>
        </section>
      </PageEnter>
    </PageShell>
  );
}
