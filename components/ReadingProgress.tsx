'use client';

import { useState, useEffect } from 'react';

interface ReadingProgressProps {
  targetId?: string;
  className?: string;
}

export default function ReadingProgress({ 
  targetId = 'article-content', 
  className = '' 
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const targetElement = document.getElementById(targetId);
      if (!targetElement) return;

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      // 获取文章内容的位置信息
      const articleTop = targetElement.offsetTop;
      const articleHeight = targetElement.offsetHeight;
      
      // 计算滚动进度
      const scrolledDistance = scrollTop - articleTop + windowHeight;
      const totalDistance = articleHeight;
      
      let currentProgress = 0;
      
      // 当用户滚动到文章内容时开始计算进度
      if (scrolledDistance > 0 && scrolledDistance < totalDistance + windowHeight) {
        currentProgress = Math.min(100, Math.max(0, (scrolledDistance / totalDistance) * 100));
      } else if (scrolledDistance >= totalDistance + windowHeight) {
        currentProgress = 100;
      }
      
      setProgress(currentProgress);
    };

    // 添加滚动事件监听器
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 初始计算
    handleScroll();
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [targetId]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-40 h-1 bg-gray-900/20 backdrop-blur-sm ${className}`}>
      <div 
        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
        style={{ 
          width: `${progress}%`,
          boxShadow: progress > 0 ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
        }}
      />
    </div>
  );
}