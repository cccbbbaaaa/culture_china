"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export interface AdminNavItem {
  label: string;
  description: string;
  href: string;
}

interface AdminNavProps {
  items: AdminNavItem[];
  variant?: "vertical" | "pill";
}

export const AdminNav = ({ items, variant = "vertical" }: AdminNavProps) => {
  const pathname = usePathname();

  if (variant === "pill") {
    return (
      <nav className="flex flex-wrap gap-3">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group min-w-[220px] flex-1 rounded-3xl border px-4 py-3 text-left transition hover:border-primary/60",
                isActive
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-stone/50 bg-canvas text-ink",
              )}
            >
              <p className="text-sm font-serif font-semibold">{item.label}</p>
              <p className="text-xs text-ink/70">{item.description}</p>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="w-full max-w-xs border-r border-stone/50 bg-canvas">
      <ul className="space-y-1 p-4">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-xl border border-transparent px-4 py-3 transition hover:border-stone hover:bg-stone/20",
                  isActive && "border-primary bg-primary/10 text-primary",
                )}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs text-ink/70">{item.description}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

