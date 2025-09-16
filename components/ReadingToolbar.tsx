'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Settings, Bookmark, Share2, Type } from 'lucide-react';
import ReadingSettings from './ReadingSettings';

interface ReadingToolbarProps {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
}

export default function ReadingToolbar({ articleId, articleTitle, articleUrl }: ReadingToolbarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      
      setScrollProgress(progress * 100);
      setIsVisible(scrollTop > 300); // 滚动300px后显示
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 检查收藏状态
  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('reading-bookmarks') || '[]');
      setIsBookmarked(bookmarks.includes(articleId));
    } catch (error) {
      console.warn('检查收藏状态失败:', error);
    }
  }, [articleId]);

  // 回到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 切换收藏
  const toggleBookmark = () => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('reading-bookmarks') || '[]');
      let updatedBookmarks;
      
      if (isBookmarked) {
        updatedBookmarks = bookmarks.filter((id: string) => id !== articleId);
      } else {
        updatedBookmarks = [...bookmarks, articleId];
        
        // 同时保存文章信息
        const bookmarkedArticles = JSON.parse(localStorage.getItem('bookmarked-articles') || '{}');
        bookmarkedArticles[articleId] = {
          title: articleTitle,
          url: articleUrl,
          bookmarkedAt: new Date().toISOString()
        };
        localStorage.setItem('bookmarked-articles', JSON.stringify(bookmarkedArticles));
      }
      
      localStorage.setItem('reading-bookmarks', JSON.stringify(updatedBookmarks));
      setIsBookmarked(!isBookmarked);
    } catch (error) {
      console.warn('切换收藏状态失败:', error);
    }
  };

  // 分享文章
  const shareArticle = async () => {
    const shareData = {
      title: articleTitle,
      text: `推荐阅读：${articleTitle}`,
      url: articleUrl
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // 降级到复制链接
        await navigator.clipboard.writeText(articleUrl);
        alert('链接已复制到剪贴板');
      }
    } catch (error) {
      // 再次降级到手动复制
      try {
        await navigator.clipboard.writeText(articleUrl);
        alert('链接已复制到剪贴板');
      } catch (clipboardError) {
        console.warn('分享失败:', error);
        alert('分享功能暂不可用');
      }
    }
  };

  // 快速字体调整
  const adjustFontSize = (delta: number) => {
    try {
      const prefs = JSON.parse(localStorage.getItem('reading-preferences') || '{}');
      const currentSize = prefs.fontSize || 18;
      const newSize = Math.max(14, Math.min(28, currentSize + delta));
      
      const updated = { ...prefs, fontSize: newSize };
      localStorage.setItem('reading-preferences', JSON.stringify(updated));
      
      // 立即应用
      const articleContent = document.querySelector('#article-content') as HTMLElement;
      if (articleContent) {
        articleContent.style.fontSize = `${newSize}px`;
      }
    } catch (error) {
      console.warn('调整字体大小失败:', error);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* 浮动工具栏 */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2">
        {/* 阅读进度 */}
        <div className="relative">
          <button
            onClick={scrollToTop}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center group"
            aria-label="回到顶部"
          >
            <ArrowUp className="w-5 h-5" />
            
            {/* 进度环 */}
            <svg
              className="absolute inset-0 w-12 h-12 transform -rotate-90"
              viewBox="0 0 48 48"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 20}`}
                strokeDashoffset={`${2 * Math.PI * 20 * (1 - scrollProgress / 100)}`}
                className="transition-all duration-300"
              />
            </svg>
          </button>
        </div>

        {/* 工具按钮组 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-2 space-y-1">
          {/* 字体调整 */}
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => adjustFontSize(2)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="增大字体"
              title="增大字体"
            >
              <Type className="w-4 h-4" strokeWidth={3} />
            </button>
            <button
              onClick={() => adjustFontSize(-2)}
              className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="减小字体"
              title="减小字体"
            >
              <Type className="w-3 h-3" strokeWidth={2} />
            </button>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 mx-1" />

          {/* 阅读设置 */}
          <button
            onClick={() => setShowSettings(true)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="阅读设置"
            title="阅读设置"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* 收藏 */}
          <button
            onClick={toggleBookmark}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
              isBookmarked
                ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label={isBookmarked ? '取消收藏' : '收藏文章'}
            title={isBookmarked ? '取消收藏' : '收藏文章'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* 分享 */}
          <button
            onClick={shareArticle}
            className="w-8 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="分享文章"
            title="分享文章"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 阅读设置弹窗 */}
      <ReadingSettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        articleId={articleId}
      />
    </>
  );
}