/**
 * @file useFetchCountries.ts
 * @description Fetches all countries from REST Countries API and returns
 * sorted "Capital, Country" strings for location autocomplete.
 */
import { useQuery } from '@tanstack/react-query';

interface RestCountry {
  name: { common: string };
  capital?: string[];
}

const COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name,capital';

/** Fetches and transforms countries into sorted "Capital, Country" strings. */
async function fetchCountries(): Promise<string[]> {
  const res = await fetch(COUNTRIES_URL);
  if (!res.ok) throw new Error('Failed to fetch countries');
  const data: RestCountry[] = await res.json();

  return data
    .flatMap((c) =>
      (c.capital ?? [])
        .filter(Boolean)
        .map((cap) => `${cap}, ${c.name.common}`)
    )
    .sort((a, b) => a.localeCompare(b));
}

/** Returns cached list of "Capital, Country" strings for location comboboxes. */
export function useFetchCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: Infinity,
  });
}
