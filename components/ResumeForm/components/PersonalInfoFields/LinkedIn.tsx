import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function LinkedIn() {
  return (
    <ResumeFormControlledInput
      name="personalInfo.linkedIn"
      label="LinkedIn"
      placeholder="https://linkedin.com/in/johndoe"
    />
  );
}
