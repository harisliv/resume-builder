'use client';

import { Plus, Upload } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { useSidebar } from '@/ui/sidebar';
import { SidebarMenu, SidebarMenuItem } from '@/ui/sidebar';
import usePrivileges from '@/hooks/usePrivileges';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { cn } from '@/lib/utils';

/** Action buttons for creating/importing resumes, shown below the selector. */
export function ResumeActions({
  onCreateNew,
  onImportPdf
}: {
  onCreateNew: () => void;
  onImportPdf: () => void;
}) {
  const { getDisabledTooltip, resumeLimit } = usePrivileges();
  const { data: resumeTitles } = useGetUserResumeTitles();
  const atLimit = (resumeTitles?.length ?? 0) >= resumeLimit;
  const disabledTooltip = atLimit
    ? 'Resume limit reached. Upgrade to create more.'
    : (getDisabledTooltip(true) ?? undefined);
  const { isCollapsed } = useSidebar();

  return (
    <SidebarMenu className="mt-3 gap-0">
      <SidebarMenuItem>
        <ActionRow collapsed={isCollapsed} isLast={false}>
          <ActionButton
            label="Create new"
            icon={<Plus className="size-4" />}
            onClick={onCreateNew}
            disabled={!!disabledTooltip}
            disabledTooltip={disabledTooltip}
            collapsed={isCollapsed}
            variant="indigo"
          />
        </ActionRow>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <ActionRow collapsed={isCollapsed} isLast>
          <ActionButton
            label="Import PDF"
            icon={<Upload className="size-4" />}
            onClick={onImportPdf}
            disabled={!!disabledTooltip}
            disabledTooltip={disabledTooltip}
            collapsed={isCollapsed}
            variant="teal"
          />
        </ActionRow>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

/** Tree-branch connector in the left 25% gutter. */
function ActionRow({
  collapsed,
  isLast,
  children
}: {
  collapsed: boolean;
  isLast: boolean;
  children: React.ReactNode;
}) {
  if (collapsed) return <>{children}</>;

  return (
    <div className="flex items-stretch">
      <div className="relative w-1/4">
        {/* Vertical line */}
        <div
          className={cn(
            'border-border/60 absolute top-0 left-1/3 border-l-2',
            isLast ? 'h-1/2' : 'h-full'
          )}
        />
        {/* Horizontal line */}
        <div className="border-border/60 absolute top-1/2 left-1/3 w-2/3 border-t-2" />
      </div>
      <div className="w-3/4 py-0.5 pl-4">{children}</div>
    </div>
  );
}

const COLLAPSED_BUTTON_CLASS =
  'h-auto border-0 bg-transparent p-0 shadow-none hover:bg-transparent justify-center text-sidebar-foreground';
const EXPANDED_VARIANT_CLASSES = {
  indigo:
    'bg-gradient-to-br from-primary to-primary/80 border-primary/20 shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 text-white',
  teal: 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500/20 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 text-white'
} as const;

/** Action button: collapsed = black icon no bg; expanded = colored gradient with white icon. */
function ActionButton({
  label,
  icon,
  onClick,
  disabled,
  disabledTooltip,
  collapsed,
  variant
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  disabledTooltip: string | undefined;
  collapsed: boolean;
  variant: 'indigo' | 'teal';
}) {
  const button = (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center rounded-lg border px-3 py-2 text-xs font-bold transition-all duration-200',
        collapsed ? COLLAPSED_BUTTON_CLASS : EXPANDED_VARIANT_CLASSES[variant],
        disabled && 'cursor-not-allowed opacity-50',
        collapsed && 'px-0 py-2'
      )}
    >
      {!collapsed && <span className="flex-1 text-left">{label}</span>}
      <span
        className={cn(
          collapsed ? 'text-sidebar-foreground' : 'text-white/80'
        )}
      >
        {icon}
      </span>
    </button>
  );

  if (disabled && disabledTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="w-full">{button}</span>
        </TooltipTrigger>
        <TooltipContent side="right">{disabledTooltip}</TooltipContent>
      </Tooltip>
    );
  }

  return button;
}
