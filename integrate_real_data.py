#!/usr/bin/env python3
"""
将acnelist.xlsx的真实数据完全融合到index.html中
"""
import re

# 读取HTML文件
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

print("开始集成真实数据...")

# 1. 添加真实数据源（在<script>标签后）
real_data_js = '''
        // ========== 真实的痤疮治疗项目数据（来自acnelist.xlsx） ==========
        const acneRealData = {
            singleItems: [
                { id: 'basic_treatment', name: '激光针清/湿敷舒敏/红蓝光', category: '基础治疗', price_single: 99, price_triple: 199, sessions: 3 },
                { id: 'salicylic_acid', name: '博乐达水杨酸面部', category: '刷酸治疗', price_single: 680, price_triple: 1680, sessions: 3 },
                { id: 'needle_knife', name: '小针刀剥离', category: '痘坑修复', price_single: 980, price_triple: 2580, sessions: 3 },
                { id: 'laser_1565', name: '1565非剥脱点阵', category: '激光治疗', price_single: 980, price_triple: 2580, sessions: 3 },
                { id: 'laser_1550', name: '1550非剥脱点阵激光', category: '激光治疗', price_single: 1280, price_triple: 2980, sessions: 3 },
                { id: 'co2_laser', name: '二氧化碳点阵激光', category: '激光治疗', price_single: 1280, price_triple: 2980, sessions: 3 },
                { id: 'sandwich_treatment', name: '三明治祛痘嫩肤', category: '综合治疗', price_single: 1380, price_triple: 2980, sessions: 3 },
                { id: 'gold_microneedle', name: '黄金微针4.0', category: '射频微针', price_single: 1680, price_triple: 4580, sessions: 3 }
            ],
            packages: [
                { id: 'pkg_a', name: '痘清清A', level: '基础', price_single: 980, price_triple: 2580, sessions: 3, items: ['1565点阵/1550点阵', '博乐达水杨酸'] },
                { id: 'pkg_b', name: '痘清清B', level: '标准', price_single: 1280, price_triple: 2980, sessions: 3, items: ['芬生源208', '博乐达水杨酸', 'OPT光子/点阵激光'] },
                { id: 'pkg_c', name: '痘清清C', level: '高端', price_single: 2580, price_triple: 5980, sessions: 3, items: ['博乐达水杨酸', '激光治疗', '战痘套组', 'LED/湿敷/针清'] },
                { id: 'pkg_d', name: '毛孔痘坑卡1.0', level: '痘坑专项', price_single: 2580, price_triple: 5980, sessions: 3, items: ['CO2点阵激光', '博乐达水杨酸', '小针刀剥离', '针清/照光'] },
                { id: 'pkg_e', name: '毛孔痘坑卡3.0', level: '顶级', price_single: 3980, price_triple: 8800, sessions: 3, items: ['黄金微针', 'CO2点阵', '战痘套组', '博乐达水杨酸×2', '小针刀×2', '针清/照光×6'] }
            ]
        };

'''

# 找到 <script> 标签后的第一个位置插入数据
script_pattern = r'(<script>\s*)'
replacement = r'\1' + real_data_js
html = re.sub(script_pattern, replacement, html, count=1)

print("✓ 添加真实数据源")

# 2. 更新费用计算器的价格数据库
old_price_db = r'const treatmentPrices = \{[^}]+oral:[^}]+\},[^}]+laser:[^}]+\},[^}]+peeling:[^}]+\}\s*\};'

new_price_db = '''const treatmentPrices = {
            // 使用真实数据
            items: acneRealData.singleItems.reduce((acc, item) => {
                acc[item.id] = {
                    name: item.name,
                    min: item.price_single,
                    max: item.price_triple / 3, // 单次价格
                    category: item.category,
                    sessions: item.sessions
                };
                return acc;
            }, {}),
            packages: acneRealData.packages.reduce((acc, pkg) => {
                acc[pkg.id] = {
                    name: pkg.name,
                    price_single: pkg.price_single,
                    price_triple: pkg.price_triple,
                    level: pkg.level,
                    items: pkg.items
                };
                return acc;
            }, {})
        };'''

html = re.sub(old_price_db, new_price_db, html, flags=re.DOTALL)
print("✓ 更新费用计算器价格数据库")

# 3. 更新treatment comparison的套餐数据
# 这部分需要找到treatmentPlans并替换
old_plans_pattern = r'const treatmentPlans = \[[^\]]+\];'

new_plans = '''const treatmentPlans = acneRealData.packages.map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            price: `¥${pkg.price_single} - ¥${pkg.price_triple}`,
            duration: pkg.sessions + '次疗程',
            intensity: pkg.level,
            treatments: pkg.items,
            pros: ['真实医美项目', '价格透明', '专业定制'],
            cons: ['需要多次治疗', '见效需要时间'],
            suitable: '适合' + pkg.level + '需求'
        }));'''

if 'const treatmentPlans' in html:
    html = re.sub(old_plans_pattern, new_plans, html, flags=re.DOTALL)
    print("✓ 更新治疗方案对比数据")
else:
    print("⚠ 未找到treatmentPlans，跳过")

# 保存修改后的文件
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("\n集成完成！")
print("=" * 60)
print("已集成内容：")
print("  • 8个单品项目")
print("  • 5个套餐方案")
print("  • 更新了费用计算器")
print("  • 更新了方案对比系统")
print("=" * 60)