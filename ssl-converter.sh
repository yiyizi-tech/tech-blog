#!/bin/bash

# ======================================
# 🔧 SSL证书格式转换工具
# ======================================

echo "🔧 SSL证书格式转换工具"
echo ""

# 检查是否提供了参数
if [ $# -eq 0 ]; then
    echo "📋 使用方法："
    echo "   $0 <证书文件> <私钥文件> <输出格式>"
    echo ""
    echo "📋 支持的格式："
    echo "   - pem      PEM格式（默认）"
    echo "   - pfx      PKCS#12格式"
    echo "   - jks      Java KeyStore格式"
    echo "   - combined 合并证书和私钥"
    echo ""
    echo "📋 示例："
    echo "   $0 certificate.pem private.key pfx"
    echo "   $0 certificate.pem private.key combined"
    exit 1
fi

CERT_FILE=$1
KEY_FILE=$2
OUTPUT_FORMAT=${3:-pem}

# 检查文件是否存在
if [ ! -f "$CERT_FILE" ]; then
    echo "❌ 证书文件不存在: $CERT_FILE"
    exit 1
fi

if [ ! -f "$KEY_FILE" ]; then
    echo "❌ 私钥文件不存在: $KEY_FILE"
    exit 1
fi

# 获取文件名（不含扩展名）
BASE_NAME=$(basename "$CERT_FILE" .pem)

case $OUTPUT_FORMAT in
    "pem")
        echo "📝 转换为PEM格式..."
        cp "$CERT_FILE" "${BASE_NAME}_converted.pem"
        cp "$KEY_FILE" "${BASE_NAME}_converted.key"
        echo "✅ 转换完成："
        echo "   证书文件: ${BASE_NAME}_converted.pem"
        echo "   私钥文件: ${BASE_NAME}_converted.key"
        ;;
        
    "pfx")
        echo "📝 转换为PKCS#12 (.pfx) 格式..."
        if ! command -v openssl &> /dev/null; then
            echo "❌ OpenSSL 未安装，无法转换"
            exit 1
        fi
        openssl pkcs12 -export -out "${BASE_NAME}.pfx" -inkey "$KEY_FILE" -in "$CERT_FILE"
        echo "✅ 转换完成：${BASE_NAME}.pfx"
        ;;
        
    "jks")
        echo "📝 转换为Java KeyStore (.jks) 格式..."
        if ! command -v keytool &> /dev/null; then
            echo "❌ keytool 未安装，无法转换"
            exit 1
        fi
        
        # 先转换为PKCS#12，再转换为JKS
        openssl pkcs12 -export -out temp.p12 -inkey "$KEY_FILE" -in "$CERT_FILE" -passout pass:temp123
        
        keytool -importkeystore -srckeystore temp.p12 -srcstoretype PKCS12 -srcstorepass temp123 \
                 -destkeystore "${BASE_NAME}.jks" -deststoretype JKS -deststorepass changeit
        
        rm -f temp.p12
        echo "✅ 转换完成：${BASE_NAME}.jks"
        echo "⚠️  密码: changeit"
        ;;
        
    "combined")
        echo "📝 合并证书和私钥为单个文件..."
        cat "$KEY_FILE" "$CERT_FILE" > "${BASE_NAME}_combined.pem"
        echo "✅ 合并完成：${BASE_NAME}_combined.pem"
        ;;
        
    *)
        echo "❌ 不支持的格式: $OUTPUT_FORMAT"
        exit 1
        ;;
esac

echo ""
echo "📋 转换后的文件可以用于："
echo "   PEM格式: Nginx, Apache, Next.js"
echo "   PFX格式: IIS, Tomcat"
echo "   JKS格式: Java应用, Tomcat"
echo "   Combined: 某些需要合并文件的应用"