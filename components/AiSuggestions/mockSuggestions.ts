import type { TAiSuggestions } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';

/** Mock suggestions for UI testing - use when suggestions prop is undefined */
export const MOCK_SUGGESTIONS: TAiSuggestions = {
  title: 'Senior Developer - Acme Corp',
  summary:
    'Results-driven software engineer with 5+ years building scalable web applications. Proven track record in React, TypeScript, and Node.js. Passionate about clean architecture and developer experience.',
  experience: [
    {
      description:
        'Led development of customer-facing React applications serving 2M+ users.',
      highlights: [
        'Reduced page load time by 40% through code splitting and lazy loading',
        'Mentored 3 junior developers on best practices',
        'Implemented CI/CD pipeline cutting deployment time by 60%',
        'Drove adoption of TypeScript across 5 teams'
      ]
    }
  ],
  skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'GraphQL']
};

/** Mock current resume data for UI testing - pairs with MOCK_SUGGESTIONS */
export const MOCK_CURRENT_DATA: TResumeForm = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
    summary:
      'Software engineer with experience in web development. I build things.'
  },
  experience: [
    {
      company: 'Acme Corp',
      position: 'Senior Developer',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: 'Built web apps with React.',
      highlights: [
        'Worked on React applications',
        'Reduced page load time by 40% through code splitting'
      ]
    }
  ],
  education: [],
  skills: ['React', 'JavaScript', 'CSS']
};
