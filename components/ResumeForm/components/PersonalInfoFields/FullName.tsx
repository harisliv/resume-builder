import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function FullName() {
  return (
    <ResumeFormControlledInput
      name="personalInfo.fullName"
      label="Full Name"
      placeholder="John Doe"
    />
  );
}
