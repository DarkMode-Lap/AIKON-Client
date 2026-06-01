# /plan — Implementation Plan

Before writing any code, produce a structured plan for the requested change.
Invoke this for any non-trivial task (new feature, refactor, new page, new API integration).

## Steps

1. **Understand the requirement** — restate the task in one sentence to confirm understanding.
2. **Audit the affected area** — read the relevant files; list every file that will change.
3. **Identify risks** — flag anything that could break existing behavior (routing, shared types, state).
4. **Produce the plan** in this format:

---

### Goal
One sentence describing what the change achieves.

### Files to change
| File | Action | Reason |
|------|--------|--------|
| `src/pages/foo/index.tsx` | create | new route |
| `src/shared/lib/bar.ts` | edit | add util |

### Steps
1. Step one (what, not how)
2. Step two
3. …

### Risks & assumptions
- Risk 1
- Assumption 1

### Out of scope
- What this plan deliberately does NOT cover

---

5. **Ask for confirmation** before writing a single line of code.
   - If the user confirms, proceed with implementation.
   - If the user requests changes, update the plan and re-confirm.

## Rules
- Do NOT start implementing until the user explicitly approves the plan.
- Keep the plan in the conversation; do not write it to a file unless the user asks.
- If the plan requires a decision the user must make (e.g., which state management approach), ask first.
