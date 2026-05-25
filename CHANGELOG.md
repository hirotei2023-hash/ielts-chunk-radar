# 版本更新日志

## v2.0.0 (2026-05-25) — 双语优化 + 后端集成

### 🎯 双语支持（词块详情页）

- **音标展示**：词块详情页标题下方新增 IPA 音标
- **高频搭配中文**：每条英文搭配旁显示对应中文翻译
- **例句翻译**：英文例句下方显示中文翻译
- **近义表达中文**：每个同义词后用括号标注中文含义

涉及文件：
- `types/chunk.ts` — Chunk 接口新增 `pronunciation`、`collocations_cn`、`example_sentence_cn`、`synonyms_cn` 4 个字段
- `components/chunks/chunk-detail.tsx` — UI 展示 4 个新字段
- `data/chunks.json` — 300 个词块全部填充双语数据
- `scripts/enrich-chunks.ts` — 双语数据填充脚本 (2000+ 行)
- `scripts/generate-seed-sql.ts` — INSERT 语句从 13 列扩展至 17 列
- `supabase/migrations/003_add_bilingual.sql` — 新增 4 列
- `lib/chunks.ts` — 搜索范围扩展至中文字段
- `lib/review-algorithm.ts` — 复习提示加入例句翻译

### 🗄️ Supabase 后端集成

- **数据库**：chunks 表（300 条）、profiles 表、favorites 表、user_chunk_progress 表
- **认证系统**：邮箱注册/登录，AuthContext 全局会话管理，AuthGuard 路由保护
- **数据层**：chunks 从 Supabase 加载，带降级到本地 JSON 的容错
- **行级安全 (RLS)**：所有表启用 RLS，用户只能访问自己的数据
- **静态生成**：词块详情页保留 SSG（`generateStaticParams`），构建时无需 Supabase

### 📊 学习系统

- **学习进度追踪** (`lib/progress.ts`)：掌握度评分、正确/错误次数、复习间隔
- **掌握度徽章** (`components/chunks/mastery-badge.tsx`)：Warming Up → Getting There → Solid → Mastered 四个等级
- **首页真实统计**：已学习数、已掌握数、今日待复习数
- **个人主页**：邮箱显示、目标分数、学习数据面板、退出登录

### 🧠 复习系统

- **复习算法** (`lib/review-algorithm.ts`)：3 种题型自动生成（中译英 / 搭配填空 / 场景匹配）
- **复习卡片** (`components/review/review-card.tsx`)：题目展示、作答、正误反馈
- **复习会话** (`components/review/review-session.tsx`)：批量复习、进度追踪、结果统计

### 🔧 修复与优化

- 修复 Next.js 16 `params` 需要 `await` 的 Breaking Change
- 修复种子数据 SQL 数组语法（PostgreSQL TEXT[] 格式）
- 修复 Supabase API 失败时页面永久卡在加载中的问题
- 收藏功能回退至 localStorage（Supabase 版存在查插不一致的竞态缺陷）
- Supabase 客户端改为懒加载 Proxy 模式，避免构建时初始化

### 📦 新增文件

| 文件 | 用途 |
|------|------|
| `lib/supabase.ts` | Supabase 客户端（懒加载 Proxy） |
| `lib/auth.tsx` | 认证上下文与 Provider |
| `lib/chunks-supabase.ts` | chunks 数据层（Supabase + 本地降级） |
| `lib/favorites-supabase.ts` | 收藏 Supabase 版（已弃用） |
| `lib/progress.ts` | 学习进度追踪 |
| `lib/review-algorithm.ts` | 复习算法 |
| `components/auth/*` | 登录/注册表单与路由守卫 |
| `components/chunks/mastery-badge.tsx` | 掌握度徽章 |
| `components/profile/profile-stats.tsx` | 个人统计面板 |
| `components/review/*` | 复习卡片与会话 |
| `app/login/page.tsx` | 登录页 |
| `app/register/page.tsx` | 注册页 |
| `supabase/migrations/*` | 数据库迁移（3 个 SQL 文件） |
| `scripts/enrich-chunks.ts` | 双语数据填充脚本 |
| `docs/superpowers/plans/*` | 实现计划文档 |

---

## v1.0.0 (2026-05-24) — Demo 版本

### 首次发布

- **首页**：词块雷达价值主张，学习数据占位
- **词块库** (`/library`)：主题筛选、模块筛选、搜索、排序（频率/字母/最近）
- **词块详情** (`/chunk/[id]`)：静态生成 300 个页面，含搭配、例句、近义词、常见错误
- **收藏页** (`/profile/favorites`)：localStorage 收藏列表
- **复习/个人页**：占位页面
- **底部导航**：首页、词块库、复习（占位）、个人（占位）
- **PWA 支持**：manifest.json + Service Worker，可安装到桌面
- **深色主题**：暖色调暗色系（Stone 色板）
- **300 词块种子数据**：覆盖教育、环境、科技、健康、社会、经济 6 大雅思话题
- **GitHub Pages 部署**：静态导出 + Actions 自动部署
