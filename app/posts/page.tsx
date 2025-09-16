'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import ReadingTime from "../../components/ReadingTime";
import { parseTags } from "@/lib/tags";
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Head from 'next/head';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  tags: string | null;
  date: string;
  views: number;
  author: string | null;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6; // 每页显示6篇文章

  // 从URL获取搜索参数
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, []);

  // 获取文章数据
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts?status=published&limit=100');
        if (response.ok) {
          const data = await response.json();
          const formattedPosts = data.posts.map((post: any) => ({
            ...post,
            date: new Date(post.createdAt).toISOString().split('T')[0]
          }));
          setPosts(formattedPosts);
          setFilteredPosts(formattedPosts);
        }
      } catch (error) {
        console.error('获取文章失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 搜索功能
  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(searchTerm.toLowerCase());
        const tagsMatch = post.tags && parseTags(post.tags).some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return titleMatch || tagsMatch;
      });
      setFilteredPosts(filtered);
    }
    setCurrentPage(1); // 搜索时重置到第一页
  }, [searchTerm, posts]);

  // 计算分页
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          <span className="ml-2 text-white">加载中...</span>
        </div>
      </main>
    );
  }

  return (
    <>
      <Head>
        <title>文章列表 | 壹壹零壹Blog</title>
        <meta name="description" content="浏览所有技术文章，包含Next.js、TypeScript、React等现代Web开发技术的深度教程和实践经验分享。" />
        <meta name="keywords" content="技术文章, Web开发, Next.js, TypeScript, React, 前端技术, 编程教程" />
        <meta property="og:title" content="文章列表 | 壹壹零壹Blog" />
        <meta property="og:description" content="浏览所有技术文章，包含Next.js、TypeScript、React等现代Web开发技术的深度教程和实践经验分享。" />
        <meta property="og:url" content="https://your-domain.com/posts" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://your-domain.com/posts" />
      </Head>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            所有文章
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            浏览我的最新文章和教程
          </p>
          
          {/* 搜索框 */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="搜索文章标题或标签..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* 搜索结果统计 */}
          <div className="mt-4 text-sm text-gray-400">
            {searchTerm && (
              <p>搜索"{searchTerm}"找到 {filteredPosts.length} 篇文章</p>
            )}
            {!searchTerm && (
              <p>共 {posts.length} 篇文章</p>
            )}
          </div>
        </div>

        {/* Posts Grid - 2列布局，更紧凑的卡片 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentPosts.map((post) => (
            <article key={post.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02] group">
              <div className="flex items-center justify-between mb-4 text-xs text-gray-400">
                <time>
                  {new Date(post.date).toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </time>
                <div className="flex items-center gap-3">
                  <ReadingTime content={post.content || ''} />
                  <span>{post.views} 阅读</span>
                </div>
              </div>
              
              <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
                <Link 
                  href={`/posts/${post.slug}`} 
                  className="hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-300 mb-4 text-sm leading-relaxed line-clamp-3">
                {post.excerpt || (post.content ? post.content.substring(0, 120) + '...' : '')}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {post.tags && parseTags(post.tags).slice(0, 3).map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded-md border border-blue-600/30"
                    >
                      {tag}
                    </span>
                  ))}
                  {post.tags && parseTags(post.tags).length > 3 && (
                    <span className="text-xs text-gray-400">+{parseTags(post.tags).length - 3}</span>
                  )}
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

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm text-gray-300 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              上一页
            </button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'text-gray-300 bg-white/10 border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center px-3 py-2 text-sm text-gray-300 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPosts.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? '没有找到相关文章' : '暂无文章'}
            </h3>
            <p className="text-gray-300">
              {searchTerm ? '试试其他关键词或浏览所有文章' : '请稍后再来查看新内容！'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                查看所有文章
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}