"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface EntryGateProps {
  /**
   * 子内容（网站主体）/ Main site content
   */
  children: React.ReactNode;
  /**
   * 额外类名 / Extra class names
   */
  className?: string;
}

/**
 * 全屏开屏遮罩：每次进入首页都出现，点击任意位置消失
 * Fullscreen entry overlay: always shows on homepage, click anywhere to dismiss
 */
export const EntryGate = ({ children, className }: EntryGateProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    setIsOpen(isHome);
  }, [isHome, isReady]);

  useEffect(() => {
    if (!isReady) return;

    // 锁定滚动 / Lock scroll
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = isOpen ? "hidden" : originalOverflow;

    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [isOpen, isReady]);

  return (
    <div className={cn("relative", className)}>
      {children}

      <AnimatePresence>
        {isReady && isHome && isOpen ? (
          <motion.div
            aria-label="开屏遮罩 / Intro overlay"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] cursor-pointer overflow-y-auto bg-gradient-to-br from-primary-dark via-primary to-primary-light text-canvas"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            role="button"
            tabIndex={0}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " " || e.key === "Escape") setIsOpen(false);
            }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(226,186,62,0.3),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(226,186,62,0.2),transparent_50%)] mix-blend-screen" />

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center px-6 py-16 sm:px-10"
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="max-w-3xl text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-accent/90">视域 · 情感 · 观点</p>
                <h1 className="mt-4 text-4xl font-serif font-semibold leading-tight sm:text-6xl">
                  浙江大学晨兴文化中国人才计划
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-canvas/80 sm:text-2xl">
                  Zhejiang University Morningside Cultural China Scholars Program
                </p>
              </div>
              <div className="mt-10 w-full max-w-4xl space-y-4 rounded-3xl border border-canvas/20 bg-white/10 p-6 text-left backdrop-blur">
                <p className="text-base font-medium">“君子不器，吾道不孤”</p>
                <p className="text-sm leading-relaxed text-canvas/80 sm:text-base">
                  以体验与反思连接传统与当代，培育具有视域广度、情感深度与观点高度的未来领袖社群。
                </p>
              </div>
              <p className="mt-10 text-sm font-medium text-canvas/90">点击任意位置进入主页 · Click anywhere to enter</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
