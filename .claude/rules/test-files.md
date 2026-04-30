---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "tests/**/*"
---

# Test File Rules

- Framework: Vitest for unit/integration, Playwright for E2E.
- Name tests after behavior: `"saves note to SQLite"` not `"test saveNote"`.
- One assertion per test when practical. Failing test name should explain what broke.
- No mocking databases — use in-memory SQLite (`:memory:`).
- No mocking CRDT — use real Yjs docs (fast enough for unit tests).
- Always mock external AI (Claude API) calls.
- No snapshot tests for UI. Only use snapshots for serialization format verification.
- Test file location: co-locate `*.test.ts` with source. E2E in `tests/e2e/`.
- Arrange-Act-Assert pattern. Keep setup in `beforeEach`, not duplicated in each test.
- Clean up: close DB connections, destroy Yjs docs, clear stores in `afterEach`.
