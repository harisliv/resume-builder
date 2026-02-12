# PDF Styling Guide

Complete guide for creating PDF documents with `@react-pdf/renderer`.

## Document Structure

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import '../fonts'; // Always import fonts first

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
});

export const MyDocument = ({ data }: { data: TResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Content */}
    </Page>
  </Document>
);
```

## Critical Rules

1. **Font Registration**: Always `import '../fonts';` - without this you get "Font family not registered" errors
2. **Page Size**: Always use `size="A4"` for standard resumes
3. **Section Wrapping**: Use `wrap={false}` on section headers to prevent splitting across pages
4. **SSR**: PDFViewer must use `dynamic` with `ssr: false`

## SVG Support

React-PDF supports these SVG elements:
- `<Svg>`, `<Rect>`, `<Circle>`, `<Path>`, `<Line>`, `<Polygon>`, `<G>`, `<Defs>`, `<LinearGradient>`, `<Stop>`

### SVG Best Practices

- Use `viewBox="0 0 24 24"` for consistent scaling
- Set `strokeLinecap="round"` and `strokeLinejoin="round"` for smooth strokes
- Match `strokeWidth` to icon size: 1.5 for contact icons, 2 for section icons

## Icon System

All icons in `lib/ResumePDF/icons/`:

```typescript
interface IconProps {
  size?: number;        // 12 (contact), 14 (section), 10 (utility)
  color?: string;       // Hex or named color
  strokeWidth?: number; // 1.5 (contact), 2 (section)
  fill?: string;        // 'none' for outline
  style?: object;       // Additional styles
}
```

### Icon Categories

**Contact** (size=12, strokeWidth=1.5): MailIcon, PhoneIcon, MapPinIcon, LinkedInIcon, GlobeIcon, GitHubIcon
**Section** (size=14, strokeWidth=2): BriefcaseIcon, GraduationCapIcon, SparklesIcon
**Utility** (size=10): ArrowRightIcon, CalendarIcon, BuildingIcon

## Color Palettes

### Aesthetic Style
```typescript
{
  background: '#fafafa',
  surface: '#ffffff',
  primary: '#6366f1',
  primaryLight: '#818cf8',
  secondary: '#ec4899',
  accent: '#14b8a6',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  border: '#e2e8f0',
  cardBg: '#f8fafc',
}
```

## Layout Patterns

### Card
```typescript
{
  backgroundColor: colors.surface,
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: colors.border,
}
```

### Contact Badge
```typescript
{
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  backgroundColor: colors.surface,
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: colors.border,
}
```

### Skill Pill
```typescript
{
  fontSize: 9,
  color: colors.primary,
  backgroundColor: '#eef2ff',
  paddingVertical: 5,
  paddingHorizontal: 12,
  borderRadius: 16,
  borderWidth: 1,
  borderColor: '#e0e7ff',
}
```

### Section Header
```typescript
{
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginBottom: 14,
}
```

## Creating New Styles

1. Create file: `lib/ResumePDF/documents/{Style}Document.tsx`
2. Import fonts: `import '../fonts';`
3. Define color palette
4. Create styles with `StyleSheet.create()`
5. Export from `lib/ResumePDF/documents/index.ts`
6. Create showcase: `app/{style}-showcase/`

## Icon Conventions

- **Width/Height**: 24x24 for standard icons
- **ViewBox**: 0 0 24 24
- **Fill**: none (outline style)
- **Stroke**: currentColor (inherits from parent)
- **Stroke Width**: 2 (adjust to 1.5 for contact, 2 for section)
- **Stroke Linecap**: round
- **Stroke Linejoin**: round

### Icon Component Example

```tsx
import { Svg, Path, Rect } from '@react-pdf/renderer';

export const BriefcaseIcon = ({
  size = 14,
  color = '#ffffff',
  strokeWidth = 2,
  fill = 'none',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect
      x="2" y="7" width="20" height="14" rx="2" ry="2"
      stroke={color} strokeWidth={strokeWidth} fill={fill}
    />
    <Path
      d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
      stroke={color} strokeWidth={strokeWidth} fill="none"
    />
  </Svg>
);
```

## File Locations

- `lib/ResumePDF/icons/` - All PDF icons
- `lib/ResumePDF/documents/` - All document styles
- `app/icons-showcase/` - Showcase pages