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
    company: 'NTT DATA Europe & Latam',
    position: 'Front End Lead, UNFCCC ISS',
    location: 'Athens, Greece',
    startDate: 'Jul 2025',
    endDate: '',
    current: true,
    description:
      'Promoted to Front End Lead for the UNFCCC International Sustainability Standards project.',
    highlights: [
      'Led frontend architecture for climate reporting platform',
      'Managed team of 4 frontend engineers'
    ]
  },
  {
    company: 'NTT DATA Europe & Latam',
    position: 'Smart Contract Engineer, IOBSI',
    location: 'Athens, Greece',
    startDate: 'Jan 2025',
    endDate: 'Jul 2025',
    current: false,
    description:
      'Engineered smart contracts and frontend interfaces for blockchain-based identity solutions.',
    highlights: [
      'Built Solidity smart contracts for decentralized identity',
      'Integrated Web3 wallet authentication'
    ]
  },
  {
    company: 'NTT DATA Europe & Latam',
    position: 'Deputy Team Leader, UNFCCC ETF',
    location: 'Athens, Greece',
    startDate: 'Nov 2023',
    endDate: 'Nov 2024',
    current: false,
    description:
      'Led general tasks and sprint planning for the UNFCCC Enhanced Transparency Framework.',
    highlights: [
      'Coordinated cross-functional team of 8 engineers',
      'Delivered project milestones ahead of schedule'
    ]
  },
  {
    company: 'Tech Innovations Inc',
    position: 'Software Developer',
    location: 'Seattle, WA',
    startDate: 'Jun 2018',
    endDate: 'Dec 2019',
    current: false,
    description:
      'Developed full-stack web applications using modern frameworks. Collaborated with design team to implement responsive UI components.',
    highlights: ['Improved test coverage to 85%', 'Built RESTful APIs']
  }
];

export const mockEducation = [
  {
    institution: 'University of California',
    degree: 'Bachelor of Science',
    field: 'Computer Science',
    location: 'Berkeley, CA',
    graduationDate: 'May 2019',
    gpa: '3.8'
  },
  {
    institution: 'MIT',
    degree: 'Master of Science',
    field: 'Computer Science',
    location: 'Cambridge, MA',
    graduationDate: 'May 2018',
    gpa: '3.9'
  }
];

export const mockSkills = [
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'PostgreSQL',
  'Docker',
  'AWS'
];
