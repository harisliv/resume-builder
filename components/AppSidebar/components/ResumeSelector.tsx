'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import { useRenameResume } from '@/hooks/useRenameResume';
import { useSetDefaultResume } from '@/hooks/useSetDefaultResume';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import usePrivileges from '@/hooks/usePrivileges';
import type { Id } from '@/convex/_generated/dataModel';
import type { TResumeInfo } from '@/types/schema';
import { NavSelector } from './NavSelector';
import { ResumeOptionActions } from './ResumeOptionActions';
import type { NavSelectorOption } from '../types';

type TProps = {
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
  onDelete: (id: string) => void;
  /** When true, opens the dropdown in create mode. */
  isCreating: boolean;
  onCreatingChange: (creating: boolean) => void;
};

/** Resume dropdown with inline rename/delete per option. */
export function ResumeSelector({
  onResumeSelect,
  onCreateNew,
  onDelete,
  isCreating,
  onCreatingChange
}: TProps) {
  const { control, setValue } = useFormContext<TResumeInfo>();
  const currentId = useWatch({ control, name: 'id' }) ?? '';
  const currentTitle = useWatch({ control, name: 'title' });

  const { data: resumeTitles, isLoading: isLoadingTitles } =
    useGetUserResumeTitles() as {
      data: { id: string; title: string; isDefault?: boolean; isAiImproved?: boolean }[] | undefined;
      isLoading: boolean;
    };

  const { isMember, resumeLimit } = usePrivileges();
  const { mutate: renameResume } = useRenameResume();
  const { mutate: setDefaultResume } = useSetDefaultResume();
  const confirm = useWarningDialog();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const isDropdownOpen = isCreating || dropdownOpen;

  /** Reset create state when dropdown closes. */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setDropdownOpen(open);
      if (!open) {
        onCreatingChange(false);
        setNewTitle('');
      }
    },
    [onCreatingChange]
  );

  const handleConfirmCreate = useCallback(() => {
    const trimmed = newTitle.trim();
    if (trimmed) {
      onCreateNew(trimmed);
      onCreatingChange(false);
      setDropdownOpen(false);
      setNewTitle('');
    }
  }, [newTitle, onCreateNew, onCreatingChange]);

  const handleCancelCreate = useCallback(() => {
    onCreatingChange(false);
    setDropdownOpen(false);
    setNewTitle('');
  }, [onCreatingChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirmCreate();
      } else if (e.key === 'Escape') {
        handleCancelCreate();
      }
    },
    [handleConfirmCreate, handleCancelCreate]
  );

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

  const resumeCount = resumeTitles?.length ?? 0;
  const countSuffix = isFinite(resumeLimit)
    ? `${resumeCount}/${resumeLimit}`
    : undefined;

  const options: NavSelectorOption[] = useMemo(
    () =>
      resumeTitles?.map((r) => ({
        id: r.id,
        label: r.title,
        isDefault: r.isDefault,
        isAiImproved: r.isAiImproved
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

  /** Inline input shown at the top of the dropdown when creating. */
  const dropdownHeader = isCreating ? (
    <div className="flex items-center gap-2 p-2">
      <Input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Resume title..."
        className="h-8"
        autoFocus
      />
      <Button
        size="icon"
        variant="ghost"
        className="size-8 shrink-0"
        onClick={handleConfirmCreate}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <Check className="size-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8 shrink-0"
        onClick={handleCancelCreate}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <X className="size-4" />
      </Button>
    </div>
  ) : undefined;

  return (
    <NavSelector
      name="resume"
      value={currentId}
      displayValue={currentTitle || 'New Resume'}
      onChange={onResumeSelect}
      options={options}
      loading={isLoadingTitles}
      labelSuffix={countSuffix}
      disabled={isLoadingTitles || isMember}
      disabledTooltip={
        isMember ? 'Upgrade your plan to manage multiple resumes.' : undefined
      }
      open={isDropdownOpen}
      onOpenChange={handleOpenChange}
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
