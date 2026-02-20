import * as z from 'zod';

export const COLOR_PALETTES = {
  aesthetic: {
    id: 'aesthetic',
    name: 'Aesthetic',
    summary: '#6366f1',
    experience: '#ec4899',
    education: '#14b8a6',
    skills: '#818cf8'
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Breeze',
    summary: '#06b6d4',
    experience: '#0891b2',
    education: '#8b5cf6',
    skills: '#d946ef'
  },
  forest: {
    id: 'forest',
    name: 'Forest',
    summary: '#10b981',
    experience: '#059669',
    education: '#6366f1',
    skills: '#f59e0b'
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset',
    summary: '#f97316',
    experience: '#ea580c',
    education: '#ec4899',
    skills: '#eab308'
  },
  midnight: {
    id: 'midnight',
    name: 'Midnight',
    summary: '#6366f1',
    experience: '#4f46e5',
    education: '#8b5cf6',
    skills: '#06b6d4'
  },
  rose: {
    id: 'rose',
    name: 'Rose Garden',
    summary: '#f43f5e',
    experience: '#e11d48',
    education: '#a855f7',
    skills: '#14b8a6'
  },
  monochrome: {
    id: 'monochrome',
    name: 'Monochrome',
    summary: '#374151',
    experience: '#1f2937',
    education: '#4b5563',
    skills: '#6b7280'
  }
} as const;

export const FONT_OPTIONS = {
  inter: {
    id: 'inter',
    name: 'Inter',
    category: 'Sans-serif',
    cssVariable: '--font-inter',
    googleFont: 'Inter'
  },
  roboto: {
    id: 'roboto',
    name: 'Roboto',
    category: 'Sans-serif',
    cssVariable: '--font-roboto',
    googleFont: 'Roboto'
  },
  opensans: {
    id: 'opensans',
    name: 'Open Sans',
    category: 'Sans-serif',
    cssVariable: '--font-opensans',
    googleFont: 'Open_Sans'
  },
  lato: {
    id: 'lato',
    name: 'Lato',
    category: 'Sans-serif',
    cssVariable: '--font-lato',
    googleFont: 'Lato'
  },
  playfair: {
    id: 'playfair',
    name: 'Playfair Display',
    category: 'Serif',
    cssVariable: '--font-playfair',
    googleFont: 'Playfair_Display'
  },
  merriweather: {
    id: 'merriweather',
    name: 'Merriweather',
    category: 'Serif',
    cssVariable: '--font-merriweather',
    googleFont: 'Merriweather'
  }
} as const;

export const DOCUMENT_STYLES = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines with gradient accents'
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional professional layout'
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Strong visual hierarchy'
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Two-column sidebar layout'
  },
} as const;

export type TPaletteId = keyof typeof COLOR_PALETTES;
export type TFontId = keyof typeof FONT_OPTIONS;
export type TDocumentStyleId = keyof typeof DOCUMENT_STYLES;
export type TColorPalette = (typeof COLOR_PALETTES)[TPaletteId];

/** Default palette per resume style for style-aware rendering fallbacks. */
export const DEFAULT_PALETTE_BY_STYLE: Record<TDocumentStyleId, TPaletteId> = {
  modern: 'ocean',
  classic: 'ocean',
  bold: 'ocean',
  executive: 'ocean'
};

/**
 * Resolves palette id from style + optional selected palette.
 */
export const resolvePaletteForStyle = (
  style: TDocumentStyleId | undefined,
  palette: TPaletteId | undefined
): TPaletteId => {
  const safeStyle = style ?? 'modern';
  return palette ?? DEFAULT_PALETTE_BY_STYLE[safeStyle];
};

export const documentStyleSchema = z.object({
  palette: z.enum([
    'aesthetic',
    'ocean',
    'forest',
    'sunset',
    'midnight',
    'rose',
    'monochrome'
  ]),
  font: z.enum([
    'inter',
    'roboto',
    'opensans',
    'lato',
    'playfair',
    'merriweather'
  ]),
  style: z.enum(['modern', 'classic', 'bold', 'executive'])
});

export const documentStyleDefaultValues: TDocumentStyle = {
  palette: 'aesthetic',
  font: 'inter',
  style: 'modern'
};

export type TDocumentStyle = z.infer<typeof documentStyleSchema>;

export const paletteOptions = Object.values(COLOR_PALETTES).map((p) => ({
  value: p.id,
  label: p.name
}));

export const fontOptions = Object.values(FONT_OPTIONS).map((f) => ({
  value: f.id,
  label: `${f.name} (${f.category})`
}));

export const styleOptions = Object.values(DOCUMENT_STYLES).map((s) => ({
  value: s.id,
  label: s.name
}));
