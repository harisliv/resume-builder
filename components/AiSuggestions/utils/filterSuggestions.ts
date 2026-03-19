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
        name: category.name,
        values: category.values.filter((skill, skillIdx) => {
          if (selected[skillIdx] ?? true) return true;
          // Unchecked: keep only if skill exists in current (old version stays)
          return currentSet.has(skill.toLowerCase());
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

      // Map unchecked highlights to their current version
      const suggestedHighlights = exp.highlights ?? [];
      const { suggestedToCurrent } = buildHighlightMatchMaps(
        currentHighlights,
        suggestedHighlights
      );

      const highlights = suggestedHighlights
        .map((h, i) => {
          if (sel?.highlights[i]) return h;
          // Unchecked: use matched current highlight, or drop if new
          const matchedCurrentIdx = suggestedToCurrent[i];
          return matchedCurrentIdx >= 0
            ? currentHighlights[matchedCurrentIdx]
            : null;
        })
        .filter((h): h is string => h !== null);

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
