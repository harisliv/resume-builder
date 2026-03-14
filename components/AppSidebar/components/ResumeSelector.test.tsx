import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  setValue: vi.fn(),
  useGetUserResumeTitles: vi.fn(),
  usePrivileges: vi.fn(),
  useRenameResume: vi.fn(),
  useSetDefaultResume: vi.fn(),
  confirm: vi.fn()
}));

vi.mock('react-hook-form', () => ({
  useFormContext: () => ({ control: {}, setValue: mocks.setValue }),
  useWatch: ({ name }: { name: string }) =>
    name === 'id' ? '' : 'Current Resume'
}));

vi.mock('@/hooks/useGetUserResumeTitles', () => ({
  useGetUserResumeTitles: mocks.useGetUserResumeTitles
}));

vi.mock('@/hooks/usePrivileges', () => ({
  default: mocks.usePrivileges
}));

vi.mock('@/hooks/useRenameResume', () => ({
  useRenameResume: mocks.useRenameResume
}));

vi.mock('@/hooks/useSetDefaultResume', () => ({
  useSetDefaultResume: mocks.useSetDefaultResume
}));

vi.mock('@/providers/WarningDialogProvider', () => ({
  useWarningDialog: () => mocks.confirm
}));

vi.mock('./ResumeOptionActions', () => ({
  ResumeOptionActions: () => <div>Option actions</div>
}));

vi.mock('./NavSelector', () => ({
  NavSelector: ({
    open,
    dropdownHeader
  }: {
    open?: boolean;
    dropdownHeader?: ReactNode;
  }) => (
    <div data-open={String(open)} data-testid="nav-selector">
      {open ? dropdownHeader : null}
    </div>
  )
}));

import { ResumeSelector } from './ResumeSelector';

describe('ResumeSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.useGetUserResumeTitles.mockReturnValue({
      data: [],
      isLoading: false
    });
    mocks.usePrivileges.mockReturnValue({
      isMember: false,
      resumeLimit: Infinity
    });
    mocks.useRenameResume.mockReturnValue({ mutate: vi.fn() });
    mocks.useSetDefaultResume.mockReturnValue({ mutate: vi.fn() });
    mocks.confirm.mockResolvedValue(true);
  });

  it('opens for create mode and closes again after cancel', () => {
    const onCreatingChange = vi.fn();
    const props = {
      onResumeSelect: vi.fn(),
      onCreateNew: vi.fn(),
      onDelete: vi.fn(),
      onCreatingChange
    };
    const { rerender } = render(
      <ResumeSelector {...props} isCreating={false} />
    );

    expect(screen.getByTestId('nav-selector')).toHaveAttribute(
      'data-open',
      'false'
    );
    expect(
      screen.queryByPlaceholderText('Resume title...')
    ).not.toBeInTheDocument();

    rerender(<ResumeSelector {...props} isCreating />);

    const input = screen.getByPlaceholderText('Resume title...');
    expect(screen.getByTestId('nav-selector')).toHaveAttribute(
      'data-open',
      'true'
    );

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(onCreatingChange).toHaveBeenCalledWith(false);

    rerender(<ResumeSelector {...props} isCreating={false} />);

    expect(screen.getByTestId('nav-selector')).toHaveAttribute(
      'data-open',
      'false'
    );
    expect(
      screen.queryByPlaceholderText('Resume title...')
    ).not.toBeInTheDocument();
  });
});
