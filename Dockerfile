# 使用官方nginx镜像作为基础镜像
FROM nginx:alpine

# 设置维护者信息
LABEL maintainer="acne-treatment-webapp"
LABEL description="Acne Treatment Educational Web Application"

# 删除nginx默认页面
RUN rm -rf /usr/share/nginx/html/*

# 复制项目文件到nginx默认目录
COPY index.html /usr/share/nginx/html/
COPY chapters/ /usr/share/nginx/html/chapters/
COPY manifest.json /usr/share/nginx/html/
COPY service-worker.js /usr/share/nginx/html/
COPY sitemap.xml /usr/share/nginx/html/
COPY robots.txt /usr/share/nginx/html/

# 创建icons目录（如果将来需要添加PWA图标）
RUN mkdir -p /usr/share/nginx/html/icons

# 复制自定义nginx配置（可选）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
