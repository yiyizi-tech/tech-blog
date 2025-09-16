import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // 确保静态文件能被正确处理
  experimental: {
    serverComponentsExternalPackages: [],
    // 启用 Turbopack 优化
    turbo: {
      rules: {
        // 优化图片加载
        '*.{jpg,jpeg,png,gif,webp,avif}': {
          loaders: ['file-loader'],
          as: '*.{jpg,jpeg,png,gif,webp,avif}',
        },
      },
    },
  },
  // 图片优化配置
  images: {
    domains: ['images.unsplash.com', 'unsplash.com', 'your-domain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'your-domain.com',
        port: '',
        pathname: '/**',
      },
    ],
    // 启用图片优化
    formats: ['image/webp', 'image/avif'],
    // 设备尺寸
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 最小缓存TTL (秒)
    minimumCacheTTL: 31536000, // 1年
  },
  // 压缩配置
  compress: true,
  // 静态资源缓存
  async headers() {
    return [
      {
        source: '/uploads/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;