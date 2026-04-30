import type { NoteBlock } from './engine/types'

interface DemoNote {
  title: string
  blocks: NoteBlock[]
}

export const DEMO_NOTES: DemoNote[] = [
  {
    title: 'Sprint 14 Tasks',
    blocks: [
      { type: 'heading', content: 'Sprint 14 — Week of May 5' },
      { type: 'paragraph', content: 'Sprint goal: Complete the editor MVP and deploy to staging.' },
      { type: 'taskItem', content: 'Implement block drag-and-drop reordering' },
      { type: 'taskItem', content: 'Add keyboard shortcuts for all block types' },
      { type: 'taskItem', content: 'Fix table cell selection bug' },
      { type: 'taskItem', content: 'Write integration tests for editor' },
      { type: 'taskItem', content: 'Deploy to staging environment' },
      { type: 'taskItem', content: 'Update project board with progress' },
      { type: 'taskItem', content: 'Schedule sprint review meeting' },
      { type: 'paragraph', content: 'Deadline: Friday EOD. Priority: editor stability over new features.' },
    ],
  },
  {
    title: 'Team Standup — Monday May 5',
    blocks: [
      { type: 'heading', content: 'Daily Standup Minutes' },
      { type: 'paragraph', content: 'Attendees: Alice, Bob, Carol, Dave. Meeting started at 9:30am.' },
      { type: 'heading', content: 'Discussion Points' },
      { type: 'paragraph', content: 'Alice: Finished the CRDT sync layer. Action item: write documentation by Wednesday.' },
      { type: 'paragraph', content: 'Bob: Working on the Generative UI router. Decision: use local heuristics first, LLM as fallback.' },
      { type: 'paragraph', content: 'Carol: Found a bug in table rendering. Will discuss with Dave after standup.' },
      { type: 'paragraph', content: 'Dave: Tauri IPC benchmarks complete. Action item: share results in #engineering channel.' },
      { type: 'heading', content: 'Action Items' },
      { type: 'taskItem', content: 'Alice: Write CRDT sync documentation' },
      { type: 'taskItem', content: 'Dave: Share IPC benchmark results' },
    ],
  },
  {
    title: 'Implementing the LLM Router',
    blocks: [
      { type: 'heading', content: 'Generative UI: LLM Router Architecture' },
      { type: 'paragraph', content: 'The router decides which UI view to render based on note content context.' },
      { type: 'codeBlock', content: 'interface ViewSelection {\n  view: string\n  layout: "main" | "sidebar" | "overlay"\n  confidence: number\n}' },
      { type: 'paragraph', content: 'We use a two-phase approach: fast local matching first, then LLM fallback for ambiguous cases.' },
      { type: 'codeBlock', content: 'async function routeToView(ctx: NoteContext) {\n  const local = fastMatch(ctx)\n  if (local.confidence > 0.9) return local\n  return await llmRoute(ctx)\n}' },
      { type: 'paragraph', content: 'The local matcher uses keyword triggers and content type ratios. It handles ~90% of cases without any API call.' },
      { type: 'codeBlock', content: 'function fastMatch(ctx: NoteContext): ViewSelection {\n  const scored = registry.map(v => ({\n    view: v,\n    score: v.match(ctx)\n  }))\n  return scored.sort((a, b) => b.score - a.score)[0]\n}' },
      { type: 'paragraph', content: 'For the remaining 10%, we send structural metadata (never content) to the LLM for routing.' },
    ],
  },
  {
    title: 'Performance Comparison Data',
    blocks: [
      { type: 'heading', content: 'Benchmark: Editor Frameworks' },
      { type: 'table', content: 'Framework | Bundle Size | Input Latency | Collab Support' },
      { type: 'table', content: 'TipTap | 45KB | 8ms | Yjs native' },
      { type: 'table', content: 'Slate | 55KB | 12ms | Custom only' },
      { type: 'table', content: 'Lexical | 30KB | 6ms | Experimental' },
      { type: 'table', content: 'ProseMirror | 40KB | 7ms | y-prosemirror' },
      { type: 'paragraph', content: 'TipTap chosen for best balance of features, ecosystem, and Yjs integration.' },
      { type: 'heading', content: 'Storage Benchmarks' },
      { type: 'table', content: 'Operation | SQLite | IndexedDB | File System' },
      { type: 'table', content: 'Save Y.Doc | 0.46ms | 3.2ms | 8.1ms' },
      { type: 'table', content: 'Load Y.Doc | 0.43ms | 2.8ms | 5.4ms' },
      { type: 'table', content: 'FTS Search | 0.29ms | N/A | N/A' },
    ],
  },
  {
    title: 'CRDT Research Notes',
    blocks: [
      { type: 'heading', content: 'Conflict-Free Replicated Data Types' },
      { type: 'paragraph', content: 'Research into CRDT algorithms for the sync layer. Sources: [[Martin Kleppmann]], [[Yjs paper]].' },
      { type: 'paragraph', content: 'Key finding: Yjs uses a YATA algorithm that achieves O(n) complexity for most operations.' },
      { type: 'paragraph', content: 'Reference: "Near Real-Time Peer-to-Peer Shared Editing on Extensible Data Types" — [[Yjs paper]]' },
      { type: 'paragraph', content: 'Evidence suggests Yjs outperforms Automerge for text-heavy documents. See [[benchmark study]].' },
      { type: 'heading', content: 'Study: Convergence Properties' },
      { type: 'paragraph', content: 'Hypothesis: Yjs converges correctly for all interleaving patterns of concurrent operations.' },
      { type: 'paragraph', content: 'Finding: Confirmed via our spike test — two offline devices produce identical state after merge.' },
      { type: 'paragraph', content: 'Source: Our own spike/sqlite-yjs test results.' },
    ],
  },
  {
    title: 'Morning Thoughts',
    blocks: [
      { type: 'heading', content: 'May 5, 2026 — Monday' },
      { type: 'paragraph', content: 'Today I want to focus on getting the Generative UI engine working. Felt energized after the weekend.' },
      { type: 'paragraph', content: 'Had a thought about the routing algorithm: what if we cache routing decisions per content fingerprint?' },
      { type: 'paragraph', content: 'Reflection: the local-first approach is paying off. Everything feels instant compared to Notion.' },
      { type: 'paragraph', content: 'Grateful for the progress this week. The CRDT spike results exceeded expectations.' },
    ],
  },
]
