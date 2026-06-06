# /commit — Smart Conventional Commit

Create a well-formed conventional commit for all staged (or all changed) files.

## Steps

1. Run `git status` and `git diff HEAD` to understand what changed.
2. If nothing is staged, stage all modified/untracked files with `git add -A` — but **skip** files matching `.env*`, `*.key`, `*.pem`, or `dist/`.
3. Infer the best commit type and scope from the diff:
   - `feat` — new user-visible functionality
   - `fix` — bug fix
   - `chore` — tooling, deps, config (no production code)
   - `ci` — GitHub Actions / CI config
   - `docs` — documentation only
   - `refactor` — restructure without behavior change
   - `style` — formatting, whitespace (no logic change)
   - `perf` — performance improvement
   - `test` — tests only
   - `revert` — reverting a prior commit
4. Write the commit message in this format:
   ```
   <type>: <short summary in Korean, max 72 chars>
   ```
   - **No scope** — do not use `(<scope>)`.
   - Summary must be in **Korean**, no trailing period.
   - **No body, no bullet points** — keep it to one line only.
   - If the diff spans multiple concerns, split into separate commits instead of listing them in the body.
5. Show the proposed commit message and ask the user to confirm or edit before committing.
6. Run `git commit -m "<message>"` with the confirmed message.
7. Report the resulting commit hash and summary.

## Rules
- Never use `--no-verify`.
- Never commit secrets or build artifacts.
- One logical change per commit — if the diff spans unrelated concerns, ask the user to split it first.

## Example output
```
Proposed commit:
  feat: OTP 로그인 플로우 추가

Proceed? [y/n/edit]
```
