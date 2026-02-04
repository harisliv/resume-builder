import React from 'react';
import {
  View,
  Svg,
  Rect,
  Defs,
  LinearGradient,
  Stop
} from '@react-pdf/renderer';

interface ITimelineConnectorProps {
  entryCount: number;
  lineColor: string;
  children: React.ReactNode;
}

/**
 * TimelineConnector - Continuous vertical timeline with gradient fade
 *
 * Features:
 * - Continuous vertical connector line (2px width)
 * - Sharp 90-degree angular corners at entry points
 * - Circular markers at each entry point
 * - Vertical gradient mask fading to transparent at terminal end
 * - Dynamic height based on entry count
 */
export const TimelineConnector = ({
  entryCount,
  lineColor,
  children
}: ITimelineConnectorProps) => {
  // Entry spacing - matches experienceItem marginBottom
  const entrySpacing = 40; // Approximate card height + margin
  const lineX = 5; // X position of vertical line center (5px from left)
  const markerY = 15; // Y position of first marker

  // Total height calculation
  const totalHeight = entryCount * entrySpacing;

  return (
    <View style={{ flexDirection: 'row', position: 'relative' }}>
      {/* Timeline SVG Layer */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 20,
          height: totalHeight,
          zIndex: 1
        }}
      >
        <Svg width="20" height={totalHeight} viewBox={`0 0 20 ${totalHeight}`}>
          <Defs>
            {/* Vertical gradient for fade effect */}
            <LinearGradient
              id="timelineFade"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={lineColor} stopOpacity={1} />
              <Stop offset="70%" stopColor={lineColor} stopOpacity={1} />
              <Stop offset="100%" stopColor={lineColor} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* Main vertical line - 2px wide rect */}
          <Rect
            x={lineX}
            y={markerY}
            width={2}
            height={totalHeight - markerY}
            fill="url('#timelineFade')"
          />

          {/* Entry point markers - circular dots */}
          {Array.from({ length: entryCount }).map((_, index) => {
            const y = markerY + index * entrySpacing;
            return (
              <React.Fragment key={index}>
                {/* Outer circle (border) */}
                <Rect
                  x={lineX - 4}
                  y={y - 4}
                  width={10}
                  height={10}
                  rx={5}
                  ry={5}
                  fill="white"
                  stroke={lineColor}
                  strokeWidth={2}
                />
              </React.Fragment>
            );
          })}
        </Svg>
      </View>

      {/* Content Container */}
      <View style={{ marginLeft: 16, flex: 1 }}>{children}</View>
    </View>
  );
};
