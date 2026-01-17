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

export const GradientIconBox = ({
  gradientId,
  colorStart,
  colorEnd,
  children
}: IGradientIconBoxProps) => (
  <View style={{ width: 26, height: 26, position: 'relative' }}>
    <Svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <Defs>
        <LinearGradient id={gradientId}>
          <Stop offset="5%" stopColor={colorStart} />
          <Stop offset="95%" stopColor={colorEnd} />
        </LinearGradient>
      </Defs>
      <Path
        d="M 9 0 H 17 Q 26 0 26 9 V 17 Q 26 26 17 26 H 9 Q 0 26 0 17 V 9 Q 0 0 9 0 Z"
        fill={`url('#${gradientId}')`}
      />
    </Svg>
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 26,
        height: 26,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {children}
    </View>
  </View>
);
