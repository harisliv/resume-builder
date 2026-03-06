'use client';

import { useMemo } from 'react';

type TJdKeywordHighlightProps = {
  text: string;
  keywords: string[];
  className?: string;
};

/**
 * Highlights JD keywords within the job description text.
 * Uses case-insensitive matching with word-boundary-aware regex.
 */
export function JdKeywordHighlight({
  text,
  keywords,
  className
}: TJdKeywordHighlightProps) {
  const segments = useMemo(() => splitByKeywords(text, keywords), [text, keywords]);

  return (
    <p className={className}>
      {segments.map((seg, i) =>
        seg.highlighted ? (
          <mark
            key={i}
            className="bg-primary/20 text-primary rounded-sm px-0.5 font-medium"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </p>
  );
}

type TSegment = { text: string; highlighted: boolean };

/** Splits text into highlighted/non-highlighted segments by keyword matches. */
function splitByKeywords(text: string, keywords: string[]): TSegment[] {
  if (!keywords.length) return [{ text, highlighted: false }];

  const escaped = keywords
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((kw) => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (!escaped.length) return [{ text, highlighted: false }];

  const pattern = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  const segments: TSegment[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, match.index), highlighted: false });
    }
    segments.push({ text: match[0], highlighted: true });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlighted: false });
  }

  return segments;
}
