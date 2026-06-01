---
description: Rules for the shared layer (src/shared/**)
globs: src/shared/**
alwaysApply: false
---

# Shared Layer Rules

The `shared/` layer is the foundation of the FSD stack. It must be:
- **Framework-agnostic** where possible (pure functions go in `lib/`, not inside components)
- **Zero upward imports** — `shared` must never import from `features`, `entities`, `widgets`, or `pages`
- **Stable** — treat public exports as an API; renaming is a breaking change

## Sub-directories

| Dir | Purpose | Rules |
|-----|---------|-------|
| `ui/` | Primitive UI components (Button, Input, Modal…) | Accept only primitive props; no business logic |
| `lib/` | Pure utility functions | No side effects; must be unit-testable |
| `api/` | HTTP client config, interceptors, base fetchers | No business-domain types here |
| `config/` | App-wide constants, env wrappers | Read-only; no mutation |

## Exports
- Each sub-directory exposes a single `index.ts` barrel file
- Do not re-export implementation details — only the public surface

## Typing
- All public functions must have explicit return types
- Prefer generic utilities over duplicated code
