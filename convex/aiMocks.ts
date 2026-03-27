import { nanoid } from 'nanoid';
import type { TAiSuggestions } from '../types/aiSuggestions';
import type { TImproveEdit, TImproveQuestion } from '../types/aiImprove';

type TMockResumeInput = {
  personalInfo?: { summary?: string };
  experience?: {
    id: string;
    company?: string;
    position?: string;
    description?: string;
    highlights?: ({ id: string; value: string } | string)[];
  }[];
  skills?: {
    id: string;
    name: string;
    values: ({ id: string; value: string } | string)[];
  }[];
};

type TMockImproveTurnResult = {
  content: string;
  structuredPayload?: {
    questions?: { question: string; context: string }[];
    resumePatch?: string;
    isReadyToApply?: boolean;
  };
};

const STOP_WORDS = new Set([
  'about',
  'across',
  'after',
  'again',
  'among',
  'build',
  'built',
  'could',
  'first',
  'using',
  'their',
  'there',
  'these',
  'those',
  'would',
  'with',
  'from',
  'have',
  'role',
  'senior',
  'stakeholder'
]);

/** Returns true when AI actions should use deterministic mock responses. */
export function isMockAiEnabled(): boolean {
  return process.env.MOCK_AI === 'true'
    || process.env.NEXT_PUBLIC_TESTING_FEATURES === 'true';
}

/** Reads string or `{ value }` entries into plain trimmed strings. */
function normalizeValues(values?: ({ id: string; value: string } | string)[]): string[] {
  return (values ?? [])
    .map((value) => (typeof value === 'string' ? value : value.value))
    .map((value) => value.trim())
    .filter(Boolean);
}

/** Extracts IDs from `{ id, value }` entries. Returns empty string for plain strings. */
function normalizeIds(values?: ({ id: string; value: string } | string)[]): string[] {
  return (values ?? [])
    .map((value) => (typeof value === 'string' ? '' : value.id));
}

/** Extracts a small deterministic keyword set from user-provided text. */
function extractKeywords(text: string): string[] {
  const matches = text.match(/[A-Za-z][A-Za-z0-9+#.-]*/g) ?? [];
  const seen = new Set<string>();

  return matches.filter((match) => {
    const normalized = match.toLowerCase();
    if (match.length < 5) return false;
    if (STOP_WORDS.has(normalized)) return false;
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  }).slice(0, 5);
}

/** Pulls out a metric-shaped fragment to make mock copy feel realistic. */
function extractMetric(text: string): string | undefined {
  return text.match(/\b\d+(?:\.\d+)?%/)?.[0];
}

/** Creates a deterministic mock suggestions payload for local workflow testing. */
export function buildMockResumeSuggestions({
  resume,
  jobDescription
}: {
  resume: TMockResumeInput;
  jobDescription: string;
}): TAiSuggestions {
  const keywords = extractKeywords(jobDescription);
  const metric = extractMetric(jobDescription);
  const summaryLead = resume.personalInfo?.summary?.trim()
    || 'Product-minded engineer improving resume clarity.';
  const summaryTail = keywords.length
    ? `Aligned for ${keywords.slice(0, 3).join(', ')} roles`
    : 'Aligned for the target role';
  const summaryMetric = metric ? ` with results like ${metric}` : '';

  return {
    summary: `${summaryLead.replace(/\.$/, '')}. ${summaryTail}${summaryMetric}.`,
    experience: (resume.experience ?? []).map((item) => {
      const baseHighlight = normalizeValues(item.highlights)[0]
        || `Improved outcomes for ${item.company || 'the team'}`;
      const rewrittenHighlight = keywords.length
        ? `${baseHighlight} with emphasis on ${keywords.slice(0, 4).join(', ')}${metric ? `, contributing to ${metric}` : ''}.`
        : `${baseHighlight}${metric ? `, contributing to ${metric}` : ''}.`;

      return {
        description: item.description?.trim()
          ? `${item.description.trim().replace(/\.$/, '')}. Reframed around impact and measurable outcomes.`
          : undefined,
        highlights: [{ id: normalizeIds(item.highlights)?.[0] ?? nanoid(), value: rewrittenHighlight }]
      };
    }),
    skills: (resume.skills ?? []).map((category, categoryIdx) => {
      const currentValues = normalizeValues(category.values);
      const currentIds = normalizeIds(category.values);
      const extraValues = categoryIdx === 0
        ? keywords
          .map((value) => value.toLowerCase())
          .filter((value) => !currentValues.some((current) => current.toLowerCase() === value))
          .slice(0, 2)
        : [];

      return {
        id: category.id ?? nanoid(),
        name: category.name,
        values: [
          ...currentValues.map((v, i) => ({ id: currentIds[i] ?? nanoid(), value: v })),
          ...extraValues.map((v) => ({ id: nanoid(), value: v }))
        ]
      };
    }),
    jdKeywords: keywords.map((keyword) => keyword.toLowerCase())
  };
}

/** Creates deterministic question/apply responses for the improve workflow. */
export function buildMockImproveTurn({
  resume,
  isFirstTurn,
  answersText
}: {
  resume: TMockResumeInput;
  isFirstTurn: boolean;
  answersText?: string;
}): TMockImproveTurnResult {
  const firstExperience = resume.experience?.[0];
  const firstHighlight = normalizeValues(firstExperience?.highlights)[0]
    || firstExperience?.description
    || resume.personalInfo?.summary
    || 'Your strongest work';

  if (isFirstTurn) {
    const questions = [
      {
        question: 'What measurable result came from this work?',
        context: firstHighlight
      },
      {
        question: 'Which tools or business area mattered most here?',
        context: firstExperience?.position || 'Recent experience'
      }
    ];

    return {
      content: 'Mock follow-up questions ready.',
      structuredPayload: {
        questions,
        isReadyToApply: false
      }
    };
  }

  const suggestions = buildMockResumeSuggestions({
    resume,
    jobDescription: answersText ?? ''
  });
  const resumePatch = JSON.stringify({
    summary: suggestions.summary,
    experience: suggestions.experience,
    skills: suggestions.skills
  });

  return {
    content: 'Mock improvements generated. Review and apply the suggested changes.',
    structuredPayload: {
      resumePatch,
      isReadyToApply: true
    }
  };
}

/** Mock keyword extraction — derives keywords from JD text as flat list. */
export function buildMockKeywordExtraction(jobDescription: string) {
  const words = jobDescription.match(/\b[A-Z][a-zA-Z.+#]{2,}\b/g) ?? [];
  const unique = [...new Set(words)].slice(0, 10);
  return {
    title: 'Mock Position at Mock Company',
    keywords: unique.map(w => ({
      keyword: w,
      canonicalName: w,
      context: `From JD: "${w}"`
    })),
    cost: 0
  };
}

/** Deterministic mock questions for the improve flow (turn 1). */
export function buildMockImproveQuestions(resume: TMockResumeInput): TImproveQuestion[] {
  const questions: TImproveQuestion[] = [];

  for (const exp of resume.experience ?? []) {
    const highlights = normalizeValues(exp.highlights);
    const highlightIds = normalizeIds(exp.highlights);
    if (highlights.length > 0) {
      questions.push({
        question: `What measurable result came from "${highlights[0]}"?`,
        context: highlights[0],
        targetType: 'highlight',
        experienceId: exp.id,
        highlightId: highlightIds[0] || undefined
      });
    }
    if (exp.description) {
      questions.push({
        question: `Can you quantify the impact of your work as ${exp.position ?? 'this role'} at ${exp.company ?? 'this company'}?`,
        context: exp.description,
        targetType: 'description',
        experienceId: exp.id
      });
    }
  }

  if (resume.personalInfo?.summary) {
    questions.push({
      question: 'What is the single most impressive metric from your career so far?',
      context: resume.personalInfo.summary,
      targetType: 'summary'
    });
  }

  return questions.slice(0, 7);
}

/** Deterministic mock edits for the improve flow (turn 2). */
export function buildMockImproveEdits(resume: TMockResumeInput): TImproveEdit[] {
  const edits: TImproveEdit[] = [];

  if (resume.personalInfo?.summary) {
    edits.push({
      type: 'updateSummary',
      oldValue: resume.personalInfo.summary,
      newValue: `${resume.personalInfo.summary.replace(/\.$/, '')}. Proven track record of delivering measurable results.`
    });
  }

  for (const exp of resume.experience ?? []) {
    const highlights = exp.highlights ?? [];
    for (const h of highlights) {
      const id = typeof h === 'string' ? '' : h.id;
      const val = typeof h === 'string' ? h : h.value;
      if (!id || !val) continue;
      edits.push({
        type: 'updateHighlight',
        experienceId: exp.id,
        highlightId: id,
        oldValue: val,
        newValue: `${val.replace(/\.$/, '')}, resulting in [X%] improvement in key metrics.`
      });
    }
  }

  return edits;
}
