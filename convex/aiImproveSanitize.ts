/** Placeholder tokens that should never reach resume edits. */
const PLACEHOLDER_TOKEN_PATTERN =
  /\[(?:x|x%|xx|xxx|number|metric|percentage|percent|amount|figure|value|insert[^\]]*)\]/iu;

/** Returns true when AI output contains unresolved resume placeholder text. */
export function hasUnresolvedPlaceholder(value: string): boolean {
  return PLACEHOLDER_TOKEN_PATTERN.test(value);
}

/** Returns a clean rewrite value, or null when output should be ignored. */
export function sanitizeImproveRewrite(value: string | undefined): string | null {
  const trimmed = value?.trim();

  if (!trimmed || hasUnresolvedPlaceholder(trimmed)) {
    return null;
  }

  return trimmed;
}
