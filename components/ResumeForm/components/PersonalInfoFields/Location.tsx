import { ResumeFormControlledInput } from '@/components/ControlledFields';

export default function Location() {
  return (
    <ResumeFormControlledInput
      name="personalInfo.location"
      label="Location"
      placeholder="New York, NY"
    />
  );
}
