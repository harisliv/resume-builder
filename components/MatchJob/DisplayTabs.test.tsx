import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DisplayTabs } from './DisplayTabs';
import type { TResumeForm } from '@/types/schema';
import type { ComponentProps } from 'react';
import type { TMatchJobTab } from './matchJob.utils';

vi.mock('@/components/ui/checkbox', () => ({
  Checkbox: ({
    checked,
    onCheckedChange,
    disabled
  }: {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <input
      type="checkbox"
      checked={Boolean(checked)}
      disabled={disabled}
      onChange={() => onCheckedChange?.(!checked)}
    />
  )
}));

/** Builds stable resume data for tab rendering tests. */
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
        id: 'exp_1',
        company: 'Acme',
        position: 'Frontend Engineer',
        projectName: '',
        location: '',
        startDate: '2021',
        endDate: '2024',
        current: false,
        description: 'Built internal dashboards.',
        highlights: [{ id: 'hl_1', value: 'Built React dashboards for ops teams' }]
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

/** Renders tabs with stable defaults. */
function renderDisplayTabs({
  activeTab = 'Personal Info',
  enhancing = false,
  disabled = false,
  selectedTargets = [],
  onActiveTabChange = () => {}
}: {
  activeTab?: TMatchJobTab;
  enhancing?: boolean;
  disabled?: boolean;
  selectedTargets?: ComponentProps<typeof DisplayTabs>['selectedTargets'];
  onActiveTabChange?: (tab: TMatchJobTab) => void;
} = {}) {
  return render(
    <DisplayTabs
      resume={makeResumeForm()}
      selectedTargets={selectedTargets}
      onToggleTarget={vi.fn()}
      activeTab={activeTab}
      onActiveTabChange={onActiveTabChange}
      disabled={disabled}
      enhancing={enhancing}
    />
  );
}

describe('DisplayTabs', () => {
  it('defaults to Personal Info', () => {
    renderDisplayTabs();

    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(
      screen.getByText('Frontend engineer focused on internal tools.')
    ).toBeInTheDocument();
  });

  it('switches between Personal Info, Skills, and Experience', async () => {
    const onActiveTabChange = vi.fn<(tab: TMatchJobTab) => void>();
    renderDisplayTabs({ onActiveTabChange });

    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Skills' }));
    expect(onActiveTabChange).toHaveBeenCalledWith('Skills');

    await user.click(screen.getByRole('tab', { name: 'Experience' }));
    expect(onActiveTabChange).toHaveBeenCalledWith('Experience');
  });

  it('passes disabled state through to selection controls', () => {
    const view = renderDisplayTabs({ activeTab: 'Skills', disabled: true });
    expect(screen.getByRole('checkbox')).toBeDisabled();

    view.rerender(
      <DisplayTabs
        resume={makeResumeForm()}
        selectedTargets={[]}
        onToggleTarget={vi.fn()}
        activeTab="Experience"
        onActiveTabChange={vi.fn()}
        disabled
        enhancing={false}
      />
    );
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('locks tab switching and shows loading only on selected targets while enhancing', async () => {
    const onActiveTabChange = vi.fn<(tab: TMatchJobTab) => void>();
    renderDisplayTabs({
      activeTab: 'Experience',
      selectedTargets: [
        {
          type: 'highlight',
          experienceId: 'exp_1',
          highlightId: 'hl_1',
          currentText: 'Built React dashboards for ops teams'
        }
      ],
      enhancing: true,
      onActiveTabChange
    });

    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: 'Experience' }));

    expect(screen.getByRole('tab', { name: 'Skills' })).toBeDisabled();
    expect(screen.getByRole('tab', { name: 'Experience' })).toBeDisabled();
    expect(onActiveTabChange).not.toHaveBeenCalled();
    expect(
      screen.getByLabelText('Built React dashboards for ops teams loading')
    ).toBeInTheDocument();
    expect(
      screen.queryByText('Built React dashboards for ops teams')
    ).not.toBeInTheDocument();
  });
});
