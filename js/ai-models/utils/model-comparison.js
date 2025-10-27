/**
 * ModelComparison - AI Model Comparison Utility
 *
 * Parallel testing and comparison of multiple AI models
 * Provides comprehensive performance and cost analysis
 *
 * @author Claude AI Assistant
 * @date 2025-10-27
 */

class ModelComparison {
    /**
     * Constructor
     * @param {AIModelManager} modelManager - AI Model Manager instance
     * @param {CostTracker} costTracker - Cost Tracker instance
     */
    constructor(modelManager, costTracker) {
        this.modelManager = modelManager;
        this.costTracker = costTracker;

        this.log('info', 'ModelComparison initialized');
    }

    /**
     * Compare multiple models with the same prompt
     * @param {Array<string>} modelNames - Array of model names to compare
     * @param {Array} messages - Messages to send
     * @param {Object} options - Options
     * @returns {Promise<Object>} Comparison results
     */
    async compareModels(modelNames, messages, options = {}) {
        this.log('info', `Starting comparison of ${modelNames.length} models`);

        const startTime = Date.now();
        const results = [];

        // Parallel execution of all models
        const promises = modelNames.map(async (modelName) => {
            const modelStartTime = Date.now();

            try {
                // Get provider for this model
                const provider = this.modelManager.providers.get(modelName);
                if (!provider) {
                    throw new Error(`Model ${modelName} not found`);
                }

                // Call the model
                const response = await provider.chat(messages, options);

                const responseTime = Date.now() - modelStartTime;

                return {
                    modelName,
                    success: true,
                    response: response.content,
                    responseTime,
                    tokens: response.usage?.total_tokens || 0,
                    cost: this.calculateCost(provider, response.usage),
                    error: null
                };

            } catch (error) {
                const responseTime = Date.now() - modelStartTime;

                return {
                    modelName,
                    success: false,
                    response: null,
                    responseTime,
                    tokens: 0,
                    cost: 0,
                    error: error.message
                };
            }
        });

        // Wait for all to complete
        const modelResults = await Promise.all(promises);
        const totalTime = Date.now() - startTime;

        // Calculate rankings and scores
        const rankedResults = this.rankResults(modelResults);

        return {
            models: modelNames,
            results: rankedResults,
            totalTime,
            timestamp: new Date().toISOString(),
            prompt: messages,
            options
        };
    }

    /**
     * Calculate cost for a model response
     * @param {Object} provider - Provider instance
     * @param {Object} usage - Usage data
     * @returns {number} Cost in yuan
     */
    calculateCost(provider, usage) {
        if (!usage) return 0;

        const inputTokens = usage.prompt_tokens || usage.input_tokens || 0;
        const outputTokens = usage.completion_tokens || usage.output_tokens || 0;

        if (typeof provider.calculateCost === 'function') {
            return provider.calculateCost(inputTokens, outputTokens);
        }

        return 0;
    }

    /**
     * Rank and score results
     * @param {Array} results - Raw results
     * @returns {Array} Ranked results with scores
     */
    rankResults(results) {
        const successfulResults = results.filter(r => r.success);

        if (successfulResults.length === 0) {
            return results.map(r => ({
                ...r,
                scores: {
                    speed: 0,
                    costEfficiency: 0,
                    outputLength: 0,
                    overall: 0
                },
                rank: 0
            }));
        }

        // Find min/max values for normalization
        const maxResponseTime = Math.max(...successfulResults.map(r => r.responseTime));
        const minResponseTime = Math.min(...successfulResults.map(r => r.responseTime));
        const maxCost = Math.max(...successfulResults.map(r => r.cost));
        const minCost = Math.min(...successfulResults.map(r => r.cost));
        const maxOutputLength = Math.max(...successfulResults.map(r => r.response?.length || 0));
        const minOutputLength = Math.min(...successfulResults.map(r => r.response?.length || 0));

        // Calculate scores for each result
        const scoredResults = results.map(result => {
            if (!result.success) {
                return {
                    ...result,
                    scores: {
                        speed: 0,
                        costEfficiency: 0,
                        outputLength: 0,
                        overall: 0
                    },
                    rank: 0
                };
            }

            // Speed score (0-100, faster is better)
            const speedScore = maxResponseTime === minResponseTime ? 100 :
                100 - ((result.responseTime - minResponseTime) / (maxResponseTime - minResponseTime)) * 100;

            // Cost efficiency score (0-100, cheaper is better)
            const costScore = maxCost === minCost ? 100 :
                100 - ((result.cost - minCost) / (maxCost - minCost)) * 100;

            // Output length score (0-100, longer is better, assuming more detailed)
            const outputLength = result.response?.length || 0;
            const lengthScore = maxOutputLength === minOutputLength ? 100 :
                ((outputLength - minOutputLength) / (maxOutputLength - minOutputLength)) * 100;

            // Overall score (weighted average)
            const overall = (speedScore * 0.3) + (costScore * 0.4) + (lengthScore * 0.3);

            return {
                ...result,
                scores: {
                    speed: Math.round(speedScore),
                    costEfficiency: Math.round(costScore),
                    outputLength: Math.round(lengthScore),
                    overall: Math.round(overall)
                }
            };
        });

        // Rank by overall score
        const ranked = scoredResults.sort((a, b) => b.scores.overall - a.scores.overall);
        ranked.forEach((result, index) => {
            result.rank = index + 1;
        });

        return ranked;
    }

    /**
     * Generate comparison report
     * @param {Object} comparisonData - Comparison data
     * @returns {string} Markdown report
     */
    generateReport(comparisonData) {
        const { models, results, totalTime, timestamp } = comparisonData;

        let report = `# AI Model Comparison Report\n\n`;
        report += `**Generated**: ${new Date(timestamp).toLocaleString()}\n`;
        report += `**Models**: ${models.join(', ')}\n`;
        report += `**Total Time**: ${totalTime}ms\n\n`;

        report += `## Rankings\n\n`;
        report += `| Rank | Model | Overall Score | Speed | Cost Efficiency | Output Length |\n`;
        report += `|------|-------|---------------|-------|-----------------|---------------|\n`;

        results.forEach(result => {
            if (result.success) {
                report += `| ${result.rank} | ${result.modelName} | ${result.scores.overall} | ${result.scores.speed} | ${result.scores.costEfficiency} | ${result.scores.outputLength} |\n`;
            }
        });

        report += `\n## Detailed Results\n\n`;

        results.forEach(result => {
            report += `### ${result.modelName}\n\n`;

            if (result.success) {
                report += `- **Status**: Success ✓\n`;
                report += `- **Response Time**: ${result.responseTime}ms\n`;
                report += `- **Tokens**: ${result.tokens}\n`;
                report += `- **Cost**: ¥${result.cost.toFixed(4)}\n`;
                report += `- **Output Length**: ${result.response?.length || 0} characters\n`;
                report += `- **Scores**:\n`;
                report += `  - Speed: ${result.scores.speed}/100\n`;
                report += `  - Cost Efficiency: ${result.scores.costEfficiency}/100\n`;
                report += `  - Output Quality: ${result.scores.outputLength}/100\n`;
                report += `  - Overall: ${result.scores.overall}/100\n\n`;
                report += `**Response**:\n\`\`\`\n${result.response}\n\`\`\`\n\n`;
            } else {
                report += `- **Status**: Failed ✗\n`;
                report += `- **Error**: ${result.error}\n\n`;
            }
        });

        return report;
    }

    /**
     * Export comparison results to CSV
     * @param {Object} comparisonData - Comparison data
     * @returns {string} CSV content
     */
    exportToCSV(comparisonData) {
        const { results } = comparisonData;

        let csv = 'Rank,Model,Success,Response Time (ms),Tokens,Cost (¥),Speed Score,Cost Score,Length Score,Overall Score\n';

        results.forEach(result => {
            csv += `${result.rank || 'N/A'},`;
            csv += `${result.modelName},`;
            csv += `${result.success ? 'Yes' : 'No'},`;
            csv += `${result.responseTime},`;
            csv += `${result.tokens},`;
            csv += `${result.cost.toFixed(4)},`;
            csv += `${result.scores?.speed || 0},`;
            csv += `${result.scores?.costEfficiency || 0},`;
            csv += `${result.scores?.outputLength || 0},`;
            csv += `${result.scores?.overall || 0}\n`;
        });

        return csv;
    }

    /**
     * Download comparison results as CSV
     * @param {Object} comparisonData - Comparison data
     */
    downloadCSV(comparisonData) {
        const csv = this.exportToCSV(comparisonData);
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `model-comparison-${Date.now()}.csv`;
        link.click();

        URL.revokeObjectURL(url);
        this.log('info', 'CSV exported successfully');
    }

    /**
     * Log message
     */
    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [ModelComparison] [${level.toUpperCase()}]`;

        if (data) {
            console[level](`${prefix} ${message}`, data);
        } else {
            console[level](`${prefix} ${message}`);
        }
    }
}

// Export ModelComparison class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModelComparison;
}
