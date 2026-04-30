---
paths:
  - "src/storage/**/*.ts"
  - "src-tauri/src/**/*.rs"
---

# Storage Layer Rules (SQLite + CRDT)

- All SQLite queries must use parameterized statements. Never interpolate user input.
- Enable WAL mode: `PRAGMA journal_mode=WAL`.
- Batch writes in transactions for performance.
- Use UUID v7 for IDs (time-sortable, globally unique, no coordination needed).
- Soft delete: set `deleted_at` timestamp, never `DELETE` rows directly.
- CRDT: one `Y.Doc` per note, never one massive doc for entire workspace.
- CRDT persistence: store as binary blob via `Y.encodeStateAsUpdate()`.
- Sync: use incremental updates, not full state snapshots.
- Check `origin` in Yjs update handlers to avoid echo loops.
- FTS5: keep full-text index in sync via triggers or explicit rebuild on content change.
- Migrations: use version-based schema migrations with `PRAGMA user_version`.
