# DocScan Studio 📄✨

> **智能纯前端图片转文档工具 / 自动边距识别 / 透视压平 / 扫描全能王同款滤镜 / 多模态 AI 智能视觉识别 (兼容 OpenAI 协议) / 移动端与桌面端自适应 / PDF导出**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-indigo.svg)]()
[![AI Multimodal](https://img.shields.io/badge/AI-OpenAI%20%7C%20Gemini%20%7C%20Qwen%20%7C%20GLM%20%7C%20Kimi%20%7C%20MiniMax-purple.svg)]()

**DocScan Studio** 是一款高颜值、极速、无后端依赖的现代化网页端文档扫描增强与 AI 智能解析工具。所有图像基础算法（边缘检测、透视变换插值、局部自适应光照归一化、二值化、积分图滤波）均在用户浏览器本地完成，保护用户隐私与敏感公文数据安全。同时内置 **多模态 AI 视觉引擎**，支持自由配置并直连 ChatGPT、Gemini、通义千问、智谱 GLM、Kimi、MiniMax 等主流大模型！

---

## 🌟 核心特性

### 1. 🤖 兼容 OpenAI 协议的多模态 AI 智能视觉识别
- **主流 AI 服务商一键预设**：
  - 🚀 **ChatGPT (OpenAI)**：`gpt-4o`、`gpt-4o-mini`
  - 💎 **Google Gemini**：`gemini-2.0-flash`、`gemini-1.5-flash`
  - 🌐 **通义千问 (Qwen / 阿里)**：`qwen-vl-max`、`qwen-2.5-vl-72b-instruct`
  - ⚡ **智谱清言 (GLM)**：`glm-4v-plus`、`glm-4v-flash`
  - 🌙 **Kimi / Moonshot**：`moonshot-v1-8k-vision-preview`
  - 🐬 **MiniMax (海螺)**：`MiniMax-Text-01`
  - 🛠️ **自定义 OpenAI 兼容接口**：支持任何第三方代理、OneAPI、NewAPI、Ollama、LocalAI、DeepSeek 等。
- **多元化文档 AI 处理任务**：
  - 📝 **精准文字提取 (OCR)**：保持原始排版分段，无损转录。
  - 📊 **表格提取并转 Markdown**：精准识别复杂表格、发票条目并生成 Markdown Table。
  - 💡 **核心要点与摘要提炼**：自动归纳合同/文档关键条款、结论、日期与金额。
  - 🌐 **中英与多语言翻译**：智能翻译文档内容并保持格式。
  - 🧾 **发票单据结构化 JSON**：一键提取发票代码、金额、税额、买卖双方明细。
  - 💬 **自定义 Prompt 追问**：支持用户针对文档提问与计算。

---

### 2. 🎨 图像矫正与专业文档滤镜
- 🔍 **智能四角识别 (Auto Edge Detection)**：基于 Sobel 梯度与多边形轮廓拟合，毫秒级自动检测倾斜纸张/发票/票据四角。
- 📐 **交互式微调 + 3.5倍悬浮放大镜 (Loupe)**：支持自由拖拽 4 个顶点与 4 条边中点，拖动时跟随光标实时弹出像素级准星放大镜。
- 🪄 **六大专业文档滤镜**：
  - **彩色增强 (Magic Color)**：扫描全能王同款效果，自适应去除暗角阴影、白底增白、保留鲜艳印章。
  - **黑白扫描 (B&W Document)**：局部自适应二值化（Bradley-Roth / Sauvola），文字深黑清晰如复印件。
  - **印章强化 (Red Seal Protect)**：专为公文/合同设计，保真并高亮红色公章与批注。
  - **高清灰度 (Grayscale)**：平滑细腻的黑白灰阶质感。
  - **省墨复印 (Ink Saver)**：高反差线条化，节省打印耗材。
  - **原图拉平 (Original)**：仅做几何矫正，保留原始质感。
- ⚡ **分屏卷帘对比 (Before & After Split Slider)**：支持左右拖动滑块无缝对比原图与增强文档。
- 🛡️ **文档防盗水印 (Watermark)**：自定义水印文字（整页平铺/居中）。
- ✍️ **在线电子签名 (Signature Pad)**：手写签名并一键盖印到文档右下角。
- 📱 **深度手机端与桌面端自适应**：手机底部导航栏、滑出式抽屉调色板、触摸防抖。
- 📄 **多页管理与导出**：支持多页列表管理、一键导出 **A4 格式多页 PDF**、高清 PNG/JPG、复制图像到剪贴板。

---

## 🚀 快速使用

无需安装任何后端环境，双击打开 `index.html` 即可使用！

```bash
# 克隆仓库
git clone https://github.com/2867094562a-code/docscan-studio.git

# 进入目录
cd docscan-studio

# 在浏览器中直接打开 index.html 即可使用！
```

---

## 🔒 隐私与安全

- 本工具所有图像几何与色彩计算均在 **本地浏览器** 内完成。
- AI 识别功能直接由用户填写的 API Key 与对应 AI 服务商端点通讯，**密钥仅保存在用户浏览器的 LocalStorage 中**，绝不经过任何中转服务器。

---

## 📄 开源许可

本项目采用 [MIT 许可证](LICENSE)。
