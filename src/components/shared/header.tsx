"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ChevronDown, Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

type NavChild = { name: string; href: string };
type NavItem = { name: string; href: string; children?: NavChild[] };

const navigation: NavItem[] = [
  { name: "首页", href: "/" },
  {
    name: "计划介绍",
    href: "/intro",
    children: [
      { name: "使命背景", href: "/intro/mission" },
      { name: "培养宗旨", href: "/intro/purpose" },
      { name: "师资嘉宾", href: "/intro/faculty" },
      { name: "周老师专栏", href: "/intro/zhou" },
    ],
  },
  {
    name: "学员风采",
    href: "/alumni",
    children: [
      { name: "各期学员", href: "/alumni/profiles" },
      { name: "校友故事/随笔/专栏", href: "/alumni/stories" },
    ],
  },
  {
    name: "课程教学",
    href: "/curriculum",
    children: [
      { name: "新闻场记", href: "/curriculum/news" },
      { name: "课程介绍", href: "/curriculum/overview" },
    ],
  },
  {
    name: "特色活动",
    href: "/activities",
    children: [
      { name: "年度论坛", href: "/activities/forum" },
      { name: "访学交流", href: "/activities/visits" },
      { name: "其他", href: "/activities/others" },
    ],
  },
  { name: "招生信息", href: "/admissions" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenu, setMobileSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!mobileMenuOpen) setMobileSubmenu(null);
  }, [mobileMenuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone bg-canvas shadow-sm">
      <nav aria-label="Global" className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo / 标识 Logo */}
          <div className="flex items-center">
            <Link className="flex items-center gap-3" href="/">
              <Image
                alt="浙江大学晨兴文化中国人才计划 Icon / Program icon"
                className="object-contain"
                height={64}
                src="/images/branding/icon.svg"
                width={64}
              />
              <div className="hidden sm:block">
                <p className="text-lg font-serif font-semibold leading-tight text-primary md:text-xl xl:text-2xl">
                  浙江大学晨兴文化中国人才计划
                </p>
              </div>
              <span className="text-lg font-serif font-semibold text-primary sm:hidden">文化中国</span>
            </Link>
          </div>

          {/* Desktop Navigation / 桌面端导航 Desktop */}
          <div className="hidden lg:flex lg:flex-nowrap lg:items-center lg:gap-8">
            {navigation.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              return (
                <div key={item.name} className="group relative">
                  <Link
                    className="inline-flex items-center gap-1 whitespace-nowrap text-lg font-serif text-ink transition-colors duration-200 hover:text-primary xl:text-xl"
                    href={item.href}
                  >
                    {item.name}
                    {hasChildren ? <ChevronDown aria-hidden className="h-4 w-4 text-ink/60 transition group-hover:text-primary" /> : null}
                  </Link>
                  {hasChildren ? (
                    <div className="pointer-events-none absolute left-1/2 top-full z-40 w-56 -translate-x-1/2 pt-4 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="rounded-2xl border border-stone bg-canvas p-4 shadow-xl">
                        {item.children?.map((child) => (
                          <Link
                            key={child.name}
                            className="block rounded-lg px-3 py-2 text-base font-medium text-ink/80 transition hover:bg-stone/30 hover:text-primary"
                            href={child.href}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Mobile menu button / 移动端菜单按钮 Mobile */}
          <div className="flex lg:hidden">
            <button
              aria-label={mobileMenuOpen ? "关闭菜单" : "打开菜单"}
              className="inline-flex items-center justify-center p-2 text-ink hover:text-primary"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              type="button"
            >
              {mobileMenuOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation / 移动端导航 Mobile */}
        <div className={cn("lg:hidden transition-all duration-300 ease-in-out", mobileMenuOpen ? "max-h-[90vh] opacity-100" : "max-h-0 overflow-hidden opacity-0")}>
          <div className="space-y-3 border-t border-stone px-2 pb-4 pt-4">
            {navigation.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isOpen = mobileSubmenu === item.name;
              return (
                <div key={item.name} className="rounded-xl border border-stone/60 bg-canvas/90 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      className="text-base font-serif text-ink"
                      href={item.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileSubmenu(null);
                      }}
                    >
                      {item.name}
                    </Link>
                    {hasChildren ? (
                      <button
                        aria-label={`${isOpen ? "收起" : "展开"}${item.name}`}
                        className="rounded-full p-1 text-ink/70 transition hover:text-primary"
                        onClick={() => setMobileSubmenu(isOpen ? null : item.name)}
                        type="button"
                      >
                        <ChevronDown className={cn("h-5 w-5 transition-transform", isOpen ? "rotate-180" : "")} />
                      </button>
                    ) : null}
                  </div>
                  {hasChildren ? (
                    <div className={cn("space-y-1 overflow-hidden text-sm text-ink/80 transition-all", isOpen ? "max-h-96 pt-2" : "max-h-0")}>
                      {item.children?.map((child) => (
                        <Link
                          key={child.name}
                          className="block rounded-lg px-3 py-2 hover:bg-stone/40 hover:text-primary"
                          href={child.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileSubmenu(null);
                          }}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};






