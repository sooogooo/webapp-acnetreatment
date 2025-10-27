/**
 * CostDashboard - 成本仪表盘UI组件
 *
 * 提供费用追踪和统计可视化界面
 * 支持图表、统计卡片和数据导出
 *
 * @author Claude AI Assistant
 * @date 2025-10-25
 */

class CostDashboard {
    /**
     * 构造函数
     * @param {CostTracker} costTracker - 成本追踪器实例
     * @param {Object} options - 配置选项
     * @param {string} options.containerId - 容器元素ID
     * @param {boolean} options.autoRefresh - 是否自动刷新
     * @param {number} options.refreshInterval - 刷新间隔(ms)
     */
    constructor(costTracker, options = {}) {
        this.costTracker = costTracker;
        this.containerId = options.containerId || 'ai-cost-dashboard';
        this.autoRefresh = options.autoRefresh !== false;
        this.refreshInterval = options.refreshInterval || 5000;

        this.currentPeriod = 'today'; // 'today' | 'week' | 'month'
        this.refreshTimer = null;
        this.currentView = 'simple'; // 'simple' | 'advanced'
        this.advancedCharts = null; // Will be initialized when needed

        this.log('info', 'CostDashboard初始化完成');
    }

    /**
     * 渲染仪表盘
     */
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`容器元素 #${this.containerId} 不存在`);
            return;
        }

        container.innerHTML = this.generateHTML();
        this.attachEventListeners();
        this.refreshData();

        if (this.autoRefresh) {
            this.startAutoRefresh();
        }

        this.log('info', '成本仪表盘渲染完成');
    }

    /**
     * 生成HTML结构
     * @returns {string} HTML字符串
     */
    generateHTML() {
        return `
            <div class="cost-dashboard">
                ${this.generateStyles()}

                <!-- 仪表盘标题 -->
                <div class="dashboard-header">
                    <div>
                        <h2>💰 费用统计</h2>
                        <p class="dashboard-subtitle">实时追踪API调用费用</p>
                    </div>
                    <div class="view-toggle">
                        <button class="view-btn ${this.currentView === 'simple' ? 'active' : ''}" onclick="window.costDashboard.switchView('simple')">
                            📊 简单视图
                        </button>
                        <button class="view-btn ${this.currentView === 'advanced' ? 'active' : ''}" onclick="window.costDashboard.switchView('advanced')">
                            📈 高级图表
                        </button>
                    </div>
                </div>

                <!-- 时间段选择 -->
                ${this.generateTabs()}

                <!-- 简单视图 -->
                <div id="simple-view" style="display: ${this.currentView === 'simple' ? 'block' : 'none'};">
                    <!-- 统计卡片 -->
                    ${this.generateStats()}

                    <!-- 预算进度 -->
                    ${this.generateBudget()}

                    <!-- 模型分布图 -->
                    ${this.generateChart()}

                    <!-- 详细记录表格 -->
                    ${this.generateTable()}
                </div>

                <!-- 高级图表视图 -->
                <div id="advanced-view" style="display: ${this.currentView === 'advanced' ? 'block' : 'none'};">
                    <div id="advanced-charts-container"></div>
                </div>

                <!-- 操作按钮 -->
                <div class="dashboard-actions">
                    <button class="btn btn-primary" onclick="window.costDashboard.refreshData()">
                        🔄 刷新数据
                    </button>
                    <button class="btn btn-success" onclick="window.costDashboard.exportCSV()">
                        📊 导出CSV
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 生成时间段选择标签
     * @returns {string} HTML字符串
     */
    generateTabs() {
        return `
            <div class="period-tabs">
                <button class="tab-btn active" data-period="today" onclick="window.costDashboard.updatePeriod('today')">
                    今日
                </button>
                <button class="tab-btn" data-period="week" onclick="window.costDashboard.updatePeriod('week')">
                    本周
                </button>
                <button class="tab-btn" data-period="month" onclick="window.costDashboard.updatePeriod('month')">
                    本月
                </button>
            </div>
        `;
    }

    /**
     * 生成统计卡片
     * @returns {string} HTML字符串
     */
    generateStats() {
        return `
            <div class="stats-container">
                <div class="stat-card stat-calls">
                    <div class="stat-icon">📞</div>
                    <div class="stat-content">
                        <div class="stat-label">调用次数</div>
                        <div class="stat-value" id="stat-calls">0</div>
                    </div>
                </div>

                <div class="stat-card stat-cost">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <div class="stat-label">总费用</div>
                        <div class="stat-value" id="stat-cost">¥0.00</div>
                    </div>
                </div>

                <div class="stat-card stat-success">
                    <div class="stat-icon">✅</div>
                    <div class="stat-content">
                        <div class="stat-label">成功率</div>
                        <div class="stat-value" id="stat-success">0%</div>
                    </div>
                </div>

                <div class="stat-card stat-time">
                    <div class="stat-icon">⏱️</div>
                    <div class="stat-content">
                        <div class="stat-label">平均响应</div>
                        <div class="stat-value" id="stat-time">0ms</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成预算进度条
     * @returns {string} HTML字符串
     */
    generateBudget() {
        return `
            <div class="budget-container">
                <h3>📊 预算使用情况</h3>

                <div class="budget-item">
                    <div class="budget-label">
                        <span>日预算</span>
                        <span id="daily-budget-text">¥0 / ¥10</span>
                    </div>
                    <div class="budget-bar">
                        <div class="budget-fill" id="daily-budget-fill" style="width: 0%"></div>
                    </div>
                </div>

                <div class="budget-item">
                    <div class="budget-label">
                        <span>月预算</span>
                        <span id="monthly-budget-text">¥0 / ¥100</span>
                    </div>
                    <div class="budget-bar">
                        <div class="budget-fill" id="monthly-budget-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成模型分布图表
     * @returns {string} HTML字符串
     */
    generateChart() {
        return `
            <div class="chart-container">
                <h3>📈 模型使用分布</h3>
                <div class="model-chart" id="model-chart">
                    <div class="chart-empty">暂无数据</div>
                </div>
            </div>
        `;
    }

    /**
     * 生成详细记录表格
     * @returns {string} HTML字符串
     */
    generateTable() {
        return `
            <div class="table-container">
                <h3>📋 最近调用记录</h3>
                <div class="table-wrapper">
                    <table class="records-table">
                        <thead>
                            <tr>
                                <th>时间</th>
                                <th>模型</th>
                                <th>Tokens</th>
                                <th>费用</th>
                                <th>响应时间</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody id="records-tbody">
                            <tr>
                                <td colspan="6" class="table-empty">暂无记录</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    /**
     * 生成CSS样式
     * @returns {string} CSS字符串
     */
    generateStyles() {
        return `
            <style>
                .cost-dashboard {
                    max-width: 1200px;
                    margin: 20px auto;
                    padding: 30px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 30px;
                }

                .dashboard-header > div:first-child {
                    text-align: left;
                }

                .dashboard-header h2 {
                    font-size: 2.2em;
                    color: #1f2937;
                    margin-bottom: 10px;
                }

                .dashboard-subtitle {
                    color: #6b7280;
                    font-size: 1.05em;
                }

                .view-toggle {
                    display: flex;
                    gap: 10px;
                }

                .view-btn {
                    padding: 10px 20px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    background: white;
                    color: #6b7280;
                    font-size: 0.95em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .view-btn:hover {
                    border-color: #667eea;
                    color: #667eea;
                    transform: translateY(-2px);
                }

                .view-btn.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-color: transparent;
                }

                /* ========== 时间段标签 ========== */
                .period-tabs {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin-bottom: 30px;
                }

                .tab-btn {
                    padding: 12px 30px;
                    border: 2px solid #e5e7eb;
                    border-radius: 25px;
                    background: white;
                    color: #6b7280;
                    font-size: 1em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .tab-btn:hover {
                    border-color: #667eea;
                    color: #667eea;
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border-color: transparent;
                }

                /* ========== 统计卡片 ========== */
                .stats-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    padding: 20px;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }

                .stat-card:hover {
                    transform: translateY(-5px);
                }

                .stat-calls {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                }

                .stat-cost {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }

                .stat-success {
                    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
                    color: white;
                }

                .stat-time {
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: white;
                }

                .stat-icon {
                    font-size: 2.5em;
                }

                .stat-content {
                    flex: 1;
                }

                .stat-label {
                    font-size: 0.9em;
                    opacity: 0.9;
                    margin-bottom: 5px;
                }

                .stat-value {
                    font-size: 1.8em;
                    font-weight: 700;
                }

                /* ========== 预算进度 ========== */
                .budget-container {
                    background: #f9fafb;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 30px;
                }

                .budget-container h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 1.3em;
                }

                .budget-item {
                    margin-bottom: 20px;
                }

                .budget-item:last-child {
                    margin-bottom: 0;
                }

                .budget-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                    color: #374151;
                    font-weight: 600;
                }

                .budget-bar {
                    height: 30px;
                    background: #e5e7eb;
                    border-radius: 15px;
                    overflow: hidden;
                    position: relative;
                }

                .budget-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
                    border-radius: 15px;
                    transition: width 0.5s ease;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 15px;
                    color: white;
                    font-weight: 600;
                    font-size: 0.9em;
                }

                .budget-fill.warning {
                    background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
                }

                .budget-fill.danger {
                    background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
                }

                /* ========== 图表 ========== */
                .chart-container {
                    background: #f9fafb;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 30px;
                }

                .chart-container h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 1.3em;
                }

                .model-chart {
                    min-height: 200px;
                }

                .chart-empty {
                    text-align: center;
                    color: #9ca3af;
                    padding: 50px 0;
                    font-size: 1.1em;
                }

                .chart-bar {
                    margin-bottom: 15px;
                }

                .chart-bar-label {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                    color: #374151;
                    font-weight: 600;
                }

                .chart-bar-bg {
                    height: 35px;
                    background: #e5e7eb;
                    border-radius: 10px;
                    overflow: hidden;
                    position: relative;
                }

                .chart-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    padding-right: 12px;
                    color: white;
                    font-weight: 600;
                    transition: width 0.5s ease;
                }

                /* ========== 表格 ========== */
                .table-container {
                    background: #f9fafb;
                    border-radius: 15px;
                    padding: 25px;
                    margin-bottom: 30px;
                }

                .table-container h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 1.3em;
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                .records-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .records-table th {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px;
                    text-align: left;
                    font-weight: 600;
                }

                .records-table td {
                    padding: 12px 15px;
                    border-bottom: 1px solid #e5e7eb;
                    color: #374151;
                }

                .records-table tbody tr:hover {
                    background: #f3f4f6;
                }

                .records-table tbody tr:last-child td {
                    border-bottom: none;
                }

                .table-empty {
                    text-align: center;
                    color: #9ca3af;
                    padding: 30px;
                }

                .status-success {
                    color: #10b981;
                    font-weight: 600;
                }

                .status-error {
                    color: #ef4444;
                    font-weight: 600;
                }

                /* ========== 操作按钮 ========== */
                .dashboard-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn {
                    padding: 12px 30px;
                    border: none;
                    border-radius: 25px;
                    font-size: 1em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                }

                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                }

                .btn-success {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                }

                /* ========== 响应式设计 ========== */
                @media (max-width: 768px) {
                    .cost-dashboard {
                        padding: 20px;
                    }

                    .stats-container {
                        grid-template-columns: 1fr;
                    }

                    .period-tabs {
                        flex-direction: column;
                    }

                    .tab-btn {
                        width: 100%;
                    }

                    .dashboard-actions {
                        flex-direction: column;
                    }

                    .btn {
                        width: 100%;
                    }
                }
            </style>
        `;
    }

    /**
     * 绑定事件监听器
     */
    attachEventListeners() {
        // 通过onclick属性绑定，无需额外处理
        // 暴露到window供onclick使用
        window.costDashboard = this;
    }

    /**
     * 更新时间段
     * @param {string} period - 时间段
     */
    updatePeriod(period) {
        this.currentPeriod = period;

        // 更新标签样式
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.dataset.period === period) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        this.refreshData();
        this.log('info', `时间段已切换: ${period}`);
    }

    /**
     * 刷新数据显示
     */
    refreshData() {
        const report = this.costTracker.getReport(this.currentPeriod);

        // 更新统计卡片
        this.updateStats(report);

        // 更新预算进度
        this.updateBudget();

        // 更新模型分布图
        this.updateChart(report);

        // 更新记录表格
        this.updateTable(report);

        this.log('info', '数据已刷新');
    }

    /**
     * 更新统计卡片
     * @param {Object} report - 报告数据
     */
    updateStats(report) {
        document.getElementById('stat-calls').textContent = report.totalCalls || 0;
        document.getElementById('stat-cost').textContent = `¥${(report.totalCost || 0).toFixed(2)}`;

        const successRate = report.totalCalls > 0
            ? ((report.successCalls || 0) / report.totalCalls * 100).toFixed(1)
            : 0;
        document.getElementById('stat-success').textContent = `${successRate}%`;

        const avgTime = report.totalCalls > 0
            ? Math.round((report.totalResponseTime || 0) / report.totalCalls)
            : 0;
        document.getElementById('stat-time').textContent = `${avgTime}ms`;
    }

    /**
     * 更新预算进度
     */
    updateBudget() {
        const budgetStatus = this.costTracker.checkBudget();

        // 日预算
        this.updateBudgetBar(
            'daily',
            budgetStatus.daily.usage,
            budgetStatus.daily.remaining,
            budgetStatus.daily.total
        );

        // 月预算
        this.updateBudgetBar(
            'monthly',
            budgetStatus.monthly.usage,
            budgetStatus.monthly.remaining,
            budgetStatus.monthly.total
        );
    }

    /**
     * 更新单个预算进度条
     * @param {string} type - 类型 'daily' | 'monthly'
     * @param {number} usage - 已使用
     * @param {number} remaining - 剩余
     * @param {number} total - 总预算
     */
    updateBudgetBar(type, usage, remaining, total) {
        const percentage = total > 0 ? (usage / total * 100) : 0;
        const fillEl = document.getElementById(`${type}-budget-fill`);
        const textEl = document.getElementById(`${type}-budget-text`);

        fillEl.style.width = `${Math.min(percentage, 100)}%`;
        textEl.textContent = `¥${usage.toFixed(2)} / ¥${total.toFixed(0)}`;

        // 根据百分比设置颜色
        fillEl.className = 'budget-fill';
        if (percentage >= 100) {
            fillEl.classList.add('danger');
        } else if (percentage >= 80) {
            fillEl.classList.add('warning');
        }
    }

    /**
     * 更新模型分布图
     * @param {Object} report - 报告数据
     */
    updateChart(report) {
        const chartEl = document.getElementById('model-chart');

        if (!report.byModel || Object.keys(report.byModel).length === 0) {
            chartEl.innerHTML = '<div class="chart-empty">暂无数据</div>';
            return;
        }

        // 计算百分比
        const total = report.totalCalls || 1;
        const modelData = Object.entries(report.byModel)
            .map(([model, data]) => ({
                model,
                calls: data.calls,
                percentage: (data.calls / total * 100).toFixed(1)
            }))
            .sort((a, b) => b.calls - a.calls);

        // 生成图表HTML
        let html = '';
        modelData.forEach(data => {
            html += `
                <div class="chart-bar">
                    <div class="chart-bar-label">
                        <span>${data.model}</span>
                        <span>${data.calls} 次 (${data.percentage}%)</span>
                    </div>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${data.percentage}%">
                            ${data.percentage}%
                        </div>
                    </div>
                </div>
            `;
        });

        chartEl.innerHTML = html;
    }

    /**
     * 更新记录表格
     * @param {Object} report - 报告数据
     */
    updateTable(report) {
        const tbody = document.getElementById('records-tbody');

        if (!report.records || report.records.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="table-empty">暂无记录</td></tr>';
            return;
        }

        // 只显示最近10条记录
        const recentRecords = report.records.slice(-10).reverse();

        let html = '';
        recentRecords.forEach(record => {
            const time = new Date(record.timestamp).toLocaleString('zh-CN', {
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            const statusClass = record.success ? 'status-success' : 'status-error';
            const statusText = record.success ? '✅ 成功' : '❌ 失败';

            html += `
                <tr>
                    <td>${time}</td>
                    <td>${record.model}</td>
                    <td>${record.totalTokens}</td>
                    <td>¥${record.cost.toFixed(4)}</td>
                    <td>${record.responseTime}ms</td>
                    <td class="${statusClass}">${statusText}</td>
                </tr>
            `;
        });

        tbody.innerHTML = html;
    }

    /**
     * 开始自动刷新
     */
    startAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
        }

        this.refreshTimer = setInterval(() => {
            this.refreshData();
        }, this.refreshInterval);

        this.log('info', `自动刷新已启动 (间隔: ${this.refreshInterval}ms)`);
    }

    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
            this.log('info', '自动刷新已停止');
        }
    }

    /**
     * 导出CSV
     */
    exportCSV() {
        const period = this.currentPeriod;
        const report = this.costTracker.getReport(period);

        if (!report.records || report.records.length === 0) {
            this.showToast('暂无数据可导出', 'error');
            return;
        }

        // 生成CSV内容
        let csv = '时间,模型,输入Tokens,输出Tokens,总Tokens,费用(元),响应时间(ms),状态\n';

        report.records.forEach(record => {
            const time = new Date(record.timestamp).toLocaleString('zh-CN');
            const status = record.success ? '成功' : '失败';
            csv += `${time},${record.model},${record.inputTokens},${record.outputTokens},${record.totalTokens},${record.cost.toFixed(4)},${record.responseTime},${status}\n`;
        });

        // 创建下载链接
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ai-cost-report-${period}-${Date.now()}.csv`;
        link.click();

        URL.revokeObjectURL(url);
        this.showToast('CSV已导出', 'success');
        this.log('info', `CSV已导出: ${period}`);
    }

    /**
     * 切换视图
     * @param {string} view - 'simple' | 'advanced'
     */
    switchView(view) {
        if (view === this.currentView) return;

        this.currentView = view;
        this.log('info', `切换到${view}视图`);

        // 更新按钮状态
        document.querySelectorAll('.view-btn').forEach(btn => {
            const btnView = btn.textContent.includes('简单') ? 'simple' : 'advanced';
            btn.classList.toggle('active', btnView === view);
        });

        // 切换视图显示
        const simpleView = document.getElementById('simple-view');
        const advancedView = document.getElementById('advanced-view');

        if (view === 'simple') {
            simpleView.style.display = 'block';
            advancedView.style.display = 'none';
        } else {
            simpleView.style.display = 'none';
            advancedView.style.display = 'block';

            // 初始化高级图表（如果还未初始化）
            if (!this.advancedCharts && typeof AdvancedCharts !== 'undefined') {
                this.advancedCharts = new AdvancedCharts(this.costTracker, {
                    containerId: 'advanced-charts-container'
                });
                this.advancedCharts.render();
                this.log('info', 'AdvancedCharts已初始化');
            } else if (this.advancedCharts) {
                // 如果已经初始化，刷新数据
                this.advancedCharts.renderAllCharts();
            }
        }
    }

    /**
     * 显示Toast提示
     * @param {string} message - 提示信息
     * @param {string} type - 类型
     */
    showToast(message, type = 'info') {
        if (typeof showToast === 'function') {
            showToast(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    /**
     * 日志记录
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [CostDashboard] [${level.toUpperCase()}]`;

        if (data) {
            console[level](`${prefix} ${message}`, data);
        } else {
            console[level](`${prefix} ${message}`);
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        this.stopAutoRefresh();
        this.log('info', 'CostDashboard已销毁');
    }
}

// 导出CostDashboard类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CostDashboard;
}
