/**
 * 报告导出管理器
 * 支持导出评估结果为 PNG 图片或 PDF 文档
 * 依赖: html2canvas, jsPDF
 */

class ReportExporter {
    constructor() {
        this.isHtml2canvasLoaded = false;
        this.isJsPDFLoaded = false;
        this.loadingLibraries = false;

        // CDN 链接
        this.html2canvasURL = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        this.jsPDFURL = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
    }

    /**
     * 动态加载外部库
     */
    async loadLibraries() {
        if (this.loadingLibraries) {
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (this.isHtml2canvasLoaded && this.isJsPDFLoaded) {
                        clearInterval(checkInterval);
                        resolve();
                    }
                }, 100);
            });
        }

        this.loadingLibraries = true;

        try {
            // 加载 html2canvas
            if (!window.html2canvas) {
                await this.loadScript(this.html2canvasURL);
                this.isHtml2canvasLoaded = true;
            } else {
                this.isHtml2canvasLoaded = true;
            }

            // 加载 jsPDF
            if (!window.jspdf) {
                await this.loadScript(this.jsPDFURL);
                this.isJsPDFLoaded = true;
            } else {
                this.isJsPDFLoaded = true;
            }

            console.log('✅ Export libraries loaded successfully');
            this.loadingLibraries = false;
        } catch (error) {
            console.error('❌ Failed to load export libraries:', error);
            this.loadingLibraries = false;
            throw error;
        }
    }

    /**
     * 加载外部脚本
     */
    loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * 导出为 PNG 图片
     * @param {string} elementId - 要导出的元素ID
     * @param {string} filename - 文件名
     * @param {object} options - 导出选项
     */
    async exportToPNG(elementId, filename = 'report', options = {}) {
        try {
            // 显示加载提示
            this.showToast('正在生成图片...', 'info');

            // 确保库已加载
            await this.loadLibraries();

            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error(`Element with ID "${elementId}" not found`);
            }

            // 默认选项
            const defaultOptions = {
                scale: 2, // 2倍分辨率，提高清晰度
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                ...options
            };

            // 生成 canvas
            const canvas = await html2canvas(element, defaultOptions);

            // 转换为 blob 并下载
            canvas.toBlob((blob) => {
                this.downloadBlob(blob, `${filename}.png`);
                this.showToast('图片已生成并下载！', 'success');
            }, 'image/png');

        } catch (error) {
            console.error('Export to PNG failed:', error);
            this.showToast('图片生成失败：' + error.message, 'error');
            throw error;
        }
    }

    /**
     * 导出为 PDF 文档
     * @param {string} elementId - 要导出的元素ID
     * @param {string} filename - 文件名
     * @param {object} options - 导出选项
     */
    async exportToPDF(elementId, filename = 'report', options = {}) {
        try {
            // 显示加载提示
            this.showToast('正在生成PDF...', 'info');

            // 确保库已加载
            await this.loadLibraries();

            const element = document.getElementById(elementId);
            if (!element) {
                throw new Error(`Element with ID "${elementId}" not found`);
            }

            // 默认选项
            const defaultOptions = {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                ...options
            };

            // 生成 canvas
            const canvas = await html2canvas(element, defaultOptions);

            // 创建 PDF
            const { jsPDF } = window.jspdf;

            // PDF 尺寸 (A4: 210mm x 297mm)
            const pdfWidth = 210;
            const pdfHeight = 297;

            // 计算图片尺寸
            const imgWidth = pdfWidth - 20; // 左右各留10mm边距
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // 创建 PDF 实例
            const pdf = new jsPDF({
                orientation: imgHeight > imgWidth ? 'portrait' : 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            // 将 canvas 转换为图片
            const imgData = canvas.toDataURL('image/png');

            // 如果内容高度超过一页，需要分页
            let position = 10; // 顶部边距
            let heightLeft = imgHeight;

            // 添加第一页
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight - 20;

            // 如果需要分页
            while (heightLeft > 0) {
                position = heightLeft - imgHeight + 10;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight - 20;
            }

            // 保存 PDF
            pdf.save(`${filename}.pdf`);

            this.showToast('PDF已生成并下载！', 'success');

        } catch (error) {
            console.error('Export to PDF failed:', error);
            this.showToast('PDF生成失败：' + error.message, 'error');
            throw error;
        }
    }

    /**
     * 导出自定义报告（根据数据生成）
     * @param {object} data - 报告数据
     * @param {string} format - 导出格式 (png/pdf)
     */
    async exportCustomReport(data, format = 'pdf') {
        try {
            // 创建临时报告容器
            const reportHTML = this.generateReportHTML(data);
            const tempContainer = document.createElement('div');
            tempContainer.innerHTML = reportHTML;
            tempContainer.style.position = 'absolute';
            tempContainer.style.left = '-9999px';
            tempContainer.style.top = '0';
            tempContainer.style.width = '800px';
            tempContainer.style.background = 'white';
            tempContainer.style.padding = '40px';
            tempContainer.id = 'temp-report-container';

            document.body.appendChild(tempContainer);

            // 导出
            if (format === 'png') {
                await this.exportToPNG('temp-report-container', `report-${Date.now()}`);
            } else {
                await this.exportToPDF('temp-report-container', `report-${Date.now()}`);
            }

            // 清理
            document.body.removeChild(tempContainer);

        } catch (error) {
            console.error('Export custom report failed:', error);
            this.showToast('报告生成失败', 'error');
            throw error;
        }
    }

    /**
     * 生成报告 HTML
     */
    generateReportHTML(data) {
        const currentDate = new Date().toLocaleDateString('zh-CN');

        return `
            <div style="font-family: 'Microsoft YaHei', Arial, sans-serif; color: #333;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #9FA8B8; padding-bottom: 20px;">
                    <h1 style="color: #9FA8B8; margin: 0 0 10px 0; font-size: 32px;">痤疮评估报告</h1>
                    <p style="color: #8B8B8B; margin: 0; font-size: 14px;">重庆联合丽格第五医疗美容医院</p>
                    <p style="color: #8B8B8B; margin: 5px 0 0 0; font-size: 12px;">生成日期: ${currentDate}</p>
                </div>

                ${data.gagsScore ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #4A4A4A; font-size: 24px; border-left: 4px solid #9FA8B8; padding-left: 15px; margin-bottom: 15px;">
                        GAGS 评分结果
                    </h2>
                    <div style="background: #F5F4F1; padding: 20px; border-radius: 8px;">
                        <p style="font-size: 18px; margin: 0 0 10px 0;">
                            <strong>总分:</strong> <span style="color: #9FA8B8; font-size: 28px; font-weight: bold;">${data.gagsScore.total}</span> 分
                        </p>
                        <p style="font-size: 16px; margin: 0; color: #8B8B8B;">
                            <strong>严重程度:</strong> ${data.gagsScore.severity}
                        </p>
                    </div>
                </div>
                ` : ''}

                ${data.recommendations ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #4A4A4A; font-size: 24px; border-left: 4px solid #9FA8B8; padding-left: 15px; margin-bottom: 15px;">
                        推荐治疗方案
                    </h2>
                    <div style="background: #F5F4F1; padding: 20px; border-radius: 8px;">
                        ${data.recommendations.map(rec => `
                            <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #E8E6E3;">
                                <h3 style="color: #9FA8B8; font-size: 18px; margin: 0 0 8px 0;">${rec.title}</h3>
                                <p style="margin: 0; line-height: 1.6; color: #666;">${rec.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}

                ${data.timeline ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #4A4A4A; font-size: 24px; border-left: 4px solid #9FA8B8; padding-left: 15px; margin-bottom: 15px;">
                        治疗时间规划
                    </h2>
                    <div style="background: #F5F4F1; padding: 20px; border-radius: 8px;">
                        <p style="margin: 0 0 10px 0; line-height: 1.8;">
                            <strong>疗程:</strong> ${data.timeline.duration}<br>
                            <strong>治疗次数:</strong> ${data.timeline.sessions}<br>
                            <strong>间隔:</strong> ${data.timeline.interval}
                        </p>
                    </div>
                </div>
                ` : ''}

                ${data.cost ? `
                <div style="margin-bottom: 30px;">
                    <h2 style="color: #4A4A4A; font-size: 24px; border-left: 4px solid #9FA8B8; padding-left: 15px; margin-bottom: 15px;">
                        预估费用
                    </h2>
                    <div style="background: #F5F4F1; padding: 20px; border-radius: 8px;">
                        <p style="margin: 0; font-size: 18px; color: #9FA8B8;">
                            <strong>${data.cost.range}</strong>
                        </p>
                        <p style="margin: 10px 0 0 0; font-size: 14px; color: #8B8B8B;">
                            * 具体费用以实际面诊为准
                        </p>
                    </div>
                </div>
                ` : ''}

                <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E8E6E3; text-align: center; color: #8B8B8B; font-size: 12px;">
                    <p style="margin: 0;">本报告仅供参考，不构成医疗建议。</p>
                    <p style="margin: 5px 0 0 0;">如需专业诊疗，请预约面诊。</p>
                    <p style="margin: 15px 0 0 0;">咨询电话: 023-68726872</p>
                </div>
            </div>
        `;
    }

    /**
     * 下载 Blob
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
     * 显示提示信息
     */
    showToast(message, type = 'info') {
        // 如果页面有 toast 函数，使用它
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
            return;
        }

        // 否则创建简单的提示
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
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.reportExporter = new ReportExporter();
    });
} else {
    window.reportExporter = new ReportExporter();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ReportExporter;
}
