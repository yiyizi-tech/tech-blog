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
    // 等待DOM渲染完成后，从实际渲染的HTML中提取标题
    const timer = setTimeout(() => {
      const items: TocItem[] = [];
      const articleContent = document.getElementById('article-content');
      
      if (articleContent) {
        // 从实际渲染的DOM中查找标题元素
        const headings = articleContent.querySelectorAll('h1, h2, h3');
        
        headings.forEach((heading) => {
          const level = parseInt(heading.tagName.substring(1)); // h1 -> 1, h2 -> 2, h3 -> 3
          const text = heading.textContent?.trim() || '';
          const id = heading.id || generateId(text);
          
          // 如果标题没有ID，则添加ID
          if (!heading.id) {
            heading.id = id;
          }
          
          items.push({ id, text, level });
        });
      }
      
      // 如果DOM中没有找到标题，回退到解析原始内容
      if (items.length === 0) {
        // 首先尝试从HTML中提取标题
        const htmlHeadingRegex = /<h([1-3])[^>]*(?:id=["']([^"']+)["'])?[^>]*>(.*?)<\/h[1-3]>/gi;
        let htmlMatch;
        
        while ((htmlMatch = htmlHeadingRegex.exec(content)) !== null) {
          const level = parseInt(htmlMatch[1]);
          const existingId = htmlMatch[2];
          const text = htmlMatch[3].replace(/<[^>]*>/g, '').trim(); // 移除HTML标签
          const id = existingId || generateId(text);
          items.push({ id, text, level });
        }
        
        // 如果没有找到HTML标题，尝试解析Markdown标题
        if (items.length === 0) {
          const lines = content.split('\n');
          
          lines.forEach(line => {
            const titleMatch = line.match(/^(#{1,3})\s+(.+)$/);
            if (titleMatch) {
              const level = titleMatch[1].length;
              const text = titleMatch[2].trim();
              const id = generateId(text);
              items.push({ id, text, level });
            }
          });
        }
      }
      
      setTocItems(items);
    }, 100); // 给DOM一些时间完成渲染
    
    return () => clearTimeout(timer);
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