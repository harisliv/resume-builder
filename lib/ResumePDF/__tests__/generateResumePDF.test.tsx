import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockResumeData, extendedMockResumeData } from '../mockdata';

vi.mock('@react-pdf/renderer', () => ({
  Font: {
    register: vi.fn()
  },
  pdf: vi.fn(() => ({
    toBlob: vi.fn().mockResolvedValue(new Blob(['test'], { type: 'application/pdf' }))
  })),
  Document: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Page: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  View: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Text: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  Svg: ({ children }: { children: React.ReactNode }) => <svg>{children}</svg>,
  Circle: () => <circle />,
  Rect: () => <rect />,
  Path: () => <path />,
  Defs: ({ children }: { children: React.ReactNode }) => <defs>{children}</defs>,
  LinearGradient: ({ children }: { children: React.ReactNode }) => (
    <linearGradient>{children}</linearGradient>
  ),
  Stop: () => <stop />,
  StyleSheet: {
    create: (styles: Record<string, object>) => styles
  }
}));

describe('generateResumePDF', () => {
  let createObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.spyOn>;
  let appendChildSpy: ReturnType<typeof vi.spyOn>;
  let removeChildSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:test-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not throw with valid mock data', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    await expect(generateResumePDF(mockResumeData)).resolves.not.toThrow();
  });

  it('creates a blob URL', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    await generateResumePDF(mockResumeData);
    expect(createObjectURLSpy).toHaveBeenCalled();
  });

  it('revokes the blob URL after download', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    await generateResumePDF(mockResumeData);
    vi.advanceTimersByTime(200);
    expect(revokeObjectURLSpy).toHaveBeenCalled();
  });

  it('appends anchor element to trigger download', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    await generateResumePDF(mockResumeData);
    expect(appendChildSpy).toHaveBeenCalled();
  });

  it('works with extended mock data', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    await expect(generateResumePDF(extendedMockResumeData)).resolves.not.toThrow();
  });

  it('handles empty full name gracefully', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    const dataWithEmptyName = {
      ...mockResumeData,
      personalInfo: {
        ...mockResumeData.personalInfo,
        fullName: ''
      }
    };
    await expect(generateResumePDF(dataWithEmptyName)).resolves.not.toThrow();
  });

  it('handles data with many experience items', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    const manyExperiences = {
      ...mockResumeData,
      experience: Array(10)
        .fill(null)
        .map((_, i) => ({
          company: `Company ${i + 1}`,
          position: `Position ${i + 1}`,
          location: 'Location',
          startDate: '2020-01',
          endDate: '2021-01',
          current: false,
          description: 'Description that is at least 20 characters long.'
        }))
    };
    await expect(generateResumePDF(manyExperiences)).resolves.not.toThrow();
  });

  it('handles data with many skills', async () => {
    const { generateResumePDF } = await import('../generateResumePDF');
    const manySkills = {
      ...mockResumeData,
      skills: Array(50)
        .fill(null)
        .map((_, i) => `Skill ${i + 1}`)
    };
    await expect(generateResumePDF(manySkills)).resolves.not.toThrow();
  });
});
