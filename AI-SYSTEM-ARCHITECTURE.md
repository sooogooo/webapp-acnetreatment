# 🏗️ AI模型系统架构设计

**设计日期**: 2025-10-23
**版本**: v1.0
**状态**: 设计阶段

---

## 📋 目录

1. [系统概述](#系统概述)
2. [架构设计](#架构设计)
3. [数据结构](#数据结构)
4. [接口设计](#接口设计)
5. [实施计划](#实施计划)

---

## 🎯 系统概述

### 目标

构建一个灵活、可扩展的多模型AI系统，支持：
- ✅ 多个国产大模型无缝切换
- ✅ 智能路由和降级策略
- ✅ 成本监控和优化
- ✅ 统一的调用接口

### 核心功能

1. **模型管理**: 配置、选择、切换多个AI模型
2. **智能调用**: 根据场景自动选择最优模型
3. **错误处理**: 失败重试、降级备份
4. **成本控制**: 实时监控API使用量和费用
5. **用户体验**: 流式输出、快速响应

---

## 🏗️ 架构设计

### 1. 分层架构

```
┌─────────────────────────────────────────┐
│          User Interface Layer           │
│  (模型选择UI、配置面板、聊天界面)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Application Service Layer         │
│  (业务逻辑、诊断服务、聊天服务)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       AI Model Adapter Layer            │
│  (统一接口、智能路由、错误处理)          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Provider Implementation Layer      │
│  ┌──────┬──────┬──────┬──────┐          │
│  │Qwen  │ GLM  │Spark │Ernie │          │
│  │通义  │智谱  │讯飞  │文心  │          │
│  └──────┴──────┴──────┴──────┘          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       External API Services             │
│  (各厂商API服务、WebSocket连接)         │
└─────────────────────────────────────────┘
```

### 2. 核心模块

#### Module 1: AI Model Manager (模型管理器)
```javascript
class AIModelManager {
    constructor() {
        this.models = {};
        this.currentModel = null;
        this.config = {};
    }

    // 注册模型提供商
    registerProvider(name, provider)

    // 设置当前模型
    setCurrentModel(modelName)

    // 获取可用模型列表
    getAvailableModels()

    // 更新配置
    updateConfig(config)
}
```

#### Module 2: Model Providers (模型提供商)
```javascript
class QwenProvider extends BaseProvider {
    constructor(apiKey) {
        super('qwen', apiKey);
        this.baseURL = 'https://dashscope.aliyuncs.com/api/v1';
    }

    async chat(messages, options = {}) {
        // 实现通义千问API调用
    }

    async streamChat(messages, onChunk, options = {}) {
        // 实现流式输出
    }
}

class GLMProvider extends BaseProvider {
    // 智谱AI实现
}

class SparkProvider extends BaseProvider {
    // 讯飞星火实现（WebSocket）
}

class ErnieProvider extends BaseProvider {
    // 百度文心实现
}
```

#### Module 3: Smart Router (智能路由)
```javascript
class SmartRouter {
    constructor(manager) {
        this.manager = manager;
        this.rules = [];
    }

    // 根据场景选择最优模型
    selectModel(scenario, complexity = 'medium') {
        if (complexity === 'low') {
            return 'glm-4-flash'; // 免费
        } else if (complexity === 'medium') {
            return 'glm-4-plus'; // 低成本
        } else {
            return 'qwen-plus'; // 高质量
        }
    }

    // 失败降级
    async chatWithFallback(messages, options = {}) {
        const fallbackChain = [
            'qwen-plus',
            'glm-4-plus',
            'glm-4-flash'
        ];

        for (const model of fallbackChain) {
            try {
                return await this.manager.chat(messages, model, options);
            } catch (error) {
                console.log(`${model} failed, trying next...`);
            }
        }

        throw new Error('All models failed');
    }
}
```

#### Module 4: Cost Tracker (成本追踪)
```javascript
class CostTracker {
    constructor() {
        this.usage = this.loadUsage();
        this.prices = {
            'qwen-turbo': { input: 2, output: 6 },
            'qwen-plus': { input: 4, output: 12 },
            'qwen-max': { input: 40, output: 120 },
            'glm-4-flash': { input: 0, output: 0 },
            'glm-4-plus': { input: 5, output: 5 },
            // ... 其他模型
        };
    }

    track(model, inputTokens, outputTokens) {
        if (!this.usage[model]) {
            this.usage[model] = {
                calls: 0,
                inputTokens: 0,
                outputTokens: 0,
                cost: 0
            };
        }

        this.usage[model].calls++;
        this.usage[model].inputTokens += inputTokens;
        this.usage[model].outputTokens += outputTokens;

        const cost = this.calculateCost(model, inputTokens, outputTokens);
        this.usage[model].cost += cost;

        this.saveUsage();
        return cost;
    }

    calculateCost(model, inputTokens, outputTokens) {
        const price = this.prices[model];
        if (!price) return 0;

        // 价格单位：元/1M tokens
        const inputCost = (inputTokens / 1000000) * price.input;
        const outputCost = (outputTokens / 1000000) * price.output;

        return inputCost + outputCost;
    }

    getReport(period = 'month') {
        // 生成报告
    }
}
```

#### Module 5: Response Cache (响应缓存)
```javascript
class ResponseCache {
    constructor(maxSize = 100) {
        this.cache = new Map();
        this.maxSize = maxSize;
    }

    // 生成缓存key
    generateKey(messages, model) {
        return `${model}:${JSON.stringify(messages)}`;
    }

    // 获取缓存
    get(messages, model) {
        const key = this.generateKey(messages, model);
        const cached = this.cache.get(key);

        if (cached && Date.now() - cached.timestamp < 3600000) { // 1小时有效
            return cached.response;
        }

        return null;
    }

    // 设置缓存
    set(messages, model, response) {
        const key = this.generateKey(messages, model);

        if (this.cache.size >= this.maxSize) {
            // LRU淘汰
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            response,
            timestamp: Date.now()
        });
    }
}
```

---

## 📊 数据结构

### 1. 模型配置
```javascript
const AI_MODELS_CONFIG = {
    // 通义千问
    qwen: {
        enabled: true,
        apiKey: '',
        models: {
            'qwen-turbo': {
                name: '通义千问-Turbo',
                maxTokens: 8000,
                price: { input: 2, output: 6 },
                features: ['快速响应', '基础对话']
            },
            'qwen-plus': {
                name: '通义千问-Plus',
                maxTokens: 131072,
                price: { input: 4, output: 12 },
                features: ['超长上下文', '综合任务']
            },
            'qwen-max': {
                name: '通义千问-Max',
                maxTokens: 32768,
                price: { input: 40, output: 120 },
                features: ['最强性能', '复杂推理']
            }
        }
    },

    // 智谱AI
    glm: {
        enabled: true,
        apiKey: '',
        models: {
            'glm-4-flash': {
                name: 'GLM-4-Flash',
                maxTokens: 128000,
                price: { input: 0, output: 0 },
                features: ['完全免费', '快速响应']
            },
            'glm-4-plus': {
                name: 'GLM-4-Plus',
                maxTokens: 128000,
                price: { input: 5, output: 5 },
                features: ['超低价', '性能优秀']
            }
        }
    },

    // 讯飞星火
    spark: {
        enabled: false,
        appId: '',
        apiSecret: '',
        apiKey: '',
        models: {
            'spark-lite': {
                name: '星火Lite',
                maxTokens: 4096,
                price: { input: 0, output: 0 },
                features: ['永久免费', '基础能力']
            }
        }
    },

    // 文心一言
    ernie: {
        enabled: false,
        apiKey: '',
        secretKey: '',
        models: {
            'ernie-3.5': {
                name: '文心一言3.5',
                maxTokens: 8192,
                price: { input: 0, output: 0 },
                features: ['免费', '基础版']
            }
        }
    }
};
```

### 2. 对话消息格式
```javascript
const message = {
    role: 'user' | 'assistant' | 'system',
    content: '消息内容',
    timestamp: Date.now()
};

const messages = [
    { role: 'system', content: '你是一个痤疮治疗专家...' },
    { role: 'user', content: '我的痘痘情况是...' },
    { role: 'assistant', content: '根据您的描述...' }
];
```

### 3. 模型调用参数
```javascript
const options = {
    temperature: 0.7,      // 0-1, 创造性
    top_p: 0.9,           // 0-1, 采样
    max_tokens: 2000,     // 最大输出长度
    stream: false,        // 是否流式输出
    presence_penalty: 0,  // 重复惩罚
    frequency_penalty: 0  // 频率惩罚
};
```

### 4. 使用统计数据
```javascript
const usage = {
    model: 'qwen-plus',
    date: '2025-10-23',
    calls: 150,
    inputTokens: 45000,
    outputTokens: 75000,
    cost: 0.48,
    avgResponseTime: 1250  // ms
};
```

---

## 🔌 接口设计

### 1. 统一调用接口

```javascript
// 单次对话
const response = await AIModelManager.chat({
    messages: [
        { role: 'user', content: '你好' }
    ],
    model: 'qwen-plus',  // 可选，不指定则使用默认
    options: {
        temperature: 0.7,
        max_tokens: 2000
    }
});

// 流式输出
await AIModelManager.streamChat({
    messages: [
        { role: 'user', content: '详细分析我的痤疮情况' }
    ],
    model: 'qwen-plus',
    onChunk: (chunk) => {
        console.log(chunk);
        // 实时显示到UI
    },
    onComplete: (fullResponse) => {
        console.log('完成', fullResponse);
    },
    onError: (error) => {
        console.error('错误', error);
    }
});

// 智能路由
const response = await AIModelManager.smartChat({
    messages: [...],
    complexity: 'high'  // low/medium/high
});

// 模型对比
const responses = await AIModelManager.compareModels({
    messages: [...],
    models: ['qwen-plus', 'glm-4-plus', 'spark-lite']
});
```

### 2. 配置管理接口

```javascript
// 设置API Key
AIModelManager.setAPIKey('qwen', 'sk-xxx');

// 设置默认模型
AIModelManager.setDefaultModel('qwen-plus');

// 更新模型参数
AIModelManager.updateModelOptions('qwen-plus', {
    temperature: 0.8,
    max_tokens: 3000
});

// 获取配置
const config = AIModelManager.getConfig();

// 保存配置到localStorage
AIModelManager.saveConfig();

// 导入配置
AIModelManager.importConfig(configJSON);
```

### 3. 统计查询接口

```javascript
// 获取今日统计
const todayStats = CostTracker.getTodayStats();

// 获取月度报告
const monthlyReport = CostTracker.getMonthlyReport();

// 获取模型使用排行
const ranking = CostTracker.getModelRanking();

// 导出统计数据
const csvData = CostTracker.exportCSV();
```

---

## 🎨 UI组件设计

### 1. 模型选择器
```html
<div class="model-selector">
    <div class="current-model">
        <span class="model-icon">🤖</span>
        <span class="model-name">通义千问-Plus</span>
        <span class="model-price">¥0.016/次</span>
        <button class="change-model-btn">切换</button>
    </div>
</div>
```

### 2. 模型配置面板
```html
<div class="model-config-panel">
    <h3>模型配置</h3>

    <!-- API Key配置 -->
    <div class="config-section">
        <label>通义千问 API Key</label>
        <input type="password" placeholder="sk-xxx">
        <button class="test-connection">测试连接</button>
    </div>

    <!-- 参数配置 -->
    <div class="config-section">
        <label>Temperature (创造性): <span>0.7</span></label>
        <input type="range" min="0" max="1" step="0.1" value="0.7">

        <label>Max Tokens: <span>2000</span></label>
        <input type="range" min="500" max="4000" step="100" value="2000">
    </div>

    <!-- 默认模型 -->
    <div class="config-section">
        <label>默认模型</label>
        <select>
            <option value="qwen-plus">通义千问-Plus</option>
            <option value="glm-4-plus">GLM-4-Plus</option>
            <option value="glm-4-flash">GLM-4-Flash (免费)</option>
        </select>
    </div>
</div>
```

### 3. 成本仪表盘
```html
<div class="cost-dashboard">
    <div class="stat-card">
        <h4>今日成本</h4>
        <p class="amount">¥0.48</p>
        <p class="detail">32次调用</p>
    </div>

    <div class="stat-card">
        <h4>本月成本</h4>
        <p class="amount">¥12.50</p>
        <p class="detail">850次调用</p>
    </div>

    <div class="stat-card">
        <h4>最常用模型</h4>
        <p class="model-name">通义千问-Plus</p>
        <p class="detail">65% 使用率</p>
    </div>
</div>
```

### 4. 模型对比界面
```html
<div class="model-comparison">
    <h3>模型对比</h3>

    <div class="comparison-grid">
        <div class="model-response">
            <div class="model-header">
                <span>通义千问-Plus</span>
                <span class="response-time">1.2s</span>
            </div>
            <div class="response-content">
                <!-- 模型响应内容 -->
            </div>
        </div>

        <div class="model-response">
            <div class="model-header">
                <span>GLM-4-Plus</span>
                <span class="response-time">0.8s</span>
            </div>
            <div class="response-content">
                <!-- 模型响应内容 -->
            </div>
        </div>
    </div>

    <div class="vote-section">
        <button class="vote-btn">👍 左边更好</button>
        <button class="vote-btn">👍 右边更好</button>
        <button class="vote-btn">🤝 差不多</button>
    </div>
</div>
```

---

## 📅 实施计划

### Week 1: 基础架构
- [ ] Day 1-2: 创建基础类结构
- [ ] Day 3-4: 实现通义千问Provider
- [ ] Day 5-7: 实现智谱AI Provider

### Week 2: 功能完善
- [ ] Day 1-2: 实现Smart Router
- [ ] Day 3-4: 实现Cost Tracker
- [ ] Day 5-7: 实现Response Cache

### Week 3: UI开发
- [ ] Day 1-3: 模型选择器和配置面板
- [ ] Day 4-5: 成本仪表盘
- [ ] Day 6-7: 模型对比界面

### Week 4: 集成测试
- [ ] Day 1-3: 单元测试
- [ ] Day 4-5: 集成测试
- [ ] Day 6-7: 性能优化

---

## 🔒 安全考虑

1. **API Key保护**
   - 不在前端明文存储
   - 使用环境变量或后端代理
   - localStorage加密存储

2. **请求限流**
   - 防止恶意调用
   - 设置每日/每小时限额

3. **错误处理**
   - 不泄露敏感信息
   - 友好的错误提示

4. **数据隐私**
   - 对话数据本地存储
   - 可选择性上传
   - 遵守GDPR/PIPL

---

## 📈 性能优化

1. **响应缓存**: 相同问题1小时内返回缓存
2. **并发控制**: 限制同时调用数量
3. **懒加载**: 按需加载Provider
4. **预加载**: 预测下一个可能的查询
5. **CDN加速**: 静态资源CDN分发

---

**设计人**: Claude AI Assistant
**审核状态**: 待审核
**下一步**: 开始编码实现
