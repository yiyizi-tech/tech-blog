/** @type {import('next').NextConfig} */
const nextConfig = {
  // 在这里添加 eslint 配置
  eslint: {
    // !! 关键 !!
    // 设置为 true 可以在构建期间忽略 ESLint 的错误。
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;