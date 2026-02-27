import { ResumeFormControlledCombobox } from '@/components/ControlledFields/ControlledCombobox';
import { useFetchCountries } from '@/hooks/useFetchCountries';

export default function Location() {
  const { data: countries = [] } = useFetchCountries();

  return (
    <ResumeFormControlledCombobox
      name="personalInfo.location"
      label="Location"
      placeholder="New York, NY"
      options={countries}
    />
  );
}
