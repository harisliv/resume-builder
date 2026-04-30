'use client';

import { cn } from '@/lib/utils';
import type { TResumeForm } from '@/types/schema';
import type { TPlacementTarget } from '@/types/aiKeywords';
import { DisplaySkillsTab } from './DisplaySkillsTab';
import { DisplayExperienceTab } from './DisplayExperienceTab';
import { MATCH_JOB_TABS, type TMatchJobTab } from './matchJob.utils';

type TDisplayTabsProps = {
  resume: TResumeForm;
  selectedTargets: TPlacementTarget[];
  onToggleTarget: (target: TPlacementTarget) => void;
  activeTab: TMatchJobTab;
  onActiveTabChange: (tab: TMatchJobTab) => void;
  disabled: boolean;
  enhancing: boolean;
};

/** Builds a stable panel id for a Match Job tab. */
function getTabPanelId(tab: TMatchJobTab) {
  return `match-job-panel-${tab.toLowerCase().replace(/\s+/g, '-')}`;
}

/** Right panel tabs — Personal Info, Skills, Experience. */
export function DisplayTabs({
  resume,
  selectedTargets,
  onToggleTarget,
  activeTab,
  onActiveTabChange,
  disabled,
  enhancing
}: TDisplayTabsProps) {
  const controlsDisabled = disabled || enhancing;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div
        role="tablist"
        aria-label="Resume sections"
        className="flex shrink-0 border-b border-border bg-white px-8 dark:bg-card"
      >
        {MATCH_JOB_TABS.map(tab => (
          <button
            type="button"
            key={tab}
            onClick={() => {
              if (enhancing) return;
              onActiveTabChange(tab);
            }}
            role="tab"
            id={`${getTabPanelId(tab)}-tab`}
            aria-selected={activeTab === tab}
            aria-controls={getTabPanelId(tab)}
            disabled={enhancing}
            className={cn(
              'group relative mr-8 cursor-pointer px-2 py-4 text-sm font-bold transition-colors',
              activeTab === tab
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
              enhancing && 'cursor-not-allowed opacity-60 hover:text-muted-foreground'
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={getTabPanelId(activeTab)}
        aria-labelledby={`${getTabPanelId(activeTab)}-tab`}
        className="flex-1 overflow-y-auto bg-white px-8 py-6 dark:bg-card"
      >
        {activeTab === 'Personal Info' && (
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Summary
            </label>
            <div className="w-full rounded-xl border border-border bg-muted/40 p-4 text-[14px] leading-relaxed text-muted-foreground">
              {resume.personalInfo?.summary || (
                <span className="text-muted-foreground/50">No summary provided</span>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Skills' && (
          <DisplaySkillsTab
            skills={resume.skills}
            selectedTargets={selectedTargets}
            onToggleTarget={onToggleTarget}
            disabled={controlsDisabled}
            enhancing={enhancing}
          />
        )}

        {activeTab === 'Experience' && (
          <DisplayExperienceTab
            experience={resume.experience}
            selectedTargets={selectedTargets}
            onToggleTarget={onToggleTarget}
            disabled={controlsDisabled}
            enhancing={enhancing}
          />
        )}
      </div>
    </div>
  );
}
