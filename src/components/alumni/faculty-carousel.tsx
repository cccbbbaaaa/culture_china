"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export interface Faculty {
  name: string;
  title: string;
  img: string;
  url?: string;
}

interface FacultyCarouselProps {
  faculty: Faculty[];
}

/**
 * 师资墙自动滚动轮播组件
 * Auto-scrolling faculty carousel component
 */
export const FacultyCarousel = ({ faculty }: FacultyCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || faculty.length <= 1) return;

    let scrollPosition = 0;
    const scrollSpeed = 0.5; // 滚动速度（像素/帧）/ Scroll speed (pixels per frame)

    const animate = () => {
      if (isPausedRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      scrollPosition += scrollSpeed;

      // 当滚动到一半内容时，重置到开始位置（实现无缝循环）
      // When scrolled to half content, reset to start (seamless loop)
      const halfWidth = container.scrollWidth / 2;
      if (scrollPosition >= halfWidth) {
        scrollPosition = 0;
      }

      container.scrollLeft = scrollPosition;
      animationRef.current = requestAnimationFrame(animate);
    };

    // 鼠标悬停时暂停 / Pause on hover
    const handleMouseEnter = () => {
      isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
      isPausedRef.current = false;
    };

    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [faculty.length]);

  if (faculty.length === 0) {
    return (
      <div className="mt-6 text-sm text-ink/60">暂无师资信息</div>
    );
  }

  // 复制内容以实现无缝循环 / Duplicate content for seamless loop
  const duplicatedFaculty = [...faculty, ...faculty];

  return (
    <div
      ref={scrollContainerRef}
      className="mt-6 flex gap-6 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      {duplicatedFaculty.map((facultyMember, index) => {
        const content = (
          <>
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-stone/30 transition-colors group-hover:border-primary/50">
              <Image alt={`${facultyMember.name} / Faculty avatar`} className="object-cover" fill sizes="80px" src={facultyMember.img} />
            </div>
            <p className="mt-3 text-base font-medium text-ink group-hover:text-primary transition-colors">{facultyMember.name}</p>
            <p className="text-sm text-ink/60 line-clamp-2">{facultyMember.title}</p>
          </>
        );

        if (facultyMember.url) {
          return (
            <Link
              key={index}
              className="group min-w-[150px] block cursor-pointer transition-transform hover:-translate-y-1"
              href={facultyMember.url}
              prefetch={false}
              rel="noreferrer"
              target="_blank"
            >
              {content}
            </Link>
          );
        }

        return (
          <div key={index} className="group min-w-[150px] cursor-default">
            {content}
          </div>
        );
      })}
    </div>
  );
};

