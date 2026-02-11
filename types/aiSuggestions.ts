import * as z from 'zod';

export const suggestionsSchema = z.object({
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
