'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import type { TExtractedKeyword } from '@/types/aiKeywords';

type TKeywordSelectionViewProps = {
  keywords: TExtractedKeyword[];
  selected: Set<string>;
  onToggle: (keyword: string) => void;
  onContinue: () => void;
};

/** Renders a single keyword chip with checkbox. */
function KeywordChip({
  kw,
  checked,
  onToggle
}: {
  kw: TExtractedKeyword;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className="flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer hover:bg-muted/50 transition-colors"
      title={kw.context}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span className="text-sm font-medium">{kw.canonicalName}</span>
    </label>
  );
}

/** Keyword selection view — shows extracted keywords as flat list. */
export function KeywordSelectionView({
  keywords,
  selected,
  onToggle,
  onContinue
}: TKeywordSelectionViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {keywords.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Missing Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {keywords.map(kw => (
              <KeywordChip
                key={kw.canonicalName}
                kw={kw}
                checked={selected.has(kw.canonicalName)}
                onToggle={() => onToggle(kw.canonicalName)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-muted-foreground">
          Selected: {selected.size} of {keywords.length}
        </span>
        <Button onClick={onContinue} disabled={selected.size === 0}>
          Continue
        </Button>
      </div>
    </div>
  );
}
