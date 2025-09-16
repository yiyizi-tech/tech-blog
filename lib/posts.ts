import { Post } from '@prisma/client';
import { prisma } from '@/lib/prisma';

// 从HTML内容中提取纯文本的工具函数
function extractTextFromHTML(html: string): string {
  if (!html) return '';
  
  let text = html;
  
  // 移除特定标签及其内容
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ''); // 移除script标签
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ''); // 移除style标签
  text = text.replace(/<code[^>]*>[\s\S]*?<\/code>/gi, ''); // 移除代码块
  text = text.replace(/<pre[^>]*>[\s\S]*?<\/pre>/gi, ''); // 移除pre标签
  
  // 移除img标签
  text = text.replace(/<img[^>]*>/gi, '');
  
  // 移除所有HTML标签
  text = text.replace(/<[^>]*>/g, '');
  
  // 处理HTML实体
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&hellip;/g, '...')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–');
  
  // 移除多余的空白字符
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

export interface PostWithStats extends Post {
  _count?: {
    comments?: number;
  };
}

export interface PostsResponse {
  posts: PostWithStats[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function getPosts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'published' | 'draft';
}): Promise<PostsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.status) searchParams.append('status', params.status);

  const response = await fetch(`/api/posts?${searchParams}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('获取文章列表失败');
  }
  
  return response.json();
}

export async function getPost(id: number): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error('获取文章失败');
  }
  
  return response.json();
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  featured?: boolean;
  published?: boolean;
  author?: string;
  coverImage?: string;
}): Promise<Post> {
  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('创建文章失败');
  }
  
  return response.json();
}

export async function updatePost(
  id: number,
  data: {
    title: string;
    content: string;
    excerpt?: string;
    tags?: string[];
    featured?: boolean;
    published?: boolean;
    author?: string;
    coverImage?: string;
  }
): Promise<Post> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('更新文章失败');
  }
  
  return response.json();
}

export async function deletePost(id: number): Promise<void> {
  const response = await fetch(`/api/posts/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('删除文章失败');
  }
}

// 服务器端获取特色文章（用于首页展示）
export async function getFeaturedPosts(limit: number = 6) {
  try {
    // 优先获取有封面图片的已发布文章，然后是其他已发布文章
    const [postsWithCover, postsWithoutCover] = await Promise.all([
      prisma.post.findMany({
        where: {
          published: true,
          coverImage: {
            not: null,
          },
          AND: {
            coverImage: {
              not: '',
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: limit,
      }),
      prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { coverImage: null },
            { coverImage: '' },
          ],
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      }),
    ]);
    
    // 合并结果，有封面的优先，然后按需要的数量取
    const allPosts = [...postsWithCover, ...postsWithoutCover].slice(0, limit);
    
    return allPosts.map((post) => {
      // 如果有excerpt直接使用，否则从HTML内容中提取纯文本
      let excerpt = post.excerpt;
      if (!excerpt && post.content) {
        const plainText = extractTextFromHTML(post.content);
        excerpt = plainText.length > 200 ? plainText.substring(0, 200) + '...' : plainText;
      }
      
      return {
        ...post,
        date: new Date(post.createdAt).toISOString().split('T')[0], // 格式化日期
        excerpt: excerpt || '', // 设置摘要
        content: post.content || '', // 保留完整内容用于图片提取
        coverImage: post.coverImage || null, // 确保coverImage字段正确传递
      };
    });
  } catch (error) {
    console.error('获取特色文章失败:', error);
    return [];
  }
}

// 服务器端根据slug获取文章详情
export async function getPostBySlug(slug: string, isPreview: boolean = false) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        slug: slug,
        // 如果是预览模式，允许访问未发布的文章
        ...(isPreview ? {} : { published: true }),
      },
    });
    
    if (!post) {
      return null;
    }
    
    // 增加浏览量（仅在非预览模式下）
    if (!isPreview) {
      await prisma.post.update({
        where: { id: post.id },
        data: { views: { increment: 1 } },
      });
    }
    
    return {
      ...post,
      date: new Date(post.createdAt).toISOString().split('T')[0], // 格式化日期
      views: isPreview ? post.views : post.views + 1, // 返回更新后的浏览量
    };
  } catch (error) {
    console.error('获取文章详情失败:', error);
    return null;
  }
}