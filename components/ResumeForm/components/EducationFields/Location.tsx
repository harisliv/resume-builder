import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Location({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.location`}
      label="Location"
      placeholder="Berkeley, CA"
    />
  );
}
