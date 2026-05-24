import type { TCustomSection, TCustomSectionItem } from '@/types/schema';

/** Returns true when a custom section item has visible resume content. */
export function hasCustomSectionItemContent(item: TCustomSectionItem) {
  return Boolean(
    item.title?.trim() ||
      item.subtitle?.trim() ||
      item.location?.trim() ||
      item.startDate?.trim() ||
      item.endDate?.trim() ||
      item.url?.trim() ||
      item.description?.trim()
  );
}

/** Filters custom sections down to renderable sections and items. */
export function getVisibleCustomSections(
  sections: TCustomSection[] | undefined
) {
  return (sections ?? [])
    .map((section) => ({
      ...section,
      sectionTitle: section.sectionTitle.trim(),
      items: section.items.filter(hasCustomSectionItemContent)
    }))
    .filter((section) => section.sectionTitle && section.items.length > 0);
}

/** Formats custom section date metadata from pickers (`startDate` / `endDate`). */
export function formatCustomSectionDateRange(item: TCustomSectionItem) {
  const start = item.startDate?.trim();
  const end = item.endDate?.trim();
  if (start && end) return `${start} → ${end}`;
  return start || end || '';
}

/** Keeps the real URL visible so generated PDFs can be imported again. */
export function formatCustomSectionUrlText(url: string | undefined) {
  const trimmed = url?.trim();
  return trimmed ? `URL: ${trimmed}` : '';
}
