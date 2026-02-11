import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Location({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.location`}
      label="Location"
      placeholder="San Francisco, CA"
    />
  );
}
