import * as z from 'zod';
import { format, isValid, parse } from 'date-fns';
import { parsePhoneNumber } from 'react-phone-number-input';

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

const MONTH_YEAR_FORMAT = 'MMM yyyy';

/**
 * Normalizes whitespace-only values to empty strings.
 */
function cleanText(value: string): string {
  return value.trim();
}

/**
 * Converts parsed phone input into the E.164 format expected by the form.
 * Returns an empty string when the value cannot be parsed safely.
 */
function normalizePhone(value: string): string {
  const trimmed = cleanText(value);
  if (!trimmed) return '';
  return parsePhoneNumber(trimmed)?.number ?? '';
}

/**
 * Parses loose month/year or year-only input into the form's `MMM yyyy` format.
 * Year-only values fall back to January of that year to fit the picker model.
 */
function normalizeMonthYear(value: string): string {
  const trimmed = cleanText(value);
  if (!trimmed) return '';

  for (const inputFormat of ['MMM yyyy', 'MMMM yyyy', 'yyyy']) {
    const parsedDate = parse(trimmed, inputFormat, new Date());
    if (isValid(parsedDate)) {
      return format(parsedDate, MONTH_YEAR_FORMAT);
    }
  }

  const fallback = new Date(trimmed);
  return isValid(fallback) ? format(fallback, MONTH_YEAR_FORMAT) : '';
}

/**
 * Normalizes end dates for the controlled date range field.
 * Current roles store an empty end date and use the checkbox instead.
 */
function normalizeExperienceEndDate(value: string, current: boolean): string {
  if (current) return '';

  const trimmed = cleanText(value).toLowerCase();
  if (trimmed === 'present' || trimmed === 'current') return '';

  return normalizeMonthYear(value);
}

/**
 * Normalizes education dates to year-only strings for the current form field.
 */
function normalizeGraduationDate(value: string): string {
  const trimmed = cleanText(value);
  if (!trimmed) return '';

  const yearMatch = trimmed.match(/\b(19|20)\d{2}\b/);
  if (yearMatch) return yearMatch[0];

  const fallback = new Date(trimmed);
  return isValid(fallback) ? String(fallback.getFullYear()) : '';
}

/**
 * Chooses a usable location value, falling back when the parsed field is empty.
 */
function normalizeLocation(value: string, fallback = ''): string {
  return cleanText(value) || cleanText(fallback);
}

/** Converts parsed AI output to app-friendly format with form-safe values. */
export function normalizeParsedResume(raw: TParsedResume) {
  const personalLocation = normalizeLocation(raw.personalInfo.location);

  return {
    title: raw.title || 'Imported Resume',
    personalInfo: {
      ...raw.personalInfo,
      phone: normalizePhone(raw.personalInfo.phone),
      location: personalLocation
    },
    experience: raw.experience.map((exp) => ({
      ...exp,
      location: normalizeLocation(exp.location, personalLocation),
      startDate: normalizeMonthYear(exp.startDate),
      endDate: normalizeExperienceEndDate(exp.endDate, exp.current),
      current: exp.current || ['present', 'current'].includes(cleanText(exp.endDate).toLowerCase()),
      highlights: exp.highlights.map((h) => ({ value: h }))
    })),
    education: raw.education.map((edu) => ({
      ...edu,
      location: normalizeLocation(edu.location, personalLocation),
      graduationDate: normalizeGraduationDate(edu.graduationDate)
    })),
    skills: raw.skills.map((cat) => ({
      name: cleanText(cat.name),
      values: cat.values.map((v) => ({ value: v }))
    }))
  };
}
