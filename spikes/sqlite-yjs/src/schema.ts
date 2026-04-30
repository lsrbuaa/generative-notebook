import Database from 'better-sqlite3'

export function initSchema(db: Database.Database) {
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL DEFAULT '',
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL,
      parent_id   TEXT REFERENCES notes(id),
      is_folder   INTEGER NOT NULL DEFAULT 0,
      sort_order  REAL NOT NULL DEFAULT 0,
      deleted_at  TEXT
    );

    CREATE TABLE IF NOT EXISTS crdt_docs (
      note_id     TEXT PRIMARY KEY REFERENCES notes(id),
      state       BLOB NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS crdt_updates (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      note_id     TEXT NOT NULL REFERENCES notes(id),
      update_data BLOB NOT NULL,
      created_at  TEXT NOT NULL,
      synced      INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS tags (
      id   TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS note_tags (
      note_id TEXT NOT NULL REFERENCES notes(id),
      tag_id  TEXT NOT NULL REFERENCES tags(id),
      PRIMARY KEY (note_id, tag_id)
    );

    CREATE TABLE IF NOT EXISTS backlinks (
      source_id TEXT NOT NULL REFERENCES notes(id),
      target_id TEXT NOT NULL REFERENCES notes(id),
      PRIMARY KEY (source_id, target_id)
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
      title,
      content,
      tokenize='unicode61 remove_diacritics 2'
    );

    CREATE INDEX IF NOT EXISTS idx_notes_parent ON notes(parent_id) WHERE deleted_at IS NULL;
    CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updated_at);
    CREATE INDEX IF NOT EXISTS idx_crdt_updates_unsynced ON crdt_updates(note_id) WHERE synced = 0;
    CREATE INDEX IF NOT EXISTS idx_backlinks_target ON backlinks(target_id);
  `)
}
