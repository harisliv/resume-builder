# Project Structure

## Architecture Overview

- **Frontend**: Next.js 16 with App Router
- **Backend**: Convex for database and serverless functions
- **Authentication**: WorkOS AuthKit via middleware
- **Data Fetching**: TanStack Query with Convex HTTP client

## Data Flow and Management

React Hook Form manages form state, Zod validates data, Convex mutations persist to database, and TanStack Query handles caching/refetching. Convex provides real-time database and serverless functions.

## Resume Custom Sections

Custom resume sections are generic, user-created resume sections. The add
button lives outside the form tabs in the Resume Form header because each custom
section becomes its own dynamic tab (e.g., Awards, Recommendations).

Field shape:

- Section: `id`, `sectionTitle`, `items`
- Item: `id`, `title`, `subtitle`, `location`, `startDate`, `endDate`, `url`, `description`

Legacy item fields `from` and `to` may exist in stored data during migration.
Read paths should tolerate them, but new writes use `startDate` and `endDate`.

## Feature Folder Shape

- Large frontend features should prefer colocated folders like:
  `Feature/Feature.tsx` for orchestration
  `Feature/ui/` for presentational feature-specific subcomponents
  `Feature/styles/` for styled wrappers with non-trivial Tailwind
  `Feature/*.utils.ts` for pure helpers
  `Feature/*.test.tsx` for focused tests

## Authentication & Authorization

WorkOS AuthKit handles authentication via middleware (`proxy.ts`).

- **Admin-only routes**: and `/compare` redirect non-admin users to `/`.
- **Public auth routes**: `/callback` remains unauthenticated so AuthKit can finalize session.
