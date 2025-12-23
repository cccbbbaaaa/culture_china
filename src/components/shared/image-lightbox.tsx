"use client";

import Image from "next/image";
import { useEffect, useId, useState } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export interface ImageLightboxProps {
  /**
   * 缩略图图片路径（public 下）/ Thumbnail src under public
   */
  src: string;
  /**
   * 图片描述 / Alt
   */
  alt: string;
  /**
   * 缩略图尺寸 / Thumbnail size
   */
  thumbSize?: number;
  /**
   * 额外类名 / Extra class names
   */
  className?: string;
}

/**
 * 可点击放大图片（用于二维码等小图）
 * Click-to-zoom image (for QR code etc.)
 */
export const ImageLightbox = ({ src, alt, thumbSize = 96, className }: ImageLightboxProps) => {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <button
        aria-label="点击放大 / Click to enlarge"
        className={cn(
          "group relative flex items-center justify-center overflow-hidden rounded bg-stone/20 outline-none ring-offset-2 ring-offset-ink focus-visible:ring-2 focus-visible:ring-accent",
          className
        )}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Image alt={alt} height={thumbSize} src={src} width={thumbSize} />
        <div className="pointer-events-none absolute inset-0 bg-canvas/0 transition group-hover:bg-canvas/5" />
      </button>

      {open ? (
        <div
          aria-labelledby={titleId}
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 p-4 backdrop-blur"
          role="dialog"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-[560px] rounded-2xl border border-canvas/15 bg-ink/30 p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-canvas" id={titleId}>
                微信公众号二维码 / WeChat QR
              </p>
              <button
                aria-label="关闭 / Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-canvas/20 bg-ink/20 text-canvas transition hover:bg-ink/35"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center">
              <div className="relative aspect-square w-full max-w-[420px] overflow-hidden rounded-xl border border-canvas/15 bg-canvas">
                <Image alt={alt} className="object-contain" fill sizes="420px" src={src} />
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-canvas/70">
              点击遮罩或按 ESC 关闭。
              <br />
              Click outside or press ESC to close.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
};





