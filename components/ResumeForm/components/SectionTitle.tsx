interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h3 className="text-foreground flex items-center gap-3 text-lg font-bold tracking-tight">
      <span className="bg-primary h-6 w-1 rounded-full" />
      {children}
    </h3>
  );
}
