---
name: performance-audit
description: Audit code against Notebook's performance budgets - bundle size, first paint, editor latency, search speed, and memory usage. Use when optimizing performance, checking budget compliance, profiling bottlenecks, or reviewing performance-sensitive code.
---

# Performance Audit

## Performance Budgets

| Metric | Budget | How to Measure |
|--------|--------|---------------|
| Desktop bundle | < 50 MB | `du -sh dist/` after build |
| First paint | < 500 ms | Lighthouse / `performance.mark` |
| Editor input latency | < 16 ms (60fps) | `PerformanceObserver` on keypress → render |
| Search (local) | < 100 ms | `console.time` on SQLite FTS5 query |
| Note open | < 200 ms | Time from click to editor ready |
| Memory (idle) | < 150 MB | Task Manager / `process.memoryUsage()` |
| CRDT sync (incremental) | < 50 ms | Time to apply Y.Doc update |

## Audit Checklist

### Bundle Size
- [ ] No unnecessary dependencies (check with `npx depcheck`)
- [ ] Large dependencies lazy-loaded (`React.lazy`, dynamic `import()`)
- [ ] Tree-shaking working (no barrel exports pulling entire modules)
- [ ] Images/assets optimized (WebP, SVG for icons)
- [ ] Tauri binary stripped of debug symbols in release

### Render Performance
- [ ] No synchronous operations in React render path
- [ ] Lists > 50 items virtualized (`@tanstack/virtual`)
- [ ] Heavy computations in `useMemo` with proper deps
- [ ] No layout thrashing (read then write, not interleaved)
- [ ] CSS animations use `transform`/`opacity` only (GPU composited)

### Editor Performance
- [ ] TipTap NodeView components implement `shouldUpdate`
- [ ] Decorations (highlights, annotations) use `DecorationSet` efficiently
- [ ] Transactions batched (not one per character for bulk operations)
- [ ] Content-dependent plugins debounced (spell check, link detection)

### SQLite Performance
- [ ] Queries use indexes (run `EXPLAIN QUERY PLAN`)
- [ ] WAL mode enabled (`PRAGMA journal_mode=WAL`)
- [ ] Batch writes wrapped in transactions
- [ ] FTS5 table in sync (via triggers or explicit rebuild)
- [ ] No `SELECT *` — only fetch needed columns

### Memory
- [ ] Event listeners cleaned up on component unmount
- [ ] Yjs docs garbage-collected when notes closed
- [ ] No retained references to large objects (images, blobs)
- [ ] WeakRef/WeakMap for caches that should be GC-eligible

### Network / Sync
- [ ] CRDT uses incremental updates, not full state
- [ ] WebSocket reconnection has exponential backoff
- [ ] Sync operations don't block UI thread
- [ ] Offline queue bounded (max pending updates)

## Output Format

```
## Performance Audit: [Feature/Module]

| Metric | Budget | Actual | Status |
|--------|--------|--------|--------|
| ...    | ...    | ...    | ✅/⚠️/❌ |

### Issues
- [Priority] [Description] [Suggested fix]

### Recommendations
- [Optimization opportunity] [Expected impact]
```
