import type { TImproveQuestion } from '../types/aiImprove';

/**
 * Minimal resume slice needed for sector inference and question validation.
 */
export type TResumeDataForImprove = {
  personalInfo?: { summary?: string };
  experience?: {
    id: string;
    company?: string;
    position?: string;
    description?: string;
    highlights?: { id: string; value: string }[];
  }[];
  skills?: { id: string; name: string; values: { id: string; value: string }[] }[];
};

/** Normalized sector guidance used to steer improve-question generation. */
export type TSectorProfile = {
  occupationFamily: string;
  sectorLabel: string;
  evidenceTypes: string[];
  avoidPatterns: string[];
  reasoningSignals: string[];
  careCentered: boolean;
};

type TFamilyDefinition = TSectorProfile & {
  aliases: string[];
  keywords: string[];
};

const FAMILY_DEFINITIONS: TFamilyDefinition[] = [
  {
    occupationFamily: 'Software Engineering',
    sectorLabel: 'Engineering / product / technical delivery',
    evidenceTypes: [
      'systems shipped',
      'latency or performance improvements',
      'scale, reliability, or throughput',
      'time saved or workflow acceleration',
      'adoption, delivery scope, or team leadership'
    ],
    avoidPatterns: [
      'abstract soft-skill questions detached from shipped work',
      'care-delivery framing',
      'clinical or safeguarding language'
    ],
    reasoningSignals: ['engineer', 'developer', 'frontend', 'backend', 'software', 'platform'],
    careCentered: false,
    aliases: [
      'software engineer',
      'frontend engineer',
      'front end engineer',
      'front-end engineer',
      'backend engineer',
      'full stack engineer',
      'full-stack engineer',
      'developer',
      'frontend lead',
      'front end lead',
      'front-end lead'
    ],
    keywords: ['react', 'typescript', 'latency', 'throughput', 'platform', 'api', 'monorepo']
  },
  {
    occupationFamily: 'Business Operations',
    sectorLabel: 'Business / operations / sales',
    evidenceTypes: [
      'process improvements',
      'revenue or cost impact',
      'conversion, growth, or retention',
      'volume handled',
      'cross-functional delivery'
    ],
    avoidPatterns: [
      'clinical framing',
      'care-approach language',
      'safeguarding terminology'
    ],
    reasoningSignals: ['operations', 'sales', 'business', 'account', 'revenue', 'growth'],
    careCentered: false,
    aliases: [
      'operations manager',
      'business analyst',
      'sales manager',
      'account executive',
      'project manager'
    ],
    keywords: ['pipeline', 'revenue', 'sales', 'operations', 'forecast', 'conversion']
  },
  {
    occupationFamily: 'Education',
    sectorLabel: 'Education / training',
    evidenceTypes: [
      'student population served',
      'instructional methods used',
      'curriculum or program scope',
      'collaboration with families or staff',
      'observable learner outcomes'
    ],
    avoidPatterns: [
      'revenue framing',
      'dashboard KPI language unless explicitly present',
      'incident-rate requests'
    ],
    reasoningSignals: ['teacher', 'instructor', 'education', 'classroom', 'curriculum', 'student'],
    careCentered: true,
    aliases: ['teacher', 'instructor', 'educator', 'teaching assistant', 'school counselor'],
    keywords: ['lesson', 'curriculum', 'student', 'school', 'classroom', 'learning']
  },
  {
    occupationFamily: 'Healthcare',
    sectorLabel: 'Healthcare / patient care',
    evidenceTypes: [
      'patient population or setting',
      'clinical responsibilities',
      'care methods and standards followed',
      'coordination with care teams',
      'observable patient outcomes'
    ],
    avoidPatterns: [
      'revenue questions',
      'audit-style KPI requests unless explicitly present',
      'incident-rate language'
    ],
    reasoningSignals: ['nurse', 'patient', 'clinic', 'hospital', 'medical', 'healthcare'],
    careCentered: true,
    aliases: ['registered nurse', 'nurse', 'medical assistant', 'care coordinator', 'therapist'],
    keywords: ['patient', 'clinical', 'hospital', 'therapy', 'care plan', 'treatment']
  },
  {
    occupationFamily: 'Psychology and Therapy',
    sectorLabel: 'Psychology / therapy / counseling',
    evidenceTypes: [
      'population served',
      'assessment or therapeutic approach',
      'session or program responsibilities',
      'care-team collaboration',
      'observable behavioral or wellbeing outcomes'
    ],
    avoidPatterns: [
      'percent-chasing prompts',
      'incident-rate or compliance KPI requests',
      'revenue framing'
    ],
    reasoningSignals: ['psycholog', 'therap', 'counsel', 'mental health', 'psychosocial'],
    careCentered: true,
    aliases: [
      'psychologist',
      'therapist',
      'counselor',
      'psychosocial support specialist',
      'mental health counselor'
    ],
    keywords: ['therapy', 'counseling', 'psychosocial', 'trauma-informed', 'assessment']
  },
  {
    occupationFamily: 'Social Services and Child Protection',
    sectorLabel: 'Social services / child protection / nonprofit support',
    evidenceTypes: [
      'population served',
      'intake and assessment responsibilities',
      'care approach and safeguarding practices',
      'interdisciplinary coordination',
      'observable client outcomes'
    ],
    avoidPatterns: [
      'revenue metrics',
      'percent improvements',
      'incident-rate reporting',
      'audit-style compliance questions unless explicit'
    ],
    reasoningSignals: ['social worker', 'shelter', 'case coordinator', 'child protection', 'safeguarding'],
    careCentered: true,
    aliases: [
      'social worker',
      'case manager',
      'case coordinator',
      'shelter case coordinator',
      'child protection officer',
      'family support worker'
    ],
    keywords: ['shelter', 'safeguarding', 'family separation', 'referrals', 'support planning', 'case coordination']
  },
  {
    occupationFamily: 'Research and Public Sector',
    sectorLabel: 'Research / public sector / nonprofit programs',
    evidenceTypes: [
      'program or study scope',
      'methods and standards used',
      'stakeholders supported',
      'published work, grants, or reports',
      'policy or community impact'
    ],
    avoidPatterns: [
      'sales language',
      'generic KPI dashboards unless explicit',
      'corporate growth framing'
    ],
    reasoningSignals: ['research', 'public sector', 'policy', 'grant', 'program officer', 'nonprofit'],
    careCentered: true,
    aliases: ['research assistant', 'researcher', 'program officer', 'policy analyst'],
    keywords: ['research', 'grant', 'publication', 'policy', 'public service', 'community']
  }
];

const CARE_DISALLOWED_PATTERNS = [
  /\bwhat\s*%/i,
  /\bwhat percentage\b/i,
  /\bpercent(?:age)?\b/i,
  /\bkpi\b/i,
  /\bmetric(?:s)?\b/i,
  /\bincident rate(?:s)?\b/i,
  /\bcompliance metric(?:s)?\b/i,
  /\bdashboard(?:s)?\b/i,
  /\brevenue\b/i,
  /\bcost savings?\b/i,
  /\bpeak capacity\b/i,
  /\btimeline for escalation\b/i,
  /\bescalation timeline\b/i,
  /\breporting rate(?:s)?\b/i,
  /\baudit[- ]style\b/i
];

const CARE_MEASUREMENT_HINTS =
  /%|\bpercent(?:age)?\b|\bkpi\b|\bmetric(?:s)?\b|\bincident rate(?:s)?\b|\bcompliance metric(?:s)?\b|\bdashboard(?:s)?\b|\brevenue\b|\bcost savings?\b|\blatency\b|\bthroughput\b|\badoption\b/i;

const OVERKILL_PATTERNS = [
  /\bwhat metrics\b/i,
  /\bmetrics demonstrate\b/i,
  /\bdid you measure\b/i,
  /\bdid you track\b/i,
  /\btranslated? to business impact\b/i,
  /\bdownstream impact\b/i,
  /\buser population affected\b/i,
  /\bhow frequently\b/i,
  /\bhow often\b/i,
  /\bwhat was the impact on application reliability or user experience\b/i,
  /\bwhat would have happened if\b/i,
  /\bhow many\b[\s\S]{0,80}\band\b[\s\S]{0,80}\bwhat\b/i,
  /\bwhat scale\b[\s\S]{0,80}\band\b[\s\S]{0,80}\bhow did\b/i,
  /\bwhich\b[\s\S]{0,80}\band\b[\s\S]{0,80}\bwhat\b/i,
  /\bwhat specific\b[\s\S]{0,80}\band\b[\s\S]{0,80}\bhow many\b/i,
  /\bwere there specific\b/i
];

/**
 * Returns true when a question is overloaded with multiple asks and likely too
 * broad for a single resume-improvement follow-up.
 */
export function isOverloadedImproveQuestion(question: string): boolean {
  const normalizedQuestion = question.trim();
  if (!normalizedQuestion) return true;

  const commaCount = (normalizedQuestion.match(/,/g) ?? []).length;
  const andCount = (normalizedQuestion.match(/\band\b/gi) ?? []).length;
  const orCount = (normalizedQuestion.match(/\bor\b/gi) ?? []).length;
  const interrogativeClauseCount = (
    normalizedQuestion.match(
      /\b(what|how|which|who|where|when|why|were there|did you)\b/gi
    ) ?? []
  ).length;
  const parentheticalHints = (normalizedQuestion.match(/\be\.g\./gi) ?? [])
    .length;
  const questionWordCount = normalizedQuestion.split(/\s+/).length;
  const questionMarkCount = (normalizedQuestion.match(/\?/g) ?? []).length;

  if (OVERKILL_PATTERNS.some((pattern) => pattern.test(normalizedQuestion))) {
    return true;
  }

  if (questionWordCount > 26) return true;
  if (questionMarkCount > 1) return true;
  if (commaCount >= 2) return true;
  if (parentheticalHints > 0) return true;
  if (andCount + orCount >= 2) return true;
  if (interrogativeClauseCount >= 2) return true;

  return false;
}

/** Normalizes freeform titles and question text for matching. */
export function normalizeSectorText(value: string | undefined): string {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Infers a best-effort sector profile from resume summary and experience content. */
export function inferSectorProfile(
  resume: TResumeDataForImprove
): TSectorProfile | null {
  const summary = normalizeSectorText(resume.personalInfo?.summary);
  const positions = (resume.experience ?? []).map((experience) =>
    normalizeSectorText(experience.position)
  );
  const descriptions = (resume.experience ?? []).map((experience) =>
    normalizeSectorText(`${experience.description ?? ''} ${experience.company ?? ''}`)
  );

  let bestProfile: TFamilyDefinition | null = null;
  let bestScore = 0;
  let secondBestScore = 0;

  for (const family of FAMILY_DEFINITIONS) {
    let score = 0;
    const aliases = family.aliases.map((alias) => normalizeSectorText(alias));

    for (const position of positions) {
      if (!position) continue;
      if (aliases.includes(position)) {
        score += 8;
      }
      for (const alias of aliases) {
        if (position.includes(alias)) score += 4;
      }
      for (const keyword of family.keywords) {
        if (position.includes(normalizeSectorText(keyword))) score += 3;
      }
    }

    for (const keyword of family.keywords) {
      const normalizedKeyword = normalizeSectorText(keyword);
      if (summary.includes(normalizedKeyword)) score += 2;
      for (const description of descriptions) {
        if (description.includes(normalizedKeyword)) score += 1;
      }
    }

    if (score > bestScore) {
      secondBestScore = bestScore;
      bestScore = score;
      bestProfile = family;
    } else if (score > secondBestScore) {
      secondBestScore = score;
    }
  }

  if (!bestProfile || bestScore === 0) return null;
  if (bestScore === secondBestScore) return null;

  return {
    occupationFamily: bestProfile.occupationFamily,
    sectorLabel: bestProfile.sectorLabel,
    evidenceTypes: bestProfile.evidenceTypes,
    avoidPatterns: bestProfile.avoidPatterns,
    reasoningSignals: bestProfile.reasoningSignals,
    careCentered: bestProfile.careCentered
  };
}

/** Formats the runtime sector block appended ahead of the resume context. */
export function formatSectorGuidance(profile: TSectorProfile): string {
  return [
    'Sector guidance:',
    `Detected occupation family: ${profile.occupationFamily}`,
    `Sector: ${profile.sectorLabel}`,
    `Typical evidence for this field: ${profile.evidenceTypes.join('; ')}`,
    `Avoid unless explicit in resume: ${profile.avoidPatterns.join('; ')}`
  ].join('\n');
}

/** Looks up the exact resume text targeted by a question. */
export function getQuestionTargetText(
  question: TImproveQuestion,
  resume: TResumeDataForImprove
): string | null {
  switch (question.targetType) {
    case 'highlight': {
      const experience = resume.experience?.find(
        (item) => item.id === question.experienceId
      );
      return (
        experience?.highlights?.find(
          (highlight) => highlight.id === question.highlightId
        )?.value ?? null
      );
    }
    case 'description': {
      const experience = resume.experience?.find(
        (item) => item.id === question.experienceId
      );
      return experience?.description ?? null;
    }
    case 'summary':
      return resume.personalInfo?.summary ?? null;
  }
}

/**
 * Filters generated questions using deterministic grounding and sector checks.
 */
export function filterImproveQuestions(
  questions: TImproveQuestion[],
  resume: TResumeDataForImprove,
  resumeText: string,
  sectorProfile: TSectorProfile | null,
  options?: { allowOverloadedQuestions?: boolean }
): TImproveQuestion[] {
  const filtered: TImproveQuestion[] = [];
  const seenQuestionKeys = new Set<string>();
  const seenTargetKeys = new Set<string>();
  const resumeHasMeasurementLanguage = CARE_MEASUREMENT_HINTS.test(resumeText);

  for (const question of questions) {
    const normalizedQuestion = normalizeSectorText(question.question);
    const normalizedContext = normalizeSectorText(question.context);

    if (!normalizedQuestion || !normalizedContext) continue;
    if (
      !options?.allowOverloadedQuestions &&
      isOverloadedImproveQuestion(question.question)
    ) {
      continue;
    }

    const targetText = getQuestionTargetText(question, resume);
    if (!targetText) continue;
    if (question.context.trim() !== targetText.trim()) continue;

    if (question.targetType === 'summary' &&
      (question.experienceId || question.highlightId)) {
      continue;
    }

    if (question.targetType === 'description' &&
      (!question.experienceId || question.highlightId)) {
      continue;
    }

    if (question.targetType === 'highlight' &&
      (!question.experienceId || !question.highlightId)) {
      continue;
    }

    const questionKey = `${normalizedQuestion}::${normalizedContext}`;
    const targetKey = `${question.targetType}::${question.experienceId ?? ''}::${question.highlightId ?? ''}`;

    if (seenQuestionKeys.has(questionKey) || seenTargetKeys.has(targetKey)) {
      continue;
    }

    if (sectorProfile?.careCentered &&
      CARE_DISALLOWED_PATTERNS.some((pattern) => pattern.test(question.question)) &&
      !resumeHasMeasurementLanguage) {
      continue;
    }

    seenQuestionKeys.add(questionKey);
    seenTargetKeys.add(targetKey);
    filtered.push(question);
  }

  return filtered;
}

/** Returns a target list with strict filtering first, then lighter fallback if needed. */
export function selectImproveQuestions(
  questions: TImproveQuestion[],
  resume: TResumeDataForImprove,
  resumeText: string,
  sectorProfile: TSectorProfile | null
): TImproveQuestion[] {
  const strictQuestions = filterImproveQuestions(
    questions,
    resume,
    resumeText,
    sectorProfile
  );

  if (strictQuestions.length >= 5) {
    return strictQuestions.slice(0, 10);
  }

  const relaxedQuestions = filterImproveQuestions(
    questions,
    resume,
    resumeText,
    sectorProfile,
    { allowOverloadedQuestions: true }
  );

  const mergedQuestions: TImproveQuestion[] = [];
  const seenKeys = new Set<string>();

  for (const question of [...strictQuestions, ...relaxedQuestions]) {
    const key = `${question.targetType}::${question.experienceId ?? ''}::${question.highlightId ?? ''}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);
    mergedQuestions.push(question);
  }

  return mergedQuestions.slice(0, 10);
}
