# Generative Notebook

[English](./README.md) | [中文](./README.zh-CN.md)

> 本地优先、AI 原生的生成式 UI 笔记软件 — 界面随你的思维方式自适应。

<p align="center">
  <img src="https://img.shields.io/badge/状态-Phase%200-blue" alt="status">
  <img src="https://img.shields.io/badge/协议-MIT-green" alt="license">
  <img src="https://img.shields.io/github/stars/lsrbuaa/generative-notebook?style=social" alt="stars">
</p>

## 这是什么？

Generative Notebook 是一款下一代笔记应用，**界面会根据你的内容动态变化**。

在写会议纪要？界面自动生成参会人面板和待办追踪器。在写代码笔记？界面浮出终端和文档侧边栏。AI 不仅帮你写作，更塑造整个编辑体验来适配你当前的场景。

## 为什么做这个？

所有笔记应用都强迫你适应固定界面。Obsidian 给你一个 Markdown 编辑器，Notion 给你一个 Block 编辑器。两者都需要大量手动配置才能适配不同工作流。

我们相信：**界面应该适应你，而不是你去适应界面。**

| 痛点 | Obsidian | Notion | Generative Notebook |
|------|----------|--------|-------------------|
| 本地 vs 云端 | 本地但同步贵 | 云端但离线差 | 本地优先 + CRDT 同步 |
| 灵活 vs 易用 | 学习曲线陡峭 | 配置复杂 | AI 自动生成合适的界面 |
| 个人 vs 团队 | 无协作功能 | 协作卡顿 | 渐进式 — 默认本地，一键协作 |
| 轻量 vs 功能 | 依赖插件 | Electron 太重 | 按需加载组件，Tauri（轻 10 倍） |

## 技术栈

| 层级 | 技术 | 选型理由 |
|------|------|---------|
| 桌面端 | **Tauri 2.0** | 比 Electron 小 10 倍，原生性能 |
| 编辑器 | **TipTap / ProseMirror** | 成熟的 Block 编辑器，原生支持协作 |
| 存储 | **SQLite** | 查询快、FTS5 全文搜索、单文件数据库 |
| 同步 | **Yjs (CRDT)** | 无冲突、离线优先、无需服务器仲裁 |
| AI | **Claude API + Ollama** | 云端 AI + 本地回退 |
| UI | **React + Tailwind + Radix** | 现代、无障碍、可组合 |
| 协议 | **AG-UI + MCP** | Agent-User 交互开放标准 |

## 路线图

| 版本 | 阶段 | 内容 |
|------|------|------|
| `v0.1.0` | 技术验证 | POC：TipTap 编辑器、SQLite+CRDT 同步、Generative UI 引擎、Tauri 骨架 |
| `v0.2.0` | MVP 核心编辑器 | Block 编辑器、本地存储、文件管理、搜索、导入导出 |
| `v0.3.0` | Generative UI 引擎 | 上下文分析器、LLM 路由、动态视图（看板/表格/图谱/日历） |
| `v0.4.0` | AI 原生能力 | 语义搜索、自动链接、智能写作、知识图谱 |
| `v0.5.0` | 多端与协作 | 多设备同步、Web 版、移动端、实时协作 |
| `v1.0.0` | 正式发布 | 生产就绪、插件 API、社区组件市场 |

## 快速开始

```bash
# 克隆仓库
git clone https://github.com/lsrbuaa/generative-notebook.git
cd generative-notebook

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 前置要求

- Node.js >= 20.0.0
- Rust（用于 Tauri）— [通过 rustup 安装](https://rustup.rs/)
- 推荐：VS Code 或 Cursor，配合项目扩展使用

## 项目结构

```
src/
  app/           # Tauri 应用壳、路由
  editor/        # TipTap 编辑器、块类型、扩展
  storage/       # SQLite 操作、CRDT 同步
  ai/            # Generative UI 引擎、LLM 路由、嵌入向量
  components/    # 共享 UI 组件（基于 Radix）
  views/         # 动态视图组件（看板、表格、图谱等）
  hooks/         # 自定义 React Hooks
  lib/           # 工具函数、常量、类型定义
```

## 参与贡献

欢迎所有人参与贡献！请在开始之前阅读我们的 [贡献指南](./CONTRIBUTING.md)。

**快速概览：**

1. Fork 本仓库到你的账号
2. 创建你的功能分支（`git checkout -b feat/amazing-feature`）
3. 提交你的更改
4. 推送到你的 fork 并发起 Pull Request

我们遵循 [Karpathy 准则](./CLAUDE.md) 进行 AI 辅助开发：

- **先思考再编码** — 明确假设，不清楚就问
- **简洁优先** — 用最少的代码解决问题
- **精准修改** — 只改需求要求的部分
- **目标驱动** — 定义可验证的成功标准

## 开源协议

[MIT](./LICENSE)
