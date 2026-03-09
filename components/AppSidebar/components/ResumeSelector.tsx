'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useRenameResume } from '@/hooks/useRenameResume';
import { useSetDefaultResume } from '@/hooks/useSetDefaultResume';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import usePrivileges from '@/hooks/usePrivileges';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeInfo } from '@/types/schema';
import { NavSelector } from './NavSelector';
import { ResumeSelectorHeader } from './ResumeSelectorHeader';
import { ResumeOptionActions } from './ResumeOptionActions';
import type { NavSelectorOption } from '../types';

type Props = {
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
  onDelete: (id: string) => void;
};

/** Resume dropdown with inline rename/delete per option. */
export function ResumeSelector({
  onResumeSelect,
  onCreateNew,
  onDelete
}: Props) {
  const { control, setValue } = useFormContext<TResumeInfo>();
  const currentId = useWatch({ control, name: 'id' }) ?? '';
  const currentTitle = useWatch({ control, name: 'title' });

  const { data: resumeTitles, isLoading: isLoadingTitles } =
    useGetUserResumeTitles();

  const { isMember } = usePrivileges();
  const { mutate: renameResume } = useRenameResume();
  const { mutate: setDefaultResume } = useSetDefaultResume();
  const confirm = useWarningDialog();

  /** Auto-select default resume when titles load and nothing is selected. */
  useEffect(() => {
    if (currentId || !resumeTitles?.length) return;
    const defaultResume = resumeTitles.find((r) => r.isDefault);
    if (defaultResume) onResumeSelect(defaultResume.id);
  }, [resumeTitles, currentId, onResumeSelect]);

  /** Set a resume as default, with confirmation if one already exists. */
  const handleSetDefault = useCallback(
    async (id: string) => {
      const hasExistingDefault =
        resumeTitles?.some((r) => r.isDefault) ?? false;
      if (hasExistingDefault) {
        const ok = await confirm({
          title: 'Change default resume?',
          description: 'This will replace your current default resume.',
          confirmLabel: 'Replace'
        });
        if (!ok) return;
      }
      setDefaultResume(id as Id<'resumes'>);
    },
    [resumeTitles, confirm, setDefaultResume]
  );

  const options: NavSelectorOption[] = useMemo(
    () =>
      resumeTitles?.map((r) => ({
        id: r.id,
        label: r.title,
        isDefault: r.isDefault
      })) ?? [],
    [resumeTitles]
  );

  const handleRename = useCallback(
    (id: string, title: string) => {
      renameResume({ id: id as Id<'resumes'>, title });
      if (id === currentId) {
        setValue('title', title);
      }
    },
    [renameResume, currentId, setValue]
  );

  /** Render function: wraps onCreateNew to also close the dropdown. */
  const dropdownHeader = useCallback(
    (close: () => void) => (
      <ResumeSelectorHeader
        onCreateNew={(title) => {
          onCreateNew(title);
          close();
        }}
      />
    ),
    [onCreateNew]
  );

  return (
    <NavSelector
      name="resume"
      value={currentId}
      displayValue={currentTitle || 'New Resume'}
      onChange={onResumeSelect}
      options={options}
      loading={isLoadingTitles}
      disabled={isLoadingTitles || isMember}
      disabledTooltip={
        isMember ? 'Upgrade your plan to manage multiple resumes.' : undefined
      }
      dropdownHeader={dropdownHeader}
      renderOptionContent={(option, defaultContent) => (
        <ResumeOptionActions
          option={option}
          defaultContent={defaultContent}
          onRename={handleRename}
          onDelete={onDelete}
          onSetDefault={handleSetDefault}
        />
      )}
    />
  );
}
