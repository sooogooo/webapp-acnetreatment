/**
 * ErnieProvider - Baidu Wenxin Yiyan Large Model Provider
 *
 * Supports Baidu Ernie series models API calls
 * Uses OAuth 2.0 authentication and REST API
 *
 * @author Claude AI Assistant
 * @date 2025-10-27
 */

class ErnieProvider extends BaseProvider {
    constructor(apiKey, secretKey, modelName = 'ernie-speed') {
        super('ernie', apiKey);

        this.secretKey = secretKey;
        this.modelName = modelName;
        this.accessToken = null;
        this.tokenExpireTime = null;

        // Model configuration
        this.modelConfig = {
            'ernie-speed': {
                endpoint: '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed',
                maxTokens: 2048,
                price: { input: 0.0, output: 0.0 }
            },
            'ernie-lite': {
                endpoint: '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-lite-8k',
                maxTokens: 8192,
                price: { input: 0.008, output: 0.008 }
            },
            'ernie-turbo': {
                endpoint: '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_bot_8k',
                maxTokens: 8192,
                price: { input: 0.012, output: 0.012 }
            },
            'ernie-4.0': {
                endpoint: '/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro',
                maxTokens: 4096,
                price: { input: 0.12, output: 0.12 }
            }
        };

        this.config = this.modelConfig[modelName] || this.modelConfig['ernie-speed'];
        this.baseURL = 'https://aip.baidubce.com';

        this.log('info', `ErnieProvider initialized with model: ${modelName}`);
    }

    async getAccessToken() {
        if (this.accessToken && this.tokenExpireTime && Date.now() < this.tokenExpireTime) {
            return this.accessToken;
        }

        try {
            const tokenUrl = `${this.baseURL}/oauth/2.0/token?grant_type=client_credentials&client_id=${this.apiKey}&client_secret=${this.secretKey}`;

            const response = await this.fetchWithTimeout(tokenUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to get Access Token: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(`Baidu API Error: ${data.error_description || data.error}`);
            }

            this.accessToken = data.access_token;
            this.tokenExpireTime = Date.now() + (data.expires_in - 86400) * 1000;

            this.log('info', 'Access Token obtained successfully');
            return this.accessToken;

        } catch (error) {
            this.log('error', 'Failed to get Access Token', error);
            throw error;
        }
    }

    async chat(messages, options = {}) {
        const startTime = Date.now();

        try {
            const token = await this.getAccessToken();
            const url = `${this.baseURL}${this.config.endpoint}?access_token=${token}`;

            const requestBody = {
                messages: this.formatMessages(messages),
                temperature: options.temperature ?? 0.7,
                top_p: options.top_p ?? 0.9,
                penalty_score: options.penalty_score ?? 1.0,
                stream: false,
                system: options.system || undefined,
                user_id: options.user_id || undefined
            };

            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Ernie API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            if (data.error_code) {
                throw new Error(`Ernie API Error [${data.error_code}]: ${data.error_msg}`);
            }

            const responseTime = Date.now() - startTime;

            this.updateStats({
                calls: 1,
                successfulCalls: 1,
                totalTokens: data.usage?.total_tokens || 0,
                totalCost: this.calculateCost(
                    data.usage?.prompt_tokens || 0,
                    data.usage?.completion_tokens || 0
                ),
                totalResponseTime: responseTime
            });

            return {
                content: data.result,
                role: 'assistant',
                usage: data.usage,
                id: data.id,
                created: data.created
            };

        } catch (error) {
            this.log('error', 'Ernie API call failed', error);
            this.updateStats({
                calls: 1,
                failedCalls: 1
            });
            throw error;
        }
    }

    async streamChat(messages, onChunk, options = {}) {
        const startTime = Date.now();

        try {
            const token = await this.getAccessToken();
            const url = `${this.baseURL}${this.config.endpoint}?access_token=${token}`;

            const requestBody = {
                messages: this.formatMessages(messages),
                temperature: options.temperature ?? 0.7,
                top_p: options.top_p ?? 0.9,
                penalty_score: options.penalty_score ?? 1.0,
                stream: true,
                system: options.system || undefined,
                user_id: options.user_id || undefined
            };

            const response = await this.fetchWithTimeout(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'text/event-stream'
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Ernie Stream API request failed: ${response.status} ${response.statusText}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';
            let totalTokens = 0;
            let promptTokens = 0;
            let completionTokens = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const jsonStr = line.substring(6);
                        if (jsonStr.trim() === '') continue;

                        try {
                            const data = JSON.parse(jsonStr);

                            if (data.error_code) {
                                throw new Error(`Ernie Stream Error [${data.error_code}]: ${data.error_msg}`);
                            }

                            if (data.result) {
                                onChunk({
                                    content: data.result,
                                    role: 'assistant',
                                    usage: data.usage
                                });
                            }

                            if (data.usage) {
                                totalTokens = data.usage.total_tokens || 0;
                                promptTokens = data.usage.prompt_tokens || 0;
                                completionTokens = data.usage.completion_tokens || 0;
                            }

                            if (data.is_end) {
                                break;
                            }

                        } catch (parseError) {
                            this.log('warn', 'SSE data parse failed', parseError);
                        }
                    }
                }
            }

            const responseTime = Date.now() - startTime;

            this.updateStats({
                calls: 1,
                successfulCalls: 1,
                totalTokens,
                totalCost: this.calculateCost(promptTokens, completionTokens),
                totalResponseTime: responseTime
            });

        } catch (error) {
            this.log('error', 'Ernie Stream API call failed', error);
            this.updateStats({
                calls: 1,
                failedCalls: 1
            });
            throw error;
        }
    }

    formatMessages(messages) {
        // Ernie does not support system role, convert to user
        return messages.map(msg => {
            if (msg.role === 'system') {
                return {
                    role: 'user',
                    content: `[System Prompt] ${msg.content}`
                };
            }
            return {
                role: msg.role,
                content: msg.content
            };
        });
    }

    calculateCost(inputTokens, outputTokens) {
        const inputCost = (inputTokens / 1000) * this.config.price.input;
        const outputCost = (outputTokens / 1000) * this.config.price.output;
        return inputCost + outputCost;
    }

    async refreshToken() {
        this.accessToken = null;
        this.tokenExpireTime = null;
        return await this.getAccessToken();
    }

    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [ErnieProvider] [${level.toUpperCase()}]`;

        if (data) {
            console[level](`${prefix} ${message}`, data);
        } else {
            console[level](`${prefix} ${message}`);
        }
    }
}

// Export ErnieProvider class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErnieProvider;
}
