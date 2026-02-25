import { diffWordsWithSpace } from 'diff';
import { cn } from '@/lib/utils';

const ADDED_HIGHLIGHT_CLASS = 'rounded-sm bg-emerald-500/15 px-0.5 text-emerald-700';
const REMOVED_HIGHLIGHT_CLASS = 'rounded-sm bg-red-500/15 px-0.5 text-red-700';

type TDiffHighlightProps = {
  current: string | undefined;
  suggested: string | undefined;
  className?: string;
  view?: 'current' | 'suggested' | 'both';
};

/**
 * Renders inline word diff between current and suggested text.
 * "suggested" view highlights additions, "current" highlights removals.
 */
export function DiffHighlight({
  current,
  suggested,
  className,
  view = 'suggested'
}: TDiffHighlightProps) {
  if (!suggested) return null;

  const currentStr = current ?? '';
  const parts = diffWordsWithSpace(currentStr, suggested);

  return (
    <p
      className={cn(
        'whitespace-pre-wrap text-xs leading-relaxed',
        className
      )}
    >
      {parts.map((part, i) => {
        if (part.added) {
          if (view === 'current') return null;
          return (
            <mark key={i} className={ADDED_HIGHLIGHT_CLASS}>
              {part.value}
            </mark>
          );
        }

        if (part.removed) {
          if (view === 'suggested') return null;
          return (
            <mark key={i} className={REMOVED_HIGHLIGHT_CLASS}>
              {part.value}
            </mark>
          );
        }

        return part.value;
      })}
    </p>
  );
}
