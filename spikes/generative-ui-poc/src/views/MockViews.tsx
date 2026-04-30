import type { NoteContext } from '../engine/types'

interface ViewProps {
  context: NoteContext
}

export function EditorView({ context }: ViewProps) {
  return (
    <div className="mock-view editor-view">
      <div className="view-header">
        <span className="view-icon">📝</span>
        <h3>{context.title || 'Untitled'}</h3>
      </div>
      <div className="view-body">
        {context.blocks.map((block, i) => (
          <div key={i} className={`block block-${block.type}`}>
            {block.type === 'heading' && <h2>{block.content}</h2>}
            {block.type === 'paragraph' && <p>{block.content}</p>}
            {block.type === 'codeBlock' && <pre><code>{block.content}</code></pre>}
            {block.type === 'taskItem' && (
              <label className="task"><input type="checkbox" readOnly /> {block.content}</label>
            )}
            {block.type === 'blockquote' && <blockquote>{block.content}</blockquote>}
          </div>
        ))}
      </div>
    </div>
  )
}

export function KanbanView({ context }: ViewProps) {
  const tasks = context.blocks.filter(b => b.type === 'taskItem')
  const columns = [
    { name: 'To Do', items: tasks.slice(0, Math.ceil(tasks.length / 3)) },
    { name: 'In Progress', items: tasks.slice(Math.ceil(tasks.length / 3), Math.ceil(tasks.length * 2 / 3)) },
    { name: 'Done', items: tasks.slice(Math.ceil(tasks.length * 2 / 3)) },
  ]
  return (
    <div className="mock-view kanban-view">
      <div className="view-header">
        <span className="view-icon">📋</span>
        <h3>Kanban: {context.title}</h3>
      </div>
      <div className="kanban-board">
        {columns.map(col => (
          <div key={col.name} className="kanban-column">
            <div className="column-header">{col.name} <span className="count">{col.items.length}</span></div>
            {col.items.map((task, i) => (
              <div key={i} className="kanban-card">{task.content}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function TimelineView({ context }: ViewProps) {
  return (
    <div className="mock-view timeline-view">
      <div className="view-header">
        <span className="view-icon">📅</span>
        <h3>Timeline: {context.title}</h3>
      </div>
      <div className="timeline">
        {context.blocks.map((block, i) => (
          <div key={i} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-time">{`${9 + Math.floor(i / 2)}:${i % 2 === 0 ? '00' : '30'}`}</div>
              <div className="timeline-text">{block.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CodeNotebookView({ context }: ViewProps) {
  const codeBlocks = context.blocks.filter(b => b.type === 'codeBlock')
  const prose = context.blocks.filter(b => b.type !== 'codeBlock')
  return (
    <div className="mock-view code-view">
      <div className="view-header">
        <span className="view-icon">💻</span>
        <h3>Code: {context.title}</h3>
      </div>
      <div className="code-layout">
        <div className="code-main">
          {context.blocks.map((block, i) => (
            <div key={i} className={block.type === 'codeBlock' ? 'code-cell' : 'prose-cell'}>
              {block.type === 'codeBlock' ? <pre><code>{block.content}</code></pre> : <p>{block.content}</p>}
            </div>
          ))}
        </div>
        <div className="code-sidebar">
          <h4>Code Blocks ({codeBlocks.length})</h4>
          {codeBlocks.map((cb, i) => (
            <div key={i} className="sidebar-item">{cb.content.split('\n')[0]}</div>
          ))}
          <h4>Sections ({prose.length})</h4>
          {prose.filter(b => b.type === 'heading').map((h, i) => (
            <div key={i} className="sidebar-item">{h.content}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function DataTableView({ context }: ViewProps) {
  return (
    <div className="mock-view table-view">
      <div className="view-header">
        <span className="view-icon">📊</span>
        <h3>Data: {context.title}</h3>
      </div>
      <div className="view-body">
        <table className="data-table">
          <thead><tr><th>#</th><th>Type</th><th>Content</th></tr></thead>
          <tbody>
            {context.blocks.map((b, i) => (
              <tr key={i}><td>{i + 1}</td><td>{b.type}</td><td>{b.content.slice(0, 60)}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function ResearchView({ context }: ViewProps) {
  return (
    <div className="mock-view research-view">
      <div className="view-header">
        <span className="view-icon">🔬</span>
        <h3>Research: {context.title}</h3>
      </div>
      <div className="research-layout">
        <div className="research-main">
          {context.blocks.map((block, i) => (
            <div key={i} className={`block block-${block.type}`}>
              {block.type === 'heading' ? <h3>{block.content}</h3> : <p>{block.content}</p>}
            </div>
          ))}
        </div>
        <div className="research-sidebar">
          <h4>Topics</h4>
          {context.estimatedTopics.map(t => <span key={t} className="topic-tag">{t}</span>)}
          <h4>Links ({context.linkCount})</h4>
          <p className="muted">Bidirectional links would appear here</p>
        </div>
      </div>
    </div>
  )
}

export const VIEW_COMPONENTS: Record<string, React.ComponentType<ViewProps>> = {
  editor: EditorView,
  kanban: KanbanView,
  timeline: TimelineView,
  'code-notebook': CodeNotebookView,
  'data-table': DataTableView,
  research: ResearchView,
}
