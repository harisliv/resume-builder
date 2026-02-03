import React from 'react';
import { Svg, Path, Rect, Line } from '@react-pdf/renderer';
import {
  type IconProps,
  DEFAULT_ICON_SIZES,
  DEFAULT_STROKE_WIDTHS,
  DEFAULT_VIEWBOX,
  DEFAULT_STROKE_STYLE
} from './types';

/**
 * Calendar icon for date ranges and scheduling
 * Features month header and date grid
 */
export const CalendarIcon = ({
  size = DEFAULT_ICON_SIZES.utility,
  color = '#475569',
  strokeWidth = DEFAULT_STROKE_WIDTHS.utility,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Calendar body */}
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
    {/* Month header line */}
    <Line
      x1="3"
      y1="10"
      x2="21"
      y2="10"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    {/* Top binding rings */}
    <Line
      x1="8"
      y1="2"
      x2="8"
      y2="6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
    />
    <Line
      x1="16"
      y1="2"
      x2="16"
      y2="6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
    />
  </Svg>
);
