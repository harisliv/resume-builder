# Commands

- **`pnpm dev`** — Start development server (Vite + Convex via turbo). Note: Don't use unless otherwise told to.
- **`pnpm lint`** — Type-aware Oxlint linting (also reports TypeScript errors)
- **`pnpm lint --fix`** — Apply fixes for autofixable lint issues
- **`pnpm check`** — Runs format & lint
- **`pnpm test`** — Run tests with Vitest (excludes evals)
- **`pnpm test:watch`** — Watch mode for tests
- **`vitest run path/to/test.test.ts`** — Run single test file

**Do not run during the tasks unless otherwise told to:**

- `pnpm dev` (assume already running)
- `pnpm convex` (assume already running)
- `pnpm compile` (assume already running)
- `pnpm lint` (DONT)
- `pnpm format` (DONT)

**In order to validate the code, run:**

- `pnpm typeCheck`
- `pnpm build`

## Convex deploy / seed

- **`pnpm deploy:dev`** — Seeds prompts/models to **dev** (`convex run … --push` with no preview).
- **`pnpm deploy:preview`** — Same seeds, targets a **Convex preview deployment** named `develop` unless you pass a branch: `bash scripts/deploy.sh preview <branch>`. Preview name must already exist (e.g. from Vercel branch deploys); otherwise Convex returns `PreviewNotFound` (404 on `authorize_preview`). If the Convex dashboard shows **no** preview deployments, use **`pnpm deploy:dev`** until previews are enabled (e.g. connect the repo / enable preview deploys in Convex + hosting).
- **`pnpm deploy:prod`** — Deploy + seed production.
