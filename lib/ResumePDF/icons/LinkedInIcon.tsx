import React from 'react';
import { Svg, Path, Rect, Circle } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

export const LinkedInIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Rect
      x="2"
      y="9"
      width="4"
      height="12"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Circle
      cx="4"
      cy="4"
      r="2"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);
