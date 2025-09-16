import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import ReadingTime from "@/components/ReadingTime";
import { getFeaturedPosts } from "@/lib/posts";
import { parseTags } from "@/lib/tags";
import { extractFirstImage } from "@/lib/imageExtractor";
import { FadeIn, GradientText } from "@/components/AnimationUtils";
import dynamic from 'next/dynamic';

// 只对需要客户端渲染的组件使用动态导入
const ParticleEffect = dynamic(() => import("@/components/AnimationUtils").then(mod => ({ default: mod.ParticleEffect })), {
  loading: () => null
});

const CountUp = dynamic(() => import("@/components/MicroInteractions").then(mod => ({ default: mod.CountUp })), {
  loading: () => <span>0</span>
});
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '壹壹零壹Blog - 探索前沿技术，分享编程心得',
  description: '专注于现代Web开发技术的个人博客，分享Next.js、TypeScript、React等前端技术的见解和实践经验。无论你是初学者还是经验丰富的开发者，都能在这里找到有价值的内容。',
  keywords: ['博客', 'Web开发', 'Next.js', 'TypeScript', 'React', '前端技术', '编程', '技术分享'],
  authors: [{ name: '壹壹零壹Blog' }],
  creator: '壹壹零壹Blog',
  publisher: '壹壹零壹Blog',
  robots: 'index, follow',
  openGraph: {
    title: '壹壹零壹Blog - 探索前沿技术，分享编程心得',
    description: '专注于现代Web开发技术的个人博客，分享Next.js、TypeScript、React等前端技术的见解和实践经验。',
    url: 'https://your-domain.com',
    siteName: '壹壹零壹Blog',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '壹壹零壹Blog - 技术博客',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '壹壹零壹Blog - 探索前沿技术，分享编程心得',
    description: '专注于现代Web开发技术的个人博客，分享Next.js、TypeScript、React等前端技术的见解和实践经验。',
    images: ['/og-image.jpg'],
    creator: '@your_twitter',
  },
  alternates: {
    canonical: 'https://your-domain.com',
    types: {
      'application/rss+xml': '/rss.xml',
    },
  },
};

interface Post {
  id: number;
  slug: string;
  title: string;
  content?: string | null;
  excerpt: string | null;
  tags: string; // 现在是JSON字符串
  featured: boolean;
  published: boolean;
  views: number;
  readingTime: number;
  author: string | null;
  coverImage: string | null;
  createdAt: Date;
  updatedAt: Date;
  date?: string;
}

export default async function Home() {
  // 从数据库获取特色文章（已发布的文章，按浏览量排序）
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900"></div>
        <div className="absolute inset-0 bg-black/70"></div>
        
        {/* 动态背景点阵 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-blue-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-blue-200 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-200 rounded-full animate-ping"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-32">
          {/* 粒子效果背景 */}
          <ParticleEffect count={30} color="#3b82f6" size={3} />
          
          <div className="text-center">
            {/* 主标题 */}
            <FadeIn delay={0.2}>
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-400 text-sm font-medium rounded-full border border-blue-600/30 mb-4">
                  Welcome to
                </span>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <GradientText gradient="from-blue-400 via-purple-500 to-blue-600" animate>
                    壹壹零壹Blog
                  </GradientText>
                </h1>
              </div>
            </FadeIn>
            
            {/* 副标题 */}
            <FadeIn delay={0.4} direction="up">
              <p className="mt-6 text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                探索前沿技术，分享编程心得，记录学习历程
              </p>
              <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto">
                专注于 Next.js、TypeScript、React 等现代Web开发技术
              </p>
            </FadeIn>
            
            {/* 统计数据 */}
            <FadeIn delay={0.6} direction="up">
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <CountUp value={featuredPosts.length} />+
                  </div>
                  <div className="text-sm text-gray-400">技术文章</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <CountUp value={10} />+
                  </div>
                  <div className="text-sm text-gray-400">技术栈</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">
                    <CountUp value={2024} />
                  </div>
                  <div className="text-sm text-gray-400">开始分享</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-gray-400">学习热情</div>
                </div>
              </div>
            </FadeIn>
            
            {/* 行动按钮 */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/posts" 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-blue-600/25"
              >
                开始阅读 →
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                关于我
              </Link>
            </div>
            
            {/* 技术标签 */}
            <div className="mt-16">
              <p className="text-sm text-gray-400 mb-4">核心技术栈</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Prisma'].map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-gray-800/50 text-gray-300 text-sm rounded-md border border-gray-700/50 hover:border-blue-600/50 hover:text-blue-400 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 滚动指示器 */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m0 0l7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Featured Posts */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold text-white">精选文章</h2>
          <Link href="/posts" className="text-blue-400 hover:text-blue-300 transition-colors">
            查看所有文章 →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post: Post, index: number) => {
            // 优先使用coverImage，如果没有则从内容中提取第一张图片
            const coverImage = post.coverImage || extractFirstImage(post.content || '');
            
            return (
              <FadeIn 
                key={post.id} 
                delay={index * 0.1}
                direction="up"
              >
                <ArticleCard 
                  id={post.slug}
                  title={post.title}
                  excerpt={post.excerpt || post.content || ''}
                  date={post.date || post.createdAt.toISOString().split('T')[0]}
                  readTime={`${post.readingTime}分钟阅读`}
                  tags={parseTags(post.tags)}
                  coverImage={coverImage || undefined}
                />
              </FadeIn>
            );
          })}
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