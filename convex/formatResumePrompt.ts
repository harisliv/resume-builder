/**
 * Converts raw resume data into an explicit, ID-labeled prompt format
 * for consistent LLM interpretation and targeted edits.
 */

interface ResumeExperience {
  id: string;
  company?: string;
  position?: string;
  description?: string;
  highlights?: { id: string; value: string }[];
}

interface ResumeSkillCategory {
  id: string;
  name: string;
  values: { id: string; value: string }[];
}

interface ResumePromptInput {
  summary?: string;
  experience?: ResumeExperience[];
  skills?: ResumeSkillCategory[];
}

/**
 * Formats a resume into a labeled, ID-indexed text prompt.
 * Uses explicit IDs so the LLM can reference specific items for targeted edits.
 */
export function formatResumePrompt(resume: ResumePromptInput): string {
  const parts: string[] = [
    '## Resume (current state - do not invent facts beyond this)',
    '',
    '### Professional Summary',
    resume.summary || '(none)',
    ''
  ];

  parts.push('### Work Experience');
  if (resume.experience?.length) {
    for (const exp of resume.experience) {
      parts.push(`[Experience id:${exp.id}] ${exp.position || '(no title)'} at ${exp.company || '(no company)'}`);
      parts.push(`Description: ${exp.description || '(none)'}`);

      const highlights = exp.highlights;
      if (highlights?.length) {
        parts.push('Highlights:');
        for (const h of highlights) {
          parts.push(`  [id:${h.id}] ${h.value}`);
        }
      } else {
        parts.push('Highlights: (none)');
      }
      parts.push('');
    }
  } else {
    parts.push('(none)', '');
  }

  parts.push('### Skills');
  if (resume.skills?.length) {
    for (const cat of resume.skills) {
      const items = cat.values.map((v) => `[id:${v.id}] ${v.value}`);
      parts.push(`[Category id:${cat.id}] ${cat.name}: ${items.join(', ')}`);
    }
  } else {
    parts.push('(none)');
  }

  return parts.join('\n');
}

/**
 * Builds the full user prompt combining formatted resume and job description.
 */
export function buildUserPrompt(resume: ResumePromptInput, jobDescription: string): string {
  return `${formatResumePrompt(resume)}\n\n## Target Job Description\n${jobDescription}`;
}
