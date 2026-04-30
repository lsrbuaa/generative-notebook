# Contributing to Generative Notebook

[English](./CONTRIBUTING.md) | [中文](./CONTRIBUTING.zh-CN.md)

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
git checkout develop
git fetch upstream
git merge upstream/develop
```

### 3. Create a Branch

Branch from `develop`, not `main`.

```bash
git checkout -b feat/your-feature-name   # Feature
git checkout -b fix/brief-description    # Bug fix
git checkout -b spike/experiment-name    # Technical spike
```

### 4. Develop

- Follow the [Code Style](#code-style) guidelines
- Write tests for new logic
- Keep commits focused — one logical change per commit

### 5. Commit

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

Then open a PR on GitHub targeting the `develop` branch. In your PR description:

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

### Areas We Need Help

- **Editor**: Custom TipTap block types (callout, toggle, embed)
- **Views**: New Generative UI views (mind map, Gantt chart, whiteboard)
- **i18n**: Translations for additional languages
- **Testing**: Expanding test coverage
- **Docs**: Tutorials, guides, API documentation

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
