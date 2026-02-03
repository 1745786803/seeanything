import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// 强制由静态转为动态：每次访问都重新运行，不在构建时运行
export const dynamic = 'force-dynamic';

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
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}