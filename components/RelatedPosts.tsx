'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Eye } from 'lucide-react';
import { parseTags } from '@/lib/tags';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  tags: string | null;
  views: number;
  createdAt: string;
  author: string | null;
}

interface RelatedPostsProps {
  currentPostId: number;
  currentPostTags: string;
  limit?: number;
}

export default function RelatedPosts({ currentPostId, currentPostTags, limit = 3 }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch('/api/posts?status=published&limit=50');
        if (response.ok) {
          const data = await response.json();
          const allPosts = data.posts.filter((post: Post) => post.id !== currentPostId);
          
          // 获取当前文章的标签
          const currentTags = parseTags(currentPostTags);
          
          // 计算每篇文章的相关度分数
          const scoredPosts = allPosts.map((post: Post) => {
            let score = 0;
            const postTags = parseTags(post.tags || '');
            
            // 基于共同标签计算分数
            const commonTags = currentTags.filter(tag => postTags.includes(tag));
            score += commonTags.length * 3; // 每个共同标签得3分
            
            // 基于标题相似度的简单计算（关键词匹配）
            const currentTitle = currentPostTags.toLowerCase().split(' ');
            const postTitle = post.title.toLowerCase().split(' ');
            const titleMatches = currentTitle.filter(word => 
              word.length > 2 && postTitle.some(postWord => postWord.includes(word))
            );
            score += titleMatches.length; // 每个标题关键词匹配得1分
            
            // 基于浏览量的权重（热门文章优先推荐）
            if (post.views > 100) score += 1;
            if (post.views > 500) score += 1;
            
            return { ...post, score };
          });
          
          // 按分数排序，如果分数相同则按浏览量排序
          scoredPosts.sort((a: any, b: any) => {
            if (b.score === a.score) {
              return b.views - a.views;
            }
            return b.score - a.score;
          });
          
          // 取前limit篇文章
          setRelatedPosts(scoredPosts.slice(0, limit));
        }
      } catch (error) {
        console.error('获取相关文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedPosts();
  }, [currentPostId, currentPostTags, limit]);

  if (loading) {
    return (
      <div className="mt-16 pt-8 border-t border-white/10">
        <h3 className="text-2xl font-bold text-white mb-6">相关推荐</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-3"></div>
                <div className="h-3 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gray-700 rounded w-20"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-8 border-t border-white/10">
      <h3 className="text-2xl font-bold text-white mb-6">相关推荐</h3>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post) => (
          <article 
            key={post.id} 
            className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] group"
          >
            <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
              <time>
                {new Date(post.createdAt).toLocaleDateString('zh-CN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </time>
              <div className="flex items-center gap-2">
                <Eye className="w-3 h-3" />
                <span>{post.views}</span>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
              <Link 
                href={`/posts/${post.slug}`}
                className="hover:text-blue-400 transition-colors"
              >
                {post.title}
              </Link>
            </h4>
            
            <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
              {post.excerpt || (post.content ? post.content.substring(0, 100) + '...' : '')}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {post.tags && parseTags(post.tags).slice(0, 2).map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-md border border-blue-600/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link 
                href={`/posts/${post.slug}`}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                阅读 →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}