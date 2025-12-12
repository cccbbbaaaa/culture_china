const isEdgeStaticDeploy = process.env.NEXT_PUBLIC_EDGE_DEPLOY === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // EdgeOne 等纯静态托管缺少 Next Image 优化服务，需禁用优化
    // Edge-only static platforms don't host Next's image optimizer, so disable it when needed
    unoptimized: isEdgeStaticDeploy,
  },
};

export default nextConfig;


