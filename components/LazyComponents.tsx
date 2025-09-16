'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactElement } from 'react';

// 定义加载状态组件
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const LoadingCard = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 animate-pulse">
    <div className="h-6 bg-gray-600 rounded mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
      <div className="h-4 bg-gray-600 rounded w-1/2"></div>
    </div>
  </div>
);

// 动态导入组件 - 管理后台相关
export const LazyPostEditor = dynamic(
  () => import('./admin/PostEditor'),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

export const LazyAnalyticsPage = dynamic(
  () => import('./admin/AnalyticsPage'),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

export const LazyPostsManagement = dynamic(
  () => import('./admin/PostsManagement'),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

export const LazySettingsPage = dynamic(
  () => import('./admin/SettingsPage'),
  {
    loading: () => <LoadingCard />,
    ssr: false,
  }
);

// 动态导入组件 - 前端功能
export const LazyEnhancedComments = dynamic(
  () => import('./EnhancedComments'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true, // 评论可以SSR
  }
);

export const LazyImageUploadModal = dynamic(
  () => import('./ImageUploadModal'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyMediaSelector = dynamic(
  () => import('./MediaSelector'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

export const LazyEditor = dynamic(
  () => import('./Editor'),
  {
    loading: () => <LoadingCard />,
    ssr: false, // 富文本编辑器不需要SSR
  }
);

// 图表相关组件
export const LazyAnalyticsDashboard = dynamic(
  () => import('./AnalyticsDashboard'),
  {
    loading: () => <LoadingCard />,
    ssr: false, // 图表组件不需要SSR
  }
);

// 重型交互组件
export const LazyReadingSettings = dynamic(
  () => import('./ReadingSettings'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// 导出类型以便TypeScript使用
export type LazyComponentType<P = {}> = ComponentType<P>;

// 工具函数：创建延迟加载的组件
export function createLazyComponent<P = {}>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: {
    loading?: () => ReactElement;
    ssr?: boolean;
  } = {}
): ComponentType<P> {
  return dynamic(importFn, {
    loading: options.loading || (() => <LoadingSpinner />),
    ssr: options.ssr !== false,
  });
}