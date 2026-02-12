# Commands

- **`pnpm dev`** — Start development server (Vite + Convex via turbo). Note: Don't use unless otherwise told to.
- **`pnpm lint`** — Type-aware Oxlint linting (also reports TypeScript errors)
- **`pnpm lint --fix`** — Apply fixes for autofixable lint issues
- **`pnpm check`** — Runs format & lint
- **`pnpm test`** — Run tests with Vitest (excludes evals)
- **`pnpm test:watch`** — Watch mode for tests
- **`vitest run path/to/test.test.ts`** — Run single test file
- **`pnpm generate`** — Generate Convex types after schema changes

**Do not run during the tasks unless otherwise told to:**

- `pnpm dev` (assume already running)
- `pnpm convex` (assume already running)
- `pnpm lint` (DONT)
- `pnpm format` (DONT)

**In order to validate the code, run:**

- `pnpm compile`
- `pnpm build`
