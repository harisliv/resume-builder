import { diffWords } from 'diff';
import { cn } from '@/lib/utils';

const HIGHLIGHT_CLASS = 'rounded-sm bg-emerald-500/15 px-0.5';

type TDiffHighlightProps = {
  current: string | undefined;
  suggested: string | undefined;
  className?: string;
};

/**
 * Renders suggested text with only the diff parts (added/changed) highlighted.
 * Uses `diff` package for word-level diff.
 */
export function DiffHighlight({
  current,
  suggested,
  className
}: TDiffHighlightProps) {
  if (!suggested) return null;

  const currentStr = current ?? '';
  const parts = diffWords(currentStr, suggested);

  return (
    <p
      className={cn(
        'whitespace-pre-wrap text-xs leading-relaxed',
        className
      )}
    >
      {parts.map((part, i) =>
        part.added ? (
          <mark key={i} className={HIGHLIGHT_CLASS}>
            {part.value}
          </mark>
        ) : (
          part.value
        )
      )}
    </p>
  );
}
