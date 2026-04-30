---
name: tauri-ipc
description: Guide Tauri 2.0 Rust-JavaScript IPC patterns - commands, events, state management, and plugin development. Use when building Rust backend logic, communicating between frontend and backend, or developing Tauri plugins.
---

# Tauri 2.0 IPC Patterns

## Architecture

```
┌──────────────────────────┐
│   Frontend (WebView)      │
│   React + TypeScript      │
│                           │
│   invoke('command', args) │──── IPC ────▶ ┌─────────────────┐
│   listen('event')         │◀── Events ──── │ Rust Backend     │
│   emit('event')           │──── Events ──▶ │                  │
└──────────────────────────┘                 │ #[tauri::command] │
                                             │ app.emit()       │
                                             │ SQLite / FS      │
                                             └─────────────────┘
```

## Commands (JS → Rust)

### Rust Side
```rust
// src-tauri/src/commands/notes.rs

#[tauri::command]
async fn get_note(db: State<'_, Database>, id: String) -> Result<Note, String> {
    db.get_note(&id).map_err(|e| e.to_string())
}

#[tauri::command]
async fn save_note(db: State<'_, Database>, note: Note) -> Result<(), String> {
    db.save_note(&note).map_err(|e| e.to_string())
}

// Register in main.rs
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_note, save_note])
        .run(tauri::generate_context!())
        .expect("error running app");
}
```

### TypeScript Side
```typescript
// src/lib/tauri-api.ts
import { invoke } from '@tauri-apps/api/core'

export async function getNote(id: string): Promise<Note> {
  return invoke<Note>('get_note', { id })
}

export async function saveNote(note: Note): Promise<void> {
  return invoke('save_note', { note })
}
```

## Key Principles

### 1. Type-Safe IPC Boundary
- Define shared types in Rust with `serde::Serialize/Deserialize`
- Mirror types in TypeScript manually (or use `specta` for auto-generation)
- Never use `serde_json::Value` as command input/output — always typed structs

### 2. Error Handling
```rust
// Use a custom error type, not String
#[derive(Debug, thiserror::Error)]
enum AppError {
    #[error("Note not found: {0}")]
    NotFound(String),
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),
}

impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(&self.to_string())
    }
}
```

### 3. Heavy Work in Rust
- File I/O, SQLite queries, encryption, compression → Rust
- UI rendering, state management, user interaction → TypeScript
- CRDT operations → TypeScript (Yjs runs in WebView)
- Binary data (images, attachments) → Rust reads, sends as base64 or temp file path

### 4. Events (Bidirectional)

```rust
// Rust → JS: notify frontend of changes
app.emit("note-updated", NoteUpdated { id, timestamp })?;

// JS → Rust: frontend actions
app.listen("sync-requested", |event| {
    // handle sync trigger
});
```

```typescript
// JS side
import { listen, emit } from '@tauri-apps/api/event'

const unlisten = await listen<NoteUpdated>('note-updated', (event) => {
  refreshNote(event.payload.id)
})

// Cleanup on unmount
unlisten()
```

### 5. State Management
```rust
// Managed state via Tauri State
struct Database(Mutex<Connection>);

fn main() {
    let db = Database(Mutex::new(Connection::open("notes.db").unwrap()));
    
    tauri::Builder::default()
        .manage(db)
        .run(tauri::generate_context!())
        .unwrap();
}
```

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Call invoke() in a render loop | Cache results, use events for updates |
| Send large blobs through IPC | Write to temp file, send file path |
| Block the main thread in Rust | Use `async` commands with `tokio` |
| Duplicate business logic in JS and Rust | Pick one side for each concern |
| Use Rust for UI state | Rust = persistence + I/O, JS = UI + state |
