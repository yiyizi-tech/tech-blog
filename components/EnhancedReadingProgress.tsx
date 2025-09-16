'use client';

import { useState, useEffect } from 'react';

interface EnhancedReadingProgressProps {
  targetId: string;
  showPercentage?: boolean;
  showTimeEstimate?: boolean;
  averageReadingSpeed?: number; // 每分钟字数
}

export default function EnhancedReadingProgress({ 
  targetId, 
  showPercentage = false,
  showTimeEstimate = false,
  averageReadingSpeed = 200
}: EnhancedReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalWords, setTotalWords] = useState(0);

  useEffect(() => {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // 计算总字数
    const text = targetElement.textContent || '';
    const wordCount = text.length; // 对于中文，按字符数计算
    setTotalWords(wordCount);

    const handleScroll = () => {
      const rect = targetElement.getBoundingClientRect();
      const elementHeight = rect.height;
      const elementTop = rect.top;
      const windowHeight = window.innerHeight;

      // 计算阅读进度 - 基于实际阅读位置
      let scrollProgress = 0;
      
      if (elementTop >= 0) {
        // 文章还未开始进入视口
        scrollProgress = 0;
      } else if (elementTop + elementHeight <= windowHeight) {
        // 文章已完全通过视口
        scrollProgress = 1;
      } else {
        // 文章正在被阅读
        // 计算已经滚动过视口顶部的内容占总内容的比例
        const scrolledPastTop = Math.abs(elementTop);
        scrollProgress = scrolledPastTop / elementHeight;
      }

      scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      const percentage = scrollProgress * 100;
      
      setProgress(percentage);
      setIsVisible(percentage > 0 && percentage < 100);

      // 计算剩余阅读时间
      if (showTimeEstimate && wordCount > 0) {
        const remainingWords = wordCount * (1 - scrollProgress);
        const remainingMinutes = remainingWords / averageReadingSpeed;
        setTimeRemaining(Math.ceil(remainingMinutes));
      }
    };

    // 添加防抖
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // 初始检查
    handleScroll();

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    window.addEventListener('resize', throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
      window.removeEventListener('resize', throttledHandleScroll);
    };
  }, [targetId, showTimeEstimate, averageReadingSpeed]);

  return (
    <>
      {/* 顶部进度条 */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 侧边进度指示器 */}
      {isVisible && (
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
          <div className="flex flex-col items-center space-y-2">
            {/* 圆形进度 */}
            <div className="relative w-16 h-16">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 64 64"
              >
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="url(#progress-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                  className="transition-all duration-300 ease-out"
                />
                <defs>
                  <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* 百分比显示 */}
              {showPercentage && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {Math.round(progress)}%
                  </span>
                </div>
              )}
            </div>

            {/* 时间估算 */}
            {showTimeEstimate && timeRemaining > 0 && (
              <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                {timeRemaining > 1 ? `${timeRemaining}分钟` : '<1分钟'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 移动端底部进度 */}
      {isVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
          <div className="bg-black/90 backdrop-blur-sm text-white px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <span>阅读进度</span>
              <div className="flex items-center space-x-2">
                {showTimeEstimate && timeRemaining > 0 && (
                  <span className="text-xs text-gray-300">
                    还需 {timeRemaining > 1 ? `${timeRemaining}分钟` : '<1分钟'}
                  </span>
                )}
                <span className="font-medium">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
            <div className="mt-1 h-1 bg-gray-700 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}