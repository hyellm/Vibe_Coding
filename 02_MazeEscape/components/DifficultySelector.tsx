import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Difficulty, DIFFICULTY_CONFIGS } from '../types/game';

interface Props {
  selected: Difficulty;
  onSelect: (d: Difficulty) => void;
}

const DIFFICULTIES: Difficulty[] = ['easy', 'normal', 'hard', 'very_hard'];

const ACCENT: Record<Difficulty, string> = {
  easy: '#2e7d32',
  normal: '#388e3c',
  hard: '#f57c00',
  very_hard: '#c62828',
};

export default function DifficultySelector({ selected, onSelect }: Props) {
  return (
    <View style={styles.container}>
      {DIFFICULTIES.map((d) => {
        const isSelected = d === selected;
        const color = ACCENT[d];
        const config = DIFFICULTY_CONFIGS[d];

        return (
          <TouchableOpacity
            key={d}
            style={[
              styles.option,
              isSelected && { borderColor: color, backgroundColor: `${color}18` },
            ]}
            onPress={() => onSelect(d)}
            activeOpacity={0.7}
          >
            <View style={styles.row}>
              <View style={[styles.dot, isSelected && { backgroundColor: color }]} />
              <Text style={[styles.label, isSelected && { color }]}>
                {config.label}
              </Text>
            </View>
            <Text style={styles.size}>{config.size}×{config.size}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(30,92,40,0.2)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#a5c8a5',
  },
  label: {
    color: '#3d6b3d',
    fontSize: 16,
    fontWeight: '600',
  },
  size: {
    color: '#5a8a5a',
    fontSize: 13,
    fontWeight: '500',
  },
});
