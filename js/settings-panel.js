/**
 * 设置面板UI组件
 * 提供可视化的设置界面
 */

class SettingsPanel {
    constructor() {
        this.isOpen = false;
        this.render();
        this.attachEvents();
    }

    render() {
        const panel = document.createElement('div');
        panel.id = 'settings-panel';
        panel.className = 'settings-panel';
        panel.innerHTML = this.generateHTML();
        document.body.appendChild(panel);
    }

    generateHTML() {
        const currentSettings = window.themeManager.settings;

        return `
            <style>
                .settings-panel {
                    position: fixed;
                    top: 0;
                    right: -100%;
                    width: 100%;
                    max-width: 400px;
                    height: 100vh;
                    background: var(--surface, #FFFFFF);
                    box-shadow: -4px 0 20px rgba(0,0,0,0.1);
                    z-index: 10000;
                    transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow-y: auto;
                }

                .settings-panel.open {
                    right: 0;
                }

                .settings-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100vh;
                    background: rgba(0,0,0,0.3);
                    backdrop-filter: blur(4px);
                    z-index: 9999;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }

                .settings-overlay.show {
                    opacity: 1;
                    pointer-events: auto;
                }

                .settings-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--border, #E8E6E3);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: var(--surface-light, #F5F4F1);
                }

                .settings-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    color: var(--text, #4A4A4A);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .settings-close {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: transparent;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                    font-size: 1.5rem;
                    color: var(--text-secondary, #8B8B8B);
                }

                .settings-close:hover {
                    background: var(--border-light, #F0EEE9);
                    color: var(--text, #4A4A4A);
                }

                .settings-content {
                    padding: 1.5rem;
                }

                .settings-section {
                    margin-bottom: 2rem;
                }

                .settings-section:last-child {
                    margin-bottom: 0;
                }

                .settings-section-title {
                    font-size: 0.95rem;
                    font-weight: 600;
                    color: var(--text-secondary, #8B8B8B);
                    margin-bottom: 0.8rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .theme-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 0.8rem;
                }

                .theme-option {
                    padding: 1rem;
                    border: 2px solid var(--border, #E8E6E3);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                }

                .theme-option:hover {
                    border-color: var(--primary, #9FA8B8);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                }

                .theme-option.active {
                    border-color: var(--highlight, #D4A5A5);
                    background: var(--surface-light, #F5F4F1);
                }

                .theme-color-preview {
                    display: flex;
                    gap: 0.3rem;
                    margin-bottom: 0.6rem;
                    justify-content: center;
                }

                .theme-color {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    border: 1px solid rgba(0,0,0,0.1);
                }

                .theme-name {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text, #4A4A4A);
                }

                .settings-options {
                    display: flex;
                    gap: 0.6rem;
                }

                .setting-option {
                    flex: 1;
                    padding: 0.8rem;
                    border: 2px solid var(--border, #E8E6E3);
                    border-radius: 10px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.2s ease;
                    background: var(--surface, #FFFFFF);
                }

                .setting-option:hover {
                    border-color: var(--primary, #9FA8B8);
                    transform: translateY(-2px);
                }

                .setting-option.active {
                    border-color: var(--highlight, #D4A5A5);
                    background: var(--surface-light, #F5F4F1);
                }

                .setting-option-label {
                    font-size: 0.9rem;
                    font-weight: 500;
                    color: var(--text, #4A4A4A);
                }

                .setting-option-desc {
                    font-size: 0.75rem;
                    color: var(--text-secondary, #8B8B8B);
                    margin-top: 0.2rem;
                }

                .settings-reset {
                    width: 100%;
                    padding: 0.9rem;
                    border: 1px solid var(--border, #E8E6E3);
                    border-radius: 10px;
                    background: var(--surface, #FFFFFF);
                    color: var(--text-secondary, #8B8B8B);
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    margin-top: 1.5rem;
                }

                .settings-reset:hover {
                    border-color: var(--error, #F5ADA8);
                    color: var(--error, #F5ADA8);
                    background: var(--surface-light, #F5F4F1);
                }

                @media (max-width: 768px) {
                    .settings-panel {
                        max-width: 100%;
                    }

                    .theme-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>

            <div class="settings-header">
                <div class="settings-title">
                    <span>⚙️</span>
                    <span>设置</span>
                </div>
                <button class="settings-close" onclick="window.settingsPanel.close()">×</button>
            </div>

            <div class="settings-content">
                <!-- 主题皮肤 -->
                <div class="settings-section">
                    <div class="settings-section-title">主题皮肤</div>
                    <div class="theme-grid" id="theme-options">
                        ${this.renderThemeOptions(currentSettings.theme)}
                    </div>
                </div>

                <!-- 字号设置 -->
                <div class="settings-section">
                    <div class="settings-section-title">字号大小</div>
                    <div class="settings-options" id="font-size-options">
                        ${this.renderFontSizeOptions(currentSettings.fontSize)}
                    </div>
                </div>

                <!-- AI输出风格 -->
                <div class="settings-section">
                    <div class="settings-section-title">AI输出风格</div>
                    <div class="settings-options" id="ai-style-options">
                        ${this.renderAIStyleOptions(currentSettings.aiStyle)}
                    </div>
                </div>

                <!-- AI输出长度 -->
                <div class="settings-section">
                    <div class="settings-section-title">AI输出长度</div>
                    <div class="settings-options" id="ai-length-options">
                        ${this.renderAILengthOptions(currentSettings.aiLength)}
                    </div>
                </div>

                <!-- 重置设置 -->
                <button class="settings-reset" onclick="window.settingsPanel.resetSettings()">
                    重置所有设置
                </button>
            </div>
        `;
    }

    renderThemeOptions(current) {
        return Object.entries(THEMES).map(([id, theme]) => {
            const isActive = id === current;
            return `
                <div class="theme-option ${isActive ? 'active' : ''}"
                     onclick="window.settingsPanel.changeTheme('${id}')">
                    <div class="theme-color-preview">
                        <div class="theme-color" style="background: ${theme.colors.primary}"></div>
                        <div class="theme-color" style="background: ${theme.colors.accent}"></div>
                        <div class="theme-color" style="background: ${theme.colors.highlight}"></div>
                    </div>
                    <div class="theme-name">${theme.name}</div>
                </div>
            `;
        }).join('');
    }

    renderFontSizeOptions(current) {
        return Object.entries(FONT_SIZES).map(([id, size]) => {
            const isActive = id === current;
            return `
                <div class="setting-option ${isActive ? 'active' : ''}"
                     onclick="window.settingsPanel.changeFontSize('${id}')">
                    <div class="setting-option-label">${size.name}</div>
                </div>
            `;
        }).join('');
    }

    renderAIStyleOptions(current) {
        return Object.entries(AI_CONFIG.styles).map(([id, style]) => {
            const isActive = id === current;
            return `
                <div class="setting-option ${isActive ? 'active' : ''}"
                     onclick="window.settingsPanel.changeAIStyle('${id}')">
                    <div class="setting-option-label">${style.name}</div>
                </div>
            `;
        }).join('');
    }

    renderAILengthOptions(current) {
        return Object.entries(AI_CONFIG.lengths).map(([id, length]) => {
            const isActive = id === current;
            return `
                <div class="setting-option ${isActive ? 'active' : ''}"
                     onclick="window.settingsPanel.changeAILength('${id}')">
                    <div class="setting-option-label">${length.name}</div>
                </div>
            `;
        }).join('');
    }

    attachEvents() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.className = 'settings-overlay';
        overlay.onclick = () => this.close();
        document.body.appendChild(overlay);
        this.overlay = overlay;
    }

    open() {
        this.isOpen = true;
        document.getElementById('settings-panel').classList.add('open');
        this.overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        document.getElementById('settings-panel').classList.remove('open');
        this.overlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    changeTheme(themeId) {
        window.themeManager.applyTheme(themeId);
        this.refreshOptions();
    }

    changeFontSize(sizeId) {
        window.themeManager.applyFontSize(sizeId);
        this.refreshOptions();
    }

    changeAIStyle(styleId) {
        window.themeManager.setAIStyle(styleId);
        this.refreshOptions();
    }

    changeAILength(lengthId) {
        window.themeManager.setAILength(lengthId);
        this.refreshOptions();
    }

    refreshOptions() {
        const currentSettings = window.themeManager.settings;
        document.getElementById('theme-options').innerHTML = this.renderThemeOptions(currentSettings.theme);
        document.getElementById('font-size-options').innerHTML = this.renderFontSizeOptions(currentSettings.fontSize);
        document.getElementById('ai-style-options').innerHTML = this.renderAIStyleOptions(currentSettings.aiStyle);
        document.getElementById('ai-length-options').innerHTML = this.renderAILengthOptions(currentSettings.aiLength);
    }

    resetSettings() {
        if (confirm('确定要重置所有设置吗？')) {
            window.themeManager.resetSettings();
            this.refreshOptions();
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.settingsPanel = new SettingsPanel();
});
