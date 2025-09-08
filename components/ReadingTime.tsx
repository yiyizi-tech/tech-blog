'use client';

interface ReadingTimeProps {
  content: string;
  wordsPerMinute?: number;
  className?: string;
}

export default function ReadingTime({ 
  content, 
  wordsPerMinute = 200, // 中文阅读速度大约 200 字/分钟
  className = '' 
}: ReadingTimeProps) {
  // 计算阅读时间的函数
  const calculateReadingTime = (text: string): number => {
    // 移除HTML标签和多余空格
    const plainText = text
      .replace(/<[^>]*>/g, '') // 移除HTML标签
      .replace(/&nbsp;/g, ' ') // 替换HTML空格
      .replace(/\s+/g, ' ') // 合并多个空格
      .trim();
    
    // 计算字符数（中文字符和英文单词）
    const chineseChars = (plainText.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (plainText.match(/[a-zA-Z]+/g) || []).length;
    
    // 中文字数按字符计算，英文按单词计算
    const totalWords = chineseChars + englishWords;
    
    // 计算阅读时间（分钟）
    const readingTime = Math.ceil(totalWords / wordsPerMinute);
    
    return Math.max(1, readingTime); // 最少1分钟
  };

  const readingTime = calculateReadingTime(content);

  return (
    <div className={`flex items-center text-sm text-gray-400 ${className}`}>
      <svg 
        className="w-4 h-4 mr-1" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span>预计阅读 {readingTime} 分钟</span>
    </div>
  );
}