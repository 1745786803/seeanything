import "dotenv/config";
import { defineConfig } from "prisma/config";

// --- 侦探代码：帮我们看看环境变量到底读到了没有 ---
console.log("🔍 正在检查环境变量...");
console.log("-> POSTGRES_PRISMA_URL:", process.env.POSTGRES_PRISMA_URL ? "✅ 已读取" : "❌ 未找到 (是空的)");
console.log("-> DATABASE_URL:", process.env.DATABASE_URL ? "✅ 已读取" : "❌ 未找到 (是空的)");
// ------------------------------------------------

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // 自动尝试两种常见的名字，哪个有值用哪个
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
    directUrl: process.env.POSTGRES_URL_NON_POOLING,
  },
});