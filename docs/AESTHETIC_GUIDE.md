# Aesthetic Design Guide

## Vision

A sophisticated, calm interface that feels premium without being flashy. The design prioritizes clarity and confidence—users should feel they're using a polished, professional tool that respects their time. Visual hierarchy is established through subtle gradients, soft shadows, and thoughtful spacing rather than bold colors or heavy borders.

**Core principles:**
- **Breathable layouts** - Generous whitespace creates focus
- **Soft depth** - Multi-layer shadows and subtle gradients add dimension
- **Gentle interactivity** - Smooth transitions (200-300ms) reward interaction
- **Consistent rhythm** - Spacing and sizing follow predictable scales

## Foundation: ShadCN/ui

All styling builds on ShadCN's theming system:
- CSS variables for colors in `app/globals.css`
- Component primitives in `components/ui/`
- Design tokens mapped to Tailwind classes

**Key integration points:**
- Colors use OKLCH space for perceptual uniformity
- Radius tokens: `--radius` (10px base) with `sm/md/lg/xl/2xl` variants
- Shadows defined as CSS variables with layered OKLCH values

## Color System

### CSS Variables (globals.css)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--background` | `oklch(0.995 0.002 280)` | `oklch(0.145 0.015 280)` | Page background |
| `--foreground` | `oklch(0.145 0.015 280)` | `oklch(0.97 0.01 280)` | Primary text |
| `--card` | `oklch(1 0 0)` | `oklch(0.19 0.02 280)` | Card backgrounds |
| `--primary` | `oklch(0.55 0.26 280)` | `oklch(0.68 0.22 280)` | Buttons, links |
| `--secondary` | `oklch(0.965 0.015 280)` | `oklch(0.25 0.025 280)` | Secondary buttons |
| `--muted` | `oklch(0.965 0.01 280)` | `oklch(0.25 0.025 280)` | Muted backgrounds |
| `--muted-foreground` | `oklch(0.50 0.03 280)` | `oklch(0.65 0.03 280)` | Secondary text |
| `--border` | `oklch(0.91 0.02 280)` | `oklch(0.25 0.025 280)` | Borders, dividers |
| `--accent` | `oklch(0.94 0.03 280)` | `oklch(0.25 0.025 280)` | Highlights |
| `--destructive` | `oklch(0.577 0.245 27.325)` | - | Error states |
| `--ring` | `oklch(0.55 0.26 280)` | - | Focus rings |

### Extended Palette

Use for icons, badges, accents:
- **Indigo** `#6366f1` - Primary actions, gradients
- **Pink** `#ec4899` - Secondary highlights
- **Teal** `#14b8a6` - Success, skills
- **Amber** `#f59e0b` - Warnings, tertiary accents

### Gradients

```css
/* Primary gradient for CTAs */
bg-gradient-to-br from-primary to-primary/80

/* Subtle background gradients */
bg-gradient-to-br from-background via-background to-primary/5

/* Hero/section gradients */
bg-gradient-to-br from-indigo-500 to-purple-600
```

## Typography

### Font Stack
- **Primary**: Inter (`--font-inter`)
- **Monospace**: Geist Mono (`--font-geist-mono`)

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| Page Title | `text-2xl` | `font-bold` | `tracking-tight` | -0.02em |
| Section Title | `text-xl` | `font-semibold` | `tracking-tight` | -0.01em |
| Card Title | `text-sm` | `font-semibold` | `tracking-tight` | - |
| Body | `text-sm` | `font-normal` | `leading-relaxed` | - |
| Small/Label | `text-xs` | `font-medium` | - | - |

## Spacing System

### Layout
- Page padding: `p-8` (desktop), `p-4` (mobile)
- Container max-width: `max-w-[2000px]` with `mx-auto`
- Grid gaps: `gap-8` (major), `gap-4` (minor)
- Section gaps: `space-y-6`

### Component Spacing
- Card padding: `p-7` (large), `p-4` (default)
- Card header padding: `px-5`
- Form field gaps: `gap-4`
- Button internal: `gap-2` (icon + text)

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 6px | Small badges, tags |
| `--radius` (default) | 10px | Cards, inputs |
| `--radius-lg` | 10px | Buttons |
| `--radius-xl` | 16px | Large cards, modals |
| `--radius-2xl` | 20px | Feature cards |

Tailwind classes: `rounded-sm`, `rounded-lg`, `rounded-xl`, `rounded-2xl`

## Shadows

### CSS Variables
```css
--shadow-colored: 0 4px 14px -3px oklch(0.55 0.26 280 / 0.15);
--shadow-elevated: 0 1px 2px oklch(0 0 0 / 0.03), 
                    0 4px 8px oklch(0 0 0 / 0.04), 
                    0 12px 24px oklch(0 0 0 / 0.05);
```

### Usage Patterns
```tsx
// Card default
shadow-[0_1px_2px_oklch(0_0_0_/_0.02),0_4px_8px_oklch(0_0_0_/_0.03),0_8px_16px_oklch(0_0_0_/_0.04)]

// Card hover elevation
hover:shadow-[0_2px_4px_oklch(0_0_0_/_0.02),0_8px_16px_oklch(0_0_0_/_0.04),0_16px_32px_oklch(0_0_0_/_0.06)]

// Button shadow
shadow-md shadow-primary/25

// Focus ring
shadow-[0_0_0_4px_oklch(0.55_0.26_280_/_0.1)]
```

## Component Patterns

### Card
```tsx
<Card className="p-7 flex flex-col h-full">
  <CardHeader className="flex items-center justify-between mb-6">
    <CardTitle className="text-xl font-bold tracking-tight">
      {/* Title */}
    </CardTitle>
  </CardHeader>
  <CardContent>{/* Content */}</CardContent>
</Card>
```

### Icon Badge (Section Headers)
```tsx
<div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 
                text-white shadow-lg shadow-primary/25">
  <HugeiconsIcon icon={icon} strokeWidth={2.5} className="size-5" />
</div>
```

Variant for emerald:
```tsx
<div className="bg-gradient-to-br from-emerald-500 to-emerald-600 
                shadow-lg shadow-emerald-500/25">
```

### Button
```tsx
// Primary (default)
<Button className="rounded-xl shadow-md shadow-primary/25 
                   hover:shadow-lg hover:shadow-primary/30 
                   hover:-translate-y-0.5 active:translate-y-0">

// Outline
<Button variant="outline" 
        className="border-border bg-background/50 
                   hover:bg-accent hover:border-primary/30">

// Ghost
<Button variant="ghost" className="hover:bg-accent">

// Sizes: xs (h-7), sm (h-9), default (h-10), lg (h-12)
```

### Input
```tsx
<Input className="h-10 rounded-xl border-border/60 bg-background/80
                  focus-visible:border-primary/50 
                  focus-visible:shadow-[0_0_0_4px_oklch(0.55_0.26_280_/_0.08)]
                  hover:border-border transition-all duration-200" />
```

### Badge
```tsx
// Default
<Badge variant="outline" className="text-xs" />

// Colored
<Badge className="bg-indigo-50 text-indigo-600 border-indigo-200" />
```

## Transitions & Animations

```tsx
// Standard hover transition
transition-all duration-200 ease-out

// Shadow elevation on hover
hover:shadow-lg transition-shadow duration-300

// Lift effect
hover:-translate-y-0.5 transition-transform duration-200

// Color transitions
transition-colors duration-200
```

## Layout Patterns

### Home Layout (2-column)
```tsx
<div className="w-full max-w-[2000px] mx-auto h-screen overflow-hidden">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 
                  bg-gradient-to-br from-background via-background to-primary/5">
    {/* Form column */}
    {/* Preview column */}
  </div>
</div>
```

### Section Card with Icon
```tsx
<SectionCard className="p-7">
  <SectionCardHeader>
    <SectionCardTitle icon={icon} iconVariant="primary">
      Section Name
    </SectionCardTitle>
    {/* Actions */}
  </SectionCardHeader>
  {/* Content */}
</SectionCard>
```

## Icons

Use **Hugeicons** (`@hugeicons/react`) for all UI icons:
```tsx
import { HugeiconsIcon } from '@hugeicons/react';
import { UserIcon } from '@hugeicons/react-pro-icons';

<HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-5" />
```

## ShadCN Integration

### Installation

Install ShadCN components using:

```bash
pnpm dlx shadcn@latest add [component-name]
```

Replace `[component-name]` with the component you want (e.g., `button`, `dialog`, `card`).

### Configuration

Configuration is defined in `components.json`:

- Style: radix-mira with zinc base color, indigo theme
- Icon library: Hugeicons
- Path aliases match `tsconfig.json` paths

### ShadCN Styling

- ShadCN styles are imported in `app/globals.css` via `@import 'shadcn/tailwind.css'`
- CSS variables are used for theming
- Components support dark mode via `next-themes`

### Utility Functions

- `@/lib/utils` contains `cn()` helper for className merging
- Use `cn()` to merge Tailwind classes conditionally

## File Locations

- `app/globals.css` - CSS variables, theme tokens
- `components/ui/` - ShadCN component primitives
- `components/ui/section-card.tsx` - Section card patterns
- `components/ui/home-layout.tsx` - Layout wrapper
