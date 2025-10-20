# 痘痘诊疗指南 - 专业医美治疗网站

> 联合丽格西南中心 | 重庆联合丽格第五医疗美容医院

## 📖 项目简介

专业的痤疮诊疗指南网站，包含15万字专业内容、真实医美项目价格、智能搜索和分类专题。

## ✨ 核心功能

- 📚 21个专业章节
- 💰 真实价格透明（8单品+5套餐）
- 🔍 智能搜索系统
- 📂 6大分类专题
- 🧪 GAGS自测工具
- 💵 费用计算器
- 📊 方案对比系统
- 📱 移动端优化

## 🚀 快速开始

### 方式一：Docker部署（推荐）⭐

```bash
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment
docker compose up -d
```

访问 http://localhost:8080

**详细部署文档**: [README-DEPLOYMENT.md](./README-DEPLOYMENT.md)

### 方式二：本地运行

```bash
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment
python3 -m http.server 10188
```

访问 http://localhost:10188

## 📁 项目结构

- index.html - 主页（4,796行）
- treatments.html - 价格表
- *.md - 21个章节
- icons/ - SVG图标库（35个）
- acnelist.xlsx - 数据源

## 💊 医美项目

**单品**: ¥99-¥4580
**套餐**: ¥980-¥8800

## 🐳 Docker部署

支持一键Docker部署，包含：
- ✅ Nginx高性能服务器
- ✅ Gzip压缩优化
- ✅ 静态资源缓存
- ✅ PWA离线支持
- ✅ 健康检查
- ✅ 资源限制

**快速部署命令**:
```bash
docker compose up -d
```

**完整文档**: [Docker部署指南](./README-DEPLOYMENT.md)

## 📱 联系方式

- 📞 023-63326559
- 📧 yuxiaodong@beaucare.org
- 💬 @sooogooo

---

© 2025 重庆联合丽格第五医疗美容医院
