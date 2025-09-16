'use client';

import { useState, useEffect } from 'react';
import { Settings, Type, Palette, BookOpen, X } from 'lucide-react';

interface ReadingPreferences {
  fontSize: number;
  lineHeight: number;
  fontFamily: string;
  backgroundColor: string;
  textColor: string;
  maxWidth: string;
  readingProgress: Record<string, number>;
}

interface ReadingSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  articleId?: string;
}

const FONT_FAMILIES = [
  { name: '系统默认', value: 'var(--font-geist-sans)' },
  { name: '思源黑体', value: '"Source Han Sans", sans-serif' },
  { name: '苹方', value: '"PingFang SC", sans-serif' },
  { name: '微软雅黑', value: '"Microsoft YaHei", sans-serif' },
  { name: '宋体', value: '"SimSun", serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times', value: '"Times New Roman", serif' }
];

const BACKGROUND_THEMES = [
  { name: '默认深色', bg: 'var(--background)', text: 'var(--foreground)' },
  { name: '护眼绿', bg: '#1a2e1a', text: '#e8f5e8' },
  { name: '暖色调', bg: '#2a1f17', text: '#f5e6d3' },
  { name: '海洋蓝', bg: '#0f1419', text: '#e6f3ff' },
  { name: '纯黑模式', bg: '#000000', text: '#ffffff' },
  { name: '米白色', bg: '#f8f6f0', text: '#2c2c2c' },
  { name: '羊皮纸', bg: '#f4f1e8', text: '#3c3c3c' }
];

export default function ReadingSettings({ isOpen, onClose, articleId }: ReadingSettingsProps) {
  const [preferences, setPreferences] = useState<ReadingPreferences>({
    fontSize: 18,
    lineHeight: 1.8,
    fontFamily: 'var(--font-geist-sans)',
    backgroundColor: 'var(--background)',
    textColor: 'var(--foreground)',
    maxWidth: '4xl',
    readingProgress: {}
  });

  // 加载设置
  useEffect(() => {
    try {
      const saved = localStorage.getItem('reading-preferences');
      if (saved) {
        const parsedPreferences = JSON.parse(saved);
        setPreferences(prev => ({ ...prev, ...parsedPreferences }));
      }
    } catch (error) {
      console.warn('加载阅读设置失败:', error);
    }
  }, []);

  // 保存设置
  const savePreferences = (newPreferences: Partial<ReadingPreferences>) => {
    const updated = { ...preferences, ...newPreferences };
    setPreferences(updated);
    
    try {
      localStorage.setItem('reading-preferences', JSON.stringify(updated));
    } catch (error) {
      console.warn('保存阅读设置失败:', error);
    }
  };

  // 应用设置到文档
  useEffect(() => {
    const articleContent = document.querySelector('#article-content');
    if (articleContent) {
      const element = articleContent as HTMLElement;
      element.style.fontSize = `${preferences.fontSize}px`;
      element.style.lineHeight = preferences.lineHeight.toString();
      element.style.fontFamily = preferences.fontFamily;
      element.style.backgroundColor = preferences.backgroundColor;
      element.style.color = preferences.textColor;
      element.style.maxWidth = getMaxWidthValue(preferences.maxWidth);
      element.style.margin = '0 auto';
      element.style.padding = '2rem';
      element.style.borderRadius = '1rem';
    }
  }, [preferences]);

  // 保存阅读进度
  const saveReadingProgress = (progress: number) => {
    if (!articleId) return;
    
    const newProgress = {
      ...preferences.readingProgress,
      [articleId]: progress
    };
    
    savePreferences({ readingProgress: newProgress });
  };

  // 监听滚动保存进度
  useEffect(() => {
    if (!articleId) return;

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const articleContent = document.querySelector('#article-content');
          if (articleContent) {
            const rect = articleContent.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const progress = Math.max(0, Math.min(100, 
              ((viewportHeight - rect.top) / (rect.height + viewportHeight)) * 100
            ));
            
            if (progress > 5) { // 只有滚动了一定程度才保存
              saveReadingProgress(progress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, preferences.readingProgress]);

  // 恢复阅读进度
  const restoreReadingProgress = () => {
    if (!articleId || !preferences.readingProgress[articleId]) return;
    
    const progress = preferences.readingProgress[articleId];
    const articleContent = document.querySelector('#article-content');
    
    if (articleContent && progress > 10) {
      const rect = articleContent.getBoundingClientRect();
      const targetY = (progress / 100) * rect.height - window.innerHeight / 2;
      
      window.scrollTo({
        top: window.pageYOffset + rect.top + targetY,
        behavior: 'smooth'
      });
    }
  };

  const getMaxWidthValue = (width: string) => {
    const widthMap: Record<string, string> = {
      'sm': '24rem',
      'md': '28rem',
      'lg': '32rem',
      'xl': '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      'full': '100%'
    };
    return widthMap[width] || '56rem';
  };

  const resetToDefaults = () => {
    const defaults: ReadingPreferences = {
      fontSize: 18,
      lineHeight: 1.8,
      fontFamily: 'var(--font-geist-sans)',
      backgroundColor: 'var(--background)',
      textColor: 'var(--foreground)',
      maxWidth: '4xl',
      readingProgress: preferences.readingProgress // 保留阅读进度
    };
    savePreferences(defaults);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700">
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                阅读设置
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="p-6 space-y-8">
            {/* 字体设置 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2" />
                字体设置
              </h3>
              
              <div className="space-y-6">
                {/* 字体大小 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    字体大小: {preferences.fontSize}px
                  </label>
                  <input
                    type="range"
                    min="14"
                    max="28"
                    value={preferences.fontSize}
                    onChange={(e) => savePreferences({ fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>14px</span>
                    <span>28px</span>
                  </div>
                </div>

                {/* 行高 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    行高: {preferences.lineHeight}
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="2.5"
                    step="0.1"
                    value={preferences.lineHeight}
                    onChange={(e) => savePreferences({ lineHeight: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1.2</span>
                    <span>2.5</span>
                  </div>
                </div>

                {/* 字体族 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    字体族
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {FONT_FAMILIES.map((font) => (
                      <button
                        key={font.value}
                        onClick={() => savePreferences({ fontFamily: font.value })}
                        className={`p-3 text-sm rounded-lg border transition-colors ${
                          preferences.fontFamily === font.value
                            ? 'bg-blue-100 dark:bg-blue-900 border-blue-500 text-blue-700 dark:text-blue-300'
                            : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        {font.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 显示设置 */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <Palette className="w-5 h-5 mr-2" />
                显示设置
              </h3>
              
              <div className="space-y-6">
                {/* 主题配色 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    主题配色
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BACKGROUND_THEMES.map((theme, index) => (
                      <button
                        key={index}
                        onClick={() => savePreferences({ 
                          backgroundColor: theme.bg, 
                          textColor: theme.text 
                        })}
                        className={`relative p-3 rounded-lg border-2 transition-all ${
                          preferences.backgroundColor === theme.bg
                            ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                        style={{ backgroundColor: theme.bg, color: theme.text }}
                      >
                        <div className="text-xs font-medium">{theme.name}</div>
                        <div className="text-xs opacity-75 mt-1">示例文字</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 内容宽度 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    内容宽度
                  </label>
                  <select
                    value={preferences.maxWidth}
                    onChange={(e) => savePreferences({ maxWidth: e.target.value })}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="3xl">窄屏 (768px)</option>
                    <option value="4xl">标准 (896px)</option>
                    <option value="5xl">宽屏 (1024px)</option>
                    <option value="6xl">超宽 (1152px)</option>
                    <option value="full">全宽</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 阅读进度 */}
            {articleId && preferences.readingProgress[articleId] && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  阅读进度
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      当前进度: {Math.round(preferences.readingProgress[articleId])}%
                    </span>
                    <button
                      onClick={restoreReadingProgress}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      跳转到上次位置
                    </button>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${preferences.readingProgress[articleId]}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 底部 */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetToDefaults}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              恢复默认
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              完成
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}