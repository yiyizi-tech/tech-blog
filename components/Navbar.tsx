"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import EnhancedSearch from "./EnhancedSearch";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // 监听滚动事件，添加背景效果
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // 键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 如果是admin页面，不显示导航栏
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    { href: "/", label: "首页" },
    { href: "/posts", label: "文章" },
    { href: "/about", label: "关于我" },
    { href: "/contact", label: "联系方式" }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-xl"
      style={{ 
        backgroundColor: isScrolled 
          ? 'color-mix(in srgb, var(--background) 80%, transparent)' 
          : 'color-mix(in srgb, var(--background) 50%, transparent)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-xl font-semibold transition-colors duration-200"
            style={{ color: 'var(--foreground)' }}
          >
            壹壹零壹Blog
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-all duration-200"
                style={{ 
                  color: pathname === item.href 
                    ? 'var(--foreground)' 
                    : 'var(--muted-foreground)' 
                }}
              >
                {item.label}
              </Link>
            ))}
            
            {/* 搜索按钮 */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 transition-colors duration-200 rounded-lg hover:bg-gray-800 cursor-pointer"
              style={{ color: 'var(--muted-foreground)' }}
              title="搜索 (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>
            
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 transition-colors"
            style={{ color: 'var(--foreground)' }}
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className="md:hidden border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="px-6 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block text-sm font-medium transition-colors duration-200"
                style={{ 
                  color: pathname === item.href 
                    ? 'var(--foreground)' 
                    : 'var(--muted-foreground)' 
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* 增强搜索组件 */}
      <EnhancedSearch 
        isOpen={showSearch} 
        onClose={() => setShowSearch(false)} 
      />
    </nav>
  );
}