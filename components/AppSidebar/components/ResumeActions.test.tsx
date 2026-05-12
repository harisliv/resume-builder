import type { ComponentProps, PropsWithChildren } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  confirm: vi.fn(),
  redirectToLogin: vi.fn(),
  refreshAuth: vi.fn(),
  upgradeToBasic: vi.fn(),
  usePrivileges: vi.fn(),
  useGetUserResumeTitles: vi.fn(),
  useQuery: vi.fn()
}));

vi.mock('@workos-inc/authkit-nextjs/components', () => ({
  useAuth: () => ({ refreshAuth: mocks.refreshAuth })
}));

vi.mock('convex/react', () => ({
  useQuery: mocks.useQuery
}));

vi.mock('@/convex/_generated/api', () => ({
  api: {
    aiAttempts: {
      getRemainingAttempts: 'getRemainingAttempts'
    }
  }
}));

vi.mock('@/app/actions/upgradeRole', () => ({
  upgradeToBasic: mocks.upgradeToBasic
}));

vi.mock('@/lib/redirects', () => ({
  redirectToLogin: mocks.redirectToLogin
}));

vi.mock('@/providers/WarningDialogProvider', () => ({
  useWarningDialog: () => mocks.confirm
}));

vi.mock('@/hooks/usePrivileges', () => ({
  default: mocks.usePrivileges
}));

vi.mock('@/hooks/useGetUserResumeTitles', () => ({
  useGetUserResumeTitles: mocks.useGetUserResumeTitles
}));

vi.mock('@/ui/sidebar', () => ({
  SidebarMenu: ({
    children,
    className
  }: PropsWithChildren<{ className?: string }>) => (
    <div className={className}>{children}</div>
  ),
  SidebarMenuItem: ({ children }: PropsWithChildren) => <div>{children}</div>,
  useSidebar: () => ({ isCollapsed: false })
}));

import { ResumeActions } from './ResumeActions';

const handlers = {
  onCreateNew: vi.fn(),
  onImportPdf: vi.fn(),
  onImproveResume: vi.fn(),
  onMatchJob: vi.fn()
};

/** Renders the action list with default no-op callbacks. */
function renderActions(
  props: Partial<ComponentProps<typeof ResumeActions>> = {}
) {
  return render(<ResumeActions {...handlers} {...props} />);
}

describe('ResumeActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.confirm.mockResolvedValue(false);
    mocks.refreshAuth.mockResolvedValue(undefined);
    mocks.upgradeToBasic.mockResolvedValue({ success: true });
    mocks.usePrivileges.mockReturnValue({
      isLoggedIn: true,
      role: 'basic',
      isMember: false,
      isAdmin: false,
      resumeLimit: 20
    });
    mocks.useGetUserResumeTitles.mockReturnValue({
      data: [{ id: 'resume-1' }]
    });
    mocks.useQuery.mockImplementation((_query, args: { type: string }) =>
      args.type === 'pdf' ? { remaining: 2, max: 3 } : { remaining: 4, max: 5 }
    );
  });

  it('redirects to login from the logged-out modal instead of creating', async () => {
    mocks.confirm.mockResolvedValue(true);
    mocks.usePrivileges.mockReturnValue({
      isLoggedIn: false,
      role: undefined,
      isMember: true,
      isAdmin: false,
      resumeLimit: 1
    });
    mocks.useGetUserResumeTitles.mockReturnValue({ data: [] });

    renderActions();
    fireEvent.click(screen.getByRole('button', { name: /create new/i }));

    await waitFor(() =>
      expect(mocks.confirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Log in to continue',
          description: 'Please log in to use the platform.',
          confirmLabel: 'Sign in',
          hideCancel: false
        })
      )
    );
    await waitFor(() =>
      expect(mocks.redirectToLogin).toHaveBeenCalledTimes(1)
    );
    expect(handlers.onCreateNew).not.toHaveBeenCalled();
  });

  it('runs the allowed handler when no blocker applies', async () => {
    renderActions({ selectedResumeId: 'resume-1', isAiImproved: true });
    fireEvent.click(screen.getByRole('button', { name: /match job/i }));

    await waitFor(() => expect(handlers.onMatchJob).toHaveBeenCalledTimes(1));
    expect(mocks.confirm).not.toHaveBeenCalled();
  });

  it('shows upgrade success details after upgrading from a blocked action modal', async () => {
    mocks.confirm.mockResolvedValueOnce(true).mockResolvedValueOnce(true);
    mocks.usePrivileges.mockReturnValue({
      isLoggedIn: true,
      role: 'member',
      isMember: true,
      isAdmin: false,
      resumeLimit: 1
    });
    mocks.useGetUserResumeTitles.mockReturnValue({ data: [] });

    renderActions();
    fireEvent.click(screen.getByRole('button', { name: /import pdf/i }));

    await waitFor(() => expect(mocks.upgradeToBasic).toHaveBeenCalledTimes(1));
    expect(mocks.refreshAuth).toHaveBeenCalledTimes(1);
    expect(mocks.confirm).toHaveBeenLastCalledWith(
      expect.objectContaining({
        title: 'Plan upgraded',
        description:
          'You now have 20 resumes, 5 AI attempts per day, and 3 PDF imports per month.',
        confirmLabel: 'Got it',
        variant: 'success',
        hideCancel: true
      })
    );
    expect(handlers.onImportPdf).not.toHaveBeenCalled();
  });
});
