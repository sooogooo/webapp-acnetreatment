#!/bin/bash

echo "=================================="
echo "  GitHub 推送脚本"
echo "=================================="
echo ""
echo "此脚本将帮助您推送代码到GitHub仓库"
echo "仓库: https://github.com/sooogooo/webapp-acnetreatment.git"
echo ""

# 检查是否在正确的目录
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是Git仓库"
    echo "请先执行: cd /root/claude/acne"
    exit 1
fi

echo "请选择推送方式:"
echo ""
echo "1) 使用 Personal Access Token (推荐)"
echo "2) 使用 SSH 密钥"
echo "3) 手动配置"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "=== 使用 Personal Access Token ==="
        echo ""
        echo "步骤1: 获取GitHub Personal Access Token"
        echo "  访问: https://github.com/settings/tokens"
        echo "  点击: Generate new token -> Generate new token (classic)"
        echo "  勾选: repo 权限"
        echo "  生成并复制token"
        echo ""
        read -p "请输入您的GitHub用户名 (sooogooo): " username
        username=${username:-sooogooo}

        echo ""
        read -sp "请输入Personal Access Token (输入时不会显示): " token
        echo ""
        echo ""

        if [ -z "$token" ]; then
            echo "❌ Token不能为空"
            exit 1
        fi

        echo "正在推送到GitHub..."
        git remote set-url origin https://${username}:${token}@github.com/sooogooo/webapp-acnetreatment.git
        git push -u origin main

        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ 推送成功！"
            echo "仓库地址: https://github.com/sooogooo/webapp-acnetreatment"
        else
            echo ""
            echo "❌ 推送失败，请检查token是否正确"
        fi
        ;;

    2)
        echo ""
        echo "=== 使用 SSH 密钥 ==="
        echo ""
        git remote set-url origin git@github.com:sooogooo/webapp-acnetreatment.git
        git push -u origin main

        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ 推送成功！"
            echo "仓库地址: https://github.com/sooogooo/webapp-acnetreatment"
        else
            echo ""
            echo "❌ 推送失败，请确保已配置SSH密钥"
            echo "配置SSH密钥: https://docs.github.com/cn/authentication/connecting-to-github-with-ssh"
        fi
        ;;

    3)
        echo ""
        echo "=== 手动配置 ==="
        echo ""
        echo "请手动执行以下命令："
        echo ""
        echo "# 方式1: 使用HTTPS + Token"
        echo "git remote set-url origin https://用户名:Token@github.com/sooogooo/webapp-acnetreatment.git"
        echo "git push -u origin main"
        echo ""
        echo "# 方式2: 使用SSH"
        echo "git remote set-url origin git@github.com:sooogooo/webapp-acnetreatment.git"
        echo "git push -u origin main"
        echo ""
        ;;

    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "=================================="
echo "  推送脚本执行完毕"
echo "=================================="