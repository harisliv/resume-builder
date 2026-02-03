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
 * Building/company icon for work experience
 * Office building with windows and entrance
 */
export const BuildingIcon = ({
  size = DEFAULT_ICON_SIZES.utility,
  color = '#475569',
  strokeWidth = DEFAULT_STROKE_WIDTHS.utility,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Building outline */}
    <Rect
      x="4"
      y="3"
      width="16"
      height="18"
      rx="1"
      ry="1"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
    {/* Windows row 1 */}
    <Rect
      x="7"
      y="6"
      width="3"
      height="3"
      stroke={color}
      strokeWidth={strokeWidth * 0.75}
      fill="none"
    />
    <Rect
      x="14"
      y="6"
      width="3"
      height="3"
      stroke={color}
      strokeWidth={strokeWidth * 0.75}
      fill="none"
    />
    {/* Windows row 2 */}
    <Rect
      x="7"
      y="11"
      width="3"
      height="3"
      stroke={color}
      strokeWidth={strokeWidth * 0.75}
      fill="none"
    />
    <Rect
      x="14"
      y="11"
      width="3"
      height="3"
      stroke={color}
      strokeWidth={strokeWidth * 0.75}
      fill="none"
    />
    {/* Entrance */}
    <Path
      d="M10 21V17h4v4"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
