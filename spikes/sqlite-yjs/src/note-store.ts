import Database from 'better-sqlite3'
import * as Y from 'yjs'
import { randomUUID } from 'crypto'

export interface NoteMeta {
  id: string
  title: string
  created_at: string
  updated_at: string
  parent_id: string | null
  is_folder: number
  sort_order: number
  deleted_at: string | null
}

export class NoteStore {
  private db: Database.Database

  private stmts: {
    insertNote: Database.Statement
    getNote: Database.Statement
    listNotes: Database.Statement
    softDelete: Database.Statement
    updateTitle: Database.Statement
    saveDoc: Database.Statement
    loadDoc: Database.Statement
    insertUpdate: Database.Statement
    getUnsynced: Database.Statement
    markSynced: Database.Statement
    upsertFts: Database.Statement
    searchFts: Database.Statement
  }

  constructor(db: Database.Database) {
    this.db = db
    this.stmts = {
      insertNote: db.prepare(`
        INSERT INTO notes (id, title, created_at, updated_at, parent_id, is_folder, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `),
      getNote: db.prepare('SELECT * FROM notes WHERE id = ? AND deleted_at IS NULL'),
      listNotes: db.prepare('SELECT * FROM notes WHERE deleted_at IS NULL ORDER BY sort_order'),
      softDelete: db.prepare('UPDATE notes SET deleted_at = ? WHERE id = ?'),
      updateTitle: db.prepare('UPDATE notes SET title = ?, updated_at = ? WHERE id = ?'),
      saveDoc: db.prepare(`
        INSERT INTO crdt_docs (note_id, state, updated_at) VALUES (?, ?, ?)
        ON CONFLICT(note_id) DO UPDATE SET state = excluded.state, updated_at = excluded.updated_at
      `),
      loadDoc: db.prepare('SELECT state FROM crdt_docs WHERE note_id = ?'),
      insertUpdate: db.prepare(`
        INSERT INTO crdt_updates (note_id, update_data, created_at) VALUES (?, ?, ?)
      `),
      getUnsynced: db.prepare('SELECT * FROM crdt_updates WHERE note_id = ? AND synced = 0 ORDER BY id'),
      markSynced: db.prepare('UPDATE crdt_updates SET synced = 1 WHERE id = ?'),
      upsertFts: db.prepare(`
        INSERT INTO notes_fts (rowid, title, content) VALUES (
          (SELECT rowid FROM notes WHERE id = ?), ?, ?
        )
      `),
      searchFts: db.prepare(`
        SELECT n.*, rank FROM notes_fts fts
        JOIN notes n ON n.rowid = fts.rowid
        WHERE notes_fts MATCH ?
          AND n.deleted_at IS NULL
        ORDER BY rank
        LIMIT ?
      `),
    }
  }

  createNote(title: string, parentId: string | null = null): NoteMeta {
    const now = new Date().toISOString()
    const id = randomUUID()
    this.stmts.insertNote.run(id, title, now, now, parentId, 0, 0)

    const doc = new Y.Doc()
    doc.getText('content').insert(0, '')
    const state = Y.encodeStateAsUpdate(doc)
    this.stmts.saveDoc.run(id, state, now)
    doc.destroy()

    return { id, title, created_at: now, updated_at: now, parent_id: parentId, is_folder: 0, sort_order: 0, deleted_at: null }
  }

  getNote(id: string): NoteMeta | undefined {
    return this.stmts.getNote.get(id) as NoteMeta | undefined
  }

  listNotes(): NoteMeta[] {
    return this.stmts.listNotes.all() as NoteMeta[]
  }

  softDelete(id: string) {
    this.stmts.softDelete.run(new Date().toISOString(), id)
  }

  saveDoc(noteId: string, doc: Y.Doc) {
    const state = Y.encodeStateAsUpdate(doc)
    const now = new Date().toISOString()
    this.stmts.saveDoc.run(noteId, state, now)
  }

  saveIncrementalUpdate(noteId: string, update: Uint8Array) {
    this.stmts.insertUpdate.run(noteId, Buffer.from(update), new Date().toISOString())
  }

  loadDoc(noteId: string): Y.Doc {
    const doc = new Y.Doc()
    const row = this.stmts.loadDoc.get(noteId) as { state: Buffer } | undefined
    if (row) {
      Y.applyUpdate(doc, new Uint8Array(row.state))
    }
    return doc
  }

  getUnsyncedUpdates(noteId: string): Array<{ id: number; update_data: Buffer }> {
    return this.stmts.getUnsynced.all(noteId) as Array<{ id: number; update_data: Buffer }>
  }

  markSynced(updateId: number) {
    this.stmts.markSynced.run(updateId)
  }

  indexForSearch(noteId: string, title: string, content: string) {
    try {
      this.stmts.upsertFts.run(noteId, title, content)
    } catch {
      this.db.prepare('DELETE FROM notes_fts WHERE rowid = (SELECT rowid FROM notes WHERE id = ?)').run(noteId)
      this.stmts.upsertFts.run(noteId, title, content)
    }
  }

  search(query: string, limit = 20): NoteMeta[] {
    return this.stmts.searchFts.all(query, limit) as NoteMeta[]
  }
}
