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
  },
};

export default nextConfig;






