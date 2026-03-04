import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function Website() {
  return (
    <UncontrolledInput<TResumeForm>
      name="personalInfo.website"
      label="Website"
      placeholder="https://johndoe.com"
    />
  );
}
