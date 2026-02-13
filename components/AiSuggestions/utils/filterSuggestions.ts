import type { TAiSuggestions, TSuggestionSelection } from '@/types/aiSuggestions';

/**
 * Applies user selection to produce final TAiSuggestions for submission.
 * Unselected fields are set to undefined; skills come pre-edited (removals already applied).
 */
export function buildFilteredSuggestions(
  suggestions: TAiSuggestions,
  selection: TSuggestionSelection
): TAiSuggestions {
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
    skills: suggestions.skills
  };
}
