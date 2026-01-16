'use client';

import * as React from 'react';
import { FileText, Plus, ChevronsUpDown, Check, X } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';
import { useAuth } from '@workos-inc/authkit-nextjs/components';

import { NavUser } from '@/components/nav-user';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  NavSelector,
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
import { useResumeFormContext } from '@/components/providers/ResumeFormProvider';
import {
  COLOR_PALETTES,
  FONT_OPTIONS,
  DOCUMENT_STYLES,
  type TPaletteId,
  type TFontId,
  type TDocumentStyleId,
  type TResumeData
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

function ResumeSelector() {
  const {
    resumeTitles,
    selectedResumeId,
    handleResumeSelect,
    handleCreateNew,
    isLoadingTitles
  } = useResumeFormContext();
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
      handleCreateNew(newTitle.trim());
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
              className="bg-background/80 shadow-sm border data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:shadow-none group-data-[collapsible=icon]:border-0"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-full shrink-0 bg-blue-500">
                <FileText className="size-5 text-white" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold">My Resumes</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentTitle}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
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
              onValueChange={handleResumeSelect}
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
  const form = useFormContext<TResumeData>();

  return (
    <Controller
      name="documentStyle.palette"
      control={form.control}
      render={({ field }) => (
        <NavSelector<TPaletteId>
          label="Palette"
          value={field.value}
          displayValue={COLOR_PALETTES[field.value]?.name ?? 'Select palette'}
          onChange={field.onChange}
          options={paletteNavOptions}
          renderIcon={(paletteId) => {
            const palette = COLOR_PALETTES[paletteId] ?? COLOR_PALETTES.ocean;
            return (
              <GradientCircle
                colors={[
                  palette.summary,
                  palette.experience,
                  palette.education
                ]}
                className="size-8 rounded-full"
              />
            );
          }}
          renderOptionIcon={(option) => {
            const palette = COLOR_PALETTES[option.id];
            return (
              <GradientCircle
                colors={[
                  palette.summary,
                  palette.experience,
                  palette.education
                ]}
                className="size-4 rounded-full"
              />
            );
          }}
          tooltip="Palette"
        />
      )}
    />
  );
}

function FontSelector() {
  const form = useFormContext<TResumeData>();

  return (
    <Controller
      name="documentStyle.font"
      control={form.control}
      render={({ field }) => (
        <NavSelector<TFontId>
          label="Font"
          value={field.value}
          displayValue={FONT_OPTIONS[field.value]?.name ?? 'Select font'}
          onChange={field.onChange}
          options={fontNavOptions}
          renderIcon={(fontId) => {
            const font = FONT_OPTIONS[fontId] ?? FONT_OPTIONS.inter;
            return (
              <span
                className="text-lg font-medium text-white"
                style={{ fontFamily: `var(${font.cssVariable})` }}
              >
                Aa
              </span>
            );
          }}
          renderOptionIcon={(option) => {
            const font = FONT_OPTIONS[option.id];
            return (
              <span
                className="text-sm w-6"
                style={{ fontFamily: `var(${font.cssVariable})` }}
              >
                Aa
              </span>
            );
          }}
          iconBgColor="bg-emerald-500"
          tooltip="Font"
        />
      )}
    />
  );
}

function StyleSelector() {
  const form = useFormContext<TResumeData>();

  return (
    <Controller
      name="documentStyle.style"
      control={form.control}
      render={({ field }) => (
        <NavSelector<TDocumentStyleId>
          label="Style"
          value={field.value}
          displayValue={DOCUMENT_STYLES[field.value]?.name ?? 'Select style'}
          onChange={field.onChange}
          options={styleNavOptions}
          renderIcon={(styleId) => {
            const style = DOCUMENT_STYLES[styleId] ?? DOCUMENT_STYLES.modern;
            return (
              <span className="text-sm font-bold text-white">
                {style.name[0]}
              </span>
            );
          }}
          renderOptionIcon={(option) => {
            const style = DOCUMENT_STYLES[option.id];
            return (
              <div className="flex items-center justify-center size-5 rounded border text-[10px] font-bold shrink-0">
                {style.name[0]}
              </div>
            );
          }}
          iconBgColor="bg-violet-500"
          tooltip="Style"
        />
      )}
    />
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userData = React.useMemo(
    () => ({
      name: user?.firstName ?? 'User',
      email: user?.email ?? '',
      avatar: user?.profilePictureUrl ?? ''
    }),
    [user]
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            My Resumes
          </SidebarGroupLabel>
          <SidebarTrigger />
        </div>
        <ResumeSelector />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="bg-sidebar-accent/50 rounded-lg gap-3 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:gap-1">
          <PaletteSelector />
          <FontSelector />
          <StyleSelector />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
