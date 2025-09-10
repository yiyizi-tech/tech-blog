import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // 确保静态文件能被正确处理
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;