import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * 合并 Tailwind CSS 类名
 * Merge Tailwind CSS class names
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/**
 * 检查 websiteUrl 是否为有效值
 * Check if websiteUrl is a valid value
 * @param url - 原始URL字符串 / Original URL string
 * @returns 是否为有效URL / Whether it's a valid URL
 */
export const isValidWebsiteUrl = (url: string | null | undefined): boolean => {
  if (!url || !url.trim()) {
    return false;
  }

  const trimmedUrl = url.trim().toLowerCase();

  // 过滤掉常见的无效值 / Filter out common invalid values
  const invalidValues = ["无", "none", "n/a", "na", "null", "undefined", "-", "无网站", "无个人网站"];
  if (invalidValues.includes(trimmedUrl)) {
    return false;
  }

  return true;
};

/**
 * 规范化URL，确保外部链接能正确跳转
 * Normalize URL to ensure external links work correctly
 * @param url - 原始URL字符串 / Original URL string
 * @returns 规范化后的URL / Normalized URL
 */
export const normalizeUrl = (url: string | null | undefined): string => {
  if (!url || !url.trim()) {
    return "";
  }

  const trimmedUrl = url.trim();

  // 如果已经有协议前缀（http:// 或 https://），直接返回
  // If already has protocol prefix (http:// or https://), return as is
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  // 如果没有协议前缀，使用协议相对URL（//），让浏览器使用当前页面的协议
  // If no protocol prefix, use protocol-relative URL (//) to let browser use current page's protocol
  // 这样不会添加当前域名前缀，而是作为外部链接处理
  // This way it won't add current domain prefix, but will be treated as external link
  return `//${trimmedUrl}`;
};









