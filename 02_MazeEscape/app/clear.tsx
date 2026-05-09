import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Difficulty, DIFFICULTY_CONFIGS } from '../types/game';
import { formatTime, loadRecords } from '../utils/gameLogic';
import { useState } from 'react';
import { BestRecord } from '../types/game';

const { width } = Dimensions.get('window');

export default function ClearScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    time: string;
    moves: string;
    difficulty: string;
  }>();

  const time = parseInt(params.time ?? '0', 10);
  const moves = parseInt(params.moves ?? '0', 10);
  const difficulty = (params.difficulty ?? 'normal') as Difficulty;

  const [best, setBest] = useState<BestRecord | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadRecords().then((records) => {
      setBest(records[difficulty] ?? null);
    });

    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
        ])
      ).start();
    });
  }, []);

  const isBestTime = best && time <= best.time;

  return (
    <SafeAreaView style={styles.container}>
      {/* 배경 글로우 */}
      <Animated.View style={[styles.bgGlow, { opacity: glowAnim }]} />

      <Animated.View
        style={[
          styles.card,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Text style={styles.emoji}>🏆</Text>
        <Text style={styles.title}>STAGE CLEAR!</Text>
        <Text style={styles.diffLabel}>
          {DIFFICULTY_CONFIGS[difficulty].label.toUpperCase()}
        </Text>

        <View style={styles.divider} />

        {/* 결과 */}
        <View style={styles.results}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>TIME</Text>
            <Text style={styles.statValue}>{formatTime(time)}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>MOVES</Text>
            <Text style={styles.statValue}>{moves}</Text>
          </View>
        </View>

        {/* 최고 기록 */}
        {best && (
          <View style={styles.bestBox}>
            <Text style={styles.bestLabel}>
              {isBestTime ? '🎉 NEW BEST RECORD!' : 'BEST'}
            </Text>
            {!isBestTime && (
              <Text style={styles.bestValue}>
                {formatTime(best.time)} · {best.moves} moves
              </Text>
            )}
          </View>
        )}

        <View style={styles.divider} />

        {/* 버튼 */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            router.replace({ pathname: '/game', params: { difficulty } })
          }
          style={styles.btnWrapper}
        >
          <LinearGradient
            colors={['#7b2ff7', '#4a6cf7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>PLAY AGAIN</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => router.replace('/')}
          activeOpacity={0.7}
        >
          <Text style={styles.menuText}>MAIN MENU</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  bgGlow: {
    position: 'absolute',
    width: width,
    height: width,
    borderRadius: width / 2,
    backgroundColor: 'rgba(0, 255, 160, 0.06)',
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 28,
    alignItems: 'center',
    gap: 16,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    color: '#e0ecff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 4,
  },
  diffLabel: {
    color: '#7b5cf7',
    fontSize: 12,
    letterSpacing: 3,
    fontWeight: '600',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  results: {
    width: '100%',
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#4a6aaa',
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '600',
  },
  statValue: {
    color: '#e0ecff',
    fontSize: 20,
    fontWeight: '700',
  },
  bestBox: {
    alignItems: 'center',
    gap: 4,
  },
  bestLabel: {
    color: '#00ffa0',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  bestValue: {
    color: '#4a6aaa',
    fontSize: 13,
  },
  btnWrapper: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#7b2ff7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  btn: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 14,
  },
  btnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 3,
  },
  menuBtn: {
    paddingVertical: 12,
  },
  menuText: {
    color: '#4a6aaa',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
  },
});
