import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function Email() {
  return (
    <ResumeFormControlledInput
      name="personalInfo.email"
      label="Email"
      placeholder="john.doe@email.com"
    />
  );
}
