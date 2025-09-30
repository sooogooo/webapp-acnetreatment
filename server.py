#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import threading
import time
from pathlib import Path

class BookHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='/root/claude/acne', **kwargs)

    def end_headers(self):
        # 添加CORS头以支持跨域请求
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        # 设置缓存策略
        if self.path.endswith('.md'):
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
        elif self.path.endswith('.html'):
            self.send_header('Content-Type', 'text/html; charset=utf-8')
        super().end_headers()

    def log_message(self, format, *args):
        # 自定义日志格式
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def start_server(port=10188):
    """启动HTTP服务器"""
    try:
        # 改变工作目录到书籍目录
        os.chdir('/root/claude/acne')

        # 创建服务器
        with socketserver.TCPServer(("", port), BookHTTPRequestHandler) as httpd:
            print(f"======================================")
            print(f"📚 痘痘诊疗指南 - 静态网站服务器")
            print(f"======================================")
            print(f"🌐 服务器地址: http://localhost:{port}")
            print(f"📁 服务目录: /root/claude/acne")
            print(f"⏰ 启动时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"🔄 服务状态: 运行中...")
            print(f"======================================")
            print(f"💡 提示: 使用 Ctrl+C 停止服务器")
            print(f"📖 访问网站查看完整书籍内容")
            print(f"======================================")

            # 启动服务器
            httpd.serve_forever()

    except KeyboardInterrupt:
        print(f"\n⏹️  服务器已停止 - {time.strftime('%Y-%m-%d %H:%M:%S')}")
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"❌ 错误: 端口 {port} 已被占用")
            print(f"💡 尝试使用其他端口或停止占用该端口的进程")
        else:
            print(f"❌ 启动服务器时发生错误: {e}")
    except Exception as e:
        print(f"❌ 未知错误: {e}")

def check_files():
    """检查必要文件是否存在"""
    book_dir = Path('/root/claude/acne')
    required_files = ['index.html']

    missing_files = []
    for file in required_files:
        if not (book_dir / file).exists():
            missing_files.append(file)

    if missing_files:
        print(f"❌ 缺少必要文件: {', '.join(missing_files)}")
        return False

    # 统计章节文件
    md_files = list(book_dir.glob('*.md'))
    print(f"📄 发现 {len(md_files)} 个章节文件")

    return True

def main():
    """主函数"""
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ 无效的端口号")
            sys.exit(1)
    else:
        port = 10188

    # 检查文件
    if not check_files():
        sys.exit(1)

    # 启动服务器
    start_server(port)

if __name__ == "__main__":
    main()