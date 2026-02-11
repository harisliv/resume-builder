import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Degree({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.degree`}
      label="Degree"
      placeholder="Bachelor of Science"
    />
  );
}
