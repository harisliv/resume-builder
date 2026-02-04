import React from 'react';
import { Svg, Path } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

/**
 * GraduationCapIcon - 20x20px for GradientIconBox
 * strokeWidth: 2.5 to match SectionCardTitle
 */
export const GraduationCapIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M22 10v6M2 10l10-5 10 5-10 5z"
      stroke={COLORS.white}
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M6 12v5c3 3 9 3 12 0v-5"
      stroke={COLORS.white}
      strokeWidth="2.5"
      fill="none"
    />
  </Svg>
);
