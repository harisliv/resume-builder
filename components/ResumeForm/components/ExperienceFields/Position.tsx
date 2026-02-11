import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Position({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.position`}
      label="Position"
      placeholder="Senior Software Engineer"
    />
  );
}
