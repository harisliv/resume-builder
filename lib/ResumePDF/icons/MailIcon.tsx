import React from 'react';
import { Svg, Path } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

export const MailIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M22 6l-10 7L2 6"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);
