'use client';

import { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, QrCode, Check } from 'lucide-react';
import { RippleButton } from './MicroInteractions';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

const SHARE_PLATFORMS = [
  {
    name: 'Twitter',
    icon: Twitter,
    color: 'bg-blue-500 hover:bg-blue-600',
    getUrl: (url: string, title: string, hashtags?: string[]) => {
      const text = encodeURIComponent(title);
      const shareUrl = encodeURIComponent(url);
      const tags = hashtags ? encodeURIComponent(hashtags.join(' ')) : '';
      return `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}&hashtags=${tags}`;
    }
  },
  {
    name: 'Facebook',
    icon: Facebook,
    color: 'bg-blue-600 hover:bg-blue-700',
    getUrl: (url: string, title: string) => {
      const shareUrl = encodeURIComponent(url);
      return `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    }
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'bg-blue-700 hover:bg-blue-800',
    getUrl: (url: string, title: string, description?: string) => {
      const shareUrl = encodeURIComponent(url);
      const shareTitle = encodeURIComponent(title);
      const summary = description ? encodeURIComponent(description) : '';
      return `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${summary}`;
    }
  },
  {
    name: '微博',
    icon: Share2,
    color: 'bg-red-500 hover:bg-red-600',
    getUrl: (url: string, title: string) => {
      const text = encodeURIComponent(`${title} ${url}`);
      return `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${text}`;
    }
  }
];

export default function SocialShare({ 
  url, 
  title, 
  description, 
  hashtags,
  className = '' 
}: SocialShareProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('复制链接失败:', error);
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackError) {
        console.error('复制链接失败:', fallbackError);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share && navigator.canShare({ title, text: description, url })) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (error) {
        console.warn('原生分享失败:', error);
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  const openShareWindow = (shareUrl: string) => {
    const width = 600;
    const height = 400;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    
    window.open(
      shareUrl,
      'share',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  };

  const generateQRCode = () => {
    // 使用二维码API生成二维码
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;
  };

  return (
    <>
      {/* 分享按钮 */}
      <RippleButton
        onClick={handleNativeShare}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${className}`}
      >
        <Share2 className="w-4 h-4" />
        <span>分享</span>
      </RippleButton>

      {/* 分享模态框 */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  分享文章
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* 内容 */}
              <div className="p-6">
                {/* 社交平台 */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {SHARE_PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.name}
                        onClick={() => {
                          const shareUrl = (platform as any).getUrl(url, title, hashtags);
                          openShareWindow(shareUrl);
                        }}
                        className={`flex items-center justify-center space-x-2 p-3 text-white rounded-lg transition-colors ${platform.color}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{platform.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 链接复制 */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    复制链接
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={url}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={copyToClipboard}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-1 ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span className="text-sm">已复制</span>
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4" />
                          <span className="text-sm">复制</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 二维码 */}
                <div className="mt-6">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <QrCode className="w-4 h-4" />
                    <span className="text-sm">显示二维码</span>
                  </button>
                  
                  {showQR && (
                    <div className="mt-3 text-center">
                      <img
                        src={generateQRCode()}
                        alt="分享二维码"
                        className="mx-auto border border-gray-200 dark:border-gray-700 rounded-lg"
                        width={150}
                        height={150}
                      />
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        扫描二维码分享
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 简化版分享按钮
export function ShareButtonSimple({ 
  url, 
  title, 
  description,
  className = '' 
}: SocialShareProps) {
  const handleShare = async () => {
    if (navigator.share && navigator.canShare({ title, text: description, url })) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (error) {
        // 降级到复制链接
        try {
          await navigator.clipboard.writeText(url);
          alert('链接已复制到剪贴板');
        } catch (clipboardError) {
          console.error('分享失败:', error);
        }
      }
    } else {
      // 降级到复制链接
      try {
        await navigator.clipboard.writeText(url);
        alert('链接已复制到剪贴板');
      } catch (error) {
        console.error('复制链接失败:', error);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center space-x-1 text-gray-400 hover:text-white transition-colors ${className}`}
      title="分享文章"
    >
      <Share2 className="w-4 h-4" />
      <span className="text-sm">分享</span>
    </button>
  );
}