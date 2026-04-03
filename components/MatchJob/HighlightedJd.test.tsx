import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HighlightedJd } from './HighlightedJd';
import type { TExtractedKeyword } from '@/types/aiKeywords';

const KEYWORDS: TExtractedKeyword[] = [
  {
    keyword: 'React Testing Library',
    canonicalName: 'react-testing-library',
    context: 'Testing requirement.'
  },
  {
    keyword: 'React',
    canonicalName: 'react',
    context: 'Frontend requirement.'
  }
];

describe('HighlightedJd', () => {
  it('renders keyword matches and preserves surrounding text', () => {
    const { container } = render(
      <HighlightedJd
        text="Need React and strong collaboration."
        keywords={[KEYWORDS[1]]}
        selectedKeyword={null}
        onSelectKeyword={vi.fn()}
        processedKeywords={new Set()}
      />
    );

    expect(container.textContent).toContain('Need React and strong collaboration.');
    expect(
      screen.getByRole('button', { name: /React/i })
    ).toBeInTheDocument();
  });

  it('toggles the selected keyword off when clicked again', async () => {
    const onSelectKeyword = vi.fn();

    render(
      <HighlightedJd
        text="Need React experience."
        keywords={[KEYWORDS[1]]}
        selectedKeyword="react"
        onSelectKeyword={onSelectKeyword}
        processedKeywords={new Set()}
      />
    );

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /React/i }));

    expect(onSelectKeyword).toHaveBeenCalledWith(null);
  });

  it('renders processed keywords as completed non-interactive text', () => {
    render(
      <HighlightedJd
        text="Need React experience."
        keywords={[KEYWORDS[1]]}
        selectedKeyword={null}
        onSelectKeyword={vi.fn()}
        processedKeywords={new Set(['react'])}
      />
    );

    expect(
      screen.queryByRole('button', { name: /React/i })
    ).not.toBeInTheDocument();
    expect(screen.getByText(/React/i)).toBeInTheDocument();
  });

  it('prefers longer overlapping keyword matches', () => {
    render(
      <HighlightedJd
        text="Need React Testing Library experience."
        keywords={KEYWORDS}
        selectedKeyword={null}
        onSelectKeyword={vi.fn()}
        processedKeywords={new Set()}
      />
    );

    expect(
      screen.getByRole('button', { name: /React Testing Library/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});
