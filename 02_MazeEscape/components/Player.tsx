import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface Props {
  size: number;
}

export default function Player({ size }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const orb = size * 0.5;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.25, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    ).start();
  }, [pulse]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.glow,
          {
            width: orb,
            height: orb,
            borderRadius: orb / 2,
            transform: [{ scale: pulse }],
          },
        ]}
      />
      <View
        style={[
          styles.core,
          { width: orb * 0.6, height: orb * 0.6, borderRadius: orb * 0.3 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 220, 255, 0.25)',
    shadowColor: '#00dcff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 10,
  },
  core: {
    backgroundColor: '#00dcff',
    shadowColor: '#00dcff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 12,
  },
});
