import type { TColorPalette } from '@/types/documentStyle';
import type { TResumeForm } from '@/types/schema';

export interface IStyleProps {
  data: TResumeForm;
  palette: TColorPalette;
  fontFamily: string;
}
