# Generative Notebook

[English](#english) | [中文](#中文)

---

<a id="english"></a>

> Local-first, AI-native note-taking app with Generative UI — the interface adapts to how you think.

<p align="center">
  <img src="https://img.shields.io/badge/status-Phase%200-blue" alt="status">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="license">
  <img src="https://img.shields.io/github/stars/lsrbuaa/generative-notebook?style=social" alt="stars">
</p>

## What is this?

Generative Notebook is a next-generation note-taking app where **the UI dynamically adapts to your content**.

Writing meeting notes? The interface generates an attendee panel and action item tracker. Working on code? It surfaces a terminal and documentation sidebar. The AI doesn't just help you write — it shapes the entire editing experience around your current context.

## Why?

Every note-taking app forces you into a fixed interface. Obsidian gives you a markdown editor. Notion gives you a block editor. Both require extensive manual configuration to fit different workflows.

We believe **the interface should adapt to you, not the other way around**.

| Problem | Obsidian | Notion | Generative Notebook |
|---------|----------|--------|-------------------|
| Local vs Cloud | Local but sync is expensive | Cloud but offline is broken | Local-first with CRDT sync |
| Flexible vs Easy | Steep learning curve | Complex setup | AI generates the right UI automatically |
| Personal vs Team | No collaboration | Laggy collaboration | Progressive — local by default, one-click collab |
| Light vs Heavy | Plugin-dependent | Slow (Electron) | On-demand components, Tauri (10x lighter) |

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Desktop | **Tauri 2.0** | 10x smaller than Electron, native performance |
| Editor | **TipTap / ProseMirror** | Mature block editor with collaboration support |
| Storage | **SQLite** | Fast queries, FTS5 full-text search, single-file DB |
| Sync | **Yjs (CRDT)** | Conflict-free, offline-first, no server authority |
| AI | **Claude API + Ollama** | Cloud AI with local fallback |
| UI | **React + Tailwind + Radix** | Modern, accessible, composable |
| Protocol | **AG-UI + MCP** | Open standards for agent-user interaction |

## Roadmap

| Version | Phase | What's Included |
|---------|-------|----------------|
| `v0.1.0` | Technical Validation | POC: TipTap editor, SQLite+CRDT sync, Generative UI engine, Tauri shell |
| `v0.2.0` | MVP Core Editor | Block editor, local storage, file manager, search, import/export |
| `v0.3.0` | Generative UI Engine | Context analyzer, LLM router, dynamic views (kanban, table, graph, calendar) |
| `v0.4.0` | AI Native Features | Semantic search, auto-linking, smart writing, knowledge graph |
| `v0.5.0` | Multi-platform & Collab | Multi-device sync, web, mobile, real-time collaboration |
| `v1.0.0` | Public Release | Production-ready, plugin API, community marketplace |

## Quick Start

```bash
# Clone
git clone https://github.com/lsrbuaa/generative-notebook.git
cd generative-notebook

# Install dependencies
npm install

# Start development server
npm run dev
```

### Prerequisites

- Node.js >= 20.0.0
- Rust (for Tauri) — [install via rustup](https://rustup.rs/)
- Recommended: VS Code or Cursor with project extensions

## Project Structure

```
src/
  app/           # Tauri app shell, routing
  editor/        # TipTap editor, block types, extensions
  storage/       # SQLite operations, CRDT sync
  ai/            # Generative UI engine, LLM routing, embeddings
  components/    # Shared UI components (Radix-based)
  views/         # Dynamic view components (kanban, table, graph, etc.)
  hooks/         # Custom React hooks
  lib/           # Utilities, constants, types
```

## Contributing

We welcome contributions from everyone! Please read our [Contributing Guide](./CONTRIBUTING.md) before getting started.

**Quick overview:**

1. Fork this repository
2. Create your feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes
4. Push to your fork and open a Pull Request

We follow the [Karpathy Guidelines](./CLAUDE.md) for AI-assisted development:

- **Think Before Coding** — Surface assumptions, ask when unclear
- **Simplicity First** — Minimum code that solves the problem
- **Surgical Changes** — Only touch what the request requires
- **Goal-Driven Execution** — Define verifiable success criteria

## License

[MIT](./LICENSE)

---

<a id="中文"></a>

# Generative Notebook

> 本地优先、AI 原生的生成式 UI 笔记软件 — 界面随你的思维方式自适应。

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
