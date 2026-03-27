'use client';

import type { TResumeForm } from '@/types/schema';
import type { TPlacementTarget } from '@/types/aiKeywords';

type TDisplayExperienceTabProps = {
  experience: TResumeForm['experience'];
  selectedTargets: TPlacementTarget[];
  onToggleTarget: (target: TPlacementTarget) => void;
  disabled: boolean;
};

/** Experience cards with checkboxes per highlight. */
export function DisplayExperienceTab({
  experience,
  selectedTargets,
  onToggleTarget,
  disabled
}: TDisplayExperienceTabProps) {
  const isChecked = (expId: string, hlId: string) =>
    selectedTargets.some(
      t => t.type === 'highlight' && t.experienceId === expId && t.highlightId === hlId
    );

  return (
    <div className="mb-8">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Work Experience Enhancement
      </h4>
      <div className="space-y-6">
        {experience.map(exp => (
          <div
            key={exp.id}
            className="group relative rounded-2xl border border-border p-5 transition-all hover:border-primary/20"
          >
            {/* Header */}
            <div className="mb-1 flex items-start justify-between">
              <h5 className="text-base font-bold text-foreground">
                {exp.company}
              </h5>
              {(exp.startDate || exp.endDate) && (
                <div className="rounded bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                </div>
              )}
            </div>
            {exp.position && (
              <div className="mb-3 text-sm font-semibold text-primary">
                {exp.position}
              </div>
            )}
            {exp.description && (
              <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">
                {exp.description}
              </p>
            )}

            {/* Highlights */}
            {(exp.highlights ?? []).length > 0 && (
              <div className="space-y-3">
                <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                  Key Highlights
                </div>
                {(exp.highlights ?? []).map(h => (
                  <label
                    key={h.id}
                    className="group/item relative flex cursor-pointer items-start gap-3 rounded-xl border border-transparent p-3 transition-colors hover:border-primary/10 hover:bg-primary/5"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                      checked={isChecked(exp.id, h.id)}
                      disabled={disabled}
                      onChange={() =>
                        onToggleTarget({
                          type: 'highlight',
                          experienceId: exp.id,
                          highlightId: h.id,
                          currentText: h.value
                        })
                      }
                    />
                    <span className="text-[13px] leading-snug text-foreground">
                      {h.value}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
