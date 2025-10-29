/**
 * AI 对话历史记录管理器
 * 使用 LocalStorage 存储对话记录，提供搜索、导出等功能
 */

class AIHistory {
    constructor() {
        this.storageKey = 'ai_chat_history';
        this.maxHistoryItems = 100; // 最多保存100条记录
        this.history = this.loadHistory();
    }

    /**
     * 从 LocalStorage 加载历史记录
     */
    loadHistory() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Failed to load chat history:', error);
            return [];
        }
    }

    /**
     * 保存历史记录到 LocalStorage
     */
    saveHistory() {
        try {
            // 只保留最近的记录
            if (this.history.length > this.maxHistoryItems) {
                this.history = this.history.slice(-this.maxHistoryItems);
            }
            localStorage.setItem(this.storageKey, JSON.stringify(this.history));
            return true;
        } catch (error) {
            console.error('Failed to save chat history:', error);
            // 如果是配额超限，尝试清理旧数据
            if (error.name === 'QuotaExceededError') {
                this.clearOldHistory(50);
                return this.saveHistory();
            }
            return false;
        }
    }

    /**
     * 添加对话记录
     * @param {string} question - 用户问题
     * @param {string} answer - AI回答
     * @param {object} metadata - 额外元数据
     */
    addRecord(question, answer, metadata = {}) {
        const record = {
            id: this.generateId(),
            question: question,
            answer: answer,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            ...metadata
        };

        this.history.push(record);
        this.saveHistory();

        // 触发事件
        window.dispatchEvent(new CustomEvent('historyAdded', {
            detail: record
        }));

        return record;
    }

    /**
     * 生成唯一ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 获取所有历史记录
     * @param {number} limit - 限制返回数量
     */
    getAll(limit = null) {
        const records = [...this.history].reverse(); // 最新的在前
        return limit ? records.slice(0, limit) : records;
    }

    /**
     * 根据ID获取记录
     */
    getById(id) {
        return this.history.find(record => record.id === id);
    }

    /**
     * 搜索历史记录
     * @param {string} keyword - 搜索关键词
     * @param {object} options - 搜索选项
     */
    search(keyword, options = {}) {
        const {
            searchInQuestion = true,
            searchInAnswer = true,
            caseSensitive = false,
            limit = null
        } = options;

        const searchText = caseSensitive ? keyword : keyword.toLowerCase();

        const results = this.history.filter(record => {
            let matches = false;

            if (searchInQuestion) {
                const question = caseSensitive ? record.question : record.question.toLowerCase();
                matches = matches || question.includes(searchText);
            }

            if (searchInAnswer) {
                const answer = caseSensitive ? record.answer : record.answer.toLowerCase();
                matches = matches || answer.includes(searchText);
            }

            return matches;
        }).reverse(); // 最新的在前

        return limit ? results.slice(0, limit) : results;
    }

    /**
     * 按日期过滤
     * @param {Date} startDate - 开始日期
     * @param {Date} endDate - 结束日期
     */
    filterByDate(startDate, endDate = new Date()) {
        const start = startDate.getTime();
        const end = endDate.getTime();

        return this.history.filter(record => {
            return record.timestamp >= start && record.timestamp <= end;
        }).reverse();
    }

    /**
     * 删除记录
     */
    deleteById(id) {
        const index = this.history.findIndex(record => record.id === id);
        if (index !== -1) {
            const deleted = this.history.splice(index, 1)[0];
            this.saveHistory();

            window.dispatchEvent(new CustomEvent('historyDeleted', {
                detail: deleted
            }));

            return true;
        }
        return false;
    }

    /**
     * 清空所有历史记录
     */
    clearAll() {
        this.history = [];
        this.saveHistory();

        window.dispatchEvent(new CustomEvent('historyCleared'));
        return true;
    }

    /**
     * 清理旧的历史记录
     */
    clearOldHistory(keepCount = 50) {
        if (this.history.length > keepCount) {
            this.history = this.history.slice(-keepCount);
            this.saveHistory();
        }
    }

    /**
     * 导出历史记录为 JSON
     */
    exportToJSON() {
        const data = {
            exportDate: new Date().toISOString(),
            totalRecords: this.history.length,
            records: this.history
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        this.downloadBlob(blob, `ai-chat-history-${this.formatDate(new Date())}.json`);
    }

    /**
     * 导出历史记录为 TXT
     */
    exportToTXT() {
        let content = '=== AI 对话历史记录 ===\n\n';
        content += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
        content += `总记录数: ${this.history.length}\n\n`;
        content += '='.repeat(50) + '\n\n';

        this.history.forEach((record, index) => {
            content += `[记录 ${index + 1}]\n`;
            content += `时间: ${new Date(record.timestamp).toLocaleString('zh-CN')}\n`;
            content += `\n问题:\n${record.question}\n`;
            content += `\n回答:\n${record.answer}\n`;
            content += '\n' + '-'.repeat(50) + '\n\n';
        });

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        this.downloadBlob(blob, `ai-chat-history-${this.formatDate(new Date())}.txt`);
    }

    /**
     * 导出历史记录为 Markdown
     */
    exportToMarkdown() {
        let content = '# AI 对话历史记录\n\n';
        content += `**导出时间**: ${new Date().toLocaleString('zh-CN')}  \n`;
        content += `**总记录数**: ${this.history.length}\n\n`;
        content += '---\n\n';

        this.history.forEach((record, index) => {
            const date = new Date(record.timestamp).toLocaleString('zh-CN');
            content += `## 记录 ${index + 1}\n\n`;
            content += `**时间**: ${date}\n\n`;
            content += `### 问题\n\n${record.question}\n\n`;
            content += `### 回答\n\n${record.answer}\n\n`;
            content += '---\n\n';
        });

        const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
        this.downloadBlob(blob, `ai-chat-history-${this.formatDate(new Date())}.md`);
    }

    /**
     * 下载文件
     */
    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 格式化日期为文件名
     */
    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hour = String(date.getHours()).padStart(2, '0');
        const minute = String(date.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}-${hour}${minute}`;
    }

    /**
     * 获取统计信息
     */
    getStats() {
        if (this.history.length === 0) {
            return {
                totalRecords: 0,
                oldestDate: null,
                newestDate: null,
                totalQuestions: 0,
                totalAnswers: 0,
                avgQuestionLength: 0,
                avgAnswerLength: 0
            };
        }

        const totalQuestions = this.history.reduce((sum, r) => sum + r.question.length, 0);
        const totalAnswers = this.history.reduce((sum, r) => sum + r.answer.length, 0);

        return {
            totalRecords: this.history.length,
            oldestDate: new Date(this.history[0].timestamp),
            newestDate: new Date(this.history[this.history.length - 1].timestamp),
            totalQuestions: totalQuestions,
            totalAnswers: totalAnswers,
            avgQuestionLength: Math.round(totalQuestions / this.history.length),
            avgAnswerLength: Math.round(totalAnswers / this.history.length)
        };
    }

    /**
     * 导入历史记录
     * @param {string} jsonString - JSON 字符串
     */
    importFromJSON(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            if (data.records && Array.isArray(data.records)) {
                // 合并导入的记录，避免重复
                const existingIds = new Set(this.history.map(r => r.id));
                const newRecords = data.records.filter(r => !existingIds.has(r.id));

                this.history.push(...newRecords);
                this.saveHistory();

                window.dispatchEvent(new CustomEvent('historyImported', {
                    detail: { imported: newRecords.length }
                }));

                return {
                    success: true,
                    imported: newRecords.length,
                    skipped: data.records.length - newRecords.length
                };
            }
            throw new Error('Invalid JSON format');
        } catch (error) {
            console.error('Failed to import history:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aiHistory = new AIHistory();
    });
} else {
    window.aiHistory = new AIHistory();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIHistory;
}
