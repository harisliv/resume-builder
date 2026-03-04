/** Parse "Jan 2020" into a sortable timestamp. Returns 0 for empty/invalid. */
export function parseDate(str: string | undefined): number {
  if (!str) return 0;
  const parsed = Date.parse(str.trim());
  return Number.isNaN(parsed) ? 0 : parsed;
}
