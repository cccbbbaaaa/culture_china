"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface PageEnterProps {
  /**
   * 子内容 / Children
   */
  children: ReactNode;
  /**
   * 额外类名 / Extra class names
   */
  className?: string;
  /**
   * 自定义初始动画状态 / Custom initial animation state
   */
  initial?: Record<string, unknown>;
  /**
   * 自定义目标动画状态 / Custom animate state
   */
  animate?: Record<string, unknown>;
  /**
   * 自定义过渡参数 / Custom transition
   */
  transition?: Record<string, unknown>;
}

/**
 * 页面进入动画（轻量淡入上移）
 * Page enter animation (subtle fade + slide)
 */
export const PageEnter = ({
  children,
  className,
  initial,
  animate,
  transition,
}: PageEnterProps) => {
  const initialDefault = { opacity: 0, y: 10 };
  const animateDefault = { opacity: 1, y: 0 };
  const transitionDefault = { duration: 0.45, ease: "easeOut" };

  return (
    <motion.div
      animate={animate ?? animateDefault}
      className={cn(className)}
      initial={initial ?? initialDefault}
      transition={transition ?? transitionDefault}
    >
      {children}
    </motion.div>
  );
};
