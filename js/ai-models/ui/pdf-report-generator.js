/**
 * PDFReportGenerator - Professional PDF Report Generator
 *
 * Generates comprehensive PDF reports with analytics and charts
 * Requires jsPDF library to be loaded
 *
 * @author Claude AI Assistant
 * @date 2025-10-27
 */

class PDFReportGenerator {
    /**
     * Constructor
     * @param {CostTracker} costTracker - Cost Tracker instance
     * @param {AdvancedCharts} advancedCharts - Advanced Charts instance (optional)
     * @param {Object} options - Configuration options
     */
    constructor(costTracker, advancedCharts = null, options = {}) {
        this.costTracker = costTracker;
        this.advancedCharts = advancedCharts;

        // Check if jsPDF is available
        if (typeof jsPDF === 'undefined') {
            throw new Error('jsPDF library is not loaded. Please include jsPDF CDN.');
        }

        // PDF configuration
        this.config = {
            pageWidth: 210, // A4 width in mm
            pageHeight: 297, // A4 height in mm
            margin: 20,
            lineHeight: 7,
            fontSize: {
                title: 24,
                heading: 16,
                subheading: 14,
                body: 11,
                small: 9
            },
            colors: {
                primary: [102, 126, 234], // #667eea
                secondary: [118, 75, 162], // #764ba2
                success: [16, 185, 129], // #10b981
                warning: [245, 158, 11], // #f59e0b
                danger: [239, 68, 68], // #ef4444
                text: [31, 41, 55], // #1f2937
                textLight: [107, 114, 128], // #6b7280
                border: [229, 231, 235] // #e5e7eb
            }
        };

        this.log('info', 'PDFReportGenerator initialized');
    }

    /**
     * Generate and download PDF report
     * @param {Object} options - Report options
     */
    async generateReport(options = {}) {
        try {
            const {
                period = 'month',
                includeCharts = true,
                includeDetailedRecords = true,
                filename = null
            } = options;

            this.log('info', `Generating PDF report for period: ${period}`);

            // Initialize PDF document
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            let currentY = 20;

            // Page 1: Cover Page
            currentY = this.generateCoverPage(doc, period);

            // Page 2: Overview
            doc.addPage();
            currentY = this.generateOverviewPage(doc, period);

            // Page 3: Model Usage Analysis
            doc.addPage();
            currentY = this.generateModelUsagePage(doc, period);

            // Page 4: Cost Analysis
            doc.addPage();
            currentY = this.generateCostAnalysisPage(doc, period);

            // Page 5: Performance Analysis
            doc.addPage();
            currentY = this.generatePerformancePage(doc, period);

            // Page 6+: Detailed Records
            if (includeDetailedRecords) {
                doc.addPage();
                this.generateDetailedRecordsPage(doc, period);
            }

            // Generate filename
            const reportFilename = filename || `AI-Model-Report-${period}-${Date.now()}.pdf`;

            // Download PDF
            doc.save(reportFilename);

            this.log('info', `PDF report generated: ${reportFilename}`);
            return { success: true, filename: reportFilename };

        } catch (error) {
            this.log('error', 'Failed to generate PDF report', error);
            throw error;
        }
    }

    /**
     * Generate cover page
     */
    generateCoverPage(doc, period) {
        const { pageWidth, pageHeight, margin } = this.config;
        const centerX = pageWidth / 2;

        // Background gradient effect (simulated with rectangles)
        doc.setFillColor(...this.config.colors.primary);
        doc.rect(0, 0, pageWidth, pageHeight / 3, 'F');

        // Title
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(this.config.fontSize.title);
        doc.setFont(undefined, 'bold');
        doc.text('AI Model Analytics Report', centerX, 60, { align: 'center' });

        // Subtitle
        doc.setFontSize(this.config.fontSize.heading);
        doc.setFont(undefined, 'normal');
        const periodText = this.getPeriodText(period);
        doc.text(periodText, centerX, 75, { align: 'center' });

        // Date
        doc.setFontSize(this.config.fontSize.body);
        const dateText = `Generated on ${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })}`;
        doc.text(dateText, centerX, 85, { align: 'center' });

        // Icon/Logo placeholder
        doc.setTextColor(...this.config.colors.text);
        doc.setFontSize(48);
        doc.text('📊', centerX, 140, { align: 'center' });

        // Summary box
        const boxY = 160;
        const boxHeight = 80;
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(margin, boxY, pageWidth - margin * 2, boxHeight, 5, 5, 'F');

        // Summary content
        const report = this.costTracker.getReport(period);
        doc.setTextColor(...this.config.colors.text);
        doc.setFontSize(this.config.fontSize.subheading);
        doc.setFont(undefined, 'bold');
        doc.text('Report Summary', centerX, boxY + 15, { align: 'center' });

        doc.setFontSize(this.config.fontSize.body);
        doc.setFont(undefined, 'normal');

        const summaryY = boxY + 30;
        const summaryItems = [
            `Total API Calls: ${report.totalCalls}`,
            `Total Cost: ¥${report.totalCost.toFixed(4)}`,
            `Success Rate: ${report.successRate.toFixed(1)}%`,
            `Average Response Time: ${Math.round(report.avgResponseTime)}ms`
        ];

        summaryItems.forEach((item, index) => {
            doc.text(item, centerX, summaryY + (index * 10), { align: 'center' });
        });

        // Footer
        doc.setFontSize(this.config.fontSize.small);
        doc.setTextColor(...this.config.colors.textLight);
        doc.text('Confidential - Internal Use Only', centerX, pageHeight - 15, { align: 'center' });

        return 0;
    }

    /**
     * Generate overview page
     */
    generateOverviewPage(doc, period) {
        let y = 20;

        // Page title
        y = this.addPageTitle(doc, 'Executive Overview', y);

        // Get report data
        const report = this.costTracker.getReport(period);

        // Key Metrics Section
        y = this.addSectionTitle(doc, '📊 Key Performance Indicators', y);
        y += 5;

        const metrics = [
            { label: 'Total API Calls', value: report.totalCalls.toString(), color: this.config.colors.primary },
            { label: 'Total Cost', value: `¥${report.totalCost.toFixed(4)}`, color: this.config.colors.success },
            { label: 'Success Rate', value: `${report.successRate.toFixed(1)}%`, color: this.config.colors.success },
            { label: 'Failed Calls', value: report.failedCalls.toString(), color: this.config.colors.danger },
            { label: 'Avg Response Time', value: `${Math.round(report.avgResponseTime)}ms`, color: this.config.colors.warning },
            { label: 'Total Tokens Used', value: report.totalTokens.toLocaleString(), color: this.config.colors.primary }
        ];

        // Draw metrics in grid
        const cols = 2;
        const cardWidth = (this.config.pageWidth - this.config.margin * 2 - 10) / cols;
        const cardHeight = 25;

        metrics.forEach((metric, index) => {
            const col = index % cols;
            const row = Math.floor(index / cols);
            const x = this.config.margin + (col * (cardWidth + 10));
            const cardY = y + (row * (cardHeight + 5));

            // Card background
            doc.setFillColor(249, 250, 251);
            doc.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, 'F');

            // Border
            doc.setDrawColor(...this.config.colors.border);
            doc.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, 'S');

            // Label
            doc.setFontSize(this.config.fontSize.small);
            doc.setTextColor(...this.config.colors.textLight);
            doc.text(metric.label, x + 5, cardY + 8);

            // Value
            doc.setFontSize(this.config.fontSize.heading);
            doc.setTextColor(...metric.color);
            doc.setFont(undefined, 'bold');
            doc.text(metric.value, x + 5, cardY + 18);
            doc.setFont(undefined, 'normal');
        });

        y += (Math.ceil(metrics.length / cols) * (cardHeight + 5)) + 10;

        // Model Distribution
        y = this.addSectionTitle(doc, '🤖 Model Distribution', y);
        y += 5;

        const modelStats = report.modelStats || {};
        const sortedModels = Object.entries(modelStats)
            .sort((a, b) => b[1].calls - a[1].calls)
            .slice(0, 5);

        if (sortedModels.length > 0) {
            const tableStartY = y;
            const colWidths = [60, 40, 40, 40];

            // Table header
            doc.setFillColor(...this.config.colors.primary);
            doc.rect(this.config.margin, tableStartY, this.config.pageWidth - this.config.margin * 2, 10, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(this.config.fontSize.body);
            doc.setFont(undefined, 'bold');
            doc.text('Model', this.config.margin + 3, tableStartY + 7);
            doc.text('Calls', this.config.margin + colWidths[0] + 3, tableStartY + 7);
            doc.text('Cost (¥)', this.config.margin + colWidths[0] + colWidths[1] + 3, tableStartY + 7);
            doc.text('Avg Time', this.config.margin + colWidths[0] + colWidths[1] + colWidths[2] + 3, tableStartY + 7);

            // Table rows
            doc.setFont(undefined, 'normal');
            doc.setTextColor(...this.config.colors.text);

            sortedModels.forEach(([ modelName, stats], index) => {
                const rowY = tableStartY + 10 + (index * 8);

                // Alternating row colors
                if (index % 2 === 0) {
                    doc.setFillColor(249, 250, 251);
                    doc.rect(this.config.margin, rowY - 6, this.config.pageWidth - this.config.margin * 2, 8, 'F');
                }

                doc.text(modelName, this.config.margin + 3, rowY);
                doc.text(stats.calls.toString(), this.config.margin + colWidths[0] + 3, rowY);
                doc.text(stats.cost.toFixed(4), this.config.margin + colWidths[0] + colWidths[1] + 3, rowY);
                doc.text(`${Math.round(stats.avgResponseTime)}ms`, this.config.margin + colWidths[0] + colWidths[1] + colWidths[2] + 3, rowY);
            });

            y = tableStartY + 10 + (sortedModels.length * 8) + 10;
        } else {
            doc.setTextColor(...this.config.colors.textLight);
            doc.text('No model data available', this.config.margin, y);
            y += 10;
        }

        this.addPageFooter(doc, 2);
        return y;
    }

    /**
     * Generate model usage page
     */
    generateModelUsagePage(doc, period) {
        let y = 20;

        y = this.addPageTitle(doc, 'Model Usage Analysis', y);

        const report = this.costTracker.getReport(period);
        const modelStats = report.modelStats || {};

        if (Object.keys(modelStats).length === 0) {
            doc.setTextColor(...this.config.colors.textLight);
            doc.text('No model usage data available for this period.', this.config.margin, y);
            this.addPageFooter(doc, 3);
            return y;
        }

        // Usage by model
        y = this.addSectionTitle(doc, '📱 Usage by Model', y);
        y += 5;

        const sortedModels = Object.entries(modelStats).sort((a, b) => b[1].calls - a[1].calls);

        sortedModels.forEach(([modelName, stats]) => {
            const percentage = (stats.calls / report.totalCalls * 100).toFixed(1);

            // Model name and stats
            doc.setFontSize(this.config.fontSize.body);
            doc.setTextColor(...this.config.colors.text);
            doc.setFont(undefined, 'bold');
            doc.text(modelName, this.config.margin, y);
            doc.setFont(undefined, 'normal');

            // Stats in same line
            doc.setTextColor(...this.config.colors.textLight);
            doc.setFontSize(this.config.fontSize.small);
            doc.text(`${stats.calls} calls (${percentage}%)`, this.config.margin + 50, y);

            y += 5;

            // Progress bar
            const barWidth = this.config.pageWidth - this.config.margin * 2;
            const fillWidth = (stats.calls / report.totalCalls) * barWidth;

            // Background
            doc.setFillColor(229, 231, 235);
            doc.roundedRect(this.config.margin, y, barWidth, 5, 2, 2, 'F');

            // Fill
            doc.setFillColor(...this.config.colors.primary);
            doc.roundedRect(this.config.margin, y, fillWidth, 5, 2, 2, 'F');

            y += 12;
        });

        this.addPageFooter(doc, 3);
        return y;
    }

    /**
     * Generate cost analysis page
     */
    generateCostAnalysisPage(doc, period) {
        let y = 20;

        y = this.addPageTitle(doc, 'Cost Analysis', y);

        const report = this.costTracker.getReport(period);

        // Cost breakdown
        y = this.addSectionTitle(doc, '💰 Cost Breakdown', y);
        y += 5;

        const costInfo = [
            { label: 'Total Cost', value: `¥${report.totalCost.toFixed(4)}`, color: this.config.colors.success },
            { label: 'Average Cost per Call', value: `¥${(report.totalCost / report.totalCalls || 0).toFixed(6)}`, color: this.config.colors.primary },
            { label: 'Total Tokens', value: report.totalTokens.toLocaleString(), color: this.config.colors.warning }
        ];

        costInfo.forEach(item => {
            doc.setFontSize(this.config.fontSize.body);
            doc.setTextColor(...this.config.colors.text);
            doc.text(`${item.label}:`, this.config.margin, y);

            doc.setTextColor(...item.color);
            doc.setFont(undefined, 'bold');
            doc.text(item.value, this.config.margin + 70, y);
            doc.setFont(undefined, 'normal');

            y += 8;
        });

        y += 5;

        // Cost by model
        y = this.addSectionTitle(doc, '📊 Cost by Model', y);
        y += 5;

        const modelStats = report.modelStats || {};
        const sortedByCost = Object.entries(modelStats)
            .sort((a, b) => b[1].cost - a[1].cost)
            .slice(0, 10);

        if (sortedByCost.length > 0) {
            const maxCost = sortedByCost[0][1].cost;

            sortedByCost.forEach(([modelName, stats]) => {
                const percentage = (stats.cost / report.totalCost * 100).toFixed(1);

                // Model info
                doc.setFontSize(this.config.fontSize.body);
                doc.setTextColor(...this.config.colors.text);
                doc.text(modelName, this.config.margin, y);

                doc.setTextColor(...this.config.colors.textLight);
                doc.setFontSize(this.config.fontSize.small);
                doc.text(`¥${stats.cost.toFixed(4)} (${percentage}%)`, this.config.margin + 50, y);

                y += 5;

                // Bar
                const barWidth = this.config.pageWidth - this.config.margin * 2;
                const fillWidth = (stats.cost / maxCost) * barWidth;

                doc.setFillColor(229, 231, 235);
                doc.roundedRect(this.config.margin, y, barWidth, 5, 2, 2, 'F');

                doc.setFillColor(...this.config.colors.success);
                doc.roundedRect(this.config.margin, y, fillWidth, 5, 2, 2, 'F');

                y += 12;
            });
        }

        this.addPageFooter(doc, 4);
        return y;
    }

    /**
     * Generate performance page
     */
    generatePerformancePage(doc, period) {
        let y = 20;

        y = this.addPageTitle(doc, 'Performance Analysis', y);

        const report = this.costTracker.getReport(period);

        // Performance metrics
        y = this.addSectionTitle(doc, '⚡ Performance Metrics', y);
        y += 5;

        const perfMetrics = [
            { label: 'Average Response Time', value: `${Math.round(report.avgResponseTime)}ms`, icon: '⏱️' },
            { label: 'Success Rate', value: `${report.successRate.toFixed(1)}%`, icon: '✅' },
            { label: 'Failed Calls', value: report.failedCalls.toString(), icon: '❌' },
            { label: 'Total Tokens Processed', value: report.totalTokens.toLocaleString(), icon: '🔢' }
        ];

        perfMetrics.forEach(metric => {
            // Metric card
            const cardY = y;
            const cardHeight = 15;

            doc.setFillColor(249, 250, 251);
            doc.roundedRect(this.config.margin, cardY, this.config.pageWidth - this.config.margin * 2, cardHeight, 3, 3, 'F');

            doc.setDrawColor(...this.config.colors.border);
            doc.roundedRect(this.config.margin, cardY, this.config.pageWidth - this.config.margin * 2, cardHeight, 3, 3, 'S');

            // Icon
            doc.setFontSize(16);
            doc.text(metric.icon, this.config.margin + 5, cardY + 10);

            // Label
            doc.setFontSize(this.config.fontSize.body);
            doc.setTextColor(...this.config.colors.text);
            doc.text(metric.label, this.config.margin + 15, cardY + 7);

            // Value
            doc.setFontSize(this.config.fontSize.subheading);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(...this.config.colors.primary);
            doc.text(metric.value, this.config.margin + 15, cardY + 13);
            doc.setFont(undefined, 'normal');

            y += cardHeight + 5;
        });

        y += 5;

        // Response time by model
        y = this.addSectionTitle(doc, '⚡ Response Time by Model', y);
        y += 5;

        const modelStats = report.modelStats || {};
        const sortedByTime = Object.entries(modelStats)
            .sort((a, b) => b[1].avgResponseTime - a[1].avgResponseTime)
            .slice(0, 8);

        if (sortedByTime.length > 0) {
            const maxTime = sortedByTime[0][1].avgResponseTime;

            sortedByTime.forEach(([modelName, stats]) => {
                doc.setFontSize(this.config.fontSize.body);
                doc.setTextColor(...this.config.colors.text);
                doc.text(modelName, this.config.margin, y);

                doc.setTextColor(...this.config.colors.textLight);
                doc.setFontSize(this.config.fontSize.small);
                doc.text(`${Math.round(stats.avgResponseTime)}ms`, this.config.margin + 50, y);

                y += 5;

                const barWidth = this.config.pageWidth - this.config.margin * 2;
                const fillWidth = (stats.avgResponseTime / maxTime) * barWidth;

                doc.setFillColor(229, 231, 235);
                doc.roundedRect(this.config.margin, y, barWidth, 5, 2, 2, 'F');

                doc.setFillColor(...this.config.colors.warning);
                doc.roundedRect(this.config.margin, y, fillWidth, 5, 2, 2, 'F');

                y += 12;
            });
        }

        this.addPageFooter(doc, 5);
        return y;
    }

    /**
     * Generate detailed records page
     */
    generateDetailedRecordsPage(doc, period) {
        let y = 20;

        y = this.addPageTitle(doc, 'Detailed Records', y);

        const report = this.costTracker.getReport(period);
        const records = report.records || [];

        if (records.length === 0) {
            doc.setTextColor(...this.config.colors.textLight);
            doc.text('No records available for this period.', this.config.margin, y);
            this.addPageFooter(doc, 6);
            return y;
        }

        // Table header
        const colWidths = [35, 30, 25, 25, 30, 25];
        const headers = ['Time', 'Model', 'Tokens', 'Cost', 'Response', 'Status'];

        doc.setFillColor(...this.config.colors.primary);
        doc.rect(this.config.margin, y, this.config.pageWidth - this.config.margin * 2, 8, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(this.config.fontSize.small);
        doc.setFont(undefined, 'bold');

        let x = this.config.margin + 2;
        headers.forEach((header, index) => {
            doc.text(header, x, y + 6);
            x += colWidths[index];
        });

        y += 8;
        doc.setFont(undefined, 'normal');

        // Table rows (limit to 15 per page)
        const maxRecords = 15;
        records.slice(0, maxRecords).forEach((record, index) => {
            if (y > 260) {
                doc.addPage();
                y = 20;
            }

            // Alternating row colors
            if (index % 2 === 0) {
                doc.setFillColor(249, 250, 251);
                doc.rect(this.config.margin, y, this.config.pageWidth - this.config.margin * 2, 7, 'F');
            }

            doc.setTextColor(...this.config.colors.text);
            doc.setFontSize(this.config.fontSize.small);

            x = this.config.margin + 2;

            // Time
            const time = new Date(record.timestamp).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            doc.text(time, x, y + 5);
            x += colWidths[0];

            // Model
            const modelName = record.modelName || 'Unknown';
            doc.text(modelName.substring(0, 12), x, y + 5);
            x += colWidths[1];

            // Tokens
            doc.text((record.tokens || 0).toString(), x, y + 5);
            x += colWidths[2];

            // Cost
            doc.text(`¥${(record.cost || 0).toFixed(4)}`, x, y + 5);
            x += colWidths[3];

            // Response time
            doc.text(`${record.responseTime || 0}ms`, x, y + 5);
            x += colWidths[4];

            // Status
            const statusText = record.success !== false ? '✓' : '✗';
            const statusColor = record.success !== false ? this.config.colors.success : this.config.colors.danger;
            doc.setTextColor(...statusColor);
            doc.text(statusText, x, y + 5);

            y += 7;
        });

        if (records.length > maxRecords) {
            y += 5;
            doc.setTextColor(...this.config.colors.textLight);
            doc.setFontSize(this.config.fontSize.small);
            doc.text(`Showing ${maxRecords} of ${records.length} records. Export full data for complete list.`,
                this.config.margin, y);
        }

        this.addPageFooter(doc, 6);
        return y;
    }

    /**
     * Helper: Add page title
     */
    addPageTitle(doc, title, y) {
        doc.setFontSize(this.config.fontSize.heading);
        doc.setTextColor(...this.config.colors.text);
        doc.setFont(undefined, 'bold');
        doc.text(title, this.config.margin, y);
        doc.setFont(undefined, 'normal');

        // Underline
        y += 3;
        doc.setDrawColor(...this.config.colors.primary);
        doc.setLineWidth(0.5);
        doc.line(this.config.margin, y, this.config.pageWidth - this.config.margin, y);

        return y + 10;
    }

    /**
     * Helper: Add section title
     */
    addSectionTitle(doc, title, y) {
        doc.setFontSize(this.config.fontSize.subheading);
        doc.setTextColor(...this.config.colors.text);
        doc.setFont(undefined, 'bold');
        doc.text(title, this.config.margin, y);
        doc.setFont(undefined, 'normal');
        return y + 8;
    }

    /**
     * Helper: Add page footer
     */
    addPageFooter(doc, pageNum) {
        const { pageWidth, pageHeight } = this.config;
        const footerY = pageHeight - 10;

        doc.setFontSize(this.config.fontSize.small);
        doc.setTextColor(...this.config.colors.textLight);

        doc.text(`Page ${pageNum}`, pageWidth / 2, footerY, { align: 'center' });
        doc.text(`AI Model Analytics Report - ${new Date().getFullYear()}`,
            this.config.margin, footerY);
    }

    /**
     * Helper: Get period text
     */
    getPeriodText(period) {
        const periodMap = {
            'today': 'Today\'s Report',
            'week': 'Weekly Report',
            'month': 'Monthly Report',
            'all': 'Complete Report'
        };
        return periodMap[period] || 'Report';
    }

    /**
     * Log message
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [PDFReportGenerator] [${level.toUpperCase()}]`;

        if (data) {
            console[level](`${prefix} ${message}`, data);
        } else {
            console[level](`${prefix} ${message}`);
        }
    }
}

// Export PDFReportGenerator class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFReportGenerator;
}
