'use client';

import { useMemo } from 'react';
import type { TExtractedKeyword } from '@/types/aiKeywords';
import { Check, Crosshair, Pointer } from 'lucide-react';

type THighlightedJdProps = {
  text: string;
  keywords: TExtractedKeyword[];
  selectedKeyword: string | null;
  onSelectKeyword: (canonicalName: string | null) => void;
  processedKeywords: Set<string>;
};

type TSegment = { text: string; keyword?: TExtractedKeyword };

type TKeywordChipProps = {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

/** Interactive JD keyword chip. */
function KeywordChip({
  selected,
  onClick,
  children
}: TKeywordChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        selected
          ? 'inline-flex cursor-pointer items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 font-bold text-primary-foreground'
          : 'inline-flex cursor-pointer items-center gap-1 rounded-md border border-orange-200 bg-orange-100 px-1.5 py-0.5 font-bold text-orange-700 shadow-sm transition-colors hover:bg-orange-200 dark:border-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
      }
    >
      {children}
    </button>
  );
}

/** Splits JD text into segments, marking keyword occurrences. */
function buildSegments(text: string, keywords: TExtractedKeyword[]): TSegment[] {
  if (!keywords.length) return [{ text }];

  const sorted = [...keywords].sort((a, b) => b.keyword.length - a.keyword.length);
  const escaped = sorted.map(kw => kw.keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');

  const kwMap = new Map<string, TExtractedKeyword>();
  for (const kw of keywords) {
    kwMap.set(kw.keyword.toLowerCase(), kw);
  }

  const segments: TSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(regex)) {
    const matchStart = match.index;
    if (matchStart > lastIndex) {
      segments.push({ text: text.slice(lastIndex, matchStart) });
    }
    const matched = match[0];
    const kw = kwMap.get(matched.toLowerCase());
    segments.push({ text: matched, keyword: kw });
    lastIndex = matchStart + matched.length;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex) });
  }

  return segments;
}

/** Renders JD text with clickable keyword highlights. */
export function HighlightedJd({
  text,
  keywords,
  selectedKeyword,
  onSelectKeyword,
  processedKeywords
}: THighlightedJdProps) {
  const segments = useMemo(() => buildSegments(text, keywords), [text, keywords]);

  return (
    <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-foreground">
      {segments.map((seg, i) => {
        if (!seg.keyword) return seg.text;
        const keyword = seg.keyword;

        const isProcessed = processedKeywords.has(keyword.canonicalName);
        const isSelected = selectedKeyword === keyword.canonicalName;

        if (isProcessed) {
          return (
            <span
              key={i}
              className="inline-flex cursor-default items-center gap-1 rounded-md bg-emerald-100 px-1.5 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
            >
              {seg.text}
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
            </span>
          );
        }

        if (isSelected) {
          return (
            <KeywordChip
              key={i}
              onClick={() => onSelectKeyword(null)}
              selected
            >
              {seg.text}
              <Crosshair className="h-3.5 w-3.5" strokeWidth={2.5} />
            </KeywordChip>
          );
        }

        return (
          <KeywordChip
            key={i}
            onClick={() => onSelectKeyword(keyword.canonicalName)}
            selected={false}
          >
            {seg.text}
            <Pointer className="h-3.5 w-3.5" />
          </KeywordChip>
        );
      })}
    </p>
  );
}
