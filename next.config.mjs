if (!process.env.NEXT_FONT_IGNORE_ERRORS) {
  // 避免本地/内网环境无法访问 Google Fonts 时控制台刷屏
  process.env.NEXT_FONT_IGNORE_ERRORS = "1";
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ibqqzsdvioghbuwpfuuz.supabase.co",
        pathname: "/storage/v1/object/**",
      },
    ],
    // EdgeOne 兼容：如果 Image Optimization API 无法正常工作，可以禁用优化
    // EdgeOne compatibility: disable optimization if Image API fails
    unoptimized: process.env.NEXT_IMAGE_UNOPTIMIZED === "true",
  },
  // EdgeOne 静态资源支持：如果设置了 EDGEONE_ASSET_PREFIX，使用它作为静态资源前缀
  // EdgeOne static assets support: use EDGEONE_ASSET_PREFIX if set
  ...(process.env.EDGEONE_ASSET_PREFIX
    ? {
        assetPrefix: process.env.EDGEONE_ASSET_PREFIX,
        basePath: process.env.EDGEONE_BASE_PATH || "",
      }
    : {}),
};

export default nextConfig;






