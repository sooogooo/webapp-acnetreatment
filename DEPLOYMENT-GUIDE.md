# 🚀 痤疮治疗科普网站 - 完整部署指南

> 一站式部署文档，涵盖本地开发、Docker部署、云服务器部署等所有场景

---

## 📚 目录

- [快速开始](#快速开始)
- [部署方式选择](#部署方式选择)
- [方式1：本地开发部署](#方式1本地开发部署)
- [方式2：Docker部署（推荐）](#方式2docker部署推荐)
- [方式3：云服务器部署](#方式3云服务器部署)
- [方式4：静态网站托管](#方式4静态网站托管)
- [域名和HTTPS配置](#域名和https配置)
- [性能优化](#性能优化)
- [监控和维护](#监控和维护)
- [常见问题排查](#常见问题排查)
- [进阶配置](#进阶配置)

---

## 快速开始

### 最快速部署（2分钟）

```bash
# 1. 克隆项目
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment

# 2. 选择部署方式

# 方式A：Docker（推荐）
docker compose up -d
# 访问 http://localhost:8081

# 方式B：Python本地服务器
python3 -m http.server 8080
# 访问 http://localhost:8080

# 方式C：直接打开
# 直接用浏览器打开 index.html
```

---

## 部署方式选择

| 部署方式 | 适用场景 | 难度 | 性能 | 推荐度 |
|---------|---------|-----|------|--------|
| **本地开发** | 开发测试、快速预览 | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Docker** | 生产环境、团队协作 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **云服务器** | 正式上线、高可用 | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **静态托管** | 免费方案、快速上线 | ⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 方式1：本地开发部署

### 1.1 使用Python HTTP服务器

**适用于**: 快速本地测试、开发环境

```bash
# Python 3
python3 -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

访问: http://localhost:8080

### 1.2 使用Node.js服务器

**安装http-server**:
```bash
npm install -g http-server
```

**启动服务**:
```bash
http-server -p 8080 -c-1
```

### 1.3 使用PHP内置服务器

```bash
php -S localhost:8080
```

### 1.4 使用VS Code Live Server插件

1. 安装 "Live Server" 插件
2. 右键 `index.html` → "Open with Live Server"
3. 自动在浏览器打开，支持热更新

**优点**:
- ✅ 零配置
- ✅ 快速启动
- ✅ 适合开发

**缺点**:
- ❌ 不适合生产环境
- ❌ 性能较低
- ❌ 缺少缓存和压缩

---

## 方式2：Docker部署（推荐）

### 2.1 为什么选择Docker？

- ✅ **一致性**: 开发、测试、生产环境完全一致
- ✅ **隔离性**: 不影响主机系统
- ✅ **可移植**: 一次构建，到处运行
- ✅ **高性能**: Nginx优化，Gzip压缩
- ✅ **易维护**: 一键更新，快速回滚

### 2.2 前置要求

- Docker 20.10+
- Docker Compose 1.29+ (或 Docker Compose V2)

**安装Docker** (Ubuntu/Debian):
```bash
# 快速安装脚本
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 添加当前用户到docker组（可选）
sudo usermod -aG docker $USER
newgrp docker

# 验证安装
docker --version
docker compose version
```

**其他系统**:
- **CentOS/RHEL**: 见 [README-DEPLOYMENT.md](./README-DEPLOYMENT.md#安装docker)
- **macOS**: `brew install --cask docker`
- **Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop)

### 2.3 Docker Compose部署（推荐）

**步骤1: 克隆项目**
```bash
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment
```

**步骤2: 启动服务**
```bash
# 后台启动
docker compose up -d

# 前台启动（查看日志）
docker compose up

# 仅构建镜像
docker compose build
```

**步骤3: 验证部署**
```bash
# 查看容器状态
docker compose ps

# 查看日志
docker compose logs -f

# 健康检查
docker inspect --format='{{.State.Health.Status}}' acne-treatment-webapp

# 测试HTTP响应
curl -I http://localhost:8081
```

**步骤4: 访问应用**
- 浏览器打开: http://localhost:8081
- 局域网访问: http://YOUR_IP:8081

### 2.4 常用Docker命令

```bash
# === 启动和停止 ===
docker compose up -d              # 后台启动
docker compose stop               # 停止（保留容器）
docker compose down               # 停止并删除容器
docker compose restart            # 重启

# === 查看状态 ===
docker compose ps                 # 查看运行状态
docker compose logs               # 查看所有日志
docker compose logs -f            # 实时查看日志
docker compose logs --tail=100    # 查看最后100行

# === 更新应用 ===
git pull origin main              # 拉取最新代码
docker compose up -d --build      # 重新构建并启动

# === 进入容器 ===
docker compose exec acne-webapp sh   # 进入容器调试

# === 资源清理 ===
docker compose down -v            # 删除容器和卷
docker system prune -a            # 清理所有未使用资源
```

### 2.5 配置文件说明

**docker-compose.yml** - 服务编排配置:
```yaml
services:
  acne-webapp:
    build: .
    container_name: acne-treatment-webapp
    ports:
      - "8081:80"          # 端口映射：主机端口:容器端口
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai   # 时区配置
    healthcheck:           # 健康检查
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:           # 资源限制
        limits:
          cpus: '0.5'
          memory: 256M
```

**Dockerfile** - 镜像构建配置:
```dockerfile
FROM nginx:alpine      # 基于轻量级Alpine镜像
COPY . /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

**nginx.conf** - Nginx服务器配置:
- Gzip压缩（减少传输大小）
- 静态资源缓存（30天）
- 安全头部配置
- Service Worker支持

### 2.6 自定义配置

**修改端口**:
编辑 `docker-compose.yml`:
```yaml
ports:
  - "3000:80"  # 修改为你想要的端口
```

**修改资源限制**:
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'      # CPU限制
      memory: 512M     # 内存限制
```

**修改时区**:
```yaml
environment:
  - TZ=America/New_York  # 修改为所需时区
```

---

## 方式3：云服务器部署

### 3.1 阿里云ECS部署

**步骤1: 购买ECS实例**
- 操作系统: Ubuntu 20.04/22.04 LTS
- 规格: 1核2G（最低配置）
- 带宽: 1M（够用）

**步骤2: 安全组配置**
开放端口:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 8081 (应用端口，可选)

**步骤3: 连接服务器**
```bash
ssh root@YOUR_SERVER_IP
```

**步骤4: 安装Docker**
```bash
# 更新系统
apt-get update && apt-get upgrade -y

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 启动Docker
systemctl start docker
systemctl enable docker
```

**步骤5: 部署应用**
```bash
# 克隆项目
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment

# 启动服务
docker compose up -d

# 查看状态
docker compose ps
```

**步骤6: 配置防火墙**
```bash
# UFW防火墙
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 3.2 腾讯云轻量应用服务器部署

**应用镜像选择**: Docker CE

**一键部署脚本**:
```bash
#!/bin/bash
# 自动部署脚本

# 克隆项目
cd /opt
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment

# 启动服务
docker compose up -d

# 设置开机自启
cat > /etc/systemd/system/acne-webapp.service <<EOF
[Unit]
Description=Acne Treatment WebApp
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/webapp-acnetreatment
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down

[Install]
WantedBy=multi-user.target
EOF

systemctl enable acne-webapp.service
systemctl start acne-webapp.service

echo "部署完成！访问 http://$(curl -s ifconfig.me):8081"
```

### 3.3 AWS EC2部署

**AMI选择**: Ubuntu Server 22.04 LTS

**用户数据脚本** (启动时自动执行):
```bash
#!/bin/bash
# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 部署应用
cd /home/ubuntu
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment
docker compose up -d
```

**安全组规则**:
- Type: HTTP, Port: 80, Source: 0.0.0.0/0
- Type: HTTPS, Port: 443, Source: 0.0.0.0/0
- Type: Custom TCP, Port: 8081, Source: 0.0.0.0/0

---

## 方式4：静态网站托管

### 4.1 GitHub Pages（免费）

**步骤1: Fork项目到你的GitHub账号**

**步骤2: 启用GitHub Pages**
- 进入仓库 Settings → Pages
- Source: Deploy from a branch
- Branch: `main` / `root`
- Save

**步骤3: 访问网站**
- https://YOUR_USERNAME.github.io/webapp-acnetreatment/

**优点**:
- ✅ 完全免费
- ✅ 自动HTTPS
- ✅ CDN加速
- ✅ 自动部署

**限制**:
- ⚠️ 仓库必须公开（或GitHub Pro）
- ⚠️ 100GB/月流量限制

### 4.2 Vercel部署（推荐）

**步骤1: 连接GitHub**
- 访问 [vercel.com](https://vercel.com)
- 使用GitHub登录
- Import Project

**步骤2: 选择仓库**
- 选择 `webapp-acnetreatment`
- 保持默认配置
- Deploy

**步骤3: 访问网站**
- 自动分配域名: https://your-project.vercel.app

**优点**:
- ✅ 零配置部署
- ✅ 自动HTTPS
- ✅ 全球CDN
- ✅ Git推送自动部署
- ✅ 免费额度充足

### 4.3 Netlify部署

**步骤1: 创建netlify.toml配置**
```toml
[build]
  publish = "."

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**步骤2: 部署**
```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

或通过Web界面拖拽上传。

### 4.4 Cloudflare Pages

**步骤1: 连接GitHub仓库**
**步骤2: 构建设置**
- Build command: (留空)
- Build output directory: /
- Environment variables: (不需要)

**优点**:
- ✅ 无限带宽
- ✅ 全球CDN
- ✅ 免费SSL

---

## 域名和HTTPS配置

### 5.1 配置自定义域名

**方式A: Nginx反向代理**

**安装Nginx**:
```bash
sudo apt-get install nginx
```

**配置文件** (`/etc/nginx/sites-available/acne.conf`):
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL证书
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 反向代理
    location / {
        proxy_pass http://localhost:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**启用配置**:
```bash
sudo ln -s /etc/nginx/sites-available/acne.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5.2 免费SSL证书（Let's Encrypt）

**安装Certbot**:
```bash
sudo apt-get install certbot python3-certbot-nginx
```

**获取证书**:
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

**自动续期**:
```bash
# 测试自动续期
sudo certbot renew --dry-run

# Certbot会自动添加cron任务
```

### 5.3 Cloudflare CDN加速

**步骤1: 添加网站到Cloudflare**
- 修改域名DNS服务器为Cloudflare

**步骤2: SSL/TLS设置**
- SSL/TLS → Overview → Full (strict)

**步骤3: 性能优化**
- Speed → Optimization → Auto Minify (全选)
- Speed → Optimization → Brotli (开启)
- Caching → Configuration → Browser Cache TTL (1 month)

**优点**:
- ✅ 免费CDN加速
- ✅ 免费SSL证书
- ✅ DDoS防护
- ✅ 缓存优化

---

## 性能优化

### 6.1 已内置优化

本项目Docker镜像已包含:
- ✅ **Gzip压缩**: 文本文件减少70%大小
- ✅ **Brotli压缩**: 比Gzip更优（需Nginx 1.11.3+）
- ✅ **静态资源缓存**: 30天强缓存
- ✅ **HTTP/2**: 多路复用
- ✅ **Service Worker**: PWA离线缓存

### 6.2 CDN加速

**推荐服务**:
1. **Cloudflare** (免费，全球节点)
2. **阿里云CDN** (国内快)
3. **腾讯云CDN** (国内快)
4. **AWS CloudFront**

### 6.3 图片优化

如果添加图片资源:
```bash
# 安装优化工具
npm install -g imagemin-cli

# 压缩图片
imagemin images/* --out-dir=images/optimized
```

### 6.4 数据库优化

本项目为纯静态网站，所有数据存储在localStorage:
- ✅ 无数据库开销
- ✅ 极速响应
- ✅ 无需维护

---

## 监控和维护

### 7.1 日志查看

**Docker日志**:
```bash
# 实时查看
docker compose logs -f

# 查看最近100行
docker compose logs --tail=100

# 查看特定时间
docker compose logs --since 2h

# 导出日志
docker compose logs > app.log
```

**Nginx访问日志**:
```bash
docker compose exec acne-webapp tail -f /var/log/nginx/access.log
```

### 7.2 健康检查

**手动检查**:
```bash
# 检查容器健康状态
docker inspect --format='{{.State.Health.Status}}' acne-treatment-webapp

# 测试HTTP响应
curl -I http://localhost:8081

# 查看资源使用
docker stats acne-treatment-webapp
```

**自动监控**:
```bash
# 使用Uptime Kuma监控
docker run -d \
  --name uptime-kuma \
  -p 3001:3001 \
  -v uptime-kuma:/app/data \
  louislam/uptime-kuma:1
```

### 7.3 自动备份

**备份脚本**:
```bash
#!/bin/bash
# backup.sh - 自动备份脚本

BACKUP_DIR="/backup/acne-webapp"
DATE=$(date +%Y%m%d_%H%M%S)

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份代码
cd /opt/webapp-acnetreatment
tar -czf $BACKUP_DIR/code_$DATE.tar.gz .

# 备份镜像
docker save acne-treatment-webapp:latest | gzip > $BACKUP_DIR/image_$DATE.tar.gz

# 删除7天前的备份
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR"
```

**设置定时任务**:
```bash
# 编辑crontab
crontab -e

# 添加每日凌晨2点自动备份
0 2 * * * /opt/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### 7.4 更新策略

**零停机更新**:
```bash
#!/bin/bash
# update.sh - 零停机更新脚本

cd /opt/webapp-acnetreatment

# 拉取最新代码
git pull origin main

# 构建新镜像
docker compose build

# 滚动更新
docker compose up -d --no-deps --build acne-webapp

# 清理旧镜像
docker image prune -f
```

---

## 常见问题排查

### 8.1 端口被占用

**错误信息**:
```
Error starting userland proxy: listen tcp4 0.0.0.0:8081: bind: address already in use
```

**解决方案**:
```bash
# 查找占用端口的进程
sudo lsof -i :8081
sudo netstat -tunlp | grep 8081

# 杀死进程
sudo kill -9 PID

# 或修改端口
# 编辑 docker-compose.yml 改为其他端口
```

### 8.2 Docker权限问题

**错误信息**:
```
permission denied while trying to connect to the Docker daemon socket
```

**解决方案**:
```bash
# 方式1: 添加用户到docker组
sudo usermod -aG docker $USER
newgrp docker

# 方式2: 使用sudo（不推荐）
sudo docker compose up -d
```

### 8.3 容器启动失败

```bash
# 查看详细日志
docker compose logs

# 查看容器状态
docker compose ps -a

# 检查配置文件
docker compose config

# 重新构建
docker compose build --no-cache
docker compose up -d
```

### 8.4 无法访问网站

**检查清单**:
```bash
# 1. 检查容器是否运行
docker compose ps

# 2. 检查端口映射
docker port acne-treatment-webapp

# 3. 检查防火墙
sudo ufw status
sudo firewall-cmd --list-ports

# 4. 测试本地访问
curl http://localhost:8081

# 5. 检查Nginx日志
docker compose logs acne-webapp
```

### 8.5 内存不足

```bash
# 查看内存使用
free -h
docker stats

# 调整资源限制（docker-compose.yml）
deploy:
  resources:
    limits:
      memory: 128M  # 减少内存限制
```

### 8.6 SSL证书问题

```bash
# 检查证书有效期
sudo certbot certificates

# 手动续期
sudo certbot renew

# 强制续期
sudo certbot renew --force-renewal
```

---

## 进阶配置

### 9.1 负载均衡

**使用Nginx**:
```nginx
upstream acne_backend {
    server localhost:8081;
    server localhost:8082;
    server localhost:8083;
}

server {
    listen 80;
    location / {
        proxy_pass http://acne_backend;
    }
}
```

### 9.2 高可用部署

**Docker Swarm集群**:
```bash
# 初始化Swarm
docker swarm init

# 部署stack
docker stack deploy -c docker-compose.yml acne

# 扩容
docker service scale acne_acne-webapp=3
```

### 9.3 CI/CD自动部署

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/webapp-acnetreatment
            git pull origin main
            docker compose up -d --build
```

### 9.4 安全加固

```bash
# 1. 定期更新基础镜像
docker compose pull
docker compose up -d

# 2. 扫描镜像漏洞
docker scan acne-treatment-webapp:latest

# 3. 使用Docker Secrets
echo "my_secret" | docker secret create db_password -

# 4. 限制容器权限
docker run --read-only --security-opt=no-new-privileges ...

# 5. 使用非root用户
# Dockerfile中添加:
RUN addgroup -g 1001 -S nginx && adduser -u 1001 -S nginx -G nginx
USER nginx
```

---

## 📊 部署检查清单

部署前检查:
- [ ] 服务器资源充足（至少1G内存）
- [ ] 端口未被占用
- [ ] Docker正确安装
- [ ] 域名DNS已配置

部署后检查:
- [ ] 容器正常运行（`docker compose ps`）
- [ ] 健康检查通过
- [ ] HTTP/HTTPS访问正常
- [ ] PWA离线功能可用
- [ ] 搜索功能正常
- [ ] PDF生成功能正常

安全检查:
- [ ] SSL证书有效
- [ ] 防火墙规则正确
- [ ] 日志记录开启
- [ ] 自动备份配置
- [ ] 监控告警设置

---

## 📞 获取帮助

- **GitHub Issues**: https://github.com/sooogooo/webapp-acnetreatment/issues
- **技术文档**:
  - [Docker部署详细文档](./README-DEPLOYMENT.md)
  - [Docker快速开始](./DOCKER-QUICK-START.md)
- **联系方式**:
  - 📧 yuxiaodong@beaucare.org
  - 💬 @sooogooo

---

## 📝 更新日志

- **2025-10-20**: 创建综合部署指南
- **2025-10-20**: 添加Docker部署支持
- **2025-10-20**: 完成21项核心功能

---

**祝您部署顺利！** 🎉

如有任何问题，欢迎提Issue或联系我们。
