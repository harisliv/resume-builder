import { ControlledInput } from '@/components/ControlledFields';

export default function Field({ index }: { index: number }) {
  return (
    <ControlledInput name={`education.${index}.field`} label="Field of Study" />
  );
}
