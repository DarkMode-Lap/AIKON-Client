---
description: Rules for page-level components (src/pages/**)
globs: src/pages/**
alwaysApply: false
---

# Pages Layer Rules

Pages are the top of the FSD hierarchy — they compose widgets and features into a full screen.

## Responsibilities
- Owns the route-level layout and data-fetching orchestration
- Should be thin: delegate UI to widgets, business logic to features/entities
- Target under 80 lines; if longer, extract a widget

## Imports allowed
- `@/widgets/**`, `@/features/**`, `@/entities/**`, `@/shared/**`
- Never import from another page (`@/pages/**`)

## Routing
- One file per route segment inside `src/pages/<route-name>/index.tsx`
- Lazy-load heavy pages with `React.lazy` + `Suspense`
- Handle 404 and error states within the page, not in the router

## Data
- Fetch data at the page level, pass down as props
- Use React Router `loader` for data that must be available before render
