import type { TResumeData } from '@/types/schema';

export const mockResumeData: TResumeData = {
  title: 'Senior Software Engineer Resume',
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
      id: 'mock-exp-1',
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
      id: 'mock-exp-2',
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
      id: 'mock-exp-3',
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
      id: 'mock-edu-1',
      institution: 'University of Piraeus',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Piraeus, Greece',
      graduationDate: '2020',
      gpa: ''
    }
  ],
  skills: [
    { id: 'mock-sk-1', name: 'Frontend', values: [{ id: 'mock-sv-1', value: 'React' }, { id: 'mock-sv-2', value: 'TypeScript' }, { id: 'mock-sv-3', value: 'Next.js' }, { id: 'mock-sv-4', value: 'Vite' }, { id: 'mock-sv-5', value: 'MUI' }, { id: 'mock-sv-6', value: 'Tailwind CSS' }] },
    { id: 'mock-sk-2', name: 'StateManagement', values: [{ id: 'mock-sv-7', value: 'Redux Toolkit' }, { id: 'mock-sv-8', value: 'React Query' }, { id: 'mock-sv-9', value: 'Zustand' }] },
    { id: 'mock-sk-3', name: 'Tooling', values: [{ id: 'mock-sv-10', value: 'Turborepo' }, { id: 'mock-sv-11', value: 'Storybook' }, { id: 'mock-sv-12', value: 'Git' }] },
    { id: 'mock-sk-4', name: 'Backend', values: [{ id: 'mock-sv-13', value: 'Node.js' }, { id: 'mock-sv-14', value: 'Express.js' }, { id: 'mock-sv-15', value: 'Nest.js' }] },
    { id: 'mock-sk-5', name: 'Quality', values: [{ id: 'mock-sv-16', value: 'React Hook Form' }, { id: 'mock-sv-17', value: 'Zod' }, { id: 'mock-sv-18', value: 'Jest' }, { id: 'mock-sv-19', value: 'Vitest' }] }
  ],
  documentStyle: {
    palette: 'ocean',
    font: 'inter',
    style: 'classic'
  }
};

export const extendedMockResumeData: TResumeData = {
  title: 'Full Stack Developer Resume',
  personalInfo: {
    fullName: 'Haris Livieratos',
    email: 'haris@example.com',
    phone: '+30 123 456 7890',
    location: 'Athens, Greece',
    linkedIn: 'https://linkedin.com/in/harislivieratos',
    website: 'https://harislivieratos.dev',
    summary:
      'Senior Front-End Engineer with 8+ years of experience building scalable web applications using React, TypeScript, and modern JavaScript frameworks. Proven track record of leading development teams, architecting monorepo solutions, and delivering high-quality enterprise platforms for global organizations including the United Nations, European Commission, and Fortune 500 companies. Expert in performance optimization, accessibility standards, and modern CI/CD practices.'
  },
  experience: [
    {
      id: 'ext-exp-1',
      company: 'NTT DATA Europe & Latam',
      position: 'Front-End Lead Engineer',
      location: 'Athens, Greece',
      startDate: '2023-11',
      endDate: '',
      current: true,
      description:
        'Promoted to Front End Lead, overseeing a team of three developers. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo.',
      highlights: [
        { id: 'ext-h-1', value: 'Built and maintained a reusable component library with Storybook for consistent UI across applications' },
        { id: 'ext-h-2', value: 'Implemented WebSocket functionality enabling real-time data sharing across the platform' },
        { id: 'ext-h-3', value: 'Optimized performance by offloading large object processing to Web Workers, reducing main-thread blocking by 60%' }
      ]
    },
    {
      id: 'ext-exp-2',
      company: 'Upstream',
      position: 'Full Stack Engineer',
      location: 'Athens, Greece',
      startDate: '2021-10',
      endDate: '2023-11',
      current: false,
      description:
        'Led full-stack development with Next.js and custom Express.js backend, optimizing application performance.',
      highlights: [
        { id: 'ext-h-4', value: 'Migrated from Redux Connect to Redux Toolkit, reducing boilerplate by 40%' },
        { id: 'ext-h-5', value: 'Developed an interactive marketing flow builder using React Flow for visual campaign design' },
        { id: 'ext-h-6', value: 'Implemented React Query for API calls, improving caching and data synchronization' }
      ]
    },
    {
      id: 'ext-exp-3',
      company: 'AGENSO',
      position: 'Front End Engineer',
      location: 'Athens, Greece',
      startDate: '2020-09',
      endDate: '2021-10',
      current: false,
      description:
        'Developed custom React applications for European Union funded research projects.',
      highlights: [
        { id: 'ext-h-7', value: 'Created interactive data visualizations for complex agricultural sustainability datasets' },
        { id: 'ext-h-8', value: 'Ensured cross-browser compatibility and responsive designs across all major platforms' }
      ]
    },
    {
      id: 'ext-exp-4',
      company: 'TechStartup Inc.',
      position: 'Junior Front End Developer',
      location: 'Athens, Greece',
      startDate: '2019-03',
      endDate: '2020-09',
      current: false,
      description:
        'Built and maintained multiple client-facing web applications using React and Vue.js. Collaborated with UX designers to implement pixel-perfect designs. Participated in code reviews and contributed to establishing coding standards. Integrated third-party APIs and payment gateways for e-commerce platforms.'
    },
    {
      id: 'ext-exp-5',
      company: 'Freelance',
      position: 'Web Developer',
      location: 'Remote',
      startDate: '2017-06',
      endDate: '2019-03',
      current: false,
      description:
        'Delivered custom websites and web applications for small businesses and startups. Managed full project lifecycle from requirements gathering to deployment. Built WordPress themes and plugins, as well as custom solutions using vanilla JavaScript and jQuery. Established long-term relationships with clients through quality deliverables and excellent communication.'
    },
    {
      id: 'ext-exp-6',
      company: 'Digital Agency XYZ',
      position: 'Intern Web Developer',
      location: 'Athens, Greece',
      startDate: '2016-09',
      endDate: '2017-06',
      current: false,
      description:
        'Assisted senior developers in building responsive websites for agency clients. Learned modern web development practices including version control with Git, CSS preprocessors, and JavaScript frameworks. Participated in daily standups and sprint planning meetings.'
    }
  ],
  education: [
    {
      id: 'ext-edu-1',
      institution: 'University of Piraeus',
      degree: 'Master of Science',
      field: 'Software Engineering',
      location: 'Piraeus, Greece',
      graduationDate: '2022',
      gpa: '3.8'
    },
    {
      id: 'ext-edu-2',
      institution: 'University of Piraeus',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Piraeus, Greece',
      graduationDate: '2020',
      gpa: '3.6'
    },
    {
      id: 'ext-edu-3',
      institution: 'Athens Technical Institute',
      degree: 'Associate Degree',
      field: 'Web Development',
      location: 'Athens, Greece',
      graduationDate: '2016',
      gpa: ''
    }
  ],
  skills: [
    { id: 'ext-sk-1', name: 'Languages', values: [{ id: 'ext-sv-1', value: 'TypeScript' }, { id: 'ext-sv-2', value: 'JavaScript' }] },
    {
      id: 'ext-sk-2',
      name: 'Frontend',
      values: [
        { id: 'ext-sv-3', value: 'React' },
        { id: 'ext-sv-4', value: 'Next.js' },
        { id: 'ext-sv-5', value: 'Vite' },
        { id: 'ext-sv-6', value: 'MUI' },
        { id: 'ext-sv-7', value: 'Chakra UI' },
        { id: 'ext-sv-8', value: 'Tailwind CSS' },
        { id: 'ext-sv-9', value: 'Styled Components' },
        { id: 'ext-sv-10', value: 'Emotion' }
      ]
    },
    {
      id: 'ext-sk-3',
      name: 'StateManagement',
      values: [{ id: 'ext-sv-11', value: 'Redux Toolkit' }, { id: 'ext-sv-12', value: 'React Query' }, { id: 'ext-sv-13', value: 'TanStack Query' }, { id: 'ext-sv-14', value: 'Zustand' }, { id: 'ext-sv-15', value: 'Jotai' }]
    },
    { id: 'ext-sk-4', name: 'FormsAndValidation', values: [{ id: 'ext-sv-16', value: 'React Hook Form' }, { id: 'ext-sv-17', value: 'Formik' }, { id: 'ext-sv-18', value: 'Zod' }, { id: 'ext-sv-19', value: 'Yup' }] },
    {
      id: 'ext-sk-5',
      name: 'Testing',
      values: [{ id: 'ext-sv-20', value: 'Jest' }, { id: 'ext-sv-21', value: 'Vitest' }, { id: 'ext-sv-22', value: 'Cypress' }, { id: 'ext-sv-23', value: 'Playwright' }, { id: 'ext-sv-24', value: 'React Testing Library' }]
    },
    {
      id: 'ext-sk-6',
      name: 'BackendAndApis',
      values: [
        { id: 'ext-sv-25', value: 'Node.js' },
        { id: 'ext-sv-26', value: 'Express.js' },
        { id: 'ext-sv-27', value: 'Nest.js' },
        { id: 'ext-sv-28', value: 'Fastify' },
        { id: 'ext-sv-29', value: 'GraphQL' },
        { id: 'ext-sv-30', value: 'Apollo Client' },
        { id: 'ext-sv-31', value: 'REST APIs' }
      ]
    },
    { id: 'ext-sk-7', name: 'Data', values: [{ id: 'ext-sv-32', value: 'PostgreSQL' }, { id: 'ext-sv-33', value: 'MongoDB' }, { id: 'ext-sv-34', value: 'Redis' }] },
    {
      id: 'ext-sk-8',
      name: 'DevOps',
      values: [{ id: 'ext-sv-35', value: 'Docker' }, { id: 'ext-sv-36', value: 'Kubernetes' }, { id: 'ext-sv-37', value: 'AWS' }, { id: 'ext-sv-38', value: 'Vercel' }, { id: 'ext-sv-39', value: 'Git' }, { id: 'ext-sv-40', value: 'GitHub Actions' }, { id: 'ext-sv-41', value: 'CI/CD' }]
    },
    {
      id: 'ext-sk-9',
      name: 'Collaboration',
      values: [{ id: 'ext-sv-42', value: 'Agile/Scrum' }, { id: 'ext-sv-43', value: 'Figma' }, { id: 'ext-sv-44', value: 'Adobe XD' }, { id: 'ext-sv-45', value: 'Storybook' }, { id: 'ext-sv-46', value: 'Nx' }, { id: 'ext-sv-47', value: 'Turborepo' }]
    }
  ],
  documentStyle: {
    palette: 'ocean',
    font: 'inter',
    style: 'classic'
  }
};

/**
 * Mock for page-break testing: one company with 5–6 roles, long descriptions, many highlights.
 * groupExperience groups them; verify layout consistency across page breaks.
 */
export const groupedLongMockData: TResumeData = {
  title: 'Grouped Roles + Long Content (Page Break Test)',
  personalInfo: {
    fullName: 'Alex PageBreak',
    email: 'alex@example.com',
    phone: '+30 987 654 3210',
    location: 'Athens, Greece',
    linkedIn: 'https://linkedin.com/in/alexpagebreak',
    website: 'https://alexpagebreak.dev',
    summary:
      'Senior Front-End Engineer with 10+ years of experience building scalable web applications using React, TypeScript, and modern JavaScript frameworks. Proven track record of leading development teams, architecting monorepo solutions, and delivering high-quality enterprise platforms for global organizations including the United Nations, European Commission, and Fortune 500 companies. Expert in performance optimization, accessibility standards, and modern CI/CD practices. Passionate about mentoring junior developers and establishing coding standards across distributed teams.'
  },
  experience: [
    {
      id: 'grp-exp-1',
      company: 'NTT DATA Europe & Latam',
      position: 'Front End Lead, UNFCCC ISS',
      location: 'Athens, Greece',
      startDate: '2023-11',
      endDate: '',
      current: true,
      description:
        'Promoted to Front End Lead for the UNFCCC International Sustainability Standards project. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications. Led general tasks and bug fixes, ensuring timely resolutions that enhanced platform stability.',
      highlights: [
        { id: 'grp-h-1', value: 'Led frontend architecture for climate reporting platform serving 195+ countries' },
        { id: 'grp-h-2', value: 'Managed team of 4 frontend engineers across distributed timezones' },
        { id: 'grp-h-3', value: 'Implemented WebSocket functionality enabling real-time data sharing across the platform' },
        { id: 'grp-h-4', value: 'Optimized performance by offloading large object processing to Web Workers, reducing main-thread blocking by 60%' },
        { id: 'grp-h-5', value: 'Established coding standards and CI/CD pipelines for the project' },
        { id: 'grp-h-6', value: 'Collaborated with UN stakeholders on accessibility compliance (WCAG 2.1 AA)' },
        { id: 'grp-h-7', value: 'Delivered project milestones ahead of schedule despite scope changes' }
      ]
    },
    {
      id: 'grp-exp-2',
      company: 'NTT DATA Europe & Latam',
      position: 'Smart Contract Engineer, IOBSI',
      location: 'Athens, Greece',
      startDate: '2025-01',
      endDate: '2025-07',
      current: false,
      description:
        'Engineered smart contracts and frontend interfaces for blockchain-based identity solutions. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications. Led general tasks and bug fixes, ensuring timely resolutions that enhanced platform stability.',
      highlights: [
        { id: 'grp-h-8', value: 'Built Solidity smart contracts for decentralized identity verification' },
        { id: 'grp-h-9', value: 'Integrated Web3 wallet authentication with MetaMask and WalletConnect' },
        { id: 'grp-h-10', value: 'Designed gas-efficient contract patterns for high-frequency transaction scenarios' },
        { id: 'grp-h-11', value: 'Implemented comprehensive test coverage for smart contracts using Hardhat' },
        { id: 'grp-h-12', value: 'Collaborated with security team on audit findings and remediation' },
        { id: 'grp-h-13', value: 'Documented architecture decisions and deployment procedures for future maintainers' },
        { id: 'grp-h-14', value: 'Reduced gas costs by 40% through contract optimization' }
      ]
    },
    {
      id: 'grp-exp-3',
      company: 'NTT DATA Europe & Latam',
      position: 'Deputy Team Leader, UNFCCC ETF',
      location: 'Athens, Greece',
      startDate: '2023-11',
      endDate: '2024-11',
      current: false,
      description:
        'Led general tasks and sprint planning for the UNFCCC Enhanced Transparency Framework. Coordinated cross-functional team of 8 engineers across frontend, backend, and DevOps. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications.',
      highlights: [
        { id: 'grp-h-15', value: 'Coordinated cross-functional team of 8 engineers across frontend, backend, and DevOps' },
        { id: 'grp-h-16', value: 'Delivered project milestones ahead of schedule despite scope changes' },
        { id: 'grp-h-17', value: 'Implemented feature flags for gradual rollout of new reporting modules' },
        { id: 'grp-h-18', value: 'Conducted code reviews and mentored junior developers on best practices' },
        { id: 'grp-h-19', value: 'Established incident response procedures and on-call rotation' },
        { id: 'grp-h-20', value: 'Reduced deployment time from 2 hours to 15 minutes through CI/CD pipeline improvements' },
        { id: 'grp-h-21', value: 'Led technical debt discussions and prioritized refactoring initiatives' }
      ]
    },
    {
      id: 'grp-exp-4',
      company: 'NTT DATA Europe & Latam',
      position: 'Senior Front End Developer',
      location: 'Athens, Greece',
      startDate: '2022-03',
      endDate: '2023-11',
      current: false,
      description:
        'Developed custom React applications for European Union funded research projects. Created interactive visualizations and data-driven interfaces that effectively displayed complex agricultural sustainability data. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications.',
      highlights: [
        { id: 'grp-h-22', value: 'Created interactive data visualizations for complex agricultural sustainability datasets' },
        { id: 'grp-h-23', value: 'Ensured cross-browser compatibility and responsive designs across all major platforms' },
        { id: 'grp-h-24', value: 'Implemented virtualization for large datasets (10k+ rows) without performance degradation' },
        { id: 'grp-h-25', value: 'Integrated with REST and GraphQL APIs for real-time data synchronization' },
        { id: 'grp-h-26', value: 'Participated in design system evolution and component library documentation' },
        { id: 'grp-h-27', value: 'Mentored 2 junior developers on React patterns and testing strategies' },
        { id: 'grp-h-28', value: 'Reduced bundle size by 30% through code splitting and lazy loading' }
      ]
    },
    {
      id: 'grp-exp-5',
      company: 'NTT DATA Europe & Latam',
      position: 'Junior Front End Developer',
      location: 'Athens, Greece',
      startDate: '2021-06',
      endDate: '2022-03',
      current: false,
      description:
        'Built and maintained multiple client-facing web applications using React and Vue.js. Collaborated with UX designers to implement pixel-perfect designs. Participated in code reviews and contributed to establishing coding standards. Integrated third-party APIs and payment gateways for e-commerce platforms. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo.',
      highlights: [
        { id: 'grp-h-29', value: 'Developed reusable UI components using React and TypeScript' },
        { id: 'grp-h-30', value: 'Implemented unit tests with Jest and React Testing Library for critical paths' },
        { id: 'grp-h-31', value: 'Fixed accessibility issues identified in automated accessibility audits' },
        { id: 'grp-h-32', value: 'Improved build performance by optimizing webpack configuration' },
        { id: 'grp-h-33', value: 'Documented component usage and API contracts in Storybook' },
        { id: 'grp-h-34', value: 'Participated in agile ceremonies and sprint planning sessions' }
      ]
    },
    {
      id: 'grp-exp-6',
      company: 'NTT DATA Europe & Latam',
      position: 'Intern Web Developer',
      location: 'Athens, Greece',
      startDate: '2020-09',
      endDate: '2021-06',
      current: false,
      description:
        'Assisted senior developers in building responsive websites for agency clients. Learned modern web development practices including version control with Git, CSS preprocessors, and JavaScript frameworks. Participated in daily standups and sprint planning meetings. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo.',
      highlights: [
        { id: 'grp-h-35', value: 'Assisted in building responsive websites for agency clients' },
        { id: 'grp-h-36', value: 'Learned version control with Git and modern JavaScript frameworks' },
        { id: 'grp-h-37', value: 'Participated in daily standups and sprint planning meetings' },
        { id: 'grp-h-38', value: 'Implemented basic CRUD operations for internal admin tools' },
        { id: 'grp-h-39', value: 'Contributed to documentation and developer onboarding materials' }
      ]
    }
  ],
  education: [
    {
      id: 'grp-edu-1',
      institution: 'University of Piraeus',
      degree: 'Master of Science',
      field: 'Software Engineering',
      location: 'Piraeus, Greece',
      graduationDate: '2022',
      gpa: '3.8'
    },
    {
      id: 'grp-edu-2',
      institution: 'University of Piraeus',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Piraeus, Greece',
      graduationDate: '2020',
      gpa: '3.6'
    },
    {
      id: 'grp-edu-3',
      institution: 'Athens Technical Institute',
      degree: 'Associate Degree',
      field: 'Web Development',
      location: 'Athens, Greece',
      graduationDate: '2016',
      gpa: ''
    }
  ],
  skills: [
    { id: 'grp-sk-1', name: 'Languages', values: [{ id: 'grp-sv-1', value: 'TypeScript' }, { id: 'grp-sv-2', value: 'JavaScript' }] },
    {
      id: 'grp-sk-2',
      name: 'Frontend',
      values: [
        { id: 'grp-sv-3', value: 'React' },
        { id: 'grp-sv-4', value: 'Next.js' },
        { id: 'grp-sv-5', value: 'Vite' },
        { id: 'grp-sv-6', value: 'MUI' },
        { id: 'grp-sv-7', value: 'Chakra UI' },
        { id: 'grp-sv-8', value: 'Tailwind CSS' },
        { id: 'grp-sv-9', value: 'Styled Components' },
        { id: 'grp-sv-10', value: 'Emotion' }
      ]
    },
    {
      id: 'grp-sk-3',
      name: 'StateManagement',
      values: [{ id: 'grp-sv-11', value: 'Redux Toolkit' }, { id: 'grp-sv-12', value: 'React Query' }, { id: 'grp-sv-13', value: 'TanStack Query' }, { id: 'grp-sv-14', value: 'Zustand' }, { id: 'grp-sv-15', value: 'Jotai' }]
    },
    { id: 'grp-sk-4', name: 'FormsAndValidation', values: [{ id: 'grp-sv-16', value: 'React Hook Form' }, { id: 'grp-sv-17', value: 'Formik' }, { id: 'grp-sv-18', value: 'Zod' }, { id: 'grp-sv-19', value: 'Yup' }] },
    {
      id: 'grp-sk-5',
      name: 'Testing',
      values: [{ id: 'grp-sv-20', value: 'Jest' }, { id: 'grp-sv-21', value: 'Vitest' }, { id: 'grp-sv-22', value: 'Cypress' }, { id: 'grp-sv-23', value: 'Playwright' }, { id: 'grp-sv-24', value: 'React Testing Library' }]
    },
    {
      id: 'grp-sk-6',
      name: 'BackendAndApis',
      values: [
        { id: 'grp-sv-25', value: 'Node.js' },
        { id: 'grp-sv-26', value: 'Express.js' },
        { id: 'grp-sv-27', value: 'Nest.js' },
        { id: 'grp-sv-28', value: 'Fastify' },
        { id: 'grp-sv-29', value: 'GraphQL' },
        { id: 'grp-sv-30', value: 'Apollo Client' },
        { id: 'grp-sv-31', value: 'REST APIs' }
      ]
    },
    { id: 'grp-sk-7', name: 'Data', values: [{ id: 'grp-sv-32', value: 'PostgreSQL' }, { id: 'grp-sv-33', value: 'MongoDB' }, { id: 'grp-sv-34', value: 'Redis' }] },
    {
      id: 'grp-sk-8',
      name: 'DevOps',
      values: [{ id: 'grp-sv-35', value: 'Docker' }, { id: 'grp-sv-36', value: 'Kubernetes' }, { id: 'grp-sv-37', value: 'AWS' }, { id: 'grp-sv-38', value: 'Vercel' }, { id: 'grp-sv-39', value: 'Git' }, { id: 'grp-sv-40', value: 'GitHub Actions' }, { id: 'grp-sv-41', value: 'CI/CD' }]
    },
    {
      id: 'grp-sk-9',
      name: 'Collaboration',
      values: [{ id: 'grp-sv-42', value: 'Agile/Scrum' }, { id: 'grp-sv-43', value: 'Figma' }, { id: 'grp-sv-44', value: 'Adobe XD' }, { id: 'grp-sv-45', value: 'Storybook' }, { id: 'grp-sv-46', value: 'Nx' }, { id: 'grp-sv-47', value: 'Turborepo' }]
    }
  ],
  documentStyle: {
    palette: 'ocean',
    font: 'inter',
    style: 'classic'
  }
};
