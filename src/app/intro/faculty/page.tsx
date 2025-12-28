import Image from "next/image";
import Link from "next/link";

import { ExternalLink } from "lucide-react";

import { PageHeader, PageShell, Panel, Section } from "@/components/shared/page-shell";
import { PageEnter } from "@/components/shared/page-enter";

export default function IntroFacultyPage() {
  const faculty = [
    {
      name: "陈启宗",
      img: "/images/people/faculty_portrait/chenqizong.png",
      bio: "香港恒隆集团主席，亚洲协会理事长",
      url: "https://zh.wikipedia.org/wiki/%E9%99%B3%E5%95%9F%E5%AE%97",
    },
    {
      name: "杜维明",
      img: "/images/people/faculty_portrait/duweiming.png",
      bio: "哈佛燕京学社前社长, 美国人文社会科学院院士",
      url: "https://zh.wikipedia.org/wiki/%E6%9D%9C%E7%BB%B4%E6%98%8E",
    },
    {
      name: "蒋岳祥" ,
      img: "/images/people/faculty_portrait/jiangyuexiang.png",
      bio: "浙江大学经济学院教授、博士生导师，浙江大学证券与期货研究所所长",
      url: "https://baike.baidu.com/item/%E8%92%8B%E5%B2%B3%E7%A5%A5/148831",
    },
    {
      name: "梁元生",
      img: "/images/people/faculty_portrait/liangyuansheng.png",
      bio: "香港中文大学教授，文学院院长",
      url: "https://zh.wikipedia.org/wiki/%E6%A2%81%E5%85%83%E7%94%9F",
    },
    {
      name: "郑培凯",
      img: "/images/people/faculty_portrait/zhengpeikai.png",
      bio: "香港城市大学教授中国文化中心主任",
      url: "https://baike.baidu.com/item/%E9%83%91%E5%9F%B9%E5%87%AF/10222268",
    },
  ];

  const visitingFaculty = [
    { name: "Jose Friedman", title: "普利策奖得主" },
    { name: "Fred Schrader", title: "欧洲斯宾诺莎奖得主" },
    { name: "Martin Powers", title: "美国列文森奖得主" },
    { name: "Jonathan F. Fanton", title: "美国人文与科学院前主席" },
    { name: "Patrick O'Brien", title: "英国科学院院士" },
    { name: "Hans van Ess", title: "德国慕尼黑大学副校长" },
    { name: "尹晓煌", title: "中美富布莱特讲座教授" },
    { name: "白乐桑", title: "法国国民教育部汉语总督学" },
    { name: "资中筠", title: "中国社科院美国研究所前所长" },
    { name: "钱易", title: "中国工程院院士" },
    { name: "刘笑敢", title: "北京师范大学特聘教授" },
    { name: "李伯重", title: "北京大学人文讲席教授" },
    { name: "Josette Sheeran", title: "联合国粮农组织前总干事" },
    { name: "Charles Conn", title: "牛津大学罗德学院前院长" },
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
                <div className="relative overflow-hidden rounded-xl aspect-[3/2] bg-stone/10">
                  <Image
                    src={f.img}
                    alt={f.name}
                    width={1200}
                    height={800}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  {f.url ? (
                    <Link
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-2"
                    >
                      <h3 className="text-lg font-serif font-semibold text-ink transition-colors group-hover:text-primary">
                        {f.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-ink/50 transition-colors group-hover:text-primary" />
                    </Link>
                  ) : (
                    <h3 className="text-lg font-serif font-semibold text-ink">{f.name}</h3>
                  )}
                  <p className="mt-3 text-base leading-relaxed tracking-wide text-ink/80">{f.bio}</p>
                </div>
              </Panel>
            ))}
          </div>

          {/* 无头像导师名录 / Faculty without portraits */}
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {visitingFaculty.map((guest) => (
              <div
                key={guest.name}
                className="rounded-2xl border border-stone/40 bg-white/80 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-serif text-lg font-semibold text-ink">{guest.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{guest.title}</p>
              </div>
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






