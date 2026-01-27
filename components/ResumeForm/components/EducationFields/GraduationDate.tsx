import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function GraduationDate({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.graduationDate`}
      label="Graduation Date"
    />
  );
}
