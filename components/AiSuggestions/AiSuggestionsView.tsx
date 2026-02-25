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
  BadgeGroup,
  RemovableSkillBadge,
  SelectableField
} from './styles/ai-suggestions-view.styles';
import { DiffHighlight } from './utils/diffHighlight';

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
  onRemoveSkill: (skillIdx: number) => void;
};

/**
 * Scores rough word overlap similarity between two highlight strings.
 * Returns 0..1, where 1 means identical word set.
 */
function getWordOverlapScore(a: string, b: string): number {
  const tokenize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

  const wordsA = tokenize(a);
  const wordsB = tokenize(b);
  if (!wordsA.length && !wordsB.length) return 1;
  if (!wordsA.length || !wordsB.length) return 0;

  const setA = new Set(wordsA);
  const setB = new Set(wordsB);
  let intersection = 0;
  setA.forEach((word) => {
    if (setB.has(word)) intersection += 1;
  });

  const denominator = Math.max(setA.size, setB.size);
  return denominator === 0 ? 0 : intersection / denominator;
}

/**
 * Builds one-to-one match maps between current and suggested highlights.
 * Prevents one current bullet from being diffed against many suggested bullets.
 */
function buildHighlightMatchMaps(current: string[], suggested: string[]) {
  const suggestedToCurrent = new Array<number>(suggested.length).fill(-1);
  const currentToSuggested = new Array<number>(current.length).fill(-1);
  const usedCurrent = new Set<number>();

  suggested.forEach((suggestedHighlight, suggestedIdx) => {
    let bestCurrentIdx = -1;
    let bestScore = 0;

    current.forEach((currentHighlight, currentIdx) => {
      if (usedCurrent.has(currentIdx)) return;
      const score = getWordOverlapScore(currentHighlight, suggestedHighlight);
      if (score > bestScore) {
        bestScore = score;
        bestCurrentIdx = currentIdx;
      }
    });

    if (bestCurrentIdx >= 0 && bestScore > 0) {
      suggestedToCurrent[suggestedIdx] = bestCurrentIdx;
      currentToSuggested[bestCurrentIdx] = suggestedIdx;
      usedCurrent.add(bestCurrentIdx);
    }
  });

  return { suggestedToCurrent, currentToSuggested };
}

type THighlightRow = {
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

/**
 * Tabbed comparison view for AI suggestions with per-field selection
 * and removable skill badges.
 */
export function AiSuggestionsView({
  suggestions,
  currentData,
  selection,
  onToggleSummary,
  onToggleExperienceField,
  onRemoveSkill
}: TAiSuggestionsViewProps) {
  const hasSummary = !!suggestions.summary;
  const hasExperience = !!suggestions.experience?.length;
  const hasSkills = !!suggestions.skills?.length;

  const currentSkillsSet = new Set(
    currentData.skills.map((s) => s.toLowerCase())
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
                  <DiffHighlight
                    current={currentData.personalInfo.summary}
                    suggested={suggestions.summary}
                    view="current"
                    className="text-muted-foreground"
                  />
                ) : (
                  <MutedText>No summary</MutedText>
                )}
              </ComparisonCard>
              <ComparisonCard title="Suggested" suggested>
                <SelectableField
                  checked={selection.summary}
                  onCheckedChange={onToggleSummary}
                >
                  <DiffHighlight
                    current={currentData.personalInfo.summary}
                    suggested={suggestions.summary}
                    view="suggested"
                  />
                </SelectableField>
              </ComparisonCard>
            </ComparisonGrid>
          </TabsContent>
        )}

        {hasExperience && (
          <TabsContent value="experience">
            <div className="space-y-6">
              {suggestions.experience!.map((exp, idx) => {
                const current = currentData.experience[idx];
                if (!current || (!exp.description && !exp.highlights?.length))
                  return null;

                const currentHighlights = current.highlights ?? [];
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
                                {exp.description ? (
                                  <DiffHighlight
                                    current={current.description}
                                    suggested={exp.description}
                                    view="current"
                                    className="text-muted-foreground"
                                  />
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
                                <SelectableField
                                  className="pl-2"
                                  checked={sel?.description ?? true}
                                  onCheckedChange={() =>
                                    onToggleExperienceField(idx, 'description')
                                  }
                                >
                                  <DiffHighlight
                                    current={current.description}
                                    suggested={exp.description}
                                    view="suggested"
                                  />
                                </SelectableField>
                              </div>
                            )}
                          </div>
                        </div>

                        {highlightRows.map((row, rowIdx) => (
                          <div
                            key={rowIdx}
                            className="border-border/40 grid grid-cols-2 gap-4 border-t px-2 py-1.5"
                          >
                            <div>
                              <BulletItem className="text-muted-foreground">
                                {row.currentIdx >= 0 ? (
                                  <DiffHighlight
                                    current={currentHighlights[row.currentIdx]}
                                    suggested={
                                      row.suggestedIdx >= 0
                                        ? suggestedHighlights[row.suggestedIdx]
                                        : currentHighlights[row.currentIdx]
                                    }
                                    view="current"
                                    className="text-muted-foreground"
                                  />
                                ) : (
                                  <span className="opacity-0">.</span>
                                )}
                              </BulletItem>
                            </div>
                            <div>
                              {row.suggestedIdx >= 0 ? (
                                <SelectableField
                                  className="pl-2"
                                  checked={
                                    sel?.highlights[row.suggestedIdx] ?? true
                                  }
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
                                      current={
                                        row.currentIdx >= 0
                                          ? currentHighlights[row.currentIdx]
                                          : undefined
                                      }
                                      suggested={
                                        suggestedHighlights[row.suggestedIdx]
                                      }
                                      view="suggested"
                                    />
                                  </BulletItem>
                                </SelectableField>
                              ) : (
                                <div className="h-6" />
                              )}
                            </div>
                          </div>
                        ))}
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
            <ComparisonGrid>
              <ComparisonCard title="Current">
                <BadgeGroup>
                  {currentData.skills.length ? (
                    currentData.skills.map((s) => (
                      <Badge key={s} variant="outline">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <MutedText>No skills</MutedText>
                  )}
                </BadgeGroup>
              </ComparisonCard>
              <ComparisonCard title="Suggested" suggested>
                <BadgeGroup>
                  {suggestions.skills!.map((s, i) => (
                    <RemovableSkillBadge
                      key={s}
                      isNew={!currentSkillsSet.has(s.toLowerCase())}
                      onRemove={() => onRemoveSkill(i)}
                    >
                      {s}
                    </RemovableSkillBadge>
                  ))}
                </BadgeGroup>
              </ComparisonCard>
            </ComparisonGrid>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
