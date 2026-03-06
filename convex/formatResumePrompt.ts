/**
 * Converts raw resume data into an explicit, labeled prompt format
 * for consistent LLM interpretation.
 */

interface ResumeExperience {
  company?: string;
  position?: string;
  description?: string;
  highlights?: { value: string }[] | string[];
}

interface ResumeSkillCategory {
  name: string;
  values: string[] | { value: string }[];
}

interface ResumePromptInput {
  summary?: string;
  experience?: ResumeExperience[];
  skills?: ResumeSkillCategory[];
}

/** Extracts highlight text whether it's `{ value: string }` or plain `string`. */
function getHighlightText(h: { value: string } | string): string {
  return typeof h === 'string' ? h : h.value;
}

/**
 * Formats a resume into a labeled, indexed text prompt.
 * Uses explicit indices and sentinels (`(none)`) so the LLM
 * can unambiguously map its output back to the input structure.
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
    for (let i = 0; i < resume.experience.length; i++) {
      const exp = resume.experience[i];
      parts.push(`[Experience #${i}] ${exp.position || '(no title)'} at ${exp.company || '(no company)'}`);
      parts.push(`Description: ${exp.description || '(none)'}`);

      const highlights = exp.highlights;
      if (highlights?.length) {
        parts.push('Highlights:');
        for (let j = 0; j < highlights.length; j++) {
          parts.push(`  ${j}. ${getHighlightText(highlights[j])}`);
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
      const items = cat.values.map((v) => (typeof v === 'string' ? v : v.value));
      parts.push(`${cat.name}: ${items.join(', ')}`);
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
