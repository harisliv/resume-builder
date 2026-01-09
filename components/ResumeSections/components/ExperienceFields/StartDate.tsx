import { ControlledInput } from '@/components/ControlledFields';

export default function StartDate({ index }: { index: number }) {
  return <ControlledInput name={`experience.${index}.startDate`} label="Start Date" />;
}
