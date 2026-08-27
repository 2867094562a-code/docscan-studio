# DocScan Studio 📄✨

> **智能纯前端图片转文档工具 / 自动边距识别 / 透视压平 / 扫描全能王同款滤镜 / 移动端与桌面端自适应 / PDF导出**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20Mobile%20%7C%20Desktop-indigo.svg)]()
[![Pure Frontend](https://img.shields.io/badge/100%25-Client--side%20%26%20Offline-success.svg)]()

**DocScan Studio** 是一款高颜值、极速、无后端依赖的现代化网页端文档扫描增强工具。所有图像算法（边缘检测、透视变换插值、局部自适应光照归一化、二值化、积分图滤波）均在用户浏览器本地完成，保护用户隐私与敏感公文数据安全。

---

## 🌟 核心特性

- 🤖 **智能四角识别 (Auto Edge Detection)**：基于 Sobel 梯度与多边形轮廓拟合，毫秒级自动检测倾斜纸张/发票/票据四角。
- 🔍 **交互式微调 + 3.5倍悬浮放大镜 (Loupe)**：支持自由拖拽 4 个顶点与 4 条边中点，拖动时跟随光标实时弹出像素级准星放大镜，精准对齐。
- 📐 **高精度透视变换 (Perspective Warp)**：基于 3x3 投影映射矩阵与双线性插值算法，将拍摄畸变照片自动拉直展开为平整标准文档。
- 🎨 **专业级文档处理模式**：
  - **彩色增强 (Magic Color)**：扫描全能王同款效果，自适应去除暗角阴影、白底增白、保留鲜艳印章与彩笔字迹。
  - **黑白扫描 (B&W Document)**：局部自适应二值化（Bradley-Roth / Sauvola），消除纸张折痕，文字深黑清晰如打印机扫描件。
  - **印章强化 (Red Seal Protect)**：专为公文/合同设计，保真并高亮红色印章与批注，同时使纸张纯白。
  - **高清灰度 (Grayscale)**：平滑细腻的黑白灰阶档案质感。
  - **省墨复印 (Ink Saver)**：高反差线条化，节省打印耗材。
  - **原图拉平 (Original)**：仅做几何矫正，保留原始质感。
- ⚡ **分屏卷帘对比 (Before & After Split Slider)**：支持左右拖动滑块，无缝对比拍摄原图与增强后的高清文档。
- 🛡️ **文档防盗水印 (Watermark)**：支持自定义水印文字（如：“*仅供办理业务使用 他用无效*”），支持整页平铺与多色选择。
- ✍️ **在线电子签名 (Signature Pad)**：内置手写板，支持触屏/鼠标手写签名并一键盖印到文档右下角。
- 📱 **深度手机端与桌面端自适应 (Responsive Design)**：支持手机端底部导航栏、滑出式抽屉调色板、触摸防抖与全屏手势。
- 📄 **多页管理与导出**：支持多页列表管理、一键导出 **A4 格式多页 PDF**、高清无损 PNG/JPG、复制图像到剪贴板、直接打印与 OCR 提取文字。

---

## 🚀 快速使用

无需安装任何依赖或后端环境，双击打开 `index.html` 即可使用！

```bash
# 克隆仓库
git clone https://github.com/<your-username>/docscan-studio.git

# 进入目录
cd docscan-studio

# 在浏览器中直接打开 index.html 即可使用！
```

---

## 🔒 隐私声明

DocScan Studio 是一款 **100% 纯前端运行** 的工具，所有图像计算、切边、增强滤波和 PDF 生成均在您的设备本地浏览器运行，**不会向任何第三方或云端服务器上传您的照片与文档**。

---

## 📄 开源许可

本项目采用 [MIT 许可证](LICENSE)。
