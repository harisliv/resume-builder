import React from 'react';
import { Svg, Path, Circle } from '@react-pdf/renderer';
import {
  type IconProps,
  DEFAULT_ICON_SIZES,
  DEFAULT_STROKE_WIDTHS,
  DEFAULT_VIEWBOX,
  DEFAULT_STROKE_STYLE
} from './types';

/**
 * Globe/website icon for portfolio/website links
 * Shows world wide web representation
 */
export const GlobeIcon = ({
  size = DEFAULT_ICON_SIZES.contact,
  color = '#475569',
  strokeWidth = DEFAULT_STROKE_WIDTHS.contact,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Outer circle - globe outline */}
    <Circle
      cx="12"
      cy="12"
      r="10"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
    />
    {/* Horizontal line - equator */}
    <Path
      d="M2 12h20"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
    />
    {/* Vertical ellipse - meridian */}
    <Path
      d="M12 2c2.5 3 4 7 4 10s-1.5 7-4 10c-2.5-3-4-7-4-10s1.5-7 4-10z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
