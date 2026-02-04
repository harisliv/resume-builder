import React from 'react';
import { Svg, Path } from '@react-pdf/renderer';
import {
  type IconProps,
  DEFAULT_ICON_SIZES,
  DEFAULT_STROKE_WIDTHS,
  DEFAULT_VIEWBOX,
  DEFAULT_STROKE_STYLE
} from './types';

/**
 * Graduation cap icon for education sections
 * Features mortarboard with tassel detail
 */
export const GraduationCapIcon = ({
  size = DEFAULT_ICON_SIZES.section,
  color = '#ffffff',
  strokeWidth = DEFAULT_STROKE_WIDTHS.section,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Mortarboard top */}
    <Path
      d="M2 10l10-5 10 5-10 5z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
    {/* Tassel string */}
    <Path
      d="M22 10v2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
    />
    {/* Cap base/drape */}
    <Path
      d="M6 12v5c3 3 9 3 12 0v-5"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
