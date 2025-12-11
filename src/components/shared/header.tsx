"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

const navigation: Array<{ name: string; href: string }> = [
  { name: "首页", href: "/" },
  { name: "计划介绍", href: "/intro" },
  { name: "学员风采", href: "/alumni" },
  { name: "课程教学", href: "/curriculum" },
  { name: "特色活动", href: "/activities" },
  { name: "招生信息", href: "/admissions" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-stone bg-canvas/80 backdrop-blur-md">
      <nav aria-label="Global" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo / 标识 Logo */}
          <div className="flex items-center">
            <Link className="flex items-center space-x-3" href="/">
              <Image
                alt="文化中国 Logo"
                className="object-contain"
                height={40}
                src="/images/branding/logo.png"
                width={40}
              />
              <span className="hidden text-xl font-serif font-semibold text-primary sm:block">
                文化中国
              </span>
            </Link>
          </div>

          {/* Desktop Navigation / 桌面端导航 Desktop */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                className="font-medium text-ink transition-colors duration-200 hover:text-primary"
                href={item.href}
              >
                {item.name}
              </Link>
            ))}
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
        <div
          className={cn(
            "lg:hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 overflow-hidden opacity-0"
          )}
        >
          <div className="space-y-1 border-t border-stone px-2 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                className="block rounded-md px-3 py-2 text-ink transition-colors hover:bg-stone/50 hover:text-primary"
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};


