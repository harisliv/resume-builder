import { describe, expect, it } from 'vitest';
import type { TImproveQuestion } from '../types/aiImprove';
import {
  filterImproveQuestions,
  formatSectorGuidance,
  inferSectorProfile,
  isOverloadedImproveQuestion,
  normalizeSectorText,
  selectImproveQuestions,
  type TResumeDataForImprove
} from './aiImproveSector';
import { formatResumePrompt } from './formatResumePrompt';

const careResume: TResumeDataForImprove = {
  personalInfo: {
    summary:
      'Child protection and psychosocial support professional supporting vulnerable families in shelter settings.'
  },
  experience: [
    {
      id: 'exp-care',
      company: 'Safe Harbor',
      position: 'Shelter Case Coordinator',
      description:
        'Coordinated daily support for unaccompanied minors in an emergency shelter setting.',
      highlights: [
        {
          id: 'h-care-1',
          value:
            'Coordinated intake, daily support planning, and referrals for unaccompanied minors arriving at the shelter'
        }
      ]
    }
  ],
  skills: []
};

const engineeringResume: TResumeDataForImprove = {
  personalInfo: {
    summary:
      'Frontend engineer building React and TypeScript systems with performance and delivery ownership.'
  },
  experience: [
    {
      id: 'exp-eng',
      company: 'Platform Co',
      position: 'Front-end Engineer',
      description: 'Built production web applications.',
      highlights: [
        {
          id: 'h-eng-1',
          value:
            'Delivered a multi-step form flow that replaced a manual workflow and reduced submission time'
        }
      ]
    }
  ],
  skills: []
};

/** Builds a single highlight question for targeted filtering tests. */
function buildHighlightQuestion(
  overrides: Partial<TImproveQuestion> = {}
): TImproveQuestion {
  return {
    question: 'What changed after launch?',
    context:
      'Coordinated intake, daily support planning, and referrals for unaccompanied minors arriving at the shelter',
    targetType: 'highlight',
    experienceId: 'exp-care',
    highlightId: 'h-care-1',
    ...overrides
  };
}

describe('normalizeSectorText', () => {
  it('normalizes punctuation and whitespace', () => {
    expect(normalizeSectorText(' Front-End   Engineer / React ')).toBe(
      'front end engineer react'
    );
  });
});

describe('inferSectorProfile', () => {
  it('detects care-centered roles from exact titles', () => {
    expect(inferSectorProfile(careResume)?.occupationFamily).toBe(
      'Social Services and Child Protection'
    );
  });

  it('detects engineering roles from title aliases and keywords', () => {
    expect(inferSectorProfile(engineeringResume)?.occupationFamily).toBe(
      'Software Engineering'
    );
  });

  it('returns null for ambiguous generic titles', () => {
    const ambiguousResume: TResumeDataForImprove = {
      personalInfo: { summary: 'Generalist coordinator supporting mixed initiatives.' },
      experience: [
        {
          id: 'exp-amb',
          company: 'Org',
          position: 'Coordinator',
          description: 'Supported internal initiatives across several teams.',
          highlights: []
        }
      ],
      skills: []
    };

    expect(inferSectorProfile(ambiguousResume)).toBeNull();
  });
});

describe('formatSectorGuidance', () => {
  it('formats a compact runtime guidance block', () => {
    const profile = inferSectorProfile(careResume);

    expect(profile).not.toBeNull();
    expect(formatSectorGuidance(profile!)).toContain('Detected occupation family:');
    expect(formatSectorGuidance(profile!)).toContain('Avoid unless explicit in resume:');
  });
});

describe('isOverloadedImproveQuestion', () => {
  it('flags multi-part metric-stacking questions', () => {
    expect(
      isOverloadedImproveQuestion(
        'How many users adopted this tool, how frequently was it used, and what downstream impact did that have on campaign throughput?'
      )
    ).toBe(true);
  });

  it('flags compound workflow questions', () => {
    expect(
      isOverloadedImproveQuestion(
        'What specific population or workflow complexity did the UN climate platform serve, how many national delegations actively used it, and what types of reporting scenarios or edge cases required the dynamic form system to handle?'
      )
    ).toBe(true);
  });

  it('flags scale-plus-impact stacked questions', () => {
    expect(
      isOverloadedImproveQuestion(
        'What scale of datasets were being processed before the Web Workers optimization, and how did the 30-60 second improvement affect user experience or downstream systems relying on that data?'
      )
    ).toBe(true);
  });

  it('allows focused single-fact resume questions', () => {
    expect(
      isOverloadedImproveQuestion(
        'What changed in campaign setup time after teams started using this builder?'
      )
    ).toBe(false);
  });
});

describe('filterImproveQuestions', () => {
  it('drops duplicate questions and invalid target ids', () => {
    const resumeText = formatResumePrompt({
      summary: careResume.personalInfo?.summary,
      experience: careResume.experience,
      skills: careResume.skills
    });
    const profile = inferSectorProfile(careResume);

    const questions: TImproveQuestion[] = [
      buildHighlightQuestion(),
      buildHighlightQuestion(),
      buildHighlightQuestion({ highlightId: 'missing-id' })
    ];

    expect(filterImproveQuestions(questions, careResume, resumeText, profile)).toEqual([
      buildHighlightQuestion()
    ]);
  });

  it('drops disallowed KPI-style questions for care-centered roles', () => {
    const resumeText = formatResumePrompt({
      summary: careResume.personalInfo?.summary,
      experience: careResume.experience,
      skills: careResume.skills
    });
    const profile = inferSectorProfile(careResume);

    const questions: TImproveQuestion[] = [
      buildHighlightQuestion({
        question:
          'What percentage of identified concerns were escalated from this intake workflow?'
      })
    ];

    expect(filterImproveQuestions(questions, careResume, resumeText, profile)).toEqual([]);
  });

  it('keeps metric-oriented questions when the role is not care-centered', () => {
    const resumeText = formatResumePrompt({
      summary: engineeringResume.personalInfo?.summary,
      experience: engineeringResume.experience,
      skills: engineeringResume.skills
    });
    const profile = inferSectorProfile(engineeringResume);
    const questions: TImproveQuestion[] = [
      {
        question: 'How much did submission time drop after this launch?',
        context:
          'Delivered a multi-step form flow that replaced a manual workflow and reduced submission time',
        targetType: 'highlight',
        experienceId: 'exp-eng',
        highlightId: 'h-eng-1'
      }
    ];

    expect(filterImproveQuestions(questions, engineeringResume, resumeText, profile))
      .toEqual(questions);
  });

  it('drops overkill multi-part questions even for engineering resumes', () => {
    const resumeText = formatResumePrompt({
      summary: engineeringResume.personalInfo?.summary,
      experience: engineeringResume.experience,
      skills: engineeringResume.skills
    });
    const profile = inferSectorProfile(engineeringResume);
    const questions: TImproveQuestion[] = [
      {
        question:
          'How many users adopted this workflow, how frequently did they use it, and what downstream impact did that have on business throughput?',
        context:
          'Delivered a multi-step form flow that replaced a manual workflow and reduced submission time',
        targetType: 'highlight',
        experienceId: 'exp-eng',
        highlightId: 'h-eng-1'
      }
    ];

    expect(filterImproveQuestions(questions, engineeringResume, resumeText, profile))
      .toEqual([]);
  });

  it('can relax overkill filtering when explicitly allowed', () => {
    const resumeText = formatResumePrompt({
      summary: engineeringResume.personalInfo?.summary,
      experience: engineeringResume.experience,
      skills: engineeringResume.skills
    });
    const profile = inferSectorProfile(engineeringResume);
    const questions: TImproveQuestion[] = [
      {
        question:
          'How many users adopted this workflow, how frequently did they use it, and what downstream impact did that have on business throughput?',
        context:
          'Delivered a multi-step form flow that replaced a manual workflow and reduced submission time',
        targetType: 'highlight',
        experienceId: 'exp-eng',
        highlightId: 'h-eng-1'
      }
    ];

    expect(
      filterImproveQuestions(
        questions,
        engineeringResume,
        resumeText,
        profile,
        { allowOverloadedQuestions: true }
      )
    ).toEqual(questions);
  });
});

describe('selectImproveQuestions', () => {
  it('falls back to relaxed filtering when strict filtering leaves too few questions', () => {
    const resumeText = formatResumePrompt({
      summary: engineeringResume.personalInfo?.summary,
      experience: engineeringResume.experience,
      skills: engineeringResume.skills
    });
    const profile = inferSectorProfile(engineeringResume);
    const questions: TImproveQuestion[] = [
      {
        question:
          'How many users adopted this workflow, how frequently did they use it, and what downstream impact did that have on business throughput?',
        context:
          'Delivered a multi-step form flow that replaced a manual workflow and reduced submission time',
        targetType: 'highlight',
        experienceId: 'exp-eng',
        highlightId: 'h-eng-1'
      }
    ];

    expect(selectImproveQuestions(questions, engineeringResume, resumeText, profile))
      .toEqual(questions);
  });
});
