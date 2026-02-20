# TypeScript Conventions

## Naming Conventions

- **Types**: Prefix with `T` (e.g., `TResumeData`, `TDocumentStyle`)
- **Interfaces**: Prefix with `I` (e.g., `IResumeDocumentProps`, `IResumePreviewProps`)
- **Enums**: Prefix with `E` (e.g., `EDocumentStyle`, `ETheme`)

## Type Safety

- Strict TypeScript is enabled
- Never use type assertions - if you cannot find another way, ask before using them
- Consistent type imports are enforced (use `import type` for type-only imports)
- Type inference is preferred, but explicit types should be used for public APIs and complex structures
- React component props should always be explicitly typed in the same file as the component, if the type is being used only there
- Reusable types should be defined in the `types/` directory and imported directly from files

## Component Location & Separation of Concerns

Split features into two layers for readability:

### Smart Components (Logic + Composition)

- **Purpose**: Business logic + compose styled components
- **Contains**: Hooks, state, event handlers, validation, component composition
- **Does NOT contain**: Long className strings (3+ utilities)
- **File naming**: PascalCase (e.g., `Education.tsx`, `Experience.tsx`)
- **Location**: Feature directory root (e.g., `components/ResumeForm/components/`)

### Styled Components (Styling)

- **Purpose**: Encapsulate all Tailwind classes
- **Contains**: Pre-styled wrappers with all classes baked in
- **Does NOT contain**: Business logic
- **File naming**: kebab-case (e.g., `education-accordion.tsx`, `form-item-card.tsx`)
- **Key Rule**: All className strings with 3+ utilities go here
- **Location**: `styles/` folder in feature directory, or `@/components/styles/` if shared

### Shadcn Components (UI)

- **Purpose**: Expose ShadCN UI components to the app, DONT EDIT THESE COMPONENTS, ONLY USE THEM
- **Contains**: ShadCN UI components
- **Does NOT contain**: Business logic
- **File naming**: as installed by shadcn, e.g. `button.tsx`, `input.tsx`, `card.tsx`, etc.
- **Location**: `ui/` folder in feature directory

### Hierarchy

```
Smart Component (Education.tsx) [logic + composition]
└─> Styled Components (education-accordion.tsx) [all classes]
    └─> Base Components (accordion.tsx from shadcn)
```

### When to refactor

- **Under ~80 lines**: Inline conditionals, classNames, and simple logic are fine. Don't extract prematurely.
- **Over ~80 lines**: Start breaking into smaller smart components and styled primitives using the patterns below.

### Keeping components readable (large components)

**Problem**: Large components with repeated conditionals and long classNames.

**Solution**: Extract conditionals into smart wrappers. Extract 3+ utility classNames into styled components.

- **Goal**: Top-level component reads like an outline (composition only).
- **Smart components**: Can be small or large, but should mostly orchestrate + compose.
- **When it grows**: Split by responsibility into smaller smart components (wrappers) that each handle one concern (e.g., a conditional branch, a section, a stateful interaction).
- **Styling stays out**: Any non-trivial Tailwind blocks (3+ utilities) live in styled components.
- **Rule of thumb**: Conditionals + styles move down; the main component becomes a clean tree of named parts.

**Example**:

❌ **Before**:

```tsx
export function AppSidebar({ selectedId, onSelect }) {
  const { isCollapsed } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={cn(
          isCollapsed ? 'flex flex-col items-center gap-3 p-3' : 'p-4'
        )}
      >
        <SidebarHeaderRow />
        <ResumeSelector selectedId={selectedId} onSelect={onSelect} />
      </SidebarHeader>

      <SidebarContent>
        {isCollapsed ? (
          <Selectors />
        ) : (
          <CustomizeGroup>
            <CustomizeGroupLabel>Customize</CustomizeGroupLabel>
            <Selectors />
          </CustomizeGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
```

✅ **After**:

```tsx
export function AppSidebar({ selectedId, onSelect }) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <ResumeSelector selectedId={selectedId} onSelect={onSelect} />
      </SidebarHeader>
      <SidebarBody>
        <Selectors />
      </SidebarBody>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

// styles/sidebar-layout.styles.tsx - single component with collapsed prop
export function LayoutHeader({ collapsed, className, ...props }) {
  return (
    <SidebarHeader
      className={cn(
        collapsed ? 'flex flex-col items-center gap-3 p-3' : 'p-4',
        className
      )}
      {...props}
    />
  );
}

// SidebarHeader.tsx - smart wrapper uses styled component with prop
export function SidebarHeader({ children }) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  return (
    <LayoutHeader collapsed={isCollapsed}>
      <HeaderRow collapsed={isCollapsed}>
        {!isCollapsed && <HeaderTitle>My Resumes</HeaderTitle>}
        <ToggleButton collapsed={isCollapsed} onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </ToggleButton>
      </HeaderRow>
      {children}
    </LayoutHeader>
  );
}
```

**Result**: Main component has zero conditionals, zero long classNames.

### Styled component pattern for state-driven styles

Styled components handle conditional classes via `cn()` and a prop — **never** via separate variant components.

```tsx
// styles/sidebar-layout.styles.tsx — ONE component, cn() switches classes
export function LayoutHeader({ collapsed, className, ...props }) {
  return (
    <SidebarHeader
      className={cn(
        collapsed ? 'flex flex-col items-center gap-3 p-3' : 'p-4',
        className
      )}
      {...props}
    />
  );
}
```

Smart components read context once, pass it down as a prop:

```tsx
// components/SidebarHeader.tsx — single smart component, not split into Header + HeaderRow + ToggleButton
export function SidebarHeader({ children }) {
  const { isCollapsed, toggleSidebar } = useSidebar();
  return (
    <LayoutHeader collapsed={isCollapsed}>
      <HeaderRow collapsed={isCollapsed}>
        {!isCollapsed && <HeaderTitle>My Resumes</HeaderTitle>}
        <ToggleButton collapsed={isCollapsed} onClick={toggleSidebar}>
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </ToggleButton>
      </HeaderRow>
      {children}
    </LayoutHeader>
  );
}
```

### Anti-patterns to avoid

- **Never create Collapsed/Expanded variant pairs** (e.g., `CollapsedHeader` / `ExpandedHeader`). Use a single component with `cn()` + a `collapsed` prop.
- **Never create thin wrapper components that only switch between styled variants**. If a component's only job is `isCollapsed ? <A> : <B>`, the styled component should accept `collapsed` as a prop.
- **Never use conditional component assignment** (e.g., `const Btn = isCollapsed ? CollapsedBtn : ExpandedBtn`). Use a single component with props.
- **Never use aliased re-exports** (e.g., `export { Foo as Bar } from './foo'`). Import the real name directly.
- **Never split a tightly-coupled chain into separate files** (e.g., SidebarHeader → SidebarHeaderRow → SidebarToggleButton). Merge them into one smart component that composes styled primitives.

## Path Aliases

Use `@/` prefix for imports (configured in `tsconfig.json` and `components.json`):

- `@/components` → `./components`
- `@/hooks` → `./hooks`
- `@/types` → `./types`
- `@/lib` → `./lib`
- `@/ui` → `./components/ui`

## Barrel Exports

- **Index only for single export**: if a folder has multiple exports, import from files directly
- **Avoid runtime barrels**: prefer direct imports to reduce cycles and load cost

## General Patterns

- Always destructure values that you need to use in a component
- Always remove unused imports and unused code when editing a file
- When a variable is exposed through context dont prop drill it in the child components, use the context directly in the child components instead
- Dont use type assertion (as) instead create a zod type and get the typeGuard of this type to check if the value is of the expected type
