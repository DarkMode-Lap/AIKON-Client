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
   <type>(<optional scope>): <short summary in imperative mood, max 72 chars>
   ```
   - Summary must be in **English**, lowercase after the colon, no trailing period.
   - Add a blank line + bullet-point body **only** if the change needs context that the summary can't capture.
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
  feat(auth): add OTP login flow

Proceed? [y/n/edit]
```
