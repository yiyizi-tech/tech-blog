'use client';

import { useState } from 'react';
import { Rss, Mail, Bell, Check, Copy } from 'lucide-react';
import { RippleButton } from './MicroInteractions';

interface RSSSubscriptionProps {
  className?: string;
}

const RSS_READERS = [
  {
    name: 'Feedly',
    icon: '📖',
    url: 'https://feedly.com/i/subscription/feed/',
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    name: 'Inoreader',
    icon: '📰',
    url: 'https://www.inoreader.com/feed/',
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: 'Pocket',
    icon: '💾',
    url: 'https://getpocket.com/edit?url=',
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    name: 'Apple News',
    icon: '🍎',
    url: 'https://news.apple.com/?cid=',
    color: 'bg-gray-800 hover:bg-gray-900'
  }
];

export default function RSSSubscription({ className = '' }: RSSSubscriptionProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const rssUrl = `${window.location.origin}/rss`;

  const copyRSSUrl = async () => {
    try {
      await navigator.clipboard.writeText(rssUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('复制RSS链接失败:', error);
    }
  };

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubscribing(true);
    
    try {
      // 这里应该调用实际的邮件订阅API
      await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用
      
      setEmailSubscribed(true);
      setEmail('');
      alert('订阅成功！您将收到最新文章的邮件通知。');
    } catch (error) {
      console.error('邮件订阅失败:', error);
      alert('订阅失败，请稍后重试。');
    } finally {
      setSubscribing(false);
    }
  };

  const openRSSReader = (reader: typeof RSS_READERS[0]) => {
    const url = `${reader.url}${encodeURIComponent(rssUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* RSS订阅按钮 */}
      <RippleButton
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center space-x-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors ${className}`}
      >
        <Rss className="w-4 h-4" />
        <span>订阅RSS</span>
      </RippleButton>

      {/* RSS订阅模态框 */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Rss className="w-6 h-6 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    订阅我的博客
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* 内容 */}
              <div className="p-6 space-y-6">
                {/* RSS说明 */}
                <div className="text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    通过RSS订阅，您可以在您喜欢的阅读器中及时获取我的最新文章。
                    选择以下任一方式开始订阅：
                  </p>
                </div>

                {/* 邮件订阅 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      邮件订阅
                    </h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    直接接收最新文章到您的邮箱
                  </p>
                  
                  {!emailSubscribed ? (
                    <form onSubmit={handleEmailSubscribe} className="space-y-3">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="输入您的邮箱地址"
                        required
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={subscribing}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {subscribing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>订阅中...</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-4 h-4" />
                            <span>订阅邮件通知</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <Check className="w-5 h-5" />
                      <span>邮件订阅成功！</span>
                    </div>
                  )}
                </div>

                {/* RSS阅读器 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                    <Rss className="w-5 h-5 text-orange-500" />
                    <span>RSS阅读器</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {RSS_READERS.map((reader) => (
                      <button
                        key={reader.name}
                        onClick={() => openRSSReader(reader)}
                        className={`flex items-center space-x-2 p-3 text-white rounded-lg transition-colors ${reader.color}`}
                      >
                        <span className="text-lg">{reader.icon}</span>
                        <span className="font-medium text-sm">{reader.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* RSS链接 */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
                    RSS链接
                  </h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={rssUrl}
                      readOnly
                      className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-gray-100 focus:outline-none"
                    />
                    <button
                      onClick={copyRSSUrl}
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
                          <Copy className="w-4 h-4" />
                          <span className="text-sm">复制</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    将此链接添加到您喜欢的RSS阅读器中
                  </p>
                </div>

                {/* 其他订阅方式 */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    您也可以通过社交媒体关注我们的最新动态
                  </p>
                  <div className="flex justify-center space-x-4 mt-3">
                    <a
                      href="https://twitter.com/your_twitter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                      Twitter
                    </a>
                    <a
                      href="https://github.com/your_github"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 简化版RSS按钮
export function RSSButton({ className = '' }: { className?: string }) {
  const handleClick = () => {
    window.open('/rss', '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center space-x-1 text-orange-500 hover:text-orange-600 transition-colors ${className}`}
      title="RSS订阅"
    >
      <Rss className="w-4 h-4" />
      <span className="text-sm">RSS</span>
    </button>
  );
}