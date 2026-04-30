export interface NoteBlock {
  type: 'heading' | 'paragraph' | 'codeBlock' | 'taskItem' | 'table' | 'blockquote' | 'image' | 'callout' | 'list'
  content: string
  attrs?: Record<string, unknown>
}

export interface NoteContext {
  title: string
  blocks: NoteBlock[]
  contentType: 'prose' | 'code' | 'tasks' | 'data' | 'mixed'
  hasCodeBlocks: boolean
  hasCheckboxes: boolean
  hasTables: boolean
  linkCount: number
  blockCount: number
  estimatedTopics: string[]
}

export interface ViewSelection {
  view: string
  layout: 'main' | 'sidebar' | 'overlay'
  confidence: number
  reason: string
}

export interface ViewComponent {
  name: string
  description: string
  triggers: string[]
  icon: string
  match: (ctx: NoteContext) => number
}
