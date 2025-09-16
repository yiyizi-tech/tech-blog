import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const page = await prisma.page.findUnique({
      where: { id }
    });

    if (!page) {
      return NextResponse.json(
        { error: '页面不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('获取页面失败:', error);
    return NextResponse.json(
      { error: '获取页面失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, slug, content, published, template, author } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: '标题和slug为必填项' },
        { status: 400 }
      );
    }

    const existingPage = await prisma.page.findUnique({
      where: { id }
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: '页面不存在' },
        { status: 404 }
      );
    }

    // 检查slug是否被其他页面使用
    if (slug !== existingPage.slug) {
      const slugExists = await prisma.page.findUnique({
        where: { slug }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: '该slug已被其他页面使用' },
          { status: 400 }
        );
      }
    }

    const updatedPage = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        content: content || existingPage.content,
        published: published !== undefined ? published : existingPage.published,
        template: template || existingPage.template,
        author: author || existingPage.author,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      page: updatedPage,
      message: '页面更新成功'
    });
  } catch (error) {
    console.error('更新页面失败:', error);
    return NextResponse.json(
      { error: '更新页面失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existingPage = await prisma.page.findUnique({
      where: { id }
    });

    if (!existingPage) {
      return NextResponse.json(
        { error: '页面不存在' },
        { status: 404 }
      );
    }

    await prisma.page.delete({
      where: { id }
    });

    return NextResponse.json({
      message: '页面删除成功'
    });
  } catch (error) {
    console.error('删除页面失败:', error);
    return NextResponse.json(
      { error: '删除页面失败' },
      { status: 500 }
    );
  }
}