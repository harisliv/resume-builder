import { ControlledInput } from '@/components/ControlledFields';

export default function GPA({ index }: { index: number }) {
  return (
    <ControlledInput name={`education.${index}.gpa`} label="GPA (Optional)" />
  );
}
