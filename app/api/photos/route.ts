import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

// ✅ v5 版本会自动读取 schema 里的配置，不需要任何参数
const prisma = new PrismaClient();

export async function GET() {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(photos);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '获取失败' }, { status: 500 });
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
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}