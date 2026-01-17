import { ControlledInput } from '@/components/ControlledFields';

export default function Location({ index }: { index: number }) {
  return (
    <ControlledInput name={`experience.${index}.location`} label="Location" />
  );
}
