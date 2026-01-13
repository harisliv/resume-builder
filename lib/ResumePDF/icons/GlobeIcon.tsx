import React from 'react';
import { Svg, Path, Circle } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

export const GlobeIcon = () => (
  <Svg width="12" height="12" viewBox="0 0 24 24">
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
    <Path d="M2 12h20" stroke={COLORS.slate600} strokeWidth="2" fill="none" />
    <Path
      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke={COLORS.slate600}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);
