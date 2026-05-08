'use client';

import { Crosshair, Plus, Sparkles, Upload } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useSidebar } from '@/ui/sidebar';
import { SidebarMenu, SidebarMenuItem } from '@/ui/sidebar';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useBlockedActionGate } from '@/hooks/useBlockedActionGate';
import { cn } from '@/lib/utils';

/** Action buttons for creating/importing resumes and AI actions. */
export function ResumeActions({
  onCreateNew,
  onImportPdf,
  onImproveResume,
  onMatchJob,
  selectedResumeId,
  isAiImproved = false
}: {
  onCreateNew: () => void;
  onImportPdf: () => void;
  onImproveResume: () => void;
  onMatchJob: () => void;
  selectedResumeId?: string;
  isAiImproved?: boolean;
}) {
  const { data: resumeTitles } = useGetUserResumeTitles();
  const pdfAttempts = useQuery(api.aiAttempts.getRemainingAttempts, {
    type: 'pdf'
  });
  const aiAttempts = useQuery(api.aiAttempts.getRemainingAttempts, {
    type: 'ai'
  });
  const { isCollapsed } = useSidebar();
  const { runOrExplain } = useBlockedActionGate({
    resumeCount: resumeTitles?.length,
    hasSelectedResume: !!selectedResumeId,
    isAiImproved,
    pdfAttempts,
    aiAttempts
  });

  return (
    <SidebarMenu className="mt-3 gap-0">
      <SidebarMenuItem>
        <ActionRow collapsed={isCollapsed} isLast={false}>
          <ActionButton
            label="Create new"
            icon={<Plus className="size-4" />}
            onClick={() => void runOrExplain('createResume', onCreateNew)}
            collapsed={isCollapsed}
            variant="indigo"
          />
        </ActionRow>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <ActionRow collapsed={isCollapsed} isLast={false}>
          <ActionButton
            label="Import PDF"
            icon={<Upload className="size-4" />}
            onClick={() => void runOrExplain('importPdf', onImportPdf)}
            collapsed={isCollapsed}
            variant="teal"
          />
        </ActionRow>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <ActionRow collapsed={isCollapsed} isLast={false}>
          <ActionButton
            label="Improve Resume"
            icon={<Sparkles className="size-4" />}
            onClick={() => void runOrExplain('improveResume', onImproveResume)}
            collapsed={isCollapsed}
            variant="amber"
          />
        </ActionRow>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <ActionRow collapsed={isCollapsed} isLast>
          <ActionButton
            label="Match Job"
            icon={<Crosshair className="size-4" />}
            onClick={() => void runOrExplain('matchJob', onMatchJob)}
            collapsed={isCollapsed}
            variant="violet"
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
  teal: 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-500/20 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30 text-white',
  amber:
    'bg-gradient-to-br from-amber-500 to-orange-500 border-amber-500/20 shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/30 text-white',
  violet:
    'bg-gradient-to-br from-violet-500 to-purple-600 border-violet-500/20 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/30 text-white'
} as const;

/** Action button: collapsed = black icon no bg; expanded = colored gradient with white icon. */
function ActionButton({
  label,
  icon,
  onClick,
  collapsed,
  variant
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  collapsed: boolean;
  variant: 'indigo' | 'teal' | 'amber' | 'violet';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full cursor-pointer items-center rounded-lg border px-3 py-2 text-xs font-bold transition-all duration-200',
        collapsed ? COLLAPSED_BUTTON_CLASS : EXPANDED_VARIANT_CLASSES[variant],
        collapsed && 'px-0 py-2'
      )}
    >
      {!collapsed && <span className="flex-1 text-left">{label}</span>}
      <span
        className={cn(collapsed ? 'text-sidebar-foreground' : 'text-white/80')}
      >
        {icon}
      </span>
    </button>
  );
}
