import { Font } from '@react-pdf/renderer';
import type { TFontId } from '@/types/documentStyle';

Font.register({
  family: 'Inter',
  fonts: [
    { src: '/Inter/Inter_28pt-Regular.ttf', fontWeight: 400 },
    { src: '/Inter/Inter_28pt-Medium.ttf', fontWeight: 500 },
    { src: '/Inter/Inter_28pt-SemiBold.ttf', fontWeight: 600 },
    { src: '/Inter/Inter_28pt-Bold.ttf', fontWeight: 700 }
  ]
});

Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Me5Q.ttf',
      fontWeight: 400
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmEU9vAw.ttf',
      fontWeight: 500
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlvAw.ttf',
      fontWeight: 700
    }
  ]
});

Font.register({
  family: 'Open Sans',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf',
      fontWeight: 400
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVc.ttf',
      fontWeight: 600
    },
    {
      src: 'https://fonts.gstatic.com/s/opensans/v40/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg_1x4gaVc.ttf',
      fontWeight: 700
    }
  ]
});

Font.register({
  family: 'Lato',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHvxk.ttf',
      fontWeight: 400
    },
    {
      src: 'https://fonts.gstatic.com/s/lato/v24/S6u9w4BMUTPHh6UVSwiPGQ.ttf',
      fontWeight: 700
    }
  ]
});

Font.register({
  family: 'Playfair Display',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQ.ttf',
      fontWeight: 400
    },
    {
      src: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDQ.ttf',
      fontWeight: 600
    },
    {
      src: 'https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKejukDQ.ttf',
      fontWeight: 700
    }
  ]
});

Font.register({
  family: 'Merriweather',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-fCZM.ttf',
      fontWeight: 400
    },
    {
      src: 'https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZWMf6.ttf',
      fontWeight: 700
    }
  ]
});

export const PDF_FONTS: Record<TFontId, string> = {
  inter: 'Inter',
  roboto: 'Roboto',
  opensans: 'Open Sans',
  lato: 'Lato',
  playfair: 'Playfair Display',
  merriweather: 'Merriweather'
};

export const FONT_FAMILY = {
  sans: 'Inter',
  mono: 'Courier'
};
