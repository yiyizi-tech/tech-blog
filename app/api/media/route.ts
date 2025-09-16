import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// 获取媒体文件列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type'); // 'image', 'video', 'audio', 'document'

    const skip = (page - 1) * limit;

    // 构建查询条件
    const where: any = {};
    
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { originalName: { contains: search, mode: 'insensitive' } },
        { alt: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (type) {
      const mimeTypeFilters = {
        'image': 'image/',
        'video': 'video/',
        'audio': 'audio/',
        'document': 'application/'
      };
      
      if (mimeTypeFilters[type as keyof typeof mimeTypeFilters]) {
        where.mimetype = { 
          startsWith: mimeTypeFilters[type as keyof typeof mimeTypeFilters] 
        };
      }
    }

    const [mediaFiles, total] = await Promise.all([
      prisma.mediaFile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.mediaFile.count({ where }),
    ]);

    return NextResponse.json({
      mediaFiles,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('获取媒体文件失败:', error);
    return NextResponse.json(
      { error: '获取媒体文件失败' },
      { status: 500 }
    );
  }
}

// 上传媒体文件
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = formData.get('alt') as string || '';
    const description = formData.get('description') as string || '';
    
    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      );
    }

    // 检查文件大小 (50MB限制)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: '文件大小不能超过 50MB' },
        { status: 400 }
      );
    }

    // 创建上传目录
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // 生成唯一文件名
    const timestamp = Date.now();
    const extension = path.extname(file.name);
    const filename = `${timestamp}${extension}`;
    const filepath = path.join(uploadDir, filename);

    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // 保存到数据库
    const url = `/uploads/${filename}`;
    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename,
        originalName: file.name,
        mimetype: file.type,
        size: file.size,
        url,
        alt: alt || null,
        description: description || null,
        uploadedBy: 'admin', // TODO: 从session获取用户信息
      },
    });

    return NextResponse.json(mediaFile, { status: 201 });
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}