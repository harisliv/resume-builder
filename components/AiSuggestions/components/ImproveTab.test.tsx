import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { ImproveTab } from './ImproveTab';
import {
  experienceDefaultValues,
  personalInfoDefaultValues,
  type TResumeForm
} from '@/types/schema';

const mocks = vi.hoisted(() => ({
  useAction: vi.fn(),
  useMutation: vi.fn(),
  toastError: vi.fn(),
  toastSuccess: vi.fn()
}));

vi.mock('convex/react', () => ({
  useAction: mocks.useAction,
  useMutation: mocks.useMutation
}));

vi.mock('sonner', () => ({
  toast: {
    error: mocks.toastError,
    success: mocks.toastSuccess
  }
}));

vi.mock('@/hooks/usePrivileges', () => ({
  default: () => ({ isAdmin: false, isMember: false })
}));

vi.mock('../AiSuggestionsView', () => ({
  AiSuggestionsView: () => <div>Suggestions Ready</div>
}));

/** Builds stable form data for AI workflow tests. */
function makeResumeForm(): TResumeForm {
  return {
    personalInfo: {
      ...personalInfoDefaultValues,
      summary: 'Frontend engineer building internal tools.'
    },
    experience: [
      {
        ...experienceDefaultValues,
        company: 'Acme',
        position: 'Frontend Engineer',
        description: 'Built internal dashboards.',
        highlights: [{ id: 'h1', value: 'Built React dashboards for ops teams' }]
      }
    ],
    education: [],
    skills: [
      {
        id: 'sk1',
        name: 'Frontend',
        values: [{ id: 'sv1', value: 'React' }, { id: 'sv2', value: 'TypeScript' }]
      }
    ]
  };
}

describe('ImproveTab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('runs the full improve flow and creates an AI resume', async () => {
    const user = userEvent.setup();
    const createThread = vi.fn().mockResolvedValue('thread_123');
    const sendUserMessage = vi.fn().mockResolvedValue('msg_123');
    const applyImprovements = vi.fn().mockResolvedValue('resume_456');
    const cleanupThreadForTesting = vi.fn().mockResolvedValue(null);
    let mutationCallCount = 0;
    const generateTurn = vi
      .fn()
      .mockResolvedValueOnce({
        content: 'Mock questions',
        structuredPayload: {
          questions: [
            {
              question: 'What metric improved?',
              context: 'Built React dashboards for ops teams'
            },
            {
              question: 'Which stakeholders used it?',
              context: 'Frontend Engineer'
            }
          ],
          isReadyToApply: false
        },
        cost: 0
      })
      .mockResolvedValueOnce({
        content: 'Mock improvements generated',
        structuredPayload: {
          resumePatch: JSON.stringify({
            summary: 'Improved summary with measurable impact.',
            experience: [
              {
                description: 'Improved description.',
                highlights: [{ id: 'h1', value: 'Increased conversion by 20%.' }]
              }
            ],
            skills: [
              {
                id: 'sk1',
                name: 'Frontend',
                values: [{ id: 'sv1', value: 'React' }, { id: 'sv2', value: 'TypeScript' }, { id: 'new1', value: 'analytics' }]
              }
            ]
          }),
          isReadyToApply: true
        },
        cost: 0
      });

    mocks.useMutation.mockImplementation(() => {
      const handlers = [
        createThread,
        sendUserMessage,
        applyImprovements,
        cleanupThreadForTesting
      ];
      const handler = handlers[mutationCallCount % handlers.length];
      mutationCallCount += 1;
      return handler;
    });
    mocks.useAction.mockReturnValue(generateTurn);

    const onApplyImprovements = vi.fn();

    render(
      <ImproveTab
        resumeId={'resume_123' as never}
        currentData={makeResumeForm()}
        onApplyImprovements={onApplyImprovements}
      />
    );

    await user.click(
      screen.getByRole('button', { name: 'Start Resume Review' })
    );

    expect(
      await screen.findByText('What metric improved?')
    ).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText('Your answer...'),
      'Conversion improved by 20%'
    );
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Which stakeholders used it?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Leave as is' }));

    expect(
      screen.getByText(
        'All 2 questions answered. Ready to generate improvements?'
      )
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Get Improvements' }));

    expect(await screen.findByText('Suggestions Ready')).toBeInTheDocument();
    await user.type(
      screen.getByPlaceholderText('New resume title...'),
      'Improved Resume'
    );
    await user.click(screen.getByRole('button', { name: 'Create AI Resume' }));

    await waitFor(() => {
      expect(createThread).toHaveBeenCalledWith({ resumeId: 'resume_123' });
      expect(sendUserMessage).toHaveBeenCalledWith({
        threadId: 'thread_123',
        content: expect.stringContaining('Conversion improved by 20%')
      });
      expect(applyImprovements).toHaveBeenCalledWith({
        threadId: 'thread_123',
        resumePatch: expect.any(String),
        title: 'Improved Resume'
      });
      expect(onApplyImprovements).toHaveBeenCalledWith('resume_456');
    });
  });
});
