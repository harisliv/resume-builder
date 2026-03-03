import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function Degree({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`education.${index}.degree`}
      label="Degree"
      placeholder="Bachelor of Science"
    />
  );
}
