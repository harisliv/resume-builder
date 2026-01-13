import React from 'react';
import { Svg, Path } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

export const ArrowRightIcon = () => (
  <Svg width="5" height="5" viewBox="0 0 10 10" style={{ marginHorizontal: 1 }}>
    <Path
      d="M1 5h7M6 2.5l2.5 2.5L6 7.5"
      stroke={COLORS.textDark}
      strokeWidth="0.8"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
