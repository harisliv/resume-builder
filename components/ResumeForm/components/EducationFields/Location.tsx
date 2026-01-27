import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function Location({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.location`}
      label="Location"
    />
  );
}
