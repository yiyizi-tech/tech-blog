import { NextResponse } from 'next/server';

export async function GET() {
  const articles = [
    {
      id: 'nextjs-15-complete-guide',
      title: 'Next.js 15 完整指南：从入门到精通',
      excerpt: '深入探索 Next.js 15 的革命性特性，包括 App Router、Server Components、以及全新的性能优化方案。本文将通过实际项目案例，带你掌握现代 Web 开发的最佳实践。',
      date: '2024-09-05',
      content: 'Next.js 15 带来了许多革命性的特性，让我们一起深入探索这个强大的 React 框架。...'
    },
    {
      id: 'typescript-advanced-patterns',
      title: 'TypeScript 高级模式与最佳实践',
      excerpt: '从基础类型到高级泛型，从装饰器到条件类型，全面掌握 TypeScript 的强大功能。本文包含大量实际项目中的代码示例和常见陷阱解决方案。',
      date: '2024-09-03',
      content: 'TypeScript 提供了强大的类型系统，让 JavaScript 开发更加安全和高效。...'
    },
    {
      id: 'tailwind-css-tips',
      title: 'Tailwind CSS 技巧',
      excerpt: '学习如何使用 Tailwind CSS 构建可维护、可扩展的设计系统。涵盖自定义配置、插件开发、以及与主流设计工具的无缝集成。',
      date: '2024-09-01',
      content: 'Tailwind CSS 是一个实用优先的 CSS 框架，提供了丰富的工具类来快速构建现代化的用户界面。...'
    }
  ];

  const siteUrl = 'https://your-domain.com';
  const rssItems = articles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.excerpt}]]></description>
      <link>${siteUrl}/posts/${article.id}</link>
      <guid>${siteUrl}/posts/${article.id}</guid>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
    </item>
  `).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>壹壹零壹Blog</title>
    <description>徐梁的个人技术博客，分享最新的技术洞察和实用教程</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${rssItems}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}