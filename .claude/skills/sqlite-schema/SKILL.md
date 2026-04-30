---
name: sqlite-schema
description: Guide SQLite database schema design for the Notebook app - tables, indexes, FTS5 full-text search, migrations, and query patterns. Use when designing database tables, writing queries, optimizing search, or creating migrations.
---

# SQLite Schema Design

## Core Schema

```sql
-- Notes table: metadata only (content is in CRDT blobs)
CREATE TABLE notes (
  id          TEXT PRIMARY KEY,          -- UUID v7 (time-sortable)
  title       TEXT NOT NULL DEFAULT '',
  created_at  TEXT NOT NULL,             -- ISO 8601
  updated_at  TEXT NOT NULL,
  parent_id   TEXT REFERENCES notes(id), -- folder hierarchy
  is_folder   INTEGER NOT NULL DEFAULT 0,
  sort_order  REAL NOT NULL DEFAULT 0,   -- fractional indexing for custom sort
  deleted_at  TEXT                        -- soft delete
);

-- CRDT state storage
CREATE TABLE crdt_docs (
  note_id     TEXT PRIMARY KEY REFERENCES notes(id),
  state       BLOB NOT NULL,             -- Y.Doc encoded state
  updated_at  TEXT NOT NULL
);

-- Incremental updates (for sync)
CREATE TABLE crdt_updates (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  note_id     TEXT NOT NULL REFERENCES notes(id),
  update_data BLOB NOT NULL,
  created_at  TEXT NOT NULL,
  synced      INTEGER NOT NULL DEFAULT 0
);

-- Tags
CREATE TABLE tags (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE
);

CREATE TABLE note_tags (
  note_id     TEXT NOT NULL REFERENCES notes(id),
  tag_id      TEXT NOT NULL REFERENCES tags(id),
  PRIMARY KEY (note_id, tag_id)
);

-- Backlinks (bidirectional links between notes)
CREATE TABLE backlinks (
  source_id   TEXT NOT NULL REFERENCES notes(id),
  target_id   TEXT NOT NULL REFERENCES notes(id),
  PRIMARY KEY (source_id, target_id)
);

-- Full-text search (FTS5)
CREATE VIRTUAL TABLE notes_fts USING fts5(
  title,
  content,
  content_rowid='rowid',
  tokenize='unicode61 remove_diacritics 2'
);
```

## Key Principles

### 1. UUID v7 for IDs
- Time-sortable: natural chronological ordering without extra index
- Globally unique: safe for multi-device generation without coordination
- No auto-increment: avoids conflicts in distributed scenario

### 2. Separate Content from Metadata
- Metadata (title, dates, tags) in relational tables → fast queries, indexing
- Content (blocks, rich text) in CRDT blobs → conflict-free sync
- FTS index mirrors content for search → rebuilt from CRDT on change

### 3. Indexes
```sql
CREATE INDEX idx_notes_parent ON notes(parent_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notes_updated ON notes(updated_at);
CREATE INDEX idx_crdt_updates_unsynced ON crdt_updates(note_id) WHERE synced = 0;
CREATE INDEX idx_backlinks_target ON backlinks(target_id);
```

### 4. Soft Deletes
- Never `DELETE` notes. Set `deleted_at` timestamp.
- All queries filter `WHERE deleted_at IS NULL` by default.
- Periodic cleanup job removes notes deleted > 30 days ago.

### 5. Fractional Indexing for Custom Sort
```typescript
// Use fractional-indexing library for custom sort order
// Between items A(sort=0.5) and B(sort=0.75) → new item gets 0.625
import { generateKeyBetween } from 'fractional-indexing'
const newOrder = generateKeyBetween(itemA.sortOrder, itemB.sortOrder)
```

## Query Patterns

### Search
```sql
-- Full-text search with ranking
SELECT n.*, rank
FROM notes_fts fts
JOIN notes n ON n.id = fts.rowid
WHERE notes_fts MATCH ?
  AND n.deleted_at IS NULL
ORDER BY rank
LIMIT 20;
```

### Graph Queries (Backlinks)
```sql
-- Find all notes linking TO this note
SELECT n.* FROM notes n
JOIN backlinks b ON b.source_id = n.id
WHERE b.target_id = ? AND n.deleted_at IS NULL;

-- Find all notes this note links TO
SELECT n.* FROM notes n
JOIN backlinks b ON b.target_id = n.id
WHERE b.source_id = ? AND n.deleted_at IS NULL;
```

## Migrations

```typescript
// src/storage/migrations/index.ts
const migrations = [
  { version: 1, up: 'CREATE TABLE notes ...' },
  { version: 2, up: 'ALTER TABLE notes ADD COLUMN ...' },
]

function migrate(db: Database) {
  const current = db.pragma('user_version') as number
  for (const m of migrations) {
    if (m.version > current) {
      db.exec(m.up)
      db.pragma(`user_version = ${m.version}`)
    }
  }
}
```

## Performance Rules
- Always use parameterized queries (never string interpolation)
- Use `WAL` mode: `PRAGMA journal_mode=WAL`
- Batch writes in transactions (10x+ faster)
- Keep FTS index in sync via triggers or explicit rebuild
- VACUUM periodically for large databases
