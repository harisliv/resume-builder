/** Ordered skills shape used across app, preview, and PDF. */
export type TSkillCategory = { name: string; values: { value: string }[] };
export type TSkillsByCategory = TSkillCategory[];

/** Returns categories with at least one non-empty skill. */
export function getSkillEntries(
  skills?: TSkillsByCategory
): [string, string[]][] {
  if (!skills) return [];
  return skills
    .map((category) => [
      category.name.trim(),
      category.values.map((v) => v.value.trim()).filter(Boolean)
    ] as [string, string[]])
    .filter(([category, values]) => category && values.length > 0);
}

/** Returns true when at least one non-empty categorized skill exists. */
export function hasCategorizedSkills(skills?: TSkillsByCategory): boolean {
  return getSkillEntries(skills).length > 0;
}

/** Flattens categorized skills into one ordered list. */
export function flattenCategorizedSkills(skills?: TSkillsByCategory): string[] {
  return getSkillEntries(skills).flatMap(([, values]) => values);
}
