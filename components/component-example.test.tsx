import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentExample } from './component-example';

describe('ComponentExample', () => {
  it('renders without crashing', () => {
    render(<ComponentExample />);
  });

  it('renders CardExample with expected content', () => {
    render(<ComponentExample />);

    expect(
      screen.getByText('Observability Plus is replacing Monitoring')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Switch to the improved way to explore your data/)
    ).toBeInTheDocument();
    expect(screen.getByText('Show Dialog')).toBeInTheDocument();
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders FormExample with expected form fields', () => {
    render(<ComponentExample />);

    expect(screen.getByText('User Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Framework')).toBeInTheDocument();
    expect(screen.getByLabelText('Comments')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('opens alert dialog when Show Dialog button is clicked', async () => {
    const user = userEvent.setup();
    render(<ComponentExample />);

    const showDialogButton = screen.getByRole('button', {
      name: 'Show Dialog'
    });
    await user.click(showDialogButton);

    expect(screen.getByText('Allow accessory to connect?')).toBeInTheDocument();
    expect(
      screen.getByText(/Do you want to allow the USB accessory/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: "Don't allow" })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Allow' })).toBeInTheDocument();
  });

  it('allows user to type in form fields', async () => {
    const user = userEvent.setup();
    render(<ComponentExample />);

    const nameInput = screen.getByLabelText('Name');
    await user.type(nameInput, 'John Doe');
    expect(nameInput).toHaveValue('John Doe');

    const commentsTextarea = screen.getByLabelText('Comments');
    await user.type(commentsTextarea, 'Test comment');
    expect(commentsTextarea).toHaveValue('Test comment');
  });

  it('opens dropdown menu when more options button is clicked', async () => {
    const user = userEvent.setup();
    render(<ComponentExample />);

    const moreOptionsButton = screen.getByRole('button', {
      name: 'More options'
    });
    await user.click(moreOptionsButton);

    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('New File')).toBeInTheDocument();
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });
});
