# 🌐 yiyizi.top 域名绑定和SSL配置指南

## 📋 需要的证书格式

**推荐使用：PEM/KEY 格式**
- `yiyizi.top.pem` - 证书文件（包含域名证书+中间证书+根证书）
- `yiyizi.top.key` - 私钥文件

## 🚀 完整部署步骤

### 1. 下载SSL证书

在阿里云SSL证书控制台：
1. 找到 yiyizi.top 的证书
2. 选择 **PEM格式** 下载
3. 解压后应该包含：
   - `yiyizi.top.pem` (证书文件)
   - `yiyizi.top.key` (私钥文件)

### 2. 上传证书到服务器

将证书文件上传到服务器的以下目录：
```bash
# 创建证书目录
mkdir -p /etc/nginx/ssl/yiyizi.top

# 上传证书文件
scp yiyizi.top.pem root@your-server-ip:/etc/nginx/ssl/yiyizi.top/
scp yiyizi.top.key root@your-server-ip:/etc/nginx/ssl/yiyizi.top/
```

### 3. 运行部署脚本

```bash
# 进入项目目录
cd /root/my-tech-blog/tech-blog

# 运行部署脚本
./deploy.sh
```

### 4. 验证部署

部署完成后，访问以下地址测试：
- https://yiyizi.top
- https://www.yiyizi.top

## 🔧 配置文件说明

### Nginx配置文件
- **位置**: `/etc/nginx/conf.d/yiyizi.top.conf`
- **功能**: 
  - SSL证书配置
  - HTTP重定向到HTTPS
  - 反向代理到Next.js应用
  - 静态资源缓存
  - 安全头配置

### PM2配置文件
- **位置**: `/root/my-tech-blog/tech-blog/ecosystem.config.js`
- **功能**: 
  - 进程管理
  - 集群模式
  - 日志管理
  - 自动重启

## 📋 管理命令

### 应用管理
```bash
# 查看应用状态
pm2 status tech-blog

# 查看应用日志
pm2 logs tech-blog

# 重启应用
pm2 restart tech-blog

# 停止应用
pm2 stop tech-blog

# 删除应用
pm2 delete tech-blog
```

### Nginx管理
```bash
# 检查Nginx状态
systemctl status nginx

# 重启Nginx
systemctl restart nginx

# 重载Nginx配置
systemctl reload nginx

# 查看Nginx日志
tail -f /var/log/nginx/yiyizi.top.access.log
tail -f /var/log/nginx/yiyizi.top.error.log
```

### SSL证书检查
```bash
# 检查证书有效期
openssl x509 -enddate -noout -in /etc/nginx/ssl/yiyizi.top/yiyizi.top.pem

# 检查SSL配置
openssl s_client -connect yiyizi.top:443 -servername yiyizi.top
```

## 🔧 证书格式转换

如果你有其他格式的证书，可以使用转换工具：

```bash
# 转换为PFX格式
./ssl-converter.sh certificate.pem private.key pfx

# 转换为JKS格式
./ssl-converter.sh certificate.pem private.key jks

# 合并证书和私钥
./ssl-converter.sh certificate.pem private.key combined
```

## 🚨 故障排除

### 常见问题

1. **SSL证书错误**
   ```bash
   # 检查证书路径和权限
   ls -la /etc/nginx/ssl/yiyizi.top/
   
   # 测试Nginx配置
   nginx -t
   ```

2. **应用无法访问**
   ```bash
   # 检查PM2进程状态
   pm2 status
   
   # 检查端口占用
   netstat -tlnp | grep :3000
   
   # 检查防火墙
   firewall-cmd --list-all
   ```

3. **HTTP不重定向到HTTPS**
   ```bash
   # 检查Nginx配置
   cat /etc/nginx/conf.d/yiyizi.top.conf
   
   # 重启Nginx
   systemctl restart nginx
   ```

## 📊 性能优化

### 已配置的优化
- ✅ HTTP/2支持
- ✅ Gzip压缩
- ✅ 静态资源缓存
- ✅ SSL会话复用
- ✅ 现代加密套件
- ✅ 安全头配置

### 建议的额外优化
- CDN加速（阿里云CDN）
- 图片优化（WebP格式）
- 代码分割
- 缓存策略

## 🔒 安全配置

### 已配置的安全措施
- ✅ HTTPS强制跳转
- ✅ HSTS头
- ✅ XSS保护
- ✅ 点击劫持保护
- ✅ 内容类型嗅探保护
- ✅ 现代加密套件

### 建议的额外安全措施
- WAF防火墙
- DDoS防护
- 定期备份
- 安全监控

## 📈 监控建议

1. **应用监控**
   - PM2进程监控
   - 错误日志监控
   - 性能指标监控

2. **服务器监控**
   - CPU使用率
   - 内存使用率
   - 磁盘空间
   - 网络流量

3. **SSL监控**
   - 证书到期提醒
   - SSL配置检查
   - 安全漏洞扫描

---

## 🎯 快速开始

1. 下载PEM格式SSL证书
2. 上传到服务器 `/etc/nginx/ssl/yiyizi.top/`
3. 运行 `./deploy.sh`
4. 访问 `https://yiyizi.top`

完成！你的科技博客现在应该可以通过HTTPS安全访问了！🎉