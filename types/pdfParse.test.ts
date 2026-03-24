import { describe, expect, it } from 'vitest';
import { normalizeParsedResume, type TParsedResume } from './pdfParse';

/**
 * Builds minimal parsed resume input for normalization tests.
 */
function makeParsedResume(overrides?: Partial<TParsedResume>): TParsedResume {
  return {
    title: 'Imported Resume',
    personalInfo: {
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+34 612 34 56 78',
      location: ' Madrid, Spain ',
      linkedIn: '',
      website: '',
      summary: ''
    },
    experience: [
      {
        company: 'NTT DATA Europe & Latam',
        position: 'Software Engineer',
        projectName: 'UNFCCC Initiative Self-Service platform',
        location: ' ',
        startDate: '2023',
        endDate: 'Current',
        current: true,
        description: 'ISS',
        highlights: ['Built forms']
      },
      {
        company: 'Other Co',
        position: 'Engineer',
        projectName: '',
        location: ' Lisbon, Portugal ',
        startDate: 'January 2025',
        endDate: 'July 2025',
        current: false,
        description: 'IOBSI',
        highlights: ['Built contracts']
      }
    ],
    education: [
      {
        institution: 'University',
        degree: 'BSc',
        field: 'CS',
        location: ' Madrid, Spain ',
        graduationDate: '2019',
        current: false,
        gpa: ''
      }
    ],
    skills: [
      {
        name: 'Languages',
        values: ['TypeScript']
      }
    ],
    ...overrides
  };
}

describe('normalizeParsedResume', () => {
  it('normalizes parsed values to form-friendly formats', () => {
    const normalized = normalizeParsedResume(
      makeParsedResume({
        personalInfo: {
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          phone: '+34 612 34 56 78',
          location: ' Madrid, Spain ',
          linkedIn: '',
          website: '',
          summary: ''
        }
      })
    );

    expect(normalized.personalInfo.phone).toBe('+34612345678');
    expect(normalized.personalInfo.location).toBe('Madrid, Spain');
    expect(normalized.experience[0]).toMatchObject({
      projectName: 'UNFCCC Initiative Self-Service platform',
      location: 'Madrid, Spain',
      startDate: 'Jan 2023',
      endDate: '',
      current: true
    });
    expect(normalized.experience[1]).toMatchObject({
      projectName: '',
      location: 'Lisbon, Portugal',
      startDate: 'Jan 2025',
      endDate: 'Jul 2025',
      current: false
    });
    expect(normalized.education[0].graduationDate).toBe('2019');
    expect(normalized.education[0].location).toBe('Madrid, Spain');
    expect(normalized.skills[0].values).toMatchObject([{ value: 'TypeScript' }]);
    expect(normalized.skills[0].values[0].id).toBeDefined();
    expect(normalized.experience[0].highlights).toMatchObject([{ value: 'Built forms' }]);
    expect(normalized.experience[0].highlights[0].id).toBeDefined();
  });

  it('blanks invalid phone numbers', () => {
    const normalized = normalizeParsedResume(
      makeParsedResume({
        personalInfo: {
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          phone: '123',
          location: 'Madrid, Spain',
          linkedIn: '',
          website: '',
          summary: ''
        }
      })
    );

    expect(normalized.personalInfo.phone).toBe('');
  });
});
