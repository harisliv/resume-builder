import { useState, type ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchJobModal } from './MatchJobModal';
import type { TResumeForm } from '@/types/schema';

const mocks = vi.hoisted(() => ({
  extractAction: vi.fn(),
  placeAction: vi.fn(),
  applyMutation: vi.fn(),
  invalidateQueries: vi.fn(),
  toastSuccess: vi.fn(),
  toastError: vi.fn(),
  useGetResumeById: vi.fn()
}));

vi.mock('@/convex/_generated/api', () => ({
  api: {
    aiKeywords: {
      extractKeywords: 'extractKeywords',
      placeKeyword: 'placeKeyword'
    },
    aiImprove: {
      applyKeywordEdits: 'applyKeywordEdits'
    }
  }
}));

vi.mock('convex/react', () => ({
  useAction: (reference: string) => {
    if (reference === 'extractKeywords') return mocks.extractAction;
    if (reference === 'placeKeyword') return mocks.placeAction;
    throw new Error(`Unexpected action reference: ${reference}`);
  },
  useMutation: (reference: string) => {
    if (reference === 'applyKeywordEdits') return mocks.applyMutation;
    throw new Error(`Unexpected mutation reference: ${reference}`);
  }
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mocks.invalidateQueries
  })
}));

vi.mock('@/hooks/useGetResumeById', () => ({
  useGetResumeById: mocks.useGetResumeById
}));

vi.mock('sonner', () => ({
  toast: {
    success: mocks.toastSuccess,
    error: mocks.toastError
  }
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    open,
    children
  }: {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    children: ReactNode;
  }) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: ReactNode }) => <h2>{children}</h2>,
  DialogFooter: ({ children }: { children: ReactNode }) => <div>{children}</div>
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    className
  }: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
  }) => (
    <input
      type="checkbox"
      className={className}
      checked={Boolean(checked)}
      onChange={() => onCheckedChange?.(!checked)}
    />
  )
}));

vi.mock('@/components/AiSuggestions/utils/diffHighlight', () => ({
  DiffHighlight: ({
    current,
    suggested
  }: {
    current: string;
    suggested: string;
    view?: 'both';
  }) => (
    <div>
      <span>{current}</span>
      <span>{suggested}</span>
    </div>
  )
}));

const RESUME_ID = 'resume_123';
const EXPERIENCE_ID = 'exp_1';
const HIGHLIGHT_ID = 'hl_1';
const ORIGINAL_HIGHLIGHT = 'Built React dashboards for ops teams';
const FIRST_REWRITE = 'Built React dashboards for ops teams with CSS';
const FINAL_REWRITE = 'Built React dashboards for ops teams with CSS and testing';

/** Builds stable resume data for Match Job integration tests. */
function makeResumeForm(): TResumeForm {
  return {
    personalInfo: {
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '',
      location: '',
      linkedIn: '',
      website: '',
      summary: 'Frontend engineer focused on internal tools.'
    },
    experience: [
      {
        id: EXPERIENCE_ID,
        company: 'Acme',
        position: 'Frontend Engineer',
        projectName: '',
        location: '',
        startDate: '2021',
        endDate: '2024',
        current: false,
        description: 'Built internal dashboards.',
        highlights: [{ id: HIGHLIGHT_ID, value: ORIGINAL_HIGHLIGHT }]
      }
    ],
    education: [],
    skills: [
      {
        id: 'skill-cat-1',
        name: 'Frontend',
        values: [{ id: 'skill-1', value: 'React' }]
      }
    ],
    customSections: []
  };
}

/** Drives the modal from input into matching mode. */
async function analyzeJobDescription() {
  const user = userEvent.setup();

  await user.type(
    screen.getByPlaceholderText('Paste your job description here...'),
    'Need CSS and testing experience for frontend work.'
  );
  await user.click(screen.getByRole('button', { name: 'Analyze Job Description' }));

  await screen.findByText(
    'Optimizing your resume for the Frontend Developer role'
  );

  return user;
}

/** Parent harness to verify the modal unmounts and reopens fresh. */
function MatchJobModalHarness() {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Match Job</button>
      {open && (
        <MatchJobModal
          open={open}
          onOpenChange={setOpen}
          resumeId={RESUME_ID}
          onDone={vi.fn()}
        />
      )}
    </div>
  );
}

describe('MatchJobModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useGetResumeById.mockReturnValue({
      form: makeResumeForm(),
      isLoading: false
    });
  });

  it('keeps duplicate highlight rewrites separate in review and applies only the latest accepted rewrite', async () => {
    mocks.extractAction.mockResolvedValue({
      title: 'Frontend Developer',
      keywords: [
        {
          keyword: 'CSS',
          canonicalName: 'CSS',
          context: 'Need CSS experience.'
        },
        {
          keyword: 'testing',
          canonicalName: 'testing',
          context: 'Need testing experience.'
        }
      ]
    });
    mocks.placeAction
      .mockResolvedValueOnce({
        updatedHighlights: [
          {
            experienceId: EXPERIENCE_ID,
            highlightId: HIGHLIGHT_ID,
            oldText: ORIGINAL_HIGHLIGHT,
            newText: FIRST_REWRITE
          }
        ],
        addedSkills: []
      })
      .mockResolvedValueOnce({
        updatedHighlights: [
          {
            experienceId: EXPERIENCE_ID,
            highlightId: HIGHLIGHT_ID,
            oldText: FIRST_REWRITE,
            newText: FINAL_REWRITE
          }
        ],
        addedSkills: []
      });
    mocks.applyMutation.mockResolvedValue('resume_tailored');

    render(
      <MatchJobModal
        open
        onOpenChange={vi.fn()}
        resumeId={RESUME_ID}
        onDone={vi.fn()}
      />
    );

    const user = await analyzeJobDescription();

    await user.click(screen.getByRole('button', { name: 'Experience' }));

    await user.click(screen.getByRole('button', { name: 'CSS' }));
    await user.click(
      screen.getByRole('checkbox', { name: ORIGINAL_HIGHLIGHT })
    );
    await user.click(screen.getByRole('button', { name: 'Enhance' }));
    await user.click(await screen.findByRole('button', { name: 'Accept Changes' }));

    await user.click(screen.getByRole('button', { name: 'testing' }));
    await user.click(
      screen.getByRole('checkbox', { name: FIRST_REWRITE })
    );
    await user.click(screen.getByRole('button', { name: 'Enhance' }));
    await user.click(await screen.findByRole('button', { name: 'Accept Changes' }));

    expect(mocks.placeAction).toHaveBeenNthCalledWith(2, {
      resumeId: RESUME_ID,
      keyword: 'testing',
      targets: [
        {
          type: 'highlight',
          experienceId: EXPERIENCE_ID,
          highlightId: HIGHLIGHT_ID,
          currentText: FIRST_REWRITE
        }
      ]
    });

    await user.click(screen.getByRole('button', { name: 'Review Changes' }));

    expect(
      screen.getByText('Review Changes (2 of 2 accepted)')
    ).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: 'Apply Changes' }));

    await waitFor(() => {
      expect(mocks.applyMutation).toHaveBeenCalledWith({
        resumeId: RESUME_ID,
        title: 'Frontend Developer',
        highlightEdits: [
          {
            experienceId: EXPERIENCE_ID,
            highlightId: HIGHLIGHT_ID,
            newText: FINAL_REWRITE
          }
        ],
        skillAdditions: []
      });
    });
  });

  it('unmounts after apply and reopens with a fresh empty flow', async () => {
    mocks.extractAction.mockResolvedValue({
      title: 'Frontend Developer',
      keywords: [
        {
          keyword: 'CSS',
          canonicalName: 'CSS',
          context: 'Need CSS experience.'
        }
      ]
    });
    mocks.placeAction.mockResolvedValue({
      updatedHighlights: [
        {
          experienceId: EXPERIENCE_ID,
          highlightId: HIGHLIGHT_ID,
          oldText: ORIGINAL_HIGHLIGHT,
          newText: FIRST_REWRITE
        }
      ],
      addedSkills: []
    });
    mocks.applyMutation.mockResolvedValue('resume_tailored');

    render(<MatchJobModalHarness />);

    const user = await analyzeJobDescription();

    await user.click(screen.getByRole('button', { name: 'Experience' }));
    await user.click(screen.getByRole('button', { name: 'CSS' }));
    await user.click(
      screen.getByRole('checkbox', { name: ORIGINAL_HIGHLIGHT })
    );
    await user.click(screen.getByRole('button', { name: 'Enhance' }));
    await user.click(await screen.findByRole('button', { name: 'Accept Changes' }));
    await user.click(screen.getByRole('button', { name: 'Review Changes' }));
    await user.click(screen.getByRole('button', { name: 'Apply Changes' }));

    await waitFor(() => {
      expect(screen.queryByText('AI Matching Analysis')).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Open Match Job' }));

    expect(
      screen.getByPlaceholderText('Paste your job description here...')
    ).toHaveValue('');
    expect(
      screen.queryByText('Optimizing your resume for the Frontend Developer role')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Review Changes' })
    ).not.toBeInTheDocument();
  });
});
