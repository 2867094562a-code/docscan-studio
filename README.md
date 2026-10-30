# DocScan Studio

DocScan Studio 是一个浏览器文档工作台，提供文档编辑、扫描、格式转换、账单和纸张模板。直接打开 `index.html` 即可启动，无需自建后端。页面仍依赖 CDN 加载部分库；首次使用、缓存失效或 CDN 不可用时需要联网。

## 功能与范围

- **扫描与印章**：图片四角调整、透视矫正、滤镜、多页扫描 PDF、红章及签名提取。单张扫描图片超过 25 MB 会跳过，超过 1200 万像素会缩小。
- **文档与表格**：Word 编辑器支持基本段落、标题、粗斜下划线、表格和 PNG/JPEG 图片导出 DOCX；复杂样式、列表编号及合并单元格不保证保留。表格支持 SUM、AVERAGE、COUNT、四则运算和单元格引用，不支持完整 Excel 公式体系，插删行列不会自动改写公式引用。
- **演示文稿**：PPT/PPTX 在本地解析、逐页预览并按页面尺寸导出 PDF；输出为图像 PDF，文字不可搜索或编辑。复杂图表、动画、媒体、字体和版式可能有差异。编辑器导出支持基础文字、图片和背景，部分媒体不保留时会提示。
- **转换与 PDF**：提供 Word、Excel、PDF、图片和 PPT 的转换入口，以及 PDF 合并。Word、Excel 和 AI 文本转 PDF 使用系统字体绘制图像，支持中文但文字不可搜索；复杂原始版式不保证保留。扫描版 PDF 需要 OCR 才能提取文字。PDF 合并复制页面，通常可保留尺寸和文字，但表单、签名等文档级功能不保证保留。
- **水印与 SVG**：PDF/图片可添加重复文字水印；可单独下载二维码、Code 128 条形码和透明水印图案 SVG。水印图案不包含源文件。二维码支持中文；Code 128 支持 1–128 个可打印 ASCII 字符。
- **纸张模板**：提供 13 种，包括拼音田字格、日字格、田字格、米字格、回宫格、九宫格、衡水体、英语四线三格、康奈尔笔记、错题本、满幅作文方格纸、五线谱和吉他六线谱。支持 A4、A3、A5 纵向页面。
- **其他工具**：账单草稿、人民币大写、身份证正反面 A4 拼版、文档差异比对、二维码/条形码和语音朗读。金额大写不支持负数。身份证导出需要先上传正反面。

[PPT 与水印说明](docs/presentation-watermark.md) 介绍文件上限、第三方许可及兼容范围。AI 功能需要用户配置兼容的服务：内容发送到所选服务商，API Key 以明文保存在浏览器 LocalStorage。合同 AI 审查每份最多发送前 4000 字符，AI PDF 转换最多处理前 10 页，结果会注明截断；请核对 AI 输出。

## 使用

```bash
git clone https://github.com/2867094562a-code/docscan-studio.git
cd docscan-studio
```

在现代浏览器中直接打开 `index.html`。保留 `presentation.js`、`spreadsheet-formulas.js`、`office-export.js` 和 `vendor/`，它们是页面运行所需文件。

## 回归检查

在项目目录使用 Node.js 运行：

```powershell
node tests/p0-regression.cjs
node tests/core-regression.cjs
node tests/pdf-regression.cjs
node tests/scan-export-regression.cjs
node tests/presentation-regression.cjs
node tests/templates-regression.cjs
node tests/watermark-regression.cjs
node tests/svg-regression.cjs
node tests/template-switch-regression.cjs
node tests/formula-regression.cjs
node tests/unicode-pdf-regression.cjs
```

这些检查包含模拟数据，不连接真实 AI 服务。项目使用 [MIT 许可证](LICENSE)；本地第三方运行时的许可文件在 `vendor/`。
