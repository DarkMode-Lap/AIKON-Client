---
description: Rules for all React component files (*.tsx)
globs: src/**/*.tsx
alwaysApply: false
---

# React Component Rules

## Structure
- One component per file, filename matches the component name in PascalCase
- Export the component as a named export; default export is allowed only for pages
- Props interface goes directly above the component, named `<ComponentName>Props`
- Keep the component under 150 lines — extract logic into a custom hook if longer

## Typing
- Always type props explicitly; never use `React.FC` (it hides children typing issues)
- Use `React.ReactNode` for children, `React.MouseEvent<HTMLButtonElement>` for events
- Never use `any`; use `unknown` + type guard or a proper interface

## Styling
- Tailwind classes only — no inline `style={{}}` objects
- Conditional classes: use template literals or `clsx` — never string concatenation
- Dark mode classes use the `dark:` prefix

## Hooks
- Call hooks at the top of the component, before any early returns
- Extract more than 3 related state/effect pairs into a `use<Name>.ts` custom hook
- `useEffect` must have a dependency array; explain any empty `[]` with a comment

## Performance
- Memoize with `useMemo`/`useCallback` only when profiling shows a problem — not preemptively
- Wrap heavy list items in `React.memo` only if the parent re-renders frequently
