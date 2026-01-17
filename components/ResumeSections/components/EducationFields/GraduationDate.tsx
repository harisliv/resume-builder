import { ControlledInput } from '@/components/ControlledFields';

export default function GraduationDate({ index }: { index: number }) {
  return (
    <ControlledInput
      name={`education.${index}.graduationDate`}
      label="Graduation Date"
    />
  );
}
