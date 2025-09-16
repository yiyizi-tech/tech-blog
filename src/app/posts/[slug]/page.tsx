import { notFound } from 'next/navigation';
import Link from 'next/link';
import Comment from '@/components/Comment';
import ArticleContent from '@/components/ArticleContent';
import TableOfContents from '@/components/TableOfContents';

// 模拟文章数据 - 在实际项目中这里会从数据库或文件系统获取
const articles = {
  'nextjs-15-complete-guide': {
    id: 'nextjs-15-complete-guide',
    title: 'Next.js 15 完整指南：从入门到精通',
    date: '2024-09-05',
    readTime: '15 分钟阅读',
    author: 'Xu Liang',
    content: `
# Next.js 15 完整指南：从入门到精通

Next.js 15 带来了许多革命性的特性，让我们一起深入探索这个强大的 React 框架。

## 什么是 Next.js？

Next.js 是一个基于 React 的生产级框架，提供了：

- **服务器端渲染 (SSR)**：提升 SEO 和首屏加载速度
- **静态站点生成 (SSG)**：构建超快速的静态网站
- **API 路由**：构建完整的全栈应用
- **图像优化**：自动优化图片加载
- **字体优化**：自动优化字体加载

## App Router 的优势

Next.js 13 引入的 App Router 彻底改变了我们构建 Next.js 应用的方式：

### 1. 服务器组件默认启用

\`\`\`tsx
// app/page.tsx
export default function Home() {
  // 这是一个服务器组件
  return <h1>Hello World</h1>
}
\`\`\`

### 2. 简化的数据获取

\`\`\`tsx
async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function Page() {
  const data = await getData()
  return <main>{/* 使用数据 */}</main>
}
\`\`\`

### 3. 嵌套路由和布局

\`\`\`tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <nav>{/* 导航栏 */}</nav>
        {children}
      </body>
    </html>
  )
}
\`\`\`

## 性能优化策略

### 1. 使用 React.memo 和 useMemo

\`\`\`tsx
import { memo, useMemo } from 'react'

const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      computed: item.value * 2
    }))
  }, [data])

  return (
    <div>
      {processedData.map(item => (
        <div key={item.id}>{item.computed}</div>
      ))}
    </div>
  )
})
\`\`\`

### 2. 图像优化

\`\`\`tsx
import Image from 'next/image'

function Article({ article }) {
  return (
    <Image
      src={article.coverImage}
      alt={article.title}
      width={800}
      height={400}
      priority
    />
  )
}
\`\`\`

### 3. 代码分割

\`\`\`tsx
// 使用动态导入
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // 可选：禁用 SSR
})
\`\`\`

## 部署最佳实践

### Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 配置环境变量
3. 自动部署

### Docker 部署

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## 总结

Next.js 15 是一个强大的框架，通过合理使用其特性，我们可以构建出高性能、现代化的 Web 应用。记住要：

- 善用服务器组件减少客户端 JavaScript
- 优化图像和字体加载
- 实施有效的缓存策略
- 监控应用性能

继续探索，你会发现更多强大的功能！
    `,
    tags: ['Next.js', 'React', 'Web 开发', '性能优化']
  },
  'typescript-advanced-patterns': {
    id: 'typescript-advanced-patterns',
    title: 'TypeScript 高级模式与最佳实践',
    date: '2024-09-03',
    readTime: '20 分钟阅读',
    author: 'Xu Liang',
    content: `
# TypeScript 高级模式与最佳实践

TypeScript 不仅仅是给 JavaScript 加上类型，它提供了一整套强大的类型系统工具。

## 高级类型技巧

### 1. 条件类型

\`\`\`typescript
type ExtractString<T> = T extends string ? T : never;

type Result = ExtractString<string | number>; // string
\`\`\`

### 2. 映射类型

\`\`\`typescript
type Optional<T> = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type OptionalUser = Optional<User>;
// 等价于 { name?: string; age?: number; }
\`\`\`

### 3. 模板字面量类型

\`\`\`typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = \`\${EmailLocaleIDs | FooterLocaleIDs}_id\`;
// "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
\`\`\`

## 实用设计模式

### 1. 工厂模式

\`\`\`typescript
interface Product {
  operation(): string;
}

class ConcreteProduct1 implements Product {
  operation(): string {
    return '{Result of ConcreteProduct1}';
  }
}

class ConcreteProduct2 implements Product {
  operation(): string {
    return '{Result of ConcreteProduct2}';
  }
}

abstract class Creator {
  public abstract factoryMethod(): Product;

  public someOperation(): string {
    const product = this.factoryMethod();
    return \`Creator: The same creator's code has just worked with \${product.operation()}\`;
  }
}

class ConcreteCreator1 extends Creator {
  public factoryMethod(): Product {
    return new ConcreteProduct1();
  }
}
\`\`\`

### 2. 观察者模式

\`\`\`typescript
interface Observer {
  update(subject: Subject): void;
}

interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}

class ConcreteSubject implements Subject {
  private state: number = 0;
  private observers: Observer[] = [];

  public attach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      this.observers.push(observer);
    }
  }

  public detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this);
    }
  }

  public someBusinessLogic(): void {
    this.state = Math.floor(Math.random() * (10 + 1));
    console.log("Subject: My state has just changed to: " + this.state);
    this.notify();
  }
}
\`\`\`

## 性能优化技巧

### 1. 类型守卫

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // 这里 TypeScript 知道 value 是 string 类型
    console.log(value.toUpperCase());
  }
}
\`\`\`

### 2. 索引签名

\`\`\`typescript
interface StringMap {
  [key: string]: string;
}

const map: StringMap = {
  name: 'John',
  age: '30', // 注意：这里 age 也必须是 string
};
\`\`\`

## 总结

TypeScript 的高级特性让我们能够：

- 构建更类型安全的应用
- 提供更好的开发体验
- 减少运行时错误
- 提高代码可维护性

继续深入学习 TypeScript，你会发现更多强大的功能！
    `,
    tags: ['TypeScript', 'JavaScript', '类型系统', '最佳实践']
  }
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles[slug as keyof typeof articles];

  if (!article) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-black text-white">
      {/* 文章头部 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-4xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="mb-6">
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回首页
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {article.author}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(article.date).toLocaleDateString('zh-CN')}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {article.readTime}
              </div>
            </div>

            {/* 标签 */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {article.tags.map((tag) => (
                <span 
                  key={tag}
                  className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 文章内容 */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* 主要内容 */}
          <div className="lg:col-span-3">
            <div className="prose prose-lg prose-invert max-w-none">
              <ArticleContent content={article.content} />
            </div>
            
            {/* 文章底部信息 */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-sm mb-2">
                    喜欢这篇文章吗？分享给朋友吧！
                  </p>
                  <div className="flex items-center gap-4">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://your-domain.com/posts/${article.id}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a
                      href={`https://github.com/your-username/your-repo`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 22.792 24 18.297 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
                
                <div className="text-center sm:text-right">
                  <Link 
                    href="/" 
                    className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    返回首页
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* 侧边栏 - 目录 */}
          <div className="lg:col-span-1 hidden lg:block">
            <TableOfContents content={article.content} />
          </div>
        </div>
      </main>

      {/* 评论区域 */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="lg:col-span-3">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-8">
              评论
            </h2>
            <Comment />
          </div>
        </div>
      </section>
    </article>
  );
}

// 生成静态参数
export async function generateStaticParams() {
  const posts = Object.keys(articles);
  return posts.map((slug) => ({ slug }));
}