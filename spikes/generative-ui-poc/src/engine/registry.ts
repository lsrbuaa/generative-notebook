import type { NoteContext, ViewComponent } from './types'

export const viewRegistry: ViewComponent[] = [
  {
    name: 'editor',
    description: 'Default rich text editor for general notes and prose writing',
    triggers: ['note', 'write', 'draft', 'essay'],
    icon: '📝',
    match: () => 0.3,
  },
  {
    name: 'kanban',
    description: 'Kanban board for task management, project tracking, and workflow visualization',
    triggers: ['task', 'todo', 'project', 'sprint', 'board', 'kanban'],
    icon: '📋',
    match: (ctx: NoteContext) => {
      let score = 0
      if (ctx.hasCheckboxes) score += 0.4
      if (ctx.contentType === 'tasks') score += 0.3
      if (ctx.estimatedTopics.includes('project')) score += 0.2
      if (ctx.title.toLowerCase().match(/task|todo|project|sprint|board/)) score += 0.2
      return Math.min(score, 1)
    },
  },
  {
    name: 'timeline',
    description: 'Chronological timeline for meetings, events, and historical records',
    triggers: ['meeting', 'event', 'schedule', 'timeline', 'history', 'minutes'],
    icon: '📅',
    match: (ctx: NoteContext) => {
      let score = 0
      if (ctx.estimatedTopics.includes('meeting')) score += 0.5
      if (ctx.title.toLowerCase().match(/meeting|event|schedule|agenda/)) score += 0.3
      if (ctx.estimatedTopics.includes('journal')) score += 0.2
      return Math.min(score, 1)
    },
  },
  {
    name: 'code-notebook',
    description: 'Code-focused view with syntax highlighting and documentation sidebar',
    triggers: ['code', 'programming', 'api', 'function', 'debug'],
    icon: '💻',
    match: (ctx: NoteContext) => {
      let score = 0
      if (ctx.hasCodeBlocks) score += 0.3
      if (ctx.contentType === 'code') score += 0.4
      if (ctx.estimatedTopics.includes('code')) score += 0.2
      if (ctx.title.toLowerCase().match(/code|api|function|debug|impl/)) score += 0.2
      return Math.min(score, 1)
    },
  },
  {
    name: 'data-table',
    description: 'Structured data view with sortable tables and filters',
    triggers: ['data', 'table', 'spreadsheet', 'comparison', 'matrix'],
    icon: '📊',
    match: (ctx: NoteContext) => {
      let score = 0
      if (ctx.hasTables) score += 0.5
      if (ctx.contentType === 'data') score += 0.3
      if (ctx.title.toLowerCase().match(/data|table|comparison|matrix/)) score += 0.2
      return Math.min(score, 1)
    },
  },
  {
    name: 'research',
    description: 'Research view with citations, sources panel, and linked references',
    triggers: ['research', 'study', 'paper', 'source', 'reference', 'finding'],
    icon: '🔬',
    match: (ctx: NoteContext) => {
      let score = 0
      if (ctx.estimatedTopics.includes('research')) score += 0.4
      if (ctx.linkCount > 3) score += 0.3
      if (ctx.title.toLowerCase().match(/research|study|paper|analysis/)) score += 0.3
      return Math.min(score, 1)
    },
  },
]

export function routeToView(ctx: NoteContext): { view: ViewComponent; confidence: number; reason: string } {
  const scored = viewRegistry.map(view => ({
    view,
    score: view.match(ctx),
  })).sort((a, b) => b.score - a.score)

  const best = scored[0]
  const runner = scored[1]
  const gap = best.score - runner.score

  let reason: string
  if (best.score >= 0.7) {
    reason = `Strong match: content is clearly ${best.view.name}-oriented`
  } else if (best.score >= 0.5) {
    reason = `Moderate match based on ${ctx.contentType} content type and topic signals`
  } else if (gap < 0.1 && best.score > 0.3) {
    reason = `Ambiguous — close scores between ${best.view.name} and ${runner.view.name}. Would benefit from LLM routing.`
  } else {
    reason = 'Defaulting to editor — no strong signals detected'
  }

  return {
    view: best.view,
    confidence: best.score,
    reason,
  }
}
