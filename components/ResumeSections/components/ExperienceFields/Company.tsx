import { ControlledInput } from '@/components/ControlledFields';

export default function Company({ index }: { index: number }) {
  return (
    <ControlledInput name={`experience.${index}.company`} label="Company" />
  );
}
