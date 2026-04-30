---
name: code-review
description: Comprehensive code review checking logic correctness, security, performance, style, and Karpathy principle compliance. Use when reviewing code before commit, preparing pull requests, or auditing code quality.
---

# Code Review

Review code changes systematically across five dimensions.

## Review Process

### 1. Correctness
- Does the code do what it claims?
- Are edge cases handled (null, empty, boundary values)?
- Are error paths correct (not just happy path)?
- Is the logic sound — could it produce wrong results silently?

### 2. Security (Notebook-Specific)
- **Data sovereignty:** Does user content stay local unless explicitly shared?
- **AI privacy:** Is content sent to external AI APIs only with opt-in?
- **Input sanitization:** Are embedded HTML blocks sanitized (DOMPurify)?
- **IPC boundary:** Are Tauri command inputs validated on the Rust side?
- **No secrets in code:** No API keys, tokens, or credentials committed.

### 3. Performance (Against Budgets)
- **Bundle impact:** Does this add significant size? (budget: < 50MB total)
- **Render performance:** Any blocking operations in render path? (budget: < 16ms/frame)
- **Search latency:** SQLite queries indexed? (budget: < 100ms)
- **Memory:** Any leaked event listeners, uncleared intervals, unclosed DB connections?
- **CRDT efficiency:** Using incremental updates, not full state snapshots?

### 4. Style & Architecture
- TypeScript strict — no `any` types?
- Follows file naming: `kebab-case.ts`, `PascalCase` components?
- Zustand for client state, Yjs for collaborative state — not mixed?
- Tailwind only — no inline styles, CSS modules, or styled-components?
- Components under 150 lines?

### 5. Karpathy Principles
- **Simplicity:** Could this be simpler? Are there speculative abstractions?
- **Surgical:** Are all changes traceable to the request? No drive-by refactoring?
- **Goal-driven:** Are there verifiable success criteria?

## Output Format

```
## Code Review

**Files:** [list of files reviewed]
**Verdict:** APPROVED / CHANGES REQUESTED

### Issues Found

#### 🔴 Critical
- [file:line] Description (must fix before merge)

#### 🟡 Important  
- [file:line] Description (should fix)

#### 🔵 Suggestion
- [file:line] Description (nice to have)

### Karpathy Check
- Simplicity: ✅/⚠️ [notes]
- Surgical: ✅/⚠️ [notes]
- Goal-driven: ✅/⚠️ [notes]

### What's Good
- [Positive observations — don't skip this]
```

## Quick Review Checklist

```
[ ] No TypeScript `any` types
[ ] No console.log left in production code
[ ] No hardcoded values that should be constants
[ ] Error handling present at system boundaries
[ ] Async operations have proper cleanup
[ ] Event listeners removed on unmount
[ ] CRDT operations use incremental updates
[ ] SQLite queries are parameterized
[ ] New components registered in view registry (if Generative UI)
[ ] Tests added for new logic
```
