import Image from "next/image";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function IntroFacultyPage() {
  const faculty = [
    {
      name: "陈启宗",
      img: "/images/people/faculty_portrait/chenqizong.png",
      bio: "香港恒隆集团主席，亚洲协会理事长",
    },
    {
      name: "杜维明",
      img: "/images/people/faculty_portrait/duweiming.png",
      bio: "哈佛燕京学社前社长, 美国人文社会科学院院士",
    },
    {
      name: "蒋岳祥" ,
      img: "/images/people/faculty_portrait/jiangyuexiang.png",
      bio: "浙江大学经济学院教授、博士生导师，浙江大学证券与期货研究所所长",
    },
    {
      name: "梁元生",
      img: "/images/people/faculty_portrait/liangyuansheng.png",
      bio: "香港中文大学教授，文学院院长",
    },
    {
      name: "郑培凯",
      img: "/images/people/faculty_portrait/zhengpeikai.png",
      bio: "香港城市大学教授中国文化中心主任",
    },
  ];

  return (
    <PageShell>
      <PageEnter>
        <PageHeader 
          breadcrumbs={[
            { label: "首页", href: "/" },
            { label: "计划介绍", href: "/intro" },
            { label: "师资嘉宾", href: "/intro/faculty" },
          ]}
          title="师资嘉宾" 
          subtitle="导师团队与嘉宾信息" 
        />

        <Section description="部分导师简介。" title="导师团队">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {faculty.map((f) => (
              <Panel key={f.name} className="h-full">
                <div className="overflow-hidden rounded-xl">
                  <Image src={f.img} alt={f.name} width={1200} height={800} className="w-full h-44 object-cover" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-serif font-semibold text-ink">{f.name}</h3>
                  <p className="mt-3 text-base leading-relaxed tracking-wide text-ink/80">{f.bio}</p>
                </div>
              </Panel>
            ))}
          </div>
        </Section>

        <Panel>
          <p className="text-base leading-relaxed text-ink/80">更多导师与嘉宾信息将陆续更新，或在专题页面中发布详细访谈与讲座记录。</p>
        </Panel>

      </PageEnter>
    </PageShell>
  );
}





