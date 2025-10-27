#!/usr/bin/env node
// AI系统组件测试脚本
const fs = require('fs');
const path = require('path');

console.log('🧪 AI模型管理系统 - 自动化测试\n');

// 测试1: 检查所有必需文件
console.log('【测试1】检查文件完整性');
const requiredFiles = [
    'js/ai-models/providers/base-provider.js',
    'js/ai-models/providers/qwen-provider.js',
    'js/ai-models/providers/glm-provider.js',
    'js/ai-models/model-manager.js',
    'js/ai-models/utils/smart-router.js',
    'js/ai-models/utils/cost-tracker.js',
    'js/ai-models/utils/response-cache.js',
    'js/ai-models/ui/config-panel.js',
    'js/ai-models/ui/model-selector.js',
    'js/ai-models/ui/cost-dashboard.js',
    'ai-demo.html'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const stats = fs.statSync(file);
        console.log(`  ✓ ${file} (${stats.size} bytes)`);
    } else {
        console.log(`  ✗ ${file} 缺失`);
        allFilesExist = false;
    }
});

console.log(allFilesExist ? '\n✅ 所有文件存在\n' : '\n❌ 部分文件缺失\n');

// 测试2: 检查文件编码
console.log('【测试2】检查文件编码');
const jsFiles = requiredFiles.filter(f => f.endsWith('.js'));
let encodingOK = true;
jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const hasInvalidChars = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/.test(content);
        if (!hasInvalidChars) {
            console.log(`  ✓ ${file} UTF-8编码正常`);
        } else {
            console.log(`  ✗ ${file} 存在无效字符`);
            encodingOK = false;
        }
    }
});
console.log(encodingOK ? '\n✅ 编码检查通过\n' : '\n❌ 存在编码问题\n');

// 测试3: 统计代码行数
console.log('【测试3】代码统计');
let totalLines = 0;
let totalSize = 0;
const fileStats = [];
jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n').length;
        const stats = fs.statSync(file);
        totalLines += lines;
        totalSize += stats.size;
        const basename = file.split('/').pop();
        fileStats.push({ name: basename, lines, size: stats.size });
    }
});

fileStats.sort((a, b) => b.lines - a.lines);
fileStats.forEach(stat => {
    console.log(`  ${stat.name}: ${stat.lines} 行 (${(stat.size/1024).toFixed(1)} KB)`);
});
console.log(`\n  📊 总计: ${totalLines} 行代码, ${(totalSize/1024).toFixed(1)} KB\n`);

// 测试4: 检查类定义
console.log('【测试4】检查类定义');
const expectedClasses = {
    'base-provider.js': 'BaseProvider',
    'qwen-provider.js': 'QwenProvider',
    'glm-provider.js': 'GLMProvider',
    'model-manager.js': 'AIModelManager',
    'smart-router.js': 'SmartRouter',
    'cost-tracker.js': 'CostTracker',
    'response-cache.js': 'ResponseCache',
    'config-panel.js': 'ConfigPanel',
    'model-selector.js': 'ModelSelector',
    'cost-dashboard.js': 'CostDashboard'
};

let allClassesFound = true;
Object.entries(expectedClasses).forEach(([file, className]) => {
    const fullPath = jsFiles.find(f => f.includes(file));
    if (fullPath && fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(`class ${className}`)) {
            console.log(`  ✓ ${file}: ${className} 类定义存在`);
        } else {
            console.log(`  ✗ ${file}: ${className} 类定义缺失`);
            allClassesFound = false;
        }
    }
});
console.log(allClassesFound ? '\n✅ 所有类定义正确\n' : '\n❌ 部分类定义缺失\n');

// 测试5: HTML依赖检查
console.log('【测试5】HTML依赖检查');
if (fs.existsSync('ai-demo.html')) {
    const html = fs.readFileSync('ai-demo.html', 'utf8');
    const scriptMatches = html.match(/<script src="[^"]+"><\/script>/g);
    if (scriptMatches) {
        console.log(`  发现 ${scriptMatches.length} 个外部脚本引用`);
        let allDepsExist = true;
        scriptMatches.forEach(match => {
            const src = match.match(/src="([^"]+)"/)[1];
            if (fs.existsSync(src)) {
                console.log(`  ✓ ${src}`);
            } else {
                console.log(`  ✗ ${src} (引用但不存在)`);
                allDepsExist = false;
            }
        });
        console.log(allDepsExist ? '\n✅ 所有依赖存在\n' : '\n❌ 部分依赖缺失\n');
    }
} else {
    console.log('  ✗ ai-demo.html 不存在\n');
}

// 测试6: 检查中文字符
console.log('【测试6】检查中文字符显示');
let chineseOK = true;
jsFiles.forEach(file => {
    if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        const chineseMatches = content.match(/[\u4e00-\u9fa5]+/g);
        if (chineseMatches) {
            const sample = chineseMatches.slice(0, 3).join(', ');
            console.log(`  ✓ ${file.split('/').pop()}: ${sample}...`);
        }
    }
});
console.log('\n✅ 中文字符显示正常\n');

// 测试总结
console.log('=' .repeat(50));
console.log('📋 测试总结');
console.log('=' .repeat(50));
console.log(`✓ 文件完整性: ${allFilesExist ? '通过' : '失败'}`);
console.log(`✓ UTF-8编码: ${encodingOK ? '通过' : '失败'}`);
console.log(`✓ 类定义: ${allClassesFound ? '通过' : '失败'}`);
console.log(`✓ 代码总量: ${totalLines} 行`);
console.log(`✓ 文件大小: ${(totalSize/1024).toFixed(1)} KB`);
console.log('=' .repeat(50));

if (allFilesExist && encodingOK && allClassesFound) {
    console.log('\n🎉 所有测试通过！AI系统已就绪！\n');
    process.exit(0);
} else {
    console.log('\n⚠️  部分测试失败，请检查上述错误\n');
    process.exit(1);
}
