'use client';

import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import type { NavSelectorOption } from '../types';

type Props = {
  option: NavSelectorOption;
  defaultContent: ReactNode;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};

/** Prevent radio item selection and dropdown close. */
const stopEvent = (e: React.SyntheticEvent) => {
  e.stopPropagation();
  e.preventDefault();
};

/** Block all pointer/click events from reaching RadioItem. */
const blockProps = {
  onPointerDown: stopEvent,
  onPointerUp: stopEvent,
  onClick: stopEvent,
  onMouseDown: stopEvent
};

/** Stop propagation only — no preventDefault, so input keeps focus/selection. */
const stopPropOnly = (e: React.SyntheticEvent) => e.stopPropagation();
const inputEventProps = {
  onPointerDown: stopPropOnly,
  onPointerUp: stopPropOnly,
  onClick: stopPropOnly,
  onMouseDown: stopPropOnly
};

/** Per-option inline edit/delete actions for the resume dropdown. */
export function ResumeOptionActions({
  option,
  defaultContent,
  onRename,
  onDelete
}: Props) {
  const confirm = useWarningDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(option.label);

  const handleConfirmRename = useCallback(() => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== option.label) {
      onRename(option.id, trimmed);
    }
    setIsEditing(false);
  }, [editTitle, option.id, option.label, onRename]);

  const handleCancelEdit = useCallback(() => {
    setEditTitle(option.label);
    setIsEditing(false);
  }, [option.label]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirmRename();
      } else if (e.key === 'Escape') {
        handleCancelEdit();
      }
    },
    [handleConfirmRename, handleCancelEdit]
  );

  return (
    <div className="flex flex-1 min-w-0 items-center gap-1">
      {isEditing ? (
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none text-inherit"
          autoFocus
          {...inputEventProps}
        />
      ) : (
        <div className="flex-1 truncate">{defaultContent}</div>
      )}
      <div className="flex shrink-0 items-center" {...blockProps}>
        {isEditing ? (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 !text-green-600"
              onClick={() => handleConfirmRename()}
            >
              <Check className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0"
              onClick={() => handleCancelEdit()}
            >
              <X className="size-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 !text-primary/60"
              onClick={() => {
                setEditTitle(option.label);
                setIsEditing(true);
              }}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="size-7 shrink-0 !text-destructive/60"
              onClick={async () => {
                const ok = await confirm({
                  title: 'Delete resume?',
                  description:
                    'This resume and all its data will be permanently removed. You won’t be able to recover it.',
                  confirmLabel: 'Delete',
                  variant: 'destructive'
                });
                if (ok) onDelete(option.id);
              }}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
