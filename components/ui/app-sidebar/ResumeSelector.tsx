'use client';

import * as React from 'react';
import { FileText, Plus, ChevronsUpDown, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@/components/ui/sidebar';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { LeftToRightListBulletIcon } from '@hugeicons/core-free-icons';

export function ResumeSelector({
  resumeTitles,
  selectedResumeId,
  onResumeSelect,
  onCreateNew,
  isLoadingTitles
}: {
  resumeTitles: { id: string; title: string }[] | undefined;
  selectedResumeId: string | undefined;
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
  isLoadingTitles: boolean;
}) {
  const { isMobile } = useSidebar();
  const [isCreating, setIsCreating] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState('');

  const currentTitle = React.useMemo(
    () =>
      resumeTitles?.find((r) => r.id === selectedResumeId)?.title ??
      'New Resume',
    [resumeTitles, selectedResumeId]
  );

  const handleConfirmCreate = () => {
    if (newTitle.trim()) {
      onCreateNew(newTitle.trim());
      setNewTitle('');
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setNewTitle('');
    setIsCreating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleConfirmCreate();
    } else if (e.key === 'Escape') {
      handleCancelCreate();
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isLoadingTitles}>
            <SidebarMenuButton
              size="lg"
              type="button"
              tooltip="My Resumes"
              disabled={isLoadingTitles}
              className={cn(
                'bg-background shadow-sm border border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:border-0 hover:border-primary/20 hover:shadow-md transition-all duration-200',
                isLoadingTitles
                  ? 'cursor-not-allowed opacity-50'
                  : 'cursor-pointer'
              )}
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <HugeiconsIcon
                  icon={LeftToRightListBulletIcon}
                  size={24}
                  color="white"
                  strokeWidth={1.5}
                />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold">My Resumes</span>
                <span className="truncate text-sm text-muted-foreground font-medium">
                  {currentTitle}
                </span>
              </div>
              {isLoadingTitles ? (
                <Spinner className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              ) : (
                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-muted-foreground" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="start"
            sideOffset={4}
          >
            {isCreating ? (
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
            ) : (
              <DropdownMenuItem
                onClick={() => setIsCreating(true)}
                onSelect={(e) => e.preventDefault()}
              >
                <Plus className="size-4 mr-2" />
                Create New Resume
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuLabel>My Resumes</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={selectedResumeId ?? ''}
              onValueChange={onResumeSelect}
            >
              {resumeTitles?.map((resume) => (
                <DropdownMenuRadioItem key={resume.id} value={resume.id}>
                  {resume.title}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
