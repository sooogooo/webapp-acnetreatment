# 移动端测试检查清单

## 快速验证步骤

### 1. 本地测试（浏览器开发者工具）

#### Chrome DevTools
```bash
1. 打开 /root/claude/acne/index.html
2. 按F12打开开发者工具
3. 点击设备模拟按钮 (Ctrl+Shift+M)
4. 测试以下设备:
   □ iPhone SE (375×667)
   □ iPhone 12 Pro (390×844)
   □ iPad Mini (768×1024)
   □ Galaxy S20 (360×800)
```

### 2. 汉堡菜单功能测试

□ 在移动视图下，汉堡按钮(☰)显示
□ 点击汉堡按钮，侧滑菜单从右侧滑出
□ 菜单动画流畅（300ms）
□ 点击遮罩层，菜单关闭
□ 点击关闭按钮(×)，菜单关闭
□ 点击菜单链接，菜单自动关闭并跳转
□ 菜单打开时，背景不可滚动
□ 菜单关闭后，背景恢复滚动

### 3. 触摸目标尺寸验证

□ 所有按钮最小44×44px
□ 菜单链接可轻松点击
□ 表单输入框高度充足
□ CTA按钮醒目且易触达

### 4. 响应式布局检查

#### 768px以下
□ 桌面导航隐藏
□ 汉堡按钮显示
□ Logo缩小至1.2rem
□ Hero标题缩小至1.8rem
□ Badges变为2列布局
□ 治疗方案卡片单列显示
□ Footer单列居中

#### 375px以下
□ Hero标题进一步缩小至1.5rem
□ 照片预览变为1列
□ 评估容器padding减小

### 5. 表单和输入优化

□ 所有输入框字体≥16px（避免iOS缩放）
□ 输入框最小高度44px
□ 照片上传按钮触发相机（移动设备）
□ 点击上传区域正常响应

### 6. 评估系统移动端

□ 进度指示器适应小屏
□ 问题选项单列显示
□ 选项卡片易于点击（44px+）
□ 前进/后退按钮全宽
□ 按钮间距合适（0.75rem）

### 7. AI聊天移动端

□ 输入框固定底部
□ 输入框字体16px
□ 发送按钮最小44×44px
□ 聊天区域可滚动

### 8. 性能测试

```bash
# 使用Lighthouse测试
1. 打开Chrome DevTools
2. 切换到Lighthouse标签
3. 选择"Mobile"模式
4. 运行测试

目标分数:
□ Performance: >85
□ Accessibility: >90
□ Best Practices: >90
□ SEO: >90
```

### 9. 真机测试（推荐）

#### iOS设备
□ Safari浏览器测试
□ 相机调用正常
□ 滚动流畅无卡顿
□ 输入框无自动缩放
□ backdrop-filter模糊效果

#### Android设备
□ Chrome浏览器测试
□ 相机调用正常
□ 侧滑菜单流畅
□ 触摸反馈准确

### 10. 横屏模式

□ 768px以上恢复桌面布局
□ 菜单自动切换为桌面导航
□ 内容布局合理

## 常见问题排查

### 问题1: 汉堡按钮不显示
**检查**: 浏览器宽度是否<768px
**解决**: 调整窗口大小或使用设备模拟器

### 问题2: 菜单无法打开
**检查**: JavaScript是否加载
**解决**: 打开控制台查看错误信息

### 问题3: 相机无法调用
**检查**: 
- 是否使用HTTPS（或localhost）
- capture属性浏览器支持
- 设备权限设置

### 问题4: iOS输入框自动缩放
**检查**: 输入框字体是否<16px
**解决**: 已设置font-size: 16px

### 问题5: 菜单动画不流畅
**检查**: 
- 是否使用transform（硬件加速）
- backdrop-filter浏览器支持
**优化**: 已使用transform和300ms动画

## 自动化测试命令

```bash
# HTML语法验证
python3 -c "
from html.parser import HTMLParser
validator = HTMLParser()
with open('/root/claude/acne/index.html') as f:
    validator.feed(f.read())
print('HTML验证通过')
"

# 检查关键元素存在
grep -q "mobile-menu" /root/claude/acne/index.html && echo "✓ 移动菜单HTML存在"
grep -q "toggleMobileMenu" /root/claude/acne/index.html && echo "✓ JS函数存在"
grep -q 'capture="environment"' /root/claude/acne/index.html && echo "✓ 相机属性存在"
grep -q "@media (max-width: 768px)" /root/claude/acne/index.html && echo "✓ 移动端CSS存在"

# 统计移动端代码行数
echo "移动端CSS行数: $(sed -n '/Mobile Optimization/,/@media (max-width: 375px)/p' /root/claude/acne/index.html | wc -l)"
```

## 测试通过标准

### 基础功能
- [x] 所有4个优化任务完成
- [x] HTML无语法错误
- [x] JavaScript无运行时错误
- [x] CSS样式正确应用

### 用户体验
- [ ] 菜单操作流畅自然
- [ ] 所有交互元素可触达
- [ ] 布局无横向滚动
- [ ] 文字清晰可读

### 性能指标
- [ ] 首屏加载<3秒
- [ ] 菜单动画无卡顿
- [ ] 滚动流畅（60fps）
- [ ] 无内存泄漏

---

**测试版本**: v1.0.0-mobile
**最后更新**: 2025-10-23
**状态**: 待测试
