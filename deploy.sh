#!/bin/bash

# ======================================
# 🚀 Tech Blog 部署脚本 - yiyizi.top
# ======================================

set -e

echo "🚀 开始部署 Tech Blog 到 yiyizi.top..."

# 检查是否为root用户
if [[ $EUID -ne 0 ]]; then
   echo "❌ 请使用 root 用户运行此脚本"
   exit 1
fi

# 1. 安装必要的软件
echo "📦 检查并安装必要软件..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 安装 PM2..."
    npm install -g pm2
fi

# 检查 Nginx
if ! command -v nginx &> /dev/null; then
    echo "📦 安装 Nginx..."
    yum install -y nginx
fi

# 2. 创建SSL证书目录
echo "🔐 创建SSL证书目录..."
mkdir -p /etc/nginx/ssl/yiyizi.top

# 3. 提示用户上传SSL证书
echo ""
echo "📋 请上传你的SSL证书文件到以下目录："
echo "   证书文件: /etc/nginx/ssl/yiyizi.top/yiyizi.top.pem"
echo "   私钥文件: /etc/nginx/ssl/yiyizi.top/yiyizi.top.key"
echo ""
echo "📋 证书文件应该包含："
echo "   - 域名证书"
echo "   - 中间证书链"
echo "   - 根证书（如果需要）"
echo ""

read -p "✅ 证书文件已上传并确认正确吗？(y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 请先上传证书文件后再运行此脚本"
    exit 1
fi

# 4. 构建Next.js应用
echo "🔨 构建 Next.js 应用..."
cd /root/my-tech-blog/tech-blog

# 安装依赖
echo "📦 安装项目依赖..."
npm ci --production

# 构建项目
echo "🏗️ 构建项目..."
npm run build

# 5. 配置Nginx
echo "⚙️ 配置 Nginx..."

# 备份现有配置（如果存在）
if [ -f /etc/nginx/conf.d/yiyizi.top.conf ]; then
    echo "💾 备份现有Nginx配置..."
    cp /etc/nginx/conf.d/yiyizi.top.conf /etc/nginx/conf.d/yiyizi.top.conf.backup.$(date +%Y%m%d_%H%M%S)
fi

# 测试Nginx配置
echo "🧪 测试 Nginx 配置..."
nginx -t

if [ $? -ne 0 ]; then
    echo "❌ Nginx 配置有误，请检查"
    exit 1
fi

# 6. 启动/重启服务
echo "🔄 启动服务..."

# 停止现有PM2进程
if pm2 describe tech-blog > /dev/null 2>&1; then
    echo "🛑 停止现有服务..."
    pm2 stop tech-blog
    pm2 delete tech-blog
fi

# 启动新的PM2进程
echo "🚀 启动新的服务进程..."
pm2 start ecosystem.config.js

# 保存PM2进程列表
pm2 save

# 设置PM2开机自启
pm2 startup | tail -n 1 > /tmp/pm2_startup.sh
chmod +x /tmp/pm2_startup.sh
/tmp/pm2_startup.sh

# 重启Nginx
echo "🔄 重启 Nginx..."
systemctl restart nginx
systemctl enable nginx

# 7. 验证部署
echo "🧪 验证部署..."

# 检查PM2状态
if pm2 describe tech-blog > /dev/null 2>&1; then
    echo "✅ PM2 进程运行正常"
    pm2 status tech-blog
else
    echo "❌ PM2 进程启动失败"
    exit 1
fi

# 检查Nginx状态
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx 服务运行正常"
else
    echo "❌ Nginx 服务启动失败"
    exit 1
fi

# 8. 完成提示
echo ""
echo "🎉 部署完成！"
echo ""
echo "📋 部署信息："
echo "   🌐 域名: https://yiyizi.top"
echo "   🚀 应用: Tech Blog"
echo "   📊 PM2状态: pm2 status"
echo "   📋 日志查看: pm2 logs tech-blog"
echo ""
echo "🔧 管理命令："
echo "   重启应用: pm2 restart tech-blog"
echo "   查看日志: pm2 logs tech-blog"
echo "   停止应用: pm2 stop tech-blog"
echo "   Nginx状态: systemctl status nginx"
echo ""
echo "📁 重要文件位置："
echo "   项目目录: /root/my-tech-blog/tech-blog"
echo "   SSL证书: /etc/nginx/ssl/yiyizi.top/"
echo "   Nginx配置: /etc/nginx/conf.d/yiyizi.top.conf"
echo "   PM2配置: /root/my-tech-blog/tech-blog/ecosystem.config.js"
echo ""
echo "🔒 SSL证书信息："
echo "   请确保证书有效期，到期前及时更新"
echo "   可以通过以下命令检查证书有效期："
echo "   openssl x509 -enddate -noout -in /etc/nginx/ssl/yiyizi.top/yiyizi.top.pem"
echo ""
echo "🎯 下一步建议："
echo "   1. 访问 https://yiyizi.top 测试网站"
echo "   2. 检查 SSL 证书状态"
echo "   3. 测试所有页面功能"
echo "   4. 配置网站监控（可选）"
echo ""