import UncontrolledTextarea from '@/components/ConnectedFields/UncontrolledTextarea';
import type { TResumeForm } from '@/types/schema';

export default function Summary() {
  return (
    <UncontrolledTextarea<TResumeForm>
      name="personalInfo.summary"
      label="Summary"
      placeholder="Results-driven professional with 5+ years of experience in software development. Proven track record of delivering high-quality solutions and leading cross-functional teams."
    />
  );
}
