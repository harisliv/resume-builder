import React from 'react';
import { Svg, Path, Circle } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

export const MapPinIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Path
      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Circle
      cx="12"
      cy="10"
      r="3"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);
