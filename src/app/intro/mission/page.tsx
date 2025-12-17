import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

const summaryParagraphs = [
  "21世纪全球科技迅猛发展，不同文明的冲突与对话并存，人类的发展更迫切地需要交流、包容与融合，倡导“和而不同”、和平发展的中国，将成为推动世界和平发展与繁荣的重要力量。中国的复兴与世界的和平发展不仅需要专业技术人才，更需要具有崇高理想和远大抱负，道德高尚、视野开阔、勇于奉献、具有历史使命感和社会责任感的卓越组织领导才能的领袖人才。",
  "“大学之道，在明明德，在亲民，在止于至善”。2008年，哈佛大学杜维明教授、浙江大学周生春教授联合发起了“浙江大学文化中国人才计划”，并由周生春教授（2008-2022）、蒋岳祥教授（2022- ）先后担任责任教授，旨在培养秉承中华文化之精神、具有全球视野的未来社会各界的领袖人才。",
  "浙江大学晨兴文化中国人才计划每年在全校范围内选拔30名优秀本科生，在保持其各自主修专业的基础上独立成班，邀请海内外著名学者、社会各界杰出人士传道授业，担任导师，学生经过两年学习（高年级为一年），完成初阶学业。",
  "该人才计划以人为本，以专业为辅，提倡两者融会贯通、相辅相成的教育理念，着眼人的全面发展和综合素质的培养，强调知行合一和博学、审问、慎思、明辨、笃行的学风，并予受业学生以终其一生的关注与个别指导。",
];

const pillars = [
  {
    title: "价值使命",
    description:
      "“为天地立心，为生民立命”——以人文精神滋养未来领袖，锻造担当、远见与服务社会的品格。",
  },
  {
    title: "培养路径",
    description:
      "经典研读 × 海外访学 × 田野实践 × 学术论坛，构建“认知-体验-反思-笃行”的闭环培养体系。",
  },
  {
    title: "导师联盟",
    description:
      "邀请国内外知名学者、企业家、社会领军人物担任导师，提供长期陪伴式指导与个性化发展规划。",
  },
];

const stats = [
  { label: "累计培养期数", value: "17 期", note: "2008-2025" },
  { label: "培养学员", value: "519 人", note: "已结业学员 459 人" },
];

const careerPaths = [
  { label: "海外深造", value: "50%", description: "哈佛、MIT、剑桥等顶尖学府", count: "约 260 人" },
  { label: "国内深造", value: "34%", description: "北大、清华、浙大、复旦等", count: "约 176 人" },
  { label: "创业 / 职业发展", value: "16%", description: "创业者、上市公司高管等", count: "约 83 人" },
];

const milestones = [
  {
    year: "2008",
    title: "计划发起",
    description: "杜维明、周生春教授联合发起“浙江大学文化中国人才计划”，首届学员成立。",
  },
  {
    year: "2012",
    title: "培养体系完善",
    description: "确立“选拔30人·导师制·两年制”培养模式，形成开放课程与访学并行体系。",
  },
  {
    year: "2022",
    title: "责任教授接力",
    description: "蒋岳祥教授接任责任教授，持续深化“文化中国”内涵与全球链接。",
  },
  {
    year: "至今",
    title: "培养成果",
    description: "累计培养 519 名学员，涌现罗德学者、富布莱特学者、知名创业者与公共领袖。",
  },
];

export default function MissionPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader
          breadcrumbs={[
            { label: "首页", href: "/" },
            { label: "计划介绍", href: "/intro" },
            { label: "使命背景", href: "/intro/mission" },
          ]}
          title="使命背景 / Mission & Background"
        />

      <section className="pt-4 pb-8">
        <div className="space-y-5 font-serif text-base leading-relaxed tracking-wide text-ink/85">
          {summaryParagraphs.map((paragraph) => (
            <p key={paragraph} className="indent-8">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <Section description="以文化为根，以世界为域，形成兼具精神引领与实践锻造的培养框架。" title="核心理念 / Core Pillars">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <Panel key={pillar.title} className="h-full border border-stone/70 bg-canvas/pure/80">
              <h3 className="text-xl font-serif font-semibold text-primary">{pillar.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-ink/80">{pillar.description}</p>
            </Panel>
          ))}
        </div>
      </Section>

      <Section description="十余年迭代中，文化中国计划持续在全球化、学术与社会实践之间搭建桥梁。" title="发展里程 / Timeline">
        <div className="mx-auto max-w-2xl">
          <div className="relative space-y-8">
            {/* 居中的时间轴线 */}
            <div className="absolute left-8 top-0 h-full w-0.5 bg-stone/60"></div>
            {milestones.map((milestone) => (
              <div key={milestone.year} className="relative flex items-start gap-6 pl-4">
                {/* 时间轴节点 */}
                <div className="z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-canvas">
                  <div className="h-2 w-2 rounded-full bg-primary"></div>
                </div>
                {/* 内容区域 */}
                <div className="flex-1">
                  <div className="flex h-6 items-center">
                    <p className="font-serif text-lg font-semibold leading-none tracking-wide text-ink/90">{milestone.year}</p>
                  </div>
                  <h4 className="mt-1 text-lg font-serif font-semibold text-ink">{milestone.title}</h4>
                  <p className="mt-2 font-serif text-sm leading-relaxed text-ink/75">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section description="来自全世界的认可，印证文化中国计划的影响力与生命力。" title="成果数据 / Impact Snapshot">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {stats.map((item) => (
            <Panel key={item.label} className="border border-primary/20 bg-primary/5 text-center">
              <p className="text-base font-medium text-ink/80">{item.label}</p>
              <p className="mt-3 text-3xl font-serif font-semibold text-primary">{item.value}</p>
              {item.note && <p className="mt-2 text-sm text-ink/70">{item.note}</p>}
            </Panel>
          ))}
        </div>

        <div className="mt-8">
          <h3 className="mb-6 text-center text-xl font-serif font-semibold text-ink">毕业去向 / Career Paths</h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {careerPaths.map((path) => (
              <Panel key={path.label} className="border border-primary/20 bg-primary/5 text-center">
                <p className="text-base font-medium text-ink/80">{path.label}</p>
                <p className="mt-3 text-4xl font-serif font-semibold text-primary">{path.value}</p>
                <p className="mt-2 text-sm font-medium text-ink/70">{path.count}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{path.description}</p>
              </Panel>
            ))}
          </div>
        </div>
      </Section>
      </PageEnter>
    </PageShell>
  );
}
