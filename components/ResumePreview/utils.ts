import type { TResumeForm } from '@/types/schema';
import { getVisibleCustomSections } from '@/lib/customSections';
import { hasCategorizedSkills } from '@/lib/skills';
import {
  mockPersonalInfo,
  mockExperience,
  mockEducation,
  mockSkills
} from './mockData';

function isFormCompletelyEmpty(formData: TResumeForm): boolean {
  const personalEmpty =
    !formData.personalInfo?.fullName &&
    !formData.personalInfo?.email &&
    !formData.personalInfo?.phone &&
    !formData.personalInfo?.location &&
    !formData.personalInfo?.linkedIn &&
    !formData.personalInfo?.website &&
    !formData.personalInfo?.summary;

  const expEmpty =
    !formData.experience ||
    formData.experience.length === 0 ||
    formData.experience.every(
      (exp) =>
        !exp.company &&
        !exp.position &&
        !exp.location &&
        !exp.startDate &&
        !exp.endDate &&
        !exp.description &&
        (!exp.highlights || exp.highlights.length === 0)
    );

  const eduEmpty =
    !formData.education ||
    formData.education.length === 0 ||
    formData.education.every(
      (edu) =>
        !edu.institution &&
        !edu.degree &&
        !edu.field &&
        !edu.location &&
        !edu.graduationDate &&
        !edu.gpa
    );

  const skillsEmpty = !hasCategorizedSkills(formData.skills);
  const customSectionsEmpty =
    getVisibleCustomSections(formData.customSections).length === 0;

  return personalEmpty && expEmpty && eduEmpty && skillsEmpty && customSectionsEmpty;
}

export function getPreviewData(formData: TResumeForm): TResumeForm {
  if (isFormCompletelyEmpty(formData)) {
    return {
      personalInfo: mockPersonalInfo,
      experience: mockExperience,
      education: mockEducation,
      skills: mockSkills,
      customSections: []
    };
  }

  return formData;
}
