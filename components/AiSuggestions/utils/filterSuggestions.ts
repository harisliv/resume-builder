import type { TAiSuggestions, TSuggestionSelection } from '@/types/aiSuggestions';

/**
 * Applies user selection to produce final TAiSuggestions for submission.
 * Unselected fields are set to undefined, including unchecked suggested skills.
 */
export function buildFilteredSuggestions(
  suggestions: TAiSuggestions,
  selection: TSuggestionSelection
): TAiSuggestions {
  const filteredSkills = suggestions.skills
    ?.map((category, categoryIdx) => {
      const selected = selection.skills[categoryIdx]?.selected ?? [];
      return {
        name: category.name,
        values: category.values.filter((_, skillIdx) => selected[skillIdx] ?? true)
      };
    })
    .filter((category) => category.values.length > 0);

  return {
    title: suggestions.title,
    summary: selection.summary ? suggestions.summary : undefined,
    experience: suggestions.experience?.map((exp, idx) => {
      const sel = selection.experience[idx];
      const filteredHighlights = exp.highlights?.filter(
        (_, i) => sel?.highlights[i]
      );
      return {
        description: sel?.description ? exp.description : undefined,
        highlights: filteredHighlights?.length ? filteredHighlights : undefined
      };
    }),
    skills: filteredSkills?.length ? filteredSkills : undefined
  };
}
