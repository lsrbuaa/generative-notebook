---
name: architecture-review
description: Review architectural decisions against Notebook's core principles (Local-First, AI-Native, CRDT). Use when discussing architecture, designing new modules, making technology choices, or evaluating design tradeoffs.
---

# Architecture Review

Review the proposed architecture or design decision against Notebook's three core principles.

## Checklist

### 1. Local-First Principle
- [ ] Does it work fully offline? Network must never be required for core functionality.
- [ ] Is data stored locally in SQLite first?
- [ ] Does sync use CRDT (Yjs) for conflict-free merging?
- [ ] Is there a degradation path when network is unavailable?
- [ ] Does the user retain full data ownership?

### 2. AI-Native Principle
- [ ] Is AI integral to the feature (not bolted on)?
- [ ] Does it leverage context (content type, user behavior, time) for intelligence?
- [ ] Is there a local AI fallback (Ollama/llama.cpp) for offline use?
- [ ] Is AI opt-in with clear user consent for data processing?
- [ ] Does it avoid sending user content to external services without explicit permission?

### 3. CRDT / Collaboration Principle
- [ ] Are data structures CRDT-compatible (Yjs Y.Map, Y.Array, Y.Text)?
- [ ] Does the design support eventual consistency?
- [ ] Can it handle concurrent edits without server arbitration?
- [ ] Is the sync layer decoupled from the storage layer?

### 4. Performance Constraints
- [ ] Bundle size impact < 50MB total
- [ ] First paint < 500ms
- [ ] Editor input latency < 16ms (60fps)
- [ ] Search response < 100ms for local queries

### 5. Simplicity (Karpathy Principle #2)
- [ ] Is this the simplest design that solves the problem?
- [ ] Are there abstractions that aren't yet needed?
- [ ] Could this be done with fewer moving parts?

## Output Format

```
## Architecture Review: [Feature/Module Name]

**Decision:** [What is being proposed]
**Verdict:** APPROVED / NEEDS CHANGES / REJECTED

### Principle Compliance
- Local-First: ✅/⚠️/❌ [notes]
- AI-Native: ✅/⚠️/❌ [notes]
- CRDT-Ready: ✅/⚠️/❌ [notes]
- Performance: ✅/⚠️/❌ [notes]

### Concerns
[List specific concerns]

### Recommendations
[List actionable recommendations]
```
