# Spike: Tauri 2.0 Desktop Shell POC

**Issue:** [#4](https://github.com/lsrbuaa/generative-notebook/issues/4)
**Branch:** `spike/tauri-shell`
**Status:** In Progress

## What's Implemented

- **Tauri 2.0** desktop app with React + Vite frontend
- **Rust IPC commands**: get_app_info, ping, benchmark_ipc, save_data, load_data
- **IPC benchmark UI**: measure round-trip latency across 100 invocations
- **App info panel**: displays Rust backend info via IPC
- **Save/Load test**: mock data operations through Tauri commands

## Run

```bash
cd spikes/tauri-shell
npm install
npx tauri dev    # Launches desktop app with hot reload
```

### Prerequisites

- Node.js >= 20.0.0
- Rust >= 1.77.2 (via rustup)

## Test Checklist

- [ ] `npx tauri dev` launches a desktop window
- [ ] "Fetch App Info" returns data from Rust backend
- [ ] "Ping" returns pong response with round-trip time
- [ ] "Test Save/Load" shows mock save/load results
- [ ] "Run Benchmark" completes 100 IPC calls, avg < 5ms
