/** Styled heading for form sections (e.g. "Work Experience", "Education"). */
export default function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-3">
      <span className="h-6 w-1 rounded-full bg-primary" />
      {children}
    </h3>
  );
}
