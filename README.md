# Resume Builder

A full-stack resume builder focused on the complete job-application loop: import an existing resume, improve it with AI, match it against a job description, and export a polished PDF.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-Backend-FF6B6B?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)
![AI SDK](https://img.shields.io/badge/AI-SDK-111827?style=for-the-badge)

## Current Status

MVP in active development. Core resume editing, authentication, cloud persistence, AI-assisted workflows, and PDF export are implemented.

The app currently highlights four flagship flows:

| Flow | Status | What it does |
| --- | --- | --- |
| **AI PDF Parse** | Built | Upload a PDF resume, extract content, normalize it into structured resume fields, and create a new editable resume. |
| **AI Resume Improve** | Built | Review a resume, ask targeted follow-up questions, generate focused edits, and apply accepted changes back into the resume. |
| **AI JD Match** | Built | Paste a job description, extract missing keywords, place selected keywords into relevant resume sections, and create a tailored resume version. |
| **Resume PDF Export** | Built | Preview the resume and export a clean, styled PDF using `@react-pdf/renderer`. |

## Why It Stands Out

- **End-to-end application workflow**: import, edit, improve, tailor, preview, export.
- **AI is productized, not decorative**: each AI flow has review steps, user control, and structured output.
- **Resume versioning for job targeting**: JD matching creates a new tailored resume instead of overwriting the base version.
- **Real backend architecture**: Convex powers persistence, AI attempt tracking, prompts, and server-side actions.
- **Production-minded UI**: responsive Next.js app with WorkOS AuthKit, typed forms, validation, and focused feature modules.

## Product Walkthrough

### 1. Build or Import a Resume

Users can create a resume manually or upload an existing PDF. The PDF parser extracts resume text, sends it through the AI parser prompt, normalizes the result, and turns it into editable resume data.

### 2. Improve the Resume With AI

The improve flow starts from an existing resume and creates an AI-guided review thread. It asks targeted questions, generates concrete edits, and lets users accept changes before applying them.

### 3. Match a Job Description

The JD match flow analyzes a job description, extracts missing or important keywords, lets users choose placement targets, previews the proposed changes, and creates a tailored resume version for that job.

### 4. Export a Polished PDF

The live preview and PDF export flow turn structured resume data into a clean downloadable document with styling handled by the app's PDF renderer.

## Feature Snapshot

- Live resume editor with structured personal info, experience, education, skills, and custom sections.
- Real-time preview beside the editor.
- Multi-resume management with default resume selection.
- AI PDF import limits and AI attempt tracking.
- AI-improved resume state to guide the workflow.
- JD match review UI with keyword highlighting and placement review.
- PDF preview/export dialog.
- WorkOS AuthKit authentication.
- Convex database, queries, mutations, actions, and seeded AI prompts.
- Vitest and React Testing Library coverage for focused feature behavior.

## Tech Stack

| Category | Technology |
| --- | --- |
| **Framework** | Next.js 16 App Router |
| **Language** | TypeScript 5 |
| **UI** | React 19, shadcn/ui, Base UI, Radix UI |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Convex |
| **Auth** | WorkOS AuthKit |
| **AI** | AI SDK with OpenAI, Anthropic, and Google providers |
| **PDF Parsing** | `pdfjs-dist` |
| **PDF Export** | `@react-pdf/renderer` |
| **Forms** | React Hook Form + Zod |
| **Testing** | Vitest + React Testing Library |
| **Package Manager** | pnpm |

## Project Structure

```txt
resume-builder/
├── app/                 # Next.js routes and server actions
├── components/          # Feature modules and shared UI
│   ├── ImproveResume/   # AI resume improvement flow
│   ├── MatchJob/        # AI JD matching flow
│   ├── PdfUpload/       # PDF import flow
│   ├── PdfViewer/       # PDF preview/export flow
│   ├── ResumeForm/      # Resume editor
│   └── ResumePreview/   # Live resume preview
├── convex/              # Convex schema, functions, AI actions, prompts
├── hooks/               # App hooks
├── lib/                 # Shared utilities
├── types/               # TypeScript domain types
└── docs/                # Project guides
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+
- Convex account
- WorkOS account
- AI provider API keys for configured model providers

### Install

```bash
pnpm install
```

### Environment

Create `.env.local`:

```env
WORKOS_CLIENT_ID=your_client_id
WORKOS_API_KEY=your_api_key
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
WORKOS_COOKIE_PASSWORD=your_32_character_cookie_password
WORKOS_DEFAULT_ORG_ID=your_org_id

CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_key
```

### Run Locally

```bash
pnpm convex
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Start Next.js dev server |
| `pnpm convex` | Start Convex dev server |
| `pnpm typeCheck` | Validate TypeScript |
| `pnpm test` | Run Vitest tests |
| `pnpm check` | Run format and lint checks |
| `pnpm build` | Build production app |

See [docs/COMMANDS.md](docs/COMMANDS.md) for the project command guide.

## Deployment Notes

Deploy the Next.js app to Vercel and deploy Convex separately:

```bash
npx convex deploy
```

Convex functions, schema, environment variables, and seeded prompts need their own deploy cycle.

## License

MIT
