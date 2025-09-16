import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get('preview') === 'true';

    const post = await prisma.post.findFirst({
      where: {
        slug: slug,
        // 如果是预览模式，允许访问未发布的文章
        ...(isPreview ? {} : { published: true }),
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 增加浏览量
    await prisma.post.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json({
      ...post,
      views: post.views + 1, // 返回更新后的浏览量
    });

  } catch (error) {
    console.error('获取文章详情失败:', error);
    return NextResponse.json(
      { error: '获取文章详情失败' },
      { status: 500 }
    );
  }
}