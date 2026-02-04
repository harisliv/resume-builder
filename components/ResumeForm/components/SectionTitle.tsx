interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-3">
      <span className="h-6 w-1 rounded-full bg-primary" />
      {children}
    </h3>
  );
}
