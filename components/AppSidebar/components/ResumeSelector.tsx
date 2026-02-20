'use client';

import { useCallback, useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useRenameResume } from '@/hooks/useRenameResume';
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

  const { isLoggedIn, isBasic } = usePrivileges();
  const { mutate: renameResume } = useRenameResume();

  const options: NavSelectorOption[] = useMemo(
    () => resumeTitles?.map((r) => ({ id: r.id, label: r.title })) ?? [],
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
      disabled={isLoadingTitles || !isLoggedIn || !isBasic}
      dropdownHeader={dropdownHeader}
      renderOptionContent={(option, defaultContent) => (
        <ResumeOptionActions
          option={option}
          defaultContent={defaultContent}
          onRename={handleRename}
          onDelete={onDelete}
        />
      )}
    />
  );
}
