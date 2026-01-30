# 📝 Resume Builder

A modern, AI-ready resume builder application that helps you create professional resumes with real-time preview and PDF export capabilities.

![Resume Builder](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-Backend-FF6B6B?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

- 🎨 **Live Preview** - See your resume update in real-time as you type
- 📄 **PDF Export** - Generate professional PDF resumes with one click
- 🔐 **Secure Authentication** - Enterprise-grade auth powered by WorkOS AuthKit
- ☁️ **Cloud Storage** - Save and manage multiple resumes with Convex backend
- 🎯 **AI-Ready** - Architecture prepared for AI-powered job application suggestions
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful interface built with shadcn/ui components

## 🚀 Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Backend** | Convex |
| **Auth** | WorkOS AuthKit |
| **PDF** | @react-pdf/renderer |
| **UI Components** | shadcn/ui |
| **Icons** | Lucide React + HugeIcons |
| **Forms** | React Hook Form + Zod |
| **Testing** | Vitest + React Testing Library |

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) 18+ 
- [pnpm](https://pnpm.io/) 8+
- A [Convex](https://convex.dev/) account
- A [WorkOS](https://workos.com/) account

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd resume-builder
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Convex

Convex provides the backend database and real-time synchronization.

**Step 1:** Log in to Convex

```bash
npx convex dev
```

This will:
- Open a browser to authenticate with Convex
- Create a new Convex project (or connect to existing)
- Start the local Convex dev server

**Step 2:** Note your deployment URL

After running the command above, you'll see output like:
```
✔ Convex deployment ready!
   URL: https://your-deployment.convex.cloud
```

Copy this URL for your environment variables.

### 4. Set Up WorkOS AuthKit

AuthKit provides secure authentication for your application.

**Step 1:** Create a WorkOS account at [workos.com](https://workos.com/)

**Step 2:** Get your API credentials from the WorkOS Dashboard:
- Go to **API Keys** → Copy your **Client ID** and **API Key**
- Go to **Redirects** → Add `http://localhost:3000/callback` as a redirect URI

**Step 3:** Generate a cookie password (32+ characters):

```bash
openssl rand -base64 32
```

**Step 4:** (Optional) Create a default organization in WorkOS dashboard and copy the Org ID

### 5. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# WorkOS AuthKit Configuration
WORKOS_CLIENT_ID=your_client_id_here
WORKOS_API_KEY=your_api_key_here
NEXT_PUBLIC_WORKOS_REDIRECT_URI=http://localhost:3000/callback
WORKOS_COOKIE_PASSWORD=your_generated_password_here
WORKOS_DEFAULT_ORG_ID=your_org_id_here

# Convex Configuration
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

> ⚠️ **Important:** Never commit `.env.local` to version control. It's already in `.gitignore`.

### 6. Run the Development Server

Start both the Next.js and Convex dev servers:

```bash
# Terminal 1: Start Convex
pnpm convex

# Terminal 2: Start Next.js
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js development server |
| `pnpm convex` | Start Convex development server |
| `pnpm build` | Build production application |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run Vitest tests |
| `pnpm compile` | Run TypeScript compiler in watch mode |

## 🏗️ Project Structure

```
resume-builder/
├── app/              # Next.js app router pages
├── components/       # React components (UI + features)
│   └── ui/          # shadcn/ui components
├── convex/          # Convex backend functions and schema
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
├── types/           # TypeScript type definitions
├── config/          # Configuration files
├── tests/           # Test files
└── public/          # Static assets
```

## 🔐 Authentication Flow

This app uses WorkOS AuthKit for authentication:

1. User clicks "Sign In" → Redirected to AuthKit hosted UI
2. User authenticates → Redirected to `/callback`
3. App validates session → Creates user session
4. Protected routes check for valid session

## 📦 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Convex Production

```bash
npx convex deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE) - free to use, modify, and distribute.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ✅ Sublicensing allowed

The only requirement is to include the original copyright notice and license text in any copies.

## 🆘 Troubleshooting

### Convex connection issues
- Ensure `npx convex dev` is running
- Check that `NEXT_PUBLIC_CONVEX_URL` matches your deployment

### AuthKit login issues
- Verify redirect URI matches exactly in WorkOS dashboard
- Check that all WorkOS env vars are set correctly
- Ensure `WORKOS_COOKIE_PASSWORD` is at least 32 characters

### PDF export not working
- Check browser console for errors
- Ensure `@react-pdf/renderer` is properly installed

---

Built with ❤️ using Next.js, Convex, and WorkOS AuthKit
