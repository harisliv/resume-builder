import { resumeInfoSchema } from '@/types/schema';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeForm } from '@/types/schema';
import type {
  TAccumulatedEdits,
  TPlacementResult,
  TPlacementTarget
} from '@/types/aiKeywords';

export const MATCH_JOB_TABS = ['Personal Info', 'Skills', 'Experience'] as const;
export type TMatchJobTab = (typeof MATCH_JOB_TABS)[number];

/** Parses an optional resume id into the Convex-generated id type. */
export function getResumeId(value?: string) {
  const parsed = resumeInfoSchema.shape.id.safeParse(value);
  return parsed.success ? parsed.data : undefined;
}

/** Creates a stable client-side id for a review item. */
export function createReviewId() {
  return crypto.randomUUID();
}

/** Builds a stable key for a highlight edit. */
export function getHighlightKey(experienceId: string, highlightId: string) {
  return `${experienceId}:${highlightId}`;
}

/** Builds a stable key for a skill addition. */
export function getSkillKey(categoryId: string, value: string) {
  return `${categoryId}:${value}`;
}

/** Builds a deterministic id for a new skill category target. */
export function getNewSkillCategoryId(categoryName: string) {
  return `new-skill-category:${categoryName.trim().toLowerCase()}`;
}

/** Picks the most relevant tab for the current selected targets. */
export function getTargetTab(selectedTargets: TPlacementTarget[]): TMatchJobTab {
  if (selectedTargets.some((target) => target.type === 'highlight')) {
    return 'Experience';
  }

  if (selectedTargets.some((target) => target.type === 'skill')) {
    return 'Skills';
  }

  return 'Personal Info';
}

/** Maps selected targets to the payload expected by placement action. */
export function getPlacementTargets(targets: TPlacementTarget[]) {
  return targets.map((target) => {
    if (target.type === 'skill') {
      return {
        type: 'skill' as const,
        categoryId: target.categoryId,
        categoryName: target.categoryName
      };
    }

    return {
      type: 'highlight' as const,
      experienceId: target.experienceId,
      highlightId: target.highlightId,
      currentText: target.currentText
    };
  });
}

/** Applies accepted placement results to a working resume preview. */
export function applyPlacementResultToResume(
  resume: TResumeForm,
  highlightEdits: TPlacementResult['updatedHighlights'],
  skillAdditions: TPlacementResult['addedSkills']
) {
  const highlightMap = new Map(
    highlightEdits.map((edit) => [getHighlightKey(edit.experienceId, edit.highlightId), edit])
  );
  const skillsByCategory = new Map<string, TPlacementResult['addedSkills']>();

  skillAdditions.forEach((addition) => {
    const existing = skillsByCategory.get(addition.categoryId) ?? [];
    existing.push(addition);
    skillsByCategory.set(addition.categoryId, existing);
  });

  const existingCategoryIds = new Set(resume.skills.map((category) => category.id));
  const newCategories = Array.from(skillsByCategory.entries())
    .filter(([categoryId]) => !existingCategoryIds.has(categoryId))
    .map(([categoryId, additions]) => ({
      id: categoryId,
      name: additions[0]?.categoryName ?? 'New Category',
      values: additions.map((addition) => ({
        id: crypto.randomUUID(),
        value: addition.value
      }))
    }));

  return {
    ...resume,
    experience: resume.experience.map((experience) => ({
      ...experience,
      highlights: (experience.highlights ?? []).map((highlight) => {
        const edit = highlightMap.get(getHighlightKey(experience.id, highlight.id));
        return edit ? { ...highlight, value: edit.newText } : highlight;
      })
    })),
    skills: resume.skills.map((category) => ({
      ...category,
      values: [
        ...category.values,
        ...(skillsByCategory.get(category.id) ?? []).map((addition) => ({
          id: crypto.randomUUID(),
          value: addition.value
        }))
      ]
    })).concat(newCategories)
  };
}

/** Collapses accepted highlight edits to the latest edit per highlight. */
export function getLatestAcceptedHighlightEdits(
  highlightEdits: TAccumulatedEdits['highlightEdits'],
  acceptedHighlights: Set<string>
) {
  const latestByHighlight = new Map<string, TAccumulatedEdits['highlightEdits'][number]>();

  highlightEdits.forEach((edit) => {
    if (!acceptedHighlights.has(edit.reviewId)) return;
    latestByHighlight.set(getHighlightKey(edit.experienceId, edit.highlightId), edit);
  });

  return Array.from(latestByHighlight.values()).map((edit) => ({
    experienceId: edit.experienceId,
    highlightId: edit.highlightId,
    newText: edit.newText
  }));
}

/** Dedupes accepted skill additions before apply. */
export function getAcceptedSkillAdditions(
  skillAdditions: TAccumulatedEdits['skillAdditions'],
  acceptedSkills: Set<string>
) {
  const uniqueSkills = new Map<string, TAccumulatedEdits['skillAdditions'][number]>();

  skillAdditions.forEach((addition) => {
    if (!acceptedSkills.has(addition.reviewId)) return;
    uniqueSkills.set(getSkillKey(addition.categoryId, addition.value), addition);
  });

  return Array.from(uniqueSkills.values()).map((addition) => ({
    categoryId: addition.categoryId,
    categoryName: addition.categoryName,
    value: addition.value
  }));
}
