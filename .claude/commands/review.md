# /review — Code Review

Perform a thorough code review of the current diff or a specified file/range.

## Arguments

- (none) — review all staged + unstaged changes vs `HEAD`
- `<file>` — review a specific file
- `<base>` — review diff between current branch and `<base>` (e.g., `/review main`)

## Review Dimensions

Check every dimension below. Report only real issues — no praise, no noise.

### 1. Correctness
- Logic errors, off-by-one, unhandled edge cases
- Missing `await` on async calls
- State mutation (direct array/object mutation instead of spread)
- React key prop missing or using array index in dynamic lists

### 2. Type Safety
- Use of `any` or unsafe type assertions (`as Foo`)
- Missing return types on exported functions
- Props not typed or typed too loosely

### 3. FSD Layer Violations
- Import from a higher layer (e.g., `shared` importing from `features`)
- Business logic inside `shared/ui` components
- Page-level orchestration code inside `features`

### 4. Prohibitions (from CLAUDE.md)
- `console.log` left in code
- Inline `style={{}}` objects
- `@ts-ignore` without explanation

### 5. Performance
- Unnecessary re-renders (missing stable references for callbacks/objects passed as props)
- Large imports that should be lazy-loaded
- Missing `key` on list items

### 6. Tailwind / Styling
- Duplicate or conflicting class combinations
- Magic numbers that should be design tokens

## Output Format

For each issue, report:

```
[Severity: critical | warning | suggestion] <file>:<line>
<one-line description>
<fix if non-obvious>
```

Severity guide:
- **critical** — will cause bugs or CI failures; must fix before merging
- **warning** — likely to cause problems; fix unless explicitly justified
- **suggestion** — improves quality but optional

End with a summary line: `N critical, N warning, N suggestion`.

## Rules
- Read the full diff before commenting — do not report issues fixed later in the same diff
- If there are zero issues, say so explicitly
