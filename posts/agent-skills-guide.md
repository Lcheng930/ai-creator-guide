---
title: 'Claude Code Agent Skills 完全指南：封装你的 AI 工作流'
description: '2026年最完整的 Agent Skills 中文教程。从 SKILL.md 编写规范、10 个实战模板，到多 Agent 协作架构，一篇掌握 AI 工作流封装。'
head:
  - - meta
    - name: keywords
      content: 'Claude Code,Agent Skills,AI Agent,SKILL.md,AI工作流,智能体,Cursor,Codex,Vibe Coding,AI编程技巧'
  - - meta
    - property: og:title
      content: 'Claude Code Agent Skills 完全指南：封装你的 AI 工作流'
  - - meta
    - property: og:description
      content: '2026年最完整的 Agent Skills 中文教程。从入门到多 Agent 协作架构，10 个实战模板。'
---

<h1 style="color:#ca8a04">Claude Code Agent Skills 完全指南：封装你的 AI 工作流</h1>

*2026年6月27日 · 阅读约 22 分钟*

---

## 一个场景开始

你第 20 次在 Claude Code 里输入：

> "帮我写一个 REST API 接口，要包含参数校验、错误处理、Swagger 文档。用 Express + TypeScript。错误码格式用公司规范 R-XXXXX。"

然后你盯着输出，手动检查——参数校验写了吗？错误码格式对吗？Swagger 字段全吗？漏了再补，补了再漏。

**这就是"每次重写 prompt"的困境。** 你的团队规范、你的代码风格、你的项目结构——这些东西藏在你的脑子里，每次都靠 prompt 口述给 AI，耗费 token、结果还不稳定。

**Agent Skills 就是解法。** 你把规范写进一个文件。AI 每次自动按规范执行。一次封装，永久复用。

---

## Agent Skills 是什么？

一句话：**Agent Skills = Claude Code 的插件系统。**

它让你把提示词、脚本、参考文档、模板打包成一个标准目录。Claude Code 在合适的时候自动加载并遵循。

### 和普通 prompt 的区别

| | 普通 Prompt | Agent Skill |
|------|:--:|:--:|
| 复用性 | 每次重写 | 一次封装，永久复用 |
| 一致性 | 取决于你这次写得好不好 | **固化规范，每次一致** |
| 知识更新 | 每次手动补充 | 绑定最新文档自动同步 |
| 团队共享 | 靠 copy-paste | `npx skills add` 一行命令 |
| 触发方式 | 手动输入 | 自动匹配场景 + 手动调用 |

---

## 快速上手：10 分钟创建你的第一个 Skill

### 目录结构

```
my-skill/
├── SKILL.md          # 核心文件（必须），定义 Skill 的行为
├── scripts/          # 可执行脚本（可选）
│   └── validate.sh
├── references/       # 参考文档（可选，AI 按需读取）
│   └── api-spec.md
└── assets/           # 模板、图片等静态资源（可选）
    └── template.ts
```

### Step 1：创建 SKILL.md

**Windows：**

```powershell
# PowerShell
mkdir -p $env:USERPROFILE\.claude\skills\api-generator
```

**macOS / Linux：**

```bash
mkdir -p ~/.claude/skills/api-generator
```

> 💡 **路径速查**：Windows 上是 `C:\Users\<你的用户名>\.claude\skills\`，macOS/Linux 上是 `~/.claude/skills/`。下文用 `~/.claude/skills/` 泛指，Windows 用户自行替换。

```markdown
---
name: api-generator
description: |
  当用户要求生成 API 接口时自动使用。
  输出必须符合公司 REST API 规范：
  - Express + TypeScript
  - Zod 参数校验
  - 统一错误码格式 R-XXXXX
  - 自动生成 Swagger 文档注释
  - 包含单元测试骨架
---

# API 接口生成器

## 触发条件
- 用户说"写一个接口"、"创建一个 API"、"生成路由"
- 用户提到 REST API、Express 路由

## 输出规范

### 必须包含
1. TypeScript 类型定义（请求参数 + 响应体）
2. Zod 校验 schema
3. Express 路由处理函数（含 try-catch）
4. Swagger JSDoc 注释
5. 错误响应统一使用 `createError(code, message)` 工具函数
6. Jest 单元测试骨架（至少 2 个 case）

### 错误码规范
- 参数校验失败：R-40001
- 资源不存在：R-40401
- 权限不足：R-40301
- 服务器内部错误：R-50001

### 文件位置
- 路由文件：`src/routes/<resource>.ts`
- 校验 schema：`src/schemas/<resource>.ts`
- 类型定义：`src/types/<resource>.ts`
- 测试文件：`src/__tests__/<resource>.test.ts`
```

### Step 2：验证 Skill

重启 Claude Code 或刷新 Skills：

```bash
# 在 Claude Code 终端
/skills
```

你应该看到 `api-generator` 出现在列表中。

### Step 3：使用

直接说：

> "写一个 GET /users/:id 接口"

Claude 检测到关键词匹配 → 自动加载 api-generator Skill → 按照你定义的规范生成代码。

---

## SKILL.md 编写规范详解

### Frontmatter（元数据）

```yaml
---
name: my-skill              # 唯一标识符，小写+连字符
description: |
  一段清晰的描述，包含：
  1. 这个 Skill 做什么
  2. 什么场景下触发
  3. 期望的输出是什么
  
  Claude 用这段描述判断是否匹配当前任务。
  写得好坏直接决定 Skill 会不会被正确触发。
---
```

### description 的写法决定了触发准确率

**差：**
```yaml
description: 用于生成代码。
```
→ 太模糊，几乎每个对话都会误触发。

**好：**
```yaml
description: |
  当用户要求生成 Express REST API 接口、创建路由、
  或编写后端接口代码时使用。输出包含 TypeScript 类型、
  Zod 校验、Swagger 文档和单元测试。
```
→ 精确描述触发条件 + 输出内容，匹配准确。

### Progressive Disclosure（渐进式加载）

把详细文档放在 `references/`，而不是全塞进 SKILL.md：

```
my-skill/
├── SKILL.md           ← 核心行为 + 触发条件（控制在 200 行内）
└── references/
    ├── api-design.md   ← 详细 API 设计规范
    ├── error-codes.md  ← 完整错误码列表
    └── examples.md     ← 5 个标准示例
```

Claude 会先读 SKILL.md 判断是否匹配，需要更多细节时再读 `references/`。**这样做的好处**：SKILL.md 短小精悍、上下文消耗少、匹配速度快。

---

## 10 个实战 Skill 模板

### 1. Git 提交信息生成器

触发条件：用户说"提交"、"commit"

```markdown
---
name: git-commit
description: 当用户要求提交代码、生成 commit message 时使用。
---

# Git Commit 生成器

## 规范
遵循 Conventional Commits：
- feat: 新功能
- fix: 修复
- docs: 文档
- refactor: 重构
- test: 测试
- chore: 构建/工具

## 格式
<type>(<scope>): <中文描述>

## 要求
- 描述用中文
- 不超过 72 字符
- 列出改动的具体文件
```

### 2. 代码审查员

触发条件：用户说"review"、"审查"、"检查代码"

```markdown
---
name: code-reviewer
description: 当用户要求审查代码、检查 PR、review 代码质量时使用。
---

# 代码审查员

## 审查维度（按优先级）
1. **安全性**：SQL 注入、XSS、未校验的用户输入、密钥硬编码
2. **正确性**：边界条件、空值处理、异步错误吞没
3. **性能**：N+1 查询、不必要的循环、大对象复制
4. **可维护性**：命名一致性、函数长度（>50 行标记）、魔法数字

## 输出格式
每个问题按以下格式输出：
- 🔴 严重 / 🟡 建议 / 🟢 优化
- 文件:行号
- 问题描述
- 修复建议（含代码示例）
```

### 3. 前端组件生成器

触发条件：用户要求创建 React/Vue 组件

```markdown
---
name: component-generator
description: 当用户要求创建 UI 组件、页面组件时使用。
---

# 前端组件生成器

## 要求
- React + TypeScript
- 使用项目已安装的 UI 库（检查 package.json）
- 包含 Props 接口定义
- 包含 loading 和 error 状态
- 包含基础交互的可访问性（aria-label, role, keyboard）
- 导出为命名导出

## 文件结构
- 组件文件：src/components/<Name>/index.tsx
- 样式文件：src/components/<Name>/style.module.css
- 类型文件：src/components/<Name>/types.ts
- 测试文件：src/components/<Name>/<Name>.test.tsx
```

### 4. 数据库迁移脚本生成器

```markdown
---
name: db-migration
description: 当用户要求创建数据库表、修改表结构、生成 migration 时使用。
---

# 数据库迁移生成器

## 规范
- 使用项目使用的 ORM（Prisma/Drizzle/TypeORM）
- 包含 up 和 down（回滚）两个方向
- 所有字段必须有 COMMENT 注释
- 索引命名：idx_<table>_<column>
- 外键命名：fk_<table>_<ref_table>
- 时间字段统一用 created_at / updated_at
```

### 5. API 文档生成器

```markdown
---
name: api-docs
description: 当用户要求生成 API 文档、接口说明时使用。
---

# API 文档生成器

## 输出格式
每个接口输出以下内容：
1. 接口路径和方法
2. 功能描述（一句话）
3. 请求参数表（参数名 | 类型 | 必填 | 说明 | 示例）
4. 请求示例（curl + JSON body）
5. 成功响应示例（JSON）
6. 错误响应示例（JSON）
7. 错误码说明表
```

### 6. Bug 报告生成器

```markdown
---
name: bug-report
description: 当用户要求写 bug 报告、描述问题、创建 issue 时使用。
---

# Bug 报告生成器

## 必须包含
- 标题：[模块] 简短描述
- 环境：OS / 浏览器 / 版本号
- 复现步骤：1. 2. 3.
- 预期行为
- 实际行为（含截图或日志）
- 出现频率：每次 / 偶发 / 仅一次
- 影响范围
```

### 7. 单元测试生成器

```markdown
---
name: test-generator
description: 当用户要求写单元测试、生成测试用例时使用。
---

# 单元测试生成器

## 规范
- 使用项目现有的测试框架（Jest/Vitest/Mocha）
- 每个函数至少覆盖：正常输入、边界值、异常输入
- 测试命名：should <行为> when <条件>
- Mock 外部依赖，不调用真实 API/数据库
- 不使用 test.todo，要么写要么不写
```

### 8. 项目 README 生成器

```markdown
---
name: readme-generator
description: 当用户要求写 README、项目文档时使用。
---

# README 生成器

## 结构
1. 项目名称 + 一句话描述
2. 技术栈徽章
3. 快速开始（clone → install → run，3 步）
4. 项目结构树
5. 核心功能列表
6. 配置说明（环境变量表）
7. 部署指南
8. 贡献指南
```

### 9. 日志分析器

```markdown
---
name: log-analyzer
description: 当用户要求分析日志、排查错误时使用。
---

# 日志分析器

## 分析步骤
1. 提取所有 ERROR 和 WARN 级别的日志行
2. 按时间排序，标记第一条错误为"根源"
3. 统计同类错误出现次数
4. 提取关键信息：时间戳、错误码、堆栈 trace、请求 ID
5. 给出可能原因（按概率排序）
6. 建议修复方案
```

### 10. 中国环境适配器

```markdown
---
name: china-env
description: 当检测到项目在国内网络环境、或用户要求适配国内服务时使用。
---

# 中国环境适配器

## 自动检测与替换
- npm registry → https://registry.npmmirror.com
- pip index → https://pypi.tuna.tsinghua.edu.cn/simple
- Docker Hub → 通过阿里云镜像加速
- GitHub raw → 通过 ghproxy 或镜像站
- Google Fonts → 替换为中文字体 CDN

## API 适配
- OpenAI API → 推荐国内兼容接口
- Claude API → 推荐国内供应商
- Google 服务（Analytics/Recaptcha）→ 国内替代方案
```

---

## 安装 Skill 的三种方式

### 方式一：从社区安装

```bash
# 搜索社区 Skills
/plugin marketplace add anthropics/skills

# 安装官方 Skills
/plugin install document-skills@anthropic-agent-skills

# 浏览可用 Skills
/plugin browse
```

### 方式二：npx 一键安装

```bash
# 安装单个 Skill
npx skills add shengyy/agent-skills -g --skill <skill-name>

# 安装全部 Skills
npx skills add shengyy/agent-skills -g --all

# 安装 Matt Pocock 的 19 个工程 Skill
npx skills@latest add mattpocock/skills
```

### 方式三：手动安装

```bash
# 克隆 Skill 仓库
git clone https://github.com/<user>/<skill-repo>.git

# 复制到 Claude Code skills 目录
cp -r <skill-repo>/<skill-name> ~/.claude/skills/
```

---

## 进阶：多 Agent 协作架构

单个 Skill 解决单一问题。多个 Skill 配合可以实现复杂工作流。

### 架构示例：全栈功能开发流水线

```
用户需求："加一个用户收藏功能"
    ↓
[api-generator]  生成后端 API + 数据库迁移
    ↓
[component-generator] 生成前端组件
    ↓
[test-generator] 生成前后端测试
    ↓
[code-reviewer]  审查全部代码
    ↓
[git-commit]     生成 commit message
    ↓
[api-docs]       更新 API 文档
```

这不是编排——是你依次调起不同的 Skill。每个 Skill 专注一件事，合在一起就是一条完整的生产线。

### 自定义编排 Skill

你甚至可以写一个"编排 Skill"来自动化这个流程：

```markdown
---
name: fullstack-feature
description: |
  当用户要求开发完整功能、全栈功能时使用。
  自动串联：API → 前端 → 测试 → 审查 → 提交。
---

# 全栈功能开发

## 流程
1. 调起 api-generator → 完成后输出"✅ API 生成完毕"
2. 调起 db-migration → 完成后输出"✅ 数据库迁移完毕"  
3. 调起 component-generator → 完成后输出"✅ 前端组件完毕"
4. 调起 test-generator → 完成后输出"✅ 测试完毕"
5. 调起 code-reviewer → 审查全部代码
6. 调起 git-commit → 生成提交信息

## 要求
- 每步完成后暂停，等用户确认再继续
- 如果某步失败，不继续后续步骤
```

---

## 国内环境特别说明

### Claude Code 国内使用

Claude Code 在国内访问 `api.anthropic.com` 不稳定。需要在 `~/.claude/settings.json` 中配置兼容接口：

```json
{
  "ANTHROPIC_BASE_URL": "https://your-provider.com/v1",
  "ANTHROPIC_AUTH_TOKEN": "your-api-key"
}
```

> ⚠️ **不要直接在 settings.json 中粘贴敏感凭据。** 使用环境变量或 Claude Code 的 `/config` 命令配置。

### 国内可用的 AI 编程工具替代

| 工具 | 底层模型 | 是否支持 Skills |
|------|------|:--:|
| Claude Code | Claude 4.x | ✅ 原生支持 |
| Cursor | 多模型 | ✅ 支持自定义规则 |
| Codex (OpenAI) | GPT-5 | ✅ 有类似 Custom Agent 功能 |
| 通义灵码 | 通义千问 | ❌ 不支持 |
| 文心快码 | 文心 | ❌ 不支持 |
| MarsCode | 豆包 | ⚠️ 部分支持 |

---

## Skill 调试技巧

### 查看已安装的 Skills

在 Claude Code 终端：

```
/skills
```

列出所有已安装 Skill 及其状态。如果刚创建的 Skill 没出现，**重启 Claude Code** 即可。

### 手动触发 Skill

如果自动匹配不稳定，可以手动调用：

```
请使用 api-generator skill 帮我写一个接口
```

或：

```
/skill:api-generator 写一个 GET /users 接口
```

### 验证 Skill 是否生效

在对话中加一个测试指令：

```
// 故意写一个模糊的需求，看 Skill 是否正确触发
写一个接口（不做其他说明）
```

检查输出是否遵循了 SKILL.md 中定义的规范（如错误码格式、文件位置等）。

### 检查 Skill 加载日志

Claude Code 启动时会在终端输出 skill 加载信息。如果看到类似 `Loaded 3 skills` 但你的 skill 不在列表里，检查：
- 目录结构是否正确（`SKILL.md` 文件名大小写敏感——必须全大写）
- `SKILL.md` 的 YAML frontmatter 格式是否正确（没有多余空格、缩进错误）
- 文件编码必须是 **UTF-8**

### 常见前端问题速查

| 症状 | 可能原因 | 修复 |
|------|------|------|
| Skill 列表里没有 | 文件名大小写不对 | 确认是 `SKILL.md`（全大写） |
| 加载了但不触发 | description 太模糊 | 加具体关键词和场景 |
| 触发了但输出空洞 | SKILL.md 规范不够细 | 加"必须包含""禁止"清单 |
| YAML 报错 | Tab 缩进或特殊字符 | 只用空格缩进，中文用纯文本 |

### 版本要求

| 组件 | 最低版本 | 说明 |
|------|:--:|------|
| Claude Code | **v2.1.3+** | Skills 和 Slash Commands 在此版本合并 |
| Node.js | 18+ | Cursor/Codex 的 skill 系统也需要 |

> ⚠️ **升级提示**：`npm install -g @anthropic-ai/claude-code@latest` 升级到最新版。旧版本可能不支持某些 skill 特性。

---

## 常见翻车场景和修复

### 翻车 1：Skill 不触发

**原因**：description 写得太模糊或太窄。

**修复**：加具体关键词和场景描述。`"用于生成代码"` → `"当用户要求生成 Express REST API 接口、创建路由、或编写后端代码时使用"`。

### 翻车 2：Skill 触发了但输出不对

**原因**：SKILL.md 里的规范描述不够精确。

**修复**：加反例。不只是说"要怎样"，还要说"不要怎样"：
```markdown
## 禁止
- 不使用 any 类型
- 不省略错误处理
- 不返回原始数据库错误给客户端
```

### 翻车 3：SKILL.md 太长导致加载慢

**修复**：拆成 SKILL.md（核心）+ references/（详细文档）。Claude 按需读取，上下文消耗减少 60-80%。

### 翻车 4：多个 Skill 冲突

**原因**：两个 Skill 的 description 都匹配了同一个场景。

**修复**：在 description 中加更精确的区分词。例如 `api-generator` 和 `api-docs` 都涉及 API——前者加"生成接口代码"，后者加"生成接口文档"。

---

## 推荐工具

| 工具 | 用途 | 链接 |
|------|------|------|
| **Claude Code** | AI 编程，Skills 原生支持 | [claude.ai/code](https://claude.ai/code) |
| **Cursor** | AI IDE，支持自定义规则 | [cursor.sh](https://cursor.sh) |
| **Codex** | OpenAI 编程 Agent | [openai.com/codex](https://openai.com/codex) |
| **Anthropic 官方 Skills** | PDF/Word/Excel/PPT 处理 | `/plugin marketplace add anthropics/skills` |
| **Matt Pocock Skills** | 19 个 TypeScript 工程 Skill | `npx skills@latest add mattpocock/skills` |
| **VitePress** | 本文档站构建工具 | [vitepress.dev](https://vitepress.dev) |

---

## 下一步

- 📦 安装至少一个社区 Skill，感受"AI 自动按规范工作"的体验
- ✍️ 创建你自己的第一个 Skill——从工作里最常重复的 prompt 开始
- 🔗 把你的 Skill 分享给团队，`npx skills add` 一行搞定
- 📝 收藏本文，后续更新更多 Skill 模板和协作架构

---

*本文约 5500 字。如果对你有帮助，欢迎分享。你的分享是这个内容资产成长的养分。*

*上一篇：[HyperFrames 完全指南](/posts/hyperframes-guide) —— 用 HTML 写视频，AI Agent 原生支持的开源框架。*

---

::: tip 相关阅读
- [HyperFrames 完全指南](/posts/hyperframes-guide) — 结合 HyperFrames + Agent Skills，可以实现"一句话生成批量营销视频"的自动化流水线
- 用 Claude Code + HyperFrames 自动化视频生产（即将发布）
- Agent Skills 进阶：10 个真实项目 Skill 模板合集（即将发布）
:::
