/**
 * 全局配置文件
 * 包含企业信息、主题系统、AI配置等
 */

// 企业信息
const COMPANY_INFO = {
    name: '重庆联合丽格第五医疗美容医院',
    shortName: '联合丽格',
    address: '重庆市渝中区临江支路28号',
    phone: '023-68726872',
    email: 'bccsw@cqlhlg.work',
    wechatQR: 'https://docs.bccsw.cn/consultant.png',
    wechatLink: 'https://work.weixin.qq.com/kfid/kfcfc2a809493f31e8f',
    logo: 'https://docs.bccsw.cn/logo.png',
    favicon: 'https://docs.bccsw.cn/favicon.png',
    icp: '渝ICP备15004871号',
    icpLink: 'https://beian.miit.gov.cn/',
    police: '渝公网安备 50010302001456号',
    policeLink: 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=50010302001456'
};

// 主题配置 - 优雅女性化设计
const THEMES = {
    elegant: {
        name: '优雅米白',
        id: 'elegant',
        colors: {
            // 主色调 - 高级灰和米白
            primary: '#9FA8B8',
            primaryLight: '#C5CCD6',
            primaryDark: '#6B7785',

            // 背景色
            background: '#FAF9F6', // 米白色
            surface: '#FFFFFF',
            surfaceLight: '#F5F4F1',

            // 文字颜色
            text: '#4A4A4A',
            textSecondary: '#8B8B8B',
            textLight: '#B8B8B8',

            // 辅助色 - 柔和冷暖结合
            accent: '#B4D7D3', // 薄荷绿
            accentSecondary: '#D4C4E0', // 淡紫
            accentTertiary: '#C9DBE8', // 粉蓝

            // 强调色 - 温暖点缀
            highlight: '#D4A5A5', // 玫瑰金
            highlightSecondary: '#F5C7C7', // 浅珊瑚

            // 功能色
            success: '#A8D5BA',
            warning: '#F5D7A8',
            error: '#F5ADA8',
            info: '#A8C7F5',

            // 边框
            border: '#E8E6E3',
            borderLight: '#F0EEE9'
        }
    },

    rose: {
        name: '玫瑰粉',
        id: 'rose',
        colors: {
            primary: '#D4A5A5',
            primaryLight: '#E8C5C5',
            primaryDark: '#B87B7B',
            background: '#FFF5F5',
            surface: '#FFFFFF',
            surfaceLight: '#FFF0F0',
            text: '#4A4A4A',
            textSecondary: '#8B8B8B',
            textLight: '#B8B8B8',
            accent: '#F5C7C7',
            accentSecondary: '#E8C7D7',
            accentTertiary: '#D7C7E8',
            highlight: '#C79595',
            highlightSecondary: '#D7A5A5',
            success: '#A8D5BA',
            warning: '#F5D7A8',
            error: '#F5ADA8',
            info: '#C7A5D7',
            border: '#F0E0E0',
            borderLight: '#F5E8E8'
        }
    },

    mint: {
        name: '清新薄荷',
        id: 'mint',
        colors: {
            primary: '#A8D5C5',
            primaryLight: '#C5E8D7',
            primaryDark: '#7BB8A5',
            background: '#F5FAF8',
            surface: '#FFFFFF',
            surfaceLight: '#F0F8F5',
            text: '#4A4A4A',
            textSecondary: '#8B8B8B',
            textLight: '#B8B8B8',
            accent: '#B4D7D3',
            accentSecondary: '#C7D7E8',
            accentTertiary: '#D7C7E8',
            highlight: '#95C7B5',
            highlightSecondary: '#A5D7C5',
            success: '#A8D5BA',
            warning: '#F5D7A8',
            error: '#F5ADA8',
            info: '#A8C7F5',
            border: '#E0F0E8',
            borderLight: '#E8F5F0'
        }
    },

    lavender: {
        name: '淡雅紫',
        id: 'lavender',
        colors: {
            primary: '#C4B5D7',
            primaryLight: '#D7C7E8',
            primaryDark: '#A595B8',
            background: '#F8F5FA',
            surface: '#FFFFFF',
            surfaceLight: '#F5F0F8',
            text: '#4A4A4A',
            textSecondary: '#8B8B8B',
            textLight: '#B8B8B8',
            accent: '#D4C4E0',
            accentSecondary: '#C7D7E8',
            accentTertiary: '#E8C7D7',
            highlight: '#B5A5C7',
            highlightSecondary: '#C7B5D7',
            success: '#A8D5BA',
            warning: '#F5D7A8',
            error: '#F5ADA8',
            info: '#C7A5D7',
            border: '#E8E0F0',
            borderLight: '#F0E8F5'
        }
    }
};

// 字号设置
const FONT_SIZES = {
    small: {
        name: '小',
        id: 'small',
        base: '14px',
        heading1: '1.8rem',
        heading2: '1.5rem',
        heading3: '1.2rem',
        body: '0.95rem',
        small: '0.85rem'
    },
    medium: {
        name: '中',
        id: 'medium',
        base: '16px',
        heading1: '2rem',
        heading2: '1.6rem',
        heading3: '1.3rem',
        body: '1rem',
        small: '0.9rem'
    },
    large: {
        name: '大',
        id: 'large',
        base: '18px',
        heading1: '2.2rem',
        heading2: '1.8rem',
        heading3: '1.4rem',
        body: '1.1rem',
        small: '0.95rem'
    }
};

// AI配置
const AI_CONFIG = {
    styles: {
        casual: {
            name: '轻松幽默',
            id: 'casual',
            description: '用轻松活泼的语气，适合日常咨询',
            systemPrompt: '你是一位亲切友好的医美咨询顾问，用轻松幽默但专业的语气回答问题。适当使用比喻和生活化的例子，让医美知识变得容易理解。'
        },
        standard: {
            name: '标准日常',
            id: 'standard',
            description: '平衡专业性与亲和力',
            systemPrompt: '你是一位专业的医美咨询顾问，用清晰易懂的语言解答问题。保持专业但不失温度，让用户感到安心和信任。'
        },
        scientific: {
            name: '科学严谨',
            id: 'scientific',
            description: '强调医学专业性和准确性',
            systemPrompt: '你是一位严谨的医美专家，用专业的医学术语和科学的方法解答问题。确保信息准确性，引用专业文献和研究成果。'
        }
    },

    lengths: {
        concise: {
            name: '简约',
            id: 'concise',
            description: '简洁明了，快速获取要点',
            maxTokens: 300,
            instruction: '请用简洁的语言回答，控制在200字以内，突出重点。'
        },
        standard: {
            name: '标准',
            id: 'standard',
            description: '详略得当，平衡全面性',
            maxTokens: 600,
            instruction: '请详略得当地回答，控制在500字左右，既要全面又要精炼。'
        },
        detailed: {
            name: '详细',
            id: 'detailed',
            description: '全面深入，获取完整信息',
            maxTokens: 1200,
            instruction: '请详细全面地回答，可以展开说明，包含背景知识、具体步骤、注意事项等。'
        }
    },

    imageModel: 'nano-banana', // 图片处理模型

    // iOS兼容性配置
    iosCompatibility: {
        usePolyfill: true,
        timeout: 30000,
        retryAttempts: 3
    }
};

// 默认设置
const DEFAULT_SETTINGS = {
    theme: 'elegant',
    fontSize: 'medium',
    aiStyle: 'standard',
    aiLength: 'concise',
    enableHistory: true,
    enableAutoSuggestions: true,
    enableWordSelection: true
};

// 本地存储键名
const STORAGE_KEYS = {
    settings: 'acne_settings',
    aiHistory: 'acne_ai_history',
    readingProgress: 'acne_reading_progress',
    bookmarks: 'acne_bookmarks',
    favorites: 'acne_favorites'
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COMPANY_INFO,
        THEMES,
        FONT_SIZES,
        AI_CONFIG,
        DEFAULT_SETTINGS,
        STORAGE_KEYS
    };
}
