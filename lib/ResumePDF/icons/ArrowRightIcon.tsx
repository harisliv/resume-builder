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
 * Arrow right icon for lists and navigation
 * Small utility arrow with rounded caps
 */
export const ArrowRightIcon = ({
  size = DEFAULT_ICON_SIZES.utility,
  color = '#94a3b8',
  strokeWidth = DEFAULT_STROKE_WIDTHS.utility,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
    {/* Arrow shaft and head */}
    <Path
      d="M5 12h14M14 7l5 5-5 5"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
