# Project Structure

## Architecture Overview

- **Frontend**: Next.js 16 with App Router
- **Backend**: Convex for database and serverless functions
- **Authentication**: WorkOS AuthKit via middleware
- **Data Fetching**: TanStack Query with Convex HTTP client

## Data Flow and Management

React Hook Form manages form state, Zod validates data, Convex mutations persist to database, and TanStack Query handles caching/refetching. Convex provides real-time database and serverless functions.

## Resume Data Shape Notes

- `skills` now uses categorized shape everywhere (form, Convex, AI suggestions, preview, PDF):
  - `Record<string, string[]>`
  - Example: `{ "Languages": ["TypeScript"], "AI Tools": ["Cursor"] }`

## Authentication & Authorization

WorkOS AuthKit handles authentication via middleware (`proxy.ts`).

- **Admin-only routes**: `/ai` and `/compare` redirect non-admin users to `/`.
- **Public auth routes**: `/callback` remains unauthenticated so AuthKit can finalize session.
- **AI quota**: Non-admin users are limited to 5 AI suggestion generations per UTC day, enforced server-side in Convex (`convex/aiAttempts.ts`).

## Key Directories

- **`app/`**: Next.js App Router pages and routes
  - `actions/`: Server actions
  - `callback/`: Auth callback route
  - `compare/`: Resume comparison page
  - `icons-showcase/`: Icon showcase page
  - `login/`: Login page
- **`components/`**: React components
  - `ui/`: ShadCN UI components
    - `app-sidebar/`: Sidebar components (ResumeSelector, FontSelector, etc.)
  - `ControlledFields/`: Form field wrappers (ControlledInput, ControlledSelect, ControlledTextarea, etc.)
  - `Home/`: Home page component
  - `PdfViewer/`: PDF viewer components
  - `AiSuggestionsDialog/`: AI resume suggestions dialog (job description → suggested changes)
  - `ResumeForm/`: Form sections and fields
    - `components/`: Form section components (PersonalInfo, Experience, Education, Skills)
      - `UI/`: section-accordion (shared by Experience, Education, Skills)
      - `EducationFields/`: Education field groups
      - `ExperienceFields/`: Experience field groups
      - `PersonalInfoFields/`: Personal info field groups
  - `ResumePreview/`: Preview components
- **`providers/`**: Context providers
- **`hooks/`**: Custom React hooks
- **`types/`**: TypeScript types and Zod schemas
- **`convex/`**: Backend functions, schema, validators
  - `suggestResumeChanges.ts`: Action using AI (Gemini) to suggest resume changes from job description
- **`lib/ResumePDF/`**: PDF generation logic
  - `components/`: PDF component building blocks
  - `documents/`: PDF document templates
  - `icons/`: PDF icons
- **`linter/`**: ESLint rule configurations
- **`tests/`**: Testing setup and utilities
- **`public/`**: Static assets
  - `Inter/`: Inter font files
  - `Roboto_Condensed/`: Roboto Condensed font files
- **`docs/`**: Documentation
  - `setupGuides/`: Setup guides
