import type { TAiSuggestions, TSuggestionSelection } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { buildHighlightMatchMaps } from './highlightMatching';

/**
 * Applies user selection to produce final TAiSuggestions.
 * Unchecked fields fall back to the current resume value instead of being removed.
 */
export function buildFilteredSuggestions(
  suggestions: TAiSuggestions,
  selection: TSuggestionSelection,
  currentData: TResumeForm
): TAiSuggestions {
  const currentSkillMap = new Map(
    (currentData.skills ?? []).map((c) => [
      c.name.trim(),
      c.values.map((v) => v.value.trim())
    ])
  );

  const filteredSkills = suggestions.skills
    ?.map((category, categoryIdx) => {
      const selected = selection.skills[categoryIdx]?.selected ?? [];
      const currentValues = currentSkillMap.get(category.name.trim()) ?? [];
      const currentSet = new Set(currentValues.map((v) => v.toLowerCase()));

      return {
        id: category.id,
        name: category.name,
        values: category.values.filter((skill, skillIdx) => {
          if (selected[skillIdx] ?? true) return true;
          return currentSet.has(skill.value.toLowerCase());
        })
      };
    })
    .filter((category) => category.values.length > 0);

  return {
    title: suggestions.title,
    summary: selection.summary
      ? suggestions.summary
      : (currentData.personalInfo.summary || undefined),
    experience: suggestions.experience?.map((exp, idx) => {
      const sel = selection.experience[idx];
      const currentExp = currentData.experience[idx];
      const currentHighlights = (currentExp?.highlights ?? []).map((h) => h.value);
      const suggestedHighlightValues = (exp.highlights ?? []).map((h) => h.value);

      const { suggestedToCurrent } = buildHighlightMatchMaps(
        currentHighlights,
        suggestedHighlightValues
      );

      const highlights = (exp.highlights ?? [])
        .map((h, i) => {
          if (sel?.highlights[i]) return h;
          const matchedCurrentIdx = suggestedToCurrent[i];
          if (matchedCurrentIdx >= 0) {
            const matched = currentExp?.highlights?.[matchedCurrentIdx];
            return matched ? { id: matched.id, value: matched.value } : null;
          }
          return null;
        })
        .filter((h): h is { id: string; value: string } => h !== null);

      return {
        description: sel?.description
          ? exp.description
          : (currentExp?.description || undefined),
        highlights: highlights.length ? highlights : undefined
      };
    }),
    skills: filteredSkills?.length ? filteredSkills : undefined
  };
}
