import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
   const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  
  // 生成slug
  const slug = data.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .trim();
  
  // 计算阅读时间
  const wordsPerMinute = 200;
  const words = (data.content || '').trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);

  const newPost = await prisma.post.create({
    data: {
      title: data.title,
      slug: slug,
      content: data.content,
      excerpt: data.excerpt || data.content?.substring(0, 200) + (data.content?.length > 200 ? '...' : ''),
      tags: data.tags || '[]',
      featured: data.featured || false,
      published: data.published || false,
      author: data.author || '管理员',
      coverImage: data.coverImage,
      readingTime,
      views: data.views || 0,
    },
  });
  return NextResponse.json(newPost);
}