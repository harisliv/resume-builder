import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function Company({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.company`}
      label="Company"
    />
  );
}
