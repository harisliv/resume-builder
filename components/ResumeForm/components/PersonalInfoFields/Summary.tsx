import { ResumeFormControlledTextarea } from '@/components/ControlledFields';

export default function Summary() {
  return (
    <ResumeFormControlledTextarea
      name="personalInfo.summary"
      label="Summary"
      placeholder="Results-driven professional with 5+ years of experience in software development. Proven track record of delivering high-quality solutions and leading cross-functional teams."
    />
  );
}
