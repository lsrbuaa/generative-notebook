---
paths:
  - "src/editor/**/*.ts"
  - "src/editor/**/*.tsx"
---

# Editor Extension Rules (TipTap / ProseMirror)

- Every Node attribute must have a `default` value (CRDT compatibility requirement).
- All attributes must be JSON-serializable. No functions, DOM refs, or class instances.
- Use `renderHTML` for simple nodes. Only use `ReactNodeViewRenderer` when interactivity is needed.
- Implement `shouldUpdate` on NodeViews to prevent unnecessary re-renders.
- Input rules: support Markdown shortcuts (e.g., `# ` → heading, `- ` → list).
- Schema: define `group` and `content` carefully — they control nesting rules.
- Test round-trip: create node → serialize to JSON → parse back → compare.
- Test concurrent editing: two Yjs docs modifying the same node type.
- No DOM measurements in NodeView render cycle (causes layout thrashing).
