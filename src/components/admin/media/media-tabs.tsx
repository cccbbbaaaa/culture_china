"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface MediaTabsProps {
  current: "home_hero" | "activities_gallery";
}

const tabs = [
  { key: "home_hero" as const, label: "首页轮播 / Home hero", href: "/admin/media/home-hero" },
  { key: "activities_gallery" as const, label: "/activities 图库", href: "/admin/media/gallery" },
];

export const MediaTabs = ({ current }: MediaTabsProps) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-stone/30 bg-canvas/90 p-1">
      {tabs.map((tab) => {
        const isActive = current === tab.key || pathname === tab.href;
        return (
          <Link
            key={tab.key}
            href={tab.href}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-semibold transition",
              isActive ? "bg-primary text-canvas shadow-sm" : "text-ink/70 hover:bg-stone/20",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};

