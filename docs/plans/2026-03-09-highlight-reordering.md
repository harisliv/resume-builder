# Highlight Reordering Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add highlight reordering controls in the experience form and persist that order through save, preview, and PDF export.

**Architecture:** Keep array order as the source of truth. Add a focused component test around `Highlights`, verify it fails, then add `swap()`-based reorder controls that replace the bullet gutter.

**Tech Stack:** React 19, Next.js 16, React Hook Form, Vitest, Testing Library

---

### Task 1: Add failing Highlights reorder test

**Files:**
- Create: `components/ResumeForm/components/ExperienceFields/Highlights.test.tsx`
- Modify: none

**Step 1: Write the failing test**

Write a test that renders `Highlights` inside `FormProvider` and `WarningDialogProvider`, seeds two highlight values, clicks the move-down control for the first row, and expects the textarea values to swap.

**Step 2: Run test to verify it fails**

Run: `pnpm test --run components/ResumeForm/components/ExperienceFields/Highlights.test.tsx`

Expected: FAIL because the move controls do not exist yet.

### Task 2: Implement highlight reorder UI

**Files:**
- Modify: `components/ResumeForm/components/ExperienceFields/Highlights.tsx`

**Step 1: Write minimal implementation**

- add `swap` to `useFieldArray`
- add `moveHighlight(fromIndex, toIndex)`
- replace the bullet with a compact vertical up/down control
- disable the top button on the first row and the bottom button on the last row

**Step 2: Run test to verify it passes**

Run: `pnpm test --run components/ResumeForm/components/ExperienceFields/Highlights.test.tsx`

Expected: PASS

### Task 3: Verify downstream behavior still uses array order

**Files:**
- Verify only: preview and PDF files already using `highlights.map(...)`

**Step 1: Run project verification**

Run: `pnpm typeCheck`

Expected: PASS
