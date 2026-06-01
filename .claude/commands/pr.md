# /pr — Create a Pull Request

Generate and open a pull request for the current branch against `main` (or `develop` if specified).

## Arguments

- (none) — targets `main`
- `develop` — targets `develop`

## Steps

1. Confirm the current branch is not `main` or `develop`. If it is, abort with a warning.
2. Run `git status` — if there are uncommitted changes, prompt the user to commit or stash first.
3. Push the branch to `origin` if it hasn't been pushed yet (`git push -u origin HEAD`).
4. Run `git log <base>...HEAD --oneline` to list all commits on this branch.
5. Run `git diff <base>...HEAD --stat` to understand the scope of changes.
6. Draft the PR using this structure:

```markdown
## Summary
- <bullet 1: what changed and why>
- <bullet 2 if needed>
- <bullet 3 if needed>

## Changes
- <specific file/feature change>
- ...

## Review Notes
<anything non-obvious reviewers should know — leave blank if nothing>

## Test Plan
- [ ] Dev server runs without errors (`npm run dev`)
- [ ] TypeScript compiles cleanly (`npm run typecheck`)
- [ ] No lint errors (`npm run lint`)
- [ ] Visually tested in browser

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

7. Show the proposed title and body, ask the user to confirm or edit.
8. Run `gh pr create --title "<title>" --body "<body>" --base <base>`.
9. Return the PR URL.

## Rules
- PR title must follow conventional commit format: `<type>(<scope>): <summary>`
- Title in **English**, max 70 characters.
- Never force-push to `main`.
- If CI is already failing on the branch, warn the user before creating the PR.

## Example
```
Branch: feat/qr-scanner → main

Proposed title:
  feat(scanner): add QR code scan flow

Proceed? [y/n/edit]
```
