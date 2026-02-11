'use client';

import type { TAiSuggestions } from '@/types/aiSuggestions';
import type { TResumeForm } from '@/types/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ComparisonCard,
  ComparisonGrid,
  HighlightedText,
  MutedText,
  ExperienceLabel,
  BulletList,
  BulletItem,
  BadgeGroup,
  NewSkillBadge
} from './styles/ai-suggestions-view.styles';

function isChanged(current: string | undefined, suggested: string | undefined) {
  return (
    suggested !== undefined &&
    suggested !== current &&
    suggested !== (current ?? '')
  );
}

type TAiSuggestionsViewProps = {
  suggestions: TAiSuggestions;
  currentData: TResumeForm;
};

export function AiSuggestionsView({
  suggestions,
  currentData
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
    <ScrollArea className="h-full min-h-0">
      <div className="pr-2 pb-2">
        <Tabs defaultValue={defaultTab}>
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
                  <HighlightedText
                    changed={isChanged(
                      currentData.personalInfo.summary,
                      suggestions.summary
                    )}
                  >
                    {suggestions.summary}
                  </HighlightedText>
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
                                <BulletItem key={i} className="text-muted-foreground">
                                  {h}
                                </BulletItem>
                              ))}
                            </BulletList>
                          )}
                        </ComparisonCard>
                        <ComparisonCard title="Suggested" suggested>
                          <HighlightedText
                            changed={isChanged(
                              current.description,
                              exp.description
                            )}
                          >
                            {exp.description}
                          </HighlightedText>
                          {exp.highlights && exp.highlights.length > 0 && (
                            <BulletList>
                              {exp.highlights.map((h, i) => (
                                <BulletItem
                                  key={i}
                                  changed={!currentHighlightsSet.has(h)}
                                >
                                  {h}
                                </BulletItem>
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
                    {suggestions.skills!.map((s) => (
                      <NewSkillBadge
                        key={s}
                        isNew={!currentSkillsSet.has(s.toLowerCase())}
                      >
                        {s}
                      </NewSkillBadge>
                    ))}
                  </BadgeGroup>
                </ComparisonCard>
              </ComparisonGrid>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </ScrollArea>
  );
}
