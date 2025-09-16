'use client';

import { useState, useEffect } from 'react';

const SEARCH_HISTORY_KEY = 'blog_search_history';
const POPULAR_SEARCHES_KEY = 'blog_popular_searches';
const MAX_HISTORY_ITEMS = 10;
const MAX_POPULAR_ITEMS = 8;

interface SearchHistoryItem {
  query: string;
  timestamp: number;
  count: number;
}

interface PopularSearchItem {
  query: string;
  count: number;
  lastSearched: number;
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);

  // 从localStorage加载数据
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      const savedPopular = localStorage.getItem(POPULAR_SEARCHES_KEY);
      
      if (savedHistory) {
        const historyData: SearchHistoryItem[] = JSON.parse(savedHistory);
        const sortedHistory = historyData
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, MAX_HISTORY_ITEMS)
          .map(item => item.query);
        setSearchHistory(sortedHistory);
      }
      
      if (savedPopular) {
        const popularData: PopularSearchItem[] = JSON.parse(savedPopular);
        const sortedPopular = popularData
          .sort((a, b) => b.count - a.count)
          .slice(0, MAX_POPULAR_ITEMS)
          .map(item => item.query);
        setPopularSearches(sortedPopular);
      }
    } catch (error) {
      console.warn('加载搜索历史失败:', error);
    }
  }, []);

  // 添加搜索记录
  const addSearchQuery = (query: string) => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    try {
      // 更新搜索历史
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      let historyData: SearchHistoryItem[] = savedHistory ? JSON.parse(savedHistory) : [];
      
      // 查找是否已存在
      const existingIndex = historyData.findIndex(item => 
        item.query.toLowerCase() === trimmedQuery.toLowerCase()
      );
      
      if (existingIndex >= 0) {
        // 更新现有项
        historyData[existingIndex] = {
          ...historyData[existingIndex],
          timestamp: Date.now(),
          count: historyData[existingIndex].count + 1
        };
      } else {
        // 添加新项
        historyData.unshift({
          query: trimmedQuery,
          timestamp: Date.now(),
          count: 1
        });
      }
      
      // 限制历史记录数量
      historyData = historyData.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(historyData));
      
      // 更新状态
      const newHistory = historyData
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(item => item.query);
      setSearchHistory(newHistory);

      // 更新热门搜索
      const savedPopular = localStorage.getItem(POPULAR_SEARCHES_KEY);
      let popularData: PopularSearchItem[] = savedPopular ? JSON.parse(savedPopular) : [];
      
      const existingPopularIndex = popularData.findIndex(item => 
        item.query.toLowerCase() === trimmedQuery.toLowerCase()
      );
      
      if (existingPopularIndex >= 0) {
        popularData[existingPopularIndex] = {
          ...popularData[existingPopularIndex],
          count: popularData[existingPopularIndex].count + 1,
          lastSearched: Date.now()
        };
      } else {
        popularData.push({
          query: trimmedQuery,
          count: 1,
          lastSearched: Date.now()
        });
      }
      
      // 按搜索次数排序并限制数量
      popularData = popularData
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_POPULAR_ITEMS);
      
      localStorage.setItem(POPULAR_SEARCHES_KEY, JSON.stringify(popularData));
      
      // 更新状态
      const newPopular = popularData.map(item => item.query);
      setPopularSearches(newPopular);
      
    } catch (error) {
      console.warn('保存搜索记录失败:', error);
    }
  };

  // 删除单个搜索历史
  const removeSearchHistory = (query: string) => {
    try {
      const savedHistory = localStorage.getItem(SEARCH_HISTORY_KEY);
      if (!savedHistory) return;
      
      const historyData: SearchHistoryItem[] = JSON.parse(savedHistory);
      const filteredData = historyData.filter(item => 
        item.query.toLowerCase() !== query.toLowerCase()
      );
      
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filteredData));
      
      const newHistory = filteredData
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(item => item.query);
      setSearchHistory(newHistory);
    } catch (error) {
      console.warn('删除搜索历史失败:', error);
    }
  };

  // 清空搜索历史
  const clearSearchHistory = () => {
    try {
      localStorage.removeItem(SEARCH_HISTORY_KEY);
      setSearchHistory([]);
    } catch (error) {
      console.warn('清空搜索历史失败:', error);
    }
  };

  // 清空热门搜索
  const clearPopularSearches = () => {
    try {
      localStorage.removeItem(POPULAR_SEARCHES_KEY);
      setPopularSearches([]);
    } catch (error) {
      console.warn('清空热门搜索失败:', error);
    }
  };

  // 获取搜索建议
  const getSearchSuggestions = (query: string): string[] => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return [];
    
    const suggestions = new Set<string>();
    
    // 从搜索历史中匹配
    searchHistory.forEach(item => {
      if (item.toLowerCase().includes(trimmedQuery) && item.toLowerCase() !== trimmedQuery) {
        suggestions.add(item);
      }
    });
    
    // 从热门搜索中匹配
    popularSearches.forEach(item => {
      if (item.toLowerCase().includes(trimmedQuery) && item.toLowerCase() !== trimmedQuery) {
        suggestions.add(item);
      }
    });
    
    return Array.from(suggestions).slice(0, 5);
  };

  return {
    searchHistory,
    popularSearches,
    addSearchQuery,
    removeSearchHistory,
    clearSearchHistory,
    clearPopularSearches,
    getSearchSuggestions
  };
}