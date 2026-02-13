'use client';

import { useState, useCallback } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent
} from '@/components/ui/tooltip';
import { CreateResumeRow } from '../styles/nav-selector.styles';
import usePrivileges from '@/hooks/usePrivileges';

export function ResumeSelectorHeader({
  onCreateNew
}: {
  onCreateNew: (title?: string) => void;
}) {
  const { getDisabledTooltip } = usePrivileges();
  const createTooltip = getDisabledTooltip(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

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

  if (isCreating) {
    return (
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
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span>
          <DropdownMenuItem
            disabled={!!createTooltip}
            onClick={() => setIsCreating(true)}
            onSelect={(e) => e.preventDefault()}
          >
            <Plus className="mr-2 size-4" />
            Create New Resume
          </DropdownMenuItem>
        </span>
      </TooltipTrigger>
      {createTooltip && (
        <TooltipContent side="right">{createTooltip}</TooltipContent>
      )}
    </Tooltip>
  );
}
