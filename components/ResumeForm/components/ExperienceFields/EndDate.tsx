import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function EndDate({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`experience.${index}.endDate`}
      label="End Date"
      placeholder="Dec 2023"
    />
  );
}
