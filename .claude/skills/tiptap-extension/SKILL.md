---
name: tiptap-extension
description: Guide TipTap/ProseMirror editor extension development - custom nodes, marks, block types, and editor plugins. Use when building new block types, editor features, or modifying the editing experience.
---

# TipTap Extension Development

## Extension Types

| Type | Use Case | Example |
|------|---------|---------|
| **Node** | Block-level content | Callout box, code block, table, embed |
| **Mark** | Inline formatting | Highlight, comment annotation, AI suggestion |
| **Extension** | Editor behavior | Keyboard shortcuts, drag-and-drop, collaboration |

## Node Extension Template

```typescript
// src/editor/nodes/[node-name].ts
import { Node, mergeAttributes } from '@tiptap/core'

export const CustomNode = Node.create({
  name: 'customNode',
  group: 'block',
  content: 'inline*',
  
  addAttributes() {
    return {
      // Only attributes that need persistence
      type: { default: 'default' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="custom-node"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'custom-node' }), 0]
  },

  // React renderer for rich rendering
  addNodeView() {
    return ReactNodeViewRenderer(CustomNodeView)
  },
})
```

## Key Principles

### Schema Design
- Keep node schemas minimal. Only persist what's needed for round-trip.
- Use `group: 'block'` for block-level, `inline` for inline nodes.
- Define `content` carefully — it controls what can be nested.
- Every attribute must have a `default` value for CRDT compatibility.

### CRDT Compatibility (Critical)
- All attributes must be serializable (no functions, no DOM refs).
- Use `Y.XmlFragment` for collaborative editing content.
- Test concurrent editing: two users modifying the same node simultaneously.
- Default attribute values are mandatory — Yjs merge requires them.

### NodeView (React Rendering)
```tsx
// src/editor/views/custom-node-view.tsx
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

export function CustomNodeView({ node, updateAttributes }: NodeViewProps) {
  return (
    <NodeViewWrapper className="custom-node">
      {/* Editable content area */}
      <NodeViewContent className="content" />
    </NodeViewWrapper>
  )
}
```

### Performance Rules
- NodeViews are expensive. Use `renderHTML` for simple nodes.
- Only use `ReactNodeViewRenderer` when you need interactivity.
- Implement `shouldUpdate` to prevent unnecessary re-renders.
- Avoid DOM measurements in NodeView render cycle.

### Input Rules and Paste Rules
```typescript
addInputRules() {
  return [
    // Markdown shortcut: ":::" at start of line creates callout
    nodeInputRule({ find: /^:::$/, type: this.type })
  ]
},
addPasteRules() {
  return [
    // Auto-detect pasted URLs and convert to embeds
    nodePasteRule({ find: /https:\/\/..., type: this.type })
  ]
}
```

### Testing Extensions
- Test schema: create node → serialize → parse → compare
- Test input rules: simulate typing → verify node creation
- Test collaboration: concurrent edits via two Yjs docs
- Test export: node → Markdown output correct
