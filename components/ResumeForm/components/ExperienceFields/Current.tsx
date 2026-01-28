import { ResumeFormControlledSingleCheckbox } from '@/components/ControlledFields';

export default function Current({ index }: { index: number }) {
  return (
    <ResumeFormControlledSingleCheckbox
      name={`experience.${index}.current`}
      label="I currently work here"
    />
  );
}
