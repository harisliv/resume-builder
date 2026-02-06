import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Company({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.company`}
      label="Company"
      placeholder="Acme Corporation"
    />
  );
}
