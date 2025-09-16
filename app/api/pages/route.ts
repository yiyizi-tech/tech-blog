import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const published = searchParams.get('published'); // 'true' | 'false'

    const skip = (page - 1) * limit;

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
          { content: { contains: search, mode: 'insensitive' as const } }
        ]
      }),
      ...(published && { published: published === 'true' })
    };

    const [pages, total] = await Promise.all([
      prisma.page.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' }
      }),
      prisma.page.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      pages,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('获取页面列表失败:', error);
    return NextResponse.json(
      { error: '获取页面列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, slug, content, published, template, author } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: '标题和slug为必填项' },
        { status: 400 }
      );
    }

    // 检查slug是否已存在
    const existingPage = await prisma.page.findUnique({
      where: { slug }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: '该slug已被使用' },
        { status: 400 }
      );
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        content: content || '',
        published: published || false,
        template: template || 'default',
        author: author || '管理员'
      }
    });

    return NextResponse.json({
      page,
      message: '页面创建成功'
    }, { status: 201 });
  } catch (error) {
    console.error('创建页面失败:', error);
    return NextResponse.json(
      { error: '创建页面失败' },
      { status: 500 }
    );
  }
}