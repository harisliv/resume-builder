import React from 'react';
import { Svg, Path, Rect } from '@react-pdf/renderer';
import {
  type IconProps,
  DEFAULT_ICON_SIZES,
  DEFAULT_STROKE_WIDTHS,
  DEFAULT_VIEWBOX,
  DEFAULT_STROKE_STYLE
} from './types';

/**
 * Briefcase icon for work experience sections
 * Professional bag design with handle detail
 */
export const BriefcaseIcon = ({
  size = DEFAULT_ICON_SIZES.section,
  color = '#ffffff',
  strokeWidth = DEFAULT_STROKE_WIDTHS.section,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Briefcase body */}
    <Rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
    {/* Briefcase handle - centered on top */}
    <Path
      d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
