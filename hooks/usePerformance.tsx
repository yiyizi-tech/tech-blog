'use client';

import React, { useEffect, useState } from 'react';

interface PerformanceMetrics {
  // 核心 Web Vitals
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
  
  // 自定义指标
  pageLoadTime?: number;
  domContentLoaded?: number;
  resourcesLoadTime?: number;
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 基础性能指标
    const measureBasicMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        setMetrics(prev => ({
          ...prev,
          ttfb: navigation.responseStart - navigation.requestStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
          pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
          resourcesLoadTime: navigation.loadEventEnd - navigation.domContentLoadedEventEnd,
        }));
      }
      setIsLoading(false);
    };

    // Web Vitals (如果支持的话)
    const measureWebVitals = () => {
      // FCP - First Contentful Paint
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
          }
        }
      });

      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.log('FCP measurement not supported');
      }

      // LCP - Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        setMetrics(prev => ({ ...prev, lcp: lastEntry.startTime }));
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.log('LCP measurement not supported');
      }

      // FID - First Input Delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          setMetrics(prev => ({ ...prev, fid: (entry as any).processingStart - entry.startTime }));
        }
      });

      try {
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.log('FID measurement not supported');
      }

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            setMetrics(prev => ({ ...prev, cls: clsValue }));
          }
        }
      });

      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.log('CLS measurement not supported');
      }
    };

    // 等待页面加载完成后测量基础指标
    if (document.readyState === 'complete') {
      measureBasicMetrics();
    } else {
      window.addEventListener('load', measureBasicMetrics);
    }

    // 开始测量 Web Vitals
    measureWebVitals();

    return () => {
      window.removeEventListener('load', measureBasicMetrics);
    };
  }, []);

  // 格式化指标的辅助函数
  const formatMetric = (value?: number, unit: 'ms' | 's' = 'ms') => {
    if (value === undefined) return 'N/A';
    
    if (unit === 's' && value > 1000) {
      return `${(value / 1000).toFixed(2)}s`;
    }
    
    return `${Math.round(value)}${unit}`;
  };

  // 评估性能等级
  const getPerformanceGrade = () => {
    if (!metrics.lcp || !metrics.fcp) return 'pending';
    
    const scores = [];
    
    // LCP 评分
    if (metrics.lcp <= 2500) scores.push(3);
    else if (metrics.lcp <= 4000) scores.push(2);
    else scores.push(1);
    
    // FCP 评分
    if (metrics.fcp <= 1800) scores.push(3);
    else if (metrics.fcp <= 3000) scores.push(2);
    else scores.push(1);
    
    // CLS 评分
    if (metrics.cls !== undefined) {
      if (metrics.cls <= 0.1) scores.push(3);
      else if (metrics.cls <= 0.25) scores.push(2);
      else scores.push(1);
    }
    
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (average >= 2.5) return 'good';
    if (average >= 2) return 'needs-improvement';
    return 'poor';
  };

  return {
    metrics,
    isLoading,
    formatMetric,
    performanceGrade: getPerformanceGrade(),
  };
}

// 性能监控组件（开发环境使用）
export function PerformanceMonitor() {
  const { metrics, isLoading, formatMetric, performanceGrade } = usePerformance();

  // 只在开发环境显示
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div className="mb-2 font-semibold">性能指标 ({performanceGrade})</div>
      {isLoading ? (
        <div>测量中...</div>
      ) : (
        <div className="space-y-1">
          <div>FCP: {formatMetric(metrics.fcp)}</div>
          <div>LCP: {formatMetric(metrics.lcp)}</div>
          <div>FID: {formatMetric(metrics.fid)}</div>
          <div>CLS: {metrics.cls?.toFixed(3) || 'N/A'}</div>
          <div>TTFB: {formatMetric(metrics.ttfb)}</div>
          <div>Load: {formatMetric(metrics.pageLoadTime)}</div>
        </div>
      )}
    </div>
  );
}