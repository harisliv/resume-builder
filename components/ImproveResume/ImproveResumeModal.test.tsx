import type { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ImproveResumeModal } from './ImproveResumeModal';

const mocks = vi.hoisted(() => ({
  createThread: vi.fn(),
  sendUserMessage: vi.fn(),
  generateQuestions: vi.fn(),
  generateEdits: vi.fn(),
  applyEdits: vi.fn(),
  invalidateQueries: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
  confirm: vi.fn()
}));

vi.mock('@/convex/_generated/api', () => ({
  api: {
    aiImprove: {
      createThread: 'createThread',
      sendUserMessage: 'sendUserMessage',
      applyImproveEdits: 'applyImproveEdits'
    },
    aiImproveActions: {
      generateQuestions: 'generateQuestions',
      generateEdits: 'generateEdits'
    }
  }
}));

vi.mock('convex/react', () => ({
  useMutation: (reference: string) => {
    if (reference === 'createThread') return mocks.createThread;
    if (reference === 'sendUserMessage') return mocks.sendUserMessage;
    if (reference === 'applyImproveEdits') return mocks.applyEdits;
    throw new Error(`Unexpected mutation reference: ${reference}`);
  },
  useAction: (reference: string) => {
    if (reference === 'generateQuestions') return mocks.generateQuestions;
    if (reference === 'generateEdits') return mocks.generateEdits;
    throw new Error(`Unexpected action reference: ${reference}`);
  }
}));

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mocks.invalidateQueries
  })
}));

vi.mock('@/providers/WarningDialogProvider', () => ({
  useWarningDialog: () => mocks.confirm
}));

vi.mock('sonner', () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess
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
  DialogContent: ({
    children,
    showCloseButton: _showCloseButton,
    ...props
  }: {
    children: ReactNode;
    showCloseButton?: boolean;
    className?: string;
  }) => <div {...props}>{children}</div>
}));

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    className,
    'aria-label': ariaLabel
  }: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
    'aria-label'?: string;
  }) => (
    <input
      type="checkbox"
      aria-label={ariaLabel}
      className={className}
      checked={Boolean(checked)}
      onChange={() => onCheckedChange?.(!checked)}
    />
  )
}));

vi.mock('@/components/ui/diff-highlight', () => ({
  DiffHighlight: ({
    current,
    suggested
  }: {
    current: string;
    suggested: string;
  }) => (
    <div>
      <span>{current}</span>
      <span>{suggested}</span>
    </div>
  )
}));

const RESUME_ID = 'resume_123';
const THREAD_ID = 'thread_123';

const FIRST_EDIT = {
  type: 'updateHighlight' as const,
  experienceId: 'exp_1',
  highlightId: 'hl_1',
  oldValue: 'Built dashboards',
  newValue: 'Built dashboards that saved 10 hours weekly'
};

const SECOND_EDIT = {
  type: 'updateSummary' as const,
  oldValue: 'Frontend engineer',
  newValue: 'Frontend engineer focused on measurable product impact'
};

/** Moves the modal into edit review with two generated edits. */
async function generateReviewEdits() {
  const user = userEvent.setup();

  await user.click(screen.getByRole('button', { name: 'Start Resume Review' }));
  await screen.findByLabelText('What impact did this work have?');

  await user.type(
    screen.getByLabelText('What impact did this work have?'),
    'Saved 10 hours weekly'
  );
  await user.click(screen.getByRole('button', { name: 'Analyze Answers' }));

  await screen.findByText('Built dashboards that saved 10 hours weekly');

  return user;
}

describe('ImproveResumeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.confirm.mockResolvedValue(true);
    mocks.createThread.mockResolvedValue(THREAD_ID);
    mocks.sendUserMessage.mockResolvedValue(null);
    mocks.generateQuestions.mockResolvedValue({
      questions: [
        {
          question: 'What impact did this work have?',
          context: 'Built dashboards',
          targetType: 'highlight',
          experienceId: 'exp_1',
          highlightId: 'hl_1'
        }
      ]
    });
    mocks.generateEdits.mockResolvedValue({
      edits: [FIRST_EDIT, SECOND_EDIT]
    });
    mocks.applyEdits.mockResolvedValue(null);
  });

  it('starts review with no edits selected and applies only checked edits', async () => {
    render(
      <ImproveResumeModal
        open
        onOpenChange={vi.fn()}
        resumeId={RESUME_ID}
        onDone={vi.fn()}
      />
    );

    const user = await generateReviewEdits();

    expect(screen.getByText('0 of 2 changes selected')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Apply to Current' })
    ).toBeDisabled();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();
    expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();

    await user.click(screen.getAllByRole('checkbox')[0]);

    expect(screen.getByText('1 of 2 changes selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apply to Current' })).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'Apply to Current' }));

    await waitFor(() => {
      expect(mocks.applyEdits).toHaveBeenCalledWith({
        threadId: THREAD_ID,
        edits: JSON.stringify([FIRST_EDIT])
      });
    });
  });
});
