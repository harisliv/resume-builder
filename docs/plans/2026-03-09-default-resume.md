# Default Resume & AI Improved Flags — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add `isDefault` and `isAiImproved` flags to resume schema; implement star-to-default UI with auto-select on login.

**Architecture:** Schema gets two optional boolean fields. New `setDefaultResume` mutation atomically unsets old default + sets new. Frontend shows star icon per resume option, uses existing `useWarningDialog` for confirmation when replacing. On mount, auto-select default resume.

**Tech Stack:** Convex (schema, mutation, query), React, TanStack Query, lucide-react icons, shadcn AlertDialog via WarningDialogProvider.

---

### Task 1: Schema — Add `isDefault` and `isAiImproved` fields

**Files:**
- Modify: `convex/schema.ts:11-26`
- Modify: `convex/resumes.ts:16-26` (resumeValidator)

**Step 1: Add fields to schema**

In `convex/schema.ts`, add to the resumes table definition (before `documentStyle`):

```typescript
isDefault: v.optional(v.boolean()),
isAiImproved: v.optional(v.boolean()),
```

**Step 2: Add fields to resumeValidator**

In `convex/resumes.ts`, add to `resumeValidator` object:

```typescript
isDefault: v.optional(v.boolean()),
isAiImproved: v.optional(v.boolean()),
```

**Step 3: Generate Convex types**

Run: `pnpm generate`

**Step 4: Validate**

Run: `pnpm typeCheck`
Expected: PASS (no type errors)

---

### Task 2: Backend — `setDefaultResume` mutation

**Files:**
- Modify: `convex/resumes.ts` (add new mutation)

**Step 1: Add `setDefaultResume` mutation**

Add after the `deleteResume` mutation (~line 121):

```typescript
/** Set a resume as the user's default. Unsets any previous default. */
export const setDefaultResume = mutation({
  args: {
    id: v.id('resumes')
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const userId = await getAuthenticatedUser(ctx);
    const resume = await ctx.db.get(args.id);
    if (!resume || resume.userId !== userId) {
      throw new Error('Unauthorized: Resume does not belong to user');
    }

    /** Unset previous default. */
    const userResumes = await ctx.db
      .query('resumes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    for (const r of userResumes) {
      if (r.isDefault) {
        await ctx.db.patch(r._id, { isDefault: false });
      }
    }

    await ctx.db.patch(args.id, { isDefault: true });
    return null;
  }
});
```

**Step 2: Validate**

Run: `pnpm typeCheck`
Expected: PASS

---

### Task 3: Backend — Update `listResumeTitles` to return `isDefault`

**Files:**
- Modify: `convex/resumes.ts:155-174` (listResumeTitles query)

**Step 1: Update return validator and mapper**

Change `listResumeTitles` return validator to include `isDefault`:

```typescript
export const listResumeTitles = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id('resumes'),
      title: v.string(),
      isDefault: v.optional(v.boolean())
    })
  ),
  handler: async (ctx) => {
    const userId = await getAuthenticatedUser(ctx);
    const resumes = await ctx.db
      .query('resumes')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .collect();
    return resumes.map((resume) => ({
      _id: resume._id,
      title: resume.title,
      isDefault: resume.isDefault
    }));
  }
});
```

**Step 2: Validate**

Run: `pnpm typeCheck`

---

### Task 4: Frontend hook — Update `useGetUserResumeTitles` to include `isDefault`

**Files:**
- Modify: `hooks/useGetUserResumeTitles.tsx:10-14`

**Step 1: Update the mapper to include `isDefault`**

```typescript
return res.map((item) => ({
  id: item._id,
  title: item.title,
  isDefault: item.isDefault ?? false
}));
```

**Step 2: Validate**

Run: `pnpm typeCheck`

---

### Task 5: Frontend hook — Create `useSetDefaultResume`

**Files:**
- Create: `hooks/useSetDefaultResume.ts`

**Step 1: Create the hook**

```typescript
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useConvex, useConvexAuth } from 'convex/react';
import { toast } from 'sonner';

/** Sets a resume as the user's default via Convex and invalidates title cache. */
export function useSetDefaultResume() {
  const queryClient = useQueryClient();
  const convex = useConvex();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return useMutation({
    mutationFn: async (id: Id<'resumes'>) => {
      if (isLoading || !isAuthenticated) {
        throw new Error('User not authenticated');
      }
      await convex.mutation(api.resumes.setDefaultResume, { id });
    },
    onError: () => {
      toast.error('Failed to set default resume');
    },
    onSuccess: () => {
      toast.success('Default resume updated');
      queryClient.invalidateQueries({ queryKey: ['resumeTitles'] });
    }
  });
}
```

**Step 2: Validate**

Run: `pnpm typeCheck`

---

### Task 6: Frontend — Update `NavSelectorOption` type to support `isDefault`

**Files:**
- Modify: `components/AppSidebar/types.ts:4-8`

**Step 1: Add `isDefault` to `NavSelectorOption`**

```typescript
export type NavSelectorOption<T extends string = string> = {
    id: T;
    label: string;
    description?: string;
    isDefault?: boolean;
};
```

**Step 2: Validate**

Run: `pnpm typeCheck`

---

### Task 7: Frontend — Add star icon + disable delete in `ResumeOptionActions`

**Files:**
- Modify: `components/AppSidebar/components/ResumeOptionActions.tsx`

**Step 1: Update Props type**

Add to Props:

```typescript
type Props = {
  option: NavSelectorOption;
  defaultContent: ReactNode;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
};
```

**Step 2: Add Star icon import**

Add `Star` to the lucide-react imports:

```typescript
import { Pencil, Trash2, Check, X, Star } from 'lucide-react';
```

**Step 3: Update component to accept and use `onSetDefault`**

Add the star button before the pencil button in the non-editing action buttons section. Disable trash when `option.isDefault` is true.

Replace the non-editing buttons block (lines ~111-141) with:

```typescript
) : (
  <>
    <Button
      size="icon"
      variant="ghost"
      className="size-7 shrink-0 !text-amber-500/60 hover:!text-amber-500"
      onClick={() => onSetDefault(option.id)}
    >
      <Star
        className="size-3.5"
        fill={option.isDefault ? 'currentColor' : 'none'}
      />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      className="size-7 shrink-0 !text-primary/60"
      onClick={() => {
        setEditTitle(option.label);
        setIsEditing(true);
      }}
    >
      <Pencil className="size-3.5" />
    </Button>
    <Button
      size="icon"
      variant="ghost"
      className="size-7 shrink-0 !text-destructive/60"
      disabled={option.isDefault}
      onClick={async () => {
        const ok = await confirm({
          title: 'Delete resume?',
          description:
            'This resume and all its data will be permanently removed. You won\'t be able to recover it.',
          confirmLabel: 'Delete',
          variant: 'destructive'
        });
        if (ok) onDelete(option.id);
      }}
    >
      <Trash2 className="size-3.5" />
    </Button>
  </>
)}
```

**Step 4: Validate**

Run: `pnpm typeCheck`

---

### Task 8: Frontend — Wire `ResumeSelector` with default resume logic

**Files:**
- Modify: `components/AppSidebar/components/ResumeSelector.tsx`

**Step 1: Add imports and hook**

```typescript
import { useSetDefaultResume } from '@/hooks/useSetDefaultResume';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
```

**Step 2: Inside component, add hook calls and handler**

After the existing `useRenameResume` line:

```typescript
const { mutate: setDefaultResume } = useSetDefaultResume();
const confirm = useWarningDialog();
```

Add handler:

```typescript
const handleSetDefault = useCallback(
  async (id: string) => {
    const hasExistingDefault = resumeTitles?.some((r) => r.isDefault) ?? false;
    if (hasExistingDefault) {
      const ok = await confirm({
        title: 'Change default resume?',
        description: 'This will replace your current default resume.',
        confirmLabel: 'Replace'
      });
      if (!ok) return;
    }
    setDefaultResume(id as Id<'resumes'>);
  },
  [resumeTitles, confirm, setDefaultResume]
);
```

**Step 3: Update options mapping to include `isDefault`**

```typescript
const options: NavSelectorOption[] = useMemo(
  () => resumeTitles?.map((r) => ({ id: r.id, label: r.title, isDefault: r.isDefault })) ?? [],
  [resumeTitles]
);
```

**Step 4: Pass `onSetDefault` to `ResumeOptionActions`**

Update the `renderOptionContent` callback:

```typescript
renderOptionContent={(option, defaultContent) => (
  <ResumeOptionActions
    option={option}
    defaultContent={defaultContent}
    onRename={handleRename}
    onDelete={onDelete}
    onSetDefault={handleSetDefault}
  />
)}
```

**Step 5: Validate**

Run: `pnpm typeCheck`

---

### Task 9: Frontend — Auto-select default resume on login

**Files:**
- Modify: `components/Home/Home.tsx`

**Step 1: Add import for `useGetUserResumeTitles`**

```typescript
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
```

**Step 2: Inside `Home` component, add auto-select logic**

After the existing `useState` calls (~line 120), add:

```typescript
const { data: resumeTitles } = useGetUserResumeTitles();
```

Add a `useEffect` after the hooks section:

```typescript
import { useEffect } from 'react';
```

```typescript
/** Auto-select default resume on login. */
useEffect(() => {
  if (selectedResumeId || !resumeTitles?.length) return;
  const defaultResume = resumeTitles.find((r) => r.isDefault);
  if (defaultResume) {
    setSelectedResumeId(defaultResume.id as Id<'resumes'>);
  }
}, [resumeTitles, selectedResumeId]);
```

**Step 3: Validate**

Run: `pnpm typeCheck`

---

### Task 10: Final validation

**Step 1: Run type check**

Run: `pnpm typeCheck`
Expected: PASS

**Step 2: Run build**

Run: `pnpm build`
Expected: PASS

---

## Unresolved Questions

None — design is fully specified.
