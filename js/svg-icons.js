/**
 * SVG 图标系统
 * 提供常用图标的 SVG 实现，替代 emoji，提升专业性
 */

class SVGIcons {
    constructor() {
        this.icons = this.initIcons();
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        this.injectIconSprite();
        console.log('✅ SVG Icons system initialized');
    }

    /**
     * 初始化图标库
     */
    initIcons() {
        return {
            // 基础图标
            'check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
            'x': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`,
            'chevron-right': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>`,
            'chevron-left': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>`,
            'chevron-down': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
            'chevron-up': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"></polyline></svg>`,

            // 功能图标
            'search': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>`,
            'settings': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v6m0 6v6m4.22-13.22 4.24 4.24m-8.46 8.46-4.24 4.24M1 12h6m6 0h6M4.22 4.22l4.24 4.24m8.46 0 4.24-4.24"></path></svg>`,
            'menu': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`,
            'user': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
            'heart': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
            'star': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,

            // 医疗相关
            'medical': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>`,
            'pill': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>`,
            'shield': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,

            // 信息图标
            'info': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
            'alert': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
            'help': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,

            // 动作图标
            'download': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`,
            'upload': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
            'copy': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`,
            'trash': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`,
            'edit': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,

            // 联系方式
            'phone': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>`,
            'mail': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
            'map-pin': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
            'calendar': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
            'clock': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,

            // 文件相关
            'file': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>`,
            'folder': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>`,
            'book': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
            'image': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`,

            // 社交
            'share': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
            'message': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,

            // 其他
            'sun': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
            'moon': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
            'zap': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
            'home': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
        };
    }

    /**
     * 注入图标 Sprite 到页面
     */
    injectIconSprite() {
        if (document.getElementById('svg-icon-sprite')) return;

        const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        sprite.id = 'svg-icon-sprite';
        sprite.style.display = 'none';
        sprite.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

        for (const [name, svg] of Object.entries(this.icons)) {
            const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
            symbol.id = `icon-${name}`;
            symbol.innerHTML = svg.replace(/<svg[^>]*>|<\/svg>/g, '');

            // 提取 viewBox
            const viewBoxMatch = svg.match(/viewBox="([^"]*)"/);
            if (viewBoxMatch) {
                symbol.setAttribute('viewBox', viewBoxMatch[1]);
            }

            sprite.appendChild(symbol);
        }

        document.body.appendChild(sprite);

        // 注入样式
        this.injectStyles();
    }

    /**
     * 获取图标 HTML
     * @param {string} name - 图标名称
     * @param {object} options - 选项
     */
    getIcon(name, options = {}) {
        const {
            size = 24,
            className = '',
            color = 'currentColor',
            strokeWidth = 2
        } = options;

        if (!this.icons[name]) {
            console.warn(`Icon "${name}" not found`);
            return '';
        }

        return `
            <svg class="svg-icon ${className}"
                 width="${size}"
                 height="${size}"
                 style="color: ${color}; stroke-width: ${strokeWidth}">
                <use href="#icon-${name}"></use>
            </svg>
        `;
    }

    /**
     * 创建图标元素
     */
    createIcon(name, options = {}) {
        const div = document.createElement('div');
        div.innerHTML = this.getIcon(name, options);
        return div.firstElementChild;
    }

    /**
     * 替换元素中的 emoji 为 SVG 图标
     * @param {HTMLElement} element - 要替换的元素
     * @param {object} mapping - emoji到图标名的映射
     */
    replaceEmojis(element, mapping = {}) {
        const defaultMapping = {
            '⚙️': 'settings',
            '🔍': 'search',
            '📋': 'copy',
            '🗑️': 'trash',
            '📥': 'download',
            '📤': 'upload',
            '📞': 'phone',
            '📧': 'mail',
            '📍': 'map-pin',
            '📅': 'calendar',
            '⏰': 'clock',
            '❤️': 'heart',
            '⭐': 'star',
            '✅': 'check',
            '❌': 'x',
            '➡️': 'chevron-right',
            '⬅️': 'chevron-left',
            '⬇️': 'chevron-down',
            '⬆️': 'chevron-up',
            '💊': 'pill',
            '🛡️': 'shield',
            'ℹ️': 'info',
            '⚠️': 'alert',
            '❓': 'help',
            '💡': 'zap',
            '🏠': 'home',
            '📖': 'book',
            '📁': 'folder',
            '📄': 'file',
            '🖼️': 'image',
            '💬': 'message',
            '🔗': 'share',
            '☀️': 'sun',
            '🌙': 'moon',
        };

        const fullMapping = { ...defaultMapping, ...mapping };

        // 递归替换文本节点中的 emoji
        const walk = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.textContent;
                let hasReplacement = false;

                for (const [emoji, iconName] of Object.entries(fullMapping)) {
                    if (text.includes(emoji)) {
                        hasReplacement = true;
                        break;
                    }
                }

                if (hasReplacement) {
                    const span = document.createElement('span');
                    let lastIndex = 0;
                    let html = '';

                    // 查找所有 emoji 并替换
                    for (let i = 0; i < text.length; i++) {
                        for (const [emoji, iconName] of Object.entries(fullMapping)) {
                            if (text.substr(i, emoji.length) === emoji) {
                                html += text.substring(lastIndex, i);
                                html += this.getIcon(iconName, { size: 16, className: 'inline-icon' });
                                i += emoji.length - 1;
                                lastIndex = i + 1;
                                break;
                            }
                        }
                    }

                    html += text.substring(lastIndex);
                    span.innerHTML = html;

                    node.parentNode.replaceChild(span, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                Array.from(node.childNodes).forEach(walk);
            }
        };

        walk(element);
    }

    /**
     * 注入样式
     */
    injectStyles() {
        if (document.getElementById('svg-icons-styles')) return;

        const style = document.createElement('style');
        style.id = 'svg-icons-styles';
        style.textContent = `
            /* SVG 图标样式 */
            .svg-icon {
                display: inline-block;
                vertical-align: middle;
                stroke: currentColor;
                fill: none;
                stroke-linecap: round;
                stroke-linejoin: round;
            }

            .svg-icon.inline-icon {
                vertical-align: text-bottom;
                margin: 0 2px;
            }

            /* 图标动画 */
            .svg-icon.spin {
                animation: svg-icon-spin 1s linear infinite;
            }

            .svg-icon.pulse {
                animation: svg-icon-pulse 2s ease-in-out infinite;
            }

            @keyframes svg-icon-spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @keyframes svg-icon-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }

            /* 可交互图标 */
            button .svg-icon,
            a .svg-icon,
            .clickable .svg-icon {
                transition: all 0.2s ease;
            }

            button:hover .svg-icon,
            a:hover .svg-icon,
            .clickable:hover .svg-icon {
                transform: scale(1.1);
            }
        `;

        document.head.appendChild(style);
    }

    /**
     * 批量获取图标
     */
    getIcons(names, options = {}) {
        return names.map(name => this.getIcon(name, options)).join('');
    }

    /**
     * 检查图标是否存在
     */
    hasIcon(name) {
        return !!this.icons[name];
    }

    /**
     * 获取所有图标名称
     */
    getAllIconNames() {
        return Object.keys(this.icons);
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.svgIcons = new SVGIcons();
    });
} else {
    window.svgIcons = new SVGIcons();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGIcons;
}
