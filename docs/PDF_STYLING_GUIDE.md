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
3. **SSR**: PDFViewer must use `dynamic` with `ssr: false`
4. **Header + First Item Rule**: Use React-PDF built-ins to prevent orphan titles:
   - Wrap section header + first item in `<View wrap={false}>...</View>`
   - Add `minPresenceAhead` on section headers to force next-page break when only title fits
5. **Preview/PDF Parity**: HTML preview and downloaded PDF are separate code paths (`components/ResumePreview/*` vs `lib/ResumePDF/documents/*`). Any visual change must be mirrored in both, or compare pages will drift.

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
  size?: number; // 12 (contact), 14 (section), 10 (utility)
  color?: string; // Hex or named color
  strokeWidth?: number; // 1.5 (contact), 2 (section)
  fill?: string; // 'none' for outline
  style?: object; // Additional styles
}
```

### Icon Categories

**Contact** (size=12, strokeWidth=1.5): MailIcon, PhoneIcon, MapPinIcon, LinkedInIcon, GlobeIcon, GitHubIcon
**Section** (size=14, strokeWidth=2): BriefcaseIcon, GraduationCapIcon, SparklesIcon
**Utility** (size=10): ArrowRightIcon, CalendarIcon, BuildingIcon

## Color Palettes

Palettes are defined in `types/documentStyle.ts` → `COLOR_PALETTES`. Each palette provides four section accent colors: `summary`, `experience`, `education`, `skills`.

Available palettes: `aesthetic`, `ocean`, `forest`, `sunset`, `midnight`, `rose`, `monochrome`.

`getColors(paletteId)` in `lib/ResumePDF/ResumeStyles.ts` resolves a palette ID into the full color object used by documents (primary, secondary, accent, text colors, borders, etc.).

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

### Aesthetic (modern) Preview/PDF Parity Notes

```typescript
{
  // System behavior
  defaultPalette: 'aesthetic',
  stylePaletteRule: 'use selected palette from sidebar for all styles',
  paletteMapping: {
    primary: 'summary',
    secondary: 'experience',
    accent: 'education',
    primaryLight: 'skills'
  },

  // Experience date row
  calendarIconColor: colors.secondary, // #ec4899
  dateTextColor: colors.accent, // #14b8a6
  dateTextWeight: 700,
  dateSeparator: '→', // arrow must be pink (#ec4899)

  // Experience position marker
  markerWidth: 1,
  markerHeight: 10, // short accent
  markerRadius: 0, // no rounded corners
  markerColor: colors.primary,

  // Education parity with Experience (date column on right)
  educationDateLayout: 'right-aligned date block',
  educationDateIconColor: colors.secondary,
  educationDateTextColor: colors.accent,
  educationLocationColor: colors.textMuted,

  // Skills parity
  skillPillBg: colors.primaryLight, // #818cf8
  skillPillText: '#eef2ff',
  skillLayout: 'single wrapped container (do not split first item)'
}
```

## Style → Document Mapping

| Style ID    | Document Component  | File                                            |
| ----------- | ------------------- | ----------------------------------------------- |
| `modern`    | `AestheticDocument` | `lib/ResumePDF/documents/AestheticDocument.tsx` |
| `classic`   | `ClassicDocument`   | `lib/ResumePDF/documents/ClassicDocument.tsx`   |
| `bold`      | `BoldDocument`      | `lib/ResumePDF/documents/BoldDocument.tsx`      |
| `executive` | `ExecutiveDocument` | `lib/ResumePDF/documents/ExecutiveDocument.tsx` |

HTML preview counterparts live in `components/ResumePreview/` (`AestheticStyle.tsx`, `ClassicStyle.tsx`, `BoldStyle.tsx`, `ExecutiveStyle.tsx`).

Routing is handled in `lib/ResumePDF/ResumeDocument.tsx` — the switch maps `documentStyle.style` to the correct component.

## Creating New Styles

1. Create PDF document: `lib/ResumePDF/documents/{Style}Document.tsx`
2. Import fonts: `import '../fonts';`
3. Define color palette
4. Create styles with `StyleSheet.create()`
5. Create HTML preview: `components/ResumePreview/{Style}Style.tsx`
6. Add switch cases in `lib/ResumePDF/ResumeDocument.tsx` and `components/ResumePreview/ResumePreview.tsx`
7. Add style ID to `DOCUMENT_STYLES` in `types/documentStyle.ts`
8. Use `/compare` to verify preview/PDF parity across palettes and fonts

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
  fill = 'none'
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
    <Path
      d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
    />
  </Svg>
);
```

## File Locations

- `lib/ResumePDF/icons/` - PDF SVG icons
- `lib/ResumePDF/documents/` - PDF document components (Aesthetic, Classic, Bold, Executive)
- `lib/ResumePDF/ResumeDocument.tsx` - Style router / switch
- `components/ResumePreview/` - HTML preview components per style
- `types/documentStyle.ts` - Palettes, fonts, style IDs
- `app/compare/` - Side-by-side preview vs PDF comparison (tabbed, all styles/palettes/fonts)
- `app/icons-showcase/` - Icon showcase page
