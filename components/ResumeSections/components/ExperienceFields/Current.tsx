import { ControlledSingleCheckbox } from '@/components/ControlledFields';

export default function Current({ index }: { index: number }) {
  return <ControlledSingleCheckbox name={`experience.${index}.current`} label="I currently work here" />;
}
