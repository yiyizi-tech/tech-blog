import Head from 'next/head';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  tags?: string[];
}

export default function SEOHead({
  title = '壹壹零壹Blog - 探索前沿技术，分享编程心得',
  description = '专注于现代Web开发技术的个人博客，分享Next.js、TypeScript、React等前端技术的见解和实践经验。',
  keywords = ['博客', 'Web开发', 'Next.js', 'TypeScript', 'React', '前端技术', '编程'],
  image = '/og-image.jpg',
  url = 'https://your-domain.com',
  type = 'website',
  author = '壹壹零壹Blog',
  publishedDate,
  modifiedDate,
  tags = []
}: SEOHeadProps) {
  const siteTitle = '壹壹零壹Blog';
  const fullTitle = title.includes(siteTitle) ? title : `${title} | ${siteTitle}`;
  const fullUrl = url.startsWith('http') ? url : `https://your-domain.com${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `https://your-domain.com${image}`;

  // 生成结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'Article' : 'WebSite',
    ...(type === 'website' ? {
      name: siteTitle,
      description,
      url: fullUrl,
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: {
        '@type': 'Organization',
        name: siteTitle,
        logo: {
          '@type': 'ImageObject',
          url: `https://your-domain.com/logo.png`
        }
      }
    } : {
      headline: title,
      description,
      image: fullImageUrl,
      author: {
        '@type': 'Person',
        name: author
      },
      publisher: {
        '@type': 'Organization',
        name: siteTitle,
        logo: {
          '@type': 'ImageObject',
          url: `https://your-domain.com/logo.png`
        }
      },
      datePublished: publishedDate,
      dateModified: modifiedDate || publishedDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl
      },
      ...(tags.length > 0 && {
        keywords: tags.join(', ')
      })
    })
  };

  return (
    <Head>
      {/* 基础Meta标签 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:locale" content="zh_CN" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@your_twitter" />
      <meta name="twitter:creator" content="@your_twitter" />

      {/* 文章特定的Meta标签 */}
      {type === 'article' && publishedDate && (
        <>
          <meta property="article:published_time" content={publishedDate} />
          {modifiedDate && (
            <meta property="article:modified_time" content={modifiedDate} />
          )}
          <meta property="article:author" content={author} />
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* 网站图标 */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />

      {/* RSS订阅 */}
      <link rel="alternate" type="application/rss+xml" title={`${siteTitle} RSS Feed`} href="/rss.xml" />

      {/* 预加载关键资源 */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Head>
  );
}