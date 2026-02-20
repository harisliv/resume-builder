import * as z from 'zod';

export const suggestionsSchema = z.object({
  title: z.string().optional(),
  summary: z.string().optional(),
  experience: z
    .array(
      z.object({
        description: z.string().optional(),
        highlights: z.array(z.string()).optional()
      })
    )
    .optional(),
  skills: z.array(z.string()).optional()
});

export type TAiSuggestions = z.infer<typeof suggestionsSchema>;

/** Per-field toggle state for selective AI suggestion acceptance. */
export type TSuggestionSelection = {
  summary: boolean;
  experience: { description: boolean; highlights: boolean[] }[];
};

/** Creates a fully-selected TSuggestionSelection from suggestions. */
export function createDefaultSelection(
  suggestions: TAiSuggestions
): TSuggestionSelection {
  return {
    summary: true,
    experience:
      suggestions.experience?.map((exp) => ({
        description: true,
        highlights: exp.highlights?.map(() => true) ?? []
      })) ?? []
  };
}
