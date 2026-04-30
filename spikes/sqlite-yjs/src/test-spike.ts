import Database from 'better-sqlite3'
import * as Y from 'yjs'
import { initSchema } from './schema.js'
import { NoteStore } from './note-store.js'

const PASS = '\x1b[32m✓\x1b[0m'
const FAIL = '\x1b[31m✗\x1b[0m'
let passed = 0
let failed = 0

function assert(condition: boolean, name: string) {
  if (condition) {
    console.log(`  ${PASS} ${name}`)
    passed++
  } else {
    console.log(`  ${FAIL} ${name}`)
    failed++
  }
}

function time<T>(fn: () => T): [T, number] {
  const start = performance.now()
  const result = fn()
  return [result, performance.now() - start]
}

// --- Setup ---
const db = new Database(':memory:')
initSchema(db)
const store = new NoteStore(db)

console.log('\n=== Spike #2: SQLite + Yjs CRDT Sync POC ===\n')

// --- Test 1: CRUD Operations ---
console.log('1. CRUD Operations')
const note = store.createNote('My First Note')
assert(!!note.id, 'Note created with UUID')
assert(note.title === 'My First Note', 'Title stored correctly')

const fetched = store.getNote(note.id)
assert(!!fetched && fetched.id === note.id, 'Note retrieved by ID')

store.softDelete(note.id)
const deleted = store.getNote(note.id)
assert(!deleted, 'Soft-deleted note not returned by getNote')

// --- Test 2: Y.Doc Persistence ---
console.log('\n2. Y.Doc Persistence (Save/Load)')
const note2 = store.createNote('CRDT Test Note')
const doc = store.loadDoc(note2.id)
doc.getText('content').insert(0, 'Hello, Generative Notebook!')
const [, saveTime] = time(() => store.saveDoc(note2.id, doc))
assert(saveTime < 10, `Full state save: ${saveTime.toFixed(2)}ms (target <10ms)`)
doc.destroy()

const [loaded, loadTime] = time(() => store.loadDoc(note2.id))
const text = loaded.getText('content').toString()
assert(text === 'Hello, Generative Notebook!', 'Content restored from SQLite')
assert(loadTime < 50, `Load: ${loadTime.toFixed(2)}ms (target <50ms)`)
loaded.destroy()

// --- Test 3: Incremental Updates ---
console.log('\n3. Incremental Updates')
const note3 = store.createNote('Incremental Test')
const doc3 = store.loadDoc(note3.id)

const updates: Uint8Array[] = []
doc3.on('update', (update: Uint8Array) => {
  updates.push(update)
  store.saveIncrementalUpdate(note3.id, update)
})

doc3.getText('content').insert(0, 'Line 1\n')
doc3.getText('content').insert(7, 'Line 2\n')
doc3.getText('content').insert(14, 'Line 3\n')

assert(updates.length === 3, `${updates.length} incremental updates captured`)

const unsynced = store.getUnsyncedUpdates(note3.id)
assert(unsynced.length === 3, `${unsynced.length} unsynced updates in DB`)

store.markSynced(unsynced[0].id)
const remaining = store.getUnsyncedUpdates(note3.id)
assert(remaining.length === 2, 'markSynced reduces unsynced count')

const avgSize = updates.reduce((s, u) => s + u.byteLength, 0) / updates.length
assert(avgSize < 200, `Avg incremental update size: ${avgSize.toFixed(0)} bytes (target <200)`)
doc3.destroy()

// --- Test 4: CRDT Merge (Simulated Offline Editing) ---
console.log('\n4. CRDT Merge — Simulated Offline Editing on Two Devices')
const note4 = store.createNote('Merge Test')
const baseDoc = store.loadDoc(note4.id)
baseDoc.getText('content').insert(0, 'Shared base content.')
store.saveDoc(note4.id, baseDoc)
const baseState = Y.encodeStateAsUpdate(baseDoc)
baseDoc.destroy()

const deviceA = new Y.Doc()
Y.applyUpdate(deviceA, baseState)
deviceA.getText('content').insert(0, '[Device A] ')

const deviceB = new Y.Doc()
Y.applyUpdate(deviceB, baseState)
deviceB.getText('content').insert(20, ' [Device B]')

const updateA = Y.encodeStateAsUpdate(deviceA)
const updateB = Y.encodeStateAsUpdate(deviceB)
Y.applyUpdate(deviceA, updateB)
Y.applyUpdate(deviceB, updateA)

const textA = deviceA.getText('content').toString()
const textB = deviceB.getText('content').toString()
assert(textA === textB, 'Both devices converge to same state')
assert(textA.includes('[Device A]') && textA.includes('[Device B]'), `Merged: "${textA}"`)
deviceA.destroy()
deviceB.destroy()

// --- Test 5: FTS5 Full-Text Search ---
console.log('\n5. FTS5 Full-Text Search')
const searchNotes = [
  { title: 'React Hooks Guide', content: 'useState useEffect useCallback are essential React hooks for functional components' },
  { title: 'Rust Ownership', content: 'Rust uses ownership borrowing and lifetimes to ensure memory safety without garbage collection' },
  { title: 'CRDT Deep Dive', content: 'Conflict-free replicated data types enable distributed systems to converge without coordination' },
  { title: 'SQLite Performance', content: 'WAL mode and proper indexing can make SQLite queries run in under 1ms for most use cases' },
  { title: 'TipTap Extensions', content: 'Custom nodes marks and extensions allow building rich block-based editors with React rendering' },
]

for (const sn of searchNotes) {
  const n = store.createNote(sn.title)
  store.indexForSearch(n.id, sn.title, sn.content)
}

const [results, searchTime] = time(() => store.search('React'))
assert(results.length > 0, `Search "React" found ${results.length} result(s)`)
assert(searchTime < 100, `Search time: ${searchTime.toFixed(2)}ms (target <100ms)`)

const [rustResults] = time(() => store.search('Rust ownership memory'))
assert(rustResults.length > 0, `Search "Rust ownership memory" found ${rustResults.length} result(s)`)

// --- Test 6: Scale Test ---
console.log('\n6. Scale Test — 1000 Notes')
const [, bulkTime] = time(() => {
  const txn = db.transaction(() => {
    for (let i = 0; i < 1000; i++) {
      const n = store.createNote(`Note ${i}`)
      store.indexForSearch(n.id, `Note ${i}`, `This is the content of note number ${i} with some searchable text about topic ${i % 10}`)
    }
  })
  txn()
})
assert(bulkTime < 5000, `1000 notes created + indexed in ${bulkTime.toFixed(0)}ms`)

const [allNotes, listTime] = time(() => store.listNotes())
assert(allNotes.length >= 1000, `Listed ${allNotes.length} notes in ${listTime.toFixed(2)}ms`)

const [scaleSearch, scaleSearchTime] = time(() => store.search('topic 5'))
assert(scaleSearch.length > 0, `Scale search found ${scaleSearch.length} results in ${scaleSearchTime.toFixed(2)}ms`)

// --- Summary ---
console.log('\n' + '='.repeat(50))
console.log(`Results: ${passed} passed, ${failed} failed`)
console.log('='.repeat(50))

db.close()
process.exit(failed > 0 ? 1 : 0)
