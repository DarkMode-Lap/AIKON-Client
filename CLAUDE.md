# AIKON-Client

React + TypeScript + Vite frontend for the AIKON project, maintained by DarkMode-Lap.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Bundler | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion 12 |
| HTTP Client | Axios |
| Linting | ESLint 10 + typescript-eslint |
| Formatting | Prettier 3 |

## Dev Commands

```bash
npm run dev          # start dev server
npm run build        # type-check + build
npm run typecheck    # tsc --noEmit only
npm run lint         # run ESLint
npm run lint:fix     # auto-fix ESLint errors
npm run format       # run Prettier (write)
npm run format:check # run Prettier (check only)
```

## Workflow

Every task follows this loop — do not skip steps:

1. **Plan** — state what you will change and why before touching any file
2. **Implement** — make the smallest change that satisfies the requirement
3. **Self-review** — re-read every changed file; catch typos, unused imports, type errors
4. **Verify** — run `npm run typecheck && npm run lint` before declaring done
5. **Commit** — use `/commit` for a conventional commit message

For non-trivial changes (new page, refactor, new feature), use `/plan` first.

## Folder Structure (FSD)

```
src/
  app/         # app shell — router, global styles, providers
  pages/       # page-level components mapped to routes
  widgets/     # composite UI blocks (composed of features/entities)
  features/    # user-facing interactions (forms, toggles, flows)
  entities/    # business objects and their UI (user, post, …)
  shared/      # reusable primitives — ui/, lib/, api/, config/
```

Path alias `@` maps to `src/` (configured in vite.config.ts and tsconfig).
Each layer may only import from layers below it (pages → widgets → features → entities → shared).

## Code Conventions

- No semicolons, single quotes, trailing commas — Prettier enforces this automatically
- Print width 100, tab width 2, LF line endings
- Component files: PascalCase (`QrScanner.tsx`), one component per file
- Non-component files: camelCase (`useCamera.ts`, `formatDate.ts`)
- Keep components under 150 lines; extract logic into custom hooks
- Keep functions under 30 lines; extract helpers if longer
- Unused vars must be prefixed with `_`

## Prohibitions

Never do any of the following:

- **No `any`** — use `unknown` and narrow, or define a proper type
- **No `// @ts-ignore` or `// @ts-expect-error`** without a comment explaining why
- **No `console.log`** in committed code — use a proper logger or remove before commit
- **No direct DOM manipulation** — use React refs and state
- **No inline styles** — use Tailwind classes only
- **No cross-layer imports in FSD** — e.g., `features` must not import from `pages`
- **No committing to `main` or `develop`** — always use a feature branch + PR
- **No PRs to `main`** — every PR targets `develop`; `main` is updated only by a maintainer's release PR
- **No skipping CI gates** — do not use `--no-verify` or bypass lint/typecheck

## Commit Convention (Conventional Commits)

```
<type>: <한국어 요약, 72자 이내>

Types: feat | fix | chore | ci | docs | refactor | test | style | perf | revert
```

- No scope — do not use `(<scope>)`.
- Summary in **Korean**, no trailing period.

Examples:
- `feat: QR 코드 스캔 페이지 추가`
- `fix: 404 페이지 리다이렉트 루프 수정`
- `chore: 의존성 업데이트`

Use `/commit` to generate the message automatically.

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main` and `develop`:

1. **Lint & Type Check** — `typecheck` → `lint` → `format:check`
2. **Build** — `npm run build`, uploads `dist/` as artifact (7-day retention)

CI must pass before merging. Run `npm run typecheck && npm run lint && npm run format:check` locally before pushing.

## Branch Protection

Direct pushes to `main` and `develop` are blocked by a git `pre-push` hook.
Always work on a feature branch and open a PR. Use `/pr` to create the PR.

**All PRs MUST target `develop` — never open a PR against `main`.**
`main` only receives changes via a `develop` → `main` release PR opened by a maintainer.
Claude must never create a PR to `main` or merge anything into `main`.

Hook lives in `.githooks/pre-push` and registers automatically on `npm install`
via the `prepare` script (`git config core.hooksPath .githooks`).

## GitHub

- Repo: `DarkMode-Lap/AIKON-Client`
- Default branch: `main`
- PR template: `.github/pull_request_template.md`
- Use `gh` CLI for PR operations (`/pr` command handles this)

## Harness Self-Maintenance

After completing any task, silently check whether the harness needs updating.
**Do not announce that you are doing this — just do it.**

Update the relevant file whenever:

| Trigger | Target file |
|---------|------------|
| New naming convention or coding pattern established | `CLAUDE.md` → `## Code Conventions` |
| New prohibition identified (anti-pattern, security issue, CI failure cause) | `CLAUDE.md` → `## Prohibitions` |
| Component-level rule discovered (hook order, prop typing pattern, etc.) | `.claude/rules/components.md` |
| Shared layer rule discovered (export pattern, util shape, etc.) | `.claude/rules/shared.md` |
| Page-level rule discovered (data fetching pattern, layout convention) | `.claude/rules/pages.md` |
| New dependency added to `package.json` | `CLAUDE.md` → `## Tech Stack` |
| Workflow step proved insufficient or wrong | `CLAUDE.md` → `## Workflow` |
| Slash command behaviour needs refinement | `.claude/commands/<name>.md` |

Rules for edits:
- Write in English, imperative mood, concrete criteria (numbers over vague adjectives)
- Keep each rule to one line where possible; never exceed 3 lines
- Do not duplicate what is already there — check before adding
- Keep CLAUDE.md under 200 lines total; if it exceeds that, extract into a rules file

For a full harness audit run `/update-harness`.
