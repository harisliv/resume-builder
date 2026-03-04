import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function Institution({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`education.${index}.institution`}
      label="Institution"
      placeholder="University of California"
    />
  );
}
