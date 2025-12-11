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

  return (
    <section className={cn("relative", className)} aria-label="首页轮播 / Homepage hero carousel">
      <div
        className={cn(
          "relative overflow-hidden border border-stone bg-ink",
          isFullBleed ? "rounded-none border-x-0" : "rounded-2xl"
        )}
      >
        <div
          className={cn(
            "relative w-full",
            isFullBleed ? "aspect-[16/7]" : "aspect-[16/9]",
            "min-h-[420px] sm:min-h-[520px]"
          )}
        >
          {safeSlides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={slide.src}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700",
                  isActive ? "opacity-100" : "pointer-events-none opacity-0"
                )}
              >
                {/* 背景层（轻微模糊）/ Background layer (slight blur) */}
                <Image alt={slide.alt} className="object-cover opacity-50 blur-xl" fill priority={index === 0} sizes="100vw" src={slide.src} />

                {/* 前景图（不裁切，避免过度放大模糊）/ Foreground (contain to avoid aggressive zoom) */}
                <div className="absolute inset-0 mx-auto flex max-w-[1280px] items-center px-4 sm:px-6">
                  <div className="relative w-full overflow-hidden rounded-2xl border border-canvas/15 bg-ink/30 shadow-lg">
                    <div className="relative aspect-video w-full">
                      <Image
                        alt={slide.alt}
                        className="object-contain"
                        fill
                        priority={index === 0}
                        sizes="(min-width: 1280px) 1280px, 100vw"
                        src={slide.src}
                      />
                    </div>
                  </div>
                </div>

                {/* 遮罩层 / Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/40 to-ink/20" />

                <div className="absolute inset-0">
                  <div className="mx-auto flex h-full w-full max-w-[1280px] items-end px-4 pb-6 sm:px-6 sm:pb-10">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${activeIndex}-${slide.title}`}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full"
                        exit={{ opacity: 0, y: 6 }}
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        <p className="text-xs font-medium uppercase tracking-widest text-accent/90">视域 · 情感 · 观点</p>
                        <h1 className="mt-3 max-w-4xl text-4xl font-serif font-semibold leading-tight text-canvas sm:text-6xl">
                          {slide.title}
                        </h1>
                        {slide.subtitle ? (
                          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-canvas/85">{slide.subtitle}</p>
                        ) : null}
                        {slide.caption ? (
                          <p className="mt-4 max-w-3xl text-base leading-relaxed text-canvas/70">{slide.caption}</p>
                        ) : null}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 控制按钮 / Controls */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
          <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-3 sm:px-6">
            <button
              aria-label="上一张 / Previous"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-canvas/20 bg-ink/25 text-canvas backdrop-blur transition hover:bg-ink/40"
              onClick={goPrev}
              type="button"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="下一张 / Next"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full border border-canvas/20 bg-ink/25 text-canvas backdrop-blur transition hover:bg-ink/40"
              onClick={goNext}
              type="button"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* 指示点 / Dots */}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/40 px-3 py-2 backdrop-blur">
          {safeSlides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.src}
                aria-label={`跳到第 ${index + 1} 张 / Go to slide ${index + 1}`}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  isActive ? "bg-accent" : "bg-canvas/40 hover:bg-canvas/70"
                )}
                onClick={() => setActiveIndex(index)}
                type="button"
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
