'use client';

import { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  type: 'page_view' | 'article_view' | 'search' | 'share' | 'bookmark' | 'comment';
  page?: string;
  article?: string;
  query?: string;
  platform?: string;
  timestamp?: number;
  sessionId?: string;
  userAgent?: string;
}

interface AnalyticsStats {
  totalViews: number;
  uniqueVisitors: number;
  topPages: Array<{ page: string; views: number }>;
  topArticles: Array<{ article: string; views: number }>;
  searchQueries: Array<{ query: string; count: number }>;
  dailyStats: Array<{ date: string; views: number; visitors: number }>;
}

class AnalyticsManager {
  private sessionId: string;
  private startTime: number;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeSession() {
    // 记录会话开始
    this.trackEvent({
      type: 'page_view',
      page: window.location.pathname
    });
  }

  trackEvent(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId' | 'userAgent'>) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userAgent: navigator.userAgent
    };

    // 存储到 localStorage（实际项目中应该发送到服务器）
    this.saveEventToStorage(fullEvent);
  }

  private saveEventToStorage(event: AnalyticsEvent) {
    try {
      const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      events.push(event);
      
      // 限制存储的事件数量（保留最近1000个事件）
      if (events.length > 1000) {
        events.splice(0, events.length - 1000);
      }
      
      localStorage.setItem('analytics_events', JSON.stringify(events));
    } catch (error) {
      console.warn('保存分析事件失败:', error);
    }
  }

  getStats(): AnalyticsStats {
    try {
      const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      
      return {
        totalViews: this.calculateTotalViews(events),
        uniqueVisitors: this.calculateUniqueVisitors(events),
        topPages: this.calculateTopPages(events),
        topArticles: this.calculateTopArticles(events),
        searchQueries: this.calculateSearchQueries(events),
        dailyStats: this.calculateDailyStats(events)
      };
    } catch (error) {
      console.warn('获取统计数据失败:', error);
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        topPages: [],
        topArticles: [],
        searchQueries: [],
        dailyStats: []
      };
    }
  }

  private calculateTotalViews(events: AnalyticsEvent[]): number {
    return events.filter(e => e.type === 'page_view' || e.type === 'article_view').length;
  }

  private calculateUniqueVisitors(events: AnalyticsEvent[]): number {
    const uniqueSessions = new Set(events.map(e => e.sessionId));
    return uniqueSessions.size;
  }

  private calculateTopPages(events: AnalyticsEvent[]): Array<{ page: string; views: number }> {
    const pageViews: Record<string, number> = {};
    
    events
      .filter(e => e.type === 'page_view' && e.page)
      .forEach(e => {
        pageViews[e.page!] = (pageViews[e.page!] || 0) + 1;
      });

    return Object.entries(pageViews)
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private calculateTopArticles(events: AnalyticsEvent[]): Array<{ article: string; views: number }> {
    const articleViews: Record<string, number> = {};
    
    events
      .filter(e => e.type === 'article_view' && e.article)
      .forEach(e => {
        articleViews[e.article!] = (articleViews[e.article!] || 0) + 1;
      });

    return Object.entries(articleViews)
      .map(([article, views]) => ({ article, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private calculateSearchQueries(events: AnalyticsEvent[]): Array<{ query: string; count: number }> {
    const queries: Record<string, number> = {};
    
    events
      .filter(e => e.type === 'search' && e.query)
      .forEach(e => {
        queries[e.query!] = (queries[e.query!] || 0) + 1;
      });

    return Object.entries(queries)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private calculateDailyStats(events: AnalyticsEvent[]): Array<{ date: string; views: number; visitors: number }> {
    const dailyData: Record<string, { views: Set<string>; visitors: Set<string> }> = {};
    
    events.forEach(e => {
      if (!e.timestamp) return;
      
      const date = new Date(e.timestamp).toISOString().split('T')[0];
      
      if (!dailyData[date]) {
        dailyData[date] = { views: new Set(), visitors: new Set() };
      }
      
      if (e.type === 'page_view' || e.type === 'article_view') {
        dailyData[date].views.add(`${e.sessionId}_${e.timestamp}`);
      }
      
      if (e.sessionId) {
        dailyData[date].visitors.add(e.sessionId);
      }
    });

    return Object.entries(dailyData)
      .map(([date, data]) => ({
        date,
        views: data.views.size,
        visitors: data.visitors.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // 最近30天
  }

  // 清理旧数据
  cleanup() {
    try {
      const events: AnalyticsEvent[] = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
      
      const filteredEvents = events.filter(e => (e.timestamp || 0) > thirtyDaysAgo);
      localStorage.setItem('analytics_events', JSON.stringify(filteredEvents));
    } catch (error) {
      console.warn('清理分析数据失败:', error);
    }
  }
}

// 全局实例
const analyticsManager = new AnalyticsManager();

export function useAnalytics() {
  const trackPageView = useCallback((page: string) => {
    analyticsManager.trackEvent({
      type: 'page_view',
      page
    });
  }, []);

  const trackArticleView = useCallback((article: string) => {
    analyticsManager.trackEvent({
      type: 'article_view',
      article
    });
  }, []);

  const trackSearch = useCallback((query: string) => {
    analyticsManager.trackEvent({
      type: 'search',
      query
    });
  }, []);

  const trackShare = useCallback((platform: string, article?: string) => {
    analyticsManager.trackEvent({
      type: 'share',
      platform,
      article
    });
  }, []);

  const trackBookmark = useCallback((article: string) => {
    analyticsManager.trackEvent({
      type: 'bookmark',
      article
    });
  }, []);

  const trackComment = useCallback((article: string) => {
    analyticsManager.trackEvent({
      type: 'comment',
      article
    });
  }, []);

  const getStats = useCallback(() => {
    return analyticsManager.getStats();
  }, []);

  const cleanup = useCallback(() => {
    analyticsManager.cleanup();
  }, []);

  // 自动清理旧数据
  useEffect(() => {
    const interval = setInterval(() => {
      cleanup();
    }, 24 * 60 * 60 * 1000); // 每天清理一次

    return () => clearInterval(interval);
  }, [cleanup]);

  return {
    trackPageView,
    trackArticleView,
    trackSearch,
    trackShare,
    trackBookmark,
    trackComment,
    getStats,
    cleanup
  };
}