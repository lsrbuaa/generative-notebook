import { useState, useMemo } from 'react'
import { analyzeContext } from './engine/context-analyzer'
import { routeToView, viewRegistry } from './engine/registry'
import { VIEW_COMPONENTS } from './views/MockViews'
import { DEMO_NOTES } from './demo-notes'
import './index.css'

function App() {
  const [selectedNote, setSelectedNote] = useState(0)
  const [pinnedView, setPinnedView] = useState<string | null>(null)
  const [overrideView, setOverrideView] = useState<string | null>(null)

  const note = DEMO_NOTES[selectedNote]

  const context = useMemo(() => analyzeContext(note.title, note.blocks), [note])

  const routingResult = useMemo(() => {
    const start = performance.now()
    const result = routeToView(context)
    const elapsed = performance.now() - start
    return { ...result, elapsed }
  }, [context])

  const activeViewName = pinnedView ?? overrideView ?? routingResult.view.name
  const ActiveView = VIEW_COMPONENTS[activeViewName] ?? VIEW_COMPONENTS['editor']

  const handleNoteSelect = (i: number) => {
    setSelectedNote(i)
    setOverrideView(null)
    if (!pinnedView) setPinnedView(null)
  }

  const confidenceColor = routingResult.confidence >= 0.7 ? 'var(--green)' :
    routingResult.confidence >= 0.4 ? 'var(--yellow)' : 'var(--red)'

  return (
    <>
      <div className="spike-header">
        <h1>Generative UI Engine POC</h1>
        <p>Spike #3 — AI routes content to the best view automatically</p>
        <span className="badge">Phase 0: Technical Validation</span>
      </div>

      <div className="app-layout">
        <div>
          <div className="note-list">
            <h3>Demo Notes</h3>
            {DEMO_NOTES.map((n, i) => (
              <div
                key={i}
                className={`note-item ${i === selectedNote ? 'active' : ''}`}
                onClick={() => handleNoteSelect(i)}
              >
                <div className="note-title">{n.title}</div>
                <div className="note-preview">{n.blocks[0]?.content}</div>
              </div>
            ))}
          </div>

          <div className="routing-panel">
            <h4>Routing Decision</h4>
            <div className="routing-result">
              <div><span className="label">Content type: </span><span className="value">{context.contentType}</span></div>
              <div><span className="label">Topics: </span><span className="value">{context.estimatedTopics.join(', ') || 'none'}</span></div>
              <div><span className="label">Blocks: </span><span className="value">{context.blockCount}</span></div>
              <div><span className="label">Links: </span><span className="value">{context.linkCount}</span></div>
              <div style={{ marginTop: 8 }}>
                <span className="label">Selected view: </span>
                <span className="value">{routingResult.view.icon} {routingResult.view.name}</span>
              </div>
              <div>
                <span className="label">Confidence: </span>
                <span className="value" style={{ color: confidenceColor }}>
                  {(routingResult.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="confidence-bar">
                <div className="confidence-fill" style={{
                  width: `${routingResult.confidence * 100}%`,
                  background: confidenceColor,
                }} />
              </div>
              <div><span className="label">Reason: </span><span className="value">{routingResult.reason}</span></div>
              <div><span className="label">Routing time: </span><span className="value">{routingResult.elapsed.toFixed(2)}ms</span></div>
            </div>
          </div>
        </div>

        <div className="view-container">
          <div className="view-selector">
            {viewRegistry.map(v => (
              <button
                key={v.name}
                className={`view-btn ${activeViewName === v.name ? 'active' : ''} ${v.name === routingResult.view.name && activeViewName !== v.name ? 'suggested' : ''}`}
                onClick={() => setOverrideView(v.name)}
              >
                {v.icon} {v.name}
              </button>
            ))}
            <button
              className={`pin-btn ${pinnedView ? 'pinned' : ''}`}
              onClick={() => setPinnedView(pinnedView ? null : activeViewName)}
            >
              {pinnedView ? '📌 Pinned' : '📌 Pin view'}
            </button>
          </div>

          <ActiveView context={context} />
        </div>
      </div>
    </>
  )
}

export default App
