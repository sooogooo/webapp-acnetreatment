/**
 * 自动生成追问建议
 * 基于对话上下文智能生成相关的追问问题
 */

class FollowUpQuestions {
    constructor() {
        this.currentContext = null;
        this.questionTemplates = this.initTemplates();
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        console.log('✅ Follow-up Questions system initialized');
    }

    /**
     * 初始化问题模板库
     */
    initTemplates() {
        return {
            // 痤疮严重程度相关
            severity: {
                keywords: ['轻度', '中度', '重度', '严重', '程度', 'GAGS', '评分'],
                questions: [
                    '这个严重程度需要治疗多久？',
                    '费用大概是多少？',
                    '有哪些推荐的治疗方案？',
                    '如果不治疗会有什么后果？',
                    '可以完全治愈吗？'
                ]
            },

            // 治疗方案相关
            treatment: {
                keywords: ['激光', '光动力', '果酸', '水杨酸', '微针', '治疗', '方案'],
                questions: [
                    '这个治疗需要做几次？',
                    '治疗过程会痛吗？',
                    '治疗后多久能看到效果？',
                    '有什么副作用或风险吗？',
                    '治疗后需要注意什么？'
                ]
            },

            // 费用相关
            cost: {
                keywords: ['费用', '价格', '多少钱', '花费', '预算'],
                questions: [
                    '费用包含哪些项目？',
                    '有优惠活动吗？',
                    '可以分期付款吗？',
                    '后续还需要额外费用吗？',
                    '有性价比更高的方案吗？'
                ]
            },

            // 护理相关
            skincare: {
                keywords: ['护肤', '护理', '保养', '清洁', '防晒', '保湿'],
                questions: [
                    '推荐使用什么护肤品？',
                    '哪些成分需要避免？',
                    '多久清洁一次比较好？',
                    '如何正确使用防晒霜？',
                    '可以化妆吗？'
                ]
            },

            // 饮食相关
            diet: {
                keywords: ['饮食', '吃', '食物', '忌口', '营养'],
                questions: [
                    '有哪些食物需要避免？',
                    '应该多吃什么？',
                    '奶制品会加重痘痘吗？',
                    '甜食会导致长痘吗？',
                    '补充哪些营养素有帮助？'
                ]
            },

            // 效果相关
            result: {
                keywords: ['效果', '见效', '改善', '恢复', '结果'],
                questions: [
                    '多久能看到明显效果？',
                    '效果能维持多久？',
                    '会反弹吗？',
                    '如何巩固效果？',
                    '可以看前后对比案例吗？'
                ]
            },

            // 副作用相关
            sideEffect: {
                keywords: ['副作用', '风险', '安全', '不良反应', '危害'],
                questions: [
                    '这个治疗安全吗？',
                    '常见的副作用有哪些？',
                    '如何降低副作用风险？',
                    '出现副作用怎么处理？',
                    '哪些人不适合这个治疗？'
                ]
            },

            // 预约相关
            appointment: {
                keywords: ['预约', '面诊', '咨询', '挂号', '医生'],
                questions: [
                    '如何预约面诊？',
                    '面诊需要准备什么？',
                    '可以指定医生吗？',
                    '面诊是免费的吗？',
                    '预约后可以改时间吗？'
                ]
            }
        };
    }

    /**
     * 基于对话内容生成追问
     * @param {string} question - 用户问题
     * @param {string} answer - AI回答
     * @param {number} count - 生成追问数量
     */
    generate(question, answer, count = 3) {
        this.currentContext = { question, answer };

        // 分析关键词
        const matchedCategories = this.analyzeKeywords(question + ' ' + answer);

        // 生成追问
        const questions = this.selectQuestions(matchedCategories, count);

        return questions;
    }

    /**
     * 分析关键词匹配分类
     */
    analyzeKeywords(text) {
        const matched = [];

        for (const [category, data] of Object.entries(this.questionTemplates)) {
            let score = 0;

            // 计算关键词匹配分数
            for (const keyword of data.keywords) {
                const regex = new RegExp(keyword, 'gi');
                const matches = text.match(regex);
                if (matches) {
                    score += matches.length;
                }
            }

            if (score > 0) {
                matched.push({ category, score, data });
            }
        }

        // 按分数排序
        matched.sort((a, b) => b.score - a.score);

        return matched;
    }

    /**
     * 选择追问问题
     */
    selectQuestions(matchedCategories, count) {
        const questions = [];
        const usedQuestions = new Set();

        // 从匹配的分类中选择问题
        for (const { data } of matchedCategories) {
            if (questions.length >= count) break;

            // 随机选择一个未使用的问题
            const availableQuestions = data.questions.filter(q => !usedQuestions.has(q));
            if (availableQuestions.length === 0) continue;

            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            const selectedQuestion = availableQuestions[randomIndex];

            questions.push(selectedQuestion);
            usedQuestions.add(selectedQuestion);
        }

        // 如果问题不足，添加通用问题
        if (questions.length < count) {
            const genericQuestions = this.getGenericQuestions();
            for (const q of genericQuestions) {
                if (questions.length >= count) break;
                if (!usedQuestions.has(q)) {
                    questions.push(q);
                    usedQuestions.add(q);
                }
            }
        }

        return questions;
    }

    /**
     * 获取通用问题
     */
    getGenericQuestions() {
        return [
            '还有其他需要注意的吗？',
            '可以了解更多细节吗？',
            '有相关的案例可以参考吗？',
            '这个适合我的情况吗？',
            '还有什么想了解的？'
        ];
    }

    /**
     * 渲染追问UI
     * @param {Array} questions - 追问列表
     * @param {HTMLElement} container - 容器元素
     * @param {Function} onQuestionClick - 点击回调
     */
    render(questions, container, onQuestionClick) {
        if (!questions || questions.length === 0) return;

        // 清空容器
        container.innerHTML = '';

        // 创建追问区域
        const followUpDiv = document.createElement('div');
        followUpDiv.className = 'follow-up-questions';
        followUpDiv.innerHTML = `
            <div class="follow-up-header">
                <span class="follow-up-icon">💡</span>
                <span class="follow-up-title">您可能还想了解</span>
            </div>
            <div class="follow-up-list">
                ${questions.map((q, index) => `
                    <button class="follow-up-btn" data-question="${this.escapeHtml(q)}">
                        ${index + 1}. ${this.escapeHtml(q)}
                    </button>
                `).join('')}
            </div>
        `;

        container.appendChild(followUpDiv);

        // 绑定点击事件
        followUpDiv.querySelectorAll('.follow-up-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.dataset.question;
                if (onQuestionClick) {
                    onQuestionClick(question);
                }
            });
        });

        // 注入样式（如果还没有）
        this.injectStyles();
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
     * 注入样式
     */
    injectStyles() {
        if (document.getElementById('follow-up-questions-styles')) return;

        const style = document.createElement('style');
        style.id = 'follow-up-questions-styles';
        style.textContent = `
            /* 追问建议区域 */
            .follow-up-questions {
                margin-top: 1.5rem;
                padding: 1.5rem;
                background: linear-gradient(135deg, #F3E5F5 0%, #E3F2FD 100%);
                border-radius: 12px;
                border: 1px solid var(--border, #E8E6E3);
            }

            .follow-up-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .follow-up-icon {
                font-size: 1.2rem;
            }

            .follow-up-title {
                font-size: 0.95rem;
                font-weight: 600;
                color: var(--text, #4A4A4A);
            }

            .follow-up-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
            }

            .follow-up-btn {
                padding: 0.875rem 1.25rem;
                background: white;
                border: 1px solid var(--border, #E8E6E3);
                border-radius: 8px;
                text-align: left;
                cursor: pointer;
                font-size: 0.9rem;
                color: var(--text, #4A4A4A);
                transition: all 0.2s ease;
                line-height: 1.5;
            }

            .follow-up-btn:hover {
                background: var(--surface-light, #F5F4F1);
                border-color: var(--primary, #9FA8B8);
                transform: translateX(4px);
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
            }

            .follow-up-btn:active {
                transform: translateX(2px);
            }

            /* 移动端适配 */
            @media (max-width: 768px) {
                .follow-up-questions {
                    padding: 1rem;
                }

                .follow-up-btn {
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                }
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * 基于主题生成专题追问
     * @param {string} topic - 主题
     */
    generateByTopic(topic) {
        const topicQuestions = {
            '激光治疗': [
                '激光治疗痘痘的原理是什么？',
                '激光治疗需要做几次才有效？',
                '激光治疗会留疤吗？',
                '激光治疗后多久可以化妆？',
                '不同类型的激光有什么区别？'
            ],
            '果酸焕肤': [
                '果酸焕肤适合什么样的痘痘？',
                '果酸浓度越高越好吗？',
                '果酸焕肤后会爆痘吗？',
                '多久做一次果酸焕肤？',
                '果酸焕肤后如何护理？'
            ],
            '护理方法': [
                '长痘期间如何正确清洁？',
                '痘痘肌适合用什么护肤品？',
                '可以用手挤痘痘吗？',
                '痘痘肌需要去角质吗？',
                '如何预防痘印形成？'
            ],
            '饮食建议': [
                '哪些食物会加重痘痘？',
                '喝牛奶会长痘吗？',
                '吃什么可以改善痘痘？',
                '需要戒糖吗？',
                '补充维生素有用吗？'
            ]
        };

        return topicQuestions[topic] || this.getGenericQuestions();
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.followUpQuestions = new FollowUpQuestions();
    });
} else {
    window.followUpQuestions = new FollowUpQuestions();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FollowUpQuestions;
}
