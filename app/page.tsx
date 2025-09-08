"use client";

import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { useEffect, useState } from "react";

export default function Home() {
  const [visibleArticles, setVisibleArticles] = useState<number[]>([]);
  
  const articles = [
    {
      id: "nextjs-15-complete-guide",
      title: "Next.js 15 完整指南：从入门到精通",
      excerpt: "深入探索 Next.js 15 的革命性特性，包括 App Router、Server Components、以及全新的性能优化方案。本文将通过实际项目案例，带你掌握现代 Web 开发的最佳实践。",
      date: "2024-09-05",
      readTime: "15 分钟阅读",
      tags: ["Next.js", "React", "Web 开发", "性能优化"],
      coverImage: "/api/placeholder/400/300"
    },
    {
      id: "typescript-advanced-patterns",
      title: "TypeScript 高级模式与最佳实践",
      excerpt: "从基础类型到高级泛型，从装饰器到条件类型，全面掌握 TypeScript 的强大功能。本文包含大量实际项目中的代码示例和常见陷阱解决方案。",
      date: "2024-09-03",
      readTime: "20 分钟阅读",
      tags: ["TypeScript", "JavaScript", "类型系统", "最佳实践"],
      coverImage: "/api/placeholder/400/300"
    },
    {
      id: "tailwind-css-masterclass",
      title: "Tailwind CSS 大师班：构建现代化设计系统",
      excerpt: "学习如何使用 Tailwind CSS 构建可维护、可扩展的设计系统。涵盖自定义配置、插件开发、以及与主流设计工具的无缝集成。",
      date: "2024-09-01",
      readTime: "18 分钟阅读",
      tags: ["Tailwind CSS", "CSS", "设计系统", "UI/UX"],
      coverImage: "/api/placeholder/400/300"
    },
    {
      id: "react-performance-optimization",
      title: "React 性能优化：从原理到实践",
      excerpt: "深入理解 React 的渲染机制，掌握 useMemo、useCallback、React.memo 等优化工具的使用场景。通过实际案例分析，解决复杂的性能瓶颈问题。",
      date: "2024-08-28",
      readTime: "25 分钟阅读",
      tags: ["React", "性能优化", "JavaScript", "前端架构"],
      coverImage: "/api/placeholder/400/300"
    },
    {
      id: "nodejs-microservices-architecture",
      title: "Node.js 微服务架构设计与实践",
      excerpt: "从单体应用到微服务架构的演进之路。涵盖服务拆分策略、API 网关设计、服务发现、负载均衡等核心技术，配合完整的代码示例。",
      date: "2024-08-25",
      readTime: "30 分钟阅读",
      tags: ["Node.js", "微服务", "架构设计", "后端开发"],
      coverImage: "/api/placeholder/400/300"
    },
    {
      id: "docker-kubernetes-production",
      title: "Docker 与 Kubernetes：生产级容器化部署",
      excerpt: "从容器化基础概念到 K8s 集群管理，完整的学习路径。包括多阶段构建、健康检查、自动扩缩容、监控告警等生产环境必备技能。",
      date: "2024-08-22",
      readTime: "35 分钟阅读",
      tags: ["Docker", "Kubernetes", "DevOps", "部署"],
      coverImage: "/api/placeholder/400/300"
    }
  ];

  // 监听滚动事件，添加动画效果
  useEffect(() => {
    const handleScroll = () => {
      const articleElements = document.querySelectorAll('[data-article-index]');
      const newVisibleArticles: number[] = [];
      
      articleElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;
        
        if (isVisible && !visibleArticles.includes(index)) {
          newVisibleArticles.push(index);
        }
      });
      
      if (newVisibleArticles.length > 0) {
        setVisibleArticles(prev => [...prev, ...newVisibleArticles]);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // 初始检查
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleArticles]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-600/30 rounded-full">
                  <span className="text-blue-400 text-sm font-medium">欢迎来到我的技术博客</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                  Hi, I&apos;m
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Xu Liang
                  </span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  一个热爱探索技术的工程师
                  <br />
                  <span className="text-gray-400 text-lg">
                    Sharing insights, tutorials, and thoughts on technology and software development
                  </span>
                </p>

                <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
                  专注于现代 Web 开发技术，分享最新的编程趋势、
                  架构设计思路和实战经验。让我们一起探索技术的无限可能。
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/posts" 
                  className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 text-center"
                >
                  浏览文章
                </Link>
                <Link 
                  href="/about" 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-black transition-all duration-200 transform hover:scale-105 text-center"
                >
                  了解更多
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">50+</div>
                  <div className="text-sm text-gray-400">技术文章</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">10K+</div>
                  <div className="text-sm text-gray-400">阅读量</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">5年</div>
                  <div className="text-sm text-gray-400">开发经验</div>
                </div>
              </div>
            </div>

            {/* Right Content - Profile Image Placeholder */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Profile Card */}
                <div className="w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-3xl border border-white/10 backdrop-blur-sm flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
                  
                  {/* Placeholder for Profile Image or 3D Icon */}
                  <div className="relative z-10 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium">个人照片</p>
                    <p className="text-gray-400 text-xs mt-1">或 3D 动态图标</p>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-500/20 rounded-full border border-blue-500/30"></div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-purple-500/20 rounded-full border border-purple-500/30"></div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-8 right-8 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-60 animate-float"></div>
                <div className="absolute -bottom-8 left-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg opacity-40 animate-float delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Articles Section */}
      <section className="py-20 relative">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-600/30 rounded-full mb-6">
              <span className="text-blue-400 text-sm font-medium">最新发布</span>
            </div>
            <h2 className="text-5xl font-bold text-white mb-4">
              最新文章
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              探索最新的技术洞察和实用教程，保持与行业发展的同步
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, index) => (
              <div
                key={article.id}
                data-article-index={index}
                className={`transition-all duration-700 ease-out ${
                  visibleArticles.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-16'
                }`}
                style={{ transitionDelay: visibleArticles.includes(index) ? `${index * 100}ms` : '0ms' }}
              >
                <ArticleCard
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  date={article.date}
                  readTime={article.readTime}
                  tags={article.tags}
                  coverImage={article.coverImage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Link 
            href="/posts" 
            className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
          >
            查看所有文章
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Add custom animations to CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .delay-1000 {
            animation-delay: 2s;
          }
          .delay-2000 {
            animation-delay: 4s;
          }
        `
      }} />
    </>
  );
}
