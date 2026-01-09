import { ControlledInput } from '@/components/ControlledFields';

export default function Degree({ index }: { index: number }) {
  return <ControlledInput name={`education.${index}.degree`} label="Degree" />;
}
