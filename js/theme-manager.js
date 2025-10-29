/**
 * 主题和设置管理器
 * 负责主题切换、设置保存、字号调整等
 */

class ThemeManager {
    constructor() {
        this.settings = this.loadSettings();
        this.init();
    }

    // 初始化
    init() {
        this.applyTheme(this.settings.theme);
        this.applyFontSize(this.settings.fontSize);
        this.updateAIConfig();
    }

    // 加载设置
    loadSettings() {
        const stored = localStorage.getItem(STORAGE_KEYS.settings);
        if (stored) {
            try {
                return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
            } catch (e) {
                console.error('Failed to load settings:', e);
            }
        }
        return { ...DEFAULT_SETTINGS };
    }

    // 保存设置
    saveSettings() {
        localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(this.settings));
        this.dispatchSettingsChange();
    }

    // 应用主题
    applyTheme(themeId) {
        const theme = THEMES[themeId];
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--${this.camelToKebab(key)}`, value);
        });

        this.settings.theme = themeId;
        this.saveSettings();
    }

    // 应用字号
    applyFontSize(sizeId) {
        const fontSize = FONT_SIZES[sizeId];
        if (!fontSize) return;

        const root = document.documentElement;
        root.style.setProperty('--base-font-size', fontSize.base);
        root.style.setProperty('--heading1-size', fontSize.heading1);
        root.style.setProperty('--heading2-size', fontSize.heading2);
        root.style.setProperty('--heading3-size', fontSize.heading3);
        root.style.setProperty('--body-size', fontSize.body);
        root.style.setProperty('--small-size', fontSize.small);

        this.settings.fontSize = sizeId;
        this.saveSettings();
    }

    // 设置AI风格
    setAIStyle(styleId) {
        if (!AI_CONFIG.styles[styleId]) return;
        this.settings.aiStyle = styleId;
        this.saveSettings();
        this.updateAIConfig();
    }

    // 设置AI输出长度
    setAILength(lengthId) {
        if (!AI_CONFIG.lengths[lengthId]) return;
        this.settings.aiLength = lengthId;
        this.saveSettings();
        this.updateAIConfig();
    }

    // 更新AI配置
    updateAIConfig() {
        const event = new CustomEvent('aiConfigChanged', {
            detail: {
                style: AI_CONFIG.styles[this.settings.aiStyle],
                length: AI_CONFIG.lengths[this.settings.aiLength]
            }
        });
        window.dispatchEvent(event);
    }

    // 获取当前AI配置
    getAIConfig() {
        return {
            style: AI_CONFIG.styles[this.settings.aiStyle],
            length: AI_CONFIG.lengths[this.settings.aiLength],
            systemPrompt: this.buildSystemPrompt()
        };
    }

    // 构建系统提示词
    buildSystemPrompt() {
        const style = AI_CONFIG.styles[this.settings.aiStyle];
        const length = AI_CONFIG.lengths[this.settings.aiLength];
        return `${style.systemPrompt}\n\n${length.instruction}`;
    }

    // 切换设置项
    toggleSetting(key) {
        if (typeof this.settings[key] === 'boolean') {
            this.settings[key] = !this.settings[key];
            this.saveSettings();
        }
    }

    // 获取设置
    getSetting(key) {
        return this.settings[key];
    }

    // 驼峰转短横线
    camelToKebab(str) {
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    }

    // 派发设置变更事件
    dispatchSettingsChange() {
        const event = new CustomEvent('settingsChanged', {
            detail: this.settings
        });
        window.dispatchEvent(event);
    }

    // 重置所有设置
    resetSettings() {
        this.settings = { ...DEFAULT_SETTINGS };
        this.saveSettings();
        this.init();
    }
}

// 创建全局实例
window.themeManager = new ThemeManager();
