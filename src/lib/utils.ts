import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind CSS 类名
 * Merge Tailwind CSS class names
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));








