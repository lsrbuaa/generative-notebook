---
name: tech-spike
description: Guide structured technical spikes and POC experiments. Use when prototyping, evaluating libraries, testing feasibility, or running proof-of-concept experiments.
---

# Tech Spike Guide

Structure a technical spike to validate assumptions before committing to implementation.

## Spike Template

When starting a tech spike, follow this structure:

### 1. Define the Hypothesis
```
We believe [technology/approach] will [expected outcome]
for [specific use case] because [reasoning].
```

### 2. Success Criteria (before coding)
Define measurable, binary pass/fail criteria:
- Performance: "renders 1000 blocks in < 100ms"
- Compatibility: "works with Yjs Y.Doc without conflicts"
- Bundle size: "adds < 500KB to final bundle"
- DX: "extension API requires < 30 lines for a new block type"

### 3. Experiment Scope
- **Time-box:** Max 4 hours for initial spike
- **Isolation:** Create in `spikes/[spike-name]/` directory (not in src/)
- **Minimal:** Test only the hypothesis. No production code quality needed.
- **Document:** Record what you tried and what happened.

### 4. Spike Structure
```
spikes/
  [spike-name]/
    README.md        ← Hypothesis, criteria, findings
    src/             ← Minimal experiment code
    package.json     ← Isolated dependencies
```

### 5. Decision Record
After the spike, produce:

```markdown
## Spike: [Name]
**Date:** [date]
**Duration:** [hours spent]
**Hypothesis:** [what we tested]

### Results
| Criterion | Target | Actual | Pass? |
|-----------|--------|--------|-------|
| ...       | ...    | ...    | ✅/❌ |

### Key Findings
- [What worked]
- [What didn't]
- [Surprises]

### Decision
**GO / NO-GO / NEEDS MORE RESEARCH**
[Reasoning and next steps]
```

## Common Notebook Spike Areas
- TipTap block editor performance with 10K+ blocks
- Yjs CRDT sync over WebSocket with conflict scenarios
- SQLite FTS5 search latency at scale
- Tauri IPC throughput for real-time editor operations
- LLM response time for UI component selection
- Local embedding model (Ollama) quality for semantic search
