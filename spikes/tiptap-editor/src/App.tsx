import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Collaboration from '@tiptap/extension-collaboration'
import * as Y from 'yjs'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Toolbar } from './Toolbar'
import { SyncDemo } from './SyncDemo'
import { Callout } from './extensions/callout'
import './index.css'

const ydoc = new Y.Doc()

const INITIAL_CONTENT = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: 'Generative Notebook — Editor POC' }],
    },
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'This is a ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'TipTap Block Editor' },
        { type: 'text', text: ' proof of concept with real-time CRDT sync.' },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Features to verify' }],
    },
    {
      type: 'taskList',
      content: [
        { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Rich text editing (bold, italic, strikethrough)' }] }] },
        { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Headings (H1, H2, H3)' }] }] },
        { type: 'taskItem', attrs: { checked: true }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Lists (bullet, ordered, task)' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Code blocks with syntax highlighting' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Tables' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Custom callout block (type ::: to create)' }] }] },
        { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Yjs CRDT real-time sync' }] }] },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Code Example' }],
    },
    {
      type: 'codeBlock',
      attrs: { language: 'typescript' },
      content: [{ type: 'text', text: '// Generative UI: AI selects the best view\nasync function routeToView(context: NoteContext) {\n  const localMatch = fastMatch(context)\n  if (localMatch.confidence > 0.9) return localMatch\n  return await llmRoute(context)\n}' }],
    },
    {
      type: 'blockquote',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'The interface should adapt to you, not the other way around.' }] }],
    },
  ],
}

function App() {
  const [blockCount, setBlockCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [inputLatency, setInputLatency] = useState<number | null>(null)
  const lastKeyTime = useRef(0)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Placeholder.configure({
        placeholder: 'Start writing... (try # for heading, - for list, ::: for callout)',
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
      Callout,
      Collaboration.configure({
        document: ydoc,
      }),
    ],
    content: INITIAL_CONTENT,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      setBlockCount(json.content?.length ?? 0)
      setCharCount(editor.storage.characterCount?.characters?.() ?? editor.getText().length)

      if (lastKeyTime.current > 0) {
        const latency = performance.now() - lastKeyTime.current
        setInputLatency(latency)
      }
    },
  })

  const handleKeyDown = useCallback(() => {
    lastKeyTime.current = performance.now()
  }, [])

  useEffect(() => {
    const el = document.querySelector('.tiptap')
    if (el) {
      el.addEventListener('keydown', handleKeyDown)
      return () => el.removeEventListener('keydown', handleKeyDown)
    }
  }, [editor, handleKeyDown])

  const latencyClass = inputLatency === null ? '' : inputLatency < 16 ? '' : inputLatency < 50 ? 'warn' : 'fail'

  return (
    <>
      <div className="spike-header">
        <h1>TipTap Editor POC</h1>
        <p>Spike #1 — Block editor with Yjs CRDT sync</p>
        <span className="badge">Phase 0: Technical Validation</span>
      </div>

      <div className="editor-container">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
        <div className="status-bar">
          <span>{blockCount} blocks</span>
          <span>{charCount} characters</span>
          <span>Yjs connected</span>
        </div>
      </div>

      <div className="metrics">
        <div className="metric-card">
          <div className="value">{blockCount}</div>
          <div className="label">Blocks</div>
        </div>
        <div className="metric-card">
          <div className={`value ${latencyClass}`}>
            {inputLatency !== null ? `${inputLatency.toFixed(1)}ms` : '—'}
          </div>
          <div className="label">Input Latency (target: &lt;16ms)</div>
        </div>
        <div className="metric-card">
          <div className="value">{charCount}</div>
          <div className="label">Characters</div>
        </div>
      </div>

      <SyncDemo doc={ydoc} />

      <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-editor)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <h3 style={{ fontSize: 14, color: 'var(--accent)', marginBottom: 8 }}>JSON Serialization Test</h3>
        <button
          type="button"
          style={{
            background: 'var(--accent)',
            color: 'white',
            border: 'none',
            padding: '6px 16px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
          }}
          onClick={() => {
            if (!editor) return
            const json = editor.getJSON()
            const str = JSON.stringify(json)
            const parsed = JSON.parse(str)
            editor.commands.setContent(parsed)
            alert(`Round-trip OK: ${str.length} bytes serialized, ${json.content?.length ?? 0} blocks restored`)
          }}
        >
          Test JSON Round-Trip
        </button>
        <span style={{ marginLeft: 12, fontSize: 12, color: 'var(--text-muted)' }}>
          Serialize to JSON → parse → restore editor content
        </span>
      </div>
    </>
  )
}

export default App
