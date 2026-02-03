import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // ❌ 之前报错是因为这里不允许写 directUrl
    // ✅ 只保留 url 即可，这足以让 Vercel 完成构建和运行
    url: process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL,
  },
});