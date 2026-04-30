# CLAUDE.md — Notebook Project

## Project Overview

Notebook is a local-first, AI-native note-taking app with Generative UI. The interface adapts dynamically to user context via LLM-driven component selection.

**Tech Stack:** Tauri 2.0 + React + TipTap/ProseMirror + SQLite + Yjs (CRDT) + AG-UI Protocol + Claude API + Tailwind CSS + Radix UI

---

## Karpathy Guidelines (Core Development Principles)

> Derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls. See [docs/reference/karpathy-examples.md](docs/reference/karpathy-examples.md) for detailed examples.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.
- Remove imports/variables/functions that YOUR changes made unused.
- Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
```

---

## Project-Specific Guidelines

### Architecture Principles

- **Local-First:** All data stored locally in SQLite. Network is optional, never required for core functionality.
- **CRDT for Sync:** Use Yjs for conflict-free multi-device sync. Never rely on server-side conflict resolution.
- **Block-Based Editor:** All content is block-based (TipTap/ProseMirror). Not raw Markdown files.
- **Generative UI:** UI components are selected/composed by LLM based on content context. Core app stays lightweight; views are loaded on demand.

### Code Style

- TypeScript strict mode. No `any` types unless interfacing with untyped third-party code.
- React functional components only. No class components.
- Zustand for client state. Yjs for collaborative state. Keep them separate.
- Tailwind CSS for styling. No CSS modules or styled-components.
- File naming: `kebab-case.ts` for files, `PascalCase` for components, `camelCase` for functions/variables.

### Performance Budgets

- Desktop app bundle: < 50MB (Tauri advantage over Electron).
- First paint: < 500ms.
- Editor input latency: < 16ms (60fps).
- Search response: < 100ms for local queries.

### Testing

- Unit tests for pure logic (utils, CRDT operations, AI routing).
- Integration tests for editor operations and storage layer.
- E2E tests for critical user flows (create note, edit, sync, search).
- Test framework: Vitest + Playwright.

### Security

- Never send user note content to external services without explicit consent.
- AI features must have clear opt-in/opt-out.
- Local-first means data sovereignty — treat it as a core promise, not a feature.
- Sanitize all HTML in embedded content blocks.

### File Structure

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

---

## Development Skills

Project skills are in `.claude/skills/`. They activate automatically based on context or can be invoked manually via `/skill-name`.

### Planning Phase
| Skill | Invoke | When It Activates |
|-------|--------|------------------|
| `/architecture-review` | Manual or auto | Discussing architecture, designing modules, making tech choices |
| `/tech-spike` | Manual or auto | Running POCs, evaluating libraries, testing feasibility |

### Coding Phase
| Skill | Invoke | When It Activates |
|-------|--------|------------------|
| `/component-design` | Manual or auto | Creating new React/UI components |
| `/tiptap-extension` | Manual or auto | Building editor block types or extensions |
| `/crdt-sync` | Manual or auto | Implementing sync, collaboration, offline features |
| `/tauri-ipc` | Manual or auto | Building Rust backend or JS↔Rust communication |
| `/sqlite-schema` | Manual or auto | Designing/modifying database tables or queries |
| `/generative-ui` | Manual or auto | Developing AI UI engine, component routing |

### Quality Phase
| Skill | Invoke | When It Activates |
|-------|--------|------------------|
| `/code-review` | Manual or auto | Reviewing code before commit or PR |
| `/performance-audit` | Manual or auto | Optimizing performance, checking budget compliance |
| `/security-check` | Manual or auto | Handling user data, network requests, AI features |
| `/test-writer` | Manual or auto | Writing tests, planning test coverage |

### Path-Scoped Rules (Auto-Loaded)

These rules activate automatically when editing files in matching paths:

| Rule | Activates For |
|------|--------------|
| `react-components` | `src/components/**`, `src/views/**` |
| `editor-extensions` | `src/editor/**` |
| `storage-layer` | `src/storage/**`, `src-tauri/src/**` |
| `ai-layer` | `src/ai/**` |
| `test-files` | `**/*.test.*`, `**/*.spec.*`, `tests/**` |
