import { ControlledInput } from '@/components/ControlledFields';

export default function EndDate({ index }: { index: number }) {
  return <ControlledInput name={`experience.${index}.endDate`} label="End Date" />;
}
