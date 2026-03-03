import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function Email() {
  return (
    <UncontrolledInput<TResumeForm>
      name="personalInfo.email"
      label="Email"
      placeholder="john.doe@email.com"
    />
  );
}
