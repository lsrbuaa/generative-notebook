import type { NoteBlock, NoteContext } from './types'

const TOPIC_KEYWORDS: Record<string, string[]> = {
  meeting: ['meeting', 'agenda', 'minutes', 'attendee', 'action item', 'decision', 'discuss'],
  project: ['task', 'todo', 'sprint', 'milestone', 'deadline', 'assign', 'priority', 'kanban', 'board'],
  code: ['function', 'const', 'import', 'export', 'class', 'interface', 'api', 'endpoint', 'bug', 'debug'],
  research: ['hypothesis', 'finding', 'source', 'reference', 'citation', 'study', 'paper', 'evidence'],
  journal: ['today', 'yesterday', 'morning', 'evening', 'felt', 'thought', 'reflection', 'grateful'],
  learning: ['lesson', 'concept', 'example', 'practice', 'exercise', 'note', 'summary', 'chapter'],
}

export function analyzeContext(title: string, blocks: NoteBlock[]): NoteContext {
  const hasCodeBlocks = blocks.some(b => b.type === 'codeBlock')
  const hasCheckboxes = blocks.some(b => b.type === 'taskItem')
  const hasTables = blocks.some(b => b.type === 'table')

  const allText = [title, ...blocks.map(b => b.content)].join(' ').toLowerCase()
  const linkCount = (allText.match(/\[\[.*?\]\]/g) || []).length

  const codeBlockRatio = blocks.filter(b => b.type === 'codeBlock').length / Math.max(blocks.length, 1)
  const taskRatio = blocks.filter(b => b.type === 'taskItem').length / Math.max(blocks.length, 1)
  const tableRatio = blocks.filter(b => b.type === 'table').length / Math.max(blocks.length, 1)

  let contentType: NoteContext['contentType'] = 'prose'
  if (codeBlockRatio > 0.3) contentType = 'code'
  else if (taskRatio > 0.4) contentType = 'tasks'
  else if (tableRatio > 0.3) contentType = 'data'
  else if (codeBlockRatio > 0.1 && taskRatio > 0.1) contentType = 'mixed'

  const estimatedTopics: string[] = []
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const hits = keywords.filter(kw => allText.includes(kw)).length
    if (hits >= 2) estimatedTopics.push(topic)
  }

  return {
    title,
    blocks,
    contentType,
    hasCodeBlocks,
    hasCheckboxes,
    hasTables,
    linkCount,
    blockCount: blocks.length,
    estimatedTopics,
  }
}
