# Reusable Form Architecture with React Hook Form

## Overview

This document outlines a scalable, type-safe form architecture using React Hook Form with TypeScript. The pattern emphasizes composition, reusability, and developer experience through strong typing and component modularity.

## Core Principles

1. **Type Safety First**: Leverage TypeScript generics for autocomplete and type checking
2. **Composition Over Configuration**: Small, focused components that compose together
3. **Single Responsibility**: Each component has one clear purpose
4. **DRY (Don't Repeat Yourself)**: Reusable controlled inputs and layout components
5. **Developer Experience**: Clean imports and intuitive component APIs

## Architecture Layers

```
├── Schema Layer (Zod)
│   └── Validation schemas and TypeScript types
├── Controlled Field Layer
│   └── Generic wrapper components for form controls
├── Field Component Layer
│   └── Specific field implementations
├── Layout Component Layer
│   └── Reusable layout primitives
└── Section Component Layer
    └── Composed form sections
```

## 1. Schema Layer: Type-Safe Validation

### Pattern

Define schemas using Zod and extract TypeScript types from them.

```typescript
import * as z from 'zod';

// Define schema
export const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits')
  // ... more fields
});

// Define default values
export const personalInfoDefaultValues = {
  fullName: '',
  email: '',
  phone: ''
  // ... more fields
};

// Extract TypeScript type
export type TPersonalInfo = z.infer<typeof personalInfoSchema>;
```

### Benefits

- Single source of truth for validation rules
- Automatic TypeScript type generation
- Runtime validation
- Clear error messages

## 2. Controlled Field Layer: Generic Wrappers

### Pattern

Create generic controlled field components that work with any form type.

```typescript
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';

export default function ControlledInput<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
}) {
  const form = useFormContext<TForm>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={props.placeholder}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

// Type-safe export for specific form
export const MyFormControlledInput = ControlledInput<TMyFormData>;
```

### Key Features

- **Generic Type Parameter**: `<TForm extends FieldValues>` makes it work with any form
- **Type-Safe Field Names**: `FieldPath<TForm>` provides autocomplete for field names
- **Field State Management**: Automatic error handling and validation state
- **Accessibility**: Built-in ARIA attributes and label associations

### Controlled Field Types

Create variants for different input types:

```typescript
// Text Input
ControlledInput<TForm>;

// Textarea
ControlledTextarea<TForm>;

// Single Checkbox (boolean)
ControlledSingleCheckbox<TForm>;

// Checkbox Group (array of strings)
ControlledCheckbox<TForm>;

// Select Dropdown
ControlledSelect<TForm>;

// Radio Group
ControlledRadioGroup<TForm>;
```

## 3. Field Component Layer: Specific Implementations

### Pattern

Create small, focused components for each form field.

#### For Simple Forms (No Arrays)

```typescript
import { ControlledInput } from '@/components/ControlledFields';

export default function FullName() {
  return <ControlledInput name="personalInfo.fullName" label="Full Name" />;
}
```

#### For Dynamic Forms (With Arrays)

```typescript
import { ControlledInput } from '@/components/ControlledFields';

export default function Company({ index }: { index: number }) {
  return (
    <ControlledInput
      name={`experience.${index}.company`}
      label="Company"
    />
  );
}
```

### Benefits

- **Easy to Test**: Small, isolated components
- **Easy to Modify**: Change one field without affecting others
- **Reusable**: Can be used in multiple places
- **Clear Intent**: Component name matches the field purpose

## 4. Layout Component Layer: Reusable Primitives

### Pattern

Create layout components that handle common UI patterns.

#### Grid Row Component

```typescript
interface FieldRowProps {
  cols?: 'full' | 'half' | 'third' | 'quarter';
  children: React.ReactNode;
}

export default function FieldRow({ cols = 'full', children }: FieldRowProps) {
  const gridColsClass = {
    full: 'grid-cols-1',
    half: 'grid-cols-2',
    third: 'grid-cols-3',
    quarter: 'grid-cols-4'
  }[cols];

  return <div className={`grid ${gridColsClass} gap-4`}>{children}</div>;
}
```

#### Section Title Component

```typescript
interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}
```

### Usage

```typescript
<FieldRow cols="half">
  <Email />
  <Phone />
</FieldRow>

<FieldRow cols="third">
  <City />
  <State />
  <ZipCode />
</FieldRow>
```

### Benefits

- **Consistent Layouts**: Same spacing and grid patterns everywhere
- **Responsive**: Easy to adjust for different screen sizes
- **Flexible**: Works with any field components

## 5. Organization Pattern: Index Files

### Pattern

Use index files to enable clean, grouped imports.

#### Directory Structure

```
PersonalInfoFields/
├── index.ts
├── FullName.tsx
├── Email.tsx
├── Phone.tsx
└── Location.tsx
```

#### Index File

```typescript
export { default as FullName } from './FullName';
export { default as Email } from './Email';
export { default as Phone } from './Phone';
export { default as Location } from './Location';
```

#### Import Usage

```typescript
// ❌ Before: Multiple imports
import FullName from './PersonalInfoFields/FullName';
import Email from './PersonalInfoFields/Email';
import Phone from './PersonalInfoFields/Phone';

// ✅ After: Single grouped import
import { FullName, Email, Phone } from './PersonalInfoFields';
```