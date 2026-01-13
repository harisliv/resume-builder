import type { TResumeData } from '@/types';
import type { COLOR_PALETTES } from '@/types';

export interface IResumePreviewProps {
  data: TResumeData;
  style?: import('@/types').TDocumentStyle;
}

export interface IStyleProps {
  data: TResumeData;
  palette: (typeof COLOR_PALETTES)[keyof typeof COLOR_PALETTES];
  fontFamily: string;
}
