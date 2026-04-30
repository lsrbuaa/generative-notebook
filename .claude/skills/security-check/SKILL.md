---
name: security-check
description: Security review for data sovereignty, AI privacy, XSS prevention, IPC safety, and OWASP compliance. Use when handling user data, making network requests, implementing AI features, processing embedded content, or reviewing security-sensitive code.
---

# Security Check

## Notebook Security Model

**Core Promise:** User data never leaves the device without explicit consent.

```
┌─────────────────────────────────────────────────┐
│                 Trust Boundary                    │
│                                                   │
│  ┌─────────┐   ┌─────────┐   ┌──────────────┐  │
│  │ SQLite   │   │ CRDT    │   │ Local AI     │  │
│  │ (local)  │   │ (Yjs)   │   │ (Ollama)     │  │
│  └─────────┘   └─────────┘   └──────────────┘  │
│                                                   │
│      Everything above: TRUSTED, no consent needed │
├─────────────────────────────────────────────────┤
│      Everything below: UNTRUSTED, consent needed  │
│                                                   │
│  ┌─────────┐   ┌─────────┐   ┌──────────────┐  │
│  │ Sync    │   │ Cloud   │   │ External AI  │  │
│  │ Server  │   │ Publish │   │ (Claude API) │  │
│  └─────────┘   └─────────┘   └──────────────┘  │
└─────────────────────────────────────────────────┘
```

## Security Checklist

### 1. Data Sovereignty
- [ ] User note content stored only in local SQLite
- [ ] No telemetry includes note content or titles
- [ ] Export produces files the user fully controls
- [ ] Sync is opt-in, with clear data destination disclosure
- [ ] Deleted data is actually removed (not just hidden) after retention period

### 2. AI Privacy
- [ ] AI features have explicit opt-in toggle
- [ ] When using external AI (Claude API), user sees what data is sent
- [ ] Context sent to AI is minimal: structure/metadata, not full content, when possible
- [ ] AI routing decisions logged locally for user transparency
- [ ] Local AI (Ollama) is the default; cloud AI requires opt-in

### 3. XSS / Content Injection
- [ ] Embedded HTML blocks sanitized with DOMPurify
- [ ] User-generated `<iframe>` sandboxed with restrictive CSP
- [ ] Markdown rendering escapes HTML by default
- [ ] Link previews fetch via Rust backend (not WebView) to avoid SSRF
- [ ] No `dangerouslySetInnerHTML` without sanitization

### 4. Tauri IPC Security
- [ ] All Tauri command inputs validated on Rust side (not just TypeScript)
- [ ] File system access scoped to allowed directories only
- [ ] No shell command execution from frontend
- [ ] Tauri allowlist configured minimally (only needed APIs)
- [ ] CSP header set in `tauri.conf.json`

### 5. Dependencies
- [ ] No known vulnerabilities (`npm audit`, `cargo audit`)
- [ ] Lockfile committed and up-to-date
- [ ] No dependencies with excessive permissions
- [ ] Minimize native dependencies (smaller attack surface)

### 6. Authentication & Sync
- [ ] Sync tokens stored in OS keychain (not localStorage/file)
- [ ] HTTPS enforced for all network communication
- [ ] Sync server authenticated (token-based, not session cookies)
- [ ] Rate limiting on sync endpoints
- [ ] CRDT updates validated on server (no arbitrary blob injection)

## Output Format

```
## Security Review: [Feature/Module]

**Risk Level:** LOW / MEDIUM / HIGH / CRITICAL

### Findings

#### 🔴 Critical (must fix immediately)
- [file:line] [vulnerability] [impact] [fix]

#### 🟡 Medium (fix before release)
- [file:line] [vulnerability] [impact] [fix]

#### 🟢 Info (consider for hardening)
- [file:line] [observation] [recommendation]

### Data Flow
[Describe where user data goes in this feature]

### Trust Boundary Crossings
[List any points where data crosses the trust boundary]
```
