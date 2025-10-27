/**
 * AdvancedCharts - Advanced Data Visualization Component
 *
 * Provides line charts, pie charts, and bar charts for AI model analytics
 * Uses pure Canvas API for high performance visualization
 *
 * @author Claude AI Assistant
 * @date 2025-10-27
 */

class AdvancedCharts {
    /**
     * Constructor
     * @param {CostTracker} costTracker - Cost Tracker instance
     * @param {Object} options - Configuration options
     */
    constructor(costTracker, options = {}) {
        this.costTracker = costTracker;
        this.containerId = options.containerId || 'advanced-charts-container';
        this.theme = options.theme || 'light';

        // Chart colors
        this.colors = {
            primary: '#8b5cf6',
            secondary: '#ec4899',
            success: '#10b981',
            warning: '#f59e0b',
            danger: '#ef4444',
            info: '#3b82f6',
            gray: '#6b7280',
            models: [
                '#8b5cf6', '#ec4899', '#10b981',
                '#f59e0b', '#3b82f6', '#ef4444',
                '#06b6d4', '#8b5cf6'
            ]
        };

        // Chart configurations
        this.chartConfig = {
            padding: 40,
            fontSize: 12,
            fontFamily: 'Arial, sans-serif',
            lineWidth: 2,
            pointRadius: 4,
            animationDuration: 300
        };

        this.log('info', 'AdvancedCharts initialized');
    }

    /**
     * Render charts container
     */
    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            this.log('error', `Container #${this.containerId} not found`);
            return;
        }

        container.innerHTML = this.generateHTML();
        this.attachEventListeners();
        this.renderAllCharts();
    }

    /**
     * Generate HTML structure
     */
    generateHTML() {
        return `
            ${this.generateStyles()}

            <div class="advanced-charts">
                <!-- Chart Type Selector -->
                <div class="chart-selector">
                    <button class="chart-btn active" data-chart="trends">📈 Trends</button>
                    <button class="chart-btn" data-chart="distribution">🥧 Distribution</button>
                    <button class="chart-btn" data-chart="comparison">📊 Comparison</button>
                </div>

                <!-- Time Range Selector -->
                <div class="time-range-selector">
                    <label>Time Range:</label>
                    <select id="time-range-select">
                        <option value="7">Last 7 Days</option>
                        <option value="30" selected>Last 30 Days</option>
                        <option value="90">Last 90 Days</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                <!-- Charts Container -->
                <div class="charts-display">
                    <!-- Trends View -->
                    <div class="chart-view active" id="trends-view">
                        <div class="chart-card">
                            <h3>💰 Daily Cost Trend</h3>
                            <canvas id="cost-trend-chart" width="800" height="400"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>📞 Daily API Calls</h3>
                            <canvas id="calls-trend-chart" width="800" height="400"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>⚡ Response Time Trend</h3>
                            <canvas id="response-time-chart" width="800" height="400"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>✅ Success Rate Trend</h3>
                            <canvas id="success-rate-chart" width="800" height="400"></canvas>
                        </div>
                    </div>

                    <!-- Distribution View -->
                    <div class="chart-view" id="distribution-view">
                        <div class="chart-card">
                            <h3>📱 Model Usage Distribution</h3>
                            <canvas id="model-usage-pie" width="600" height="400"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>💵 Cost Distribution by Model</h3>
                            <canvas id="cost-distribution-pie" width="600" height="400"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>✅ Success vs Failure</h3>
                            <canvas id="success-failure-pie" width="600" height="400"></canvas>
                        </div>
                    </div>

                    <!-- Comparison View -->
                    <div class="chart-view" id="comparison-view">
                        <div class="chart-card">
                            <h3>📊 Model Performance Comparison</h3>
                            <canvas id="model-comparison-bar" width="800" height="400"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>💰 Cost Comparison by Model</h3>
                            <canvas id="cost-comparison-bar" width="800" height="400"></canvas>
                        </div>
                        <div class="chart-card">
                            <h3>⚡ Average Response Time</h3>
                            <canvas id="response-time-bar" width="800" height="400"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate CSS styles
     */
    generateStyles() {
        return `
            <style>
                .advanced-charts {
                    width: 100%;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .chart-selector {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .chart-btn {
                    padding: 10px 20px;
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .chart-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-2px);
                }

                .chart-btn.active {
                    background: white;
                    color: #667eea;
                    border-color: white;
                }

                .time-range-selector {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 20px;
                    color: white;
                    font-weight: 600;
                }

                .time-range-selector select {
                    padding: 8px 16px;
                    border-radius: 6px;
                    border: none;
                    background: white;
                    color: #667eea;
                    font-weight: 600;
                    cursor: pointer;
                }

                .charts-display {
                    position: relative;
                }

                .chart-view {
                    display: none;
                    grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
                    gap: 20px;
                }

                .chart-view.active {
                    display: grid;
                }

                .chart-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                }

                .chart-card h3 {
                    margin: 0 0 15px 0;
                    color: #1f2937;
                    font-size: 16px;
                    font-weight: 600;
                }

                .chart-card canvas {
                    max-width: 100%;
                    height: auto;
                    display: block;
                }

                @media (max-width: 768px) {
                    .chart-view {
                        grid-template-columns: 1fr;
                    }

                    .chart-selector {
                        flex-direction: column;
                    }

                    .chart-btn {
                        width: 100%;
                    }
                }
            </style>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Chart type buttons
        const chartBtns = document.querySelectorAll('.chart-btn');
        chartBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const chartType = btn.dataset.chart;
                this.switchChartView(chartType);
            });
        });

        // Time range selector
        const timeRangeSelect = document.getElementById('time-range-select');
        if (timeRangeSelect) {
            timeRangeSelect.addEventListener('change', () => {
                this.renderAllCharts();
            });
        }
    }

    /**
     * Switch chart view
     */
    switchChartView(viewName) {
        // Update buttons
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.chart === viewName);
        });

        // Update views
        document.querySelectorAll('.chart-view').forEach(view => {
            view.classList.toggle('active', view.id === `${viewName}-view`);
        });
    }

    /**
     * Render all charts
     */
    renderAllCharts() {
        const timeRange = this.getSelectedTimeRange();
        const data = this.processData(timeRange);

        // Render trend charts
        this.renderLineTrend('cost-trend-chart', data.dailyCosts, 'Daily Cost (¥)', this.colors.warning);
        this.renderLineTrend('calls-trend-chart', data.dailyCalls, 'API Calls', this.colors.primary);
        this.renderLineTrend('response-time-chart', data.dailyResponseTimes, 'Response Time (ms)', this.colors.info);
        this.renderLineTrend('success-rate-chart', data.dailySuccessRates, 'Success Rate (%)', this.colors.success);

        // Render pie charts
        this.renderPieChart('model-usage-pie', data.modelUsage, 'Model Usage');
        this.renderPieChart('cost-distribution-pie', data.costDistribution, 'Cost Distribution');
        this.renderPieChart('success-failure-pie', data.successFailure, 'Success vs Failure');

        // Render bar charts
        this.renderBarChart('model-comparison-bar', data.modelPerformance, 'Calls', this.colors.primary);
        this.renderBarChart('cost-comparison-bar', data.modelCosts, 'Cost (¥)', this.colors.warning);
        this.renderBarChart('response-time-bar', data.modelResponseTimes, 'Avg Response Time (ms)', this.colors.info);
    }

    /**
     * Get selected time range
     */
    getSelectedTimeRange() {
        const select = document.getElementById('time-range-select');
        return select ? select.value : '30';
    }

    /**
     * Process data from CostTracker
     */
    processData(timeRange) {
        const records = this.costTracker.getRecords();
        const now = Date.now();
        const days = timeRange === 'all' ? Infinity : parseInt(timeRange);
        const cutoffTime = timeRange === 'all' ? 0 : now - (days * 24 * 60 * 60 * 1000);

        // Filter records by time range
        const filteredRecords = records.filter(r => r.timestamp >= cutoffTime);

        return {
            dailyCosts: this.aggregateDailyData(filteredRecords, 'cost'),
            dailyCalls: this.aggregateDailyData(filteredRecords, 'count'),
            dailyResponseTimes: this.aggregateDailyData(filteredRecords, 'avgResponseTime'),
            dailySuccessRates: this.aggregateDailyData(filteredRecords, 'successRate'),
            modelUsage: this.aggregateByModel(filteredRecords, 'calls'),
            costDistribution: this.aggregateByModel(filteredRecords, 'cost'),
            successFailure: this.aggregateSuccessFailure(filteredRecords),
            modelPerformance: this.aggregateByModel(filteredRecords, 'calls'),
            modelCosts: this.aggregateByModel(filteredRecords, 'cost'),
            modelResponseTimes: this.aggregateByModel(filteredRecords, 'avgResponseTime')
        };
    }

    /**
     * Aggregate data by day
     */
    aggregateDailyData(records, metric) {
        const dailyMap = new Map();

        records.forEach(record => {
            const date = new Date(record.timestamp).toISOString().split('T')[0];

            if (!dailyMap.has(date)) {
                dailyMap.set(date, { count: 0, total: 0, successes: 0 });
            }

            const day = dailyMap.get(date);
            day.count++;

            if (metric === 'cost') {
                day.total += record.cost || 0;
            } else if (metric === 'count') {
                day.total++;
            } else if (metric === 'avgResponseTime') {
                day.total += record.responseTime || 0;
            } else if (metric === 'successRate') {
                if (record.success !== false) day.successes++;
            }
        });

        // Convert to array and sort by date
        const result = Array.from(dailyMap.entries())
            .map(([date, data]) => {
                let value;
                if (metric === 'avgResponseTime') {
                    value = data.count > 0 ? Math.round(data.total / data.count) : 0;
                } else if (metric === 'successRate') {
                    value = data.count > 0 ? Math.round((data.successes / data.count) * 100) : 0;
                } else {
                    value = data.total;
                }

                return {
                    label: this.formatDate(date),
                    value: value
                };
            })
            .sort((a, b) => a.label.localeCompare(b.label));

        return result;
    }

    /**
     * Aggregate data by model
     */
    aggregateByModel(records, metric) {
        const modelMap = new Map();

        records.forEach(record => {
            const modelName = record.modelName || 'Unknown';

            if (!modelMap.has(modelName)) {
                modelMap.set(modelName, { count: 0, cost: 0, responseTime: 0 });
            }

            const model = modelMap.get(modelName);
            model.count++;
            model.cost += record.cost || 0;
            model.responseTime += record.responseTime || 0;
        });

        // Convert to array
        return Array.from(modelMap.entries()).map(([name, data]) => {
            let value;
            if (metric === 'calls') {
                value = data.count;
            } else if (metric === 'cost') {
                value = parseFloat(data.cost.toFixed(4));
            } else if (metric === 'avgResponseTime') {
                value = data.count > 0 ? Math.round(data.responseTime / data.count) : 0;
            }

            return { label: name, value: value };
        }).filter(item => item.value > 0);
    }

    /**
     * Aggregate success/failure data
     */
    aggregateSuccessFailure(records) {
        let successes = 0;
        let failures = 0;

        records.forEach(record => {
            if (record.success === false) {
                failures++;
            } else {
                successes++;
            }
        });

        return [
            { label: 'Success', value: successes },
            { label: 'Failure', value: failures }
        ].filter(item => item.value > 0);
    }

    /**
     * Render line trend chart
     */
    renderLineTrend(canvasId, data, label, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        const padding = this.chartConfig.padding;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max value
        const maxValue = Math.max(...data.map(d => d.value), 1);
        const minValue = Math.min(...data.map(d => d.value), 0);
        const range = maxValue - minValue || 1;

        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + ((height - padding * 2) * i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Y-axis labels
            const value = maxValue - (range * i / 5);
            ctx.fillStyle = '#6b7280';
            ctx.font = `${this.chartConfig.fontSize}px ${this.chartConfig.fontFamily}`;
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(value), padding - 10, y + 5);
        }

        // Calculate points
        const points = data.map((d, i) => {
            const x = padding + ((width - padding * 2) * i / (data.length - 1 || 1));
            const normalizedValue = (d.value - minValue) / range;
            const y = height - padding - ((height - padding * 2) * normalizedValue);
            return { x, y, value: d.value, label: d.label };
        });

        // Draw line
        ctx.strokeStyle = color;
        ctx.lineWidth = this.chartConfig.lineWidth;
        ctx.beginPath();
        points.forEach((point, i) => {
            if (i === 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        });
        ctx.stroke();

        // Draw area under line (gradient)
        const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
        gradient.addColorStop(0, color + '40');
        gradient.addColorStop(1, color + '00');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, height - padding);
        points.forEach(point => {
            ctx.lineTo(point.x, point.y);
        });
        ctx.lineTo(points[points.length - 1].x, height - padding);
        ctx.closePath();
        ctx.fill();

        // Draw points
        points.forEach(point => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(point.x, point.y, this.chartConfig.pointRadius, 0, Math.PI * 2);
            ctx.fill();

            // White border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw X-axis labels (show every nth label to avoid overlap)
        const labelStep = Math.ceil(data.length / 8);
        ctx.fillStyle = '#6b7280';
        ctx.font = `${this.chartConfig.fontSize}px ${this.chartConfig.fontFamily}`;
        ctx.textAlign = 'center';
        data.forEach((d, i) => {
            if (i % labelStep === 0 || i === data.length - 1) {
                ctx.fillText(d.label, points[i].x, height - padding + 20);
            }
        });

        // Draw title
        ctx.fillStyle = '#1f2937';
        ctx.font = `bold ${this.chartConfig.fontSize + 2}px ${this.chartConfig.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.fillText(label, padding, padding - 10);
    }

    /**
     * Render pie chart
     */
    renderPieChart(canvasId, data, title) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Calculate total
        const total = data.reduce((sum, d) => sum + d.value, 0);
        if (total === 0) return;

        // Calculate center and radius
        const centerX = width / 2 - 100;
        const centerY = height / 2;
        const radius = Math.min(centerX, centerY) - 40;

        // Draw slices
        let startAngle = -Math.PI / 2;

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * Math.PI * 2;
            const endAngle = startAngle + sliceAngle;

            // Draw slice
            ctx.fillStyle = this.colors.models[index % this.colors.models.length];
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fill();

            // Draw white border
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw percentage label in slice
            const percentage = ((item.value / total) * 100).toFixed(1);
            if (parseFloat(percentage) >= 5) { // Only show if >= 5%
                const labelAngle = startAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
                const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);

                ctx.fillStyle = 'white';
                ctx.font = `bold ${this.chartConfig.fontSize}px ${this.chartConfig.fontFamily}`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${percentage}%`, labelX, labelY);
            }

            startAngle = endAngle;
        });

        // Draw legend
        const legendX = width - 180;
        let legendY = 50;

        ctx.font = `${this.chartConfig.fontSize}px ${this.chartConfig.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';

        data.forEach((item, index) => {
            // Color box
            ctx.fillStyle = this.colors.models[index % this.colors.models.length];
            ctx.fillRect(legendX, legendY - 8, 16, 16);

            // Label
            ctx.fillStyle = '#1f2937';
            const percentage = ((item.value / total) * 100).toFixed(1);
            ctx.fillText(`${item.label} (${percentage}%)`, legendX + 24, legendY);

            legendY += 25;
        });

        // Draw title
        ctx.fillStyle = '#1f2937';
        ctx.font = `bold ${this.chartConfig.fontSize + 2}px ${this.chartConfig.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.fillText(title, 20, 20);
    }

    /**
     * Render bar chart
     */
    renderBarChart(canvasId, data, yAxisLabel, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const { width, height } = canvas;
        const padding = this.chartConfig.padding;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Find max value
        const maxValue = Math.max(...data.map(d => d.value), 1);

        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + ((height - padding * 2) * i / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();

            // Y-axis labels
            const value = maxValue - (maxValue * i / 5);
            ctx.fillStyle = '#6b7280';
            ctx.font = `${this.chartConfig.fontSize}px ${this.chartConfig.fontFamily}`;
            ctx.textAlign = 'right';
            ctx.fillText(Math.round(value), padding - 10, y + 5);
        }

        // Calculate bar dimensions
        const barWidth = (width - padding * 2) / data.length * 0.8;
        const barGap = (width - padding * 2) / data.length * 0.2;

        // Draw bars
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * (height - padding * 2);
            const x = padding + (index * (barWidth + barGap)) + barGap / 2;
            const y = height - padding - barHeight;

            // Bar with gradient
            const gradient = ctx.createLinearGradient(x, y, x, height - padding);
            gradient.addColorStop(0, color);
            gradient.addColorStop(1, color + '80');

            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth, barHeight);

            // Bar border
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, barWidth, barHeight);

            // Value label on top of bar
            ctx.fillStyle = '#1f2937';
            ctx.font = `bold ${this.chartConfig.fontSize}px ${this.chartConfig.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.fillText(item.value, x + barWidth / 2, y - 10);

            // X-axis label
            ctx.fillStyle = '#6b7280';
            ctx.font = `${this.chartConfig.fontSize}px ${this.chartConfig.fontFamily}`;
            ctx.save();
            ctx.translate(x + barWidth / 2, height - padding + 15);
            ctx.rotate(-Math.PI / 6); // Rotate 30 degrees for better readability
            ctx.textAlign = 'right';
            ctx.fillText(item.label, 0, 0);
            ctx.restore();
        });

        // Draw Y-axis label
        ctx.fillStyle = '#1f2937';
        ctx.font = `bold ${this.chartConfig.fontSize + 2}px ${this.chartConfig.fontFamily}`;
        ctx.textAlign = 'left';
        ctx.fillText(yAxisLabel, padding, padding - 10);
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    /**
     * Export chart as image
     */
    exportChartAsImage(canvasId, filename) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const link = document.createElement('a');
        link.download = filename || `chart-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        this.log('info', `Chart exported: ${link.download}`);
    }

    /**
     * Log message
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [AdvancedCharts] [${level.toUpperCase()}]`;

        if (data) {
            console[level](`${prefix} ${message}`, data);
        } else {
            console[level](`${prefix} ${message}`);
        }
    }
}

// Export AdvancedCharts class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedCharts;
}
