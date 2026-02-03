import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取所有图片
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

// 上传图片 (保存到数据库)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // ❌ 以前的代码 (导致报错的原因)
    // data: { title: body.title, category: body.category, url: body.url }

    // ✅ 新的代码 (适配新数据库)
    const newPhoto = await prisma.photo.create({
      data: {
        url: body.url,
        // 这里改成了 prompt，而且因为是可选的，给个默认值或者允许为空
        prompt: body.prompt || null, 
      },
    });

    return NextResponse.json(newPhoto);
  } catch (error) {
    console.error('上传失败:', error);
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}