import { notFound } from 'next/navigation';
import Link from 'next/link';
import EnhancedReadingProgress from '../../../components/EnhancedReadingProgress';
import ReadingTime from '../../../components/ReadingTime';
import { processMarkdownContent } from '../../../utils/markdown';
import TableOfContents from '../../../components/TableOfContents';
import EnhancedComments from '../../../components/EnhancedComments';
import RelatedPosts from '../../../components/RelatedPosts';
import ScrollToTop from '../../../components/ScrollToTop';
import { getPostBySlug } from '@/lib/posts';
import { parseTags } from '@/lib/tags';
import { Metadata } from 'next';

// 生成动态元数据
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPostBySlug(slug, false);

  if (!article) {
    return {
      title: '文章未找到 | 壹壹零壹Blog',
    };
  }

  const tags = parseTags(article.tags || '');
  const description = article.excerpt || 
    (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : '');

  return {
    title: `${article.title} | 壹壹零壹Blog`,
    description,
    keywords: [...tags, '博客', 'Web开发', '技术分享'],
    authors: [{ name: article.author || '壹壹零壹Blog' }],
    creator: article.author || '壹壹零壹Blog',
    publisher: '壹壹零壹Blog',
    openGraph: {
      title: article.title,
      description,
      url: `https://your-domain.com/posts/${article.slug}`,
      siteName: '壹壹零壹Blog',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'zh_CN',
      type: 'article',
      publishedTime: new Date(article.createdAt).toISOString(),
      modifiedTime: new Date(article.updatedAt).toISOString(),
      authors: [article.author || '壹壹零壹Blog'],
      tags: tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description,
      images: ['/og-image.jpg'],
      creator: '@your_twitter',
    },
    alternates: {
      canonical: `https://your-domain.com/posts/${article.slug}`,
    },
    other: {
      'article:published_time': new Date(article.createdAt).toISOString(),
      'article:modified_time': new Date(article.updatedAt).toISOString(),
      'article:author': article.author || '壹壹零壹Blog',
      'article:section': 'Technology',
      ...tags.reduce((acc, tag, index) => {
        acc[`article:tag:${index}`] = tag;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  const article = await getPostBySlug(slug, isPreview);

  if (!article) {
    notFound();
  }

  // 结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || (article.content ? article.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : ''),
    image: '/og-image.jpg',
    author: {
      '@type': 'Person',
      name: article.author || '壹壹零壹Blog'
    },
    publisher: {
      '@type': 'Organization',
      name: '壹壹零壹Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://your-domain.com/logo.png'
      }
    },
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://your-domain.com/posts/${article.slug}`
    },
    keywords: parseTags(article.tags || '').join(', '),
    wordCount: article.content ? article.content.replace(/<[^>]*>/g, '').length : 0,
    interactionStatistic: {
      '@type': 'InteractionCounter',
      interactionType: 'https://schema.org/ReadAction',
      userInteractionCount: article.views
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="min-h-screen bg-black text-white">
        {/* 增强阅读进度条 */}
        <EnhancedReadingProgress 
          targetId="article-content" 
          showPercentage={true}
          showTimeEstimate={true}
          averageReadingSpeed={200}
        />
        
        {/* 文章头部 */}
        <header className="relative overflow-hidden bg-gray-900">
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
              
              {/* 阅读时间估算 */}
              <div className="mb-4">
                <ReadingTime content={article.content || ''} />
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {article.author || '管理员'}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(article.date).toLocaleDateString('zh-CN')}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {article.views} 次阅读
                </div>
              </div>

              {/* 标签 */}
              {article.tags && parseTags(article.tags).length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {parseTags(article.tags).map((tag: string) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-600/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 文章内容 */}
        <main className="max-w-7xl mx-auto px-6 py-16 bg-black">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* 主要内容 */}
            <div className="lg:col-span-3">
              <div 
                id="article-content"
                className="prose prose-lg prose-gray prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: processMarkdownContent(article.content || '') }}
              />
              
              {/* 文章底部信息 */}
              <div className="mt-16 pt-8 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-gray-400 text-sm mb-2">
                      喜欢这篇文章吗？分享给朋友吧！
                    </p>
                    <div className="flex items-center gap-4">
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://your-domain.com/posts/${article.slug}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
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

              {/* 相关文章推荐 */}
              <RelatedPosts 
                currentPostId={article.id} 
                currentPostTags={article.tags || ''} 
                limit={3} 
              />

              {/* 评论区域 */}
              <EnhancedComments postId={article.id} postTitle={article.title} />
            </div>
            
            {/* 侧边栏 */}
            <div className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-8 space-y-6">
                <TableOfContents content={article.content || ''} />
                <div className="flex justify-center">
                  <ScrollToTop />
                </div>
              </div>
            </div>
          </div>
        </main>
      </article>
    </>
  );
}