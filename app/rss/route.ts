import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedPosts } from '@/lib/posts';

const SITE_URL = 'https://your-domain.com';
const SITE_NAME = '壹壹零壹Blog';
const SITE_DESCRIPTION = '专注于现代Web开发技术的个人博客，分享Next.js、TypeScript、React等前端技术的见解和实践经验。';

function generateRSSFeed(posts: any[]) {
  const rssItems = posts.map(post => {
    const pubDate = new Date(post.createdAt).toUTCString();
    const link = `${SITE_URL}/posts/${post.slug}`;
    
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || post.content?.substring(0, 200) + '...' || ''}]]></description>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>noreply@${SITE_URL.replace('https://', '')} (${post.author || SITE_NAME})</author>
      ${post.tags ? `<category><![CDATA[${post.tags}]]></category>` : ''}
    </item>`.trim();
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${SITE_NAME}]]></title>
    <description><![CDATA[${SITE_DESCRIPTION}]]></description>
    <link>${SITE_URL}</link>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <ttl>60</ttl>
    <atom:link href="${SITE_URL}/rss" rel="self" type="application/rss+xml"/>
    <generator>Next.js Blog RSS Generator</generator>
    <webMaster>noreply@${SITE_URL.replace('https://', '')} (${SITE_NAME})</webMaster>
    <managingEditor>noreply@${SITE_URL.replace('https://', '')} (${SITE_NAME})</managingEditor>
    <copyright>Copyright ${new Date().getFullYear()} ${SITE_NAME}</copyright>
    <category><![CDATA[技术博客]]></category>
    <category><![CDATA[Web开发]]></category>
    <category><![CDATA[编程]]></category>
    <image>
      <url>${SITE_URL}/og-image.jpg</url>
      <title><![CDATA[${SITE_NAME}]]></title>
      <link>${SITE_URL}</link>
      <description><![CDATA[${SITE_DESCRIPTION}]]></description>
      <width>144</width>
      <height>144</height>
    </image>
${rssItems}
  </channel>
</rss>`.trim();
}

export async function GET(request: NextRequest) {
  try {
    // 获取最新的文章
    const posts = await getFeaturedPosts(50); // 获取最新的50篇文章
    
    // 生成RSS feed
    const rssXml = generateRSSFeed(posts);
    
    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600', // 缓存1小时
      },
    });
  } catch (error) {
    console.error('生成RSS feed失败:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}