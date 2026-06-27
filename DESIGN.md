# DESIGN.md — AI 创客指南

## 1. Visual Theme & Atmosphere

**设计哲学**：暗色调技术博客，兼具编辑级排版质感与开发者工具的精准克制。

**一句话定调**：像暗房冲洗照片——暗的背景让内容发光。

**参考吸收**：Linear 暗画布表面阶梯 · DeepSeek 功能极简 · Vercel 几何精确 · Stripe 排版质量

**反AI感策略**：不用 VitePress 默认绿 · 不纯黑纯白 · 纹理感 · 显示字体层次 · hairline border 替代阴影

---

## 2. Color Palette & Roles

```css
:root {
  /* ===== 基础画布 ===== */
  --bg-root:       #08080a;        /* 最深底色，接近 Linear #010102 但加 1% 暖 */
  --bg-surface:    #0e0e12;        /* 卡片/代码块底色 */
  --bg-elevated:   #14141a;        /* hover 抬起 */
  --bg-overlay:    #1a1a22;        /* 搜索框/弹窗 */

  /* ===== 文字层级 ===== */
  --text-primary:  #e8e6e3;        /* 暖白，不是纯白 #fff */
  --text-secondary:#989893;        /* 暖灰，模仿铅字氧化 */
  --text-muted:    #5c5c58;        /* 辅助信息 */

  /* ===== 强调色 — 暖琥珀金 ===== */
  --accent:        #d4993c;        /* 主强调：暗房安全灯那种暖橙 */
  --accent-hover:  #e8b04f;
  --accent-muted:  rgba(212, 153, 60, 0.12);
  --accent-glow:   rgba(212, 153, 60, 0.25);

  /* ===== 功能性色彩 ===== */
  --code-blue:     #7aa2f7;        /* 代码关键字 */
  --code-cyan:     #7dcfff;        /* 字符串 */
  --code-green:    #9ece6a;        /* 注释/成功 */
  --code-orange:   #ff9e64;        /* 数字/警告 */
  --code-red:      #f7768e;        /* 错误 */

  /* ===== 边框 ===== */
  --border:        rgba(255,255,255,0.06);  /* hairline — 几乎看不见但存在 */
  --border-hover:  rgba(255,255,255,0.12);
  --border-accent: rgba(212, 153, 60, 0.3);

  /* ===== 阴影(暖光扩散) ===== */
  --shadow-sm:     0 1px 2px rgba(0,0,0,0.3);
  --shadow-card:   0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,153,60,0.04);
  --shadow-glow:   0 0 60px rgba(212,153,60,0.06);

  /* ===== RGB 辅助值 ===== */
  --accent-rgb:    212, 153, 60;
  --bg-root-rgb:   8, 8, 10;
}
```

**色板命名逻辑**：用 `--bg-root` 不用 `--bg-primary`——暗示这是扎根的土壤，不是一层"主色"。
`--text-primary: #e8e6e3` 不是纯白——是暖白偏 0.5% 黄，模拟卤素灯下的白纸，去掉 LED 冷白的机器感。

---

## 3. Typography Rules

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Inter:opsz,wght@14..32,400..600&family=Newsreader:opsz,wght@14..72,400..600&display=swap');
```

| Token | Family | Weight | Size / Leading | Letter-spacing | Usage |
|-------|--------|--------|----------------|----------------|-------|
| `--font-display` | Newsreader | 500-600 | — | `-0.02em` | Hero 标题、文章 H1 |
| `--font-body` | Inter | 400-600 | `16px / 1.75` | `0` | 正文、导航、UI |
| `--font-mono` | DM Mono | 400-500 | `14px / 1.6` | `0` | 代码、表格数字、技术标签 |

**字号层级**：
```
Hero Title:   clamp(2.5rem, 6vw, 4.5rem) / 1.1 / -0.03em
Post H1:      clamp(2rem, 4vw, 3rem) / 1.2 / -0.02em
Post H2:      1.5rem / 1.3 / -0.01em
Post H3:      1.15rem / 1.4 / 0
Body:         16px / 1.75
Caption:      13px / 1.5
Code:         14px / 1.6
```

**禁止字体**：Arial, Helvetica, Times New Roman, system-ui（中文字体不做强制约束，但标题优先用 Newsreader + Noto Sans SC fallback）

---

## 4. Component Stylings

### Button
```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;          /* Rectangle with slightly rounded corners — not pill */
  border: 1px solid var(--border);
  background: var(--bg-elevated);
  color: var(--text-primary);
  font: 500 14px var(--font-body);
  transition: all 200ms ease;
  cursor: pointer;
}
.btn:hover   { border-color: var(--border-accent); background: var(--bg-overlay); }
.btn:active  { transform: scale(0.98); }
.btn:focus   { outline: 2px solid var(--accent); outline-offset: 2px; }
.btn-primary { background: var(--accent); color: var(--bg-root); border-color: var(--accent); font-weight: 600; }
```

### Card
```css
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px;
  transition: border-color 200ms ease, transform 200ms ease;
}
.card:hover {
  border-color: var(--border-accent);
  transform: translateY(-2px);
}
```

### Code Block
```css
pre {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 20px 24px;
  font: 14px/1.6 var(--font-mono);
  overflow-x: auto;
}
```

### Link
```css
a {
  color: var(--accent);
  text-decoration: none;
  transition: color 150ms ease;
  text-underline-offset: 3px;
}
a:hover { color: var(--accent-hover); text-decoration: underline; }
```

### Tag / Badge
```css
.tag {
  display: inline-flex;
  padding: 3px 10px;
  background: var(--accent-muted);
  color: var(--accent);
  border-radius: 4px;
  font: 500 12px var(--font-mono);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}
```

### Divider
```css
hr {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 48px 0;
}
```

---

## 5. Layout Principles

**网格**：`max-width: 720px` 正文栏 + `240px` 右侧 TOC，总容器 `max-width: 1080px`。

**间距梯度**（4px base）：`4 → 8 → 12 → 16 → 24 → 32 → 48 → 64 → 96`

**内容节奏**：
- Hero → 32px gap → 正文 → 每 2-3 段一个视觉呼吸点（代码块 / 引用 / 图片）
- 两段之间的逻辑空行 = 1.5 × 行高，不是默认 margin
- TOC 用 `position: sticky; top: 80px`，保持阅读时不追丢位置

---

## 6. Depth & Elevation

不使用 Material Design 的多层阴影。用**表面阶梯 + hairline border**：

```
bg-root     (#08080a) = 页面底色，最深
bg-surface  (#0e0e12) = 卡片、代码块，微抬 1 级
bg-elevated (#14141a) = hover 态、选中项，抬 2 级
bg-overlay  (#1a1a22) = 弹窗、搜索下拉，抬 3 级
```

**暖光扩散**替代阴影：`box-shadow: 0 0 60px rgba(212,153,60,0.06)` — 卡片 hover 时在底部出现极微弱的暖光晕，模拟暗房里安全灯照到相纸边缘的漏光。

---

## 7. Animation & Interaction

**档位：L1 — 精致静态 + 优雅微交互**

不使用 GSAP / ScrollTrigger。纯 CSS transition + 最小 JS。保持页面轻量，加载快。

| 类别 | 实现 |
|------|------|
| **链接 hover** | `color` + `text-decoration` 150ms |
| **卡片 hover** | `border-color → accent` + `translateY(-2px)` 200ms |
| **按钮 active** | `scale(0.98)` — 按下反馈 |
| **代码块** | 左侧 accent 竖线 hover 时亮度增强 |
| **TOC 链接** | 当前章节高亮 + 左侧 accent dot 平滑滑动 |
| **入场** | 仅 Hero 标题用纯 CSS `@keyframes fadeInUp`（一次性，不重复） |
| **滚动** | 原生 `scroll-behavior: smooth`，不用 Lenis |

**降级**：
```css
@media (prefers-reduced-motion) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Do's and Don'ts

### ✅ Do
1. **文字用暖白** (`#e8e6e3`)——不是纯白
2. **表面阶梯**——用背景色微差区分层级，不是阴影
3. **Hairline border**——`rgba(255,255,255,0.06)`，几乎不可见但分隔有效
4. **代码块用 DM Mono**——等宽但比 Fira Code 更温润
5. **标题用 Newsreader**——衬线体增加编辑温度和权威感
6. **强调色只用一处**——琥珀金用于链接和关键 UI 元素，不撒胡椒
7. **正文栏 ≤ 720px**——保持行宽在 65-75 字符
8. **hover 态有两个变化**——颜色 + 微位移，不是单一属性

### ❌ Don't
1. **不用 VitePress 默认绿色**——#10b981 是 AI 生成的标志
2. **不用纯黑 `#000` 纯白 `#fff`**——太数字，太机器
3. **不用 drop-shadow / box-shadow 做层级**——用表面阶梯
4. **不用 emoji 做图标**——用 SVG 或 lucide icon
5. **不用超过 2 种强调色**——一暖一冷 = 打架
6. **不全文用 Inter**——没有字体层级的排版 = 没有灵魂
7. **不用 `border-radius: 9999px` pill 按钮**——这个项目不是 SaaS 产品
8. **不加 loading spinner 除非真的在加载**——spinner = "这是一个 web app"
9. **不用 `backdrop-filter: blur()`**——性能杀手且没有功能性理由
10. **不在移动端缩成单列卡片堆**——保留文本阅读的沉浸感

---

## 9. Responsive Behavior

| 断点 | 策略 |
|------|------|
| `≥ 1080px` | 正文 720px + TOC 240px，左右布局 |
| `768-1079px` | 正文全宽，TOC 折叠到顶部下拉 |
| `≤ 767px` | 正文 100%，字号不缩（保持 16px），右边距 16px |

**触摸目标**：所有可交互元素 ≥ 44×44px
**横向溢出**：代码块允许独立横向滚动，但页面主体零溢出
