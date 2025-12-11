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
}

/**
 * 页面进入动画（轻量淡入上移）
 * Page enter animation (subtle fade + slide)
 */
export const PageEnter = ({ children, className }: PageEnterProps) => {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className={cn(className)}
      initial={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};
