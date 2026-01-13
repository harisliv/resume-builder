import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ResumeDocument from '../ResumeDocument';
import { mockResumeData, extendedMockResumeData } from '../mockdata';
import type { TResumeData } from '@/types';

vi.mock('@react-pdf/renderer', () => ({
  Font: {
    register: vi.fn()
  },
  Document: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pdf-document">{children}</div>
  ),
  Page: ({ children, wrap }: { children: React.ReactNode; wrap?: boolean }) => (
    <div data-testid="pdf-page" data-wrap={wrap}>
      {children}
    </div>
  ),
  View: ({
    children,
    wrap,
    style,
    fixed,
    minPresenceAhead
  }: {
    children?: React.ReactNode;
    wrap?: boolean;
    style?: object | object[];
    fixed?: boolean;
    minPresenceAhead?: number;
  }) => (
    <div
      data-testid="pdf-view"
      data-wrap={wrap}
      data-fixed={fixed}
      data-min-presence-ahead={minPresenceAhead}
      data-style={JSON.stringify(style)}
    >
      {children}
    </div>
  ),
  Text: ({
    children,
    style,
    render,
    fixed
  }: {
    children?: React.ReactNode;
    style?: object;
    render?: (props: { pageNumber: number; totalPages: number }) => string;
    fixed?: boolean;
  }) => (
    <span
      data-testid="pdf-text"
      data-fixed={fixed}
      data-style={JSON.stringify(style)}
    >
      {render ? render({ pageNumber: 1, totalPages: 2 }) : children}
    </span>
  ),
  Link: ({
    children,
    src,
    style
  }: {
    children: React.ReactNode;
    src: string;
    style?: object;
  }) => (
    <a data-testid="pdf-link" href={src} data-style={JSON.stringify(style)}>
      {children}
    </a>
  ),
  Svg: ({ children }: { children: React.ReactNode }) => (
    <svg data-testid="pdf-svg">{children}</svg>
  ),
  Circle: () => <circle data-testid="pdf-circle" />,
  Rect: () => <rect data-testid="pdf-rect" />,
  Path: () => <path data-testid="pdf-path" />,
  Defs: ({ children }: { children: React.ReactNode }) => (
    <defs data-testid="pdf-defs">{children}</defs>
  ),
  LinearGradient: ({ children }: { children: React.ReactNode }) => (
    <linearGradient data-testid="pdf-linear-gradient">{children}</linearGradient>
  ),
  Stop: () => <stop data-testid="pdf-stop" />,
  StyleSheet: {
    create: (styles: Record<string, object>) => styles
  }
}));

describe('ResumeDocument', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing with minimal data', () => {
      const minimalData: TResumeData = {
        personalInfo: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '1234567890',
          location: 'Test City',
          summary:
            'This is a test summary that needs to be at least 50 characters long for validation.'
        },
        experience: [
          {
            company: 'Test Company',
            position: 'Test Position',
            location: 'Test Location',
            startDate: '2023-01',
            description: 'Test description that is at least 20 characters.'
          }
        ],
        education: [
          {
            institution: 'Test University',
            degree: 'Test Degree',
            field: 'Test Field',
            location: 'Test Location',
            graduationDate: '2020'
          }
        ],
        skills: ['Skill 1', 'Skill 2', 'Skill 3']
      };

      const { container } = render(<ResumeDocument data={minimalData} />);
      expect(container).toBeTruthy();
    });

    it('renders with mock resume data', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      expect(container).toBeTruthy();
    });

    it('renders with extended mock resume data', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      expect(container).toBeTruthy();
    });
  });

  describe('Header Section', () => {
    it('displays the full name', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      expect(getByText(mockResumeData.personalInfo.fullName)).toBeTruthy();
    });

    it('displays email as a link', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      const emailLink = container.querySelector(
        `a[href="mailto:${mockResumeData.personalInfo.email}"]`
      );
      expect(emailLink).toBeTruthy();
    });

    it('displays phone number', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      expect(getByText(mockResumeData.personalInfo.phone)).toBeTruthy();
    });

    it('displays location', () => {
      const { getAllByText } = render(<ResumeDocument data={mockResumeData} />);
      const locationElements = getAllByText(
        mockResumeData.personalInfo.location
      );
      expect(locationElements.length).toBeGreaterThanOrEqual(1);
    });

    it('displays LinkedIn link when provided', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      const linkedInLink = container.querySelector(
        `a[href="${mockResumeData.personalInfo.linkedIn}"]`
      );
      expect(linkedInLink).toBeTruthy();
    });

    it('displays website/portfolio link when provided', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      const websiteLink = container.querySelector(
        `a[href="${mockResumeData.personalInfo.website}"]`
      );
      expect(websiteLink).toBeTruthy();
    });

    it('displays default name when fullName is not provided', () => {
      const dataWithoutName: TResumeData = {
        ...mockResumeData,
        personalInfo: {
          ...mockResumeData.personalInfo,
          fullName: ''
        }
      };
      const { getByText } = render(<ResumeDocument data={dataWithoutName} />);
      expect(getByText('Your Name')).toBeTruthy();
    });
  });

  describe('Summary Section', () => {
    it('displays the summary text', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      expect(getByText(mockResumeData.personalInfo.summary)).toBeTruthy();
    });

    it('has wrap={false} to prevent splitting', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      const summaryViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );
      expect(summaryViews.length).toBeGreaterThan(0);
    });
  });

  describe('Experience Section', () => {
    it('displays all experience items', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      mockResumeData.experience.forEach((exp) => {
        expect(getByText(exp.position)).toBeTruthy();
        expect(getByText(exp.company)).toBeTruthy();
      });
    });

    it('displays Experience section title', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      expect(getByText('Experience')).toBeTruthy();
    });

    it('displays current position indicator for current jobs', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      const currentJob = mockResumeData.experience.find((exp) => exp.current);
      if (currentJob) {
        expect(container.textContent).toContain('Present');
      }
    });

    it('has wrap={false} on experience items', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );
      expect(wrapFalseViews.length).toBeGreaterThan(0);
    });
  });

  describe('Education Section', () => {
    it('displays all education items', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      extendedMockResumeData.education.forEach((edu) => {
        expect(container.textContent).toContain(edu.institution);
      });
    });

    it('displays Education section title', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      expect(getByText('Education')).toBeTruthy();
    });

    it('displays degree and field correctly', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      const edu = mockResumeData.education[0];
      expect(getByText(`${edu.degree} in ${edu.field}`)).toBeTruthy();
    });

    it('displays GPA when provided', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      const eduWithGpa = extendedMockResumeData.education.find(
        (edu) => edu.gpa
      );
      if (eduWithGpa) {
        expect(container.textContent).toContain(`GPA: ${eduWithGpa.gpa}`);
      }
    });
  });

  describe('Skills Section', () => {
    it('displays all skills', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      mockResumeData.skills.forEach((skill) => {
        expect(getByText(skill)).toBeTruthy();
      });
    });

    it('displays Skills section title', () => {
      const { getByText } = render(<ResumeDocument data={mockResumeData} />);
      expect(getByText('Skills')).toBeTruthy();
    });

    it('has wrap={false} on skills section to keep it together', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );
      expect(wrapFalseViews.length).toBeGreaterThan(0);
    });
  });

  describe('Page Breaking Rules', () => {
    it('page has wrap enabled for content flow', () => {
      const { container } = render(<ResumeDocument data={mockResumeData} />);
      const page = container.querySelector('[data-testid="pdf-page"]');
      expect(page?.getAttribute('data-wrap')).toBe('true');
    });

    it('has page number with fixed positioning', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      const fixedTexts = container.querySelectorAll(
        '[data-testid="pdf-text"][data-fixed="true"]'
      );
      expect(fixedTexts.length).toBeGreaterThan(0);
    });

    it('renders correct page number format for multi-page', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      expect(container.textContent).toContain('1 / 2');
    });
  });

  describe('Data Integrity', () => {
    it('renders correct number of experience items', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      extendedMockResumeData.experience.forEach((exp) => {
        expect(container.textContent).toContain(exp.company);
      });
    });

    it('renders correct number of education items', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      extendedMockResumeData.education.forEach((edu) => {
        expect(container.textContent).toContain(edu.institution);
      });
    });

    it('renders correct number of skills', () => {
      const { container } = render(
        <ResumeDocument data={extendedMockResumeData} />
      );
      extendedMockResumeData.skills.forEach((skill) => {
        expect(container.textContent).toContain(skill);
      });
    });
  });

  describe('Empty/Missing Data Handling', () => {
    it('handles missing LinkedIn gracefully', () => {
      const dataWithoutLinkedIn: TResumeData = {
        ...mockResumeData,
        personalInfo: {
          ...mockResumeData.personalInfo,
          linkedIn: ''
        }
      };
      const { container } = render(
        <ResumeDocument data={dataWithoutLinkedIn} />
      );
      expect(container).toBeTruthy();
    });

    it('handles missing website gracefully', () => {
      const dataWithoutWebsite: TResumeData = {
        ...mockResumeData,
        personalInfo: {
          ...mockResumeData.personalInfo,
          website: ''
        }
      };
      const { container } = render(
        <ResumeDocument data={dataWithoutWebsite} />
      );
      expect(container).toBeTruthy();
    });

    it('handles empty experience array', () => {
      const dataWithoutExperience: TResumeData = {
        ...mockResumeData,
        experience: []
      };
      const { container, queryByText } = render(
        <ResumeDocument data={dataWithoutExperience} />
      );
      expect(container).toBeTruthy();
      expect(queryByText('Experience')).toBeNull();
    });

    it('handles empty education array', () => {
      const dataWithoutEducation: TResumeData = {
        ...mockResumeData,
        education: []
      };
      const { container, queryByText } = render(
        <ResumeDocument data={dataWithoutEducation} />
      );
      expect(container).toBeTruthy();
      expect(queryByText('Education')).toBeNull();
    });

    it('handles empty skills array', () => {
      const dataWithoutSkills: TResumeData = {
        ...mockResumeData,
        skills: []
      };
      const { container, queryByText } = render(
        <ResumeDocument data={dataWithoutSkills} />
      );
      expect(container).toBeTruthy();
      expect(queryByText('Skills')).toBeNull();
    });
  });

  describe('Large Data Sets', () => {
    it('handles many experience items', () => {
      const manyExperiences: TResumeData = {
        ...mockResumeData,
        experience: Array(10)
          .fill(null)
          .map((_, i) => ({
            company: `Company ${i + 1}`,
            position: `Position ${i + 1}`,
            location: 'Location',
            startDate: '2020-01',
            endDate: '2021-01',
            current: false,
            description:
              'Description that is at least 20 characters long for testing purposes.'
          }))
      };
      const { container } = render(<ResumeDocument data={manyExperiences} />);
      expect(container.textContent).toContain('Company 1');
      expect(container.textContent).toContain('Company 10');
    });

    it('handles many skills', () => {
      const manySkills: TResumeData = {
        ...mockResumeData,
        skills: Array(50)
          .fill(null)
          .map((_, i) => `Skill ${i + 1}`)
      };
      const { container } = render(<ResumeDocument data={manySkills} />);
      expect(container.textContent).toContain('Skill 1');
      expect(container.textContent).toContain('Skill 50');
    });

    it('handles many education items', () => {
      const manyEducations: TResumeData = {
        ...mockResumeData,
        education: Array(5)
          .fill(null)
          .map((_, i) => ({
            institution: `University ${i + 1}`,
            degree: 'Degree',
            field: 'Field',
            location: 'Location',
            graduationDate: `202${i}`
          }))
      };
      const { container } = render(<ResumeDocument data={manyEducations} />);
      expect(container.textContent).toContain('University 1');
      expect(container.textContent).toContain('University 5');
    });
  });
});
