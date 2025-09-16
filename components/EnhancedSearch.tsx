'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Clock, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useSearchHistory } from '@/hooks/useSearchHistory';

interface EnhancedSearchProps {
  isOpen: boolean;
  onClose: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function EnhancedSearch({
  isOpen,
  onClose,
  placeholder = '搜索文章标题或标签...',
  autoFocus = true
}: EnhancedSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    searchHistory,
    popularSearches,
    addSearchQuery,
    removeSearchHistory,
    clearSearchHistory,
    getSearchSuggestions
  } = useSearchHistory();

  const suggestions = getSearchSuggestions(searchTerm);

  // 自动聚焦
  useEffect(() => {
    if (isOpen && autoFocus && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, autoFocus]);

  // 处理搜索提交
  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    addSearchQuery(trimmedQuery);
    router.push(`/posts?search=${encodeURIComponent(trimmedQuery)}`);
    onClose();
    setSearchTerm('');
    setShowSuggestions(false);
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSearch(suggestions[activeIndex]);
    } else {
      handleSearch(searchTerm);
    }
  };

  // 处理键盘导航
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  // 处理输入聚焦
  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  // 点击外部关闭建议
  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowSuggestions(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      onClick={handleClickOutside}
    >
      <div className="flex min-h-full items-start justify-center p-4 sm:p-0">
        <div className="relative w-full max-w-2xl mt-16 mx-auto">
          {/* 搜索输入框 */}
          <div 
            className="relative bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 搜索表单 */}
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center px-6 py-4">
                <Search className="w-6 h-6 text-gray-400 mr-4" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="flex-1 text-lg bg-transparent border-none outline-none text-gray-100 placeholder-gray-400"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      inputRef.current?.focus();
                    }}
                    className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>

            {/* 建议列表 */}
            {showSuggestions && (
              <div className="border-t border-gray-700">
                {/* 搜索建议 */}
                {suggestions.length > 0 && (
                  <div className="p-4 border-b border-gray-800">
                    <h3 className="text-sm font-medium text-gray-400 mb-2">
                      搜索建议
                    </h3>
                    <div className="space-y-1">
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(suggestion)}
                          className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                            activeIndex === index
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          }`}
                        >
                          <Search className="w-4 h-4 mr-3 opacity-50" />
                          <span className="flex-1">{suggestion}</span>
                          <ArrowUpRight className="w-4 h-4 opacity-50" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 搜索历史 */}
                {searchHistory.length > 0 && (
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        最近搜索
                      </h3>
                      <button
                        onClick={clearSearchHistory}
                        className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        清空
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchHistory.slice(0, 6).map((query) => (
                        <div key={query} className="group relative">
                          <button
                            onClick={() => handleSearch(query)}
                            className="inline-flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors pr-8"
                          >
                            {query}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSearchHistory(query);
                            }}
                            className="absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 热门搜索 */}
                {popularSearches.length > 0 && (
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      热门搜索
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularSearches.slice(0, 8).map((query, index) => (
                        <button
                          key={query}
                          onClick={() => handleSearch(query)}
                          className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 text-sm rounded-full hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-colors border border-blue-200 dark:border-blue-800"
                        >
                          <span className="text-xs font-medium mr-1 text-blue-500">
                            {index + 1}
                          </span>
                          {query}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 空状态 */}
                {searchHistory.length === 0 && popularSearches.length === 0 && suggestions.length === 0 && (
                  <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium mb-2">开始搜索</p>
                    <p className="text-sm">输入关键词搜索文章标题或标签</p>
                  </div>
                )}
              </div>
            )}

            {/* 快捷键提示 */}
            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs">Enter</kbd>
                    <span className="ml-1">搜索</span>
                  </span>
                  <span className="flex items-center">
                    <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs">↑↓</kbd>
                    <span className="ml-1">选择</span>
                  </span>
                </div>
                <span className="flex items-center">
                  <kbd className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-xs">Esc</kbd>
                  <span className="ml-1">关闭</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}