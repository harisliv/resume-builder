/**
 * @file Company.tsx
 * @description Company selector with popover dropdown.
 * Shows existing companies with inline rename/delete, plus "Add New" input.
 * Styled as a form field (matches month-year-picker aesthetic).
 */
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Field, FieldLabel } from '@/components/ui/field';
import type { TResumeForm } from '@/types/schema';
import { CompanyCreateRow } from './CompanyCreateRow';
import { CompanyOptionRow } from './CompanyOptionRow';

/** Company popover selector with create/edit/delete. */
export default function Company({ index }: { index: number }) {
  const { watch, setValue, register } = useFormContext<TResumeForm>();
  const experience = watch('experience');
  const currentCompany = experience?.[index]?.company ?? '';
  const [open, setOpen] = useState(false);

  /** All unique non-empty company names across experience entries. */
  const companyOptions = useMemo(() => {
    const names = (experience ?? [])
      .map((exp) => exp.company?.trim())
      .filter(Boolean) as string[];
    return [...new Set(names)];
  }, [experience]);

  /** Select existing company for current entry. */
  const handleSelect = useCallback(
    (name: string) => {
      setValue(`experience.${index}.company`, name);
      setOpen(false);
    },
    [setValue, index]
  );

  /** Create new company and set on current entry. */
  const handleCreate = useCallback(
    (name: string) => {
      setValue(`experience.${index}.company`, name);
      setOpen(false);
    },
    [setValue, index]
  );

  /** Rename company across all experience entries that use it. */
  const handleRename = useCallback(
    (oldName: string, newName: string) => {
      if (!experience) return;
      const updated = experience.map((exp) =>
        exp.company?.trim() === oldName ? { ...exp, company: newName } : exp
      );
      setValue('experience', updated);
    },
    [experience, setValue]
  );

  /** Clear company from all experience entries that use it. */
  const handleDelete = useCallback(
    (name: string) => {
      if (!experience) return;
      const updated = experience.map((exp) =>
        exp.company?.trim() === name ? { ...exp, company: '' } : exp
      );
      setValue('experience', updated);
    },
    [experience, setValue]
  );

  return (
    <Field>
      <input type="hidden" {...register(`experience.${index}.company`)} />
      <FieldLabel>Company</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn(
              'w-full justify-start border font-normal',
              !currentCompany && 'text-muted-foreground'
            )}
          >
            <Building2 className="mr-2 size-4 shrink-0" />
            <span className="truncate">{currentCompany || 'Select company'}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" align="start">
          <CompanyCreateRow onCreate={handleCreate} />
          {companyOptions.length > 0 && (
            <>
              <Separator className="my-1.5" />
              <div className="space-y-0.5">
                {companyOptions.map((name) => (
                  <CompanyOptionRow
                    key={name}
                    name={name}
                    selected={name === currentCompany}
                    onSelect={() => handleSelect(name)}
                    onRename={(newName) => handleRename(name, newName)}
                    onDelete={() => handleDelete(name)}
                  />
                ))}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>
    </Field>
  );
}
