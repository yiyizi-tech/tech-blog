#!/bin/bash

echo "=== yiyizi.top 网络诊断报告 ==="
echo "生成时间: $(date)"
echo

echo "1. 基本连接测试:"
echo "   HTTPS状态: $(curl -s -o /dev/null -w "%{http_code}" https://yiyizi.top)"
echo "   HTTP状态: $(curl -s -o /dev/null -w "%{http_code}" http://yiyizi.top)"
echo "   HTTP测试页面: $(curl -s -o /dev/null -w "%{http_code}" http://yiyizi.top/mobile-http-test)"
echo

echo "2. SSL证书信息:"
openssl s_client -connect yiyizi.top:443 -servername yiyizi.top < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer
echo

echo "3. DNS解析:"
nslookup yiyizi.top
echo

echo "4. 网络路由:"
traceroute -n yiyizi.top 2>/dev/null | head -10
echo

echo "5. 服务器端口状态:"
netstat -tlnp | grep -E ":443|:80"
echo

echo "6. 最近的访问记录:"
tail -5 /var/log/nginx/yiyizi.top.access.log | awk '{print $1 " - " $7 " - " $9}'
echo

echo "7. 移动设备访问记录:"
grep -i "android\|iphone\|mobile\|xiaomi" /var/log/nginx/yiyizi.top.access.log | tail -3 | awk '{print $1 " - " $7 " - " $9}'
echo

echo "=== 诊断完成 ==="