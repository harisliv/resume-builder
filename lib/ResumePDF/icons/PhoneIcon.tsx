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
 * Phone icon for contact information
 * Simplified design for better PDF rendering at small sizes
 */
export const PhoneIcon = ({
  size = DEFAULT_ICON_SIZES.contact,
  color = '#475569',
  strokeWidth = DEFAULT_STROKE_WIDTHS.contact,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Phone handset outline - simplified for clarity */}
    <Path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
