import { ChevronsUpDown } from 'lucide-react';
import { SidebarMenuButton } from '@/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

const COLLAPSED_BUTTON_CLASS =
  'h-auto border-0 bg-transparent p-0 shadow-none hover:bg-transparent';

const EXPANDED_BUTTON_CLASS =
  'bg-background border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 hover:border-primary/20 border shadow-sm transition-all duration-200 hover:shadow-md';

interface MenuButtonProps extends ComponentProps<typeof SidebarMenuButton> {
  collapsed?: boolean;
  loading?: boolean;
}

export function MenuButton({
  collapsed,
  loading,
  className,
  ...props
}: MenuButtonProps) {
  return (
    <SidebarMenuButton
      size="lg"
      type="button"
      className={cn(
        collapsed ? COLLAPSED_BUTTON_CLASS : EXPANDED_BUTTON_CLASS,
        loading !== undefined &&
          (loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'),
        className
      )}
      {...props}
    />
  );
}

export function TrailingIcon(props: ComponentProps<typeof ChevronsUpDown>) {
  return (
    <ChevronsUpDown
      className="text-muted-foreground ml-auto size-4"
      {...props}
    />
  );
}

export function TrailingSpinner(props: ComponentProps<typeof Spinner>) {
  return <Spinner className="ml-auto size-4" {...props} />;
}
