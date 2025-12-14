import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";

export default function PurposePage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumbs={[
          { label: "首页", href: "/" },
          { label: "计划介绍", href: "/intro" },
          { label: "培养宗旨", href: "/intro/purpose" },
        ]}
        title="培养宗旨"
      />

      <Section title="“晨兴文化中国人才计划”旨在培养秉承中华文化之精神，具有全球视野的未来社会各界的领袖人才。">
        <Panel>
          <div className="mt-4 space-y-4 text-ink/90 tracking-wide leading-relaxed">
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
        </Panel>
      </Section>

    </PageShell>
  );
}
