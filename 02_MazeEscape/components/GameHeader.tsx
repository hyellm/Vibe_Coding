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
        <Text style={styles.label}>TIME</Text>
        <Text style={styles.value}>{formatTime(elapsedSeconds)}</Text>
      </View>

      <TouchableOpacity style={styles.restartBtn} onPress={onRestart} activeOpacity={0.7}>
        <Text style={styles.restartText}>↺ RESTART</Text>
      </TouchableOpacity>

      <View style={styles.stat}>
        <Text style={styles.label}>MOVES</Text>
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
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  stat: {
    alignItems: 'center',
    minWidth: 80,
  },
  label: {
    color: '#6a8aaa',
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '600',
  },
  value: {
    color: '#e0f0ff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  restartBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(120, 80, 200, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(150, 100, 230, 0.4)',
  },
  restartText: {
    color: '#c0a0ff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
