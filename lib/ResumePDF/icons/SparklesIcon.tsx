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
 * Sparkles/star icon for skills/summary sections
 * Features a main sparkle and smaller accent sparkle
 */
export const SparklesIcon = ({
  size = DEFAULT_ICON_SIZES.section,
  color = '#ffffff',
  strokeWidth = DEFAULT_STROKE_WIDTHS.section,
  fill = 'none',
  style
}: IconProps) => (
  <Svg width={size} height={size} viewBox={DEFAULT_VIEWBOX} style={style}>
    {/* Main 4-pointed star */}
    <Path
      d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
      stroke={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
    {/* Small accent sparkle */}
    <Path
      d="M19 13l.8 2.2L22 16l-2.2.8-.8 2.2-.8-2.2L16 16l2.2-.8.8-2.2z"
      stroke={color}
      strokeWidth={strokeWidth * 0.75}
      fill={fill}
      strokeLinecap={DEFAULT_STROKE_STYLE.strokeLinecap}
      strokeLinejoin={DEFAULT_STROKE_STYLE.strokeLinejoin}
    />
  </Svg>
);
