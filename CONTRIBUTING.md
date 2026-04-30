# Contributing to Generative Notebook / 贡献指南

[English](#english) | [中文](#中文)

---

<a id="english"></a>

Thank you for your interest in contributing! This guide will help you get started.

## How We Collaborate: Fork + PR Workflow

We use the standard **Fork + Pull Request** workflow — the same model used by React, VS Code, Linux, and most major open-source projects.

```
Your GitHub Account                    Main Repository
┌─────────────────────┐              ┌──────────────────────┐
│ your-name/           │   Fork ←──── │ lsrbuaa/             │
│ generative-notebook  │              │ generative-notebook   │
│                      │              │                       │
│ feat/my-feature ─────│── PR ──────▶ │ develop               │
│                      │              │   └── main (releases) │
└─────────────────────┘              └──────────────────────┘
```

### Why Fork + PR (not per-person branches)?

| Approach | Pros | Cons |
|----------|------|------|
| **Fork + PR** (we use this) | Each contributor has full freedom; main repo stays clean; scales to thousands of contributors | Slightly more setup |
| Per-person branches | Simple for small teams | Main repo gets cluttered; permission management is painful at scale |

## Step-by-Step Guide

### 1. Fork & Clone

```bash
# Fork via GitHub UI (click "Fork" button), then:
git clone https://github.com/YOUR-USERNAME/generative-notebook.git
cd generative-notebook
git remote add upstream https://github.com/lsrbuaa/generative-notebook.git
```

### 2. Stay in Sync

```bash
# Before starting new work, sync with upstream
git checkout develop
git fetch upstream
git merge upstream/develop
```

### 3. Create a Branch

Branch from `develop`, not `main`.

```bash
# Feature
git checkout -b feat/your-feature-name

# Bug fix
git checkout -b fix/brief-description

# Technical spike
git checkout -b spike/experiment-name
```

### 4. Develop

- Follow the [Code Style](#code-style) guidelines
- Write tests for new logic
- Keep commits focused — one logical change per commit

### 5. Commit

Write clear commit messages:

```
feat: add kanban view component

- Implement drag-and-drop column reordering
- Add card creation via inline input
- Register in Generative UI component registry
```

Prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `spike:`

### 6. Push & Create PR

```bash
git push origin feat/your-feature-name
```

Then open a PR on GitHub targeting the `develop` branch. In the PR description:

- Reference the related Issue (e.g., "Closes #5")
- Describe what changed and why
- Include screenshots for UI changes
- List how to test the changes

### 7. Code Review

- At least one maintainer reviews before merge
- Address feedback with new commits (don't force-push during review)
- CI checks must pass

## Branch Strategy

```
main              ← Stable releases only (tagged v0.1.0, v0.2.0...)
  └── develop     ← Integration branch (default)
       ├── feat/* ← New features
       ├── fix/*  ← Bug fixes
       └── spike/* ← Technical experiments (may not merge)
```

- **main**: Protected. Only accepts PRs from `develop` at release time.
- **develop**: Default branch. All feature PRs target this branch.
- **feat/fix/spike**: Short-lived branches. Delete after merge.

## Code Style

- **TypeScript** strict mode. No `any`.
- **React** functional components only.
- **Tailwind CSS** for styling. No CSS modules or styled-components.
- **File naming**: `kebab-case.ts` for files, `PascalCase` for components.
- Components under 150 lines. Extract if longer.
- We follow the [Karpathy Guidelines](./CLAUDE.md) — simplicity over cleverness.

## What to Contribute

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/lsrbuaa/generative-notebook/labels/good%20first%20issue).

### Feature Ideas

Have an idea? Open a [Discussion](https://github.com/lsrbuaa/generative-notebook/discussions) first to gauge interest before writing code.

### Areas We Need Help

- **Editor**: Custom TipTap block types (callout, toggle, embed)
- **Views**: New Generative UI views (mind map, Gantt chart, whiteboard)
- **i18n**: Translations for additional languages
- **Testing**: Expanding test coverage
- **Docs**: Tutorials, guides, API documentation

## Development Setup

```bash
# Prerequisites
node --version  # >= 20.0.0
rustc --version # Rust installed via rustup

# Install
npm install

# Dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).

---

<a id="中文"></a>

# 贡献指南

感谢你有兴趣参与贡献！本指南将帮助你快速上手。

## 协作方式：Fork + PR 工作流

我们使用标准的 **Fork + Pull Request** 工作流 — 与 React、VS Code、Linux 等主流开源项目相同。

```
你的 GitHub 账号                       主仓库
┌─────────────────────┐              ┌──────────────────────┐
│ your-name/           │   Fork ←──── │ lsrbuaa/             │
│ generative-notebook  │              │ generative-notebook   │
│                      │              │                       │
│ feat/my-feature ─────│── PR ──────▶ │ develop               │
│                      │              │   └── main (发布版本)  │
└─────────────────────┘              └──────────────────────┘
```

### 为什么用 Fork + PR（而不是每人一个分支）？

| 方式 | 优点 | 缺点 |
|------|------|------|
| **Fork + PR**（我们使用） | 每个贡献者完全自由；主仓库保持干净；可扩展到上千贡献者 | 初始设置稍多 |
| 每人一个分支 | 小团队简单 | 主仓库分支泛滥；权限管理困难 |

## 操作步骤

### 1. Fork 并克隆

```bash
# 在 GitHub 页面点击 "Fork" 按钮，然后：
git clone https://github.com/你的用户名/generative-notebook.git
cd generative-notebook
git remote add upstream https://github.com/lsrbuaa/generative-notebook.git
```

### 2. 保持同步

```bash
# 开始新工作前，先同步上游
git checkout develop
git fetch upstream
git merge upstream/develop
```

### 3. 创建分支

从 `develop` 创建分支，不是 `main`。

```bash
# 新功能
git checkout -b feat/你的功能名

# Bug 修复
git checkout -b fix/简要描述

# 技术验证
git checkout -b spike/实验名称
```

### 4. 开发

- 遵循[代码规范](#代码规范)
- 为新逻辑编写测试
- 保持提交聚焦 — 每个提交一个逻辑变更

### 5. 提交

使用清晰的提交信息：

```
feat: 添加看板视图组件

- 实现拖拽列重排序
- 添加行内输入创建卡片
- 在 Generative UI 组件注册表中注册
```

前缀：`feat:`、`fix:`、`refactor:`、`docs:`、`test:`、`chore:`、`spike:`

### 6. 推送并创建 PR

```bash
git push origin feat/你的功能名
```

在 GitHub 上创建 PR，目标分支选 `develop`。PR 描述中请：

- 关联相关 Issue（如 "Closes #5"）
- 描述改了什么、为什么改
- UI 变更附截图
- 说明如何测试

### 7. 代码审查

- 至少一位维护者审查后方可合入
- 用新提交回应反馈（审查期间不要 force-push）
- CI 检查必须通过

## 分支策略

```
main              ← 仅稳定发布版本（打标签 v0.1.0, v0.2.0...）
  └── develop     ← 集成分支（默认分支）
       ├── feat/* ← 新功能
       ├── fix/*  ← Bug 修复
       └── spike/* ← 技术实验（可能不合入）
```

## 代码规范

- **TypeScript** 严格模式，禁止 `any`
- **React** 仅函数式组件
- **Tailwind CSS** 唯一样式方案
- **文件命名**：`kebab-case.ts`，组件用 `PascalCase`
- 组件不超过 150 行，超过就拆分
- 遵循 [Karpathy 准则](./CLAUDE.md) — 简洁胜过花哨

## 可以贡献什么？

### 适合新手的 Issue

查找标签为 [`good first issue`](https://github.com/lsrbuaa/generative-notebook/labels/good%20first%20issue) 的 Issue。

### 功能想法

有新想法？请先在 [Discussions](https://github.com/lsrbuaa/generative-notebook/discussions) 中讨论，确认后再写代码。

### 我们需要帮助的领域

- **编辑器**：自定义 TipTap 块类型（callout、toggle、embed）
- **视图**：新的 Generative UI 视图（思维导图、甘特图、白板）
- **国际化**：更多语言的翻译
- **测试**：扩大测试覆盖率
- **文档**：教程、指南、API 文档

## 开源协议

参与贡献即表示你同意你的贡献将按 [MIT 协议](./LICENSE) 授权。
