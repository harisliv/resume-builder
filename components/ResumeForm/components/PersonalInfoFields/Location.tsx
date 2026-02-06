import { ResumeFormControlledInput } from '@/components/ControlledFields/ControlledInput';

export default function Location() {
  return (
    <ResumeFormControlledInput
      name="personalInfo.location"
      label="Location"
      placeholder="New York, NY"
    />
  );
}
