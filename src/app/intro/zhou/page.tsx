import Link from "next/link";
import Image from "next/image";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";
import { Button } from "@/components/ui/button";

export default function IntroZhouColumnPage() {
  return (
    <PageShell>
      <PageEnter>
        <PageHeader 
          breadcrumbs={[
            { label: "首页", href: "/" },
            { label: "计划介绍", href: "/intro" },
            { label: "周老师专栏", href: "/intro/zhou" },
          ]}
          title="周老师专栏" 
          subtitle="纪念周生春老师——文化中国永恒的启明星" 
        />

        <Section title="周老师简介">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
            <div className="md:col-span-1">
              <div className="overflow-hidden rounded-lg shadow-sm">
                <Image
                  src="/images/people/zhou/zhou.jpeg"
                  alt="周生春教授"
                  width={800}
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="mt-4 space-y-4 text-ink/90 tracking-wide leading-relaxed">
                <p>
                  周生春教授1947年8月29日出生于苏州，1986年于北京大学获历史系博士学位，其后治学从教于浙江大学，期间先后任教于浙江大学哲学系、哲学社会科学系、经济学院、公共管理学院，为浙江大学儒商与东亚文明研究中心及“浙江大学晨兴文化中国人才计划”之主要创办者。教授研究广泛，先后编纂《吴越春秋辑校汇考》《〈老子〉注评》《经典会读·孟子》等著作十余部，并发表《论宋代浙西、江东水利田的异同及利弊》《帛书〈老子〉道论试探》《四库宋代方志提要补正》《论孔子为学的历程及其思想的演变》等学术论文五十余篇。
                </p>
                <p>
                  周生春教授怀德抱术，以启蒙新学为己任，引导学生以中国传统优秀思想为内核，开拓其视野，拔擢其精神，并在各界同仁关怀和帮助下，为浙江大学及社会培养了众多兼具理想、能力和责任感的优秀人才。周生春先生将其一生奉献给讲台，毕其所有心力为学生，师风谆谆，下自成蹊。
                </p>
                <p>
                  除研究教学外，周生春教授将全部身心投入到“晨兴文化中国人才计划”的学生培养中。他的文字与教育理念继续为一代代文中学子铭记与传承。
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="纪念栏目">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Panel>
              <h3 className="text-lg font-serif font-semibold text-ink">论文集</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">周生春教授学术论文集 。</p>
              <div className="mt-4">
                <Button asChild variant="outline">
                <Link href="https://zhoushengchun.life/docs/papers/">进入</Link>
                </Button>
              </div>
            </Panel>
            <Panel>
              <h3 className="text-lg font-serif font-semibold text-ink">影像</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">周老师在文中留下的影像资料。</p>
              <div className="mt-4">
                <Button asChild variant="outline">
                <Link href="https://zhoushengchun.life/docs/videos/">进入</Link>
                </Button>
              </div>            
            </Panel>
            <Panel>
              <h3 className="text-lg font-serif font-semibold text-ink">纪念文章</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">学生与故交的追忆文章。</p>
              <div className="mt-4">
                <Button asChild variant="outline">
                <Link href="https://zhoushengchun.life/posts/">进入</Link>
                </Button>
              </div>            
            </Panel>
          </div>
        </Section>

      </PageEnter>
    </PageShell>
  );
}





