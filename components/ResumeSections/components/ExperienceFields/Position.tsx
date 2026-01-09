import { ControlledInput } from '@/components/ControlledFields';

export default function Position({ index }: { index: number }) {
  return <ControlledInput name={`experience.${index}.position`} label="Position" />;
}
