"use client";

import type { ReactNode } from "react";

import {
  type AnimationControls,
  type TargetAndTransition,
  type Transition,
  type VariantLabels,
  motion,
} from "framer-motion";

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
  initial?: TargetAndTransition | VariantLabels | boolean;
  /**
   * 自定义目标动画状态 / Custom animate state
   */
  animate?: AnimationControls | TargetAndTransition | VariantLabels | boolean;
  /**
   * 自定义过渡参数 / Custom transition
   */
  transition?: Transition;
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
  const initialDefault: TargetAndTransition = { opacity: 0, y: 10 };
  const animateDefault: TargetAndTransition = { opacity: 1, y: 0 };
  const transitionDefault: Transition = { duration: 0.45, ease: "easeOut" };

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
