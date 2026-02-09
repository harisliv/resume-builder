import type { ComponentProps } from 'react';

export function CreateResumeRow(props: ComponentProps<'div'>) {
  return <div className="flex items-center gap-2 p-2" {...props} />;
}
