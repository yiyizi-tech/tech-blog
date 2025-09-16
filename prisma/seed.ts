import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('开始创建种子数据...');

  const hashedPassword = await bcrypt.hash('abcdefg123', 10)
  
  // 创建管理员用户
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  console.log('Admin user created:', admin)

  // 创建示例文章
  const posts = [
    {
      slug: 'getting-started-with-nextjs-15',
      title: 'Next.js 15 入门指南',
      content: `<h1>Next.js 15 入门指南</h1>
<img src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop" alt="Next.js 15 框架" />
<p>Next.js 15 是 React 框架的最新版本，带来了许多令人兴奋的新特性和改进。</p>
<h2>主要特性</h2>
<h3>1. Turbopack</h3>
<p>Next.js 15 引入了 Turbopack，这是一个基于 Rust 的打包工具，能够显著提高开发服务器的启动速度和热更新性能。</p>
<h3>2. App Router</h3>
<p>App Router 提供了更灵活的路由系统，支持嵌套路由、布局和模板。</p>
<h3>3. Server Components</h3>
<p>默认使用 Server Components，提供更好的性能和 SEO。</p>
<h2>快速开始</h2>
<pre><code class="language-bash">npx create-next-app@latest my-app
cd my-app
npm run dev</code></pre>
<h2>总结</h2>
<p>Next.js 15 是一个强大的框架，为现代 Web 应用开发提供了完整的解决方案。</p>`,
      excerpt: 'Next.js 15 是 React 框架的最新版本，带来了许多令人兴奋的新特性和改进。',
      tags: JSON.stringify(['Next.js', 'React', 'Web开发']),
      featured: true,
      published: true,
      author: '管理员',
      views: 150,
      readingTime: 5,
    },
    {
      slug: 'understanding-react-server-components',
      title: '深入理解 React Server Components',
      content: `<h1>深入理解 React Server Components</h1>
<img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop" alt="React Server Components" />
<p>React Server Components (RSC) 是 React 18 引入的一个重要概念，它允许组件在服务器上渲染。</p>
<h2>什么是 Server Components</h2>
<p>Server Components 是一种特殊的 React 组件，它们在服务器上渲染，只将 HTML 发送到客户端。</p>
<h2>优势</h2>
<h3>1. 减少客户端包大小</h3>
<p>Server Components 不需要发送到客户端，减少了 JavaScript 包的大小。</p>
<h3>2. 直接访问服务器资源</h3>
<p>可以直接访问数据库、文件系统等服务器资源。</p>
<h3>3. 改善 SEO</h3>
<p>由于在服务器上渲染，搜索引擎可以更好地索引内容。</p>
<h2>使用示例</h2>
<pre><code class="language-tsx">// Server Component
async function PostList() {
  const posts = await db.posts.findMany();
  return (
    &lt;div&gt;
      {posts.map(post =&gt; (
        &lt;PostCard key={post.id} post={post} /&gt;
      ))}
    &lt;/div&gt;
  );
}</code></pre>
<h2>总结</h2>
<p>Server Components 是 React 生态系统的重大进步，为现代 Web 应用提供了更好的性能和用户体验。</p>`,
      excerpt: 'React Server Components (RSC) 是 React 18 引入的一个重要概念，它允许组件在服务器上渲染。',
      tags: JSON.stringify(['React', 'Server Components', '性能优化']),
      featured: true,
      published: true,
      author: '管理员',
      views: 89,
      readingTime: 4,
    },
    {
      slug: 'building-scalable-api-with-prisma',
      title: '使用 Prisma 构建可扩展的 API',
      content: `<h1>使用 Prisma 构建可扩展的 API</h1>
<img src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop" alt="Prisma 数据库" />
<p>Prisma 是一个现代的数据库工具包，它提供了类型安全的数据库访问。</p>
<h2>什么是 Prisma</h2>
<p>Prisma 是一个 ORM（对象关系映射）工具，它允许开发者使用 TypeScript 来定义数据库模式。</p>
<h2>主要特性</h2>
<h3>1. 类型安全</h3>
<p>Prisma 自动生成 TypeScript 类型，确保编译时的类型安全。</p>
<h3>2. 数据库迁移</h3>
<p>内置的迁移系统使得数据库架构的变更变得简单。</p>
<h3>3. 查询构建器</h3>
<p>提供直观的 API 来构建复杂的数据库查询。</p>
<h2>示例代码</h2>
<pre><code class="language-typescript">import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 创建用户
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// 查询用户及其帖子
const usersWithPosts = await prisma.user.findMany({
  include: {
    posts: true,
  },
});</code></pre>
<h2>总结</h2>
<p>Prisma 极大地简化了数据库操作，为现代 Web 应用提供了强大的数据访问层。</p>`,
      excerpt: 'Prisma 是一个现代的数据库工具包，它提供了类型安全的数据库访问。',
      tags: JSON.stringify(['Prisma', '数据库', 'API', 'TypeScript']),
      featured: false,
      published: true,
      author: '管理员',
      views: 67,
      readingTime: 3,
    },
    {
      slug: 'mastering-tailwind-css',
      title: '精通 Tailwind CSS',
      content: `<h1>精通 Tailwind CSS</h1>
<p>Tailwind CSS 是一个实用程序优先的 CSS 框架，它提供了低级别的实用程序类来构建定制设计。</p>
<h2>为什么选择 Tailwind CSS</h2>
<h3>1. 快速开发</h3>
<p>无需编写自定义 CSS，直接使用预定义的类名。</p>
<h3>2. 一致性设计</h3>
<p>通过约束设计系统，确保整个应用的一致性。</p>
<h3>3. 响应式设计</h3>
<p>内置响应式修饰符，轻松创建移动优先的设计。</p>
<h2>核心概念</h2>
<h3>1. 实用程序类</h3>
<pre><code class="language-html">&lt;div class="bg-blue-500 text-white p-4 rounded-lg"&gt;
  这是一个蓝色背景的卡片
&lt;/div&gt;</code></pre>
<h3>2. 响应式设计</h3>
<pre><code class="language-html">&lt;div class="w-full md:w-1/2 lg:w-1/3"&gt;
  响应式宽度
&lt;/div&gt;</code></pre>
<h3>3. 状态修饰符</h3>
<pre><code class="language-html">&lt;button class="bg-blue-500 hover:bg-blue-700 active:bg-blue-900"&gt;
  点击我
&lt;/button&gt;</code></pre>
<h2>最佳实践</h2>
<ol>
<li><strong>使用配置文件</strong>：通过 tailwind.config.js 自定义设计系统</li>
<li><strong>组织类名</strong>：使用一致的类名排序</li>
<li><strong>避免过度使用</strong>：对于复杂组件，考虑使用 @apply</li>
</ol>
<h2>总结</h2>
<p>Tailwind CSS 提供了一种现代化的 CSS 开发方式，通过实用程序类快速构建美观的用户界面。</p>`,
      excerpt: 'Tailwind CSS 是一个实用程序优先的 CSS 框架，它提供了低级别的实用程序类来构建定制设计。',
      tags: JSON.stringify(['Tailwind CSS', 'CSS', '前端开发', '设计']),
      featured: false,
      published: true,
      author: '管理员',
      views: 45,
      readingTime: 4,
    },
    {
      slug: 'advanced-typescript-patterns',
      title: '高级 TypeScript 模式',
      content: `<h1>高级 TypeScript 模式</h1>
<p>TypeScript 提供了强大的类型系统，掌握高级模式可以显著提高代码质量。</p>
<h2>1. 泛型模式</h2>
<h3>工具函数</h3>
<pre><code class="language-typescript">function identity&lt;T&gt;(arg: T): T {
  return arg;
}

// 使用示例
const output = identity&lt;string&gt;('hello');</code></pre>
<h3>泛型约束</h3>
<pre><code class="language-typescript">interface Lengthwise {
  length: number;
}

function loggingIdentity&lt;T extends Lengthwise&gt;(arg: T): T {
  console.log(arg.length);
  return arg;
}</code></pre>
<h2>2. 条件类型</h2>
<pre><code class="language-typescript">type ExtractType&lt;T&gt; = T extends string ? 'string' : 
  T extends number ? 'number' : 
  T extends boolean ? 'boolean' : 'unknown';

type Test = ExtractType&lt;string&gt;; // 'string'</code></pre>
<h2>3. 映射类型</h2>
<pre><code class="language-typescript">type Optional&lt;T&gt; = {
  [P in keyof T]?: T[P];
};

interface User {
  name: string;
  age: number;
}

type OptionalUser = Optional&lt;User&gt;;
// 等同于 { name?: string; age?: number; }</code></pre>
<h2>4. 实用工具类型</h2>
<pre><code class="language-typescript">// Partial - 使所有属性可选
type PartialUser = Partial&lt;User&gt;;

// Pick - 选择特定属性
type UserPreview = Pick&lt;User, 'name'&gt;;

// Omit - 排除特定属性
type UserWithoutAge = Omit&lt;User, 'age'&gt;;

// Record - 创建对象类型
type UserRoles = Record&lt;string, 'admin' | 'user'&gt;;</code></pre>
<h2>5. 装饰器</h2>
<pre><code class="language-typescript">function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);
  
  function replacementMethod(this: any, ...args: any[]) {
    console.log(\`LOG: Entering method \${methodName}.\`);
    const result = originalMethod.call(this, ...args);
    console.log(\`LOG: Exiting method \${methodName}.\`);
    return result;
  }
  
  return replacementMethod;
}

class Calculator {
  @logged
  add(a: number, b: number) {
    return a + b;
  }
}</code></pre>
<h2>总结</h2>
<p>掌握这些高级 TypeScript 模式可以帮助你编写更类型安全、更可维护的代码。</p>`,
      excerpt: 'TypeScript 提供了强大的类型系统，掌握高级模式可以显著提高代码质量。',
      tags: JSON.stringify(['TypeScript', '类型系统', '编程模式', '高级技巧']),
      featured: false,
      published: true,
      author: '管理员',
      views: 78,
      readingTime: 6,
    },
    {
      slug: 'draft-post-not-published',
      title: '草稿文章 - 未发布',
      content: `<h1>这是一篇草稿文章</h1>
<p>这篇文章还没有发布，只有在管理后台才能看到。</p>
<h2>草稿内容</h2>
<p>这里可以写一些还没有完成的内容，或者需要进一步编辑的文章。</p>
<h2>待办事项</h2>
<ul>
<li>完成内容编写</li>
<li>添加图片</li>
<li>校对文字</li>
<li>设置标签和分类</li>
</ul>`,
      excerpt: '这是一篇草稿文章，还没有发布。',
      tags: JSON.stringify(['草稿', '待完成']),
      featured: false,
      published: false,
      author: '管理员',
      views: 0,
      readingTime: 2,
    }
  ];

  // 清空现有文章数据
  console.log('清空现有文章数据...');
  await prisma.post.deleteMany();

  // 创建新文章数据
  console.log('创建新文章数据...');
  for (const postData of posts) {
    await prisma.post.create({
      data: postData,
    });
  }

  console.log('种子数据创建完成！');
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })