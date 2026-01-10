import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/Inter/Inter_28pt-Regular.ttf', fontWeight: 400 },
    { src: '/Inter/Inter_28pt-Medium.ttf', fontWeight: 500 },
    { src: '/Inter/Inter_28pt-SemiBold.ttf', fontWeight: 600 },
    { src: '/Inter/Inter_28pt-Bold.ttf', fontWeight: 700 }
  ]
});

export const FONT_FAMILY = {
  sans: 'Inter',
  mono: 'Courier'
};
