import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
}

async function getPageBySlug(slug: string, isPreview: boolean = false) {
  try {
    const page = await prisma.page.findFirst({
      where: {
        slug: slug,
        // 如果是预览模式，允许访问未发布的页面
        ...(isPreview ? {} : { published: true }),
      },
    });
    return page;
  } catch (error) {
    console.error('获取页面详情失败:', error);
    return null;
  }
}

function processContent(content: string): string {
  let processedContent = content;
  
  // 处理标题
  processedContent = processedContent
    .replace(/^# ([^\n]+)/gm, (match, title) => {
      const id = title.toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fff-]/g, '') // 保留中文字符
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/-+/g, '-') // 多个连字符合并为一个
        .trim();
      return `<h1 id="${id}" class="text-4xl font-bold mt-8 mb-6 text-white">${title}</h1>`;
    })
    .replace(/^## ([^\n]+)/gm, (match, title) => {
      const id = title.toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fff-]/g, '') 
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `<h2 id="${id}" class="text-3xl font-bold mt-6 mb-4 text-white">${title}</h2>`;
    })
    .replace(/^### ([^\n]+)/gm, (match, title) => {
      const id = title.toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fff-]/g, '') 
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `<h3 id="${id}" class="text-2xl font-semibold mt-6 mb-4 text-white">${title}</h3>`;
    })
    .replace(/^#### ([^\n]+)/gm, (match, title) => {
      const id = title.toLowerCase()
        .replace(/[^\w\s\u4e00-\u9fff-]/g, '') 
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      return `<h4 id="${id}" class="text-xl font-semibold mt-5 mb-3 text-white">${title}</h4>`;
    });

  // 处理粗体
  processedContent = processedContent.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  
  // 处理链接
  processedContent = processedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline transition-colors">$1</a>');
  
  // 处理代码块
  processedContent = processedContent.replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900 border border-gray-700 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-gray-100 font-mono">$1</code></pre>');
  
  // 处理行内代码
  processedContent = processedContent.replace(/`([^`]+)`/g, '<code class="bg-gray-800 text-red-400 px-2 py-1 rounded text-sm font-mono">$1</code>');
  
  // 处理无序列表
  processedContent = processedContent.replace(/^- (.*$)/gm, '<li class="ml-4 mb-2">$1</li>');
  
  // 将连续的li包装在ul中
  processedContent = processedContent.replace(/(<li[^>]*>.*<\/li>\s*)+/g, (match) => {
    return `<ul class="list-disc list-inside mb-4 space-y-1 text-gray-300">${match}</ul>`;
  });
  
  // 处理段落
  const blocks = processedContent.split('\n\n');
  processedContent = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    
    // 跳过已经处理的 HTML 块
    if (block.startsWith('<')) return block;
    
    // 处理段落
    return `<p class="mb-6 text-gray-300 leading-relaxed">${block}</p>`;
  }).join('\n');
  
  return processedContent;
}

export default async function PageDetail({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';
  const page = await getPageBySlug(slug, isPreview);

  if (!page) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-black text-white">
      {/* 页面头部 */}
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
              {page.title}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {page.author || '管理员'}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(page.updatedAt).toLocaleDateString('zh-CN')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 页面内容 */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div 
          className="prose prose-lg prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: processContent(page.content || '') }}
        />
        
        {/* 页面底部信息 */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="text-center">
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
      </main>
    </article>
  );
}