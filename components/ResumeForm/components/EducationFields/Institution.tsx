import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function Institution({ index }: { index: number }) {
  return (
    <ResumeFormControlledInput
      name={`education.${index}.institution`}
      label="Institution"
      placeholder="University of California"
    />
  );
}
