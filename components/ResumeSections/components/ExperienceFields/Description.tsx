import { ControlledTextarea } from '@/components/ControlledFields';

export default function Description({ index }: { index: number }) {
  return <ControlledTextarea name={`experience.${index}.description`} label="Description" />;
}
