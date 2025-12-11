"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface HeroSlide {
  /**
   * 图片路径（public 下）/ Image path under public
   */
  src: string;
  /**
   * 图片描述 / Alt text
   */
  alt: string;
  /**
   * 标题 / Title
   */
  title: string;
  /**
   * 可选副标题 / Optional subtitle
   */
  subtitle?: string;
  /**
   * 图片说明 / Caption
   */
  caption?: string;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  /**
   * 是否全宽铺满（用于首页首屏）/ Full-bleed layout for hero
   */
  isFullBleed?: boolean;
  className?: string;
}

/**
 * 首页首屏轮播（纯展示交互，不涉及数据请求）
 * Hero carousel (UI-only interaction, no data fetching)
 */
export const HeroCarousel = ({ slides, isFullBleed = false, className }: HeroCarouselProps) => {
  const safeSlides = useMemo(() => (slides.length > 0 ? slides : []), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (safeSlides.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [safeSlides.length]);

  if (safeSlides.length === 0) {
    return (
      <div
        className={cn(
          "relative overflow-hidden border border-stone bg-stone/40",
          isFullBleed ? "rounded-none border-x-0" : "rounded-2xl",
          className
        )}
      >
        <div className="flex h-[520px] items-center justify-center px-6 text-center">
          <div>
            <p className="text-sm text-ink/70">暂无轮播图片</p>
            <p className="mt-2 text-xs text-ink/60">No hero images configured.</p>
          </div>
        </div>
      </div>
    );
  }

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % safeSlides.length);
  };

  const activeSlide = safeSlides[activeIndex];

  return (
    <section className={cn("relative", className)} aria-label="首页轮播 / Homepage hero carousel">
      <div className={cn("mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8", isFullBleed ? "max-w-none px-0" : null)}>
        <div
          className={cn(
            "overflow-hidden border border-stone bg-canvas/pure shadow-sm",
            isFullBleed ? "rounded-none border-x-0" : "rounded-3xl"
          )}
        >
          {/* 图像区域：固定高度 clamp，避免缩放比下失控 / Image area with clamp height */}
          <div className="relative h-[clamp(320px,52vh,520px)] bg-ink">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.src}
                animate={{ opacity: 1 }}
                className="absolute inset-0"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <Image
                  alt={activeSlide.alt}
                  className="object-cover"
                  fill
                  priority
                  sizes="(min-width: 1536px) 1536px, 100vw"
                  src={activeSlide.src}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* 控制按钮：固定在容器左右，缩放也稳定 / Stable controls */}
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
              <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
                <button
                  aria-label="上一张 / Previous"
                  className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-canvas/25 bg-ink/30 text-canvas backdrop-blur transition hover:bg-ink/45"
                  onClick={goPrev}
                  type="button"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  aria-label="下一张 / Next"
                  className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-canvas/25 bg-ink/30 text-canvas backdrop-blur transition hover:bg-ink/45"
                  onClick={goNext}
                  type="button"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Dots：放到底部中间 / Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/40 px-3 py-2 backdrop-blur">
              {safeSlides.map((slide, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={slide.src}
                    aria-label={`跳到第 ${index + 1} 张 / Go to slide ${index + 1}`}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all",
                      isActive ? "bg-accent" : "bg-canvas/40 hover:bg-canvas/70"
                    )}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  />
                );
              })}
            </div>
          </div>

          {/* 文案区域：上图下文，更干净 / Text area below image */}
          <div className="px-6 py-7 sm:px-10 sm:py-9">
            <p className="text-xs font-medium uppercase tracking-widest text-accent/90">视域 · 情感 · 观点</p>
            <h1 className="mt-3 text-[clamp(1.9rem,3vw,3.1rem)] font-serif font-semibold leading-tight text-ink">
              {activeSlide.title}
            </h1>
            {activeSlide.subtitle ? (
              <p className="mt-3 max-w-4xl text-lg leading-relaxed text-ink/80">{activeSlide.subtitle}</p>
            ) : null}
            {activeSlide.caption ? (
              <p className="mt-3 max-w-4xl text-base leading-relaxed text-ink/65">{activeSlide.caption}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
