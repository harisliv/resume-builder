import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function Position({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`experience.${index}.position`}
      label="Position"
      placeholder="Senior Software Engineer"
    />
  );
}
