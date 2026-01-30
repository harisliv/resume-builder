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
    company: 'Acme Corporation',
    position: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    startDate: 'Jan 2020',
    endDate: 'Present',
    current: true,
    description:
      'Led development of microservices architecture serving 1M+ users. Mentored junior developers and implemented CI/CD pipelines.',
    highlights: ['Reduced API latency by 40%', 'Led team of 5 engineers']
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
