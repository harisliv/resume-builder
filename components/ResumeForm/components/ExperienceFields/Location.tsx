import { ResumeFormControlledCombobox } from '@/components/ConnectedFields/ControlledCombobox';
import { Item, ItemContent, ItemTitle, ItemDescription } from '@/components/ui/item';
import { useFetchCountries, type CountryOption } from '@/hooks/useFetchCountries';
import { filterCountryByPrefix } from '@/lib/filter-country';

export default function Location({ index }: { index: number }) {
  const { data: countries = [] } = useFetchCountries();

  return (
    <ResumeFormControlledCombobox<CountryOption>
      name={`experience.${index}.location`}
      label="Location"
      placeholder="San Francisco, CA"
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
