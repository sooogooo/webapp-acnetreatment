# 🤖 国产大模型API调研报告

**调研日期**: 2025-10-23
**调研范围**: 4个主流国产大模型平台
**目的**: 为痤疮治疗系统集成AI诊断功能

---

## 📊 调研总览

| 平台 | 模型 | 价格竞争力 | 中文能力 | 推荐指数 | 优先级 |
|------|------|------------|----------|----------|--------|
| 阿里云 | 通义千问 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **1** |
| 智谱AI | ChatGLM | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **2** |
| 讯飞 | 星火 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **3** |
| 百度 | 文心一言 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **4** |

---

## 1️⃣ 通义千问（阿里云）

### 基本信息
- **厂商**: 阿里云
- **平台**: DashScope / 百炼平台
- **最新版本**: Qwen2.5-Max（2025年1月发布）
- **官网**: https://help.aliyun.com/zh/dashscope/

### 模型系列

| 模型名称 | 上下文长度 | 适用场景 | 特点 |
|----------|-----------|----------|------|
| **qwen-max-latest** | 32K tokens | 复杂推理、专业内容 | 最强性能 |
| **qwen-plus-latest** | 131K tokens | 长文本、综合任务 | 超长上下文 |
| **qwen-turbo** | 8K tokens | 基础对话、快速响应 | 高性价比 |

### 价格（2025年）

#### 官方定价（人民币）
| 模型 | 输入价格 | 输出价格 | 每次诊断成本* |
|------|----------|----------|---------------|
| qwen-turbo | ¥2/1M tokens | ¥6/1M tokens | ¥0.008 |
| qwen-plus | ¥4/1M tokens | ¥12/1M tokens | ¥0.016 |
| qwen-max | ¥40/1M tokens | ¥120/1M tokens | ¥0.16 |

*假设每次诊断输入1K tokens，输出1K tokens

#### 美元定价
| 模型 | 输入价格 | 输出价格 |
|------|----------|----------|
| qwen-max-latest | $1.6/1M tokens | $6.4/1M tokens |
| qwen-plus-latest | $0.4/1M tokens | $1.2/1M tokens |

### 免费额度
- ✅ 新用户赠送**100万tokens**免费额度
- ✅ 适合初期测试和开发

### API调用方式

#### 1. REST API（推荐）
```bash
curl https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-plus",
    "input": {
      "messages": [
        {"role": "user", "content": "你好"}
      ]
    },
    "parameters": {
      "temperature": 0.7,
      "top_p": 0.8,
      "max_tokens": 1500
    }
  }'
```

#### 2. OpenAI兼容接口
```bash
curl https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-plus",
    "messages": [
      {"role": "user", "content": "你好"}
    ]
  }'
```

### 优势
- ✅ **性能强劲**: 全球排名第7（Qwen2.5-Max）
- ✅ **中文优秀**: 专门针对中文优化
- ✅ **长文本支持**: Plus版本支持131K上下文
- ✅ **生态完善**: 阿里云生态，稳定可靠
- ✅ **医疗场景**: 适合医疗健康咨询

### 劣势
- ⚠️ Max版本价格较高（¥40/1M输入）
- ⚠️ 需要阿里云账号

### 推荐用途
- **主要诊断模型**: 使用qwen-plus（性价比高）
- **复杂案例**: 使用qwen-max
- **快速响应**: 使用qwen-turbo

---

## 2️⃣ ChatGLM（智谱AI）

### 基本信息
- **厂商**: 智谱AI（清华系）
- **平台**: BigModel开放平台
- **最新版本**: GLM-4.5（2025年7月发布）
- **官网**: https://open.bigmodel.cn/

### 模型系列

| 模型名称 | 上下文长度 | 适用场景 | 特点 |
|----------|-----------|----------|------|
| **GLM-4-Flash** | 128K tokens | 快速对话 | **完全免费** |
| **GLM-4-FlashX** | 128K tokens | 高频调用 | 超低价 |
| **GLM-4-Plus** | 128K tokens | 综合任务 | 降价90% |
| **GLM-4-Long** | 1M tokens | 超长文本 | 百万上下文 |
| **GLM-4.5** | 128K tokens | 最新旗舰 | 开源模型 |

### 价格（2025年）

#### 重大降价（2025年4月）
| 模型 | 原价 | 现价 | 降幅 |
|------|------|------|------|
| GLM-4-Plus | ¥50/1M | ¥5/1M | **-90%** |

#### 当前价格
| 模型 | 输入价格 | 输出价格 | 每次诊断成本* |
|------|----------|----------|---------------|
| **GLM-4-Flash** | **¥0** | **¥0** | **¥0** |
| GLM-4-FlashX | ¥0.1/1M | ¥0.1/1M | ¥0.0002 |
| GLM-4-Plus | ¥5/1M | ¥5/1M | ¥0.01 |
| GLM-4-Long | ¥1/1M | ¥1/1M | ¥0.002 |
| GLM-4.5 | ¥0.8/1M | ¥2/1M | ¥0.0028 |

*假设每次诊断输入1K tokens，输出1K tokens

### API调用方式

```python
from zhipuai import ZhipuAI

client = ZhipuAI(api_key="your_api_key")

response = client.chat.completions.create(
    model="glm-4-plus",
    messages=[
        {"role": "user", "content": "你好"}
    ],
    temperature=0.7,
    top_p=0.8,
    max_tokens=1500
)
```

### 优势
- ✅ **价格王者**: GLM-4-Flash完全免费
- ✅ **超低成本**: 其他模型也极具竞争力
- ✅ **超长上下文**: GLM-4-Long支持100万tokens
- ✅ **开源友好**: 模型开源，可本地部署
- ✅ **清华背书**: 技术实力强

### 劣势
- ⚠️ 中文能力略逊于通义千问Max
- ⚠️ 生态相对较小

### 推荐用途
- **初期开发**: 使用GLM-4-Flash（免费）
- **生产环境**: 使用GLM-4-Plus（极低成本）
- **长文本**: 使用GLM-4-Long

---

## 3️⃣ 星火大模型（讯飞）

### 基本信息
- **厂商**: 科大讯飞
- **平台**: 讯飞开放平台
- **最新版本**: 星火4.0
- **官网**: https://xinghuo.xfyun.cn/

### 模型系列

| 模型名称 | 上下文长度 | 适用场景 | 特点 |
|----------|-----------|----------|------|
| **星火Lite** | 4K tokens | 基础对话 | **永久免费** |
| **星火Pro** | 8K tokens | 专业任务 | 性价比高 |
| **星火Max** | 8K tokens | 复杂推理 | 旗舰性能 |
| **星火4.0** | 8K tokens | 最新版本 | 多模态 |

### 价格（2025年）

| 模型 | 价格 | 每次诊断成本* |
|------|------|---------------|
| **星火Lite** | **永久免费** | **¥0** |
| 星火Pro/Max | 低至¥0.21/1万tokens | ¥0.0042 |

*假设每次诊断输入1K tokens，输出1K tokens

### 免费政策
- ✅ **星火Lite永久免费**
- ✅ 基本能力免费，高级功能收费
- ✅ 新用户有额外免费额度

### API调用方式

```python
import requests

url = "wss://spark-api.xf-yun.com/v4.0/chat"

# 需要APPID、APISecret、APIKey
# 使用WebSocket连接
```

### 优势
- ✅ **Lite版永久免费**
- ✅ **语音能力**: 讯飞的传统优势
- ✅ **多场景优化**: 医疗、教育等领域
- ✅ **联网搜索**: 内嵌联网功能
- ✅ **本土化**: 国产自主可控

### 劣势
- ⚠️ 上下文长度较短（8K）
- ⚠️ WebSocket接口，集成稍复杂
- ⚠️ 文档相对较少

### 推荐用途
- **初期测试**: 使用星火Lite（免费）
- **语音功能**: 如需语音输入输出
- **预算有限**: 成本敏感场景

---

## 4️⃣ 文心一言（百度）

### 基本信息
- **厂商**: 百度
- **平台**: 千帆大模型平台
- **最新版本**: 文心4.0
- **官网**: https://qianfan.cloud.baidu.com/

### 模型系列

| 模型名称 | 上下文长度 | 适用场景 | 特点 |
|----------|-----------|----------|------|
| ERNIE-3.5 | 8K tokens | 基础对话 | 免费 |
| ERNIE-4.0 | 8K tokens | 高级任务 | 旗舰版 |
| ERNIE-Speed | 8K tokens | 快速响应 | 高性能 |

### 价格（2025年）

#### 会员定价
- 单月购买：¥59.9/月
- 连续包月：¥49.9/月

#### API定价
- 企业用户：¥2,000/年/账户
- 个人用户：¥0.5/小时
- 高强度调用：灵活计费

#### 免费试用
- ✅ 新用户3个月免费试用
- ✅ ERNIE-3.5基础版永久免费

### API调用方式

```python
import requests

url = "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions"

headers = {
    "Content-Type": "application/json"
}

data = {
    "messages": [
        {"role": "user", "content": "你好"}
    ]
}

response = requests.post(url, headers=headers, json=data)
```

### 优势
- ✅ **百度生态**: 搜索、地图等数据支持
- ✅ **中文优秀**: 中文理解能力强
- ✅ **医疗优化**: 在医疗领域有专项优化
- ✅ **企业级**: 稳定性和安全性好
- ✅ **3.5版免费**: 基础功能不花钱

### 劣势
- ⚠️ 4.0版本需要付费会员
- ⚠️ API定价相对复杂
- ⚠️ 免费额度有限

### 推荐用途
- **医疗场景**: 有医疗领域优化
- **企业用户**: 需要稳定性和合规性
- **百度生态**: 与其他百度服务集成

---

## 💰 成本对比分析

### 场景1：每天100次诊断（月3000次）

假设每次诊断：输入1K tokens + 输出1K tokens = 2K tokens/次

| 平台 | 推荐模型 | 月成本 | 年成本 |
|------|----------|--------|--------|
| **智谱AI** | GLM-4-Flash | **¥0** | **¥0** |
| **讯飞** | 星火Lite | **¥0** | **¥0** |
| 智谱AI | GLM-4-Plus | ¥30 | ¥360 |
| 阿里云 | qwen-turbo | ¥48 | ¥576 |
| 阿里云 | qwen-plus | ¥96 | ¥1,152 |
| 百度 | 文心3.5 | ¥0 | ¥0 |
| 阿里云 | qwen-max | ¥960 | ¥11,520 |

### 场景2：每天1000次诊断（月30000次）

| 平台 | 推荐模型 | 月成本 | 年成本 |
|------|----------|--------|--------|
| **智谱AI** | GLM-4-Flash | **¥0** | **¥0** |
| 智谱AI | GLM-4-Plus | ¥300 | ¥3,600 |
| 阿里云 | qwen-turbo | ¥480 | ¥5,760 |
| 讯飞 | 星火Pro | ¥252 | ¥3,024 |
| 阿里云 | qwen-plus | ¥960 | ¥11,520 |
| 阿里云 | qwen-max | ¥9,600 | ¥115,200 |

### 💡 成本优化建议

1. **初期（日均<100次）**: 使用GLM-4-Flash或星火Lite（完全免费）
2. **成长期（日均100-500次）**: 使用GLM-4-Plus（月成本¥30-150）
3. **成熟期（日均500-1000次）**: 使用qwen-plus或GLM-4-Plus
4. **大规模（日均>1000次）**: 考虑混合策略或企业定制

---

## 🎯 推荐集成方案

### 方案A：极致性价比（推荐⭐⭐⭐⭐⭐）

**主力模型**: GLM-4-Flash（智谱AI）
- ✅ 完全免费
- ✅ 性能够用
- ✅ 128K上下文

**备用模型**: 星火Lite（讯飞）
- ✅ 永久免费
- ✅ 稳定可靠

**高级模型**: qwen-plus（阿里云）
- ✅ 复杂诊断时切换
- ✅ 按需付费

**预计成本**: 月均¥0-50

### 方案B：性能优先

**主力模型**: qwen-plus（阿里云）
- ✅ 131K超长上下文
- ✅ 中文能力顶尖
- ✅ 医疗场景友好

**备用模型**: GLM-4-Plus（智谱AI）
- ✅ 成本极低
- ✅ 降级方案

**高级模型**: qwen-max（阿里云）
- ✅ 复杂案例
- ✅ 最强性能

**预计成本**: 月均¥100-500

### 方案C：混合策略（平衡⭐⭐⭐⭐）

**快速响应**: GLM-4-Flash（免费）
**常规诊断**: GLM-4-Plus（低成本）
**复杂案例**: qwen-plus（高质量）
**终极方案**: qwen-max（最强）

**智能路由**:
- 简单问题 → GLM-4-Flash
- 中等复杂 → GLM-4-Plus
- 高度复杂 → qwen-plus
- 极端情况 → qwen-max

**预计成本**: 月均¥30-200（根据复杂度自动调整）

---

## 🔧 技术实施建议

### 1. 统一接口设计

```javascript
class AIModelAdapter {
    constructor(config) {
        this.providers = {
            'qwen': new QwenProvider(config.qwen),
            'glm': new GLMProvider(config.glm),
            'spark': new SparkProvider(config.spark),
            'ernie': new ErnieProvider(config.ernie)
        };
        this.defaultModel = config.defaultModel;
    }

    async chat(messages, model = null) {
        const targetModel = model || this.defaultModel;
        const provider = this.getProvider(targetModel);
        return await provider.chat(messages);
    }
}
```

### 2. 智能降级策略

```javascript
async function smartChat(messages) {
    try {
        // 尝试主模型
        return await chat(messages, 'qwen-plus');
    } catch (error) {
        console.log('主模型失败，切换到备用模型');
        try {
            // 尝试备用模型
            return await chat(messages, 'glm-4-plus');
        } catch (error2) {
            // 最后使用免费模型
            return await chat(messages, 'glm-4-flash');
        }
    }
}
```

### 3. 成本监控

```javascript
class CostTracker {
    constructor() {
        this.usage = {
            qwen: { input: 0, output: 0, cost: 0 },
            glm: { input: 0, output: 0, cost: 0 },
            spark: { input: 0, output: 0, cost: 0 },
            ernie: { input: 0, output: 0, cost: 0 }
        };
    }

    track(model, inputTokens, outputTokens) {
        // 记录使用量并计算成本
    }

    getMonthlyReport() {
        // 生成月度报告
    }
}
```

---

## 📋 实施优先级

### Phase 1：基础集成（Week 1-2）
- [x] 调研完成 ✅
- [ ] 集成GLM-4-Flash（免费，快速验证）
- [ ] 集成qwen-plus（高质量方案）
- [ ] 创建统一接口

### Phase 2：功能完善（Week 3-4）
- [ ] 添加星火Lite（备用免费方案）
- [ ] 实现智能路由
- [ ] 添加成本监控
- [ ] 错误处理和重试

### Phase 3：高级功能（Week 5-6）
- [ ] 实现流式输出
- [ ] 模型对比功能
- [ ] 响应缓存
- [ ] 性能优化

---

## 🎯 推荐决策

### 立即集成（优先级1）
1. **GLM-4-Flash**（智谱AI）- 免费，快速验证
2. **qwen-plus**（阿里云）- 高质量，医疗友好

### 后续集成（优先级2）
3. **星火Lite**（讯飞）- 免费备份
4. **GLM-4-Plus**（智谱AI）- 低成本替代

### 可选集成（优先级3）
5. **qwen-max**（阿里云）- 复杂案例
6. **文心3.5**（百度）- 医疗优化

---

## 📊 总结

| 评估维度 | 通义千问 | ChatGLM | 星火 | 文心一言 |
|----------|----------|---------|------|----------|
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **价格** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **中文** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **医疗** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **易用** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **生态** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 最终推荐 🏆

**最佳组合**：**GLM-4-Flash + qwen-plus**

理由：
1. GLM-4-Flash免费，适合初期验证和高频低价值查询
2. qwen-plus高质量，适合正式诊断
3. 成本可控，月均¥50-100
4. 技术风险分散，避免单点故障

---

**调研人**: Claude AI Assistant
**下一步**: 开始架构设计和接口开发
**预计完成时间**: 2-3周
