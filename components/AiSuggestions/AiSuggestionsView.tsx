'use client';

import type { TAiSuggestions, TSuggestionSelection } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  ComparisonCard,
  ComparisonGrid,
  MutedText,
  ExperienceLabel,
  BulletList,
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
                <MutedText>
                  {currentData.personalInfo.summary || 'No summary'}
                </MutedText>
              </ComparisonCard>
              <ComparisonCard title="Suggested" suggested>
                <SelectableField
                  checked={selection.summary}
                  onCheckedChange={onToggleSummary}
                >
                  <DiffHighlight
                    current={currentData.personalInfo.summary}
                    suggested={suggestions.summary}
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
                const currentHighlightsSet = new Set(currentHighlights);
                const sel = selection.experience[idx];

                return (
                  <div key={idx} className="space-y-2">
                    <ExperienceLabel>
                      {current.company}
                      {current.position ? ` — ${current.position}` : ''}
                    </ExperienceLabel>
                    <ComparisonGrid>
                      <ComparisonCard title="Current">
                        {current.description && (
                          <MutedText>{current.description}</MutedText>
                        )}
                        {currentHighlights.length > 0 && (
                          <BulletList>
                            {currentHighlights.map((h, i) => (
                              <BulletItem
                                key={i}
                                className="text-muted-foreground"
                              >
                                {h}
                              </BulletItem>
                            ))}
                          </BulletList>
                        )}
                      </ComparisonCard>
                      <ComparisonCard title="Suggested" suggested>
                        {exp.description && (
                          <SelectableField
                            checked={sel?.description ?? true}
                            onCheckedChange={() =>
                              onToggleExperienceField(idx, 'description')
                            }
                          >
                            <DiffHighlight
                              current={current.description}
                              suggested={exp.description}
                            />
                          </SelectableField>
                        )}
                        {exp.highlights && exp.highlights.length > 0 && (
                          <BulletList>
                            {exp.highlights.map((h, i) => (
                              <SelectableField
                                key={i}
                                checked={sel?.highlights[i] ?? true}
                                onCheckedChange={() =>
                                  onToggleExperienceField(idx, 'highlight', i)
                                }
                              >
                                <BulletItem changed={!currentHighlightsSet.has(h)}>
                                  {h}
                                </BulletItem>
                              </SelectableField>
                            ))}
                          </BulletList>
                        )}
                      </ComparisonCard>
                    </ComparisonGrid>
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
