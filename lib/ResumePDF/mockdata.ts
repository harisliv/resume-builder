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
  ],
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
        'Developed custom React applications for European Union funded research projects, creating interactive visualizations and data-driven interfaces that effectively displayed complex agricultural sustainability data. Implemented responsive designs and ensured cross-browser compatibility across all major platforms.'
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
  skills: [
    'React',
    'TypeScript',
    'JavaScript',
    'Next.js',
    'Node.js',
    'Vite',
    'Redux Toolkit',
    'React Query',
    'TanStack Query',
    'Zustand',
    'Jotai',
    'Turborepo',
    'Nx',
    'Storybook',
    'MUI',
    'Chakra UI',
    'Tailwind CSS',
    'Styled Components',
    'Emotion',
    'React Hook Form',
    'Formik',
    'Zod',
    'Yup',
    'Jest',
    'Vitest',
    'Cypress',
    'Playwright',
    'React Testing Library',
    'Express.js',
    'Nest.js',
    'Fastify',
    'GraphQL',
    'Apollo Client',
    'REST APIs',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Kubernetes',
    'AWS',
    'Vercel',
    'Git',
    'GitHub Actions',
    'CI/CD',
    'Agile/Scrum',
    'Figma',
    'Adobe XD'
  ],
  documentStyle: {
    palette: 'ocean',
    font: 'inter',
    style: 'modern'
  }
};
