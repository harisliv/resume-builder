import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Email() {
  return (
    <ResumeFormControlledInput
      name="personalInfo.email"
      label="Email"
      placeholder="john.doe@email.com"
    />
  );
}
