import * as z from 'zod';

const suggestionSkillCategorySchema = z.object({
  name: z.string(),
  values: z.array(z.string())
});

const suggestionSkillsSchema = z.array(suggestionSkillCategorySchema);

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
  skills: suggestionSkillsSchema.optional()
});

const suggestionOutputExperienceItemSchema = z.object({
  description: z.string().nullable(),
  highlights: z.array(z.string()).nullable()
});

/**
 * Strict output schema for structured AI responses.
 * All object keys are required to satisfy providers that enforce strict JSON schema rules.
 */
export const suggestionsOutputSchema = z.object({
  title: z.string().nullable(),
  summary: z.string().nullable(),
  experience: z.array(suggestionOutputExperienceItemSchema).nullable(),
  skills: suggestionSkillsSchema.nullable()
});

export type TAiSuggestions = z.infer<typeof suggestionsSchema>;

/** Converts strict nullable output into app-friendly optional fields. */
export function normalizeSuggestionsOutput(
  output: z.infer<typeof suggestionsOutputSchema>
): TAiSuggestions {
  return {
    title: output.title ?? undefined,
    summary: output.summary ?? undefined,
    experience:
      output.experience?.map((item) => ({
        description: item.description ?? undefined,
        highlights: item.highlights ?? undefined
      })) ?? undefined,
    skills: output.skills ?? undefined
  };
}

/** Per-field toggle state for selective AI suggestion acceptance. */
export type TSuggestionSelection = {
  summary: boolean;
  experience: { description: boolean; highlights: boolean[] }[];
  /** Selection state per skill category index and skill index. */
  skills: { name: string; selected: boolean[] }[];
};

/** Raw result returned from the Convex multi-model action (before UI state is attached). */
export type TRawModelResult = {
  modelId: string;
  label: string;
  suggestions?: TAiSuggestions;
  error?: string;
  cost?: number;
  durationMs?: number;
};

/** Per-model state held in the results phase (editedSuggestions + selection). */
export type TModelResult = {
  modelId: string;
  label: string;
  editedSuggestions?: TAiSuggestions;
  selection?: TSuggestionSelection;
  error?: string;
  cost?: number;
  durationMs?: number;
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
      })) ?? [],
    skills:
      suggestions.skills?.map((category) => ({
        name: category.name,
        selected: category.values.map(() => true)
      })) ?? []
  };
}
