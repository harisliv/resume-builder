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
 * Map pin/location icon for contact information
 * Features a location marker with optional center dot fill
 */
export const MapPinIcon = ({
  size = DEFAULT_ICON_SIZES.contact,
  color = '#475569',
  strokeWidth = DEFAULT_STROKE_WIDTHS.contact,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Location marker outline */}
    <Path
      d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
    {/* Center dot */}
    <Circle
      cx="12"
      cy="10"
      r="2.5"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill === 'none' ? 'none' : color}
    />
  </Svg>
);
