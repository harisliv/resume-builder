/**
 * @file CompanyOptionRow.tsx
 * @description Per-option row with select, inline rename, and delete actions.
 * Mirrors ResumeOptionActions pattern.
 */
'use client';

import { useState, useCallback } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWarningDialog } from '@/providers/WarningDialogProvider';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  selected: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
  onDelete: () => void;
};

/** Stop propagation only — keeps input functional. */
const stopPropOnly = (e: React.SyntheticEvent) => e.stopPropagation();
const inputEventProps = {
  onPointerDown: stopPropOnly,
  onPointerUp: stopPropOnly,
  onClick: stopPropOnly,
  onMouseDown: stopPropOnly
};

/** Block all events from reaching parent. */
const stopAll = (e: React.SyntheticEvent) => {
  e.stopPropagation();
  e.preventDefault();
};
const blockProps = {
  onPointerDown: stopAll,
  onPointerUp: stopAll,
  onClick: stopAll,
  onMouseDown: stopAll
};

/** Company option row with inline edit/delete. */
export function CompanyOptionRow({
  name,
  selected,
  onSelect,
  onRename,
  onDelete
}: Props) {
  const confirm = useWarningDialog();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);

  const handleConfirmRename = useCallback(() => {
    const trimmed = editName.trim();
    if (trimmed && trimmed !== name) {
      onRename(trimmed);
    }
    setIsEditing(false);
  }, [editName, name, onRename]);

  const handleCancelEdit = useCallback(() => {
    setEditName(name);
    setIsEditing(false);
  }, [name]);

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
    <div
      role="option"
      aria-selected={selected}
      className={cn(
        'flex items-center gap-1 rounded-md px-2 py-1 text-sm cursor-pointer hover:bg-accent',
        selected && 'bg-primary/10 font-medium'
      )}
      onClick={isEditing ? undefined : onSelect}
    >
      {isEditing ? (
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-transparent outline-none text-inherit text-sm"
          autoFocus
          {...inputEventProps}
        />
      ) : (
        <span className="flex-1 truncate">{name}</span>
      )}

      <div className="flex shrink-0 items-center" {...blockProps}>
        {isEditing ? (
          <>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-6 shrink-0 !text-green-600"
              onClick={() => handleConfirmRename()}
            >
              <Check className="size-3" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-6 shrink-0"
              onClick={() => handleCancelEdit()}
            >
              <X className="size-3" />
            </Button>
          </>
        ) : (
          <>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-6 shrink-0 !text-primary/60"
              onClick={() => {
                setEditName(name);
                setIsEditing(true);
              }}
            >
              <Pencil className="size-3" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-6 shrink-0 !text-destructive/60"
              onClick={async () => {
                const ok = await confirm({
                  title: 'Remove company?',
                  description: `"${name}" will be cleared from all experience entries that use it.`,
                  confirmLabel: 'Remove',
                  variant: 'destructive'
                });
                if (ok) onDelete();
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
