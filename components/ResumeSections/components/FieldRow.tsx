interface FieldRowProps {
  cols?: 'full' | 'half' | 'third' | 'quarter';
  children: React.ReactNode;
}

export default function FieldRow({ cols = 'full', children }: FieldRowProps) {
  const gridColsClass = {
    full: 'grid-cols-1',
    half: 'grid-cols-2',
    third: 'grid-cols-3',
    quarter: 'grid-cols-4'
  }[cols];

  return <div className={`grid ${gridColsClass} gap-4`}>{children}</div>;
}
