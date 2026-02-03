import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 1. 强制动态模式 (防止构建时报错)
export const dynamic = 'force-dynamic';

// 2. 初始化 Prisma 客户端
// 关键修复：因为 schema 里没写 URL，这里必须手动传进去！
const prisma = new PrismaClient({
  datasourceUrl: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
});

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error('获取失败:', error); // 加个日志方便排查
    return NextResponse.json({ error: '获取图片失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPhoto = await prisma.photo.create({
      data: {
        url: body.url,
        prompt: body.prompt || null,
      },
    });
    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}