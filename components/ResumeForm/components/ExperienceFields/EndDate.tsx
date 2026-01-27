import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function EndDate({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.endDate`}
      label="End Date"
    />
  );
}
