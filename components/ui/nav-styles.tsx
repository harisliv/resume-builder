'use client';

import { ChevronsUpDown } from 'lucide-react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import {
  COLOR_PALETTES,
  FONT_OPTIONS,
  DOCUMENT_STYLES,
  type TPaletteId,
  type TFontId,
  type TDocumentStyleId,
  type TResumeData
} from '@/types';

function ColorCircles({ paletteId }: { paletteId: TPaletteId }) {
  const palette = COLOR_PALETTES[paletteId];
  return (
    <div className="flex -space-x-1">
      <div
        className="h-4 w-4 rounded-full border border-background"
        style={{ backgroundColor: palette.summary }}
      />
      <div
        className="h-4 w-4 rounded-full border border-background"
        style={{ backgroundColor: palette.experience }}
      />
      <div
        className="h-4 w-4 rounded-full border border-background"
        style={{ backgroundColor: palette.education }}
      />
    </div>
  );
}

export function PaletteSelector() {
  const form = useFormContext<TResumeData>();
  const currentPalette = form.watch('documentStyle.palette');

  return (
    <Controller
      name="documentStyle.palette"
      control={form.control}
      render={({ field }) => (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  type="button"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <ColorCircles paletteId={currentPalette || 'ocean'} />
                  <span className="flex-1 text-left text-sm truncate">
                    {COLOR_PALETTES[currentPalette || 'ocean'].name}
                  </span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg z-[100]"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel>Color Palette</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {Object.values(COLOR_PALETTES).map((palette) => (
                    <DropdownMenuRadioItem
                      key={palette.id}
                      value={palette.id}
                      className="gap-3"
                    >
                      <ColorCircles paletteId={palette.id as TPaletteId} />
                      <span>{palette.name}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    />
  );
}

export function FontSelector() {
  const form = useFormContext<TResumeData>();
  const currentFont = form.watch('documentStyle.font');

  return (
    <Controller
      name="documentStyle.font"
      control={form.control}
      render={({ field }) => (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  type="button"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <span
                    className="text-base font-medium"
                    style={{
                      fontFamily: `var(${FONT_OPTIONS[currentFont || 'inter'].cssVariable})`
                    }}
                  >
                    Aa
                  </span>
                  <span className="flex-1 text-left text-sm truncate">
                    {FONT_OPTIONS[currentFont || 'inter'].name}
                  </span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg z-[100]"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel>Font Family</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {Object.values(FONT_OPTIONS).map((font) => (
                    <DropdownMenuRadioItem
                      key={font.id}
                      value={font.id}
                      className="gap-3"
                    >
                      <span
                        className="text-base w-6"
                        style={{ fontFamily: `var(${font.cssVariable})` }}
                      >
                        Aa
                      </span>
                      <span>
                        {font.name}
                        <span className="text-muted-foreground ml-1">
                          ({font.category})
                        </span>
                      </span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    />
  );
}

export function DocStyleSelector() {
  const form = useFormContext<TResumeData>();
  const currentStyle = form.watch('documentStyle.style');

  return (
    <Controller
      name="documentStyle.style"
      control={form.control}
      render={({ field }) => (
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  type="button"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex items-center justify-center h-5 w-5 rounded border text-[10px] font-bold">
                    {DOCUMENT_STYLES[currentStyle || 'modern'].name[0]}
                  </div>
                  <span className="flex-1 text-left text-sm truncate">
                    {DOCUMENT_STYLES[currentStyle || 'modern'].name}
                  </span>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg z-[100]"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuLabel>Document Style</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  {Object.values(DOCUMENT_STYLES).map((style) => (
                    <DropdownMenuRadioItem
                      key={style.id}
                      value={style.id}
                      className="gap-3"
                    >
                      <div className="flex items-center justify-center h-5 w-5 rounded border text-[10px] font-bold shrink-0">
                        {style.name[0]}
                      </div>
                      <div className="flex flex-col">
                        <span>{style.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {style.description}
                        </span>
                      </div>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      )}
    />
  );
}
