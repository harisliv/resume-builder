import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function Position({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.position`}
      label="Position"
    />
  );
}
