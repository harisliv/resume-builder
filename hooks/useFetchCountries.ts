/**
 * @file useFetchCountries.ts
 * @description Fetches all countries from REST Countries API and returns
 * sorted CountryOption objects for location autocomplete.
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface RestCountry {
  name: { common: string };
  capital?: string[];
}

/** Structured country option for combobox items. */
export interface CountryOption {
  /** Full "Capital, Country" string — stored in form */
  value: string;
  /** Capital/city name */
  capital: string;
  /** Country name */
  country: string;
}

const COUNTRIES_URL = 'https://restcountries.com/v3.1/all?fields=name,capital';

/** Fetches and transforms countries into sorted CountryOption objects. */
async function fetchCountries(): Promise<CountryOption[]> {
  const { data } = await axios.get<RestCountry[]>(COUNTRIES_URL);

  return data
    .flatMap((c) =>
      (c.capital ?? [])
        .filter(Boolean)
        .map((cap) => ({
          value: `${cap}, ${c.name.common}`,
          capital: cap,
          country: c.name.common,
        }))
    )
    .sort((a, b) => a.value.localeCompare(b.value));
}

/** Returns cached list of CountryOption objects for location comboboxes. */
export function useFetchCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: Infinity,
  });
}
