import Link from "next/link";
import ReadingTime from "../../components/ReadingTime";

export default function PostsPage() {
  const posts = [
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
      title: "Tailwind CSS 技巧",
      excerpt: "在项目中有效使用 Tailwind CSS 的高级技术和技巧。",
      date: "2024-09-01",
      tags: ["Tailwind CSS", "CSS", "前端"],
      content: "Tailwind CSS 是一个实用优先的 CSS 框架，它提供了丰富的工具类来快速构建现代化的用户界面。学习如何高效使用 Tailwind CSS 来提升开发效率和代码质量。"
    }
  ];

  return (
    <>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            所有文章
          </h1>
          <p className="text-xl text-gray-300">
            浏览我的最新文章和教程
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105">
              <div className="flex items-center justify-between mb-6">
                <time className="text-sm text-gray-400">
                  {new Date(post.date).toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </time>
                <ReadingTime content={post.content} className="text-sm text-gray-400" />
              </div>
              
              <h2 className="text-3xl font-semibold text-white mb-4">
                <Link 
                  href={`/posts/${post.id}`} 
                  className="hover:text-blue-400 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link 
                  href={`/posts/${post.id}`} 
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  阅读更多 →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">
              暂无文章
            </h3>
            <p className="text-gray-300">
              请稍后再来查看新内容！
            </p>
          </div>
        )}
      </main>
    </>
  );
}