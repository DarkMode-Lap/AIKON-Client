# /update-harness — Harness Audit & Update

Perform a full audit of the harness files against the current codebase and apply improvements.
Run this when you feel the harness has drifted from actual project patterns, or when starting a new sprint.

## Steps

### 1. Read the full harness
Read every harness file in order:
- `CLAUDE.md`
- `.claude/rules/components.md`
- `.claude/rules/shared.md`
- `.claude/rules/pages.md`
- `.claude/commands/*.md`
- `.claude/settings.json`

### 2. Audit the codebase
Scan these to detect patterns not yet captured in the harness:
- `src/` — file naming, import patterns, hook usage, component structure
- `package.json` — new dependencies since last harness update
- `.github/workflows/ci.yml` — CI steps that should be reflected in Workflow or Prohibitions
- `eslint.config.js` + `.prettierrc` — any rules not yet documented

Look for:
- Patterns used in 2+ files that have no harness rule yet
- Anti-patterns that caused bugs or CI failures in recent commits (`git log --oneline -20`)
- Stale rules that no longer match the codebase
- Missing prohibitions for newly introduced bad patterns

### 3. Generate a diff report

For each proposed change, show:

```
[ADD | EDIT | REMOVE] <file> → <section>
Before: <current text or "(none)">
After:  <proposed text>
Reason: <one sentence>
```

### 4. Ask for confirmation
Show all proposed changes as a batch and ask: **"Apply all? [y/n/select]"**
- `y` — apply everything
- `n` — discard all
- `select` — user picks which ones to apply

### 5. Apply approved changes
Edit only the files the user approved.
After applying, report: `Updated N rules across M files.`

## Rules
- Never remove a rule without a concrete reason (it caused false positives, codebase changed)
- Never exceed 200 lines in CLAUDE.md — extract to `.claude/rules/` if needed
- Keep all harness files in English
- Do not touch `.githooks/` or `package.json` — those are not harness files
