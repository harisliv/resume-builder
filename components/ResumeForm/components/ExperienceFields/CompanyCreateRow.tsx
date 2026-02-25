/**
 * @file CompanyCreateRow.tsx
 * @description "Add New Company" inline input row for the company popover.
 * Mirrors ResumeSelectorHeader pattern.
 */
'use client';

import { useState, useCallback } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Props = {
  onCreate: (name: string) => void;
};

/** Inline create row: toggles between "Add" button and input+confirm. */
export function CompanyCreateRow({ onCreate }: Props) {
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');

  const handleConfirm = useCallback(() => {
    const trimmed = name.trim();
    if (trimmed) {
      onCreate(trimmed);
      setIsCreating(false);
      setName('');
    }
  }, [name, onCreate]);

  const handleCancel = useCallback(() => {
    setName('');
    setIsCreating(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
      } else if (e.key === 'Escape') {
        handleCancel();
      }
    },
    [handleConfirm, handleCancel]
  );

  if (isCreating) {
    return (
      <div className="flex items-center gap-1.5 p-1.5">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Company name..."
          className="h-7 text-sm"
          autoFocus
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-7 shrink-0"
          onClick={handleConfirm}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Check className="size-3.5" />
        </Button>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-7 shrink-0"
          onClick={handleCancel}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <X className="size-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
      onClick={() => setIsCreating(true)}
    >
      <Plus className="size-4" />
      Add New Company
    </button>
  );
}
