import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主色调 - 晨兴红 (Morning Red)
        primary: {
          DEFAULT: "#962E2A",
          light: "#B84A46",
          dark: "#7A1F1C",
        },
        // 强调色 - 典雅金 (Elegant Gold)
        accent: {
          DEFAULT: "#E2BA3E",
          light: "#F0D16B",
          dark: "#C99E2A",
        },
        // 中性色
        canvas: {
          DEFAULT: "#FAFAF9", // 宣纸白 (Rice Paper)
          pure: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#1F2937", // 墨灰 (Ink Grey)
        },
        stone: {
          DEFAULT: "#E5E7EB", // 碑石灰 (Stone Grey)
        },
      },
      fontFamily: {
        // 标题字体 - 思源宋体 / Playfair Display
        serif: ["Noto Serif SC", "Playfair Display", "serif"],
        // 正文字体 - 思源黑体 / Inter
        sans: ["Noto Sans SC", "Inter", "sans-serif"],
      },
      fontSize: {
        "hero": ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        "section": ["1.5rem", { lineHeight: "1.4", fontWeight: "600" }],
      },
      letterSpacing: {
        wide: "0.05em", // 中文段落字间距
      },
      lineHeight: {
        relaxed: "1.75", // 正文行高
      },
    },
  },
  plugins: [],
};

export default config;

