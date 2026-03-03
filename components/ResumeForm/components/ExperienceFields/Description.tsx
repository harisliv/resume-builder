import UncontrolledTextarea from '@/components/ConnectedFields/UncontrolledTextarea';
import type { TResumeForm } from '@/types/schema';

export default function Description({ index }: { index: number }) {
  return (
    <UncontrolledTextarea<TResumeForm>
      name={`experience.${index}.description`}
      label="Description"
      placeholder="Led development of microservices architecture serving 1M+ users. Mentored junior developers and implemented CI/CD pipelines."
    />
  );
}
