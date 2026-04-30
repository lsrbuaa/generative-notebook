---
name: component-design
description: Guide React component design following Notebook's patterns - functional components, TypeScript strict, Radix UI primitives, Tailwind CSS, Zustand state. Use when creating new UI components or refactoring existing ones.
---

# Component Design Patterns

## Component Structure

Every component follows this template:

```tsx
// src/components/[component-name].tsx
import { type ComponentProps } from 'react'

interface FeatureNameProps {
  // Explicit, typed props. No `any`.
}

export function FeatureName({ prop1, prop2 }: FeatureNameProps) {
  // hooks at top
  // derived state
  // handlers
  // render
  return (...)
}
```

## Rules

### Naming
- File: `kebab-case.tsx` (e.g., `note-card.tsx`)
- Component: `PascalCase` (e.g., `NoteCard`)
- Hook: `use-kebab-case.ts` → `useKebabCase`
- One component per file. Co-locate types in the same file.

### Composition
- Use Radix UI primitives for interactive elements (Dialog, Dropdown, Tooltip, etc.)
- Wrap Radix with project-specific styling, don't use raw Radix in feature code
- Compose via children/slots, not prop drilling
- Keep components under 150 lines. Extract sub-components if longer.

### Styling
- Tailwind CSS only. No CSS modules, styled-components, or inline styles.
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Design tokens via Tailwind config (colors, spacing, typography)
- Dark mode via Tailwind `dark:` variants

### State
- Local UI state: `useState` / `useReducer`
- Shared client state: Zustand store
- Collaborative state: Yjs (via dedicated hooks)
- Never mix Zustand and Yjs in the same store

### Performance
- Memoize expensive computations with `useMemo`
- Memoize callbacks passed to children with `useCallback`
- Use `React.memo` only when profiling confirms re-render issues
- Virtualize long lists (react-window or @tanstack/virtual)

### Accessibility
- All interactive elements must be keyboard-navigable
- Use semantic HTML (`button`, `nav`, `main`, `aside`)
- Provide `aria-label` for icon-only buttons
- Test with keyboard-only navigation

## Generative UI Components

Components that can be dynamically selected by the AI engine must:

1. Register in the component registry (`src/views/registry.ts`)
2. Export a `metadata` object describing when to use the component:
```tsx
export const metadata = {
  name: 'kanban-view',
  triggers: ['project', 'task', 'todo', 'board'],
  description: 'Kanban board for task management',
  minBlocks: 3,
}
```
3. Accept a standardized `ViewProps` interface
4. Handle loading/empty/error states internally
