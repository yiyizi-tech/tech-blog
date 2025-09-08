"use client";

import { useEffect, useState } from 'react';
import { smoothScroll } from '../utils/scroll';
import { generateId } from '../utils/markdown';

interface TableOfContentsProps {
  content: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  useEffect(() => {
    // 从内容中提取标题
    const lines = content.split('\n');
    const items: TocItem[] = [];
    
    lines.forEach(line => {
      const titleMatch = line.match(/^(#{1,3})\s+(.+)$/);
      if (titleMatch) {
        const level = titleMatch[1].length;
        const text = titleMatch[2].trim();
        const id = generateId(text);
        items.push({ id, text, level });
      }
    });
    
    setTocItems(items);
  }, [content]);

  const handleScroll = (id: string) => {
    smoothScroll(id);
  };

  if (tocItems.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">
          文章目录
        </h3>
        <p className="text-gray-400 text-sm">暂无目录</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-semibold text-white mb-4">
        文章目录
      </h3>
      <nav className="space-y-2">
        {tocItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleScroll(item.id)}
            className={`block w-full text-left transition-colors duration-200 text-sm cursor-pointer ${
              item.level === 1 
                ? 'text-white font-medium' 
                : item.level === 2 
                ? 'text-gray-300 ml-4' 
                : 'text-gray-400 ml-8'
            } hover:text-blue-400`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}