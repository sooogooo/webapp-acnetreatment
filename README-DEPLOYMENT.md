# 🚀 痤疮治疗科普网站 - Docker部署指南

本文档提供完整的Docker一键部署方案，让您快速在任何支持Docker的环境中运行本项目。

---

## 📋 目录

- [前置要求](#前置要求)
- [快速开始](#快速开始)
- [部署方式](#部署方式)
  - [方式一：Docker Compose（推荐）](#方式一docker-compose推荐)
  - [方式二：Docker命令](#方式二docker命令)
- [访问应用](#访问应用)
- [容器管理](#容器管理)
- [配置说明](#配置说明)
- [常见问题](#常见问题)
- [生产环境部署](#生产环境部署)

---

## 前置要求

在开始之前，请确保您的系统已安装：

- **Docker**: 版本 20.10 或更高
- **Docker Compose**: 版本 1.29 或更高（如使用Compose部署）

### 安装Docker

**Ubuntu/Debian:**
```bash
# 更新包索引
sudo apt-get update

# 安装依赖
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 添加Docker官方GPG密钥
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装Docker Engine
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

**CentOS/RHEL:**
```bash
# 安装依赖
sudo yum install -y yum-utils

# 设置仓库
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 安装Docker Engine
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker
```

**macOS:**
```bash
# 使用Homebrew安装
brew install --cask docker
```

**Windows:**
- 下载并安装 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)

### 验证安装
```bash
docker --version
docker compose version
```

---

## 快速开始

### 一键部署命令

```bash
# 1. 克隆项目
git clone https://github.com/sooogooo/webapp-acnetreatment.git
cd webapp-acnetreatment

# 2. 一键启动
docker compose up -d

# 3. 访问应用
# 打开浏览器访问: http://localhost:8080
```

就这么简单！🎉

---

## 部署方式

### 方式一：Docker Compose（推荐）

Docker Compose提供最简单的部署方式，适合开发和生产环境。

#### 1. 启动服务

```bash
# 构建并启动（后台运行）
docker compose up -d

# 查看启动日志
docker compose logs -f

# 仅构建镜像（不启动）
docker compose build
```

#### 2. 停止服务

```bash
# 停止服务（保留容器）
docker compose stop

# 停止并删除容器
docker compose down

# 停止并删除容器、网络、卷
docker compose down -v
```

#### 3. 重启服务

```bash
# 重启所有服务
docker compose restart

# 重启特定服务
docker compose restart acne-webapp
```

#### 4. 查看状态

```bash
# 查看运行状态
docker compose ps

# 查看日志
docker compose logs

# 实时查看日志
docker compose logs -f --tail=100
```

---

### 方式二：Docker命令

如果不使用Docker Compose，可以直接使用Docker命令。

#### 1. 构建镜像

```bash
docker build -t acne-treatment-webapp:latest .
```

#### 2. 运行容器

**基础运行:**
```bash
docker run -d \
  --name acne-treatment-webapp \
  -p 8080:80 \
  acne-treatment-webapp:latest
```

**完整配置运行:**
```bash
docker run -d \
  --name acne-treatment-webapp \
  -p 8080:80 \
  --restart unless-stopped \
  --health-cmd="wget --quiet --tries=1 --spider http://localhost/ || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  --memory="256m" \
  --cpus="0.5" \
  -e TZ=Asia/Shanghai \
  acne-treatment-webapp:latest
```

#### 3. 容器管理

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs -f acne-treatment-webapp

# 停止容器
docker stop acne-treatment-webapp

# 启动容器
docker start acne-treatment-webapp

# 重启容器
docker restart acne-treatment-webapp

# 删除容器
docker rm -f acne-treatment-webapp
```

---

## 访问应用

启动成功后，通过以下方式访问应用：

- **本地访问**: http://localhost:8080
- **局域网访问**: http://YOUR_IP:8080
- **服务器访问**: http://YOUR_SERVER_IP:8080

### 验证部署

```bash
# 检查容器是否运行
docker compose ps

# 检查健康状态
docker inspect --format='{{.State.Health.Status}}' acne-treatment-webapp

# 测试HTTP响应
curl -I http://localhost:8080
```

---

## 容器管理

### 查看日志

```bash
# Docker Compose方式
docker compose logs -f --tail=100

# Docker命令方式
docker logs -f --tail=100 acne-treatment-webapp
```

### 进入容器

```bash
# Docker Compose方式
docker compose exec acne-webapp sh

# Docker命令方式
docker exec -it acne-treatment-webapp sh
```

### 更新应用

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 重新构建并启动
docker compose up -d --build

# 或使用Docker命令
docker build -t acne-treatment-webapp:latest .
docker stop acne-treatment-webapp
docker rm acne-treatment-webapp
docker run -d --name acne-treatment-webapp -p 8080:80 acne-treatment-webapp:latest
```

### 数据备份

虽然本应用是静态网站，但如果需要备份：

```bash
# 备份整个容器
docker commit acne-treatment-webapp acne-backup:$(date +%Y%m%d)

# 导出镜像
docker save acne-treatment-webapp:latest | gzip > acne-webapp-backup.tar.gz

# 恢复镜像
docker load < acne-webapp-backup.tar.gz
```

---

## 配置说明

### 端口配置

默认端口为8080，修改端口：

**docker-compose.yml:**
```yaml
ports:
  - "YOUR_PORT:80"  # 例如 "3000:80"
```

**Docker命令:**
```bash
docker run -d -p YOUR_PORT:80 acne-treatment-webapp:latest
```

### 时区配置

默认时区为`Asia/Shanghai`，修改时区：

**docker-compose.yml:**
```yaml
environment:
  - TZ=America/New_York  # 修改为所需时区
```

**Docker命令:**
```bash
docker run -d -e TZ=America/New_York acne-treatment-webapp:latest
```

### 资源限制

**docker-compose.yml:**
```yaml
deploy:
  resources:
    limits:
      cpus: '1.0'      # CPU限制
      memory: 512M     # 内存限制
    reservations:
      cpus: '0.5'
      memory: 256M
```

**Docker命令:**
```bash
docker run -d \
  --cpus="1.0" \
  --memory="512m" \
  acne-treatment-webapp:latest
```

### Nginx配置

自定义nginx配置，编辑 `nginx.conf` 文件后重新构建：

```bash
docker compose up -d --build
```

---

## 常见问题

### 1. 端口被占用

**错误信息:**
```
Error starting userland proxy: listen tcp4 0.0.0.0:8080: bind: address already in use
```

**解决方案:**
```bash
# 查找占用端口的进程
sudo lsof -i :8080

# 或修改docker-compose.yml中的端口
ports:
  - "8081:80"  # 使用其他端口
```

### 2. 权限问题

**错误信息:**
```
permission denied while trying to connect to the Docker daemon socket
```

**解决方案:**
```bash
# 将当前用户添加到docker组
sudo usermod -aG docker $USER

# 重新登录或执行
newgrp docker
```

### 3. 容器无法启动

```bash
# 查看详细日志
docker compose logs

# 检查容器状态
docker compose ps -a

# 查看健康检查状态
docker inspect acne-treatment-webapp | grep -A 10 Health
```

### 4. 镜像构建失败

```bash
# 清理Docker缓存
docker system prune -a

# 重新构建（不使用缓存）
docker compose build --no-cache
```

### 5. 内存不足

```bash
# 查看Docker资源使用
docker stats

# 调整资源限制（docker-compose.yml）
deploy:
  resources:
    limits:
      memory: 128M  # 减少内存限制
```

---

## 生产环境部署

### 使用HTTPS (推荐使用反向代理)

#### 使用Nginx反向代理

**1. 安装Nginx:**
```bash
sudo apt-get install nginx
```

**2. 配置Nginx (`/etc/nginx/sites-available/acne-webapp`):**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL证书配置
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/key.pem;

    # SSL安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # 反向代理到Docker容器
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**3. 启用配置:**
```bash
sudo ln -s /etc/nginx/sites-available/acne-webapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 使用Traefik (推荐)

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - acne-network

  acne-webapp:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.acne-webapp.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.acne-webapp.entrypoints=websecure"
      - "traefik.http.routers.acne-webapp.tls.certresolver=myresolver"
    networks:
      - acne-network

networks:
  acne-network:
    driver: bridge
```

### 监控和日志

#### 使用Docker的日志驱动

**docker-compose.yml:**
```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "5"
    labels: "production"
```

#### 集成Prometheus监控

```yaml
services:
  nginx-exporter:
    image: nginx/nginx-prometheus-exporter:latest
    command:
      - -nginx.scrape-uri=http://acne-webapp/nginx_status
    ports:
      - "9113:9113"
    networks:
      - acne-network
```

### 性能优化

1. **启用HTTP/2** - 已在nginx.conf中配置
2. **Gzip压缩** - 已启用
3. **静态资源缓存** - 已配置30天缓存
4. **CDN加速** - 建议使用CloudFlare或阿里云CDN

### 安全加固

1. **定期更新基础镜像:**
```bash
docker compose pull
docker compose up -d
```

2. **扫描镜像漏洞:**
```bash
docker scan acne-treatment-webapp:latest
```

3. **使用非root用户运行:**
在Dockerfile中添加：
```dockerfile
RUN addgroup -g 1001 -S nginx && adduser -u 1001 -S nginx -G nginx
USER nginx
```

---

## 支持与反馈

- **问题反馈**: [GitHub Issues](https://github.com/sooogooo/webapp-acnetreatment/issues)
- **技术支持**: 提交Issue或Pull Request
- **文档更新**: 欢迎贡献文档改进

---

## 许可证

本项目遵循相应的开源许可证，详情请查看LICENSE文件。

---

**最后更新**: 2025-10-20
**版本**: 1.0.0
