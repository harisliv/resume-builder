import { resumeSchema } from '@/types';
import { describe, expect, it } from 'vitest';
import { extendedMockResumeData, mockResumeData } from '../mockdata';

describe('Mock Data', () => {
  describe('mockResumeData', () => {
    it('is valid against the resume schema', () => {
      const result = resumeSchema.safeParse(mockResumeData);
      expect(result.success).toBe(true);
    });

    it('has required personal info fields', () => {
      expect(mockResumeData.personalInfo.fullName).toBeDefined();
      expect(mockResumeData.personalInfo.email).toBeDefined();
      expect(mockResumeData.personalInfo.phone).toBeDefined();
      expect(mockResumeData.personalInfo.location).toBeDefined();
      expect(mockResumeData.personalInfo.summary).toBeDefined();
    });

    it('has at least one experience item', () => {
      expect(mockResumeData.experience.length).toBeGreaterThanOrEqual(1);
    });

    it('has at least one education item', () => {
      expect(mockResumeData.education.length).toBeGreaterThanOrEqual(1);
    });

    it('has at least one skill', () => {
      expect(mockResumeData.skills.length).toBeGreaterThanOrEqual(1);
    });

    it('experience items have required fields', () => {
      mockResumeData.experience.forEach((exp) => {
        expect(exp.company).toBeDefined();
        expect(exp.position).toBeDefined();
        expect(exp.location).toBeDefined();
        expect(exp.startDate).toBeDefined();
        expect(exp.description).toBeDefined();
      });
    });

    it('education items have required fields', () => {
      mockResumeData.education.forEach((edu) => {
        expect(edu.institution).toBeDefined();
        expect(edu.degree).toBeDefined();
        expect(edu.field).toBeDefined();
        expect(edu.location).toBeDefined();
        expect(edu.graduationDate).toBeDefined();
      });
    });
  });

  describe('extendedMockResumeData', () => {
    it('is valid against the resume schema', () => {
      const result = resumeSchema.safeParse(extendedMockResumeData);
      expect(result.success).toBe(true);
    });

    it('has more experience items than mockResumeData', () => {
      expect(extendedMockResumeData.experience.length).toBeGreaterThan(
        mockResumeData.experience.length
      );
    });

    it('has more education items than mockResumeData', () => {
      expect(extendedMockResumeData.education.length).toBeGreaterThan(
        mockResumeData.education.length
      );
    });

    it('has more skills than mockResumeData', () => {
      expect(extendedMockResumeData.skills.length).toBeGreaterThan(
        mockResumeData.skills.length
      );
    });

    it('has at least 5 experience items for pagination testing', () => {
      expect(extendedMockResumeData.experience.length).toBeGreaterThanOrEqual(
        5
      );
    });

    it('has at least 3 education items for pagination testing', () => {
      expect(extendedMockResumeData.education.length).toBeGreaterThanOrEqual(3);
    });

    it('has at least 30 skills for pagination testing', () => {
      expect(extendedMockResumeData.skills.length).toBeGreaterThanOrEqual(30);
    });
  });

  describe('Data Quality', () => {
    it('experience descriptions are meaningful length', () => {
      extendedMockResumeData.experience.forEach((exp) => {
        expect(exp.description!.length).toBeGreaterThanOrEqual(20);
      });
    });

    it('summary is meaningful length', () => {
      expect(
        extendedMockResumeData.personalInfo.summary!.length
      ).toBeGreaterThanOrEqual(50);
    });

    it('all skills are non-empty strings', () => {
      extendedMockResumeData.skills.forEach((skill) => {
        expect(typeof skill).toBe('string');
        expect(skill.length).toBeGreaterThan(0);
      });
    });

    it('dates are in correct format', () => {
      const dateRegex = /^\d{4}(-\d{2})?$/;
      extendedMockResumeData.experience.forEach((exp) => {
        expect(exp.startDate).toMatch(dateRegex);
        if (exp.endDate && !exp.current) {
          expect(exp.endDate).toMatch(dateRegex);
        }
      });
    });

    it('current jobs have current flag set', () => {
      const currentJobs = extendedMockResumeData.experience.filter(
        (exp) => exp.current
      );
      currentJobs.forEach((job) => {
        expect(job.current).toBe(true);
      });
    });
  });
});
