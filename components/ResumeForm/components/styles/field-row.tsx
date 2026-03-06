/** Grid row for laying out form fields in columns. */
export default function FieldRow({
  cols = 'full',
  children
}: {
  cols?: 'full' | 'half' | 'third' | 'quarter';
  children: React.ReactNode;
}) {
  /**
   * Container queries keep columns based on actual panel width
   * (not viewport width), preventing clipping in narrow tab/sidebar shells.
   */
  const gridColsClass = {
    full: 'grid-cols-1',
    half: 'grid-cols-1 @2xl:grid-cols-2',
    third: 'grid-cols-1 @3xl:grid-cols-3',
    quarter: 'grid-cols-1 @2xl:grid-cols-2 @4xl:grid-cols-4'
  }[cols];

  return <div className={`@container grid ${gridColsClass} gap-4`}>{children}</div>;
}
