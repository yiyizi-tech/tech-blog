import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const comment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!comment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({ comment });
  } catch (error) {
    console.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
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
    const { content, author, email, website, published } = body;

    if (!content || !author || !email) {
      return NextResponse.json(
        { error: '内容、作者和邮箱为必填项' },
        { status: 400 }
      );
    }

    const existingComment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }

    const updatedComment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        author,
        email,
        website: website || null,
        published: published !== undefined ? published : existingComment.published,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      comment: updatedComment,
      message: '评论更新成功'
    });
  } catch (error) {
    console.error('更新评论失败:', error);
    return NextResponse.json(
      { error: '更新评论失败' },
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

    const existingComment = await prisma.comment.findUnique({
      where: { id }
    });

    if (!existingComment) {
      return NextResponse.json(
        { error: '评论不存在' },
        { status: 404 }
      );
    }

    await prisma.comment.delete({
      where: { id }
    });

    return NextResponse.json({ 
      message: '评论删除成功' 
    });
  } catch (error) {
    console.error('删除评论失败:', error);
    return NextResponse.json(
      { error: '删除评论失败' },
      { status: 500 }
    );
  }
}