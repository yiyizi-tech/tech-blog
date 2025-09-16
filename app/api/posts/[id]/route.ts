import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { extractFirstImage } from '@/lib/imageExtractor';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const post = await prisma.post.findUnique({
      where: { id: parseInt(resolvedParams.id) },
    });

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('获取文章失败:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { title, content, excerpt, tags, featured, published, author, coverImage } = body;

    // 如果只是更新发布状态，则不需要验证title和content
    const isStatusUpdate = Object.keys(body).length === 1 && 'published' in body;
    
    if (!isStatusUpdate && (!title || !content)) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      );
    }

    let updateData: any = {
      updatedAt: new Date(),
    };

    // 如果只是状态更新，只更新发布状态
    if (isStatusUpdate) {
      updateData.published = published;
    } else {
      // 完整更新
      const wordsPerMinute = 200;
      const words = content.trim().split(/\s+/).length;
      const readingTime = Math.ceil(words / wordsPerMinute);

      // 自动提取封面图片（如果没有手动设置且内容中有图片）
      let finalCoverImage = coverImage;
      if (!coverImage) {
        const extractedImage = extractFirstImage(content);
        if (extractedImage) {
          finalCoverImage = extractedImage;
        }
      }

      updateData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200) + (content.length > 200 ? '...' : ''),
        tags: tags || [],
        featured: featured || false,
        published: published !== undefined ? published : false,
        author: author || '管理员',
        coverImage: finalCoverImage,
        readingTime,
        updatedAt: new Date(),
      };
    }

    const post = await prisma.post.update({
      where: { id: parseInt(resolvedParams.id) },
      data: updateData,
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await prisma.post.delete({
      where: { id: parseInt(resolvedParams.id) },
    });

    return NextResponse.json({ message: '文章删除成功' });
  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    );
  }
}