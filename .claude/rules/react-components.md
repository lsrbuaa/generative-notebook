---
paths:
  - "src/components/**/*.tsx"
  - "src/components/**/*.ts"
  - "src/views/**/*.tsx"
---

# React Component Rules

- Functional components only. No class components.
- TypeScript strict: no `any` types. Define explicit Props interfaces.
- File naming: `kebab-case.tsx`. Component naming: `PascalCase`.
- One component per file. Co-locate types in the same file.
- Max 150 lines per component. Extract sub-components if longer.
- Styling: Tailwind CSS only. Use `cn()` (clsx + tailwind-merge) for conditionals.
- Primitives: Use Radix UI for interactive elements (Dialog, Dropdown, Tooltip).
- State: `useState`/`useReducer` for local, Zustand for shared, Yjs for collaborative. Never mix Zustand and Yjs.
- Performance: virtualize lists > 50 items. `useMemo` for expensive computations.
- Accessibility: semantic HTML, keyboard navigation, `aria-label` for icon buttons.
- Generative UI components must export a `metadata` object and register in `src/views/registry.ts`.
