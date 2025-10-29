/**
 * AI 对话历史记录 UI 面板
 * 提供可视化的历史记录查看、搜索和管理界面
 */

class AIHistoryPanel {
    constructor(historyManager) {
        this.history = historyManager || window.aiHistory;
        this.isOpen = false;
        this.currentFilter = 'all'; // all, today, week, month
        this.searchKeyword = '';
        this.panel = null;

        this.init();
    }

    /**
     * 初始化面板
     */
    init() {
        this.createPanel();
        this.attachEventListeners();
        this.injectStyles();

        // 监听历史记录变化
        window.addEventListener('historyAdded', () => this.refresh());
        window.addEventListener('historyDeleted', () => this.refresh());
        window.addEventListener('historyCleared', () => this.refresh());
    }

    /**
     * 创建面板 HTML
     */
    createPanel() {
        const panel = document.createElement('div');
        panel.className = 'ai-history-panel';
        panel.innerHTML = `
            <div class="ai-history-overlay"></div>
            <div class="ai-history-container">
                <div class="ai-history-header">
                    <h2 class="ai-history-title">对话历史记录</h2>
                    <button class="ai-history-close" aria-label="关闭">×</button>
                </div>

                <div class="ai-history-toolbar">
                    <div class="ai-history-search">
                        <input type="text"
                               class="ai-history-search-input"
                               placeholder="搜索问题或回答..."
                               aria-label="搜索历史记录">
                        <button class="ai-history-search-btn">🔍</button>
                    </div>

                    <div class="ai-history-filters">
                        <button class="ai-history-filter active" data-filter="all">全部</button>
                        <button class="ai-history-filter" data-filter="today">今天</button>
                        <button class="ai-history-filter" data-filter="week">本周</button>
                        <button class="ai-history-filter" data-filter="month">本月</button>
                    </div>
                </div>

                <div class="ai-history-stats">
                    <span class="ai-history-stat-item">
                        <strong class="ai-history-count">0</strong> 条记录
                    </span>
                </div>

                <div class="ai-history-list">
                    <!-- 历史记录将在这里动态生成 -->
                </div>

                <div class="ai-history-actions">
                    <button class="ai-history-btn ai-history-btn-export">📥 导出</button>
                    <button class="ai-history-btn ai-history-btn-import">📤 导入</button>
                    <button class="ai-history-btn ai-history-btn-clear">🗑️ 清空</button>
                </div>

                <div class="ai-history-export-menu" style="display: none;">
                    <button class="ai-history-export-option" data-format="json">JSON 格式</button>
                    <button class="ai-history-export-option" data-format="txt">TXT 格式</button>
                    <button class="ai-history-export-option" data-format="md">Markdown 格式</button>
                </div>

                <input type="file" class="ai-history-import-input" accept=".json" style="display: none;">
            </div>
        `;

        document.body.appendChild(panel);
        this.panel = panel;
    }

    /**
     * 绑定事件监听
     */
    attachEventListeners() {
        // 关闭按钮
        this.panel.querySelector('.ai-history-close').addEventListener('click', () => {
            this.close();
        });

        // 点击遮罩关闭
        this.panel.querySelector('.ai-history-overlay').addEventListener('click', () => {
            this.close();
        });

        // 搜索
        const searchInput = this.panel.querySelector('.ai-history-search-input');
        const searchBtn = this.panel.querySelector('.ai-history-search-btn');

        searchInput.addEventListener('input', (e) => {
            this.searchKeyword = e.target.value;
            this.debounce(() => this.refresh(), 300);
        });

        searchBtn.addEventListener('click', () => this.refresh());

        // 过滤器
        this.panel.querySelectorAll('.ai-history-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.panel.querySelectorAll('.ai-history-filter').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.refresh();
            });
        });

        // 导出按钮
        this.panel.querySelector('.ai-history-btn-export').addEventListener('click', () => {
            const menu = this.panel.querySelector('.ai-history-export-menu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        });

        // 导出选项
        this.panel.querySelectorAll('.ai-history-export-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.target.dataset.format;
                this.export(format);
                this.panel.querySelector('.ai-history-export-menu').style.display = 'none';
            });
        });

        // 导入按钮
        const importInput = this.panel.querySelector('.ai-history-import-input');
        this.panel.querySelector('.ai-history-btn-import').addEventListener('click', () => {
            importInput.click();
        });

        importInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.importFile(file);
            }
        });

        // 清空按钮
        this.panel.querySelector('.ai-history-btn-clear').addEventListener('click', () => {
            if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
                this.history.clearAll();
                this.refresh();
                alert('历史记录已清空');
            }
        });
    }

    /**
     * 注入样式
     */
    injectStyles() {
        if (document.getElementById('ai-history-panel-styles')) return;

        const style = document.createElement('style');
        style.id = 'ai-history-panel-styles';
        style.textContent = `
            /* AI 历史记录面板 */
            .ai-history-panel {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: none;
            }

            .ai-history-panel.open {
                display: block;
            }

            .ai-history-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(4px);
            }

            .ai-history-container {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 90%;
                max-width: 800px;
                max-height: 90vh;
                background: var(--surface, white);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .ai-history-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid var(--border, #E8E6E3);
                background: var(--surface-light, #F5F4F1);
            }

            .ai-history-title {
                margin: 0;
                font-size: 1.5rem;
                font-weight: 600;
                color: var(--text, #4A4A4A);
            }

            .ai-history-close {
                width: 36px;
                height: 36px;
                border: none;
                background: transparent;
                font-size: 2rem;
                line-height: 1;
                color: var(--text-secondary, #8B8B8B);
                cursor: pointer;
                transition: all 0.2s ease;
                border-radius: 8px;
            }

            .ai-history-close:hover {
                background: rgba(0, 0, 0, 0.05);
                color: var(--text, #4A4A4A);
            }

            .ai-history-toolbar {
                padding: 1.5rem 2rem 1rem;
                border-bottom: 1px solid var(--border, #E8E6E3);
            }

            .ai-history-search {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .ai-history-search-input {
                flex: 1;
                padding: 0.75rem 1rem;
                border: 1px solid var(--border, #E8E6E3);
                border-radius: 8px;
                font-size: 0.95rem;
                outline: none;
                transition: all 0.2s ease;
            }

            .ai-history-search-input:focus {
                border-color: var(--primary, #9FA8B8);
                box-shadow: 0 0 0 3px rgba(159, 168, 184, 0.1);
            }

            .ai-history-search-btn {
                padding: 0.75rem 1.5rem;
                background: var(--primary, #9FA8B8);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 1rem;
                transition: all 0.2s ease;
            }

            .ai-history-search-btn:hover {
                opacity: 0.9;
                transform: translateY(-1px);
            }

            .ai-history-filters {
                display: flex;
                gap: 0.5rem;
                flex-wrap: wrap;
            }

            .ai-history-filter {
                padding: 0.5rem 1rem;
                background: var(--surface-light, #F5F4F1);
                border: 1px solid var(--border, #E8E6E3);
                border-radius: 6px;
                font-size: 0.9rem;
                color: var(--text-secondary, #8B8B8B);
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ai-history-filter:hover {
                background: var(--background, #FAF9F6);
                border-color: var(--primary, #9FA8B8);
            }

            .ai-history-filter.active {
                background: var(--primary, #9FA8B8);
                border-color: var(--primary, #9FA8B8);
                color: white;
            }

            .ai-history-stats {
                padding: 1rem 2rem;
                background: var(--surface-light, #F5F4F1);
                border-bottom: 1px solid var(--border, #E8E6E3);
                font-size: 0.9rem;
                color: var(--text-secondary, #8B8B8B);
            }

            .ai-history-count {
                color: var(--primary, #9FA8B8);
                font-size: 1.1rem;
            }

            .ai-history-list {
                flex: 1;
                overflow-y: auto;
                padding: 1rem 2rem;
                max-height: 400px;
            }

            .ai-history-item {
                padding: 1.5rem;
                margin-bottom: 1rem;
                background: var(--surface-light, #F5F4F1);
                border-radius: 12px;
                border: 1px solid var(--border, #E8E6E3);
                transition: all 0.2s ease;
            }

            .ai-history-item:hover {
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
                transform: translateY(-2px);
            }

            .ai-history-item-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
            }

            .ai-history-item-date {
                font-size: 0.85rem;
                color: var(--text-secondary, #8B8B8B);
            }

            .ai-history-item-actions {
                display: flex;
                gap: 0.5rem;
            }

            .ai-history-item-btn {
                padding: 0.25rem 0.75rem;
                font-size: 0.85rem;
                background: transparent;
                border: 1px solid var(--border, #E8E6E3);
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ai-history-item-btn:hover {
                background: var(--background, #FAF9F6);
                border-color: var(--primary, #9FA8B8);
            }

            .ai-history-item-question {
                font-weight: 600;
                color: var(--text, #4A4A4A);
                margin-bottom: 0.75rem;
                line-height: 1.5;
            }

            .ai-history-item-answer {
                color: var(--text-secondary, #8B8B8B);
                line-height: 1.6;
                font-size: 0.95rem;
                max-height: 150px;
                overflow: hidden;
                position: relative;
            }

            .ai-history-item-answer.expanded {
                max-height: none;
            }

            .ai-history-item-expand {
                margin-top: 0.5rem;
                color: var(--primary, #9FA8B8);
                cursor: pointer;
                font-size: 0.9rem;
                display: inline-block;
            }

            .ai-history-item-expand:hover {
                text-decoration: underline;
            }

            .ai-history-empty {
                text-align: center;
                padding: 3rem 2rem;
                color: var(--text-secondary, #8B8B8B);
            }

            .ai-history-empty-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                opacity: 0.3;
            }

            .ai-history-actions {
                padding: 1.5rem 2rem;
                border-top: 1px solid var(--border, #E8E6E3);
                display: flex;
                gap: 1rem;
                justify-content: center;
                background: var(--surface-light, #F5F4F1);
            }

            .ai-history-btn {
                padding: 0.75rem 1.5rem;
                background: white;
                border: 1px solid var(--border, #E8E6E3);
                border-radius: 8px;
                font-size: 0.95rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .ai-history-btn:hover {
                background: var(--background, #FAF9F6);
                border-color: var(--primary, #9FA8B8);
                transform: translateY(-1px);
            }

            .ai-history-btn-clear {
                color: #E74C3C;
                border-color: #E74C3C;
            }

            .ai-history-btn-clear:hover {
                background: #E74C3C;
                color: white;
            }

            .ai-history-export-menu {
                position: absolute;
                bottom: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: white;
                border: 1px solid var(--border, #E8E6E3);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                overflow: hidden;
                z-index: 10;
            }

            .ai-history-export-option {
                display: block;
                width: 100%;
                padding: 0.75rem 1.5rem;
                background: white;
                border: none;
                border-bottom: 1px solid var(--border, #E8E6E3);
                text-align: left;
                cursor: pointer;
                transition: background 0.2s ease;
            }

            .ai-history-export-option:last-child {
                border-bottom: none;
            }

            .ai-history-export-option:hover {
                background: var(--background, #FAF9F6);
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .ai-history-container {
                    width: 95%;
                    max-height: 95vh;
                }

                .ai-history-header {
                    padding: 1rem 1.5rem;
                }

                .ai-history-title {
                    font-size: 1.25rem;
                }

                .ai-history-toolbar {
                    padding: 1rem 1.5rem 0.75rem;
                }

                .ai-history-list {
                    padding: 1rem 1.5rem;
                }

                .ai-history-actions {
                    padding: 1rem 1.5rem;
                    flex-wrap: wrap;
                }

                .ai-history-btn {
                    flex: 1;
                    min-width: 120px;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * 打开面板
     */
    open() {
        this.panel.classList.add('open');
        this.isOpen = true;
        this.refresh();
    }

    /**
     * 关闭面板
     */
    close() {
        this.panel.classList.remove('open');
        this.isOpen = false;
    }

    /**
     * 刷新历史记录列表
     */
    refresh() {
        const records = this.getFilteredRecords();
        const listContainer = this.panel.querySelector('.ai-history-list');
        const countElement = this.panel.querySelector('.ai-history-count');

        countElement.textContent = records.length;

        if (records.length === 0) {
            listContainer.innerHTML = `
                <div class="ai-history-empty">
                    <div class="ai-history-empty-icon">📝</div>
                    <p>暂无历史记录</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = records.map(record => this.renderItem(record)).join('');

        // 绑定事件
        this.bindItemEvents();
    }

    /**
     * 获取过滤后的记录
     */
    getFilteredRecords() {
        let records = this.history.getAll();

        // 按日期过滤
        if (this.currentFilter !== 'all') {
            const now = new Date();
            let startDate;

            if (this.currentFilter === 'today') {
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            } else if (this.currentFilter === 'week') {
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            } else if (this.currentFilter === 'month') {
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            }

            records = records.filter(r => r.timestamp >= startDate.getTime());
        }

        // 按关键词搜索
        if (this.searchKeyword) {
            const keyword = this.searchKeyword.toLowerCase();
            records = records.filter(r =>
                r.question.toLowerCase().includes(keyword) ||
                r.answer.toLowerCase().includes(keyword)
            );
        }

        return records;
    }

    /**
     * 渲染单个历史记录项
     */
    renderItem(record) {
        const date = new Date(record.timestamp).toLocaleString('zh-CN');
        const answerPreview = record.answer.length > 200
            ? record.answer.substring(0, 200) + '...'
            : record.answer;

        return `
            <div class="ai-history-item" data-id="${record.id}">
                <div class="ai-history-item-header">
                    <span class="ai-history-item-date">${date}</span>
                    <div class="ai-history-item-actions">
                        <button class="ai-history-item-btn ai-history-item-copy" data-id="${record.id}">
                            📋 复制
                        </button>
                        <button class="ai-history-item-btn ai-history-item-delete" data-id="${record.id}">
                            🗑️ 删除
                        </button>
                    </div>
                </div>
                <div class="ai-history-item-question">
                    ${this.escapeHtml(record.question)}
                </div>
                <div class="ai-history-item-answer" data-full="${this.escapeHtml(record.answer)}">
                    ${this.escapeHtml(answerPreview)}
                </div>
                ${record.answer.length > 200 ? '<span class="ai-history-item-expand">展开完整回答 ▼</span>' : ''}
            </div>
        `;
    }

    /**
     * 绑定列表项事件
     */
    bindItemEvents() {
        // 复制按钮
        this.panel.querySelectorAll('.ai-history-item-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const record = this.history.getById(id);
                if (record) {
                    this.copyToClipboard(`问: ${record.question}\n\n答: ${record.answer}`);
                    alert('已复制到剪贴板');
                }
            });
        });

        // 删除按钮
        this.panel.querySelectorAll('.ai-history-item-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                if (confirm('确定要删除这条记录吗？')) {
                    this.history.deleteById(id);
                }
            });
        });

        // 展开/收起
        this.panel.querySelectorAll('.ai-history-item-expand').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const answerDiv = e.target.previousElementSibling;
                const isExpanded = answerDiv.classList.contains('expanded');

                if (isExpanded) {
                    const preview = answerDiv.dataset.full.substring(0, 200) + '...';
                    answerDiv.textContent = preview;
                    answerDiv.classList.remove('expanded');
                    e.target.textContent = '展开完整回答 ▼';
                } else {
                    answerDiv.textContent = answerDiv.dataset.full;
                    answerDiv.classList.add('expanded');
                    e.target.textContent = '收起 ▲';
                }
            });
        });
    }

    /**
     * 导出历史记录
     */
    export(format) {
        if (format === 'json') {
            this.history.exportToJSON();
        } else if (format === 'txt') {
            this.history.exportToTXT();
        } else if (format === 'md') {
            this.history.exportToMarkdown();
        }
    }

    /**
     * 导入文件
     */
    async importFile(file) {
        try {
            const text = await file.text();
            const result = this.history.importFromJSON(text);

            if (result.success) {
                alert(`导入成功！新增 ${result.imported} 条记录，跳过 ${result.skipped} 条重复记录。`);
                this.refresh();
            } else {
                alert(`导入失败：${result.error}`);
            }
        } catch (error) {
            alert('文件读取失败，请确保文件格式正确。');
        }
    }

    /**
     * 复制到剪贴板
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (error) {
            // 降级方案
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
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
     * 防抖函数
     */
    debounce(func, wait) {
        if (this.debounceTimer) clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiHistoryPanel = new AIHistoryPanel(window.aiHistory);
    });
} else {
    window.aiHistoryPanel = new AIHistoryPanel(window.aiHistory);
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIHistoryPanel;
}
