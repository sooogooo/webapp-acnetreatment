# 痤疮治疗网站UI重设计方案 - 温柔医美风格系统

**日期：** 2026-01-08
**设计师：** Claude Sonnet 4.5
**项目：** 联合丽格痤疮治疗科普网站
**设计目标：** 创建女性化、现代化、专业的医美科普网站视觉系统

---

## 一、设计理念

### 核心设计理念：温柔医美（Gentle MedBeauty）

在保持医疗专业性的同时，通过精心的配色、排版、细节设计传达温暖、优雅、亲和力。平衡专业性与女性审美，创造舒适安全的浏览体验。

### 设计原则

1. **中性优雅** - 避免过度女性化，采用中性优雅的设计调性
2. **温暖专业** - 用温暖色调平衡医疗行业的冷硬感
3. **轻量通透** - 大量留白、轻字重、高透气性
4. **精致细腻** - 微动效、柔和阴影、流畅曲线
5. **信任安全** - 保持品牌蓝色传达专业可靠

---

## 二、品牌视觉资产

### Logo与Favicon

- **Logo来源：** https://docs.bccsw.cn/logo.png
- **Favicon来源：** https://docs.bccsw.cn/favicon.png
- **品牌色：** 深蓝 #4A6B8A（从logo提取）
- **应用策略：** Logo保留原色，页面主色调使用温暖配色

### 品牌信息

- **公司名称：** 重庆联合丽格科技有限公司
- **ICP备案：** 渝ICP备2024023473号
- **备案链接：** https://beian.miit.gov.cn/
- **地址：** 重庆市渝中区临江支路28号
- **邮箱：** yuxiaodong@beaucare.org
- **电话：** 023-63326559

---

## 三、设计系统 - Design Tokens

### 3.1 色彩系统

#### 主色调（温暖中性色）

```css
--color-cream: #F8F6F3;           /* 米白 - 主背景 */
--color-taupe: #E8DDD0;           /* 浅驼色 - 辅助背景 */
--color-mint: #D4E8E0;            /* 薄荷绿 - 清新点缀 */
--color-lavender: #E6E0F0;        /* 淡紫 - 柔和点缀 */
--color-rose-gold: #D4A69C;       /* 玫瑰金 - 强调色 */
--color-rose-gold-dark: #C9968A;  /* 深玫瑰金 - 渐变用 */
```

#### 品牌色（专业信任色）

```css
--color-brand-blue: #4A6B8A;      /* 品牌蓝 - 主要信任色 */
--color-brand-blue-light: #6B8AA8; /* 浅品牌蓝 */
--color-brand-blue-dark: #2A4B6A; /* 深品牌蓝 */
```

#### 功能色

```css
--color-success: #7FC8A9;         /* 成功 - 柔和绿 */
--color-warning: #F4C790;         /* 警告 - 柔和橙 */
--color-error: #E8A5A5;           /* 错误 - 柔和红 */
--color-info: #A5C7E8;            /* 信息 - 柔和蓝 */
```

#### 文字色

```css
--color-text-primary: #3A3A3A;    /* 主文字 */
--color-text-secondary: #6B6B6B;  /* 次要文字 */
--color-text-tertiary: #9B9B9B;   /* 辅助文字 */
--color-text-white: #FFFFFF;      /* 白色文字 */
```

#### 背景与边框

```css
--color-bg-primary: #FFFFFF;      /* 主背景 */
--color-bg-secondary: #F8F6F3;    /* 次要背景 */
--color-bg-tertiary: #E8DDD0;     /* 三级背景 */
--color-border-light: rgba(232, 221, 208, 0.3); /* 轻边框 */
--color-border-medium: rgba(74, 107, 138, 0.2); /* 中边框 */
```

### 3.2 字体系统

#### 字体家族

```css
--font-primary: 'Inter', 'PingFang SC', 'Hiragino Sans GB',
                'Microsoft YaHei', sans-serif;
--font-heading: 'Plus Jakarta Sans', 'Source Han Sans CN', sans-serif;
--font-mono: 'SF Mono', 'Monaco', 'Cascadia Code', monospace;
```

#### 字重

```css
--font-weight-light: 300;         /* 正文、标题 */
--font-weight-normal: 400;        /* 按钮、强调 */
--font-weight-medium: 500;        /* 重要信息 */
--font-weight-semibold: 600;      /* 特殊标题（谨慎使用） */
```

#### 字号层级

```css
--font-size-xs: 0.75rem;          /* 12px - 标签 */
--font-size-sm: 0.875rem;         /* 14px - 辅助文字 */
--font-size-base: 1rem;           /* 16px - 正文基准 */
--font-size-lg: 1.125rem;         /* 18px - 大正文 */
--font-size-xl: 1.25rem;          /* 20px - 小标题 */
--font-size-2xl: 1.5rem;          /* 24px - 中标题 */
--font-size-3xl: 1.875rem;        /* 30px - 大标题 */
--font-size-4xl: 2.25rem;         /* 36px - 超大标题 */
--font-size-5xl: 3rem;            /* 48px - Hero标题 */
```

#### 行高

```css
--line-height-tight: 1.3;         /* 标题 */
--line-height-normal: 1.6;        /* 正文 */
--line-height-relaxed: 1.8;       /* 舒适阅读 */
--line-height-loose: 2;           /* 极度舒适 */
```

#### 字间距

```css
--letter-spacing-tight: -0.01em;  /* 紧凑 */
--letter-spacing-normal: 0;       /* 正常 */
--letter-spacing-wide: 0.02em;    /* 正文（通透感） */
--letter-spacing-wider: 0.05em;   /* 标题、按钮 */
```

### 3.3 间距系统（8px基准）

```css
--spacing-xs: 0.5rem;             /* 8px */
--spacing-sm: 1rem;               /* 16px */
--spacing-md: 1.5rem;             /* 24px */
--spacing-lg: 2.5rem;             /* 40px */
--spacing-xl: 4rem;               /* 64px */
--spacing-2xl: 6rem;              /* 96px */
--spacing-3xl: 8rem;              /* 128px */
```

### 3.4 圆角系统

```css
--radius-sm: 8px;                 /* 小元素 */
--radius-md: 16px;                /* 中等元素 */
--radius-lg: 24px;                /* 大元素 */
--radius-xl: 32px;                /* 超大元素 */
--radius-2xl: 40px;               /* Hero区域 */
--radius-pill: 999px;             /* 胶囊型 */
--radius-circle: 50%;             /* 圆形 */
```

### 3.5 阴影系统

```css
--shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.04);
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 32px rgba(74, 107, 138, 0.12);
--shadow-xl: 0 12px 48px rgba(74, 107, 138, 0.15);
--shadow-glow-rose: 0 0 24px rgba(212, 166, 156, 0.15);
--shadow-glow-mint: 0 0 24px rgba(212, 232, 224, 0.2);
```

### 3.6 过渡动画

```css
--transition-fast: 150ms ease;
--transition-base: 300ms ease;
--transition-slow: 500ms ease;
--transition-bounce: 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
--transition-smooth: 600ms cubic-bezier(0.4, 0, 0.2, 1);
```

### 3.7 层级（z-index）

```css
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-modal-backdrop: 900;
--z-modal: 1000;
--z-toast: 1100;
--z-tooltip: 1200;
```

---

## 四、组件设计规范

### 4.1 按钮组件

#### Primary Button（主按钮）
- **背景：** 玫瑰金渐变 `linear-gradient(135deg, #D4A69C, #C9968A)`
- **文字：** 白色，字重400
- **圆角：** `--radius-pill`
- **内边距：** 0.875rem 2rem
- **阴影：** `--shadow-sm`
- **悬停：** scale(1.02) + `--shadow-glow-rose`
- **激活：** scale(0.98)
- **过渡：** `--transition-base`

#### Secondary Button（次按钮）
- **背景：** 透明
- **边框：** 1px solid `--color-taupe`
- **文字：** `--color-brand-blue`，字重400
- **圆角：** `--radius-pill`
- **悬停：** 背景变为 `--color-cream`

#### Ghost Button（文本按钮）
- **背景：** 透明
- **文字：** `--color-brand-blue`
- **下划线：** 悬停时从左滑入，颜色`--color-rose-gold`
- **过渡：** `--transition-base`

#### Icon Button（图标按钮）
- **尺寸：** 40px × 40px
- **圆角：** `--radius-md`
- **图标：** Phosphor Icons，24px
- **悬停：** 背景 `--color-cream`

### 4.2 卡片组件

#### Content Card（内容卡片）
```css
background: white;
border: 1px solid var(--color-border-light);
border-radius: var(--radius-lg);
padding: 2rem;
box-shadow: var(--shadow-sm);
transition: var(--transition-base);
```
**悬停：** `translateY(-4px)` + `--shadow-md`

#### Glass Card（玻璃态卡片）
```css
background: rgba(248, 246, 243, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.5);
border-radius: var(--radius-lg);
box-shadow: var(--shadow-sm);
```

#### Gradient Card（渐变卡片）
```css
background: linear-gradient(135deg,
  var(--color-mint),
  var(--color-lavender));
border-radius: var(--radius-lg);
padding: 2.5rem;
```

#### Treatment Card（医美项目卡片）
- **结构：** 图片 + 标题 + 描述 + 价格 + 按钮
- **图片圆角：** `--radius-md`
- **价格颜色：** `--color-rose-gold`
- **悬停：** 整体上移 + 图片轻微放大

### 4.3 输入组件

#### Text Input
```css
background: white;
border: 1px solid var(--color-border-light);
border-radius: var(--radius-md);
padding: 1rem 1.25rem;
font-size: var(--font-size-base);
font-weight: 300;
transition: var(--transition-base);
```
**聚焦：** 边框变为 `--color-mint` + 外发光

#### Textarea
- 最小高度：120px
- 可调整大小（垂直）

#### Select
- 自定义箭头（Phosphor Icons）
- 悬停背景：`--color-cream`

#### Radio/Checkbox
- 自定义样式
- 选中颜色：`--color-rose-gold`
- 圆角：`--radius-sm`

### 4.4 导航组件

#### Header
```css
background: white;
height: 80px;
box-shadow: var(--shadow-xs);
position: sticky;
top: 0;
z-index: var(--z-sticky);
backdrop-filter: blur(8px); /* 滚动时 */
```

**Logo区域：**
- Logo图片 + "联合丽格"文字
- 文字颜色：`--color-brand-blue`
- 字重：300

**导航链接：**
- 字重：300
- 字号：0.95rem
- 间距：3rem
- 悬停：颜色变`--color-brand-blue` + 底部玫瑰金下划线

**CTA按钮：**
- Primary Button样式
- 文字："立即咨询"

#### Footer
```css
background: linear-gradient(180deg, #2A3F54, #1F2D3D);
padding: 4rem 0;
color: white;
```

**布局：** 三栏（Logo+描述 | 快速链接 | 联系信息）

**联系信息：**
- Phosphor Icons + 文字
- 图标颜色：`--color-rose-gold`

**底部栏：**
- 背景：`#1A2332`
- 内容：公司信息 + ICP备案（带链接）
- 字号：0.875rem
- 颜色：rgba(255,255,255,0.6)

### 4.5 特殊医疗组件

#### GAGS评分系统
- **容器：** Glass Card
- **部位选择：** 圆形按钮组
- **等级选择器：** 1-4等级，选中时玫瑰金高亮
- **分数显示：** 大字号，渐变色
- **结果卡片：** 根据严重程度变色
  - 轻度（0-18）：薄荷绿背景
  - 中度（19-30）：淡紫背景
  - 重度（31-38）：浅珊瑚色背景
  - 极重度（>38）：浅玫瑰金背景

#### 症状对照库
- **布局：** 网格2列（移动端1列）
- **卡片：** 图片 + 文字
- **图片圆角：** `--radius-lg`
- **悬停：** scale(1.05)

#### 智能决策树
- **样式：** 聊天气泡
- **用户选择：** 右侧，薄荷绿背景
- **系统回复：** 左侧，白色背景
- **进度条：** 顶部，玫瑰金色

---

## 五、布局设计

### 5.1 Hero区域

```
高度：70vh（移动端50vh）
背景：linear-gradient(135deg,
  var(--color-cream),
  var(--color-taupe))
布局：左文字（60%）+ 右图片（40%）
```

**左侧内容：**
- H1标题：超大字号（3rem），字重300，品牌蓝
- 副标题：1.25rem，玫瑰金色
- 描述：行高1.8，字间距0.02em
- CTA按钮组：主按钮 + 次按钮

**右侧图片：**
- 圆角：`--radius-2xl`
- 阴影：`--shadow-lg`

**装饰元素：**
- 抽象圆形渐变背景（薄荷绿、淡紫）
- 位置：绝对定位，低z-index

### 5.2 内容区块

**标准区块：**
```css
padding: var(--spacing-2xl) 0;
max-width: 1280px;
margin: 0 auto;
```

**交替背景：**
- 奇数区块：白色
- 偶数区块：米白色

**区块标题：**
- 居中对齐
- 字号：2.25rem
- 字重：300
- 颜色：品牌蓝
- 下方装饰线：玫瑰金，4px粗，80px长

### 5.3 响应式断点

```css
/* Mobile */
@media (max-width: 639px) {
  --container-padding: 1rem;
  --section-spacing: var(--spacing-xl);
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  --container-padding: 2rem;
  --section-spacing: var(--spacing-2xl);
}

/* Desktop */
@media (min-width: 1024px) {
  --container-padding: 2rem;
  --section-spacing: var(--spacing-3xl);
}

/* Wide */
@media (min-width: 1440px) {
  --container-padding: 3rem;
}
```

---

## 六、图标系统

### 6.1 图标库选择

**主图标库：** Phosphor Icons
**CDN：** `https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css`

**风格选择：**
- Regular（常规）- 主要使用
- Light（轻量）- 大尺寸图标
- Bold（粗体）- 强调元素

### 6.2 图标使用规范

**尺寸：**
- 小：16px（行内图标）
- 中：24px（按钮、卡片）
- 大：32px（功能区图标）
- 超大：48px（Hero区域）

**颜色：**
- 默认：继承文字色
- 强调：`--color-rose-gold`
- 品牌：`--color-brand-blue`
- 成功/警告/错误：对应功能色

**自定义SVG图标：**
- 医美项目图标（8个）
- 症状类型图标（6个）
- 治疗步骤图标（4个）

---

## 七、动画与微交互

### 7.1 页面加载动画

```javascript
// 元素依次淡入上移
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Stagger效果
.animate-item:nth-child(1) { animation-delay: 0ms; }
.animate-item:nth-child(2) { animation-delay: 100ms; }
.animate-item:nth-child(3) { animation-delay: 200ms; }
```

### 7.2 悬停效果

**按钮：**
```css
transition: all var(--transition-base);
&:hover {
  transform: scale(1.02);
  box-shadow: var(--shadow-glow-rose);
}
```

**卡片：**
```css
&:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
```

**图片：**
```css
overflow: hidden;
img {
  transition: transform var(--transition-slow);
  &:hover {
    transform: scale(1.05);
  }
}
```

### 7.3 滚动动画

使用 Intersection Observer：
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.1 });
```

### 7.4 加载状态

**骨架屏（Shimmer效果）：**
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-cream) 0%,
    var(--color-taupe) 50%,
    var(--color-cream) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```

---

## 八、SEO优化

### 8.1 Meta标签增强

```html
<!-- 基础SEO -->
<title>痘痘再见 - 专业痤疮治疗解决方案 | 联合丽格西南中心</title>
<meta name="description" content="联合丽格西南中心提供专业痤疮治疗方案，AI智能诊断、GAGS评分系统、透明价格、真实案例。科学祛痘，重获自信。">
<meta name="keywords" content="痤疮治疗,祛痘,医美,激光祛痘,果酸焕肤,痘坑修复,联合丽格,重庆">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:title" content="痘痘再见 - 专业痤疮治疗 | 联合丽格">
<meta property="og:description" content="科学祛痘，重获自信。专业医美团队，透明价格，真实效果。">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="痘痘再见 - 专业痤疮治疗">
<meta name="twitter:description" content="科学祛痘，重获自信。">
<meta name="twitter:image" content="https://example.com/twitter-image.jpg">

<!-- 其他 -->
<link rel="canonical" href="https://example.com">
<meta name="robots" content="index, follow">
<meta name="author" content="重庆联合丽格科技有限公司">
```

### 8.2 结构化数据（JSON-LD）

```json
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "联合丽格西南中心",
  "description": "专业痤疮治疗医美中心",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "临江支路28号",
    "addressLocality": "渝中区",
    "addressRegion": "重庆市",
    "addressCountry": "CN"
  },
  "telephone": "023-63326559",
  "email": "yuxiaodong@beaucare.org",
  "url": "https://example.com",
  "sameAs": [
    "https://weixin.qq.com/..."
  ]
}
```

### 8.3 语义化HTML

- 使用 `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- h1-h6层级清晰（每页一个h1）
- 图片alt文本完整描述
- 链接文本有意义（避免"点击这里"）

### 8.4 性能优化

- 图片lazy loading：`<img loading="lazy">`
- 关键CSS内联
- 字体preload：`<link rel="preload" href="font.woff2" as="font">`
- 资源压缩：Gzip/Brotli
- CDN加速

---

## 九、实施策略

### 9.1 分阶段实施

**Phase 1: 设计系统基础**
- 创建 `design-system.css`（所有CSS变量）
- 引入Phosphor Icons
- 设置基础排版

**Phase 2: 核心组件**
- 按钮、卡片、输入框组件
- Header和Footer
- 通用布局容器

**Phase 3: 页面重构**
- index.html重新设计
- Hero区域
- 核心功能区块

**Phase 4: 特殊组件**
- GAGS评分系统
- 智能决策树
- 症状对照库

**Phase 5: 电子书页面**
- ebook.html重新设计
- 保持风格一致

**Phase 6: 优化与测试**
- 动画与微交互
- 响应式测试
- SEO优化
- 性能优化

### 9.2 技术栈

- **纯CSS**：无需CSS框架，手写所有样式
- **Vanilla JavaScript**：保持现有架构
- **Phosphor Icons**：Web Font图标
- **字体**：Google Fonts（Inter, Plus Jakarta Sans）

### 9.3 浏览器兼容

- Chrome/Edge：最新版 + 前2个版本
- Safari：最新版 + 前2个版本
- Firefox：最新版 + 前2个版本
- 移动端：iOS 13+, Android 8+

---

## 十、设计交付物

### 10.1 代码文件

```
/root/claude/acne/
├── css/
│   └── design-system.css        # 设计系统变量
├── index.html                   # 重新设计的主页
├── ebook.html                   # 重新设计的电子书页
├── assets/
│   ├── logo.png                 # 品牌Logo
│   ├── favicon.png              # 网站图标
│   └── icons/                   # 自定义SVG图标
└── docs/
    └── design-guide.md          # 设计使用指南
```

### 10.2 文档

- 设计系统文档（本文档）
- 组件使用指南
- 响应式测试清单
- SEO检查清单

---

## 十一、成功指标

### 视觉质量指标
- ✅ 配色符合女性审美
- ✅ 排版舒适易读（行高1.8+）
- ✅ 留白充足（间距体系一致）
- ✅ 动画流畅自然

### 技术指标
- ✅ Lighthouse性能分数 > 90
- ✅ 首屏加载 < 2s
- ✅ 移动端适配完美
- ✅ 所有浏览器兼容

### SEO指标
- ✅ 所有meta标签完整
- ✅ 结构化数据正确
- ✅ 语义化HTML
- ✅ sitemap和robots.txt

### 用户体验指标
- ✅ 点击目标 > 44px（移动端）
- ✅ 对比度符合WCAG AA标准
- ✅ 表单易用（清晰反馈）
- ✅ 导航清晰直观

---

## 附录

### A. 配色参考

**主色板预览：**
- 米白 #F8F6F3 ██████
- 浅驼色 #E8DDD0 ██████
- 薄荷绿 #D4E8E0 ██████
- 淡紫 #E6E0F0 ██████
- 玫瑰金 #D4A69C ██████
- 品牌蓝 #4A6B8A ██████

### B. 参考资源

- Phosphor Icons: https://phosphoricons.com/
- Google Fonts: https://fonts.google.com/
- CSS变量指南: https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- Intersection Observer: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

### C. 灵感来源

- 医美行业领先网站
- 现代女性健康平台
- 高端SaaS产品设计
- 日本极简美学

---

**设计签名：** Claude Sonnet 4.5
**版本：** v1.0
**最后更新：** 2026-01-08
