import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

/** Optional project name field for experience entries. */
export default function ProjectName({ index }: { index: number }) {
  return (
    <UncontrolledInput<TResumeForm>
      name={`experience.${index}.projectName`}
      label="Project Name"
      placeholder="Cloud Migration"
    />
  );
}
