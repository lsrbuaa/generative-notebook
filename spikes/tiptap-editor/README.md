# Spike: TipTap Block Editor POC

**Issue:** [#1](https://github.com/lsrbuaa/generative-notebook/issues/1)
**Branch:** `spike/tiptap-editor`
**Status:** In Progress

## Hypothesis

TipTap can render 1000+ blocks with <16ms input latency, support custom block types via extensions, and integrate with Yjs for collaborative editing.

## What's Implemented

- [x] TipTap editor with StarterKit (headings, paragraphs, lists, code blocks, blockquotes)
- [x] Task lists with checkboxes
- [x] Tables (3x3 insert via toolbar)
- [x] Custom block type: **Callout** (type `:::` to trigger)
- [x] Markdown shortcuts (`#` → heading, `-` → list, `>` → quote, ``` → code block)
- [x] Yjs CRDT integration via `@tiptap/extension-collaboration`
- [x] Simulated peer sync (second Y.Doc mirrors all changes in real-time)
- [x] JSON round-trip test (serialize → parse → restore)
- [x] Input latency measurement
- [x] Block count and character count metrics

## Run

```bash
cd spikes/tiptap-editor
npm install
npm run dev
# Open http://localhost:5173
```

## Test Checklist

- [ ] Type text — verify smooth editing
- [ ] Use toolbar buttons — all formatting works
- [ ] Type `# ` at line start — creates heading
- [ ] Type `- ` at line start — creates bullet list
- [ ] Type `:::` at line start — creates callout block
- [ ] Click "Test JSON Round-Trip" — content survives serialize/restore
- [ ] Check sync panel — peer document mirrors your edits
- [ ] Check input latency metric — should be <16ms for 60fps
