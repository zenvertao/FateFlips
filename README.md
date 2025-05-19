# 戏决 - 人生如戏，一决到底

<div align="center">
  <img src="logo.png" alt="FateFlips Logo">
  <p>中文 | <a href="README.en.md">English</a></p>
</div>

## 🌐 在线体验

**立即体验：** [https://zenvertao.github.io/FateFlips/](https://zenvertao.github.io/FateFlips/)

## 📖 项目概述

戏决（FateFlips）是一款轻松有趣的互动式两难选择游戏，提供了大量贴近日常生活的两难选择题。玩家通过做出选择，会看到有趣且出人意料的结果，带来会心一笑的体验。游戏支持中英文双语，并配有生动的表情动画反馈。

本作AI含量高达90%以上！从代码编写到创意生成整个过程均通过AI对话辅助完成。游戏灵感源自一则展示Windows卸载对话框的有趣推文，其中包含了跟随鼠标移动的表情动画。最初只是出于好奇尝试用AI复现这个简单动画效果，却在不知不觉中演变成了现在这款充满趣味性的AI互动小游戏。

个人时间精力有限，目前代码仍有很大优化空间。
现阶段主要作为个人技术探索项目，专注于尝试最新ES标准特性，因此仅兼容现代浏览器。

如果你有更好创意想法或发现Bug，欢迎提交PR共同完善！

## ✨ 主要特点

- **双语支持**：完整支持中英文切换，所有内容均有对应翻译
- **AI生成内容**：支持通过多种AI模型（ChatGPT、Claude、DeepSeek等）生成新的提示内容
- **表情动画**：生动的表情反馈，增强游戏互动性和趣味性
- **本地存储**：自动保存设置和生成的提示内容，无需重复配置
- **响应式设计**：适配各种设备尺寸，包括移动端触控支持
- **轻量级**：无需复杂依赖，加载迅速，即开即玩

## 📁 项目结构

```
├── index.html          # 主页面
├── styles/             # 样式文件
│   ├── main.css        # 主样式
│   ├── animations.css  # 动画样式
│   ├── components.css  # 组件样式
│   ├── responsive.css  # 响应式样式
│   └── settings.css    # 设置页面样式
├── src/                # 源代码
│   ├── index.js        # 入口文件
│   ├── modules/        # 功能模块
│   │   ├── ai-models.js       # AI模型配置
│   │   ├── ai-prompts.js      # AI提示请求模块
│   │   ├── app.js             # 应用核心逻辑
│   │   ├── base.js            # 基础类
│   │   ├── default.js         # 默认提示数据
│   │   ├── emoji-animation.js # 表情动画
│   │   ├── facial-animation.js# 面部表情动画
│   │   ├── i18n.js            # 国际化模块
│   │   ├── mobile-adapter.js  # 移动端适配
│   │   ├── prompts.js         # 提示管理
│   │   ├── reaction-manager.js# 反应管理
│   │   └── settings.js        # 设置管理
│   ├── locales/        # 语言文件
│   │   ├── en.json     # 英文翻译
│   │   └── zh.json     # 中文翻译
│   ├── utils/          # 工具函数
│   │   └── utils.js    # 通用工具
│   └── vendor/         # 第三方库
│       └── i18next.min.js # 国际化库
└── mock/               # 模拟数据
    ├── data.json       # 模拟数据
    └── mock_ai_api.py  # 模拟AI API服务
```

## 🚀 使用指南

### 基本使用

1. 打开游戏页面
2. 阅读显示的两难问题
3. 点击"是"或"否"按钮做出选择
4. 观看有趣的反应结果和表情动画
5. 自动加载下一个问题

### AI内容设置

1. 点击右上角的"AI"按钮打开设置
2. 选择想要使用的AI模型
3. 输入相应的API密钥和API端点
4. 点击"保存"按钮
5. 点击"获取新提示"按钮生成新内容

## 🔧 开发者指南

### 本地运行

```bash
# 克隆仓库
git clone https://github.com/yourusername/FateFlips.git
cd FateFlips

# 使用任意HTTP服务器运行
python -m http.server
# 或
npx serve
```

### 模拟API服务
为方便本地开发和测试，项目提供了一个Python模拟API服务器：
```bash
# 安装依赖
cd mock
pip install flask flask-cors

# 启动模拟服务器
python mock_ai_api.py --port 8000
```
服务启动后，可在游戏设置中将API端点改为`http://localhost:8000`进行测试，无需真实API密钥。

### 添加新的AI模型

在`src/modules/ai-models.js`中添加新模型的配置：

```javascript
const AI_MODELS = {
  // 添加新模型
  'new-model': {
    headers: (apiKey) => ({
      'Authorization': `Bearer ${apiKey}`,
      // 其他必要的头信息
    }),
    requestFormat: {
      // 请求格式配置
    }
  }
};
```

## 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件

---

<div align="center">
  <p>Made with ❤️ by ZenverTao</p>
</div>