import React from 'react';
import { Svg, Path } from '@react-pdf/renderer';
import { COLORS } from '../ResumeStyles';

/**
 * SparklesIcon - 20x20px for GradientIconBox
 * strokeWidth: 2.5 to match SectionCardTitle
 */
export const SparklesIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path
      d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
      stroke={COLORS.white}
      strokeWidth="2.5"
      fill="none"
    />
    <Path
      d="M19 13l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z"
      stroke={COLORS.white}
      strokeWidth="2"
      fill="none"
    />
  </Svg>
);
