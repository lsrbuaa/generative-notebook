import { Node, mergeAttributes } from '@tiptap/core'
import { inputRegex } from './input-helpers'

export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return {
      type: { default: 'info' },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-type="callout"]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-type': 'callout',
        class: 'callout',
      }),
      0,
    ]
  },

  addInputRules() {
    return [
      inputRegex(/^:::\s$/, this.type),
    ]
  },
})
