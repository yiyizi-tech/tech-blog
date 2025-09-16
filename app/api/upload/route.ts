import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: '没有找到文件' },
        { status: 400 }
      );
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: '只支持图片文件' },
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
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}.${extension}`;
    const filepath = path.join(uploadDir, filename);

    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);

    // 返回文件URL
    const fileUrl = `/uploads/${filename}`;
    
    // 同时保存到媒体库
    try {
      const mediaFile = await prisma.mediaFile.create({
        data: {
          filename: filename,
          originalName: file.name,
          mimetype: file.type,
          size: file.size,
          url: fileUrl,
          uploadedBy: 'editor', // 标记为编辑器上传
        },
      });
      
      return NextResponse.json({ 
        url: fileUrl,
        filename: filename,
        mediaFileId: mediaFile.id
      });
    } catch (dbError) {
      // 如果数据库操作失败，仍然返回文件URL，但记录错误
      console.warn('保存到媒体库失败:', dbError);
      return NextResponse.json({ 
        url: fileUrl,
        filename: filename 
      });
    }
  } catch (error) {
    console.error('文件上传失败:', error);
    return NextResponse.json(
      { error: '文件上传失败' },
      { status: 500 }
    );
  }
}