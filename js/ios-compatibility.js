/**
 * iOS 兼容性优化模块
 * 处理 Safari 特有的样式和交互问题
 */

class iOSCompatibility {
    constructor() {
        this.isIOS = this.detectIOS();
        this.isSafari = this.detectSafari();

        if (this.isIOS || this.isSafari) {
            this.init();
        }
    }

    /**
     * 检测是否为 iOS 设备
     */
    detectIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }

    /**
     * 检测是否为 Safari 浏览器
     */
    detectSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    /**
     * 初始化 iOS 优化
     */
    init() {
        console.log('🍎 iOS/Safari detected, applying compatibility fixes...');

        // 添加 iOS 标识 class
        document.documentElement.classList.add('ios-device');
        if (this.isSafari) {
            document.documentElement.classList.add('safari-browser');
        }

        // 应用各种优化
        this.fixViewportHeight();
        this.fixTouchHighlight();
        this.fixScrollBounce();
        this.fixInputZoom();
        this.fixBackdropFilter();
        this.handleKeyboardAppearance();

        console.log('✅ iOS compatibility fixes applied');
    }

    /**
     * 修复 iOS 视口高度问题
     * iOS Safari 的 100vh 包含了地址栏高度，导致页面底部被遮挡
     */
    fixViewportHeight() {
        // 设置 CSS 自定义属性
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        setVH();

        // 监听窗口大小变化（处理横竖屏切换）
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            /* iOS 视口高度修复 */
            .ios-device .full-height {
                height: 100vh;
                height: calc(var(--vh, 1vh) * 100);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 移除 iOS 触摸高亮
     */
    fixTouchHighlight() {
        const style = document.createElement('style');
        style.textContent = `
            /* 移除 iOS 点击高亮 */
            .ios-device * {
                -webkit-tap-highlight-color: transparent;
                -webkit-touch-callout: none;
            }

            /* 但保留表单元素的聚焦效果 */
            .ios-device input,
            .ios-device textarea,
            .ios-device select {
                -webkit-tap-highlight-color: rgba(159, 168, 184, 0.1);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 修复 iOS 滚动回弹问题
     */
    fixScrollBounce() {
        const style = document.createElement('style');
        style.textContent = `
            /* iOS 滚动优化 */
            .ios-device {
                -webkit-overflow-scrolling: touch;
            }

            /* 防止整个页面回弹 */
            .ios-device body {
                position: fixed;
                width: 100%;
                overflow: hidden;
            }

            /* 允许内容区滚动 */
            .ios-device .scrollable-content {
                position: relative;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 防止 iOS 输入框自动放大
     */
    fixInputZoom() {
        // 方法1: 确保输入框字体大小 >= 16px
        const style = document.createElement('style');
        style.textContent = `
            /* 防止 iOS 输入框放大页面 */
            .ios-device input[type="text"],
            .ios-device input[type="email"],
            .ios-device input[type="tel"],
            .ios-device input[type="number"],
            .ios-device textarea {
                font-size: 16px !important;
            }
        `;
        document.head.appendChild(style);

        // 方法2: 禁用用户缩放（可选）
        let viewport = document.querySelector('meta[name="viewport"]');
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }

        // 保存原始 viewport 内容
        const originalContent = viewport.content ||
            'width=device-width, initial-scale=1, viewport-fit=cover';

        // 当输入框聚焦时禁用缩放
        document.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                viewport.content = originalContent + ', maximum-scale=1';
            }
        });

        // 失焦时恢复缩放
        document.addEventListener('focusout', () => {
            viewport.content = originalContent;
        });
    }

    /**
     * 修复 Safari backdrop-filter 兼容性
     */
    fixBackdropFilter() {
        const style = document.createElement('style');
        style.textContent = `
            /* Safari backdrop-filter 前缀 */
            .safari-browser .backdrop-blur {
                -webkit-backdrop-filter: blur(10px);
                backdrop-filter: blur(10px);
            }

            /* 为不支持的浏览器提供降级方案 */
            @supports not (backdrop-filter: blur(10px)) {
                .backdrop-blur {
                    background-color: rgba(255, 255, 255, 0.95) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 处理键盘弹出时的页面调整
     */
    handleKeyboardAppearance() {
        let originalHeight = window.innerHeight;

        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;

            // 如果高度明显减小，说明键盘弹出
            if (currentHeight < originalHeight - 100) {
                document.body.classList.add('keyboard-visible');

                // 将聚焦的输入框滚动到可见区域
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
                    setTimeout(() => {
                        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 300);
                }
            } else {
                document.body.classList.remove('keyboard-visible');
                originalHeight = currentHeight;
            }
        });

        // 添加键盘可见时的样式
        const style = document.createElement('style');
        style.textContent = `
            /* 键盘弹出时的样式调整 */
            .ios-device.keyboard-visible {
                /* 可以在这里添加键盘弹出时的特殊样式 */
            }

            .ios-device.keyboard-visible .footer {
                display: none; /* 键盘弹出时隐藏 footer */
            }

            .ios-device.keyboard-visible .fixed-bottom {
                position: absolute; /* 改为绝对定位 */
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 修复 iOS 安全区域（刘海屏）
     */
    static applySafeAreaFix() {
        const style = document.createElement('style');
        style.textContent = `
            /* iOS 安全区域适配 */
            .ios-device {
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
                padding-left: env(safe-area-inset-left);
                padding-right: env(safe-area-inset-right);
            }

            /* Header 适配安全区域 */
            .ios-device .header {
                padding-top: calc(1rem + env(safe-area-inset-top));
            }

            /* Footer 适配安全区域 */
            .ios-device .footer {
                padding-bottom: calc(2rem + env(safe-area-inset-bottom));
            }
        `;
        document.head.appendChild(style);
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.iOSCompatibility = new iOSCompatibility();
        iOSCompatibility.applySafeAreaFix();
    });
} else {
    window.iOSCompatibility = new iOSCompatibility();
    iOSCompatibility.applySafeAreaFix();
}

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = iOSCompatibility;
}
