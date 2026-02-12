# Form Setup Guide

## Form Provider Setup

### Pattern

```typescript
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resumeSchema, resumeDefaultValues } from '@/types';

export default function MyForm() {
  const form = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: resumeDefaultValues,
    mode: 'onChange'
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <PersonalInfo />
        <Experience />
        <Education />
      </form>
    </FormProvider>
  );
}
```

## Implementation Checklist

When implementing this pattern in a new project:

### 1. Setup Dependencies

```bash
pnpm add react-hook-form @hookform/resolvers zod@^4.0.0
```

### 2. Define Schemas

- [ ] Create schema file with Zod schemas
- [ ] Define default values
- [ ] Export TypeScript types

### 3. Create Controlled Components

- [ ] ControlledInput
- [ ] ControlledTextarea
- [ ] ControlledSingleCheckbox
- [ ] ControlledCheckbox (for groups)
- [ ] ControlledSelect
- [ ] ControlledRadioGroup
- [ ] Export type-safe variants

### 4. Create Layout Components

- [ ] FieldRow (grid layout)
- [ ] SectionTitle
- [ ] Any other reusable layouts

### 5. Create Field Components

- [ ] One component per field
- [ ] Organize in folders by section
- [ ] Accept `index` prop for array fields
- [ ] Create index.ts for each folder

### 6. Create Section Components

- [ ] Compose field components
- [ ] Use layout components
- [ ] Implement useFieldArray for dynamic sections

### 7. Setup Form Provider

- [ ] Configure useForm with zodResolver
- [ ] Wrap form sections with FormProvider
  - [ ] Implement submit handler

## Complete Controlled Components Reference

This section provides complete implementations and usage examples for all controlled field components.

### ControlledInput

**Implementation:**

```typescript
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { useId } from 'react';
import type { TResumeData } from '@/types';

export default function ControlledInput<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  autoComplete?: string;
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
            autoComplete={props.autoComplete ?? 'off'}
          />
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export const MyFormControlledInput = ControlledInput<TMyFormData>;
```

**Usage Example:**

```typescript
// In schema
const schema = z.object({
  email: z.email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters')
});

// Field component
export function Email() {
  return (
    <ControlledInput
      name="email"
      label="Email Address"
      placeholder="john@example.com"
      autoComplete="email"
    />
  );
}

// With description
export function Username() {
  return (
    <ControlledInput
      name="username"
      label="Username"
      description="Choose a unique username"
    />
  );
}
```

---

### ControlledTextarea

**Implementation:**

```typescript
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Textarea } from '../ui/textarea';
import { useId } from 'react';
import type { TResumeData } from '@/types';

export default function ControlledTextarea<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
  className?: string;
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
          <Textarea
            {...field}
            value={field.value ?? ''}
            id={id}
            aria-invalid={fieldState.invalid}
            placeholder={props.placeholder}
            className={props.className}
          />
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export const MyFormControlledTextarea = ControlledTextarea<TMyFormData>;
```

**Usage Example:**

```typescript
// In schema
const schema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters')
});

// Field component
export function Bio() {
  return (
    <ControlledTextarea
      name="bio"
      label="Biography"
      placeholder="Tell us about yourself..."
      description="Share your professional background and interests"
    />
  );
}

// For array fields
export function JobDescription({ index }: { index: number }) {
  return (
    <ControlledTextarea
      name={`experience.${index}.description`}
      label="Job Description"
      placeholder="Describe your responsibilities and achievements..."
    />
  );
}
```

---

### ControlledSingleCheckbox

**Purpose:** For single boolean values (e.g., "I agree to terms", "Currently working here")

**Implementation:**

```typescript
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { Field, FieldDescription, FieldError, FieldLabel } from '../ui/field';
import { Checkbox } from '../ui/checkbox';
import { useId } from 'react';
import type { TResumeData } from '@/types';

export default function ControlledSingleCheckbox<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  description?: string;
}) {
  const form = useFormContext<TForm>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <Checkbox
            id={id}
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
          />
          <FieldLabel htmlFor={id} className="font-normal">
            {props.label}
          </FieldLabel>
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export const MyFormControlledSingleCheckbox = ControlledSingleCheckbox<TMyFormData>;
```

**Usage Example:**

```typescript
// In schema
const schema = z.object({
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms'
  }),
  currentlyWorking: z.boolean().default(false),
  receiveNewsletter: z.boolean().optional()
});

// Field components
export function AgreeToTerms() {
  return (
    <ControlledSingleCheckbox
      name="agreeToTerms"
      label="I agree to the terms and conditions"
    />
  );
}

export function CurrentlyWorking({ index }: { index: number }) {
  return (
    <ControlledSingleCheckbox
      name={`experience.${index}.currentlyWorking`}
      label="I currently work here"
    />
  );
}

export function Newsletter() {
  return (
    <ControlledSingleCheckbox
      name="receiveNewsletter"
      label="Send me updates and newsletters"
      description="You can unsubscribe at any time"
    />
  );
}
```

---

### ControlledCheckbox

**Purpose:** For checkbox groups where multiple values can be selected (returns array of strings)

**Implementation:**

```typescript
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet
} from '../ui/field';
import { Checkbox } from '../ui/checkbox';
import type { TResumeData } from '@/types';

export default function ControlledCheckbox<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  legend?: string;
  description?: string;
  options: { id: string; label: string }[];
}) {
  const form = useFormContext<TForm>();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          {props.legend && (
            <FieldLegend variant="label">{props.legend}</FieldLegend>
          )}
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          <FieldGroup data-slot="checkbox-group">
            {props.options.map((option) => (
              <Field
                key={option.id}
                orientation="horizontal"
                data-invalid={fieldState.invalid}
              >
                <Checkbox
                  id={`${field.name}-${option.id}`}
                  name={field.name}
                  aria-invalid={fieldState.invalid}
                  checked={field.value?.includes(option.id) ?? false}
                  onCheckedChange={(checked) => {
                    const currentValue = field.value ?? [];
                    const newValue = checked
                      ? [...currentValue, option.id]
                      : currentValue.filter(
                          (value: string) => value !== option.id
                        );
                    field.onChange(newValue);
                  }}
                />
                <FieldLabel
                  htmlFor={`${field.name}-${option.id}`}
                  className="font-normal"
                >
                  {option.label}
                </FieldLabel>
              </Field>
            ))}
          </FieldGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}

export const MyFormControlledCheckbox = ControlledCheckbox<TMyFormData>;
```

**Usage Example:**

```typescript
// In schema
const schema = z.object({
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
  skills: z.array(z.string()).min(3, 'Select at least 3 skills'),
  languages: z.array(z.string())
});

// Field components
export function Interests() {
  return (
    <ControlledCheckbox
      name="interests"
      legend="What are your interests?"
      description="Select all that apply"
      options={[
        { id: 'sports', label: 'Sports' },
        { id: 'music', label: 'Music' },
        { id: 'travel', label: 'Travel' },
        { id: 'technology', label: 'Technology' },
        { id: 'reading', label: 'Reading' }
      ]}
    />
  );
}

export function Skills() {
  return (
    <ControlledCheckbox
      name="skills"
      legend="Technical Skills"
      options={[
        { id: 'javascript', label: 'JavaScript' },
        { id: 'typescript', label: 'TypeScript' },
        { id: 'react', label: 'React' },
        { id: 'node', label: 'Node.js' },
        { id: 'python', label: 'Python' }
      ]}
    />
  );
}

// Result value will be:
// interests: ['sports', 'music', 'technology']
// skills: ['javascript', 'typescript', 'react', 'node']
```

---

### ControlledSelect

**Purpose:** Dropdown selection (single value)

**Implementation:**

```typescript
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel
} from '../ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { useId } from 'react';
import type { TMyFormData } from '@/types';

export default function ControlledSelect<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  label?: string;
  placeholder?: string;
  description?: string;
  options: { value: string; label: string }[];
  orientation?: 'responsive' | 'horizontal' | 'vertical';
}) {
  const form = useFormContext<TForm>();
  const id = useId();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field
          orientation={props.orientation}
          data-invalid={fieldState.invalid}
        >
          <FieldContent>
            <FieldLabel htmlFor={id}>{props.label}</FieldLabel>
            {props.description && (
              <FieldDescription>{props.description}</FieldDescription>
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={id} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={props.placeholder ?? 'Select'} />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              {props.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      )}
    />
  );
}

export const MyFormControlledSelect = ControlledSelect<TMyFormData>;
```

**Usage Example:**

```typescript
// In schema
const schema = z.object({
  country: z.string().min(1, 'Please select a country'),
  employmentType: z.string().min(1, 'Please select employment type'),
  experienceLevel: z.string()
});

// Field components
export function Country() {
  return (
    <ControlledSelect
      name="country"
      label="Country"
      placeholder="Select your country"
      options={[
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' }
      ]}
    />
  );
}

export function EmploymentType({ index }: { index: number }) {
  return (
    <ControlledSelect
      name={`experience.${index}.employmentType`}
      label="Employment Type"
      description="Select the type of employment"
      options={[
        { value: 'full-time', label: 'Full-time' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' }
      ]}
    />
  );
}

export function ExperienceLevel() {
  return (
    <ControlledSelect
      name="experienceLevel"
      label="Experience Level"
      orientation="horizontal"
      options={[
        { value: 'junior', label: 'Junior (0-2 years)' },
        { value: 'mid', label: 'Mid-level (3-5 years)' },
        { value: 'senior', label: 'Senior (6-10 years)' },
        { value: 'lead', label: 'Lead (10+ years)' }
      ]}
    />
  );
}
```

---

### ControlledRadioGroup

**Purpose:** Radio button group (single selection from multiple options)

**Implementation:**

```typescript
import { Controller, useFormContext } from 'react-hook-form';
import type { FieldPath, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from '../ui/field';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import type { TMyFormData } from '@/types';

export default function ControlledRadioGroup<TForm extends FieldValues>(props: {
  name: FieldPath<TForm>;
  legend?: string;
  description?: string;
  options: { id: string; title: string; description?: string }[];
}) {
  const form = useFormContext<TForm>();

  return (
    <Controller
      name={props.name}
      control={form.control}
      render={({ field, fieldState }) => (
        <FieldSet>
          {props.legend && <FieldLegend>{props.legend}</FieldLegend>}
          {props.description && (
            <FieldDescription>{props.description}</FieldDescription>
          )}
          <RadioGroup
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
          >
            {props.options.map((option) => (
              <FieldLabel
                key={option.id}
                htmlFor={`${field.name}-${option.id}`}
              >
                <Field
                  orientation="horizontal"
                  data-invalid={fieldState.invalid}
                >
                  <FieldContent>
                    <FieldTitle>{option.title}</FieldTitle>
                    {option.description && (
                      <FieldDescription>{option.description}</FieldDescription>
                    )}
                  </FieldContent>
                  <RadioGroupItem
                    value={option.id}
                    id={`${field.name}-${option.id}`}
                    aria-invalid={fieldState.invalid}
                  />
                </Field>
              </FieldLabel>
            ))}
          </RadioGroup>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </FieldSet>
      )}
    />
  );
}

export const MyFormControlledRadioGroup = ControlledRadioGroup<TMyFormData>;
```

**Usage Example:**

```typescript
// In schema
const schema = z.object({
  accountType: z.enum(['personal', 'business', 'enterprise'], {
    required_error: 'Please select an account type'
  }),
  notificationPreference: z.string(),
  subscriptionPlan: z.string()
});

// Field components
export function AccountType() {
  return (
    <ControlledRadioGroup
      name="accountType"
      legend="Account Type"
      description="Choose the type of account you want to create"
      options={[
        {
          id: 'personal',
          title: 'Personal',
          description: 'For individual use'
        },
        {
          id: 'business',
          title: 'Business',
          description: 'For small to medium businesses'
        },
        {
          id: 'enterprise',
          title: 'Enterprise',
          description: 'For large organizations'
        }
      ]}
    />
  );
}

export function NotificationPreference() {
  return (
    <ControlledRadioGroup
      name="notificationPreference"
      legend="How would you like to receive notifications?"
      options={[
        { id: 'email', title: 'Email' },
        { id: 'sms', title: 'SMS' },
        { id: 'push', title: 'Push Notifications' },
        { id: 'none', title: 'No Notifications' }
      ]}
    />
  );
}

export function SubscriptionPlan() {
  return (
    <ControlledRadioGroup
      name="subscriptionPlan"
      legend="Choose Your Plan"
      options={[
        {
          id: 'free',
          title: 'Free',
          description: '$0/month - Basic features'
        },
        {
          id: 'pro',
          title: 'Pro',
          description: '$10/month - Advanced features'
        },
        {
          id: 'premium',
          title: 'Premium',
          description: '$25/month - All features'
        }
      ]}
    />
  );
}
```
