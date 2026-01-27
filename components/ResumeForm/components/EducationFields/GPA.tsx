import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function GPA({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.gpa`}
      label="GPA (Optional)"
    />
  );
}
