import type { TResumeData } from '@/types';

export const mockResumeData: TResumeData = {
  personalInfo: {
    fullName: 'Haris Livieratos',
    email: 'haris@example.com',
    phone: '+30 123 456 7890',
    location: 'Athens, Greece',
    linkedIn: 'https://linkedin.com/in/harislivieratos',
    website: 'https://harislivieratos.dev',
    summary:
      'Front-End Engineer with 4+ years of experience building scalable web applications using React, TypeScript, and modern JavaScript frameworks. Proven track record of leading development teams, architecting monorepo solutions, and delivering high-quality enterprise platforms for global organizations including the United Nations.'
  },
  experience: [
    {
      company: 'NTT DATA Europe & Latam',
      position: 'Front-End Engineer',
      location: 'Athens, Greece',
      startDate: '2023-11',
      endDate: '',
      current: true,
      description:
        'Promoted to Front End Lead, overseeing a team of three developers. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications. Led general tasks and bug fixes, ensuring timely resolutions that enhanced platform stability. Implemented web socket functionality enabling real-time data sharing. Optimized performance by offloading large object processing to Web Workers.'
    },
    {
      company: 'Upstream',
      position: 'Full Stack Engineer',
      location: 'Athens, Greece',
      startDate: '2021-10',
      endDate: '2023-11',
      current: false,
      description:
        'Led full-stack development with Next.js and custom Express.js backend, optimizing application performance by implementing React Query for API calls and migrating from Redux Connect to Redux Toolkit. Collaborated closely with innovation and business teams to gather project requirements. Developed an interactive marketing flow builder using React Flow, enabling users to visually design campaigns by dragging, connecting, and organizing actionable nodes.'
    },
    {
      company: 'AGENSO',
      position: 'Front End Engineer',
      location: 'Athens, Greece',
      startDate: '2020-09',
      endDate: '2021-10',
      current: false,
      description:
        'Developed custom React applications for European Union funded research projects, creating interactive visualizations and data-driven interfaces that effectively displayed complex agricultural sustainability data.'
    }
  ],
  education: [
    {
      institution: 'University of Piraeus',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Piraeus, Greece',
      graduationDate: '2020',
      gpa: ''
    }
  ],
  skills: [
    'React',
    'TypeScript',
    'Next.js',
    'Node.js',
    'Vite',
    'Redux Toolkit',
    'React Query',
    'Zustand',
    'Turborepo',
    'Storybook',
    'MUI',
    'Tailwind CSS',
    'React Hook Form',
    'Zod',
    'Jest',
    'Vitest',
    'Express.js',
    'Nest.js',
    'Git'
  ]
};
