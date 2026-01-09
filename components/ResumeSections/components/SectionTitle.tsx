interface SectionTitleProps {
  children: React.ReactNode;
}

export default function SectionTitle({ children }: SectionTitleProps) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}
