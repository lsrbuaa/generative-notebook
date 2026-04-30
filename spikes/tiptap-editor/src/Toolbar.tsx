import { type Editor } from '@tiptap/react'

interface ToolbarProps {
  editor: Editor | null
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null

  const btn = (
    label: string,
    action: () => void,
    isActive?: boolean,
  ) => (
    <button
      type="button"
      onClick={action}
      className={isActive ? 'is-active' : ''}
    >
      {label}
    </button>
  )

  return (
    <div className="toolbar">
      {btn('H1', () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        editor.isActive('heading', { level: 1 }))}
      {btn('H2', () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        editor.isActive('heading', { level: 2 }))}
      {btn('H3', () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        editor.isActive('heading', { level: 3 }))}

      <div className="separator" />

      {btn('B', () => editor.chain().focus().toggleBold().run(),
        editor.isActive('bold'))}
      {btn('I', () => editor.chain().focus().toggleItalic().run(),
        editor.isActive('italic'))}
      {btn('S', () => editor.chain().focus().toggleStrike().run(),
        editor.isActive('strike'))}
      {btn('Code', () => editor.chain().focus().toggleCode().run(),
        editor.isActive('code'))}

      <div className="separator" />

      {btn('• List', () => editor.chain().focus().toggleBulletList().run(),
        editor.isActive('bulletList'))}
      {btn('1. List', () => editor.chain().focus().toggleOrderedList().run(),
        editor.isActive('orderedList'))}
      {btn('☑ Tasks', () => editor.chain().focus().toggleTaskList().run(),
        editor.isActive('taskList'))}

      <div className="separator" />

      {btn('Quote', () => editor.chain().focus().toggleBlockquote().run(),
        editor.isActive('blockquote'))}
      {btn('Code Block', () => editor.chain().focus().toggleCodeBlock().run(),
        editor.isActive('codeBlock'))}
      {btn('Table', () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run())}
      {btn('—', () => editor.chain().focus().setHorizontalRule().run())}
    </div>
  )
}
