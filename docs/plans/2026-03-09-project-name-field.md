# Add "Project Name" Field to Experience

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add optional "Project Name" field to experience entries, displayed as "Position - Project Name" in preview/PDF.

**Architecture:** Add field to schema/validators/types, create form component, rearrange form layout (Company|Location, Position|ProjectName), append " - {projectName}" to position text in all 4 preview styles + 4 PDF documents.

**Tech Stack:** Convex validators, Zod, React Hook Form, react-pdf, Tailwind

---

### Task 1: Schema & Types

**Files:**
- Modify: `convex/validators.ts:13-22`
- Modify: `types/schema.ts:22-38` (zod schema)
- Modify: `types/schema.ts:88-97` (default values)

**Step 1: Add to Convex validator**

In `convex/validators.ts`, add `projectName` to `experienceValidator`:

```typescript
export const experienceValidator = v.object({
  company: v.optional(v.string()),
  position: v.optional(v.string()),
  projectName: v.optional(v.string()),
  location: v.optional(v.string()),
  startDate: v.optional(v.string()),
  endDate: v.optional(v.string()),
  current: v.optional(v.boolean()),
  description: v.optional(v.string()),
  highlights: v.optional(v.array(v.object({ value: v.string() })))
});
```

**Step 2: Add to Zod schema**

In `types/schema.ts`, add to `experienceSchema`:

```typescript
projectName: z.string().max(100, 'Max 100 chars').optional().or(z.literal('')),
```

Add after the `position` field line.

**Step 3: Add to default values**

In `types/schema.ts`, add to `experienceDefaultValues`:

```typescript
projectName: '',
```

Add after the `position` line.

**Step 4: Generate Convex types**

Run: `pnpm generate`

**Step 5: Validate**

Run: `pnpm typeCheck`
Expected: PASS (no type errors)

**Step 6: Commit**

```bash
git add convex/validators.ts types/schema.ts
git commit -m "feat: add projectName field to experience schema"
```

---

### Task 2: Form Component & Layout

**Files:**
- Create: `components/ResumeForm/components/ExperienceFields/ProjectName.tsx`
- Modify: `components/ResumeForm/components/Experience.tsx:100-105`

**Step 1: Create ProjectName component**

Create `components/ResumeForm/components/ExperienceFields/ProjectName.tsx`:

```tsx
import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

/** Optional project name field for experience entries. */
export default function ProjectName({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`experience.${index}.projectName`}
      label="Project Name"
      placeholder="Cloud Migration"
    />
  );
}
```

**Step 2: Update Experience.tsx layout**

Import `ProjectName` and rearrange the form fields inside `<StyledAccordionContent>`:

```tsx
import ProjectName from './ExperienceFields/ProjectName';
```

Replace lines 101-105 (the FieldRow + Location):

```tsx
<FieldRow cols="half">
  <Company index={index} />
  <Location index={index} />
</FieldRow>
<FieldRow cols="half">
  <Position index={index} />
  <ProjectName index={index} />
</FieldRow>
```

**Step 3: Validate**

Run: `pnpm typeCheck`
Expected: PASS

**Step 4: Commit**

```bash
git add components/ResumeForm/components/ExperienceFields/ProjectName.tsx components/ResumeForm/components/Experience.tsx
git commit -m "feat: add ProjectName form field, rearrange experience layout"
```

---

### Task 3: Helper Function for Position Display

**Files:**
- Create: `components/ResumePreview/formatPosition.ts`

**Step 1: Create helper**

```typescript
/**
 * Formats position with optional project name.
 * Returns "Position - Project Name" or just "Position".
 */
export function formatPosition(
  position?: string,
  projectName?: string
): string | undefined {
  if (!position) return undefined;
  if (projectName?.trim()) return `${position} - ${projectName.trim()}`;
  return position;
}
```

**Step 2: Commit**

```bash
git add components/ResumePreview/formatPosition.ts
git commit -m "feat: add formatPosition helper for position + project name display"
```

---

### Task 4: Update Preview Components

**Files:**
- Modify: `components/ResumePreview/ClassicStyle.tsx` (lines 157, 217)
- Modify: `components/ResumePreview/AestheticStyle.tsx` (line 238)
- Modify: `components/ResumePreview/BoldStyle.tsx` (line 105)
- Modify: `components/ResumePreview/ExecutiveStyle.tsx` (line 133)

In each file:

**Step 1: Import formatPosition**

```tsx
import { formatPosition } from './formatPosition';
```

**Step 2: Replace `{exp.position}` / `{firstEntry.position}` occurrences**

Replace every `{exp.position}` with `{formatPosition(exp.position, exp.projectName)}`.
Replace every `{firstEntry.position}` with `{formatPosition(firstEntry.position, firstEntry.projectName)}`.

**ClassicStyle.tsx:**
- Line 157: `{firstEntry.position}` → `{formatPosition(firstEntry.position, firstEntry.projectName)}`
- Line 217: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**AestheticStyle.tsx:**
- Line 238: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**BoldStyle.tsx:**
- Line 105: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**ExecutiveStyle.tsx:**
- Line 133: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**Step 3: Validate**

Run: `pnpm typeCheck`
Expected: PASS

**Step 4: Commit**

```bash
git add components/ResumePreview/ClassicStyle.tsx components/ResumePreview/AestheticStyle.tsx components/ResumePreview/BoldStyle.tsx components/ResumePreview/ExecutiveStyle.tsx
git commit -m "feat: display project name in all preview styles"
```

---

### Task 5: Update PDF Documents

**Files:**
- Modify: `lib/ResumePDF/documents/ClassicDocument.tsx` (lines 378, 448)
- Modify: `lib/ResumePDF/documents/AestheticDocument.tsx` (lines 371, 389)
- Modify: `lib/ResumePDF/documents/ExecutiveDocument.tsx` (lines 265, 317)
- Modify: `lib/ResumePDF/documents/BoldDocument.tsx` (lines 240, 292)

In each file:

**Step 1: Import formatPosition**

```tsx
import { formatPosition } from '@/components/ResumePreview/formatPosition';
```

**Step 2: Replace position text**

Same pattern as preview — replace `{exp.position}` / `{firstEntry.position}` with `{formatPosition(exp.position, exp.projectName)}` / `{formatPosition(firstEntry.position, firstEntry.projectName)}`.

**ClassicDocument.tsx:**
- Line 378: `{firstEntry.position}` → `{formatPosition(firstEntry.position, firstEntry.projectName)}`
- Line 448: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**AestheticDocument.tsx:**
- Line 371: `{firstEntry.position}` → `{formatPosition(firstEntry.position, firstEntry.projectName)}`
- Line 389: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**ExecutiveDocument.tsx:**
- Line 265: `{firstEntry.position}` → `{formatPosition(firstEntry.position, firstEntry.projectName)}`
- Line 317: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**BoldDocument.tsx:**
- Line 240: `{firstEntry.position}` → `{formatPosition(firstEntry.position, firstEntry.projectName)}`
- Line 292: `{exp.position}` → `{formatPosition(exp.position, exp.projectName)}`

**Step 3: Validate**

Run: `pnpm typeCheck && pnpm build`
Expected: PASS

**Step 4: Commit**

```bash
git add lib/ResumePDF/documents/ClassicDocument.tsx lib/ResumePDF/documents/AestheticDocument.tsx lib/ResumePDF/documents/ExecutiveDocument.tsx lib/ResumePDF/documents/BoldDocument.tsx
git commit -m "feat: display project name in all PDF documents"
```

---

## Validation Checklist

- [ ] `pnpm typeCheck` passes
- [ ] `pnpm build` passes
- [ ] Form shows Company|Location on row 1, Position|ProjectName on row 2
- [ ] Preview shows "Position - Project Name" when project name filled
- [ ] Preview shows just "Position" when project name empty
- [ ] PDF matches preview behavior
