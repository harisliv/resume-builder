import type { Svg } from '@react-pdf/renderer';
import type React from 'react';

/**
 * Base props interface for all PDF icons
 * Based on react-pdf SVG support from Context7 documentation
 */
export interface IconProps {
  /** Width and height in points (default varies by icon type) */
  size?: number;
  /** Stroke color (hex, rgb, or named color) */
  color?: string;
  /** Stroke width in points */
  strokeWidth?: number;
  /** Fill color - 'none' for outline icons */
  fill?: string;
  /** Additional SVG styles */
  style?: React.ComponentProps<typeof Svg>['style'];
}

/**
 * Default sizes for different icon categories
 */
export const DEFAULT_ICON_SIZES = {
  /** Contact icons in header (mail, phone, etc.) */
  contact: 12,
  /** Section header icons */
  section: 14,
  /** Small utility icons */
  utility: 10,
  /** Extra small inline icons */
  xs: 8
} as const;

/**
 * Default stroke widths for different icon categories
 */
export const DEFAULT_STROKE_WIDTHS = {
  /** Contact icons - subtle appearance */
  contact: 1.5,
  /** Section icons - bolder for visibility */
  section: 2,
  /** Utility icons - balanced */
  utility: 1.5,
  /** Small icons - thinner for clarity */
  xs: 1.25
} as const;

/**
 * Standard viewBox for all icons (24x24 coordinate system)
 */
export const DEFAULT_VIEWBOX = '0 0 24 24' as const;

/**
 * Common stroke linecap and linejoin for smooth appearance
 */
export const DEFAULT_STROKE_STYLE = {
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const
};
