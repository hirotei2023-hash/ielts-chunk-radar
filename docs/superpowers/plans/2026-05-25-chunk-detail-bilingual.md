# 词块详情页双语优化 实施方案

> **Goal:** 词块详情页增加音标、搭配中文、例句翻译、近义表达翻译，让用户能完整理解每个词块

**Approach:** 新增 4 个并行字段（`_cn` 后缀），不改变现有字段类型，零破坏现有代码

**Tech Stack:** TypeScript, Next.js 16, React, PostgreSQL TEXT[], Supabase

---

## 文件改动清单

| # | 文件 | 操作 | 说明 |
|---|------|------|------|
| 1 | `types/chunk.ts` | 修改 | 新增 4 个字段 |
| 2 | `scripts/enrich-chunks.ts` | **新建** | 为 300 chunks 生成双语数据 |
| 3 | `data/chunks.json` | 修改 | 富化后的完整数据 |
| 4 | `components/chunks/chunk-detail.tsx` | 修改 | 渲染新字段 |
| 5 | `scripts/generate-seed-sql.ts` | 修改 | 序列化新字段 |
| 6 | `supabase/migrations/003_add_bilingual.sql` | **新建** | ALTER TABLE 加列 |
| 7 | `supabase/migrations/002_seed.sql` | 重新生成 | 含新字段的种子数据 |
| 8 | `lib/chunks.ts` | 修改 | 搜索扩展 |
| 9 | `lib/review-algorithm.ts` | 修改 | 例句翻译作提示 |

---

## 新增字段

```ts
pronunciation: string;        // IPA 音标，如 "/əˈkeɪ.də.mɪk/"
collocations_cn: string[];    // 高频搭配中文，与 collocations 一一对应
example_sentence_cn: string;  // 例句中文翻译
synonyms_cn: string[];        // 近义表达中文，与 synonyms 一一对应
```

---

## 实施步骤

### Step 1: 更新类型定义

`types/chunk.ts` — 在 Chunk 接口末尾添加 4 个新字段（必填，所有 chunks 一次填充完）

### Step 2: 生成双语数据（核心步骤）

创建 `scripts/enrich-chunks.ts`：
- 读取 `data/chunks.json`（300 chunks）
- 分批（每批 10 条）调用 LLM 生成 pronunciation、collocations_cn、example_sentence_cn、synonyms_cn
- 校验返回的数组长度与原始字段一致
- 每 10 条存盘，支持断点续传
- 输出富化后的 `data/chunks.json`

### Step 3: 更新详情页 UI

`components/chunks/chunk-detail.tsx`：
- **音标**：在 `translation · part_of_speech` 下方新增一行灰色 IPA 音标
- **高频搭配**：每个搭配右边显示中文翻译（灰白色）
- **例句**：英文例句下方显示中文翻译
- **近义表达**：每个同义词后面括号内显示中文

### Step 4: 更新数据库

- 新建 `supabase/migrations/003_add_bilingual.sql` — 4 条 ALTER TABLE ADD COLUMN
- 重新生成 `002_seed.sql`

### Step 5: 搜索扩展

`lib/chunks.ts` — 搜索范围加入 `collocations_cn`、`example_sentence_cn`

### Step 6: 复习提示优化

`lib/review-algorithm.ts` — 填空题的 hint 中加入例句中文翻译

---

## 验证

1. `npm run build` 通过，310 个页面正确生成
2. 本地 dev 打开词块详情页，检查音标、搭配中文、例句翻译、近义翻译四项显示
3. Supabase SQL Editor 运行 003 迁移，确认列添加成功
