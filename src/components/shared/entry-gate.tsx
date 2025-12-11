"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "culture_china_entry_dismissed_v1";

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
 * 开屏遮罩：点击进入网站后淡出
 * Entry gate overlay: click to enter then fade out
 */
export const EntryGate = ({ backgroundSrc = "/images/branding/banner.png", children, className }: EntryGateProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const shouldOpen = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(STORAGE_KEY) !== "1";
  }, []);

  useEffect(() => {
    setIsOpen(shouldOpen);
    setIsReady(true);
  }, [shouldOpen]);

  useEffect(() => {
    if (!isReady) return;

    // 锁定滚动 / Lock scroll
    const originalOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = isOpen ? "hidden" : originalOverflow;

    return () => {
      document.documentElement.style.overflow = originalOverflow;
    };
  }, [isOpen, isReady]);

  const handleEnter = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {children}

      <AnimatePresence>
        {isReady && isOpen ? (
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/70 px-6 py-10 backdrop-blur"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-canvas/15 bg-canvas shadow-2xl"
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              initial={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
            <div className="relative h-[260px] sm:h-[300px]">
              <Image alt="开屏背景 / Intro background" className="object-cover" fill priority sizes="(min-width: 1024px) 896px, 100vw" src={backgroundSrc} />
              <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/20 to-canvas" />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10 sm:pb-8">
                <p className="text-xs font-medium uppercase tracking-widest text-accent/90">视域 · 情感 · 观点</p>
                <h1 className="mt-3 text-3xl font-serif font-semibold leading-tight text-primary sm:text-4xl">
                  浙江大学晨兴文化中国人才计划
                </h1>
                <p className="mt-2 text-base text-ink/70 sm:text-lg">
                  Zhejiang University Morningside Cultural China Scholars Program
                </p>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-10">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-2xl border border-stone bg-canvas/pure p-5">
                  <p className="text-sm font-medium text-ink">视域 / Horizon</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">全球化的广度与跨学科视野。</p>
                </div>
                <div className="rounded-2xl border border-stone bg-canvas/pure p-5">
                  <p className="text-sm font-medium text-ink">情感 / Emotion</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">对家国文化的深度认同。</p>
                </div>
                <div className="rounded-2xl border border-stone bg-canvas/pure p-5">
                  <p className="text-sm font-medium text-ink">观点 / Viewpoint</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">独立思考与批判性思维。</p>
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
                <p className="max-w-2xl text-sm leading-relaxed text-ink/70">
                  点击进入网站后将展示首页内容；本提示在当前设备仅首次出现。
                  <br />
                  Click to enter. This intro appears only once on this device.
                </p>

                <Button className="gap-2" onClick={handleEnter} size="lg" type="button">
                  进入网站 / Enter <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
