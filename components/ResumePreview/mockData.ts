import { nanoid } from 'nanoid';
import type { TResumeData } from '@/types/schema';
import { resumeInfoDefaultValues } from '@/types/schema';

export const mockPersonalInfo = {
  fullName: 'John Doe',
  email: 'john.doe@email.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  linkedIn: 'https://linkedin.com/in/johndoe',
  website: 'https://johndoe.com',
  summary:
    'Results-driven professional with 5+ years of experience in software development. Proven track record of delivering high-quality solutions and leading cross-functional teams.'
};

export const mockExperience = [
  {
    id: nanoid(),
    company: 'NTT DATA Europe & Latam',
    position: 'Front End Lead, UNFCCC ISS',
    location: 'Athens, Greece',
    startDate: 'Jul 2025',
    endDate: '',
    current: true,
    description:
      'Promoted to Front End Lead for the UNFCCC International Sustainability Standards project.',
    highlights: [
      { id: nanoid(), value: 'Led frontend architecture for climate reporting platform' },
      { id: nanoid(), value: 'Managed team of 4 frontend engineers' }
    ]
  },
  {
    id: nanoid(),
    company: 'NTT DATA Europe & Latam',
    position: 'Smart Contract Engineer, IOBSI',
    location: 'Athens, Greece',
    startDate: 'Jan 2025',
    endDate: 'Jul 2025',
    current: false,
    description:
      'Engineered smart contracts and frontend interfaces for blockchain-based identity solutions.',
    highlights: [
      { id: nanoid(), value: 'Built Solidity smart contracts for decentralized identity' },
      { id: nanoid(), value: 'Integrated Web3 wallet authentication' }
    ]
  },
  {
    id: nanoid(),
    company: 'NTT DATA Europe & Latam',
    position: 'Deputy Team Leader, UNFCCC ETF',
    location: 'Athens, Greece',
    startDate: 'Nov 2023',
    endDate: 'Nov 2024',
    current: false,
    description:
      'Led general tasks and sprint planning for the UNFCCC Enhanced Transparency Framework.',
    highlights: [
      { id: nanoid(), value: 'Coordinated cross-functional team of 8 engineers' },
      { id: nanoid(), value: 'Delivered project milestones ahead of schedule' }
    ]
  },
  {
    id: nanoid(),
    company: 'Tech Innovations Inc',
    position: 'Software Developer',
    location: 'Seattle, WA',
    startDate: 'Jun 2018',
    endDate: 'Dec 2019',
    current: false,
    description:
      'Developed full-stack web applications using modern frameworks. Collaborated with design team to implement responsive UI components.',
    highlights: [
      { id: nanoid(), value: 'Improved test coverage to 85%' },
      { id: nanoid(), value: 'Built RESTful APIs' }
    ]
  }
];

export const mockEducation = [
  {
    id: nanoid(),
    institution: 'University of California',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    location: 'Berkeley, CA',
    graduationDate: 'May 2019',
    gpa: '3.8'
  },
  {
    id: nanoid(),
    institution: 'MIT',
    degree: 'Master of Science',
    field: 'Computer Science',
    location: 'Cambridge, MA',
    graduationDate: 'May 2018',
    gpa: '3.9'
  }
];

export const mockSkills = [
  { id: nanoid(), name: 'Languages', values: [{ id: nanoid(), value: 'JavaScript' }, { id: nanoid(), value: 'TypeScript' }, { id: nanoid(), value: 'Python' }] },
  { id: nanoid(), name: 'Frontend', values: [{ id: nanoid(), value: 'React' }] },
  { id: nanoid(), name: 'Backend', values: [{ id: nanoid(), value: 'Node.js' }] },
  { id: nanoid(), name: 'Data', values: [{ id: nanoid(), value: 'PostgreSQL' }] },
  { id: nanoid(), name: 'DevOps', values: [{ id: nanoid(), value: 'Docker' }, { id: nanoid(), value: 'AWS' }] }
];

/** Homepage default mock as TResumeData — used when no resume selected. */
export const homepageDefaultMockData: TResumeData = {
  ...resumeInfoDefaultValues,
  title: 'John Doe Resume',
  personalInfo: mockPersonalInfo,
  experience: mockExperience,
  education: mockEducation,
  skills: mockSkills
};
