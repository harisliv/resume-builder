/** Ordered skills shape used across app, preview, and PDF. */
export type TSkillCategory = { name: string; skills: string[] };
export type TSkillsByCategory = TSkillCategory[];

/** Returns categories with at least one non-empty skill. */
export function getSkillEntries(
  skills?: TSkillsByCategory
): [string, string[]][] {
  if (!skills) return [];
  return skills
    .map((category) => [
      category.name.trim(),
      category.skills.map((value) => value.trim()).filter(Boolean)
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
