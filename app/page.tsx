import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import ReadingTime from "@/components/ReadingTime";

export default function Home() {
  // 这里应该是从数据库获取的真实文章数据
  const featuredPosts = [
    {
      id: "nextjs-15-complete-guide",
      title: "Next.js 15 完整指南：从入门到精通",
      excerpt: "学习如何使用最新版本的 Next.js 构建现代化 Web 应用程序及其新功能。",
      date: "2024-09-05",
      tags: ["Next.js", "React", "Web 开发"],
      content: "Next.js 15 是一个强大的 React 框架，提供了服务器端渲染、静态站点生成、API 路由等功能。它还优化了图像和字体加载，提升了应用性能。这个完整指南将带你从入门到精通，掌握 Next.js 的所有核心概念和高级特性。"
    },
    {
      id: "typescript-advanced-patterns",
      title: "TypeScript 高级模式与最佳实践",
      excerpt: "编写更好、更可维护代码的 TypeScript 模式和实践。",
      date: "2024-09-03",
      tags: ["TypeScript", "JavaScript", "最佳实践"],
      content: "TypeScript 提供了强大的类型系统，包括条件类型、映射类型、模板字面量类型等高级特性。这些功能帮助开发者构建更类型安全的应用。我们将深入探讨高级类型技巧和实用的设计模式。"
    },
    {
      id: "tailwind-css-tips",
      title: "Tailwind CSS 实用技巧和最佳实践",
      excerpt: "提高开发效率和代码质量的 Tailwind CSS 使用技巧。",
      date: "2024-09-01",
      tags: ["Tailwind CSS", "CSS", "前端开发"],
      content: "Tailwind CSS 是一个功能优先的 CSS 框架，它允许我们快速构建现代化的用户界面。本文分享一些实用技巧，帮助你更好地使用 Tailwind CSS。"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              壹壹零壹Blog
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              探索前沿技术，分享编程心得，记录学习历程
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link 
                href="/posts" 
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                浏览文章
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                关于我
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">精选文章</h2>
          <Link href="/posts" className="text-blue-400 hover:text-blue-300 transition-colors">
            查看所有文章 →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => (
            <ArticleCard 
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              date={post.date}
              readTime="5分钟阅读"
              tags={post.tags}
            />
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">关于这个博客</h2>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg">
              这是一个专注于现代Web开发技术的个人博客。在这里，我分享关于Next.js、TypeScript、React和其他前端技术的见解和实践经验。
              无论你是初学者还是经验丰富的开发者，都能在这里找到有价值的内容。
            </p>
            <div className="mt-8 flex justify-center">
              <Link 
                href="/about" 
                className="px-6 py-3 border border-blue-500 text-blue-400 font-medium rounded-lg hover:bg-blue-500 hover:text-white transition-colors duration-200"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}