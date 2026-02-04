# ModernDocument Component Architecture

## Component Hierarchy

```mermaid
flowchart TB
    subgraph ModernDocument
        direction TB
        Header[Header Section]
        Summary[Summary Section]
        
        subgraph ExperienceSection[Experience Section]
            direction TB
            ExpHeader[Section Header<br/>GradientIconBox + Title]
            TimelineContainer[Timeline Container]
            
            subgraph Timeline[Timeline Connector]
                direction TB
                VLine[Vertical Line<br/>with Gradient Fade]
                EP1[Entry Point 1]
                EP2[Entry Point 2]
                EP3[Entry Point 3]
            end
            
            subgraph ExperienceCards[Experience Cards]
                direction TB
                Card1[ModernExperienceCard 1]
                Card2[ModernExperienceCard 2]
                Card3[ModernExperienceCard 3]
            end
            
            VLine --- EP1
            VLine --- EP2
            VLine --- EP3
            EP1 --- Card1
            EP2 --- Card2
            EP3 --- Card3
        end
        
        subgraph EducationSection[Education Section]
            direction TB
            EduHeader[Section Header<br/>GradientIconBox + Title]
            EduCards[Education Cards]
        end
        
        subgraph SkillsSection[Skills Section]
            direction TB
            SkillsHeader[Section Header<br/>GradientIconBox + Title]
            SkillsContainer[Skills Tags Container]
        end
        
        Header --> Summary
        Summary --> ExperienceSection
        ExperienceSection --> EducationSection
        EducationSection --> SkillsSection
    end
```

## Timeline Connector Detail

```mermaid
flowchart LR
    subgraph TimelineDetail[Timeline Connector - Side View]
        direction TB
        
        subgraph Connector[Vertical Connector]
            direction TB
            S[Solid Section<br/>80% height<br/>Full Opacity]
            G[Gradient Fade Section<br/>20% height<br/>Opacity 1 → 0]
        end
        
        subgraph Entries[Entry Connections]
            direction TB
            E1[──┬── Entry 1<br/>90° corner]
            E2[──┬── Entry 2<br/>90° corner]
            E3[──┬── Entry 3<br/>90° corner]
        end
        
        S --> G
        S -.-> E1
        S -.-> E2
        S -.-> E3
    end
```

## Section Header Icon Structure

```mermaid
flowchart TB
    subgraph SectionCardTitle[Web: SectionCardTitle]
        direction TB
        Container1[40x40px Container<br/>p-2.5 padding<br/>rounded-xl]
        Gradient1[Gradient: to-br<br/>from-primary to-primary/80]
        Shadow1[Shadow: lg<br/>primary/25]
        Icon1[Icon: 20x20px<br/>strokeWidth: 2.5]
        
        Container1 --> Gradient1
        Gradient1 --> Shadow1
        Shadow1 --> Icon1
    end
    
    subgraph GradientIconBox[PDF: GradientIconBox]
        direction TB
        Container2[40x40px Container<br/>12px border radius]
        Gradient2[SVG LinearGradient<br/>135° diagonal]
        Shadow2[SVG Filter Shadow<br/>or overlay]
        Icon2[Icon: 20x20px<br/>scaled rendering]
        
        Container2 --> Gradient2
        Gradient2 --> Shadow2
        Shadow2 --> Icon2
    end
    
    SectionCardTitle -.->|Visual Parity| GradientIconBox
```

## Style Value Mapping

| Property | Web (Tailwind) | PDF (react-pdf) |
|----------|---------------|-----------------|
| Container Size | `size-10` (40px) | `width: 40, height: 40` |
| Padding | `p-2.5` (10px) | Centered with flex |
| Border Radius | `rounded-xl` (~16px) | `borderRadius: 12` (PDF scale) |
| Gradient | `bg-gradient-to-br` | `LinearGradient x1=0,y1=0,x2=1,y2=1` |
| Shadow | `shadow-lg shadow-primary/25` | SVG filter or opacity layer |
| Icon Size | `size-5` (20px) | `width: 20, height: 20` |
| Gap | `gap-3` (12px) | `gap: 12` |

## Data Flow

```mermaid
flowchart LR
    subgraph Data[Resume Data]
        PI[Personal Info]
        EXP[Experience Array]
        EDU[Education Array]
        SK[Skills Array]
    end
    
    subgraph Props[Component Props]
        direction TB
        P1[data: TResumeData]
        P2[styles: ReturnType<typeof createStyles>]
        P3[colors: ReturnType<typeof getColors>]
    end
    
    subgraph Components[PDF Components]
        direction TB
        C1[ModernDocument]
        C2[GradientIconBox]
        C3[TimelineConnector]
        C4[ModernExperienceCard]
        C5[ModernEducationCard]
    end
    
    Data --> Props
    Props --> C1
    C1 --> C2
    C1 --> C3
    C1 --> C4
    C1 --> C5
```

## Timeline Layout Dimensions

```
┌─────────────────────────────────────────────────────────────┐
│ Page Margin (32px)                                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Section Header                                       │   │
│  │ ┌──────┬─────────────────────┐                       │   │
│  │ │ Icon │ Title               │                       │   │
│  │ │ 40px │                     │                       │   │
│  │ └──────┘                     │                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Timeline Container                                   │   │
│  │ ┌────────┬─────────────────────────────────────────┐ │   │
│  │ │        │ ┌─────────────────────────────────────┐ │ │   │
│  │ │   ●────┤ │ Experience Card 1                   │ │ │   │
│  │ │   │    │ │                                     │ │ │   │
│  │ │   │    │ └─────────────────────────────────────┘ │ │   │
│  │ │   │    │                                       │ │   │
│  │ │   ●────┤ ┌─────────────────────────────────────┐ │ │   │
│  │ │   │    │ │ Experience Card 2                   │ │ │   │
│  │ │   │    │ │                                     │ │ │   │
│  │ │   │    │ └─────────────────────────────────────┘ │ │   │
│  │ │   │    │                                       │ │   │
│  │ │   ●────┤ ┌─────────────────────────────────────┐ │ │   │
│  │ │   │    │ │ Experience Card 3                   │ │ │   │
│  │ │  ╱     │ │                                     │ │ │   │
│  │ │ ╱      │ └─────────────────────────────────────┘ │ │   │
│  │ │╱       │                                       │ │   │
│  │ ├────────┘                                       │ │   │
│  │ │ Gradient Fade (transparent)                    │ │   │
│  │ └────────────────────────────────────────────────┘ │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  Timeline Line: 2px width                                   │
│  Connection Point: 8px horizontal from line                 │
│  Entry Point Marker: 6px diameter                           │
│  Card Offset from line: 20px                                │
└─────────────────────────────────────────────────────────────┘
```

## Key Implementation Notes

1. **Sharp Corners**: Use SVG `Path` with explicit line commands instead of `Rect` with rounded corners
2. **Gradient Fade**: Linear gradient with opacity stops from 1 to 0 over last 20-30% of line
3. **Dynamic Height**: Timeline height calculated based on number of experience entries
4. **Icon Consistency**: All section icons use same GradientIconBox component with different colors
5. **Color Palette**: Icons use section-specific colors (experience, education, skills from palette)
