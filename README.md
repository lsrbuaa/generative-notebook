# Generative Notebook

> Local-first, AI-native note-taking app with Generative UI — the interface adapts to how you think.

## What is this?

Generative Notebook is a next-generation note-taking app where **the UI dynamically adapts to your content**. Writing meeting notes? The interface generates an attendee panel and action item tracker. Working on code? It surfaces a terminal and documentation sidebar. The AI doesn't just help you write — it shapes the entire editing experience around your current context.

## Why?

Every note-taking app forces you into a fixed interface. Obsidian gives you a markdown editor. Notion gives you a block editor. Both require extensive manual configuration to fit different workflows.

We believe **the interface should adapt to you, not the other way around**.

| Problem | Obsidian | Notion | Generative Notebook |
|---------|----------|--------|-------------------|
| Local vs Cloud | Local but sync is expensive | Cloud but offline is broken | Local-first with CRDT sync |
| Flexible vs Easy | Powerful but steep learning curve | Feature-rich but complex setup | AI generates the right UI automatically |
| Personal vs Team | No collaboration | Collaboration but laggy | Progressive — local by default, one-click collab |
| Light vs Heavy | Lightweight but plugin-dependent | Full-featured but slow (Electron) | On-demand components, Tauri (10x lighter) |

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
| `v0.5.0` | Multi-platform & Collab | CRDT multi-device sync, web version, mobile app, real-time collaboration |
| `v1.0.0` | Public Release | Production-ready, plugin API, community marketplace |

## Development

```bash
# Clone
git clone https://github.com/lsrbuaa/generative-notebook.git
cd generative-notebook

# Development setup (coming in v0.1.0)
npm install
npm run dev
```

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

We follow the [Karpathy Guidelines](./CLAUDE.md) for AI-assisted development:

1. **Think Before Coding** — Surface assumptions, ask when unclear
2. **Simplicity First** — Minimum code that solves the problem
3. **Surgical Changes** — Only touch what the request requires
4. **Goal-Driven Execution** — Define verifiable success criteria

## License

[MIT](./LICENSE)
