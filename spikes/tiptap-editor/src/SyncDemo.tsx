import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'

interface SyncDemoProps {
  doc: Y.Doc
}

export function SyncDemo({ doc }: SyncDemoProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [peerText, setPeerText] = useState('')
  const peerDocRef = useRef<Y.Doc | null>(null)

  useEffect(() => {
    const peerDoc = new Y.Doc()
    peerDocRef.current = peerDoc

    const onUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === 'peer') return
      Y.applyUpdate(peerDoc, update, 'main')
      const ts = new Date().toLocaleTimeString()
      setLogs(prev => [`[${ts}] Synced ${update.byteLength} bytes to peer`, ...prev].slice(0, 50))
    }

    const onPeerUpdate = (update: Uint8Array, origin: unknown) => {
      if (origin === 'main') return
      Y.applyUpdate(doc, update, 'peer')
    }

    doc.on('update', onUpdate)
    peerDoc.on('update', onPeerUpdate)

    const interval = setInterval(() => {
      if (peerDocRef.current) {
        const xml = peerDocRef.current.getXmlFragment('default')
        setPeerText(xml.toString())
      }
    }, 500)

    return () => {
      doc.off('update', onUpdate)
      peerDoc.off('update', onPeerUpdate)
      peerDoc.destroy()
      clearInterval(interval)
    }
  }, [doc])

  return (
    <div className="sync-panel">
      <h3>CRDT Sync Demo (Simulated Peer)</h3>
      <div style={{ fontSize: '13px', marginBottom: 8 }}>
        A second Y.Doc receives every update in real-time, simulating multi-device sync.
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 8 }}>
        Peer document content preview:
      </div>
      <div style={{
        padding: '8px 12px',
        background: 'rgba(0,0,0,0.2)',
        borderRadius: '6px',
        fontSize: '12px',
        fontFamily: 'monospace',
        maxHeight: '80px',
        overflow: 'auto',
        marginBottom: 8,
        wordBreak: 'break-all',
      }}>
        {peerText || '(empty)'}
      </div>
      <div className="sync-log">
        {logs.length === 0 && <div style={{ color: 'var(--text-muted)' }}>Waiting for edits...</div>}
        {logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  )
}
