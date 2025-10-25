# 📋 优化后的TODO清单

**创建日期**: 2025-10-25
**项目阶段**: AI模型集成开发
**当前优先级**: Phase 2 核心功能实现

---

## 🚨 立即处理（本周必须完成）

### 1. 🔧 技术债务修复（Priority: P1）

#### Task 1.1: 提交AI文档到Git仓库
- **状态**: ⏳ Pending
- **预估时间**: 10分钟
- **文件清单**:
  - [ ] AI-INTEGRATION-PROGRESS.md
  - [ ] AI-MODELS-RESEARCH.md
  - [ ] AI-SYSTEM-ARCHITECTURE.md
  - [ ] PROJECT-STATUS-REPORT.md (新增)
- **命令**:
  ```bash
  git add AI-*.md PROJECT-STATUS-REPORT.md
  git commit -m "docs: 添加AI模型集成调研和架构设计文档"
  git push origin main
  ```

#### Task 1.2: 修复Docker健康检查
- **状态**: ⏳ Pending
- **预估时间**: 15分钟
- **问题描述**: 健康检查失败（FailingStreak: 2222），但应用正常运行
- **根本原因**: docker-compose.yml中healthcheck配置可能不正确
- **解决方案**:
  ```yaml
  healthcheck:
    test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80/"]
    # 或者
    test: ["CMD-SHELL", "curl -f http://localhost:80/ || exit 1"]
  ```

---

## 🎯 Phase 2: AI核心功能实现（Week 1-2）

### 2. 📁 创建代码结构（Day 1上午）

#### Task 2.1: 创建AI模块目录
- **状态**: ⏳ Pending
- **预估时间**: 5分钟
- **目录结构**:
  ```
  js/
  ├── ai-models/
  │   ├── model-manager.js       # 模型管理器主类
  │   ├── providers/             # 各大模型Provider
  │   │   ├── base-provider.js   # 基类
  │   │   ├── qwen-provider.js   # 通义千问
  │   │   ├── glm-provider.js    # 智谱AI
  │   │   ├── spark-provider.js  # 讯飞星火（Phase 2可选）
  │   │   └── ernie-provider.js  # 文心一言（Phase 2可选）
  │   ├── utils/                 # 工具类
  │   │   ├── smart-router.js    # 智能路由
  │   │   ├── cost-tracker.js    # 成本追踪
  │   │   ├── response-cache.js  # 响应缓存
  │   │   └── error-handler.js   # 错误处理
  │   └── ui/                    # UI组件
  │       ├── model-selector.js  # 模型选择器
  │       ├── config-panel.js    # 配置面板
  │       └── cost-dashboard.js  # 成本仪表盘
  ```
- **命令**:
  ```bash
  mkdir -p js/ai-models/{providers,utils,ui}
  touch js/ai-models/model-manager.js
  touch js/ai-models/providers/{base-provider,qwen-provider,glm-provider}.js
  touch js/ai-models/utils/{smart-router,cost-tracker,response-cache}.js
  touch js/ai-models/ui/{model-selector,config-panel,cost-dashboard}.js
  ```

---

### 3. 🧩 实现Provider层（Day 1-2）

#### Task 3.1: 实现BaseProvider基类
- **状态**: ⏳ Pending
- **预估时间**: 1小时
- **文件**: `js/ai-models/providers/base-provider.js`
- **核心功能**:
  - [ ] 定义统一的Provider接口
  - [ ] `async chat(messages, options)` 方法
  - [ ] `async streamChat(messages, onChunk, options)` 方法
  - [ ] `validateConfig(config)` 配置验证
  - [ ] `getModelInfo()` 模型信息
  - [ ] 错误处理基础逻辑
- **代码框架**:
  ```javascript
  class BaseProvider {
    constructor(config) {
      this.config = config;
      this.modelName = config.modelName;
      this.apiKey = config.apiKey;
    }

    async chat(messages, options = {}) {
      throw new Error('chat() must be implemented by subclass');
    }

    async streamChat(messages, onChunk, options = {}) {
      throw new Error('streamChat() must be implemented by subclass');
    }

    validateConfig(config) {
      if (!config.apiKey) throw new Error('API Key is required');
      if (!config.modelName) throw new Error('Model name is required');
    }

    getModelInfo() {
      return {
        provider: this.constructor.name,
        model: this.modelName
      };
    }
  }
  ```

#### Task 3.2: 实现QwenProvider（通义千问）
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **文件**: `js/ai-models/providers/qwen-provider.js`
- **API文档**: https://help.aliyun.com/zh/dashscope/developer-reference/api-details
- **核心功能**:
  - [ ] 继承BaseProvider
  - [ ] 实现chat()方法（调用DashScope API）
  - [ ] 实现streamChat()方法（SSE流式输出）
  - [ ] Token计算（输入+输出）
  - [ ] 错误处理和重试
  - [ ] 支持模型：qwen-plus, qwen-turbo, qwen-max
- **API请求示例**:
  ```javascript
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      input: { messages },
      parameters: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 1500
      }
    })
  });
  ```

#### Task 3.3: 实现GLMProvider（智谱AI）
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **文件**: `js/ai-models/providers/glm-provider.js`
- **API文档**: https://open.bigmodel.cn/dev/api
- **核心功能**:
  - [ ] 继承BaseProvider
  - [ ] 实现chat()方法
  - [ ] 实现streamChat()方法
  - [ ] Token计算
  - [ ] 错误处理和重试
  - [ ] 支持模型：glm-4-flash（免费）, glm-4-plus
- **API请求示例**:
  ```javascript
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'glm-4-flash',
      messages,
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 1500,
      stream: false
    })
  });
  ```

---

### 4. 🎛️ 实现管理层（Day 3）

#### Task 4.1: 创建AIModelManager
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **文件**: `js/ai-models/model-manager.js`
- **核心功能**:
  - [ ] 管理多个Provider实例
  - [ ] `registerProvider(name, provider)` 注册Provider
  - [ ] `setCurrentModel(modelName)` 切换当前模型
  - [ ] `getAvailableModels()` 获取可用模型列表
  - [ ] `getCurrentModel()` 获取当前模型
  - [ ] `chat(messages, options)` 统一聊天接口
  - [ ] `streamChat(messages, onChunk, options)` 流式聊天
  - [ ] 配置持久化（localStorage）
- **代码框架**:
  ```javascript
  class AIModelManager {
    constructor() {
      this.providers = new Map();
      this.currentModel = null;
      this.loadConfig();
    }

    registerProvider(name, provider) {
      this.providers.set(name, provider);
    }

    setCurrentModel(modelName) {
      if (!this.providers.has(modelName)) {
        throw new Error(`Model ${modelName} not found`);
      }
      this.currentModel = modelName;
      this.saveConfig();
    }

    async chat(messages, options = {}) {
      const provider = this.providers.get(this.currentModel);
      return await provider.chat(messages, options);
    }

    loadConfig() {
      const config = localStorage.getItem('ai_model_config');
      if (config) {
        const data = JSON.parse(config);
        this.currentModel = data.currentModel;
      }
    }

    saveConfig() {
      localStorage.setItem('ai_model_config', JSON.stringify({
        currentModel: this.currentModel
      }));
    }
  }
  ```

#### Task 4.2: 实现SmartRouter
- **状态**: ⏳ Pending
- **预估时间**: 1.5小时
- **文件**: `js/ai-models/utils/smart-router.js`
- **核心功能**:
  - [ ] 评估问题复杂度
  - [ ] 选择最优模型
  - [ ] 实现降级策略（qwen-plus → glm-4-plus → glm-4-flash）
  - [ ] 失败重试机制（最多3次）
  - [ ] 超时处理
- **路由逻辑**:
  ```javascript
  class SmartRouter {
    selectModel(scenario, complexity) {
      if (complexity === 'low') return 'glm-4-flash';      // 免费
      if (complexity === 'medium') return 'glm-4-plus';    // 高性价比
      if (complexity === 'high') return 'qwen-plus';       // 高质量
      return 'glm-4-flash'; // 默认
    }

    async chatWithFallback(messages, options = {}) {
      const fallbackChain = ['qwen-plus', 'glm-4-plus', 'glm-4-flash'];

      for (const model of fallbackChain) {
        try {
          return await this.modelManager.chat(messages, { ...options, model });
        } catch (error) {
          console.warn(`Model ${model} failed, trying next...`, error);
        }
      }

      throw new Error('All models failed');
    }
  }
  ```

---

### 5. 📊 实现工具层（Day 4）

#### Task 5.1: 实现CostTracker
- **状态**: ⏳ Pending
- **预估时间**: 1.5小时
- **文件**: `js/ai-models/utils/cost-tracker.js`
- **核心功能**:
  - [ ] 记录每次API调用
  - [ ] 计算Token使用量
  - [ ] 计算费用（基于各模型价格）
  - [ ] 生成日/周/月报告
  - [ ] localStorage持久化
  - [ ] 导出CSV功能
- **数据结构**:
  ```javascript
  {
    date: '2025-10-25',
    records: [
      {
        timestamp: 1729857600000,
        model: 'qwen-plus',
        inputTokens: 100,
        outputTokens: 150,
        cost: 0.004,  // 人民币
        responseTime: 1200  // ms
      }
    ],
    dailyTotal: {
      calls: 10,
      totalCost: 0.05,
      totalTokens: 2500
    }
  }
  ```

#### Task 5.2: 实现ResponseCache
- **状态**: ⏳ Pending
- **预估时间**: 1小时
- **文件**: `js/ai-models/utils/response-cache.js`
- **核心功能**:
  - [ ] LRU缓存实现（最多100条）
  - [ ] 缓存Key生成（基于messages哈希）
  - [ ] 过期时间设置（默认1小时）
  - [ ] 缓存命中率统计
  - [ ] localStorage持久化
- **LRU实现**:
  ```javascript
  class ResponseCache {
    constructor(maxSize = 100, ttl = 3600000) {
      this.cache = new Map();
      this.maxSize = maxSize;
      this.ttl = ttl;
    }

    generateKey(messages, model) {
      const str = JSON.stringify({ messages, model });
      return this.hashCode(str);
    }

    get(messages, model) {
      const key = this.generateKey(messages, model);
      const entry = this.cache.get(key);

      if (!entry) return null;
      if (Date.now() - entry.timestamp > this.ttl) {
        this.cache.delete(key);
        return null;
      }

      // LRU: 移到最后
      this.cache.delete(key);
      this.cache.set(key, entry);
      return entry.response;
    }

    set(messages, model, response) {
      const key = this.generateKey(messages, model);

      if (this.cache.size >= this.maxSize) {
        // 删除最旧的（第一个）
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

## 🎨 Phase 3: UI开发（Week 3）

### 6. 💻 创建配置界面（Day 5-6）

#### Task 6.1: 模型配置面板
- **状态**: ⏳ Pending
- **预估时间**: 3小时
- **文件**: `js/ai-models/ui/config-panel.js`
- **UI功能**:
  - [ ] API Key输入（加密显示）
  - [ ] 模型参数调节（temperature, top_p, max_tokens）
  - [ ] 测试连接按钮
  - [ ] 保存/导入配置
  - [ ] 重置为默认值
- **HTML结构**:
  ```html
  <div class="ai-config-panel">
    <h3>🔧 AI模型配置</h3>

    <div class="config-section">
      <h4>通义千问 (Qwen)</h4>
      <input type="password" placeholder="API Key" id="qwen-api-key">
      <button onclick="testConnection('qwen')">测试连接</button>
    </div>

    <div class="config-section">
      <h4>智谱AI (ChatGLM)</h4>
      <input type="password" placeholder="API Key" id="glm-api-key">
      <button onclick="testConnection('glm')">测试连接</button>
    </div>

    <div class="config-section">
      <h4>模型参数</h4>
      <label>Temperature: <input type="range" min="0" max="1" step="0.1" value="0.7"></label>
      <label>Top P: <input type="range" min="0" max="1" step="0.1" value="0.9"></label>
      <label>Max Tokens: <input type="number" value="1500"></label>
    </div>

    <button onclick="saveConfig()">💾 保存配置</button>
    <button onclick="resetConfig()">🔄 重置默认</button>
  </div>
  ```

#### Task 6.2: 模型选择器UI
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **文件**: `js/ai-models/ui/model-selector.js`
- **UI功能**:
  - [ ] 下拉菜单显示可用模型
  - [ ] 模型卡片展示（图标、名称、价格、特性）
  - [ ] 实时切换模型
  - [ ] 显示当前模型状态
  - [ ] 免费/付费标识
- **HTML结构**:
  ```html
  <div class="model-selector">
    <select id="model-dropdown" onchange="switchModel()">
      <option value="glm-4-flash">🆓 GLM-4-Flash (免费)</option>
      <option value="glm-4-plus">💎 GLM-4-Plus (¥0.005/次)</option>
      <option value="qwen-plus">🚀 Qwen-Plus (¥0.016/次)</option>
      <option value="qwen-turbo">⚡ Qwen-Turbo (¥0.003/次)</option>
    </select>

    <div class="model-cards">
      <div class="model-card" data-model="glm-4-flash">
        <span class="badge free">免费</span>
        <h4>GLM-4-Flash</h4>
        <p>适合日常问答，响应快速</p>
        <span class="price">¥0/次</span>
      </div>
      <!-- 更多模型卡片 -->
    </div>
  </div>
  ```

---

### 7. 📈 成本仪表盘（Day 7）

#### Task 7.1: 创建成本仪表盘UI
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **文件**: `js/ai-models/ui/cost-dashboard.js`
- **UI功能**:
  - [ ] 今日/本月使用统计
  - [ ] 调用次数图表
  - [ ] 费用趋势图
  - [ ] 各模型使用占比
  - [ ] 导出CSV报告
  - [ ] 预算提醒设置
- **HTML结构**:
  ```html
  <div class="cost-dashboard">
    <h3>📊 使用统计</h3>

    <div class="stats-grid">
      <div class="stat-card">
        <h4>今日调用</h4>
        <p class="stat-number">42</p>
        <span class="stat-change">+12%</span>
      </div>

      <div class="stat-card">
        <h4>今日费用</h4>
        <p class="stat-number">¥0.35</p>
        <span class="stat-change">+8%</span>
      </div>

      <div class="stat-card">
        <h4>本月费用</h4>
        <p class="stat-number">¥8.50</p>
        <span class="stat-change">目标: ¥100</span>
      </div>
    </div>

    <canvas id="usage-chart"></canvas>

    <button onclick="exportReport()">📥 导出报告</button>
  </div>
  ```

---

### 8. 🔌 集成到现有系统（Day 8-9）

#### Task 8.1: 修改AI聊天界面
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **文件**: `index.html` (AI聊天区域)
- **修改内容**:
  - [ ] 引入AI模块JS文件
  - [ ] 初始化AIModelManager
  - [ ] 替换原有的AI调用逻辑
  - [ ] 添加模型选择器
  - [ ] 添加配置按钮
  - [ ] 显示当前使用的模型
- **代码修改**:
  ```javascript
  // 初始化AI系统
  const modelManager = new AIModelManager();
  const qwenProvider = new QwenProvider({ apiKey: 'your-key', modelName: 'qwen-plus' });
  const glmProvider = new GLMProvider({ apiKey: 'your-key', modelName: 'glm-4-flash' });

  modelManager.registerProvider('qwen-plus', qwenProvider);
  modelManager.registerProvider('glm-4-flash', glmProvider);
  modelManager.setCurrentModel('glm-4-flash'); // 默认使用免费模型

  // 替换原有的sendMessage函数
  async function sendMessage() {
    const userInput = document.getElementById('userInput').value;

    try {
      const response = await modelManager.chat([
        { role: 'user', content: userInput }
      ]);

      displayMessage(response.content, 'assistant');
    } catch (error) {
      console.error('AI调用失败:', error);
      displayError('抱歉，AI服务暂时不可用，请稍后重试。');
    }
  }
  ```

#### Task 8.2: 实现流式输出展示
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **功能描述**: 打字机效果，逐字显示AI回复
- **实现方案**:
  ```javascript
  async function sendMessageStreaming() {
    const userInput = document.getElementById('userInput').value;
    const messageDiv = createMessageDiv('assistant');

    try {
      await modelManager.streamChat(
        [{ role: 'user', content: userInput }],
        (chunk) => {
          // 逐字添加到messageDiv
          messageDiv.textContent += chunk;
        }
      );
    } catch (error) {
      console.error('流式输出失败:', error);
    }
  }
  ```

---

## 🚀 Phase 4: 高级功能（Week 4）

### 9. 额外Provider（可选）

#### Task 9.1: 添加SparkProvider（讯飞星火）
- **状态**: ⏳ Pending (可选)
- **预估时间**: 2小时
- **优先级**: P2（低）
- **备注**: Lite版本免费，可作为免费降级选项

#### Task 9.2: 添加ErnieProvider（百度文心一言）
- **状态**: ⏳ Pending (可选)
- **预估时间**: 2小时
- **优先级**: P2（低）
- **备注**: 3.5版本免费，医疗场景优化

---

### 10. 📊 高级功能

#### Task 10.1: 模型对比功能
- **状态**: ⏳ Pending
- **预估时间**: 3小时
- **功能描述**: 同时调用多个模型，对比回答质量
- **UI设计**:
  ```html
  <div class="model-comparison">
    <button onclick="compareModels()">🔍 模型对比</button>

    <div class="comparison-results">
      <div class="result-card">
        <h4>GLM-4-Flash</h4>
        <p class="response">...</p>
        <span class="metrics">⏱️ 1.2s | 💰 ¥0</span>
      </div>

      <div class="result-card">
        <h4>Qwen-Plus</h4>
        <p class="response">...</p>
        <span class="metrics">⏱️ 1.8s | 💰 ¥0.016</span>
      </div>
    </div>
  </div>
  ```

#### Task 10.2: 性能优化
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **优化项**:
  - [ ] 请求并发控制（最多3个）
  - [ ] 响应预加载（预测下一个问题）
  - [ ] Provider懒加载
  - [ ] 减少重复计算（缓存）

---

## 📝 文档和测试

### 11. 文档编写

#### Task 11.1: 编写API集成文档
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **文件**: `AI-API-INTEGRATION-GUIDE.md`
- **内容**:
  - [ ] 各Provider使用说明
  - [ ] API Key获取流程
  - [ ] 配置示例
  - [ ] 常见错误处理

#### Task 11.2: 编写用户使用手册
- **状态**: ⏳ Pending
- **预估时间**: 1小时
- **文件**: `AI-USER-MANUAL.md`
- **内容**:
  - [ ] 如何选择模型
  - [ ] 如何配置API Key
  - [ ] 如何查看成本统计
  - [ ] 常见问题FAQ

---

### 12. 测试和部署

#### Task 12.1: 单元测试
- **状态**: ⏳ Pending
- **预估时间**: 3小时
- **测试范围**:
  - [ ] BaseProvider基类
  - [ ] QwenProvider
  - [ ] GLMProvider
  - [ ] SmartRouter
  - [ ] CostTracker
  - [ ] ResponseCache

#### Task 12.2: 集成测试
- **状态**: ⏳ Pending
- **预估时间**: 2小时
- **测试场景**:
  - [ ] 模型切换
  - [ ] 降级策略
  - [ ] 成本统计
  - [ ] 缓存命中
  - [ ] 错误恢复

#### Task 12.3: 部署上线
- **状态**: ⏳ Pending
- **预估时间**: 1小时
- **部署步骤**:
  - [ ] 构建Docker镜像
  - [ ] 更新docker-compose.yml
  - [ ] 重新部署
  - [ ] 验证功能
  - [ ] 监控日志

---

## 📊 进度跟踪

### 完成度统计

| 阶段 | 任务数 | 已完成 | 进行中 | 待办 | 完成度 |
|------|--------|--------|--------|------|--------|
| 技术债务 | 2 | 0 | 0 | 2 | 0% |
| 代码结构 | 1 | 0 | 0 | 1 | 0% |
| Provider层 | 3 | 0 | 0 | 3 | 0% |
| 管理层 | 2 | 0 | 0 | 2 | 0% |
| 工具层 | 2 | 0 | 0 | 2 | 0% |
| UI开发 | 3 | 0 | 0 | 3 | 0% |
| 系统集成 | 2 | 0 | 0 | 2 | 0% |
| 高级功能 | 4 | 0 | 0 | 4 | 0% |
| 文档测试 | 5 | 0 | 0 | 5 | 0% |
| **总计** | **24** | **0** | **0** | **24** | **0%** |

### 时间估算

| 阶段 | 预估时间 |
|------|----------|
| 立即处理 | 0.5小时 |
| Phase 2: 核心实现 | 16小时 |
| Phase 3: UI开发 | 12小时 |
| Phase 4: 高级功能 | 12小时 |
| 文档和测试 | 9小时 |
| **总计** | **49.5小时** |

**按周分配**:
- Week 1: 技术债务 + Phase 2核心实现（16.5小时）
- Week 2: Phase 3 UI开发（12小时）
- Week 3: Phase 4高级功能（12小时）
- Week 4: 文档测试部署（9小时）

---

## 🎯 本周重点（2025-10-25 ~ 2025-10-31）

### 本周目标
✅ 完成Phase 2核心实现（Provider层 + 管理层 + 工具层）

### 每日任务

**Day 1 (今天):**
- [x] 提交AI文档到Git
- [x] 修复Docker健康检查
- [ ] 创建AI目录结构
- [ ] 实现BaseProvider

**Day 2:**
- [ ] 实现QwenProvider
- [ ] 开始实现GLMProvider

**Day 3:**
- [ ] 完成GLMProvider
- [ ] 实现AIModelManager

**Day 4:**
- [ ] 实现SmartRouter
- [ ] 实现CostTracker

**Day 5:**
- [ ] 实现ResponseCache
- [ ] 开始UI配置面板

**Day 6-7:**
- [ ] 完成UI开发
- [ ] 集成测试

---

## 📝 备注

### 优先级说明
- **P0**: 阻塞性问题，必须立即解决
- **P1**: 重要功能，本周必须完成
- **P2**: 可选功能，时间允许时完成
- **P3**: 未来功能，暂不考虑

### 时间估算说明
- 预估时间包含：编码 + 测试 + 文档
- 实际时间可能有±30%的偏差
- 遇到技术难点可能需要额外时间

### 依赖关系
- BaseProvider必须先完成
- QwenProvider和GLMProvider可以并行开发
- SmartRouter依赖Provider完成
- UI开发依赖核心功能完成

---

**最后更新**: 2025-10-25 20:10 CST
**下次更新**: 完成Day 1任务后
