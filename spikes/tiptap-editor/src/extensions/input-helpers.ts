import { InputRule, type NodeType } from '@tiptap/core'

export function inputRegex(regexp: RegExp, type: NodeType) {
  return new InputRule({
    find: regexp,
    handler: ({ state, range }) => {
      const { tr } = state
      tr.delete(range.from, range.to)
      tr.replaceSelectionWith(type.create())
    },
  })
}
