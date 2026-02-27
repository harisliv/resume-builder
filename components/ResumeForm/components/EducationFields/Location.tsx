import { ResumeFormControlledCombobox } from '@/components/ControlledFields/ControlledCombobox';
import { useFetchCountries } from '@/hooks/useFetchCountries';

export default function Location({ index }: { index: number }) {
  const { data: countries = [] } = useFetchCountries();

  return (
    <ResumeFormControlledCombobox
      name={`education.${index}.location`}
      label="Location"
      placeholder="Berkeley, CA"
      options={countries}
    />
  );
}
