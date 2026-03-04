import UncontrolledInput from '@/components/ConnectedFields/UncontrolledInput';
import type { TResumeForm } from '@/types/schema';

export default function FullName() {
  return (
    <UncontrolledInput<TResumeForm>
      name="personalInfo.fullName"
      label="Full Name"
      placeholder="John Doe"
    />
  );
}
