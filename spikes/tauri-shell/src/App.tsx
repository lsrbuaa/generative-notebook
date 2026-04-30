import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import './index.css'

interface AppInfo {
  name: string
  version: string
  platform: string
  rust_version: string
}

function App() {
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [pingResult, setPingResult] = useState('')
  const [benchResults, setBenchResults] = useState<{ avg: number; min: number; max: number; count: number } | null>(null)
  const [ipcLogs, setIpcLogs] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  const log = (msg: string) => setIpcLogs(prev => [msg, ...prev].slice(0, 100))

  const fetchAppInfo = async () => {
    const start = performance.now()
    const info = await invoke<AppInfo>('get_app_info')
    const elapsed = performance.now() - start
    setAppInfo(info)
    log(`get_app_info: ${elapsed.toFixed(2)}ms`)
  }

  const doPing = async () => {
    const start = performance.now()
    const result = await invoke<string>('ping', { message: `hello from JS at ${new Date().toISOString()}` })
    const elapsed = performance.now() - start
    setPingResult(result)
    log(`ping round-trip: ${elapsed.toFixed(2)}ms`)
  }

  const runBenchmark = async () => {
    setRunning(true)
    const iterations = 100
    const times: number[] = []

    for (let i = 0; i < iterations; i++) {
      const start = performance.now()
      await invoke<string>('ping', { message: `bench-${i}` })
      times.push(performance.now() - start)
    }

    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const min = Math.min(...times)
    const max = Math.max(...times)

    setBenchResults({ avg, min, max, count: iterations })
    log(`Benchmark: ${iterations} calls, avg=${avg.toFixed(2)}ms, min=${min.toFixed(2)}ms, max=${max.toFixed(2)}ms`)
    setRunning(false)
  }

  const testSaveLoad = async () => {
    const start = performance.now()
    const saveResult = await invoke<string>('save_data', { key: 'test-note', value: 'Hello from Generative Notebook!' })
    const saveDur = performance.now() - start

    const start2 = performance.now()
    const loadResult = await invoke<string>('load_data', { key: 'test-note' })
    const loadDur = performance.now() - start2

    log(`save_data: ${saveDur.toFixed(2)}ms — ${saveResult}`)
    log(`load_data: ${loadDur.toFixed(2)}ms — ${loadResult}`)
  }

  return (
    <>
      <div className="spike-header">
        <h1>Tauri 2.0 Desktop Shell POC</h1>
        <p>Spike #4 — Desktop app with Rust backend IPC</p>
        <span className="badge">Phase 0: Technical Validation</span>
      </div>

      <div className="card">
        <h3>App Info</h3>
        <button className="btn" onClick={fetchAppInfo}>Fetch App Info (IPC)</button>
        {appInfo && (
          <div className="info-grid" style={{ marginTop: 12 }}>
            <span className="label">Name:</span><span>{appInfo.name}</span>
            <span className="label">Version:</span><span>{appInfo.version}</span>
            <span className="label">Platform:</span><span>{appInfo.platform}</span>
            <span className="label">Rust:</span><span>{appInfo.rust_version}</span>
          </div>
        )}
      </div>

      <div className="card">
        <h3>IPC Ping Test</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={doPing}>Ping</button>
          <button className="btn" onClick={testSaveLoad}>Test Save/Load</button>
        </div>
        {pingResult && <div className="result">{pingResult}</div>}
      </div>

      <div className="card">
        <h3>IPC Benchmark (100 round-trips)</h3>
        <button className="btn" onClick={runBenchmark} disabled={running}>
          {running ? 'Running...' : 'Run Benchmark'}
        </button>
        {benchResults && (
          <div className="metrics">
            <div className="metric">
              <div className={`value ${benchResults.avg < 5 ? 'pass' : ''}`}>
                {benchResults.avg.toFixed(2)}ms
              </div>
              <div className="label">Average (target: &lt;5ms)</div>
            </div>
            <div className="metric">
              <div className="value pass">{benchResults.min.toFixed(2)}ms</div>
              <div className="label">Minimum</div>
            </div>
            <div className="metric">
              <div className="value">{benchResults.max.toFixed(2)}ms</div>
              <div className="label">Maximum</div>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>IPC Log</h3>
        <div className="log">
          {ipcLogs.length === 0 && <div style={{ color: 'var(--text-muted)' }}>Click buttons above to test IPC...</div>}
          {ipcLogs.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </>
  )
}

export default App
