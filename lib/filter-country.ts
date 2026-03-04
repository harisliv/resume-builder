import type { CountryOption } from '@/hooks/useFetchCountries';

/** Prefix-only match to avoid contains-based results (e.g. `b` matching `Abu`). */
export function filterCountryByPrefix(item: CountryOption, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return item.value.toLowerCase().startsWith(normalizedQuery);
}
