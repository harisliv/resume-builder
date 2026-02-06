import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Field({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.field`}
      label="Field of Study"
      placeholder="Computer Science"
    />
  );
}
