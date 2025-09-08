'use client';

import { useEffect, useRef, useMemo } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { giscusConfig } from '@/config/giscus';

interface CommentProps {
  // 允许覆盖默认配置
  repo?: string;
  repoId?: string;
  category?: string;
  categoryId?: string;
  mapping?: 'url' | 'title' | 'og:title' | 'pathname' | 'specific';
  term?: string;
  strict?: boolean;
  reactionsEnabled?: boolean;
  emitMetadata?: boolean;
  inputPosition?: 'top' | 'bottom';
  theme?: 'light' | 'dark' | 'dark_dimmed' | 'transparent_dark' | 'preferred_color_scheme';
  lang?: string;
  loading?: 'lazy' | 'eager';
}

export default function Comment(config: CommentProps = {}) {
  const commentRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const finalConfig = useMemo(() => ({ ...giscusConfig, ...config }), [config]);

  useEffect(() => {
    const loadGiscus = () => {
      const script = document.createElement('script');
      script.src = 'https://giscus.app/client.js';
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      // 设置 Giscus 配置
      script.setAttribute('data-repo', finalConfig.repo!);
      script.setAttribute('data-repo-id', finalConfig.repoId!);
      script.setAttribute('data-category', finalConfig.category!);
      script.setAttribute('data-category-id', finalConfig.categoryId!);
      script.setAttribute('data-mapping', finalConfig.mapping!);
      script.setAttribute('data-strict', finalConfig.strict!.toString());
      script.setAttribute('data-reactions-enabled', finalConfig.reactionsEnabled!.toString());
      script.setAttribute('data-emit-metadata', finalConfig.emitMetadata!.toString());
      script.setAttribute('data-input-position', finalConfig.inputPosition!);
      script.setAttribute('data-theme', finalConfig.theme!);
      script.setAttribute('data-lang', finalConfig.lang!);
      script.setAttribute('data-loading', finalConfig.loading!);
      
      // 设置页面标识
      const term = finalConfig.term || pathname;
      script.setAttribute('data-term', term);
      
      if (commentRef.current) {
        commentRef.current.innerHTML = ''; // 清空现有内容
        commentRef.current.appendChild(script);
      }
    };

    // 检查是否需要重新加载评论
    if (commentRef.current && commentRef.current.children.length === 0) {
      loadGiscus();
    }

    // 监听主题变化
    const handleThemeChange = () => {
      const giscusFrame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
      if (giscusFrame) {
        giscusFrame.contentWindow?.postMessage(
          {
            giscus: {
              setConfig: {
                theme: finalConfig.theme,
              },
            },
          },
          'https://giscus.app'
        );
      }
    };

    // 监听系统主题变化
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', handleThemeChange);

    return () => {
      darkModeMediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [pathname, searchParams, finalConfig]);

  // 处理路由变化时重新加载评论
  useEffect(() => {
    const giscusFrame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame');
    if (giscusFrame) {
      const term = finalConfig.term || pathname;
      giscusFrame.contentWindow?.postMessage(
        {
          giscus: {
            setConfig: {
              term: term,
            },
          },
        },
        'https://giscus.app'
      );
    }
  }, [pathname, finalConfig.term]);

  return (
    <div className="comment-container">
      <div ref={commentRef} className="giscus" />
      
      {/* 配置说明 */}
      {(giscusConfig.repo === 'your-username/your-repo' || process.env.NODE_ENV === 'development') && (
        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <p className="text-yellow-400 text-sm">
            <strong>配置提示：</strong> Giscus 需要配置才能正常工作。
          </p>
          <ul className="text-yellow-300 text-xs mt-2 space-y-1">
            <li>• 请编辑 <code className="bg-yellow-500/20 px-1 rounded">config/giscus.ts</code> 文件中的配置</li>
            <li>• 在 GitHub 仓库设置中启用 Discussions 功能</li>
            <li>• 访问{' '}
              <a 
                href="https://giscus.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline"
              >
                giscus.app
              </a>{' '}
              获取配置参数
            </li>
            <li>• 安装 Giscus GitHub 应用到你的仓库</li>
          </ul>
        </div>
      )}
    </div>
  );
}