# Spike: Generative UI Engine POC

**Issue:** [#3](https://github.com/lsrbuaa/generative-notebook/issues/3)
**Branch:** `spike/generative-ui-poc`
**Status:** Complete

## What's Implemented

- **Context Analyzer**: Extracts content type, detects topics via keyword matching, counts blocks/links
- **Component Registry**: 6 views with scoring functions (editor, kanban, timeline, code-notebook, data-table, research)
- **Fast Local Router**: Heuristic scoring, no LLM needed for ~90% of cases
- **6 Mock Views**: Each note type renders with a completely different UI
- **User Override**: Manual view switching + "Pin view" to lock a view per note
- **Routing Diagnostics**: Real-time content type, topics, confidence, reason, timing

## Demo Notes and Expected Routing

| Note | Expected View | Why |
|------|--------------|-----|
| Sprint 14 Tasks | Kanban | tasks + checkboxes |
| Team Standup | Timeline | meeting keywords |
| Implementing LLM Router | Code Notebook | code blocks |
| Performance Comparison | Data Table | tables |
| CRDT Research Notes | Research | links + research keywords |
| Morning Thoughts | Editor | no strong signals (default) |

## Run

```bash
cd spikes/generative-ui-poc
npm install
npm run dev
# Open http://localhost:5173
```

## Decision

**GO** — Local heuristic routing is fast (<1ms) and accurate for common content patterns. LLM fallback only needed for ambiguous cases.
