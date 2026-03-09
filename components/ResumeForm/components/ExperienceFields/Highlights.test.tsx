import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { describe, expect, it } from 'vitest';
import { WarningDialogProvider } from '@/providers/WarningDialogProvider';
import type { TResumeForm } from '@/types/schema';
import { experienceDefaultValues, personalInfoDefaultValues } from '@/types/schema';
import Highlights from './Highlights';

/** Test harness providing the form and warning dialog contexts. */
function TestHarness() {
  const methods = useForm<TResumeForm>({
    defaultValues: {
      personalInfo: personalInfoDefaultValues,
      experience: [
        {
          ...experienceDefaultValues,
          highlights: [{ value: 'First highlight' }, { value: 'Second highlight' }]
        }
      ],
      education: [],
      skills: []
    }
  });

  return (
    <WarningDialogProvider>
      <FormProvider {...methods}>
        <Highlights index={0} />
      </FormProvider>
    </WarningDialogProvider>
  );
}

describe('Highlights', () => {
  it('moves a highlight down when the reorder control is clicked', async () => {
    const user = userEvent.setup();

    render(<TestHarness />);

    const reorderGroups = screen.getAllByRole('group', { name: 'Reorder highlight' });
    await user.click(
      within(reorderGroups[0]).getByRole('button', { name: 'Move highlight down' })
    );

    const textareas = screen.getAllByRole('textbox');
    expect(textareas[0]).toHaveValue('Second highlight');
    expect(textareas[1]).toHaveValue('First highlight');
  });
});
