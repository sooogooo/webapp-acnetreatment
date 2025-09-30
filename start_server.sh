#!/bin/bash

# 痘痘诊疗指南 - 服务器启动脚本
# 支持后台运行，不因终端退出而停止

SCRIPT_DIR="/root/claude/acne"
SERVER_SCRIPT="$SCRIPT_DIR/server.py"
PID_FILE="$SCRIPT_DIR/server.pid"
LOG_FILE="$SCRIPT_DIR/server.log"
PORT=10188

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印彩色消息
print_message() {
    echo -e "${2}$1${NC}"
}

# 检查服务器是否正在运行
check_server_status() {
    if [ -f "$PID_FILE" ]; then
        PID=$(cat "$PID_FILE")
        if ps -p $PID > /dev/null 2>&1; then
            return 0  # 运行中
        else
            rm -f "$PID_FILE"
            return 1  # 未运行
        fi
    else
        return 1  # 未运行
    fi
}

# 启动服务器
start_server() {
    if check_server_status; then
        print_message "服务器已在运行中 (PID: $(cat $PID_FILE))" "$YELLOW"
        print_message "访问地址: http://localhost:$PORT" "$BLUE"
        return
    fi

    print_message "正在启动痘痘诊疗指南服务器..." "$BLUE"

    # 创建日志目录
    mkdir -p "$(dirname "$LOG_FILE")"

    # 使用nohup在后台启动服务器
    cd "$SCRIPT_DIR"
    nohup python3 "$SERVER_SCRIPT" $PORT > "$LOG_FILE" 2>&1 &
    SERVER_PID=$!

    # 保存PID
    echo $SERVER_PID > "$PID_FILE"

    # 等待服务器启动
    sleep 2

    # 检查服务器是否成功启动
    if check_server_status; then
        print_message "✅ 服务器启动成功!" "$GREEN"
        print_message "📚 书籍网站地址: http://localhost:$PORT" "$BLUE"
        print_message "🔍 进程ID: $SERVER_PID" "$BLUE"
        print_message "📄 日志文件: $LOG_FILE" "$BLUE"
        print_message "⏹️  停止服务器: ./start_server.sh stop" "$YELLOW"
        echo ""
        print_message "服务器正在后台运行，关闭终端不会影响服务" "$GREEN"
    else
        print_message "❌ 服务器启动失败" "$RED"
        print_message "请查看日志文件: $LOG_FILE" "$YELLOW"
        return 1
    fi
}

# 停止服务器
stop_server() {
    if check_server_status; then
        PID=$(cat "$PID_FILE")
        print_message "正在停止服务器 (PID: $PID)..." "$YELLOW"

        kill $PID
        sleep 2

        # 如果进程仍在运行，强制终止
        if ps -p $PID > /dev/null 2>&1; then
            print_message "强制终止服务器..." "$YELLOW"
            kill -9 $PID
        fi

        rm -f "$PID_FILE"
        print_message "✅ 服务器已停止" "$GREEN"
    else
        print_message "服务器未在运行" "$YELLOW"
    fi
}

# 重启服务器
restart_server() {
    print_message "正在重启服务器..." "$BLUE"
    stop_server
    sleep 1
    start_server
}

# 显示服务器状态
show_status() {
    echo ""
    print_message "=== 痘痘诊疗指南服务器状态 ===" "$BLUE"

    if check_server_status; then
        PID=$(cat "$PID_FILE")
        print_message "🟢 状态: 运行中" "$GREEN"
        print_message "🔍 进程ID: $PID" "$BLUE"
        print_message "🌐 访问地址: http://localhost:$PORT" "$BLUE"

        # 检查端口是否可访问
        if curl -s "http://localhost:$PORT" > /dev/null; then
            print_message "✅ 网站可正常访问" "$GREEN"
        else
            print_message "⚠️  网站可能无法访问" "$YELLOW"
        fi
    else
        print_message "🔴 状态: 未运行" "$RED"
    fi

    # 显示日志文件信息
    if [ -f "$LOG_FILE" ]; then
        LOG_SIZE=$(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null || echo "未知")
        print_message "📄 日志文件: $LOG_FILE ($LOG_SIZE 字节)" "$BLUE"
    fi

    echo ""
}

# 显示最新日志
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        print_message "=== 最新日志 (最后20行) ===" "$BLUE"
        tail -20 "$LOG_FILE"
    else
        print_message "日志文件不存在" "$YELLOW"
    fi
}

# 显示帮助信息
show_help() {
    echo ""
    print_message "痘痘诊疗指南 - 服务器管理脚本" "$BLUE"
    echo ""
    print_message "用法: $0 [命令]" "$BLUE"
    echo ""
    print_message "可用命令:" "$BLUE"
    print_message "  start    启动服务器 (默认)" "$GREEN"
    print_message "  stop     停止服务器" "$RED"
    print_message "  restart  重启服务器" "$YELLOW"
    print_message "  status   显示服务器状态" "$BLUE"
    print_message "  logs     显示最新日志" "$BLUE"
    print_message "  help     显示此帮助信息" "$BLUE"
    echo ""
    print_message "示例:" "$BLUE"
    print_message "  $0 start     # 启动服务器" "$GREEN"
    print_message "  $0 status    # 查看状态" "$BLUE"
    print_message "  $0 logs      # 查看日志" "$BLUE"
    echo ""
}

# 主逻辑
case "${1:-start}" in
    "start")
        start_server
        ;;
    "stop")
        stop_server
        ;;
    "restart")
        restart_server
        ;;
    "status")
        show_status
        ;;
    "logs")
        show_logs
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_message "未知命令: $1" "$RED"
        print_message "使用 '$0 help' 查看可用命令" "$YELLOW"
        exit 1
        ;;
esac