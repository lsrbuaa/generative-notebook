# 贡献指南

[English](./CONTRIBUTING.md) | [中文](./CONTRIBUTING.zh-CN.md)

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
git checkout develop
git fetch upstream
git merge upstream/develop
```

### 3. 创建分支

从 `develop` 创建分支，不是 `main`。

```bash
git checkout -b feat/你的功能名     # 新功能
git checkout -b fix/简要描述       # Bug 修复
git checkout -b spike/实验名称     # 技术验证
```

### 4. 开发

- 遵循[代码规范](#代码规范)
- 为新逻辑编写测试
- 保持提交聚焦 — 每个提交一个逻辑变更

### 5. 提交

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

### 我们需要帮助的领域

- **编辑器**：自定义 TipTap 块类型（callout、toggle、embed）
- **视图**：新的 Generative UI 视图（思维导图、甘特图、白板）
- **国际化**：更多语言的翻译
- **测试**：扩大测试覆盖率
- **文档**：教程、指南、API 文档

## 开源协议

参与贡献即表示你同意你的贡献将按 [MIT 协议](./LICENSE) 授权。
