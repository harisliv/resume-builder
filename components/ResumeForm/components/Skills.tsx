import { useFormContext } from 'react-hook-form';
import type { TResumeForm } from '@/types/schema';
import SectionTitle from './SectionTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { PlusSignIcon, Delete01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  StyledAccordion,
  StyledAccordionItem,
  StyledAccordionTrigger,
  StyledAccordionContent
} from './UI/section-accordion';

/** Returns next available default category label. */
function getNextCategoryName(skills: TResumeForm['skills']) {
  let i = 1;
  while (skills[`New Category ${i}`]) i += 1;
  return `New Category ${i}`;
}

/** Returns category with trimmed values and empty skills removed. */
function sanitizeCategory(skills: string[]) {
  return skills.map((skill) => skill.trim()).filter(Boolean);
}

export default function Skills() {
  const { watch, setValue } = useFormContext<TResumeForm>();
  const confirm = useWarningDialog();
  const skills = watch('skills') ?? {};
  const entries = Object.entries(skills);

  const updateSkills = (next: TResumeForm['skills']) => {
    setValue('skills', next, { shouldDirty: true, shouldTouch: true });
  };

  const addCategory = () => {
    updateSkills({
      ...skills,
      [getNextCategoryName(skills)]: ['']
    });
  };

  const removeCategory = (category: string) => {
    const next = { ...skills };
    delete next[category];
    updateSkills(next);
  };

  const renameCategory = (previous: string, nextCategory: string) => {
    const trimmed = nextCategory.trim();
    if (!trimmed || trimmed === previous) return;
    const next = { ...skills };
    const previousSkills = next[previous] ?? [];
    const existingTargetSkills = next[trimmed] ?? [];
    next[trimmed] = [...existingTargetSkills, ...previousSkills];
    delete next[previous];
    updateSkills(next);
  };

  const addSkill = (category: string) => {
    updateSkills({
      ...skills,
      [category]: [...(skills[category] ?? []), '']
    });
  };

  const updateSkill = (category: string, index: number, value: string) => {
    const next = { ...skills };
    const nextCategory = [...(next[category] ?? [])];
    nextCategory[index] = value;
    next[category] = nextCategory;
    updateSkills(next);
  };

  const removeSkill = (category: string, index: number) => {
    const next = { ...skills };
    const nextCategory = [...(next[category] ?? [])].filter(
      (_, i) => i !== index
    );
    const sanitized = sanitizeCategory(nextCategory);
    if (sanitized.length === 0) {
      delete next[category];
    } else {
      next[category] = sanitized;
    }
    updateSkills(next);
  };

  /** Confirms before deleting an entire category block. */
  const confirmRemoveCategory = async (category: string) => {
    const ok = await confirm({
      title: 'Delete category?',
      description: `This will remove "${category}" and all skills in it.`,
      confirmLabel: 'Delete category',
      variant: 'destructive'
    });
    if (!ok) return;
    removeCategory(category);
  };

  /** Confirms before deleting a single skill row. */
  const confirmRemoveSkill = async (category: string, index: number) => {
    const skillLabel = (skills[category]?.[index] ?? '').trim();
    const ok = await confirm({
      title: 'Delete skill?',
      description: skillLabel
        ? `This will remove "${skillLabel}" from "${category}".`
        : `This will remove this skill from "${category}".`,
      confirmLabel: 'Delete skill',
      variant: 'destructive'
    });
    if (!ok) return;
    removeSkill(category, index);
  };

  return (
    <div className="space-y-6">
      <div className="mb-4 flex items-center justify-between">
        <SectionTitle>Skills</SectionTitle>
        <Button type="button" onClick={addCategory}>
          <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Add a category like Languages, AI Tools, or Soft Skills.
        </p>
      ) : (
        <StyledAccordion
          defaultValue={entries.length ? ['skill-category-0'] : []}
        >
          {entries.map(([category, categorySkills], index) => (
            <StyledAccordionItem
              key={category}
              value={`skill-category-${index}`}
            >
              <StyledAccordionTrigger
                label={category || `Category ${index + 1}`}
                onDelete={() => confirmRemoveCategory(category)}
              />
              <StyledAccordionContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Category
                    </p>
                    <Input
                      className="h-11 border-dashed text-base font-semibold"
                      defaultValue={category}
                      onBlur={(e) => renameCategory(category, e.target.value)}
                      placeholder="e.g. Programming Languages"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      Skills
                    </p>
                    {categorySkills.map((skill, skillIndex) => (
                      <div
                        key={`${category}-${skillIndex}`}
                        className="flex items-center gap-2"
                      >
                        <Input
                          className="h-11 border-dashed text-base"
                          value={skill}
                          onChange={(e) =>
                            updateSkill(
                              category,
                              skillIndex,
                              e.target.value
                            )
                          }
                          placeholder="e.g. React"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            confirmRemoveSkill(category, skillIndex)
                          }
                        >
                          <HugeiconsIcon
                            icon={Delete01Icon}
                            className="h-4 w-4"
                          />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addSkill(category)}
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="mr-2 h-4 w-4" />
                    Add Skill
                  </Button>
                </div>
              </StyledAccordionContent>
            </StyledAccordionItem>
          ))}
        </StyledAccordion>
      )}
    </div>
  );
}
