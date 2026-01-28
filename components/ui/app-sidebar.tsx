'use client';

import * as React from 'react';
import { FileText, Plus, ChevronsUpDown, Check, X } from 'lucide-react';
import { NavUser } from '@/components/ui/nav-user';
import { ResumeInfoControlledNavSelector } from '@/components/ControlledFields';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  GradientCircle,
  type NavSelectorOption
} from '@/components/ui/nav-selector';
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
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import {
  COLOR_PALETTES,
  FONT_OPTIONS,
  DOCUMENT_STYLES,
  type TPaletteId,
  type TFontId,
  type TDocumentStyleId
} from '@/types';

const paletteNavOptions: NavSelectorOption<TPaletteId>[] = Object.values(
  COLOR_PALETTES
).map((p) => ({
  id: p.id,
  label: p.name
}));

const fontNavOptions: NavSelectorOption<TFontId>[] = Object.values(
  FONT_OPTIONS
).map((f) => ({
  id: f.id,
  label: f.name,
  description: f.category
}));

const styleNavOptions: NavSelectorOption<TDocumentStyleId>[] = Object.values(
  DOCUMENT_STYLES
).map((s) => ({
  id: s.id,
  label: s.name,
  description: s.description
}));

function getPaletteById(id: string) {
  return Object.values(COLOR_PALETTES).find((p) => p.id === id);
}
function getFontById(id: string) {
  return Object.values(FONT_OPTIONS).find((f) => f.id === id);
}
function getStyleById(id: string) {
  return Object.values(DOCUMENT_STYLES).find((s) => s.id === id);
}

function ResumeSelector({
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

  if (isLoadingTitles) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              type="button"
              tooltip="My Resumes"
              className="bg-background shadow-sm border border-border/60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground data-[state=open]:border-primary/30 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:border-0 hover:border-primary/20 hover:shadow-md transition-all duration-200"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-xl shrink-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <FileText className="size-6 text-white" strokeWidth={2.5} />
              </div>
              <div className="grid flex-1 text-left text-base leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-bold">My Resumes</span>
                <span className="truncate text-sm text-muted-foreground font-medium">
                  {currentTitle}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden text-muted-foreground" />
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

function PaletteSelector() {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.palette"
      label="Palette"
      options={paletteNavOptions}
      getDisplayValue={(id) =>
        getPaletteById(id ?? '')?.name ?? 'Select palette'
      }
      renderIcon={(paletteId) => {
        const palette = getPaletteById(paletteId ?? '') ?? COLOR_PALETTES.ocean;
        return (
          <GradientCircle
            colors={[palette.summary, palette.experience, palette.education]}
            className="size-10 rounded-xl"
          />
        );
      }}
      renderOptionIcon={(option) => {
        const palette = getPaletteById(option.id);
        return palette ? (
          <GradientCircle
            colors={[palette.summary, palette.experience, palette.education]}
            className="size-5 rounded-md"
          />
        ) : null;
      }}
      tooltip="Palette"
    />
  );
}

function FontSelector() {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.font"
      label="Font"
      options={fontNavOptions}
      getDisplayValue={(id) => getFontById(id ?? '')?.name ?? 'Select font'}
      renderIcon={(fontId) => {
        const font = getFontById(fontId ?? '') ?? FONT_OPTIONS.inter;
        return (
          <span
            className="text-xl font-bold text-white"
            style={{ fontFamily: `var(${font.cssVariable})` }}
          >
            Aa
          </span>
        );
      }}
      renderOptionIcon={(option) => {
        const font = getFontById(option.id);
        return font ? (
          <span
            className="text-sm w-6"
            style={{ fontFamily: `var(${font.cssVariable})` }}
          >
            Aa
          </span>
        ) : null;
      }}
      iconBgColor="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30"
      tooltip="Font"
    />
  );
}

function StyleSelector() {
  return (
    <ResumeInfoControlledNavSelector
      name="documentStyle.style"
      label="Style"
      options={styleNavOptions}
      getDisplayValue={(id) => getStyleById(id ?? '')?.name ?? 'Select style'}
      renderIcon={(styleId) => {
        const style = getStyleById(styleId ?? '') ?? DOCUMENT_STYLES.modern;
        return (
          <span className="text-xl font-bold text-white">{style.name[0]}</span>
        );
      }}
      renderOptionIcon={(option) => {
        const style = getStyleById(option.id);
        return style ? (
          <div className="flex items-center justify-center size-5 rounded border text-[10px] font-bold shrink-0">
            {style.name[0]}
          </div>
        ) : null;
      }}
      iconBgColor="bg-gradient-to-br from-violet-500 to-violet-600 shadow-lg shadow-violet-500/30"
      tooltip="Style"
    />
  );
}

export type TAppSidebarResumeProps = {
  resumeTitles: { id: string; title: string }[] | undefined;
  selectedResumeId: string | undefined;
  onResumeSelect: (id: string) => void;
  onCreateNew: (title?: string) => void;
  isLoadingTitles: boolean;
};

export function AppSidebar({
  resumeTitles,
  selectedResumeId,
  onResumeSelect,
  onCreateNew,
  isLoadingTitles,
  ...props
}: TAppSidebarResumeProps & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center mb-2">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden text-sm font-bold text-foreground">
            My Resumes
          </SidebarGroupLabel>
          <SidebarTrigger />
        </div>
        <ResumeSelector
          resumeTitles={resumeTitles}
          selectedResumeId={selectedResumeId}
          onResumeSelect={onResumeSelect}
          onCreateNew={onCreateNew}
          isLoadingTitles={isLoadingTitles}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="bg-muted/30 rounded-2xl gap-5 p-4 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:gap-1 group-data-[collapsible=icon]:p-2 border border-border/40">
          <SidebarGroupLabel className="text-xs font-bold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden px-1">
            Customize
          </SidebarGroupLabel>
          <PaletteSelector />
          <FontSelector />
          <StyleSelector />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
