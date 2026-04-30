---
name: test-writer
description: Guide test strategy and test writing across all layers - unit tests, integration tests, E2E tests. Generates test skeletons and recommends coverage approach. Use when writing tests, adding test coverage, or planning testing strategy.
---

# Test Writer

## Testing Stack

| Layer | Framework | What to Test |
|-------|-----------|-------------|
| Unit | Vitest | Pure functions, utils, CRDT operations, AI routing logic |
| Integration | Vitest + Testing Library | Component rendering, store interactions, SQLite operations |
| E2E | Playwright | Full user flows: create note, edit, search, sync |

## Test File Conventions

```
src/
  lib/
    utils.ts
    utils.test.ts          ← Co-located unit tests
  components/
    note-card.tsx
    note-card.test.tsx      ← Co-located component tests
  storage/
    sqlite.ts
    sqlite.test.ts          ← Integration tests
tests/
  e2e/
    note-editing.spec.ts    ← E2E tests in dedicated folder
    search.spec.ts
```

- Test files: `*.test.ts` (unit/integration) or `*.spec.ts` (E2E)
- Co-locate with source for unit/integration, separate `tests/e2e/` for E2E
- Name tests after the behavior, not the function: `"saves note to SQLite"` not `"test saveNote"`

## Unit Test Template

```typescript
import { describe, it, expect } from 'vitest'

describe('functionName', () => {
  it('handles the primary use case', () => {
    const result = functionName(validInput)
    expect(result).toBe(expectedOutput)
  })

  it('handles empty input', () => {
    const result = functionName('')
    expect(result).toBe(defaultOutput)
  })

  it('throws on invalid input', () => {
    expect(() => functionName(null)).toThrow()
  })
})
```

## Component Test Template

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const onAction = vi.fn()
    render(<ComponentName onAction={onAction} />)
    
    await fireEvent.click(screen.getByRole('button'))
    expect(onAction).toHaveBeenCalledOnce()
  })
})
```

## CRDT Test Template

```typescript
import * as Y from 'yjs'
import { describe, it, expect } from 'vitest'

describe('CRDT operations', () => {
  it('merges concurrent edits correctly', () => {
    const doc1 = new Y.Doc()
    const doc2 = new Y.Doc()

    // Simulate offline edits
    doc1.getArray('blocks').insert(0, ['block-a'])
    doc2.getArray('blocks').insert(0, ['block-b'])

    // Merge
    Y.applyUpdate(doc1, Y.encodeStateAsUpdate(doc2))
    Y.applyUpdate(doc2, Y.encodeStateAsUpdate(doc1))

    // Converge
    expect(doc1.getArray('blocks').toArray())
      .toEqual(doc2.getArray('blocks').toArray())
  })
})
```

## What to Test Per Layer

### Storage Layer (SQLite)
- CRUD operations (create, read, update, soft-delete)
- FTS5 search accuracy and ranking
- Migration up/down
- Concurrent writes (WAL mode)
- Edge cases: empty strings, unicode, very long content

### Editor Layer (TipTap)
- Block creation via input rules (type "# " → heading)
- Paste handling (HTML → blocks, plain text → paragraphs)
- Serialization round-trip (blocks → JSON → blocks)
- Collaboration (concurrent TipTap edits via Yjs)

### AI Layer (Generative UI)
- Context analyzer: known content → expected content type
- Fast matcher: obvious cases resolve without LLM
- Router fallback: LLM failure → default view
- User override persistence

### IPC Layer (Tauri)
- Command input validation (Rust side)
- Error propagation (Rust error → TypeScript error)
- Event round-trip (emit → listen → handle)

## Testing Principles

1. **Test behavior, not implementation.** If you refactor and tests break but behavior didn't change, the tests were wrong.
2. **One assertion per test** (when practical). Failing test name should tell you what broke.
3. **No mocking databases.** Use in-memory SQLite (`:memory:`) for storage tests.
4. **No mocking CRDT.** Use real Yjs docs — they're fast enough for unit tests.
5. **Mock external AI.** LLM calls should always be mocked in tests.
6. **Snapshot tests only for serialization formats** (block JSON structure), never for UI.
