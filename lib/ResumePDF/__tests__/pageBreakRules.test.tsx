import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import ResumeDocument from '../ResumeDocument';
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
    minPresenceAhead
  }: {
    children?: React.ReactNode;
    wrap?: boolean;
    style?: object | object[];
    minPresenceAhead?: number;
  }) => (
    <div
      data-testid="pdf-view"
      data-wrap={wrap}
      data-style={JSON.stringify(style)}
      data-min-presence-ahead={minPresenceAhead}
    >
      {children}
    </div>
  ),
  Text: ({
    children,
    render,
    fixed
  }: {
    children?: React.ReactNode;
    render?: (props: { pageNumber: number; totalPages: number }) => string;
    fixed?: boolean;
  }) => (
    <span data-testid="pdf-text" data-fixed={fixed}>
      {render ? render({ pageNumber: 1, totalPages: 2 }) : children}
    </span>
  ),
  Link: ({ children, src }: { children: React.ReactNode; src: string }) => (
    <a data-testid="pdf-link" href={src}>
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
    <linearGradient data-testid="pdf-linear-gradient">
      {children}
    </linearGradient>
  ),
  Stop: () => <stop data-testid="pdf-stop" />,
  StyleSheet: {
    create: (styles: Record<string, object>) => styles
  }
}));

const createTestData = (
  experienceCount: number,
  educationCount: number
): TResumeData => ({
  title: 'Test Resume',
  documentStyle: { palette: 'ocean', font: 'inter', style: 'modern' },
  personalInfo: {
    fullName: 'Test User',
    email: 'test@example.com',
    phone: '1234567890',
    location: 'Test City',
    summary:
      'This is a test summary that needs to be at least 50 characters long for validation purposes.'
  },
  experience: Array(experienceCount)
    .fill(null)
    .map((_, i) => ({
      company: `Company ${i + 1}`,
      position: `Position ${i + 1}`,
      location: 'Location',
      startDate: '2020-01',
      endDate: '2021-01',
      current: false,
      description: 'Test description that is at least 20 characters long.'
    })),
  education: Array(educationCount)
    .fill(null)
    .map((_, i) => ({
      institution: `University ${i + 1}`,
      degree: 'Bachelor',
      field: 'Computer Science',
      location: 'Location',
      graduationDate: '2020'
    })),
  skills: ['Skill 1', 'Skill 2', 'Skill 3']
});

describe('Page Break Rules', () => {
  describe('Experience Section', () => {
    it('Experience header uses wrap={false} to prevent orphaned headers', () => {
      const data = createTestData(3, 1);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );
      const experienceHeader = Array.from(wrapFalseViews).find((view) =>
        view.textContent?.includes('Experience')
      );

      expect(experienceHeader).toBeTruthy();
    });

    it('all experience items are wrapped with wrap={false}', () => {
      const data = createTestData(3, 1);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );

      for (let i = 1; i <= 3; i++) {
        const itemWrapper = Array.from(wrapFalseViews).find((view) =>
          view.textContent?.includes(`Company ${i}`)
        );
        expect(itemWrapper).toBeTruthy();
      }
    });
  });

  describe('Education Section', () => {
    it('Education header uses wrap={false} to prevent orphaned headers', () => {
      const data = createTestData(1, 3);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );
      const educationHeader = Array.from(wrapFalseViews).find((view) =>
        view.textContent?.includes('Education')
      );

      expect(educationHeader).toBeTruthy();
    });

    it('all education items are wrapped with wrap={false}', () => {
      const data = createTestData(1, 3);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );

      for (let i = 1; i <= 3; i++) {
        const itemWrapper = Array.from(wrapFalseViews).find((view) =>
          view.textContent?.includes(`University ${i}`)
        );
        expect(itemWrapper).toBeTruthy();
      }
    });
  });

  describe('Summary Section', () => {
    it('wraps summary section with wrap={false}', () => {
      const data = createTestData(1, 1);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );

      const summaryWrapper = Array.from(wrapFalseViews).find((view) =>
        view.textContent?.includes('at least 50 characters')
      );
      expect(summaryWrapper).toBeTruthy();
    });
  });

  describe('Skills Section', () => {
    it('Skills header uses wrap={false}', () => {
      const data = createTestData(1, 1);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );

      const skillsHeader = Array.from(wrapFalseViews).find((view) =>
        view.textContent?.includes('Skills')
      );
      expect(skillsHeader).toBeTruthy();
    });
  });

  describe('Page-level behavior', () => {
    it('page allows content to flow across pages', () => {
      const data = createTestData(1, 1);
      const { container } = render(<ResumeDocument data={data} />);

      const page = container.querySelector('[data-testid="pdf-page"]');
      expect(page).toBeTruthy();
    });
  });

  describe('Individual items are atomic', () => {
    it('each experience card cannot be split across pages', () => {
      const data = createTestData(6, 1);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );

      for (let i = 1; i <= 6; i++) {
        const itemWrapper = Array.from(wrapFalseViews).find((view) =>
          view.textContent?.includes(`Company ${i}`)
        );
        expect(itemWrapper).toBeTruthy();
      }
    });

    it('each education card cannot be split across pages', () => {
      const data = createTestData(1, 5);
      const { container } = render(<ResumeDocument data={data} />);

      const wrapFalseViews = container.querySelectorAll(
        '[data-testid="pdf-view"][data-wrap="false"]'
      );

      for (let i = 1; i <= 5; i++) {
        const itemWrapper = Array.from(wrapFalseViews).find((view) =>
          view.textContent?.includes(`University ${i}`)
        );
        expect(itemWrapper).toBeTruthy();
      }
    });
  });
});
