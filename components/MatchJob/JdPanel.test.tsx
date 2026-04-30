import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JdPanel } from './JdPanel';

const keywords = [
  {
    keyword: 'CSS',
    canonicalName: 'CSS',
    context: 'Need CSS experience.'
  }
];

/** Renders the JD panel with stable defaults for behavior tests. */
function renderJdPanel(overrides?: Partial<Parameters<typeof JdPanel>[0]>) {
  return render(
    <JdPanel
      phase="matching"
      jobDescription="Need CSS experience."
      onJobDescriptionChange={() => {}}
      keywords={keywords}
      selectedKeyword={null}
      onSelectKeyword={() => {}}
      processedKeywords={new Set()}
      {...overrides}
    />
  );
}

describe('JdPanel', () => {
  it('keeps the job description visible during matching', () => {
    renderJdPanel();

    expect(screen.getByText('Job Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CSS' })).toBeInTheDocument();
  });
});
