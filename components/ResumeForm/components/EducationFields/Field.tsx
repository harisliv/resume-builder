import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function Field({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`education.${index}.field`}
      label="Field of Study"
      placeholder="Computer Science"
    />
  );
}
