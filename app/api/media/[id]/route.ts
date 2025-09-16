import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink } from 'fs/promises';
import path from 'path';

// 删除媒体文件
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // 查找文件信息
    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id },
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }

    // 删除物理文件
    try {
      const filepath = path.join(process.cwd(), 'public', mediaFile.url);
      await unlink(filepath);
    } catch (error) {
      console.warn('删除物理文件失败:', error);
      // 继续删除数据库记录，即使物理文件删除失败
    }

    // 从数据库删除记录
    await prisma.mediaFile.delete({
      where: { id },
    });

    return NextResponse.json({ message: '文件删除成功' });
  } catch (error) {
    console.error('删除文件失败:', error);
    return NextResponse.json(
      { error: '删除文件失败' },
      { status: 500 }
    );
  }
}

// 更新媒体文件信息
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const data = await request.json();

    const updatedMediaFile = await prisma.mediaFile.update({
      where: { id },
      data: {
        alt: data.alt || null,
        description: data.description || null,
      },
    });

    return NextResponse.json(updatedMediaFile);
  } catch (error) {
    console.error('更新文件信息失败:', error);
    return NextResponse.json(
      { error: '更新文件信息失败' },
      { status: 500 }
    );
  }
}

// 获取单个媒体文件信息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id },
    });

    if (!mediaFile) {
      return NextResponse.json(
        { error: '文件不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(mediaFile);
  } catch (error) {
    console.error('获取文件信息失败:', error);
    return NextResponse.json(
      { error: '获取文件信息失败' },
      { status: 500 }
    );
  }
}