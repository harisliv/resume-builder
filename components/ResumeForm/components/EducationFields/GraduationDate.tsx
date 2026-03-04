import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function GraduationDate({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`education.${index}.graduationDate`}
      label="Graduation Date"
      placeholder="May 2019"
    />
  );
}
