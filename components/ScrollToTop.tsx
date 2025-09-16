'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      setIsVisible(scrollTop > 400); // 滚动400px后显示
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center border border-white/20 hover:border-white/30 cursor-pointer"
      aria-label="回到顶部"
      title="回到顶部"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}