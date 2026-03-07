import * as z from 'zod';

/**
 * Zod schema for AI-parsed resume output from raw PDF text.
 * Uses empty strings instead of nullables to stay under AI SDK union limit.
 */
export const parsedResumeSchema = z.object({
  title: z.string(),
  personalInfo: z.object({
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
    linkedIn: z.string(),
    website: z.string(),
    summary: z.string()
  }),
  experience: z.array(
    z.object({
      company: z.string(),
      position: z.string(),
      location: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      current: z.boolean(),
      description: z.string(),
      highlights: z.array(z.string())
    })
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      degree: z.string(),
      field: z.string(),
      location: z.string(),
      graduationDate: z.string(),
      gpa: z.string()
    })
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      values: z.array(z.string())
    })
  )
});

export type TParsedResume = z.infer<typeof parsedResumeSchema>;

/** Converts parsed AI output to app-friendly format with highlight objects. */
export function normalizeParsedResume(raw: TParsedResume) {
  return {
    title: raw.title || 'Imported Resume',
    personalInfo: raw.personalInfo,
    experience: raw.experience.map((exp) => ({
      ...exp,
      highlights: exp.highlights.map((h) => ({ value: h }))
    })),
    education: raw.education,
    skills: raw.skills.map((cat) => ({
      name: cat.name,
      values: cat.values.map((v) => ({ value: v }))
    }))
  };
}
