import { ResumeSectionsControlledInput } from '@/components/ControlledFields';

export default function FullName() {
  return (
    <ResumeSectionsControlledInput
      name="personalInfo.fullName"
      label="Full Name"
    />
  );
}
