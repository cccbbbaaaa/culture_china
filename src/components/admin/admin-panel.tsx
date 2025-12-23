"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { X } from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminPanelProps {
  trigger: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  widthClass?: string;
}

export const AdminPanel = ({ trigger, title, description, children, widthClass = "max-w-2xl" }: AdminPanelProps) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, mounted]);

  const close = () => setOpen(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm">
          <div className={cn("h-full w-full overflow-y-auto bg-canvas shadow-xl", widthClass)}>
            <div className="flex items-start justify-between border-b border-stone/30 px-6 py-4">
              <div>
                <p className="text-lg font-serif font-semibold text-ink">{title}</p>
                {description ? <p className="text-sm text-ink/70">{description}</p> : null}
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-stone/50 p-2 text-ink/70 transition hover:border-primary hover:text-primary"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-6">{children}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};


