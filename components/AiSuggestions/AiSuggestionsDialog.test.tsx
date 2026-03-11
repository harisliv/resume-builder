import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AiSuggestionsDialog } from './AiSuggestionsDialog';
import {
  experienceDefaultValues,
  personalInfoDefaultValues,
  type TResumeForm
} from '@/types/schema';

const mocks = vi.hoisted(() => ({
  useAction: vi.fn(),
  confirm: vi.fn(),
  toastError: vi.fn()
}));

vi.mock('convex/react', () => ({
  useAction: mocks.useAction
}));

vi.mock('sonner', () => ({
  toast: {
    error: mocks.toastError
  }
}));

vi.mock('@/hooks/usePrivileges', () => ({
  default: () => ({ isAdmin: false, isMember: false })
}));

vi.mock('@/providers/WarningDialogProvider', () => ({
  useWarningDialog: () => mocks.confirm
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
    open ? <div>{children}</div> : null,
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

vi.mock('./styles/ai-suggestions-dialog.styles', () => ({
  DialogContentWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitleRow: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  InputContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ResultsContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  ResultsScrollArea: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  )
}));

vi.mock('./AiSuggestionsView', () => ({
  AiSuggestionsView: () => <div>Suggestions Ready</div>
}));

vi.mock('./utils/JdKeywordHighlight', () => ({
  JdKeywordHighlight: ({ text }: { text: string }) => <div>{text}</div>
}));

/** Builds stable form data for dialog tests. */
function makeResumeForm(): TResumeForm {
  return {
    personalInfo: {
      ...personalInfoDefaultValues,
      summary: 'Current summary'
    },
    experience: [
      {
        ...experienceDefaultValues,
        company: 'Acme',
        position: 'Frontend Engineer',
        description: 'Built dashboard',
        highlights: [{ value: 'Built dashboard' }]
      }
    ],
    education: [],
    skills: [
      {
        name: 'Frontend',
        values: [{ value: 'React' }]
      }
    ]
  };
}

/** Renders the dialog in match-job mode. */
function renderMatchJobDialog(options?: {
  onApply?: (value: unknown) => void;
  onCreateNewVersion?: (value: unknown) => void;
}) {
  return render(
    <AiSuggestionsDialog
      open
      onOpenChange={vi.fn()}
      resumeId={'resume_123' as never}
      currentData={makeResumeForm()}
      isAiImproved
      onApply={(options?.onApply as never) ?? vi.fn()}
      onCreateNewVersion={(options?.onCreateNewVersion as never) ?? vi.fn()}
      onImproveApplied={vi.fn()}
    />
  );
}

describe('AiSuggestionsDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.confirm.mockResolvedValue(true);
  });

  it('generates and applies match-job suggestions', async () => {
    const user = userEvent.setup();
    const generateSuggestions = vi.fn().mockResolvedValue({
      modelId: 'mock-model',
      label: 'Mock Model',
      suggestions: {
        summary: 'Tailored summary',
        experience: [
          {
            description: 'Sharper description',
            highlights: ['Improved conversion by 20%.']
          }
        ],
        skills: [
          {
            name: 'Frontend',
            values: ['React', 'analytics']
          }
        ],
        jdKeywords: ['react']
      },
      jdKeywords: ['react']
    });
    mocks.useAction.mockReturnValue(generateSuggestions);
    const onApply = vi.fn();

    renderMatchJobDialog({ onApply });

    await user.type(
      screen.getByPlaceholderText('Paste the job description here...'),
      'React analytics role'
    );
    await user.click(
      screen.getByRole('button', { name: 'Generate Suggestions' })
    );

    expect(await screen.findByText('Suggestions Ready')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Apply to Current' }));

    await waitFor(() => {
      expect(generateSuggestions).toHaveBeenCalledWith({
        resumeId: 'resume_123',
        jobDescription: 'React analytics role'
      });
      expect(onApply).toHaveBeenCalledWith({
        title: undefined,
        summary: 'Tailored summary',
        experience: [
          {
            description: 'Sharper description',
            highlights: ['Improved conversion by 20%.']
          }
        ],
        skills: [
          {
            name: 'Frontend',
            values: ['React', 'analytics']
          }
        ]
      });
    });
  });

  it('creates a new version from generated match-job suggestions', async () => {
    const user = userEvent.setup();
    const generateSuggestions = vi.fn().mockResolvedValue({
      modelId: 'mock-model',
      label: 'Mock Model',
      suggestions: {
        summary: 'Tailored summary',
        experience: [
          {
            description: 'Sharper description',
            highlights: ['Improved conversion by 20%.']
          }
        ],
        skills: [
          {
            name: 'Frontend',
            values: ['React', 'analytics']
          }
        ],
        jdKeywords: ['react']
      },
      jdKeywords: ['react']
    });
    mocks.useAction.mockReturnValue(generateSuggestions);
    const onCreateNewVersion = vi.fn();

    renderMatchJobDialog({ onCreateNewVersion });

    await user.type(
      screen.getByPlaceholderText('Paste the job description here...'),
      'React analytics role'
    );
    await user.click(
      screen.getByRole('button', { name: 'Generate Suggestions' })
    );

    expect(await screen.findByText('Suggestions Ready')).toBeInTheDocument();
    await user.click(
      screen.getByRole('button', { name: 'Create New Version' })
    );

    await waitFor(() => {
      expect(onCreateNewVersion).toHaveBeenCalledWith({
        title: undefined,
        summary: 'Tailored summary',
        experience: [
          {
            description: 'Sharper description',
            highlights: ['Improved conversion by 20%.']
          }
        ],
        skills: [
          {
            name: 'Frontend',
            values: ['React', 'analytics']
          }
        ]
      });
    });
  });
});
