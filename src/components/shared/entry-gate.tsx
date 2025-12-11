"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface EntryGateProps {
  /**
   * 背景图（public 下）/ Background image under public
   */
  backgroundSrc?: string;
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
export const EntryGate = ({ backgroundSrc = "/images/branding/banner.png", children, className }: EntryGateProps) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const backgroundCandidates = useMemo<string[]>(() => {
    return [
      "/images/branding/banner.png",
      "/images/events/annual/2025-group-photo.png",
      "/images/events/visits/2024-hk1.jpg",
      "/images/events/course/bao-20251202.jpeg",
    ];
  }, []);

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

  const finalBackgroundSrc = useMemo(() => {
    // 优先使用传入背景图，否则随机挑一个候选（每次进入首页都会变化一点）/ pick a random background
    if (backgroundSrc) return backgroundSrc;
    const index = Math.floor(Math.random() * backgroundCandidates.length);
    return backgroundCandidates[index] ?? "/images/branding/banner.png";
  }, [backgroundCandidates, backgroundSrc]);

  return (
    <div className={cn("relative", className)}>
      {children}

      <AnimatePresence>
        {isReady && isHome && isOpen ? (
          <motion.div
            aria-label="开屏遮罩 / Intro overlay"
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] cursor-pointer"
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
            <div className="absolute inset-0 bg-ink" />
            <Image
              alt="开屏背景 / Intro background"
              className="object-cover opacity-85"
              fill
              priority
              sizes="100vw"
              src={finalBackgroundSrc}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/45 to-ink/80" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(226,186,62,0.22),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(150,46,42,0.30),transparent_55%)]" />

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="relative mx-auto flex h-full max-w-screen-2xl items-center px-6 sm:px-10"
              initial={{ opacity: 0, y: 14 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="max-w-3xl">
                <p className="text-xs font-medium uppercase tracking-widest text-accent/90">视域 · 情感 · 观点</p>
                <h1 className="mt-4 text-4xl font-serif font-semibold leading-tight text-canvas sm:text-6xl">
                  浙江大学晨兴文化中国人才计划
                </h1>
                <p className="mt-4 text-lg leading-relaxed text-canvas/80 sm:text-2xl">
                  Zhejiang University Morningside Cultural China Scholars Program
                </p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
