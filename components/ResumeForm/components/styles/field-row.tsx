/** Grid row for laying out form fields in columns. */
export default function FieldRow({
  cols = 'full',
  children
}: {
  cols?: 'full' | 'half' | 'third' | 'quarter';
  children: React.ReactNode;
}) {
  const gridColsClass = {
    full: 'grid-cols-1',
    half: 'grid-cols-1 md:grid-cols-2',
    third: 'grid-cols-1 md:grid-cols-3',
    quarter: 'grid-cols-1 md:grid-cols-4'
  }[cols];

  return <div className={`grid ${gridColsClass} gap-4`}>{children}</div>;
}
