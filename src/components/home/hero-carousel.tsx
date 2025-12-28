"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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
  /**
   * 点击跳转链接 / Optional href target
   */
  href?: string;
}

export interface HeroCarouselProps {
  slides: HeroSlide[];
  /**
   * 是否全宽铺满（用于首页首屏）/ Full-bleed layout for hero
   */
  isFullBleed?: boolean;
  className?: string;
}

type FitMode = "cover" | "contain";

const loadImageSize = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      resolve({ width: img.naturalWidth || 1920, height: img.naturalHeight || 1080 });
    };
    img.onerror = () => resolve({ width: 1920, height: 1080 });
    img.src = src;
  });
};

/**
 * 首页首屏轮播（纯展示交互，不涉及数据请求）
 * Hero carousel (UI-only interaction, no data fetching)
 */
export const HeroCarousel = ({ slides, isFullBleed = false, className }: HeroCarouselProps) => {
  const safeSlides = useMemo(() => (slides.length > 0 ? slides : []), [slides]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fitMode, setFitMode] = useState<FitMode>("cover");
  const imageAreaRef = useRef<HTMLDivElement | null>(null);
  const imageSizeCacheRef = useRef<Map<string, { width: number; height: number }>>(new Map());
  // 客户端组件中，setInterval 返回 number / In client components, setInterval returns number
  const timerRef = useRef<number | null>(null);
  const safeIndex = safeSlides.length === 0 ? 0 : Math.min(activeIndex, safeSlides.length - 1);
  const activeSlide = safeSlides[safeIndex];
  const activeSrc = activeSlide?.src ?? "";
  const activeHref = activeSlide?.href;

  // 清除并重新设置自动滚动定时器 / Clear and reset auto-scroll timer
  const resetAutoScroll = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (safeSlides.length <= 1) return;

    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % safeSlides.length);
    }, 6000);
  }, [safeSlides.length]);

  useEffect(() => {
    resetAutoScroll();
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resetAutoScroll]);

  useEffect(() => {
    if (!activeSrc) return;
    const el = imageAreaRef.current;
    if (!el) return;

    let isCancelled = false;

    const decideFit = (containerWidth: number, containerHeight: number, imageWidth: number, imageHeight: number) => {
      // 计算 cover 与 contain 的比例差，差越大表示 cover 裁切越多 / ratio larger => more cropping if cover
      const containScale = Math.min(containerWidth / imageWidth, containerHeight / imageHeight);
      const coverScale = Math.max(containerWidth / imageWidth, containerHeight / imageHeight);
      const ratio = coverScale / Math.max(containScale, 1e-6);

      // 经验阈值：倾向 cover（减少留白），但避免过度裁切 / Prefer cover to reduce whitespace but avoid heavy crop
      return ratio <= 1.3 ? ("cover" as const) : ("contain" as const);
    };

    const run = async () => {
      const rect = el.getBoundingClientRect();
      const containerWidth = Math.max(rect.width, 1);
      const containerHeight = Math.max(rect.height, 1);

      const cached = imageSizeCacheRef.current.get(activeSrc);
      const size = cached ?? (await loadImageSize(activeSrc));
      imageSizeCacheRef.current.set(activeSrc, size);

      const next = decideFit(containerWidth, containerHeight, size.width, size.height);
      if (!isCancelled) setFitMode(next);
    };

    const observer = new ResizeObserver(() => {
      void run();
    });
    observer.observe(el);
    void run();

    return () => {
      isCancelled = true;
      observer.disconnect();
    };
  }, [activeSrc]);

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
    resetAutoScroll(); // 重置定时器 / Reset timer
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % safeSlides.length);
    resetAutoScroll(); // 重置定时器 / Reset timer
  };

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
          <div className="relative h-[clamp(380px,58vh,620px)] bg-canvas" ref={imageAreaRef}>
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
                  className="object-cover opacity-35 blur-2xl"
                  fill
                  priority
                  sizes="(min-width: 1536px) 1536px, 100vw"
                  src={activeSlide.src}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-b from-canvas/90 via-canvas/35 to-canvas/10" />

                <Image
                  alt={activeSlide.alt}
                  className={cn("transition-[filter] duration-300", fitMode === "cover" ? "object-cover" : "object-contain")}
                  fill
                  priority
                  sizes="(min-width: 1536px) 1536px, 100vw"
                  src={activeSlide.src}
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canvas/60 via-transparent to-transparent" />
              </motion.div>
            </AnimatePresence>

            {/* 控制按钮：固定在容器左右，缩放也稳定 / Stable controls */}
            <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-20">
              <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
                <button
                  aria-label="上一张 / Previous"
                  className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-canvas/70 text-ink backdrop-blur transition hover:bg-canvas"
                  onClick={goPrev}
                  type="button"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  aria-label="下一张 / Next"
                  className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/15 bg-canvas/70 text-ink backdrop-blur transition hover:bg-canvas"
                  onClick={goNext}
                  type="button"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Dots：放到底部中间 / Dots */}
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-canvas/70 px-3 py-2 backdrop-blur">
              {safeSlides.map((slide, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={slide.src}
                    aria-label={`跳到第 ${index + 1} 张 / Go to slide ${index + 1}`}
                    className={cn(
                      "h-2.5 w-2.5 rounded-full transition-all",
                      isActive ? "bg-primary" : "bg-ink/20 hover:bg-ink/35"
                    )}
                    onClick={() => {
                      setActiveIndex(index);
                      resetAutoScroll(); // 重置定时器 / Reset timer
                    }}
                    type="button"
                  />
                );
              })}
            </div>
          </div>

          {/* 文案区域：上图下文，更干净 / Text area below image */}
          <div className="px-6 py-7 sm:px-10 sm:py-10">
            <p className="text-xs font-medium uppercase tracking-widest text-accent/90">视域 · 情感 · 观点</p>
            {activeHref ? (
              <Link
                href={activeHref}
                prefetch={false}
                rel="noreferrer"
                target="_blank"
                className="group mt-3 inline-flex items-center gap-2"
                aria-label="查看原文"
              >
                <h1 className="text-[clamp(1.9rem,3vw,3.1rem)] font-serif font-semibold leading-tight text-ink transition-colors group-hover:text-primary">
                  {activeSlide.title}
                </h1>
                <ExternalLink className="h-5 w-5 text-ink/50 transition-colors group-hover:text-primary" />
              </Link>
            ) : (
              <h1 className="mt-3 text-[clamp(1.9rem,3vw,3.1rem)] font-serif font-semibold leading-tight text-ink">
                {activeSlide.title}
              </h1>
            )}
            {activeSlide.subtitle ? (
              <p className="mt-3 max-w-4xl text-lg leading-relaxed text-ink/80">{activeSlide.subtitle}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

