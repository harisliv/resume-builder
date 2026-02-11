import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function GPA({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.gpa`}
      label="GPA (Optional)"
      placeholder="3.8"
    />
  );
}
