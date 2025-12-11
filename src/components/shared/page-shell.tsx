import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export interface PageShellProps {
  /**
   * 内容区域 / Page content
   */
  children: ReactNode;
  /**
   * 额外类名 / Extra class names
   */
  className?: string;
}

/**
 * 页面容器（统一宽度与内边距）
 * Page shell (consistent max width & padding)
 */
export const PageShell = ({ children, className }: PageShellProps) => {
  return (
    <div className={cn("mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
};

export interface PageHeaderProps {
  /**
   * 标题 / Title
   */
  title: string;
  /**
   * 副标题 / Subtitle
   */
  subtitle?: string;
  /**
   * 面包屑 / Breadcrumbs
   */
  breadcrumbs?: Array<{ label: string; href: string }>;
}

/**
 * 页面标题区（可选面包屑）
 * Page header (optional breadcrumbs)
 */
export const PageHeader = ({ title, subtitle, breadcrumbs }: PageHeaderProps) => {
  return (
    <header className="mb-10">
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-2 text-sm text-ink/70">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            return (
              <span key={item.href} className="flex items-center gap-2">
                {!isLast ? (
                  <Link className="transition-colors hover:text-primary" href={item.href}>
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-ink/90">{item.label}</span>
                )}
                {!isLast ? <span className="text-ink/40">/</span> : null}
              </span>
            );
          })}
        </nav>
      ) : null}

      <h1 className="text-hero font-serif text-primary">{title}</h1>
      {subtitle ? (
        <p className="mt-4 max-w-3xl text-base leading-relaxed tracking-wide text-ink/80">{subtitle}</p>
      ) : null}
    </header>
  );
};

export interface SectionProps {
  /**
   * 标题 / Heading
   */
  title: string;
  /**
   * 描述 / Description
   */
  description?: string;
  children: ReactNode;
  className?: string;
}

/**
 * 页面分区（标题 + 内容）
 * Page section (heading + content)
 */
export const Section = ({ title, description, children, className }: SectionProps) => {
  return (
    <section className={cn("py-8", className)}>
      <div className="mb-6">
        <h2 className="text-section text-ink">{title}</h2>
        {description ? (
          <p className="mt-2 max-w-4xl text-sm leading-relaxed text-ink/70 sm:text-base">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
};

export interface PanelProps {
  /**
   * 内容 / Content
   */
  children: ReactNode;
  className?: string;
}

/**
 * 轻量卡片容器（非 shadcn Card，避免引入额外依赖）
 * Lightweight panel (not shadcn Card to keep baseline minimal)
 */
export const Panel = ({ children, className }: PanelProps) => {
  return (
    <div className={cn("rounded-xl border border-stone bg-canvas/pure p-6 shadow-sm", className)}>{children}</div>
  );
};
