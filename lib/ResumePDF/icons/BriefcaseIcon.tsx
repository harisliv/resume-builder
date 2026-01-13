import React from 'react';
import { Svg, Path, Rect } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

export const BriefcaseIcon = () => (
  <Svg width="14" height="14" viewBox="0 0 24 24">
    <Rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="2"
      ry="2"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);
