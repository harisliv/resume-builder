import { nanoid } from 'nanoid';
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
