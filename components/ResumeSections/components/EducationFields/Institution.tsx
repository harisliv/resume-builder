import { ControlledInput } from '@/components/ControlledFields';

export default function Institution({ index }: { index: number }) {
  return (
    <ControlledInput
      name={`education.${index}.institution`}
      label="Institution"
    />
  );
}
