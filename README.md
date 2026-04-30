# Generative Notebook

[English](./README.md) | [中文](./README.zh-CN.md)

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
