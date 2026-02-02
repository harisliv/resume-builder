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
 * Mail/Email icon for contact information
 * Optimized for react-pdf with configurable size and color
 */
export const MailIcon = ({
  size = DEFAULT_ICON_SIZES.contact,
  color = '#475569',
  strokeWidth = DEFAULT_STROKE_WIDTHS.contact,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Envelope body */}
    <Path
      d="M3 7c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
    {/* Envelope flap */}
    <Path
      d="m3 7 9 6 9-6"
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
