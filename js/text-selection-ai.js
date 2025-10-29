/**
 * 划词 AI 功能
 * 选中文字后显示浮动工具栏，提供 AI 解释、复制、搜索等功能
 */

class TextSelectionAI {
    constructor(options = {}) {
        this.options = {
            minSelectionLength: 2, // 最少选中字符数
            maxSelectionLength: 500, // 最多选中字符数
            enabledContainers: ['.chapter-content', '.ai-response', '.ebook-content'], // 启用的容器
            ...options
        };

        this.toolbar = null;
        this.selectedText = '';
        this.selectionRange = null;

        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.createToolbar();
        this.attachEventListeners();
        this.injectStyles();
        console.log('✅ Text Selection AI initialized');
    }

    /**
     * 创建工具栏
     */
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'text-selection-toolbar';
        toolbar.innerHTML = `
            <button class="selection-tool-btn" data-action="ai-explain" title="AI 解释">
                <span class="selection-tool-icon">🤖</span>
                <span class="selection-tool-label">AI 解释</span>
            </button>
            <button class="selection-tool-btn" data-action="copy" title="复制">
                <span class="selection-tool-icon">📋</span>
                <span class="selection-tool-label">复制</span>
            </button>
            <button class="selection-tool-btn" data-action="search" title="搜索">
                <span class="selection-tool-icon">🔍</span>
                <span class="selection-tool-label">搜索</span>
            </button>
            <button class="selection-tool-btn" data-action="highlight" title="高亮">
                <span class="selection-tool-icon">✨</span>
                <span class="selection-tool-label">高亮</span>
            </button>
        `;

        document.body.appendChild(toolbar);
        this.toolbar = toolbar;

        // 绑定工具栏按钮事件
        toolbar.querySelectorAll('.selection-tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const action = btn.dataset.action;
                this.handleAction(action);
            });
        });
    }

    /**
     * 绑定事件监听
     */
    attachEventListeners() {
        // 监听文本选择
        document.addEventListener('mouseup', (e) => {
            setTimeout(() => this.handleSelection(e), 10);
        });

        document.addEventListener('touchend', (e) => {
            setTimeout(() => this.handleSelection(e), 10);
        });

        // 点击其他地方隐藏工具栏
        document.addEventListener('mousedown', (e) => {
            if (!this.toolbar.contains(e.target)) {
                this.hideToolbar();
            }
        });

        // 滚动时隐藏
        document.addEventListener('scroll', () => {
            if (this.toolbar.classList.contains('visible')) {
                this.hideToolbar();
            }
        }, true);
    }

    /**
     * 处理文本选择
     */
    handleSelection(e) {
        const selection = window.getSelection();
        const text = selection.toString().trim();

        // 检查选中文本长度
        if (text.length < this.options.minSelectionLength ||
            text.length > this.options.maxSelectionLength) {
            this.hideToolbar();
            return;
        }

        // 检查是否在启用的容器内
        if (!this.isInEnabledContainer(selection.anchorNode)) {
            this.hideToolbar();
            return;
        }

        this.selectedText = text;
        this.selectionRange = selection.getRangeAt(0);

        // 显示工具栏
        this.showToolbar(e);
    }

    /**
     * 检查是否在启用的容器内
     */
    isInEnabledContainer(node) {
        if (!node) return false;

        let element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node;

        while (element) {
            for (const selector of this.options.enabledContainers) {
                if (element.matches && element.matches(selector)) {
                    return true;
                }
            }
            element = element.parentElement;
        }

        return false;
    }

    /**
     * 显示工具栏
     */
    showToolbar(e) {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // 计算工具栏位置（选中文字上方）
        const toolbarHeight = 50;
        const toolbarWidth = 280;

        let top = rect.top + window.scrollY - toolbarHeight - 10;
        let left = rect.left + window.scrollX + (rect.width / 2) - (toolbarWidth / 2);

        // 边界检查
        if (top < window.scrollY + 10) {
            // 如果上方空间不足，显示在下方
            top = rect.bottom + window.scrollY + 10;
        }

        if (left < 10) {
            left = 10;
        } else if (left + toolbarWidth > window.innerWidth - 10) {
            left = window.innerWidth - toolbarWidth - 10;
        }

        this.toolbar.style.top = `${top}px`;
        this.toolbar.style.left = `${left}px`;
        this.toolbar.classList.add('visible');
    }

    /**
     * 隐藏工具栏
     */
    hideToolbar() {
        this.toolbar.classList.remove('visible');
    }

    /**
     * 处理操作
     */
    async handleAction(action) {
        switch (action) {
            case 'ai-explain':
                await this.aiExplain();
                break;
            case 'copy':
                this.copyText();
                break;
            case 'search':
                this.searchText();
                break;
            case 'highlight':
                this.highlightText();
                break;
        }

        this.hideToolbar();
    }

    /**
     * AI 解释
     */
    async aiExplain() {
        try {
            // 显示加载提示
            this.showToast('AI 正在分析...', 'info');

            // 构建提示词
            const prompt = `请用简洁、专业的语言解释以下医美/护肤相关的内容：\n\n"${this.selectedText}"\n\n要求：\n1. 100字以内\n2. 通俗易懂\n3. 突出重点`;

            // 调用 AI API（这里需要根据实际的 AI 接口实现）
            const response = await this.callAIAPI(prompt);

            // 显示解释结果
            this.showExplanationModal(this.selectedText, response);

        } catch (error) {
            console.error('AI explain failed:', error);
            this.showToast('AI 解释失败，请稍后重试', 'error');
        }
    }

    /**
     * 调用 AI API
     */
    async callAIAPI(prompt) {
        // 这里需要根据实际的 AI API 实现
        // 示例实现：
        return new Promise((resolve) => {
            setTimeout(() => {
                // 模拟 AI 回复
                resolve(`这是对"${this.selectedText.substring(0, 20)}..."的AI解释。这个术语在医美领域中指的是...（实际使用时需要接入真实的AI API）`);
            }, 1500);
        });
    }

    /**
     * 显示解释弹窗
     */
    showExplanationModal(originalText, explanation) {
        // 创建模态框
        const modal = document.createElement('div');
        modal.className = 'ai-explanation-modal';
        modal.innerHTML = `
            <div class="ai-explanation-overlay"></div>
            <div class="ai-explanation-content">
                <div class="ai-explanation-header">
                    <h3>AI 解释</h3>
                    <button class="ai-explanation-close">×</button>
                </div>
                <div class="ai-explanation-body">
                    <div class="ai-explanation-original">
                        <strong>选中内容:</strong>
                        <p>${this.escapeHtml(originalText)}</p>
                    </div>
                    <div class="ai-explanation-result">
                        <strong>AI 解释:</strong>
                        <p>${this.escapeHtml(explanation)}</p>
                    </div>
                </div>
                <div class="ai-explanation-actions">
                    <button class="ai-explanation-btn" onclick="this.closest('.ai-explanation-modal').remove()">
                        确定
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭事件
        modal.querySelector('.ai-explanation-close').addEventListener('click', () => {
            modal.remove();
        });

        modal.querySelector('.ai-explanation-overlay').addEventListener('click', () => {
            modal.remove();
        });
    }

    /**
     * 复制文本
     */
    async copyText() {
        try {
            await navigator.clipboard.writeText(this.selectedText);
            this.showToast('已复制到剪贴板', 'success');
        } catch (error) {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = this.selectedText;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('已复制到剪贴板', 'success');
        }
    }

    /**
     * 搜索文本
     */
    searchText() {
        // 在当前页面搜索
        if (typeof window.quickSearch === 'function') {
            window.quickSearch(this.selectedText);
        } else {
            // 使用浏览器的查找功能
            window.find(this.selectedText);
        }

        this.showToast(`正在搜索"${this.selectedText}"`, 'info');
    }

    /**
     * 高亮文本
     */
    highlightText() {
        if (!this.selectionRange) return;

        try {
            // 创建高亮元素
            const span = document.createElement('span');
            span.className = 'text-highlight';
            span.style.backgroundColor = '#FFE066';
            span.style.padding = '2px 0';
            span.style.borderRadius = '2px';

            // 包裹选中的文本
            this.selectionRange.surroundContents(span);

            this.showToast('已高亮显示', 'success');

            // 5秒后移除高亮
            setTimeout(() => {
                if (span.parentNode) {
                    const parent = span.parentNode;
                    while (span.firstChild) {
                        parent.insertBefore(span.firstChild, span);
                    }
                    parent.removeChild(span);
                }
            }, 5000);

        } catch (error) {
            console.error('Highlight failed:', error);
            this.showToast('高亮失败', 'error');
        }
    }

    /**
     * HTML 转义
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 显示提示
     */
    showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }

        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: ${type === 'error' ? '#E74C3C' : type === 'success' ? '#27AE60' : '#3498DB'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 999999;
            font-size: 14px;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease';
            toast.style.opacity = '0';
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    /**
     * 注入样式
     */
    injectStyles() {
        if (document.getElementById('text-selection-ai-styles')) return;

        const style = document.createElement('style');
        style.id = 'text-selection-ai-styles';
        style.textContent = `
            /* 文本选择工具栏 */
            .text-selection-toolbar {
                position: absolute;
                display: flex;
                gap: 4px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
                padding: 6px;
                z-index: 99999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.2s ease;
            }

            .text-selection-toolbar.visible {
                opacity: 1;
                pointer-events: auto;
            }

            .selection-tool-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                background: transparent;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                color: var(--text, #4A4A4A);
                transition: all 0.2s ease;
                white-space: nowrap;
            }

            .selection-tool-btn:hover {
                background: var(--surface-light, #F5F4F1);
            }

            .selection-tool-icon {
                font-size: 16px;
            }

            .selection-tool-label {
                font-size: 13px;
            }

            /* AI 解释弹窗 */
            .ai-explanation-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 100000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .ai-explanation-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }

            .ai-explanation-content {
                position: relative;
                width: 90%;
                max-width: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                overflow: hidden;
            }

            .ai-explanation-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid var(--border, #E8E6E3);
                background: var(--surface-light, #F5F4F1);
            }

            .ai-explanation-header h3 {
                margin: 0;
                font-size: 1.25rem;
                color: var(--text, #4A4A4A);
            }

            .ai-explanation-close {
                width: 32px;
                height: 32px;
                border: none;
                background: transparent;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--text-secondary, #8B8B8B);
                transition: color 0.2s ease;
            }

            .ai-explanation-close:hover {
                color: var(--text, #4A4A4A);
            }

            .ai-explanation-body {
                padding: 2rem;
            }

            .ai-explanation-original,
            .ai-explanation-result {
                margin-bottom: 1.5rem;
            }

            .ai-explanation-original p,
            .ai-explanation-result p {
                margin: 0.5rem 0 0 0;
                padding: 1rem;
                background: var(--surface-light, #F5F4F1);
                border-radius: 8px;
                line-height: 1.6;
                color: var(--text-secondary, #8B8B8B);
            }

            .ai-explanation-result p {
                background: linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 100%);
                color: var(--text, #4A4A4A);
            }

            .ai-explanation-actions {
                padding: 1rem 2rem 1.5rem;
                text-align: center;
            }

            .ai-explanation-btn {
                padding: 0.75rem 2rem;
                background: var(--primary, #9FA8B8);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ai-explanation-btn:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .text-selection-toolbar {
                    flex-wrap: wrap;
                    max-width: calc(100vw - 40px);
                }

                .selection-tool-label {
                    display: none;
                }

                .selection-tool-btn {
                    padding: 10px;
                }

                .ai-explanation-content {
                    width: 95%;
                }

                .ai-explanation-body {
                    padding: 1.5rem;
                }
            }
        `;

        document.head.appendChild(style);
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.textSelectionAI = new TextSelectionAI();
    });
} else {
    window.textSelectionAI = new TextSelectionAI();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TextSelectionAI;
}
