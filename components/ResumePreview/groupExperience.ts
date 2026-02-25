/**
 * @file groupExperience.ts
 * @description Groups flat experience entries by company name for rendering.
 * Single-entry companies render as before; multi-entry companies show a
 * company header with indented role entries.
 */
import type { TExperience } from '@/types/schema';

/** Represents a group of experience entries sharing the same company. */
export type ExperienceGroup = {
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  entries: TExperience[];
  /** true when 2+ entries share this company */
  isGrouped: boolean;
};

/**
 * Parses a date string like "Jan 2020" into a sortable timestamp.
 * Returns 0 for empty/invalid strings, Infinity for "Present".
 */
function parseDate(dateStr: string | undefined): number {
  if (!dateStr) return 0;
  const trimmed = dateStr.trim();
  if (trimmed.toLowerCase() === 'present') return Infinity;
  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Groups experience entries by company name (case-insensitive, trimmed).
 * Preserves original order of first appearance per company.
 * Entries within each group sorted by startDate descending (newest first).
 */
export function groupExperience(
  experience: TExperience[]
): ExperienceGroup[] {
  const map = new Map<string, TExperience[]>();
  const orderKeys: string[] = [];

  for (const entry of experience) {
    const key = (entry.company ?? '').trim().toLowerCase();
    if (!map.has(key)) {
      map.set(key, []);
      orderKeys.push(key);
    }
    map.get(key)!.push(entry);
  }

  return orderKeys.map((key) => {
    const entries = map.get(key)!;

    // Sort entries by startDate descending within group
    const sorted = [...entries].sort(
      (a, b) => parseDate(b.startDate) - parseDate(a.startDate)
    );

    // Compute group-level date range
    const startDates = sorted.map((e) => parseDate(e.startDate)).filter(Boolean);
    const endDates = sorted.map((e) =>
      e.current ? Infinity : parseDate(e.endDate)
    );

    const earliest = startDates.length ? Math.min(...startDates) : 0;
    const latest = endDates.length ? Math.max(...endDates) : 0;

    // Find the entry with the earliest start date for its formatted string
    const earliestEntry = sorted[sorted.length - 1];
    // Find the entry with the latest end date for its formatted string
    const latestEntry = sorted.find(
      (e) => (e.current ? Infinity : parseDate(e.endDate)) === latest
    );

    return {
      company: sorted[0]?.company ?? '',
      location: sorted[0]?.location ?? '',
      startDate: earliestEntry?.startDate ?? '',
      endDate:
        latest === Infinity
          ? 'Present'
          : (latestEntry?.endDate ?? ''),
      current: sorted.some((e) => e.current),
      entries: sorted,
      isGrouped: sorted.length >= 2
    };
  });
}
