import { useFormContext, useWatch } from 'react-hook-form';
import UncontrolledTextarea from '@/components/ConnectedFields/UncontrolledTextarea';
import type { TResumeForm } from '@/types/schema';

const MAX_LENGTH = 2000;

/** Summary textarea with live character count. */
export default function Summary() {
  const { control } = useFormContext<TResumeForm>();
  const value = useWatch({ control, name: 'personalInfo.summary' });
  const count = (value ?? '').length;

  return (
    <div>
      <UncontrolledTextarea<TResumeForm>
        name="personalInfo.summary"
        label="Summary"
        placeholder="Results-driven professional with 5+ years of experience in software development. Proven track record of delivering high-quality solutions and leading cross-functional teams."
      />
      <p className="text-muted-foreground mt-1 text-right text-xs">
        {count}/{MAX_LENGTH}
      </p>
    </div>
  );
}
