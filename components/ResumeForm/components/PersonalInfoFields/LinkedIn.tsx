import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function LinkedIn() {
  return (
    <UncontrolledInput<TResumeForm>
      name="personalInfo.linkedIn"
      label="LinkedIn"
      placeholder="https://linkedin.com/in/johndoe"
    />
  );
}
