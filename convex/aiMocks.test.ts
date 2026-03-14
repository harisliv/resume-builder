import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildMockImproveTurn, buildMockResumeSuggestions, isMockAiEnabled } from './aiMocks';

const resume = {
  personalInfo: {
    summary: 'Frontend engineer building internal tools.'
  },
  experience: [
    {
      company: 'Acme',
      position: 'Frontend Engineer',
      description: 'Built internal dashboards.',
      highlights: [{ value: 'Built React dashboards for ops teams' }]
    }
  ],
  skills: [
    {
      name: 'Frontend',
      values: [{ value: 'React' }, { value: 'TypeScript' }]
    },
    {
      name: 'Tools',
      values: [{ value: 'Figma' }]
    }
  ]
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('isMockAiEnabled', () => {
  it('enables mock mode for explicit mock env', () => {
    vi.stubEnv('MOCK_AI', 'true');

    expect(isMockAiEnabled()).toBe(true);
  });

  it('enables mock mode for testing features env', () => {
    vi.stubEnv('NEXT_PUBLIC_TESTING_FEATURES', 'true');

    expect(isMockAiEnabled()).toBe(true);
  });
});

describe('buildMockResumeSuggestions', () => {
  it('keeps skill category names and adds deterministic suggestion content', () => {
    const suggestions = buildMockResumeSuggestions({
      resume,
      jobDescription:
        'Senior frontend role using React, TypeScript, analytics, experimentation, and stakeholder communication.'
    });

    expect(suggestions.summary).toContain('React');
    expect(suggestions.experience?.[0]?.highlights?.[0]).toContain('analytics');
    expect(
      suggestions.skills?.map((category: { name: string }) => category.name)
    ).toEqual(['Frontend', 'Tools']);
    expect(suggestions.skills?.[0]?.values).toContain('analytics');
  });
});

describe('buildMockImproveTurn', () => {
  it('returns questions payload on first turn', () => {
    const result = buildMockImproveTurn({
      resume,
      isFirstTurn: true
    });

    expect(result.structuredPayload?.questions?.length).toBeGreaterThan(0);
    expect(result.structuredPayload?.isReadyToApply).toBe(false);
  });

  it('returns a parseable resume patch on apply turn', () => {
    const result = buildMockImproveTurn({
      resume,
      isFirstTurn: false,
      answersText:
        'Q: What changed?\nA: Increased conversion by 18% and worked closely with stakeholders.'
    });

    const patch = JSON.parse(result.structuredPayload?.resumePatch ?? '{}');

    expect(result.structuredPayload?.isReadyToApply).toBe(true);
    expect(patch.summary).toContain('18%');
    expect(
      patch.skills.map((category: { name: string }) => category.name)
    ).toEqual([
      'Frontend',
      'Tools'
    ]);
  });
});
