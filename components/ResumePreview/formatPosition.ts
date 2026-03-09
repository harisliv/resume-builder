/**
 * Formats position with optional project name.
 * Returns "Position - Project Name" or just "Position".
 */
export function formatPosition(
  position?: string,
  projectName?: string
): string | undefined {
  if (!position) return undefined;
  if (projectName?.trim()) return `${position} - ${projectName.trim()}`;
  return position;
}
