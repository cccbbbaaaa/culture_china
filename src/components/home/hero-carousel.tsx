"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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
        <div className={cn("relative", isFullBleed ? "h-[560px] sm:h-[640px]" : "h-[520px]")}>
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
                <Image
                  alt={slide.alt}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  src={slide.src}
                />

                {/* 遮罩层 / Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20" />

                <div className="absolute inset-0 flex items-end">
                  <div className="mx-auto w-full max-w-screen-2xl px-4 pb-10 pt-6 sm:px-6 sm:pb-12 lg:px-8">
                    <p className="text-xs font-medium uppercase tracking-widest text-accent/90">视域 · 情感 · 观点</p>
                    <h1 className="mt-3 max-w-3xl text-4xl font-serif font-semibold leading-tight text-canvas sm:text-5xl">
                      {slide.title}
                    </h1>
                    {slide.subtitle ? (
                      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-canvas/80 sm:text-base">
                        {slide.subtitle}
                      </p>
                    ) : null}

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <Button asChild size="lg">
                        <Link href="/intro">了解项目 / Learn more</Link>
                      </Button>
                      <Button asChild size="lg" variant="outline">
                        <Link href="/admissions">招生信息 / Admissions</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 控制按钮 / Controls */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0">
          <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-3 sm:px-6 lg:px-8">
            <div className="pointer-events-auto">
              <Button
                aria-label="上一张 / Previous"
                className="bg-canvas/10 text-canvas hover:bg-canvas/20"
                onClick={goPrev}
                size="icon"
                type="button"
                variant="ghost"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="pointer-events-auto">
              <Button
                aria-label="下一张 / Next"
                className="bg-canvas/10 text-canvas hover:bg-canvas/20"
                onClick={goNext}
                size="icon"
                type="button"
                variant="ghost"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 指示点 / Dots */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink/40 px-3 py-2 backdrop-blur">
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
