---
name: generative-ui
description: Guide Generative UI engine development - context analysis, LLM intent routing, dynamic component selection, and streaming UI rendering. Use when building AI-driven UI generation, component routing, or adaptive interface features.
---

# Generative UI Engine

## Architecture

```
User Action / Content Change
         │
         ▼
┌─────────────────┐
│ Context Analyzer │  Extracts: content type, structure, user intent
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Intent Router   │  LLM decides: which UI components best serve this context
│  (Claude API)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Component Picker │  Selects from registry, composes layout
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Streaming Render │  Progressive UI generation
└─────────────────┘
```

## Component Registry

```typescript
// src/ai/registry.ts
interface ViewComponent {
  name: string
  description: string           // LLM reads this to decide when to use
  triggers: string[]            // keywords that suggest this view
  component: React.ComponentType<ViewProps>
  minBlocks?: number            // minimum blocks to activate
  contentTypes?: string[]       // content types this handles
}

const registry: ViewComponent[] = [
  {
    name: 'kanban-view',
    description: 'Task board with draggable columns. Best for project management, todos, and workflow tracking.',
    triggers: ['task', 'todo', 'project', 'sprint', 'board', 'kanban'],
    component: KanbanView,
    minBlocks: 3,
    contentTypes: ['task-list', 'checklist'],
  },
  {
    name: 'timeline-view',
    description: 'Chronological timeline. Best for meeting notes, event planning, and historical records.',
    triggers: ['meeting', 'event', 'schedule', 'timeline', 'history'],
    component: TimelineView,
    contentTypes: ['dated-content'],
  },
  // ... more views
]
```

## Context Analyzer

```typescript
// src/ai/context-analyzer.ts
interface NoteContext {
  contentType: 'prose' | 'code' | 'tasks' | 'data' | 'mixed'
  hasCodeBlocks: boolean
  hasCheckboxes: boolean
  hasTables: boolean
  hasLinks: number
  blockCount: number
  estimatedTopic: string[]     // extracted from title + first paragraph
  timeContext: 'morning' | 'afternoon' | 'evening'
  recentViews: string[]        // what views user has used recently
}

function analyzeContext(doc: Y.Doc, userPrefs: UserPrefs): NoteContext {
  // Fast, local analysis — no LLM call needed
  // Run on every significant content change (debounced 500ms)
}
```

## Intent Router (LLM)

```typescript
// src/ai/intent-router.ts
async function routeToView(
  context: NoteContext,
  registry: ViewComponent[],
): Promise<ViewSelection> {
  
  // Step 1: Fast local matching (no LLM needed for obvious cases)
  const localMatch = fastMatch(context, registry)
  if (localMatch.confidence > 0.9) return localMatch
  
  // Step 2: LLM routing for ambiguous cases
  const response = await claude.messages.create({
    model: 'claude-sonnet-4-6',  // Fast model for routing
    max_tokens: 200,
    system: `You are a UI router. Given note context and available views, 
             select the best view. Respond with JSON only.`,
    messages: [{
      role: 'user',
      content: `Context: ${JSON.stringify(context)}
                Available views: ${registry.map(v => `${v.name}: ${v.description}`).join('\n')}
                Select the best view. Output: {"view": "name", "layout": "sidebar|overlay|replace", "confidence": 0.0-1.0}`
    }]
  })
  
  return parseViewSelection(response)
}
```

## Key Principles

### 1. Fast Path First
- Most UI decisions can be made locally (regex, heuristics)
- Only call LLM for genuinely ambiguous cases
- Cache LLM routing decisions per content-type pattern
- Target: < 50ms for local routing, < 2s for LLM routing

### 2. User Override Always Wins
- AI suggests, user decides. Never force a view switch.
- Provide "pin this view" to disable auto-switching for a note
- Remember user overrides per note and per content pattern
- Show a subtle indicator when AI suggests a different view

### 3. Progressive Enhancement
- Default view is always the standard editor (works without AI)
- Generative views are enhancements, not replacements
- If AI routing fails, fall back to default — never show errors

### 4. Privacy by Design
- Context analysis is 100% local (no data leaves device)
- LLM routing sends only structural metadata, never content text
- User can disable all AI features and still have a fully functional editor

### 5. Streaming Render
```typescript
// Use async generators for progressive UI rendering
async function* renderView(selection: ViewSelection, data: BlockData[]) {
  yield <ViewSkeleton layout={selection.layout} />  // Instant skeleton
  
  const component = registry.find(v => v.name === selection.view)
  const prepared = await prepareData(data, component)
  
  yield <component.component data={prepared} />      // Full render
}
```

## Testing Generative UI

- Test context analyzer: known inputs → expected content types
- Test fast matching: obvious cases never call LLM
- Test LLM routing: mock LLM responses, verify view selection
- Test fallback: when LLM fails, default view renders correctly
- Test user override: pinned views persist across sessions
