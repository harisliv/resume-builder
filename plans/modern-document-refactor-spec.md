# ModernDocument.tsx Refactoring Specification

## Overview
Refactor the ModernDocument.tsx component to achieve visual parity with the landing page design system, specifically synchronizing section header icons with SectionCardTitle styling and implementing an enhanced timeline aesthetic with continuous connector lines and gradient masks.

## 1. Section Header Icon Synchronization

### Current SectionCardTitle (Web UI) Specifications
```tsx
// From components/ui/section-card.tsx
<div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 
                text-white shadow-lg shadow-primary/25">
  <HugeiconsIcon icon={icon} strokeWidth={2.5} className="size-5" />
</div>
```

**Measurements:**
- Container padding: `p-2.5` = 10px
- Icon size: `size-5` = 20px
- Total container size: 40x40px (20px icon + 10px padding each side)
- Border radius: `rounded-xl` ≈ 12-16px (using 12px for PDF)
- Gradient direction: `to-br` (top-left to bottom-right, 135deg)
- Shadow: `shadow-lg shadow-primary/25`

### PDF Implementation Strategy

#### GradientIconBox Updates
- **Container Size**: 40x40px (up from 26x26px)
- **Border Radius**: 12px (sharp 90-degree corners on SVG path)
- **Gradient Direction**: Update from horizontal to diagonal (135deg)
- **Shadow**: Implement using SVG filter or semi-transparent layer
- **Icon Size**: 20x20px (up from 14x14px)

**SVG Path for Rounded Square:**
```
M 12 0 H 28 Q 40 0 40 12 V 28 Q 40 40 28 40 H 12 Q 0 40 0 28 V 12 Q 0 0 12 0 Z
```

**Gradient Definition:**
```svg
<LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
  <Stop offset="0%" stopColor={colorStart} />
  <Stop offset="100%" stopColor={colorEnd} stopOpacity={0.8} />
</LinearGradient>
```

## 2. Timeline Connector Design

### Visual Requirements
1. **Continuous vertical line** connecting all employment entries
2. **Sharp 90-degree angular corners** at each entry connection point (no anti-aliasing/rounding)
3. **Vertical gradient mask** fading from full opacity to completely transparent at terminal end

### Implementation Approach

#### SVG-Based Timeline
Since react-pdf uses SVG primitives, the timeline will be implemented using:
- `<Line />` or `<Path />` for the vertical connector
- `<LinearGradient />` with opacity stops for the fade effect
- Precise coordinate calculations for 90-degree angles

#### Structure
```
Timeline Container (View)
├── Vertical Connector Line (SVG)
│   ├── Solid portion (80% height)
│   └── Gradient fade portion (20% height)
└── Experience Entries
    ├── Entry 1 with connection point
    ├── Entry 2 with connection point
    └── Entry 3 with connection point
```

#### Gradient Mask Specification
```svg
<LinearGradient id="timelineFade" x1="0" y1="0" x2="0" y2="1">
  <Stop offset="0%" stopColor={colors.experience} stopOpacity={1} />
  <Stop offset="70%" stopColor={colors.experience} stopOpacity={1} />
  <Stop offset="100%" stopColor={colors.experience} stopOpacity={0} />
</LinearGradient>
```

#### Connection Point Design
- Horizontal line segment intersects vertical connector at 90 degrees
- No rounded joins - sharp corners only
- Length: 8px horizontal from vertical line
- Positioned at vertical center of each entry card

## 3. Component Architecture Changes

### Modified Files
1. **lib/ResumePDF/components/GradientIconBox.tsx**
   - Update dimensions and styling
   - Add shadow support
   - Adjust gradient direction

2. **lib/ResumePDF/components/TimelineConnector.tsx** (NEW)
   - Vertical line with gradient fade
   - Entry point connectors
   - Dynamic height calculation

3. **lib/ResumePDF/ResumeStyles.ts**
   - Add timeline-related styles
   - Update experience item layout
   - Add gradient definitions

4. **lib/ResumePDF/components/ModernExperienceCard.tsx**
   - Remove individual timelineDot
   - Adjust layout for timeline connector
   - Maintain wrap behavior

5. **lib/ResumePDF/documents/ModernDocument.tsx**
   - Integrate updated GradientIconBox
   - Add TimelineConnector wrapper
   - Update section header spacing

### Data Flow Preservation
- All existing props interfaces remain unchanged
- No changes to data structure or parsing
- Component composition pattern maintained

## 4. Style Specifications

### Color Mapping
| Element | Color Source | Value (Ocean Palette) |
|---------|-------------|----------------------|
| Icon gradient start | colors.experience | #0891b2 |
| Icon gradient end | colors.experience (80%) | #0891b2CC |
| Timeline line | colors.experience | #0891b2 |
| Timeline fade end | transparent | #0891b200 |

### Spacing & Layout
| Element | Value |
|---------|-------|
| Section header gap | 12px (maintained) |
| Icon to title spacing | 12px (gap-3 equivalent) |
| Timeline left offset | 20px from left margin |
| Timeline line width | 2px |
| Connection point length | 8px horizontal |
| Entry vertical spacing | 16px between cards |

## 5. Technical Constraints

### React-PDF Limitations
- Limited CSS support - use StyleSheet only
- SVG elements must use react-pdf primitives
- No box-shadow CSS property - simulate with SVG
- Gradients must be defined in <Defs />

### Sharp Corners Implementation
React-PDF SVG may anti-alias by default. To ensure sharp 90-degree corners:
- Use explicit Path commands (L for lines, not curves)
- Avoid rx/ry parameters on Rect elements
- Use stroke-linecap="butt" (default)
- Use stroke-linejoin="miter" (default)

## 6. Visual Parity Checklist

- [ ] Icon container size matches (40x40px)
- [ ] Icon size matches (20x20px)
- [ ] Border radius equivalent (12px ≈ rounded-xl)
- [ ] Gradient direction matches (to-br / 135deg)
- [ ] Shadow effect present (even if simplified)
- [ ] Timeline has continuous vertical line
- [ ] Connection points have sharp 90° angles
- [ ] Gradient fade terminates at transparent
- [ ] Spacing and rhythm consistent with design system

## 7. Implementation Order

1. Update GradientIconBox with new dimensions and styling
2. Create TimelineConnector component
3. Add timeline styles to ResumeStyles.ts
4. Update ModernExperienceCard layout
5. Integrate into ModernDocument.tsx
6. Verify all icon components render correctly at new size
