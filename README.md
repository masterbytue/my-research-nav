# 砺文工作室 · 研途科研工作台

由砺文工作室设计并维护的轻量科研导航站，把文献检索、开放获取、阅读管理、学术写作、数据分析与 AI 助手按真实研究流程组织在同一张桌面上。

## 功能

- 7 个科研场景、30+ 个经过整理的资源入口
- 输入即筛选，按回车使用选定的学术搜索引擎检索
- 收藏常用资源、记录最近访问，数据仅保存在当前浏览器
- 日间 / 夜间阅读主题
- `/` 快速聚焦搜索框，`Esc` 清除筛选
- 完整的桌面端与移动端布局
- 键盘导航、跳转链接和减少动画等无障碍支持

## 本地开发

需要 Node.js 20.19 或更高版本。

```sh
npm install
npm run dev
```

提交前运行：

```sh
npm run lint
npm run type-check
npm run test:run
npm run build
```

## 添加或维护资源

资源集中在 `src/data/navigation.ts`。每个入口包含唯一 ID、名称、描述、HTTPS 地址、标签和主题色。新增资源时请：

1. 优先使用服务的官方 HTTPS 地址。
2. 描述保持简短，并说明它在科研流程中的用途。
3. 避免收录来源不清楚或存在明显版权风险的下载入口。
4. 在提交前确认链接仍可访问。

## 项目结构

```text
src/
├─ components/       页面组件
├─ composables/      收藏、最近访问和主题状态
├─ data/             搜索引擎与科研资源
├─ styles/           全局设计系统与响应式样式
├─ types/            TypeScript 数据类型
└─ __tests__/        核心交互测试
```

## 部署

合并到 `main` 后，GitHub Actions 会自动执行检查并构建 GitHub Pages。首次使用时，请在仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**。

若使用 Cloudflare Pages，请将生产分支设为 `main`，构建命令设为 `npm run build`，输出目录设为 `dist`。项目根目录的 `.nvmrc` 会将构建环境固定在 Node.js 22.16.0，避免旧版 Pages 构建镜像使用不兼容的 Node.js 版本。

## 反馈

发现失效链接或希望推荐资源，可通过站点底部的反馈入口联系维护者。
