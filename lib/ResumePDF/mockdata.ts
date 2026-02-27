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
  skills: {
    Frontend: ['React', 'TypeScript', 'Next.js', 'Vite', 'MUI', 'Tailwind CSS'],
    StateManagement: ['Redux Toolkit', 'React Query', 'Zustand'],
    Tooling: ['Turborepo', 'Storybook', 'Git'],
    Backend: ['Node.js', 'Express.js', 'Nest.js'],
    Quality: ['React Hook Form', 'Zod', 'Jest', 'Vitest']
  },
  documentStyle: {
    palette: 'ocean',
    font: 'inter',
    style: 'modern'
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
      company: 'NTT DATA Europe & Latam',
      position: 'Front-End Lead Engineer',
      location: 'Athens, Greece',
      startDate: '2023-11',
      endDate: '',
      current: true,
      description:
        'Promoted to Front End Lead, overseeing a team of three developers. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo.',
      highlights: [
        'Built and maintained a reusable component library with Storybook for consistent UI across applications',
        'Implemented WebSocket functionality enabling real-time data sharing across the platform',
        'Optimized performance by offloading large object processing to Web Workers, reducing main-thread blocking by 60%'
      ]
    },
    {
      company: 'Upstream',
      position: 'Full Stack Engineer',
      location: 'Athens, Greece',
      startDate: '2021-10',
      endDate: '2023-11',
      current: false,
      description:
        'Led full-stack development with Next.js and custom Express.js backend, optimizing application performance.',
      highlights: [
        'Migrated from Redux Connect to Redux Toolkit, reducing boilerplate by 40%',
        'Developed an interactive marketing flow builder using React Flow for visual campaign design',
        'Implemented React Query for API calls, improving caching and data synchronization'
      ]
    },
    {
      company: 'AGENSO',
      position: 'Front End Engineer',
      location: 'Athens, Greece',
      startDate: '2020-09',
      endDate: '2021-10',
      current: false,
      description:
        'Developed custom React applications for European Union funded research projects.',
      highlights: [
        'Created interactive data visualizations for complex agricultural sustainability datasets',
        'Ensured cross-browser compatibility and responsive designs across all major platforms'
      ]
    },
    {
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
      institution: 'University of Piraeus',
      degree: 'Master of Science',
      field: 'Software Engineering',
      location: 'Piraeus, Greece',
      graduationDate: '2022',
      gpa: '3.8'
    },
    {
      institution: 'University of Piraeus',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Piraeus, Greece',
      graduationDate: '2020',
      gpa: '3.6'
    },
    {
      institution: 'Athens Technical Institute',
      degree: 'Associate Degree',
      field: 'Web Development',
      location: 'Athens, Greece',
      graduationDate: '2016',
      gpa: ''
    }
  ],
  skills: {
    Languages: ['TypeScript', 'JavaScript'],
    Frontend: [
      'React',
      'Next.js',
      'Vite',
      'MUI',
      'Chakra UI',
      'Tailwind CSS',
      'Styled Components',
      'Emotion'
    ],
    StateManagement: ['Redux Toolkit', 'React Query', 'TanStack Query', 'Zustand', 'Jotai'],
    FormsAndValidation: ['React Hook Form', 'Formik', 'Zod', 'Yup'],
    Testing: ['Jest', 'Vitest', 'Cypress', 'Playwright', 'React Testing Library'],
    BackendAndApis: ['Node.js', 'Express.js', 'Nest.js', 'Fastify', 'GraphQL', 'Apollo Client', 'REST APIs'],
    Data: ['PostgreSQL', 'MongoDB', 'Redis'],
    DevOps: ['Docker', 'Kubernetes', 'AWS', 'Vercel', 'Git', 'GitHub Actions', 'CI/CD'],
    Collaboration: ['Agile/Scrum', 'Figma', 'Adobe XD', 'Storybook', 'Nx', 'Turborepo']
  },
  documentStyle: {
    palette: 'ocean',
    font: 'inter',
    style: 'modern'
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
      company: 'NTT DATA Europe & Latam',
      position: 'Front End Lead, UNFCCC ISS',
      location: 'Athens, Greece',
      startDate: '2023-11',
      endDate: '',
      current: true,
      description:
        'Promoted to Front End Lead for the UNFCCC International Sustainability Standards project. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications. Led general tasks and bug fixes, ensuring timely resolutions that enhanced platform stability.',
      highlights: [
        'Led frontend architecture for climate reporting platform serving 195+ countries',
        'Managed team of 4 frontend engineers across distributed timezones',
        'Implemented WebSocket functionality enabling real-time data sharing across the platform',
        'Optimized performance by offloading large object processing to Web Workers, reducing main-thread blocking by 60%',
        'Established coding standards and CI/CD pipelines for the project',
        'Collaborated with UN stakeholders on accessibility compliance (WCAG 2.1 AA)',
        'Delivered project milestones ahead of schedule despite scope changes'
      ]
    },
    {
      company: 'NTT DATA Europe & Latam',
      position: 'Smart Contract Engineer, IOBSI',
      location: 'Athens, Greece',
      startDate: '2025-01',
      endDate: '2025-07',
      current: false,
      description:
        'Engineered smart contracts and frontend interfaces for blockchain-based identity solutions. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications. Led general tasks and bug fixes, ensuring timely resolutions that enhanced platform stability.',
      highlights: [
        'Built Solidity smart contracts for decentralized identity verification',
        'Integrated Web3 wallet authentication with MetaMask and WalletConnect',
        'Designed gas-efficient contract patterns for high-frequency transaction scenarios',
        'Implemented comprehensive test coverage for smart contracts using Hardhat',
        'Collaborated with security team on audit findings and remediation',
        'Documented architecture decisions and deployment procedures for future maintainers',
        'Reduced gas costs by 40% through contract optimization'
      ]
    },
    {
      company: 'NTT DATA Europe & Latam',
      position: 'Deputy Team Leader, UNFCCC ETF',
      location: 'Athens, Greece',
      startDate: '2023-11',
      endDate: '2024-11',
      current: false,
      description:
        'Led general tasks and sprint planning for the UNFCCC Enhanced Transparency Framework. Coordinated cross-functional team of 8 engineers across frontend, backend, and DevOps. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications.',
      highlights: [
        'Coordinated cross-functional team of 8 engineers across frontend, backend, and DevOps',
        'Delivered project milestones ahead of schedule despite scope changes',
        'Implemented feature flags for gradual rollout of new reporting modules',
        'Conducted code reviews and mentored junior developers on best practices',
        'Established incident response procedures and on-call rotation',
        'Reduced deployment time from 2 hours to 15 minutes through CI/CD pipeline improvements',
        'Led technical debt discussions and prioritized refactoring initiatives'
      ]
    },
    {
      company: 'NTT DATA Europe & Latam',
      position: 'Senior Front End Developer',
      location: 'Athens, Greece',
      startDate: '2022-03',
      endDate: '2023-11',
      current: false,
      description:
        'Developed custom React applications for European Union funded research projects. Created interactive visualizations and data-driven interfaces that effectively displayed complex agricultural sustainability data. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo. Built and maintained a reusable component library with Storybook for consistent UI across applications.',
      highlights: [
        'Created interactive data visualizations for complex agricultural sustainability datasets',
        'Ensured cross-browser compatibility and responsive designs across all major platforms',
        'Implemented virtualization for large datasets (10k+ rows) without performance degradation',
        'Integrated with REST and GraphQL APIs for real-time data synchronization',
        'Participated in design system evolution and component library documentation',
        'Mentored 2 junior developers on React patterns and testing strategies',
        'Reduced bundle size by 30% through code splitting and lazy loading'
      ]
    },
    {
      company: 'NTT DATA Europe & Latam',
      position: 'Junior Front End Developer',
      location: 'Athens, Greece',
      startDate: '2021-06',
      endDate: '2022-03',
      current: false,
      description:
        'Built and maintained multiple client-facing web applications using React and Vue.js. Collaborated with UX designers to implement pixel-perfect designs. Participated in code reviews and contributed to establishing coding standards. Integrated third-party APIs and payment gateways for e-commerce platforms. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo.',
      highlights: [
        'Developed reusable UI components using React and TypeScript',
        'Implemented unit tests with Jest and React Testing Library for critical paths',
        'Fixed accessibility issues identified in automated accessibility audits',
        'Improved build performance by optimizing webpack configuration',
        'Documented component usage and API contracts in Storybook',
        'Participated in agile ceremonies and sprint planning sessions'
      ]
    },
    {
      company: 'NTT DATA Europe & Latam',
      position: 'Intern Web Developer',
      location: 'Athens, Greece',
      startDate: '2020-09',
      endDate: '2021-06',
      current: false,
      description:
        'Assisted senior developers in building responsive websites for agency clients. Learned modern web development practices including version control with Git, CSS preprocessors, and JavaScript frameworks. Participated in daily standups and sprint planning meetings. Architected and implemented a scalable monorepo architecture using pnpm workspaces and Turborepo.',
      highlights: [
        'Assisted in building responsive websites for agency clients',
        'Learned version control with Git and modern JavaScript frameworks',
        'Participated in daily standups and sprint planning meetings',
        'Implemented basic CRUD operations for internal admin tools',
        'Contributed to documentation and developer onboarding materials'
      ]
    }
  ],
  education: [
    {
      institution: 'University of Piraeus',
      degree: 'Master of Science',
      field: 'Software Engineering',
      location: 'Piraeus, Greece',
      graduationDate: '2022',
      gpa: '3.8'
    },
    {
      institution: 'University of Piraeus',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'Piraeus, Greece',
      graduationDate: '2020',
      gpa: '3.6'
    },
    {
      institution: 'Athens Technical Institute',
      degree: 'Associate Degree',
      field: 'Web Development',
      location: 'Athens, Greece',
      graduationDate: '2016',
      gpa: ''
    }
  ],
  skills: {
    Languages: ['TypeScript', 'JavaScript'],
    Frontend: [
      'React',
      'Next.js',
      'Vite',
      'MUI',
      'Chakra UI',
      'Tailwind CSS',
      'Styled Components',
      'Emotion'
    ],
    StateManagement: ['Redux Toolkit', 'React Query', 'TanStack Query', 'Zustand', 'Jotai'],
    FormsAndValidation: ['React Hook Form', 'Formik', 'Zod', 'Yup'],
    Testing: ['Jest', 'Vitest', 'Cypress', 'Playwright', 'React Testing Library'],
    BackendAndApis: ['Node.js', 'Express.js', 'Nest.js', 'Fastify', 'GraphQL', 'Apollo Client', 'REST APIs'],
    Data: ['PostgreSQL', 'MongoDB', 'Redis'],
    DevOps: ['Docker', 'Kubernetes', 'AWS', 'Vercel', 'Git', 'GitHub Actions', 'CI/CD'],
    Collaboration: ['Agile/Scrum', 'Figma', 'Adobe XD', 'Storybook', 'Nx', 'Turborepo']
  },
  documentStyle: {
    palette: 'ocean',
    font: 'inter',
    style: 'modern'
  }
};
