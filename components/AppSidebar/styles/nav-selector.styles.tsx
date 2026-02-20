import { DropdownMenuContent } from '@/components/ui/dropdown-menu';
import type { ComponentProps } from 'react';

export function LabelGroup(props: ComponentProps<'div'>) {
  return (
    <div className="grid flex-1 text-left text-base leading-tight" {...props} />
  );
}

export function DropdownContent(
  props: ComponentProps<typeof DropdownMenuContent> & {
    side?: 'top' | 'right' | 'bottom' | 'left';
  }
) {
  return (
    <DropdownMenuContent
      className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
      align="start"
      sideOffset={4}
      {...props}
    />
  );
}

export function OptionIconWrapper(props: ComponentProps<'div'>) {
  return <div className="flex items-center justify-center" {...props} />;
}

export function Subtitle(props: ComponentProps<'span'>) {
  return (
    <span
      className="text-muted-foreground truncate text-sm font-medium"
      {...props}
    />
  );
}

export function Label(props: ComponentProps<'span'>) {
  return <span className="truncate font-bold" {...props} />;
}

export function OptionDetail(props: ComponentProps<'div'>) {
  return <div className="flex flex-col" {...props} />;
}

export function OptionDescription(props: ComponentProps<'span'>) {
  return <span className="text-muted-foreground text-xs" {...props} />;
}

export function CreateResumeRow(props: ComponentProps<'div'>) {
  return <div className="flex items-center gap-2 p-2" {...props} />;
}
