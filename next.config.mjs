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
  // EdgeOne Server Actions 兼容：允许代理域名访问
  // EdgeOne Server Actions compatibility: allow proxy domain access
  experimental: {
    serverActions: {
      allowedOrigins: [
        "culture.zh-cn.edgeone.cool",
        "new.ccsper.com",
        "pages-pro-19-6883.pages-scf-gz-pro.qcloudteo.com",
        // 允许所有 EdgeOne 代理域名（通配符匹配）
        // Allow all EdgeOne proxy domains (wildcard match)
        /\.edgeone\.cool$/,
        /\.qcloudteo\.com$/,
      ],
    },
  },
};

export default nextConfig;






