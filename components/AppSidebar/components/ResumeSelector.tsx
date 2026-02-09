'use client';

import { useState, useMemo, useCallback } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { CreateResumeRow } from './ui/create-resume-row';
import { useGetUserResumeTitles } from '@/hooks/useGetUserResumeTitles';
import type { TResumeInfo } from '@/types/schema';
import { NavSelector } from './nav-selector';
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

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const { data: resumeTitles, isLoading: isLoadingTitles } =
    useGetUserResumeTitles();

  const handleConfirmCreate = useCallback(() => {
    const trimmed = newTitle.trim();
    if (trimmed) {
      onCreateNew(trimmed);
      setIsCreating(false);
      setNewTitle('');
    }
  }, [newTitle, onCreateNew]);

  const handleCancelCreate = useCallback(() => {
    setNewTitle('');
    setIsCreating(false);
  }, []);

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

  const options: NavSelectorOption[] = useMemo(
    () => resumeTitles?.map((r) => ({ id: r.id, label: r.title })) ?? [],
    [resumeTitles]
  );

  const createNewHeader = isCreating ? (
    <CreateResumeRow>
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
    </CreateResumeRow>
  ) : (
    <DropdownMenuItem
      onClick={() => setIsCreating(true)}
      onSelect={(e) => e.preventDefault()}
    >
      <Plus className="mr-2 size-4" />
      Create New Resume
    </DropdownMenuItem>
  );

  return (
    <NavSelector
      name="resume"
      value={currentId}
      displayValue={currentTitle || 'New Resume'}
      onChange={onResumeSelect}
      options={options}
      disabled={isLoadingTitles}
      dropdownHeader={createNewHeader}
    />
  );
}
