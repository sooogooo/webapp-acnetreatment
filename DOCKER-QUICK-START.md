# 🐳 Docker快速启动指南

> 1分钟快速部署痤疮治疗科普网站

---

## ⚡ 快速开始

```bash
# 克隆项目
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment

# 一键启动
docker compose up -d

# 访问应用
# 浏览器打开: http://localhost:8080
```

---

## 📋 常用命令

### 启动服务
```bash
docker compose up -d              # 后台启动
docker compose up                 # 前台启动（查看日志）
```

### 停止服务
```bash
docker compose stop               # 停止（保留容器）
docker compose down               # 停止并删除容器
```

### 重启服务
```bash
docker compose restart            # 重启
docker compose up -d --build      # 重新构建并启动
```

### 查看状态
```bash
docker compose ps                 # 查看运行状态
docker compose logs               # 查看日志
docker compose logs -f            # 实时查看日志
docker compose logs --tail=100    # 查看最后100行
```

### 更新应用
```bash
git pull origin main              # 拉取最新代码
docker compose up -d --build      # 重新构建并启动
```

### 清理资源
```bash
docker compose down -v            # 停止并删除所有资源
docker system prune -a            # 清理所有未使用的Docker资源
```

---

## 🔧 配置修改

### 修改端口（默认8080）

编辑 `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # 修改为你想要的端口
```

### 修改资源限制

编辑 `docker-compose.yml`:
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'    # CPU限制
      memory: 512M   # 内存限制
```

### 修改Nginx配置

编辑 `nginx.conf` 后重新构建:
```bash
docker compose up -d --build
```

---

## 🛠️ 故障排查

### 端口被占用
```bash
# 查看占用端口的进程
sudo lsof -i :8080

# 或修改docker-compose.yml中的端口
```

### 查看容器日志
```bash
docker compose logs -f acne-webapp
```

### 进入容器调试
```bash
docker compose exec acne-webapp sh
```

### 重置容器
```bash
docker compose down
docker compose up -d --build
```

---

## 📊 验证部署

### 检查健康状态
```bash
docker inspect --format='{{.State.Health.Status}}' acne-treatment-webapp
```

### 测试HTTP响应
```bash
curl -I http://localhost:8080
```

### 查看资源使用
```bash
docker stats acne-treatment-webapp
```

---

## 🌐 生产部署

### 使用自定义域名
需要配置反向代理（Nginx/Traefik）和SSL证书

详见: [完整部署文档](./README-DEPLOYMENT.md#生产环境部署)

### HTTPS配置
推荐使用Let's Encrypt + Nginx反向代理

详见: [HTTPS配置](./README-DEPLOYMENT.md#使用https-推荐使用反向代理)

---

## 📚 完整文档

- [详细部署指南](./README-DEPLOYMENT.md) - 完整的Docker部署文档
- [项目README](./README.md) - 项目介绍和功能说明

---

## 💡 提示

- 首次启动需要下载镜像（~40MB）
- 内存占用约128MB
- 启动时间<10秒
- 支持PWA离线访问
- 自动Gzip压缩
- 静态资源缓存30天

---

## 🆘 获取帮助

- GitHub Issues: https://github.com/sooogooo/webapp-acnetreatment/issues
- 完整文档: [README-DEPLOYMENT.md](./README-DEPLOYMENT.md)

---

**最后更新**: 2025-10-20
