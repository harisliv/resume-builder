'use client';

import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import type { TResumeInfo } from '@/types/schema';
import { NavSelector } from './NavSelector';
import { ResumeSelectorHeader } from './ResumeSelectorHeader';
import type { NavSelectorOption } from '../types';

export function ResumeSelector({
  onResumeSelect,
  onCreateNew
}: {
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
}) {
  const { control } = useFormContext<TResumeInfo>();
  const currentId = useWatch({ control, name: 'id' }) ?? '';
  const currentTitle = useWatch({ control, name: 'title' });

  const { data: resumeTitles, isLoading: isLoadingTitles } =
    useGetUserResumeTitles();

  const options: NavSelectorOption[] = useMemo(
    () => resumeTitles?.map((r) => ({ id: r.id, label: r.title })) ?? [],
    [resumeTitles]
  );

  const dropdownHeader = <ResumeSelectorHeader onCreateNew={onCreateNew} />;

  return (
    <NavSelector
      name="resume"
      value={currentId}
      displayValue={currentTitle || 'New Resume'}
      onChange={onResumeSelect}
      options={options}
      disabled={isLoadingTitles}
      dropdownHeader={dropdownHeader}
    />
  );
}
