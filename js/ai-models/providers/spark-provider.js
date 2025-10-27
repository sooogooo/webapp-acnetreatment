/**
 * SparkProvider - ¯Þk¤å'!‹Provider
 *
 * /¯Þkû!‹„API(
 * (WebSocketO®ÛLá
 *
 * @author Claude AI Assistant
 * @date 2025-10-27
 */

class SparkProvider extends BaseProvider {
    /**
     * „ ýp
     * @param {string} apiKey - API Key
     * @param {string} appId - ”(ID
     * @param {string} apiSecret - API Secret
     * @param {string} modelName - !‹ð
     */
    constructor(apiKey, appId, apiSecret, modelName = 'spark-lite') {
        super('spark', apiKey);

        this.appId = appId;
        this.apiSecret = apiSecret;
        this.modelName = modelName;

        // !‹Mn
        this.modelConfig = {
            'spark-lite': {
                domain: 'lite',
                url: 'wss://spark-api.xf-yun.com/v1.1/chat',
                maxTokens: 4096,
                price: { input: 0.0, output: 0.0 }  // M9
            },
            'spark-pro': {
                domain: 'generalv3',
                url: 'wss://spark-api.xf-yun.com/v3.1/chat',
                maxTokens: 8192,
                price: { input: 0.003, output: 0.003 }  // ¥0.003/1K tokens
            },
            'spark-max': {
                domain: 'generalv3.5',
                url: 'wss://spark-api.xf-yun.com/v3.5/chat',
                maxTokens: 8192,
                price: { input: 0.006, output: 0.006 }  // ¥0.006/1K tokens
            }
        };

        this.config = this.modelConfig[modelName] || this.modelConfig['spark-lite'];
        this.ws = null;

        this.log('info', `SparkProvider initialized with model: ${modelName}`);
    }

    /**
     * ^AùÝ
     * @param {Array} messages - ˆopÄ
     * @param {Object} options - 	y
     * @returns {Promise<Object>} Í”
     */
    async chat(messages, options = {}) {
        return new Promise((resolve, reject) => {
            let fullResponse = '';
            let totalTokens = 0;

            this.streamChat(messages, (chunk) => {
                fullResponse += chunk.content;
                if (chunk.usage) {
                    totalTokens = chunk.usage.total_tokens;
                }
            }, options)
            .then(() => {
                resolve({
                    content: fullResponse,
                    usage: { total_tokens: totalTokens }
                });
            })
            .catch(reject);
        });
    }

    /**
     * AùÝ
     * @param {Array} messages - ˆopÄ
     * @param {Function} onChunk - ¥6chunk„Þ
     * @param {Object} options - 	y
     * @returns {Promise<void>}
     */
    async streamChat(messages, onChunk, options = {}) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            try {
                // ¤ÁURL
                const authUrl = this.generateAuthUrl();

                // úËWebSocketÞ¥
                this.ws = new WebSocket(authUrl);

                this.ws.onopen = () => {
                    this.log('info', 'WebSocketÞ¥òúË');

                    // Ñ÷Bpn
                    const requestData = this.buildRequestData(messages, options);
                    this.ws.send(JSON.stringify(requestData));
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);

                        // Àåï
                        if (data.header.code !== 0) {
                            reject(new Error(`Spark API Error: ${data.header.message}`));
                            this.ws.close();
                            return;
                        }

                        // ÐÖ…¹
                        const content = data.payload?.choices?.text?.[0]?.content || '';

                        if (content) {
                            onChunk({
                                content,
                                role: 'assistant',
                                usage: data.payload?.usage
                            });
                        }

                        // Àå/&Ó_
                        if (data.header.status === 2) {
                            const responseTime = Date.now() - startTime;

                            // ô°ß¡
                            this.updateStats({
                                calls: 1,
                                successfulCalls: 1,
                                totalTokens: data.payload?.usage?.total_tokens || 0,
                                totalCost: this.calculateCost(
                                    data.payload?.usage?.prompt_tokens || 0,
                                    data.payload?.usage?.completion_tokens || 0
                                ),
                                totalResponseTime: responseTime
                            });

                            this.ws.close();
                            resolve();
                        }
                    } catch (error) {
                        this.log('error', 'WebSocketˆoã1%', error);
                        reject(error);
                    }
                };

                this.ws.onerror = (error) => {
                    this.log('error', 'WebSocketï', error);
                    this.updateStats({ calls: 1, failedCalls: 1 });
                    reject(new Error('WebSocketÞ¥ï'));
                };

                this.ws.onclose = () => {
                    this.log('info', 'WebSocketÞ¥òsí');
                };

            } catch (error) {
                this.log('error', 'Spark API(1%', error);
                this.updateStats({ calls: 1, failedCalls: 1 });
                reject(error);
            }
        });
    }

    /**
     * ¤ÁURL
     * @returns {string} &¤ÁÂp„WebSocket URL
     */
    generateAuthUrl() {
        const url = new URL(this.config.url);
        const host = url.host;
        const path = url.pathname;

        // RFC1123<„öô3
        const date = new Date().toUTCString();

        // „ú~W&2
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;

        // (HMAC-SHA256 Æ
        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', this.apiSecret);
        hmac.update(signatureOrigin);
        const signature = hmac.digest('base64');

        // „úauthorization
        const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
        const authorization = Buffer.from(authorizationOrigin).toString('base64');

        // „úŒtURL
        return `${this.config.url}?authorization=${encodeURIComponent(authorization)}&date=${encodeURIComponent(date)}&host=${encodeURIComponent(host)}`;
    }

    /**
     * „ú÷Bpn
     * @param {Array} messages - ˆopÄ
     * @param {Object} options - 	y
     * @returns {Object} ÷Bpn
     */
    buildRequestData(messages, options = {}) {
        const formattedMessages = this.formatMessages(messages);

        return {
            header: {
                app_id: this.appId,
                uid: options.uid || 'user-' + Date.now()
            },
            parameter: {
                chat: {
                    domain: this.config.domain,
                    temperature: options.temperature ?? 0.5,
                    max_tokens: options.max_tokens ?? 2048,
                    top_k: options.top_k ?? 4,
                    chat_id: options.chat_id || ''
                }
            },
            payload: {
                message: {
                    text: formattedMessages
                }
            }
        };
    }

    /**
     * <ˆo
     * @param {Array} messages - ŸËˆo
     * @returns {Array} <„ˆo
     */
    formatMessages(messages) {
        return messages.map(msg => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            content: msg.content
        }));
    }

    /**
     * ¡—9(
     * @param {number} inputTokens - “etokens
     * @param {number} outputTokens - “útokens
     * @returns {number} 9(C	
     */
    calculateCost(inputTokens, outputTokens) {
        const inputCost = (inputTokens / 1000) * this.config.price.input;
        const outputCost = (outputTokens / 1000) * this.config.price.output;
        return inputCost + outputCost;
    }

    /**
     * síÞ¥
     */
    close() {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.close();
            this.log('info', 'WebSocketÞ¥òK¨sí');
        }
    }

    /**
     * å×°U
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [SparkProvider] [${level.toUpperCase()}]`;

        if (data) {
            console[level](`${prefix} ${message}`, data);
        } else {
            console[level](`${prefix} ${message}`);
        }
    }
}

// üúSparkProvider{
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SparkProvider;
}
