import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function Field({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.field`}
      label="Field of Study"
    />
  );
}
