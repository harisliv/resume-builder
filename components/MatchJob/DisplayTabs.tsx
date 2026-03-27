'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TResumeForm } from '@/types/schema';
import type { TPlacementTarget } from '@/types/aiKeywords';
import { DisplaySkillsTab } from './DisplaySkillsTab';
import { DisplayExperienceTab } from './DisplayExperienceTab';

type TDisplayTabsProps = {
  resume: TResumeForm;
  selectedTargets: TPlacementTarget[];
  onToggleTarget: (target: TPlacementTarget) => void;
  disabled: boolean;
};

const TABS = ['Personal Info', 'Skills', 'Experience'] as const;
type TTab = (typeof TABS)[number];

/** Right panel tabs — Personal Info, Skills, Experience. */
export function DisplayTabs({
  resume,
  selectedTargets,
  onToggleTarget,
  disabled
}: TDisplayTabsProps) {
  const [activeTab, setActiveTab] = useState<TTab>('Skills');

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab navigation */}
      <div className="flex shrink-0 border-b border-border bg-white px-8 dark:bg-card">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'group relative mr-8 px-2 py-4 text-sm font-bold transition-colors',
              activeTab === tab
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 h-1 w-full rounded-t-full bg-primary" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto bg-white px-8 py-6 dark:bg-card">
        {activeTab === 'Personal Info' && (
          <div className="mt-6 space-y-2">
            <label className="block text-sm font-semibold text-foreground">
              Summary
            </label>
            <textarea
              className="w-full rounded-xl border border-border bg-background text-[14px] text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-primary"
              placeholder="Write a brief professional summary about yourself..."
              rows={12}
              value={resume.personalInfo?.summary ?? ''}
              readOnly
            />
          </div>
        )}

        {activeTab === 'Skills' && (
          <DisplaySkillsTab
            skills={resume.skills}
            selectedTargets={selectedTargets}
            onToggleTarget={onToggleTarget}
            disabled={disabled}
          />
        )}

        {activeTab === 'Experience' && (
          <DisplayExperienceTab
            experience={resume.experience}
            selectedTargets={selectedTargets}
            onToggleTarget={onToggleTarget}
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
