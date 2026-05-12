import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatTime } from '../utils/gameLogic';

interface Props {
  elapsedSeconds: number;
  moves: number;
  onRestart: () => void;
}

export default function GameHeader({ elapsedSeconds, moves, onRestart }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.label}>시간</Text>
        <Text style={styles.value}>{formatTime(elapsedSeconds)}</Text>
      </View>

      <TouchableOpacity style={styles.restartBtn} onPress={onRestart} activeOpacity={0.7}>
        <Text style={styles.restartText}>↺ 재시작</Text>
      </TouchableOpacity>

      <View style={styles.stat}>
        <Text style={styles.label}>이동</Text>
        <Text style={styles.value}>{moves}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(30,92,40,0.15)',
  },
  stat: {
    alignItems: 'center',
    minWidth: 80,
  },
  label: {
    color: '#3d6b3d',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  value: {
    color: '#1a3a1a',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  restartBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(30,92,40,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(30,92,40,0.25)',
  },
  restartText: {
    color: '#2e7d32',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
