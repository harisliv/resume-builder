import { ResumeFormControlledCombobox } from '@/components/ControlledFields/ControlledCombobox';
import { Item, ItemContent, ItemTitle, ItemDescription } from '@/components/ui/item';
import { useFetchCountries, type CountryOption } from '@/hooks/useFetchCountries';

/** Prefix-only match to avoid contains-based results (e.g. `b` matching `Abu`). */
function filterCountryByPrefix(item: CountryOption, query: string) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;
  return item.value.toLowerCase().startsWith(normalizedQuery);
}

export default function Location({ index }: { index: number }) {
  const { data: countries = [] } = useFetchCountries();

  return (
    <ResumeFormControlledCombobox<CountryOption>
      name={`education.${index}.location`}
      label="Location"
      placeholder="Berkeley, CA"
      items={countries}
      itemToStringValue={(c) => c.value}
      filter={filterCountryByPrefix}
      renderItem={(c) => (
        <Item>
          <ItemContent>
            <ItemTitle>{c.capital}</ItemTitle>
            <ItemDescription>{c.country}</ItemDescription>
          </ItemContent>
        </Item>
      )}
    />
  );
}
