# SEO优化说明文档

## 已实现的SEO功能

### 1. Meta标签优化

#### 基础Meta标签
- ✅ `<title>` - 优化标题，包含核心关键词
- ✅ `<meta name="description">` - 150字左右的网站描述
- ✅ `<meta name="keywords">` - 核心关键词列表
- ✅ `<meta name="author">` - 作者信息
- ✅ `<meta name="robots">` - 搜索引擎索引指令
- ✅ `<link rel="canonical">` - 规范化URL

#### Open Graph标签（社交媒体分享）
用于Facebook、LinkedIn等平台的分享优化：
- `og:type` - 网站类型
- `og:url` - 网站URL
- `og:title` - 分享标题
- `og:description` - 分享描述
- `og:image` - 分享图片（需要准备og-image.png）
- `og:locale` - 语言区域
- `og:site_name` - 网站名称

#### Twitter Card标签
用于Twitter平台的分享优化：
- `twitter:card` - 卡片类型（summary_large_image）
- `twitter:title` - 分享标题
- `twitter:description` - 分享描述
- `twitter:image` - 分享图片（需要准备twitter-image.png）

#### 移动端优化
- `apple-mobile-web-app-capable` - 支持添加到主屏幕
- `apple-mobile-web-app-status-bar-style` - 状态栏样式
- `format-detection` - 禁用自动电话号码检测

### 2. 结构化数据（Schema.org JSON-LD）

#### MedicalBusiness结构化数据
告诉搜索引擎这是一个医疗机构：
```json
{
  "@type": "MedicalBusiness",
  "name": "联合丽格西南中心",
  "medicalSpecialty": ["Dermatology", "CosmeticSurgery"],
  "availableService": [...]
}
```

#### WebSite结构化数据
定义网站的搜索功能：
```json
{
  "@type": "WebSite",
  "name": "痘痘再见 - 联合丽格痤疮治疗指南",
  "potentialAction": {
    "@type": "SearchAction"
  }
}
```

### 3. Sitemap（网站地图）

**文件**: `sitemap.xml`

包含所有重要页面和章节：
- 首页（priority: 1.0）
- 治疗项目（priority: 0.9）
- 在线预约（priority: 0.9）
- GAGS评分系统（priority: 0.8）
- 治疗决策树（priority: 0.8）
- 案例展示、FAQ、术后护理等（priority: 0.7）

**更新频率**：
- 首页、案例：weekly
- 其他页面：monthly

### 4. Robots.txt（搜索引擎爬虫指令）

**文件**: `robots.txt`

配置内容：
- 允许所有搜索引擎索引
- 指定sitemap位置
- 针对国内外主流搜索引擎优化（Google、百度、搜狗、360、必应）
- 设置爬虫速率限制（1秒）

## 需要准备的资源文件

### 必需图片资源

1. **favicon.png** (32x32 或 64x64)
   - 网站图标
   - 显示在浏览器标签页

2. **apple-touch-icon.png** (180x180)
   - iOS添加到主屏幕的图标
   - 建议尺寸：180x180px

3. **og-image.png** (1200x630)
   - Open Graph分享图片
   - Facebook、LinkedIn等平台分享时显示
   - 建议尺寸：1200x630px
   - 内容建议：网站logo + 核心标语

4. **twitter-image.png** (1200x675)
   - Twitter分享图片
   - 建议尺寸：1200x675px（16:9比例）

5. **logo.png**
   - 网站主logo
   - 用于结构化数据

## 需要修改的配置

### 更新URL
请将所有 `https://acne.yoursite.com/` 替换为实际域名：

**修改位置**：
1. `index.html` 中的所有meta标签
2. `sitemap.xml` 中的所有`<loc>`标签
3. `robots.txt` 中的Sitemap行

**查找替换命令**（Linux/Mac）：
```bash
sed -i 's|https://acne.yoursite.com|https://your-actual-domain.com|g' index.html
sed -i 's|https://acne.yoursite.com|https://your-actual-domain.com|g' sitemap.xml
sed -i 's|https://acne.yoursite.com|https://your-actual-domain.com|g' robots.txt
```

### 更新联系信息

在 `index.html` 的MedicalBusiness结构化数据中，更新：
- `telephone`: 400热线电话号码
- `address`: 实际医院地址

## SEO检测工具推荐

### 国际工具
1. **Google Search Console** - 提交sitemap、监控索引状态
   - https://search.google.com/search-console

2. **Google Rich Results Test** - 测试结构化数据
   - https://search.google.com/test/rich-results

3. **Facebook Sharing Debugger** - 测试Open Graph标签
   - https://developers.facebook.com/tools/debug/

4. **Twitter Card Validator** - 测试Twitter Card
   - https://cards-dev.twitter.com/validator

### 国内工具
1. **百度搜索资源平台** - 提交sitemap
   - https://ziyuan.baidu.com

2. **搜狗站长平台**
   - http://zhanzhang.sogou.com

3. **360站长平台**
   - http://zhanzhang.so.com

## 核心关键词策略

### 主关键词（高竞争）
- 痤疮治疗
- 痘痘治疗
- 祛痘
- 痘坑修复

### 长尾关键词（低竞争、高转化）
- 激光祛痘多少钱
- 果酸焕肤效果
- 光动力治疗痤疮
- GAGS评分系统
- 痤疮严重程度评估
- 医美祛痘项目
- 痘坑修复方法

### 地域关键词
- 成都痤疮治疗
- 四川痘痘医院
- 联合丽格西南中心

## 提交到搜索引擎

### Google
```bash
# 提交sitemap到Google Search Console
1. 访问 https://search.google.com/search-console
2. 添加网站
3. 提交sitemap: https://your-domain.com/sitemap.xml
```

### 百度
```bash
# 提交sitemap到百度站长平台
1. 访问 https://ziyuan.baidu.com
2. 站点管理 > 添加网站
3. 数据引入 > 链接提交 > sitemap
```

## 性能优化建议

1. **启用HTTPS** - 搜索引擎优先索引HTTPS网站
2. **压缩图片** - 使用WebP格式，减小文件大小
3. **启用Gzip/Brotli压缩** - 减少传输大小
4. **CDN加速** - 提升国内外访问速度
5. **缓存策略** - 设置合理的浏览器缓存

## 下一步优化方向

1. **内容更新** - 定期更新sitemap的lastmod日期
2. **添加面包屑导航** - 提升用户体验和SEO
3. **内链优化** - 在文章中添加相关内链
4. **外链建设** - 获取高质量外部链接
5. **移动端优化** - 确保移动端体验良好（已基本完成）
6. **页面加载速度** - 优化到3秒内

## 监控指标

### 关键指标
- **索引量** - 被搜索引擎收录的页面数量
- **关键词排名** - 核心关键词在搜索结果中的位置
- **自然流量** - 来自搜索引擎的访问量
- **跳出率** - 用户打开页面后立即离开的比例
- **平均停留时间** - 用户在网站的平均浏览时长

### 追踪工具
- Google Analytics（国际）
- 百度统计（国内）
- CNZZ统计（国内）

---

📝 **注意事项**：
- SEO是长期工程，通常需要3-6个月才能看到明显效果
- 内容质量是SEO的核心，技术优化是辅助
- 定期更新内容，保持网站活跃度
- 避免黑帽SEO手段（关键词堆砌、隐藏文本等）
