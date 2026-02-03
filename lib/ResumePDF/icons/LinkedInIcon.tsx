import React from 'react';
import { Svg, Path, Rect, Circle } from '@react-pdf/renderer';
import {
  type IconProps,
  DEFAULT_ICON_SIZES,
  DEFAULT_STROKE_WIDTHS,
  DEFAULT_VIEWBOX,
  DEFAULT_STROKE_STYLE
} from './types';

/**
 * LinkedIn icon for social/contact links
 * Uses the "in" logo design with configurable colors
 */
export const LinkedInIcon = ({
  size = DEFAULT_ICON_SIZES.contact,
  color = '#475569',
  strokeWidth = DEFAULT_STROKE_WIDTHS.contact,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* LinkedIn "in" letters */}
    <Path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
    {/* Vertical line for "i" */}
    <Rect
      x="2"
      y="9"
      width="4"
      height="11"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
    {/* Dot for "i" */}
    <Circle
      cx="4"
      cy="4"
      r="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill === 'none' ? 'none' : color}
    />
  </Svg>
);
