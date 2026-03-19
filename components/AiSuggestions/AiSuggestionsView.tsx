'use client';

import type {
  TAiSuggestions,
  TSuggestionSelection
} from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ComparisonCard,
  ComparisonGrid,
  MutedText,
  ExperienceLabel,
  BulletItem,
  NewSkillBadge,
  SelectableField,
  VersionField,
  SkillCategorySection,
  SkillCategoryTitle,
  SkillRows,
  SkillRow
} from './styles/ai-suggestions-view.styles';
import { DiffHighlight } from './utils/diffHighlight';
import {
  buildHighlightMatchMaps
} from './utils/highlightMatching';

type TAiSuggestionsViewProps = {
  suggestions: TAiSuggestions;
  currentData: TResumeForm;
  selection: TSuggestionSelection;
  onToggleSummary: () => void;
  onToggleExperienceField: (
    expIdx: number,
    field: 'description' | 'highlight',
    highlightIdx?: number
  ) => void;
  onToggleSkill: (categoryIdx: number, skillIdx: number) => void;
  /** Optional: remove skill from list (multi-model flow). */
  onRemoveSkill?: (category: string, skillIdx: number) => void;
};

type THighlightRow = {
  currentIdx: number;
  suggestedIdx: number;
};

type TSkillCategory = {
  name: string;
  values: string[];
};

type TSkillRow = {
  currentIdx: number;
  suggestedIdx: number;
};

/**
 * Creates shared visual rows for current/suggested highlight columns.
 * Keeps suggested order, then appends unmatched current highlights.
 */
function buildHighlightRows(
  current: string[],
  suggested: string[],
  suggestedToCurrent: number[]
): THighlightRow[] {
  const rows: THighlightRow[] = [];
  const usedCurrent = new Set<number>();

  suggested.forEach((_, suggestedIdx) => {
    const currentIdx = suggestedToCurrent[suggestedIdx] ?? -1;
    rows.push({ currentIdx, suggestedIdx });
    if (currentIdx >= 0) usedCurrent.add(currentIdx);
  });

  current.forEach((_, currentIdx) => {
    if (!usedCurrent.has(currentIdx)) {
      rows.push({ currentIdx, suggestedIdx: -1 });
    }
  });

  return rows;
}

/** Flattens form skill objects to plain strings for comparison. */
function normalizeSkillCategories(
  skills?: { name: string; values: { value: string }[] }[]
): TSkillCategory[] {
  return (skills ?? []).map((category) => ({
    name: category.name.trim(),
    values: category.values.map((v) => v.value.trim()).filter(Boolean)
  }));
}

/** Pairs suggested skills to current skills by exact text, then appends unmatched current skills. */
function buildSkillRows(
  current: string[],
  suggested: { value: string; suggestedIdx: number }[]
): TSkillRow[] {
  const rows: TSkillRow[] = [];
  const currentIndexesBySkill = new Map<string, number[]>();

  current.forEach((skill, currentIdx) => {
    const key = skill.toLowerCase();
    const existing = currentIndexesBySkill.get(key) ?? [];
    existing.push(currentIdx);
    currentIndexesBySkill.set(key, existing);
  });

  const usedCurrent = new Set<number>();
  suggested.forEach(({ value, suggestedIdx }) => {
    const matches = currentIndexesBySkill.get(value.toLowerCase()) ?? [];
    let currentIdx = -1;
    while (matches.length) {
      const candidate = matches.shift();
      if (candidate === undefined || usedCurrent.has(candidate)) continue;
      currentIdx = candidate;
      usedCurrent.add(candidate);
      break;
    }
    rows.push({ currentIdx, suggestedIdx });
  });

  current.forEach((_, currentIdx) => {
    if (!usedCurrent.has(currentIdx)) {
      rows.push({ currentIdx, suggestedIdx: -1 });
    }
  });

  return rows;
}

/** Checks if suggested experience entry has any meaningful change vs current (after trim). */
function hasExperienceChanged(
  current: { description?: string; highlights?: { value: string }[] },
  suggested: { description?: string; highlights?: string[] }
): boolean {
  const curDesc = (current.description ?? '').trim();
  const sugDesc = (suggested.description ?? '').trim();
  if (sugDesc && sugDesc !== curDesc) return true;

  const curHighlights = (current.highlights ?? []).map((h) => h.value.trim());
  const sugHighlights = (suggested.highlights ?? []).map((h) => h.trim());
  if (sugHighlights.length !== curHighlights.length) return true;
  for (let i = 0; i < sugHighlights.length; i++) {
    if (sugHighlights[i] !== curHighlights[i]) return true;
  }

  return false;
}

/** Checks if two strings differ after trimming. */
function hasTextChanged(current?: string, suggested?: string): boolean {
  return (current ?? '').trim() !== (suggested ?? '').trim();
}

/**
 * Tabbed comparison view for AI suggestions with per-field version toggle.
 * Radio-style selectors let users pick current or suggested for each changed field.
 */
export function AiSuggestionsView({
  suggestions,
  currentData,
  selection,
  onToggleSummary,
  onToggleExperienceField,
  onToggleSkill,
  onRemoveSkill
}: TAiSuggestionsViewProps) {
  const hasSummary = !!suggestions.summary;
  const hasExperience = !!suggestions.experience?.some((exp, idx) =>
    hasExperienceChanged(currentData.experience[idx] ?? {}, exp)
  );
  const suggestedSkillEntries = (suggestions.skills ?? []).map((category) => ({
    name: category.name.trim(),
    values: category.values.map((skill) => skill.trim())
  }));
  const hasSkills = suggestedSkillEntries.some((category) =>
    category.values.some(Boolean)
  );
  const currentSkillEntries = normalizeSkillCategories(currentData.skills);
  const currentSkillsSet = new Set(
    currentSkillEntries.flatMap((category) => category.values).map((s) => s.toLowerCase())
  );
  const currentSkillMap = new Map(
    currentSkillEntries.map((category) => [category.name, category.values])
  );

  const defaultTab = hasSummary
    ? 'summary'
    : hasExperience
      ? 'experience'
      : 'skills';

  return (
    <div className="space-y-4 pb-2">
      <Tabs defaultValue={defaultTab} className="py-4">
        <TabsList>
          {hasSummary && <TabsTrigger value="summary">Summary</TabsTrigger>}
          {hasExperience && (
            <TabsTrigger value="experience">Experience</TabsTrigger>
          )}
          {hasSkills && <TabsTrigger value="skills">Skills</TabsTrigger>}
        </TabsList>

        {hasSummary && (
          <TabsContent value="summary">
            <ComparisonGrid>
              <ComparisonCard title="Current">
                {currentData.personalInfo.summary ? (
                  <VersionField
                    selected={!selection.summary}
                    onSelect={onToggleSummary}
                  >
                    <DiffHighlight
                      current={currentData.personalInfo.summary}
                      suggested={suggestions.summary}
                      view="current"
                      className="text-muted-foreground"
                    />
                  </VersionField>
                ) : (
                  <MutedText>No summary</MutedText>
                )}
              </ComparisonCard>
              <ComparisonCard title="Suggested" suggested>
                <VersionField
                  selected={selection.summary}
                  onSelect={onToggleSummary}
                >
                  <DiffHighlight
                    current={currentData.personalInfo.summary}
                    suggested={suggestions.summary}
                    view="suggested"
                  />
                </VersionField>
              </ComparisonCard>
            </ComparisonGrid>
          </TabsContent>
        )}

        {hasExperience && (
          <TabsContent value="experience">
            <div className="space-y-6">
              {suggestions.experience!.map((exp, idx) => {
                const current = currentData.experience[idx];
                if (!current || !hasExperienceChanged(current, exp))
                  return null;

                const currentHighlights = (current.highlights ?? []).map((h) => h.value);
                const suggestedHighlights = exp.highlights ?? [];
                const { suggestedToCurrent } = buildHighlightMatchMaps(
                  currentHighlights,
                  suggestedHighlights
                );
                const highlightRows = buildHighlightRows(
                  currentHighlights,
                  suggestedHighlights,
                  suggestedToCurrent
                );
                const sel = selection.experience[idx];
                const descChanged = hasTextChanged(current.description, exp.description);

                return (
                  <div key={idx} className="space-y-2">
                    <ExperienceLabel>
                      {current.company}
                      {current.position ? ` — ${current.position}` : ''}
                    </ExperienceLabel>
                    <div className="relative">
                      <div className="border-border/50 pointer-events-none absolute inset-y-0 left-0 w-[calc(50%-0.5rem)] rounded-xl border" />
                      <div className="border-primary/40 pointer-events-none absolute inset-y-0 right-0 w-[calc(50%-0.5rem)] rounded-xl border" />

                      <div className="relative">
                        <div className="grid grid-cols-2 gap-4 px-2 py-2">
                          <div>
                            <p className="text-muted-foreground text-xs font-medium">
                              Current
                            </p>
                            {current.description && (
                              <div className="pt-1">
                                {descChanged && exp.description ? (
                                  <VersionField
                                    selected={!(sel?.description ?? true)}
                                    onSelect={() =>
                                      onToggleExperienceField(idx, 'description')
                                    }
                                  >
                                    <DiffHighlight
                                      current={current.description}
                                      suggested={exp.description}
                                      view="current"
                                      className="text-muted-foreground"
                                    />
                                  </VersionField>
                                ) : (
                                  <MutedText>{current.description}</MutedText>
                                )}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-muted-foreground pl-2 text-xs font-medium">
                              Suggested
                            </p>
                            {exp.description && (
                              <div className="pt-1">
                                {descChanged ? (
                                  <VersionField
                                    className="pl-2"
                                    selected={sel?.description ?? true}
                                    onSelect={() =>
                                      onToggleExperienceField(idx, 'description')
                                    }
                                  >
                                    <DiffHighlight
                                      current={current.description}
                                      suggested={exp.description}
                                      view="suggested"
                                    />
                                  </VersionField>
                                ) : (
                                  <MutedText className="pl-2">{exp.description}</MutedText>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {highlightRows.map((row, rowIdx) => {
                          const hasCurrent = row.currentIdx >= 0;
                          const hasSuggested = row.suggestedIdx >= 0;
                          const highlightChanged =
                            hasCurrent &&
                            hasSuggested &&
                            hasTextChanged(
                              currentHighlights[row.currentIdx],
                              suggestedHighlights[row.suggestedIdx]
                            );
                          const isNewBullet = !hasCurrent && hasSuggested;
                          const checked = sel?.highlights[row.suggestedIdx] ?? true;

                          return (
                            <div
                              key={rowIdx}
                              className="border-border/40 grid grid-cols-2 gap-4 border-t px-2 py-1.5"
                            >
                              <div>
                                {hasCurrent ? (
                                  highlightChanged ? (
                                    <VersionField
                                      selected={!checked}
                                      onSelect={() =>
                                        onToggleExperienceField(
                                          idx,
                                          'highlight',
                                          row.suggestedIdx
                                        )
                                      }
                                    >
                                      <BulletItem className="text-muted-foreground">
                                        <DiffHighlight
                                          current={currentHighlights[row.currentIdx]}
                                          suggested={suggestedHighlights[row.suggestedIdx]}
                                          view="current"
                                          className="text-muted-foreground"
                                        />
                                      </BulletItem>
                                    </VersionField>
                                  ) : (
                                    <BulletItem className="text-muted-foreground">
                                      <DiffHighlight
                                        current={currentHighlights[row.currentIdx]}
                                        suggested={
                                          hasSuggested
                                            ? suggestedHighlights[row.suggestedIdx]
                                            : currentHighlights[row.currentIdx]
                                        }
                                        view="current"
                                        className="text-muted-foreground"
                                      />
                                    </BulletItem>
                                  )
                                ) : (
                                  <span className="opacity-0">.</span>
                                )}
                              </div>
                              <div>
                                {hasSuggested ? (
                                  highlightChanged ? (
                                    <VersionField
                                      className="pl-2"
                                      selected={checked}
                                      onSelect={() =>
                                        onToggleExperienceField(
                                          idx,
                                          'highlight',
                                          row.suggestedIdx
                                        )
                                      }
                                    >
                                      <BulletItem>
                                        <DiffHighlight
                                          current={currentHighlights[row.currentIdx]}
                                          suggested={
                                            suggestedHighlights[row.suggestedIdx]
                                          }
                                          view="suggested"
                                        />
                                      </BulletItem>
                                    </VersionField>
                                  ) : isNewBullet ? (
                                    <SelectableField
                                      className="pl-2"
                                      checked={checked}
                                      onCheckedChange={() =>
                                        onToggleExperienceField(
                                          idx,
                                          'highlight',
                                          row.suggestedIdx
                                        )
                                      }
                                    >
                                      <BulletItem>
                                        <DiffHighlight
                                          current={undefined}
                                          suggested={
                                            suggestedHighlights[row.suggestedIdx]
                                          }
                                          view="suggested"
                                        />
                                      </BulletItem>
                                    </SelectableField>
                                  ) : (
                                    <div className="pl-2">
                                      <BulletItem>
                                        <span className="text-muted-foreground text-xs">
                                          {suggestedHighlights[row.suggestedIdx]}
                                        </span>
                                      </BulletItem>
                                    </div>
                                  )
                                ) : (
                                  <div className="h-6" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>
        )}

        {hasSkills && (
          <TabsContent value="skills">
            <div className="space-y-4">
              {suggestedSkillEntries.map((category, categoryIdx) => {
                const currentSkills = currentSkillMap.get(category.name) ?? [];
                const suggestedRowsBase = category.values
                  .map((value, suggestedIdx) => ({ value, suggestedIdx }))
                  .filter((item) => item.value);
                const rows = buildSkillRows(currentSkills, suggestedRowsBase);
                if (!rows.length) return null;

                return (
                  <SkillCategorySection key={`${category.name}-${categoryIdx}`}>
                    <SkillCategoryTitle>{category.name}</SkillCategoryTitle>
                    <div className="relative">
                      <div className="border-border/50 pointer-events-none absolute inset-y-0 left-0 w-[calc(50%-0.5rem)] rounded-xl border" />
                      <div className="border-primary/40 pointer-events-none absolute inset-y-0 right-0 w-[calc(50%-0.5rem)] rounded-xl border" />
                      <div className="relative">
                        <div className="grid grid-cols-2 gap-4 px-2 py-2">
                          <p className="text-muted-foreground text-xs font-medium">
                            Current
                          </p>
                          <p className="text-muted-foreground pl-2 text-xs font-medium">
                            Suggested
                          </p>
                        </div>
                        <SkillRows>
                          {rows.map((row, rowIdx) => {
                            const isNew =
                              row.suggestedIdx >= 0 &&
                              !currentSkillsSet.has(
                                category.values[row.suggestedIdx].toLowerCase()
                              );
                            const checked =
                              selection.skills[categoryIdx]?.selected[row.suggestedIdx] ??
                              true;

                            return (
                              <SkillRow key={`${category.name}-row-${rowIdx}`}>
                                <div>
                                  {row.currentIdx >= 0 ? (
                                    <Badge
                                      variant="outline"
                                      className="justify-start px-2 py-1 text-left"
                                    >
                                      {currentSkills[row.currentIdx]}
                                    </Badge>
                                  ) : (
                                    <div className="h-6" />
                                  )}
                                </div>
                                <div>
                                  {row.suggestedIdx >= 0 ? (
                                    isNew ? (
                                      <SelectableField
                                        className="pl-2"
                                        checked={checked}
                                        onCheckedChange={() =>
                                          onToggleSkill(categoryIdx, row.suggestedIdx)
                                        }
                                      >
                                        <NewSkillBadge
                                          isNew
                                          className="inline-flex max-w-full justify-start px-2 py-1 text-left text-xs"
                                        >
                                          {category.values[row.suggestedIdx]}
                                        </NewSkillBadge>
                                      </SelectableField>
                                    ) : (
                                      <div className="pl-2">
                                        <Badge
                                          variant="outline"
                                          className="justify-start px-2 py-1 text-left"
                                        >
                                          {category.values[row.suggestedIdx]}
                                        </Badge>
                                      </div>
                                    )
                                  ) : (
                                    <div className="h-6" />
                                  )}
                                </div>
                              </SkillRow>
                            );
                          })}
                        </SkillRows>
                      </div>
                    </div>
                  </SkillCategorySection>
                );
              })}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
