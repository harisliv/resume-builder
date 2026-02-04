import React from 'react';
import {
  View,
  Svg,
  Path,
  Defs,
  LinearGradient,
  Stop
} from '@react-pdf/renderer';

interface IGradientIconBoxProps {
  gradientId: string;
  colorStart: string;
  colorEnd: string;
  children: React.ReactNode;
}

/**
 * GradientIconBox - Matches SectionCardTitle styling from web UI
 * Container: 40x40px (10px padding + 20px icon)
 * Border radius: 12px (rounded-xl equivalent)
 * Gradient: to-br (135deg diagonal)
 * Shadow: Simulated with offset semi-transparent layer
 */
export const GradientIconBox = ({
  gradientId,
  colorStart,
  colorEnd,
  children
}: IGradientIconBoxProps) => (
  <View style={{ width: 40, height: 40, position: 'relative' }}>
    {/* Shadow layer - offset rectangle for shadow effect */}
    <Svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ position: 'absolute', top: 2, left: 0 }}
    >
      <Path
        d="M 12 0 H 28 Q 40 0 40 12 V 28 Q 40 40 28 40 H 12 Q 0 40 0 28 V 12 Q 0 0 12 0 Z"
        fill={colorStart}
        fillOpacity={0.25}
      />
    </Svg>
    {/* Main gradient layer */}
    <Svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Defs>
        {/* Main gradient - to-br direction (135deg) */}
        <LinearGradient
          id={gradientId}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <Stop offset="0%" stopColor={colorStart} />
          <Stop offset="100%" stopColor={colorEnd} stopOpacity={0.8} />
        </LinearGradient>
      </Defs>
      {/* Rounded square with 12px border radius */}
      <Path
        d="M 12 0 H 28 Q 40 0 40 12 V 28 Q 40 40 28 40 H 12 Q 0 40 0 28 V 12 Q 0 0 12 0 Z"
        fill={`url('#${gradientId}')`}
      />
    </Svg>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </View>
  </View>
);
