'use client';

import { useState, useEffect } from 'react';
import { Camera, Aperture } from 'lucide-react';

// 1. 定义接口：严格对应新的 schema.prisma
interface Photo {
  id: string;      // 改为 string，因为 cuid 生成的是字符串
  url: string;
  prompt: string | null; // 新增 prompt，可能是空的
  createdAt: string;
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // 获取数据
  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch('/api/photos');
        if (!res.ok) throw new Error('网络错误');
        const data = await res.json();
        setPhotos(data);
      } catch (error) {
        console.error("加载失败:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, []);

  // 2. 辅助函数：格式化日期
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-yellow-500/30">
      
      {/* --- 顶部导航 --- */}
      <header className="fixed top-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-yellow-500 transition-colors duration-300">
              <Camera className="w-5 h-5 group-hover:text-black transition-colors" />
            </div>
            <span className="text-xl font-bold tracking-[0.2em] uppercase">Visual<span className="text-yellow-500">.</span>Log</span>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex gap-8 text-sm font-medium tracking-wide text-gray-400">
              <li className="hover:text-white cursor-pointer transition-colors">作品集</li>
              <li className="hover:text-white cursor-pointer transition-colors">关于</li>
              <li className="px-4 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all cursor-pointer">联系我</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* --- 主要内容 --- */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        
        {/* 标题区 */}
        <div className="mb-16 mt-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            AI 灵感记录
          </h1>
          <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
            探索生成式 AI 的无限可能。
          </p>
        </div>

        {/* 内容展示区 */}
        {loading ? (
          // 加载骨架屏 (Skeleton)
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[3/4] bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          // 空状态
          <div className="text-center py-20 text-gray-500">
            <Aperture className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>暂无相关照片</p>
          </div>
        ) : (
          // 照片瀑布流
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <article 
                key={photo.id} 
                className="group relative flex flex-col gap-3 cursor-pointer"
              >
                {/* 图片容器 */}
                <div className="relative overflow-hidden rounded-xl bg-gray-800 aspect-[4/5] shadow-2xl">
                  <img
                    src={photo.url}
                    alt={photo.prompt || 'AI Image'}
                    className="object-cover w-full h-full transform transition duration-700 ease-out group-hover:scale-105 group-hover:opacity-90"
                    loading="lazy"
                  />
                  {/* 悬停显示的遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <span className="inline-block px-2 py-1 bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider w-fit rounded mb-2 backdrop-blur-sm">
                      AI Generated
                    </span>
                  </div>
                </div>

                {/* 图片信息 */}
                <div className="flex justify-between items-start mt-2 px-1">
                  <div className="w-full">
                    {/* 把原来的 title 换成了 prompt */}
                    <h3 className="text-sm font-medium text-white group-hover:text-yellow-500 transition-colors line-clamp-2 leading-relaxed">
                      {photo.prompt || '无提示词'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 font-mono border-t border-white/10 pt-2">
                      {formatDate(photo.createdAt)}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="border-t border-white/5 py-12 text-center text-gray-600 text-sm">
        <p>&copy; 2026 Visual.Log Photography. Built with Next.js & Vercel.</p>
      </footer>
    </div>
  );
}