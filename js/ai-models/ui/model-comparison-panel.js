/**
 * ModelComparisonPanel - Model Comparison UI Component
 *
 * Visual interface for comparing multiple AI models
 * Displays results with charts, rankings, and detailed analysis
 *
 * @author Claude AI Assistant
 * @date 2025-10-27
 */

class ModelComparisonPanel {
    constructor(modelComparison, options = {}) {
        this.modelComparison = modelComparison;
        this.containerId = options.containerId || 'ai-model-comparison-panel';
        this.comparisonResults = null;
        this.selectedModels = [];

        this.log('info', 'ModelComparisonPanel initialized');
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container #${this.containerId} not found`);
            return;
        }

        container.innerHTML = this.generateHTML();
        this.attachEventListeners();

        this.log('info', 'Model comparison panel rendered');
    }

    generateHTML() {
        return `
            <div class="comparison-panel">
                ${this.generateStyles()}

                <div class="panel-header">
                    <h2>🔍 AI Model Comparison</h2>
                    <p class="subtitle">Compare multiple models side-by-side</p>
                </div>

                <!-- Input Section -->
                <div class="input-section">
                    <h3>1️⃣ Select Models to Compare</h3>
                    <div class="model-checkboxes" id="model-checkboxes">
                        ${this.generateModelCheckboxes()}
                    </div>
                </div>

                <!-- Prompt Section -->
                <div class="prompt-section">
                    <h3>2️⃣ Enter Your Prompt</h3>
                    <textarea id="comparison-prompt"
                              placeholder="Enter your question or prompt here..."
                              rows="4"></textarea>
                </div>

                <!-- Options Section -->
                <div class="options-section">
                    <h3>3️⃣ Settings (Optional)</h3>
                    <div class="option-row">
                        <label>Temperature: <span id="temp-value">0.7</span></label>
                        <input type="range" id="temp-slider" min="0" max="1" step="0.1" value="0.7">
                    </div>
                    <div class="option-row">
                        <label>Max Tokens: <span id="tokens-value">500</span></label>
                        <input type="range" id="tokens-slider" min="100" max="2000" step="100" value="500">
                    </div>
                </div>

                <!-- Action Section -->
                <div class="action-section">
                    <button id="start-comparison" class="btn-primary">
                        🚀 Start Comparison
                    </button>
                </div>

                <!-- Results Section -->
                <div id="results-section" class="results-section" style="display: none;">
                    <h3>📊 Comparison Results</h3>

                    <!-- Rankings -->
                    <div id="rankings-container" class="rankings-container"></div>

                    <!-- Detailed Results -->
                    <div id="results-grid" class="results-grid"></div>

                    <!-- Export Actions -->
                    <div class="export-actions">
                        <button onclick="window.comparisonPanel.exportMarkdown()" class="btn-secondary">
                            📝 Export Markdown
                        </button>
                        <button onclick="window.comparisonPanel.exportCSV()" class="btn-secondary">
                            📊 Export CSV
                        </button>
                    </div>
                </div>

                <!-- Loading Overlay -->
                <div id="loading-overlay" class="loading-overlay" style="display: none;">
                    <div class="loading-content">
                        <div class="spinner"></div>
                        <p>Comparing models...</p>
                    </div>
                </div>
            </div>
        `;
    }

    generateModelCheckboxes() {
        const availableModels = [
            { name: 'glm-4-flash', label: 'GLM-4-Flash (Free)', badge: 'Free' },
            { name: 'qwen-turbo', label: 'Qwen-Turbo', badge: 'Fast' },
            { name: 'qwen-plus', label: 'Qwen-Plus', badge: 'Balanced' },
            { name: 'spark-lite', label: 'Spark-Lite (Free)', badge: 'Free' },
            { name: 'ernie-speed', label: 'Ernie-Speed (Free)', badge: 'Free' },
            { name: 'glm-4-plus', label: 'GLM-4-Plus', badge: 'Premium' }
        ];

        return availableModels.map(model => `
            <label class="model-checkbox">
                <input type="checkbox"
                       value="${model.name}"
                       class="model-check"
                       ${model.badge === 'Free' ? 'checked' : ''}>
                <span class="checkbox-label">
                    ${model.label}
                    <span class="model-badge ${model.badge.toLowerCase()}">${model.badge}</span>
                </span>
            </label>
        `).join('');
    }

    generateStyles() {
        return `
            <style>
                .comparison-panel {
                    max-width: 1400px;
                    margin: 20px auto;
                    padding: 30px;
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                }

                .panel-header {
                    text-align: center;
                    margin-bottom: 40px;
                }

                .panel-header h2 {
                    font-size: 2.5em;
                    color: #1f2937;
                    margin-bottom: 10px;
                }

                .subtitle {
                    color: #6b7280;
                    font-size: 1.1em;
                }

                /* Input Sections */
                .input-section,
                .prompt-section,
                .options-section {
                    margin-bottom: 30px;
                    padding: 25px;
                    background: #f9fafb;
                    border-radius: 15px;
                    border-left: 4px solid #667eea;
                }

                .input-section h3,
                .prompt-section h3,
                .options-section h3 {
                    color: #1f2937;
                    margin-bottom: 20px;
                    font-size: 1.3em;
                }

                /* Model Checkboxes */
                .model-checkboxes {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 15px;
                }

                .model-checkbox {
                    display: flex;
                    align-items: center;
                    padding: 12px 15px;
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .model-checkbox:hover {
                    border-color: #667eea;
                    background: #f3f4f6;
                }

                .model-checkbox input[type="checkbox"] {
                    margin-right: 10px;
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                }

                .checkbox-label {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    font-weight: 500;
                }

                .model-badge {
                    padding: 3px 10px;
                    border-radius: 12px;
                    font-size: 0.8em;
                    font-weight: 600;
                }

                .model-badge.free {
                    background: #d1fae5;
                    color: #059669;
                }

                .model-badge.fast {
                    background: #dbeafe;
                    color: #2563eb;
                }

                .model-badge.balanced {
                    background: #e0e7ff;
                    color: #6366f1;
                }

                .model-badge.premium {
                    background: #fce7f3;
                    color: #ec4899;
                }

                /* Prompt Textarea */
                #comparison-prompt {
                    width: 100%;
                    padding: 15px;
                    border: 2px solid #e5e7eb;
                    border-radius: 10px;
                    font-size: 1em;
                    font-family: inherit;
                    resize: vertical;
                    transition: border-color 0.3s ease;
                }

                #comparison-prompt:focus {
                    outline: none;
                    border-color: #667eea;
                }

                /* Options */
                .option-row {
                    margin-bottom: 15px;
                }

                .option-row label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 600;
                    color: #374151;
                }

                .option-row input[type="range"] {
                    width: 100%;
                    height: 6px;
                    border-radius: 3px;
                    background: #e5e7eb;
                    outline: none;
                }

                /* Action Section */
                .action-section {
                    text-align: center;
                    margin: 30px 0;
                }

                .btn-primary {
                    padding: 15px 50px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 25px;
                    font-size: 1.2em;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
                }

                .btn-primary:active {
                    transform: translateY(0);
                }

                .btn-primary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Results Section */
                .results-section {
                    margin-top: 40px;
                    padding-top: 40px;
                    border-top: 3px solid #e5e7eb;
                }

                .results-section h3 {
                    text-align: center;
                    font-size: 2em;
                    color: #1f2937;
                    margin-bottom: 30px;
                }

                /* Rankings */
                .rankings-container {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 40px;
                    flex-wrap: wrap;
                }

                .rank-card {
                    text-align: center;
                    padding: 20px 30px;
                    border-radius: 15px;
                    min-width: 200px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }

                .rank-card:hover {
                    transform: translateY(-5px);
                }

                .rank-card.rank-1 {
                    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                    color: white;
                    font-size: 1.1em;
                }

                .rank-card.rank-2 {
                    background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
                    color: white;
                }

                .rank-card.rank-3 {
                    background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
                    color: white;
                }

                .rank-card.rank-other {
                    background: #f3f4f6;
                    color: #1f2937;
                }

                .rank-number {
                    font-size: 2em;
                    font-weight: 700;
                    margin-bottom: 5px;
                }

                .rank-model {
                    font-weight: 600;
                    margin-bottom: 10px;
                }

                .rank-score {
                    font-size: 1.5em;
                    font-weight: 700;
                }

                /* Results Grid */
                .results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                    gap: 25px;
                    margin-bottom: 30px;
                }

                .result-card {
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 15px;
                    padding: 20px;
                    transition: all 0.3s ease;
                }

                .result-card:hover {
                    border-color: #667eea;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                }

                .result-card.success {
                    border-left: 4px solid #10b981;
                }

                .result-card.failed {
                    border-left: 4px solid #ef4444;
                    opacity: 0.7;
                }

                .result-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid #e5e7eb;
                }

                .result-model-name {
                    font-size: 1.3em;
                    font-weight: 700;
                    color: #1f2937;
                }

                .result-rank-badge {
                    padding: 5px 15px;
                    border-radius: 20px;
                    font-weight: 700;
                    font-size: 0.9em;
                }

                .result-rank-badge.rank-1 { background: #fbbf24; color: white; }
                .result-rank-badge.rank-2 { background: #94a3b8; color: white; }
                .result-rank-badge.rank-3 { background: #fb923c; color: white; }
                .result-rank-badge.rank-other { background: #e5e7eb; color: #6b7280; }

                .result-metrics {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .metric-item {
                    padding: 10px;
                    background: #f9fafb;
                    border-radius: 8px;
                }

                .metric-label {
                    font-size: 0.85em;
                    color: #6b7280;
                    margin-bottom: 5px;
                }

                .metric-value {
                    font-size: 1.1em;
                    font-weight: 700;
                    color: #1f2937;
                }

                .result-scores {
                    margin-bottom: 15px;
                }

                .score-bar {
                    margin-bottom: 10px;
                }

                .score-label {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.85em;
                    margin-bottom: 5px;
                    color: #6b7280;
                }

                .score-progress {
                    height: 8px;
                    background: #e5e7eb;
                    border-radius: 10px;
                    overflow: hidden;
                }

                .score-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-radius: 10px;
                    transition: width 0.5s ease;
                }

                .result-response {
                    padding: 15px;
                    background: #f9fafb;
                    border-radius: 10px;
                    max-height: 200px;
                    overflow-y: auto;
                    font-size: 0.9em;
                    line-height: 1.6;
                    color: #374151;
                }

                .result-error {
                    color: #ef4444;
                    font-weight: 600;
                }

                /* Export Actions */
                .export-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 30px;
                }

                .btn-secondary {
                    padding: 12px 30px;
                    background: white;
                    color: #667eea;
                    border: 2px solid #667eea;
                    border-radius: 25px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-secondary:hover {
                    background: #667eea;
                    color: white;
                }

                /* Loading Overlay */
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                }

                .loading-content {
                    text-align: center;
                    color: white;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid rgba(255,255,255,0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .comparison-panel {
                        padding: 20px;
                    }

                    .model-checkboxes {
                        grid-template-columns: 1fr;
                    }

                    .results-grid {
                        grid-template-columns: 1fr;
                    }

                    .rankings-container {
                        flex-direction: column;
                        align-items: center;
                    }

                    .rank-card {
                        width: 100%;
                        max-width: 300px;
                    }
                }
            </style>
        `;
    }

    attachEventListeners() {
        window.comparisonPanel = this;

        // Temperature slider
        const tempSlider = document.getElementById('temp-slider');
        const tempValue = document.getElementById('temp-value');
        if (tempSlider) {
            tempSlider.oninput = () => {
                tempValue.textContent = tempSlider.value;
            };
        }

        // Tokens slider
        const tokensSlider = document.getElementById('tokens-slider');
        const tokensValue = document.getElementById('tokens-value');
        if (tokensSlider) {
            tokensSlider.oninput = () => {
                tokensValue.textContent = tokensSlider.value;
            };
        }

        // Start comparison button
        const startBtn = document.getElementById('start-comparison');
        if (startBtn) {
            startBtn.onclick = () => this.startComparison();
        }
    }

    async startComparison() {
        // Get selected models
        const checkboxes = document.querySelectorAll('.model-check:checked');
        this.selectedModels = Array.from(checkboxes).map(cb => cb.value);

        if (this.selectedModels.length < 2) {
            alert('Please select at least 2 models to compare');
            return;
        }

        // Get prompt
        const prompt = document.getElementById('comparison-prompt').value.trim();
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        // Get options
        const temperature = parseFloat(document.getElementById('temp-slider').value);
        const max_tokens = parseInt(document.getElementById('tokens-slider').value);

        // Show loading
        document.getElementById('loading-overlay').style.display = 'flex';

        try {
            // Run comparison
            const results = await this.modelComparison.compareModels(
                this.selectedModels,
                [{ role: 'user', content: prompt }],
                { temperature, max_tokens }
            );

            this.comparisonResults = results;
            this.displayResults(results);

        } catch (error) {
            alert('Comparison failed: ' + error.message);
            console.error(error);
        } finally {
            document.getElementById('loading-overlay').style.display = 'none';
        }
    }

    displayResults(results) {
        // Show results section
        const resultsSection = document.getElementById('results-section');
        resultsSection.style.display = 'block';

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Display rankings
        this.displayRankings(results);

        // Display detailed results
        this.displayDetailedResults(results);
    }

    displayRankings(results) {
        const container = document.getElementById('rankings-container');
        const successfulResults = results.results.filter(r => r.success);

        container.innerHTML = successfulResults.map(result => `
            <div class="rank-card rank-${result.rank <= 3 ? result.rank : 'other'}">
                <div class="rank-number">#${result.rank}</div>
                <div class="rank-model">${result.modelName}</div>
                <div class="rank-score">${result.scores.overall}/100</div>
            </div>
        `).join('');
    }

    displayDetailedResults(results) {
        const container = document.getElementById('results-grid');

        container.innerHTML = results.results.map(result => `
            <div class="result-card ${result.success ? 'success' : 'failed'}">
                <div class="result-header">
                    <div class="result-model-name">${result.modelName}</div>
                    ${result.success ? `
                        <div class="result-rank-badge rank-${result.rank <= 3 ? result.rank : 'other'}">
                            #${result.rank}
                        </div>
                    ` : ''}
                </div>

                ${result.success ? `
                    <div class="result-metrics">
                        <div class="metric-item">
                            <div class="metric-label">Response Time</div>
                            <div class="metric-value">${result.responseTime}ms</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Tokens</div>
                            <div class="metric-value">${result.tokens}</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Cost</div>
                            <div class="metric-value">¥${result.cost.toFixed(4)}</div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Length</div>
                            <div class="metric-value">${result.response.length} chars</div>
                        </div>
                    </div>

                    <div class="result-scores">
                        <div class="score-bar">
                            <div class="score-label">
                                <span>Speed</span>
                                <span>${result.scores.speed}/100</span>
                            </div>
                            <div class="score-progress">
                                <div class="score-fill" style="width: ${result.scores.speed}%"></div>
                            </div>
                        </div>
                        <div class="score-bar">
                            <div class="score-label">
                                <span>Cost Efficiency</span>
                                <span>${result.scores.costEfficiency}/100</span>
                            </div>
                            <div class="score-progress">
                                <div class="score-fill" style="width: ${result.scores.costEfficiency}%"></div>
                            </div>
                        </div>
                        <div class="score-bar">
                            <div class="score-label">
                                <span>Output Quality</span>
                                <span>${result.scores.outputLength}/100</span>
                            </div>
                            <div class="score-progress">
                                <div class="score-fill" style="width: ${result.scores.outputLength}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="result-response">
                        ${result.response}
                    </div>
                ` : `
                    <div class="result-error">
                        ❌ Failed: ${result.error}
                    </div>
                `}
            </div>
        `).join('');
    }

    exportMarkdown() {
        if (!this.comparisonResults) return;
        const markdown = this.modelComparison.generateReport(this.comparisonResults);
        this.downloadText(markdown, 'model-comparison-report.md', 'text/markdown');
    }

    exportCSV() {
        if (!this.comparisonResults) return;
        this.modelComparison.downloadCSV(this.comparisonResults);
    }

    downloadText(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] [ModelComparisonPanel] [${level.toUpperCase()}]`;

        if (data) {
            console[level](`${prefix} ${message}`, data);
        } else {
            console[level](`${prefix} ${message}`);
        }
    }
}

// Export ModelComparisonPanel class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModelComparisonPanel;
}
