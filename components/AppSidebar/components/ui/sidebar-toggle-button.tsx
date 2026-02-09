import { Button } from '@/components/ui/button';
import type { ComponentProps } from 'react';

export function CollapsedToggleButton(props: ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Toggle Sidebar"
      {...props}
    />
  );
}

export function ExpandedToggleButton(props: ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="hover:bg-accent hover:border-primary/50 animate-pulse-subtle rounded-xl border-2 shadow-lg transition-all duration-200 hover:shadow-xl"
      aria-label="Toggle Sidebar"
      {...props}
    />
  );
}
