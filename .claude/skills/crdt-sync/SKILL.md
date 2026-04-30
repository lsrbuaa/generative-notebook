---
name: crdt-sync
description: Guide Yjs CRDT patterns for conflict-free sync, offline-first collaboration, and multi-device data merging. Use when implementing sync, collaboration features, offline support, or working with shared document state.
---

# CRDT Sync Patterns (Yjs)

## Core Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│ Device A  │     │  Sync    │     │ Device B  │
│           │────▶│  Server  │◀────│           │
│ Y.Doc     │     │ (relay)  │     │ Y.Doc     │
│ + SQLite  │     │          │     │ + SQLite  │
└──────────┘     └──────────┘     └──────────┘
     │                                  │
     └──────── P2P (WebRTC) ───────────┘
```

**Key insight:** Sync server is a relay, not authority. Data authority is always local.

## Document Structure

```typescript
// src/storage/crdt/doc-schema.ts
import * as Y from 'yjs'

// One Y.Doc per note (not per workspace)
function createNoteDoc(): Y.Doc {
  const doc = new Y.Doc()
  
  // Block content — collaborative rich text
  const blocks = doc.getArray<Y.Map<unknown>>('blocks')
  
  // Metadata — title, tags, timestamps
  const meta = doc.getMap('meta')
  
  // Awareness — cursor positions, presence (ephemeral, not persisted)
  // Handled by y-protocols awareness
  
  return doc
}
```

## Essential Patterns

### 1. One Y.Doc Per Note
- Do NOT create one massive Y.Doc for the entire workspace.
- Each note = one Y.Doc. Workspace index = separate Y.Doc.
- Reason: granular sync, lower memory, selective loading.

### 2. Persistence to SQLite
```typescript
// Store Y.Doc state as binary blob in SQLite
import { encodeStateAsUpdate, applyUpdate } from 'yjs'

function saveDoc(db: Database, noteId: string, doc: Y.Doc) {
  const update = encodeStateAsUpdate(doc)
  db.run('INSERT OR REPLACE INTO docs (id, state) VALUES (?, ?)', [noteId, update])
}

function loadDoc(db: Database, noteId: string): Y.Doc {
  const doc = new Y.Doc()
  const row = db.get('SELECT state FROM docs WHERE id = ?', [noteId])
  if (row) applyUpdate(doc, row.state)
  return doc
}
```

### 3. Incremental Updates (Not Full State)
```typescript
// Listen for incremental updates, not full state snapshots
doc.on('update', (update: Uint8Array, origin: unknown) => {
  if (origin !== 'remote') {
    // Only save/broadcast local changes
    saveIncremental(noteId, update)
    broadcastToSync(noteId, update)
  }
})
```

### 4. Sync Protocol
```typescript
// Use y-websocket or custom WebSocket sync
import { WebsocketProvider } from 'y-websocket'

const provider = new WebsocketProvider(
  'wss://sync.example.com',
  `note:${noteId}`,
  doc,
  { connect: navigator.onLine }  // respect offline state
)

// Auto-reconnect with exponential backoff
provider.on('status', ({ status }) => {
  if (status === 'disconnected') {
    // Queue local changes, they'll sync on reconnect
  }
})
```

### 5. Awareness (Presence)
```typescript
// Ephemeral state: cursors, selection, online status
import { Awareness } from 'y-protocols/awareness'

awareness.setLocalStateField('user', {
  name: userName,
  color: userColor,
  cursor: cursorPosition,
})
```

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Store UI state in Y.Doc | Y.Doc is for persistent collaborative data only |
| Use Y.Doc for entire workspace | One Y.Doc per note |
| Broadcast full state on every change | Use incremental updates |
| Ignore `origin` in update handler | Check origin to avoid echo loops |
| Merge Yjs state and Zustand state | Keep them in separate layers |
| Assume ordering of concurrent operations | Design for eventual consistency |

## Testing CRDT

```typescript
// Simulate concurrent editing
function testConcurrentEdit() {
  const doc1 = new Y.Doc()
  const doc2 = new Y.Doc()
  
  // Simulate offline edits
  doc1.getText('content').insert(0, 'Hello ')
  doc2.getText('content').insert(0, 'World')
  
  // Merge (simulating sync)
  const update1 = Y.encodeStateAsUpdate(doc1)
  const update2 = Y.encodeStateAsUpdate(doc2)
  Y.applyUpdate(doc1, update2)
  Y.applyUpdate(doc2, update1)
  
  // Both docs should converge to same state
  assert(doc1.getText('content').toString() === doc2.getText('content').toString())
}
```
