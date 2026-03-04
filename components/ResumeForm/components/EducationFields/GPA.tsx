import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function GPA({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`education.${index}.gpa`}
      label="GPA (Optional)"
      placeholder="3.8"
    />
  );
}
