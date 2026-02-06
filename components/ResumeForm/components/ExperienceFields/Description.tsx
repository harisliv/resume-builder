import { ResumeFormControlledTextarea } from '@/components/ControlledFields/ControlledTextarea';

export default function Description({ index }: { index: number }) {
  return (
    <ResumeFormControlledTextarea
      name={`experience.${index}.description`}
      label="Description"
      placeholder="Led development of microservices architecture serving 1M+ users. Mentored junior developers and implemented CI/CD pipelines."
    />
  );
}
