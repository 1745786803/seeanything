import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. 获取所有照片 (GET)
export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { createdAt: 'desc' }, // 按时间倒序
    });
    return NextResponse.json(photos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// 2. 新增照片 (POST) - 供后台使用
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newPhoto = await prisma.photo.create({
      data: {
        title: body.title,
        url: body.url,
        category: body.category,
      },
    });
    return NextResponse.json(newPhoto);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 });
  }
}