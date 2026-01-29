import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function StartDate({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.startDate`}
      label="Start Date"
      placeholder="Jan 2020"
    />
  );
}
