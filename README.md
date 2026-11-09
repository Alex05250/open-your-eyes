# 睁眼看世界 · Open Your Eyes

一个保持好奇、重视来源与上下文的独立中文知识门户。

**网站：** https://alex05250.github.io/open-your-eyes/

## 三个核心板块

- **深度阅读**：Aeon、Farnam Street 来源发现示例；不伪造文章标题和作者，不转载原文。
- **知识百科**：元认知、系统综述、元分析、置信区间四个基础示例词条，附原始参考入口。
- **世界动态**：两条完全虚构的事件解释示例，按背景、起因、发展、当前状态、影响/下一步组织；不是实时新闻。

## 设计与交互

深空海军蓝、艺术化蓝色地球、克制的动效和编辑式排版。独立栏目及详情页，全站本地搜索、主题筛选、空状态、手机菜单、键盘焦点、跳转主要内容、减少动态效果支持。无登录、无追踪、无远程字体，正文无需 JavaScript 即可阅读。

## 本地运行

需要 Node.js 18 或更新版本，无需安装依赖。

```sh
npm run build
npm test
npm start
```

打开 http://127.0.0.1:4173/open-your-eyes/ 。`src/content.mjs` 是内容库，`scripts/build.mjs` 生成静态页面。CSS、浏览器脚本与插画位于 `assets/`。维护规范见 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)。

## 发布

GitHub Pages 配置：**Deploy from a branch → main → / (root)**。生成的 HTML 和资源直接提交在根目录，`.nojekyll` 禁用 Jekyll 处理。每次修改后运行构建与测试，并将所有生成文件一并提交。

该项目独立于账号下的其他仓库，不需要修改 `Alex05250.github.io`。默认站点路径为 `/open-your-eyes/`，不使用自定义域名或 SPA 路由回退。404 页面和 sitemap 已提供。

## 内容与素材边界

本站为首版示例，不包含自动新闻采集或内容后台。虚构情景不能作为真实事件、政策信息或决策依据。地球插画采用 Natural Earth / world-atlas 陆地轮廓绘制，无国界，仅为艺术化示意，不用于地理测量。素材说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
