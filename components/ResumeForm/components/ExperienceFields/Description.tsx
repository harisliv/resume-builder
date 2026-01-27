import { ResumeFormControlledTextarea } from '@/components/ControlledFields';

export default function Description({ index }: { index: number }) {
  return (
    <ResumeFormControlledTextarea
      name={`experience.${index}.description`}
      label="Description"
    />
  );
}
