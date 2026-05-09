import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Difficulty, Direction, GameState, DIFFICULTY_CONFIGS } from '../types/game';
import { generateMaze } from '../utils/mazeGenerator';
import { movePlayer, saveRecord } from '../utils/gameLogic';
import MazeBoard from '../components/MazeBoard';
import GameHeader from '../components/GameHeader';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = 20;

function buildInitialState(difficulty: Difficulty): GameState {
  const { size } = DIFFICULTY_CONFIGS[difficulty];
  const { maze, startPos, goalPos } = generateMaze(size);
  return {
    maze,
    playerPos: startPos,
    goalPos,
    startPos,
    moves: 0,
    elapsedSeconds: 0,
    isComplete: false,
    difficulty,
    visitedCells: new Set([`${startPos.row},${startPos.col}`]),
  };
}

export default function GameScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: Difficulty }>();
  const router = useRouter();
  const diff: Difficulty = difficulty ?? 'normal';

  const [gameState, setGameState] = useState<GameState>(() => buildInitialState(diff));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 타이머
  useEffect(() => {
    if (gameState.isComplete) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setGameState((prev) =>
        prev.isComplete ? prev : { ...prev, elapsedSeconds: prev.elapsedSeconds + 1 }
      );
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.isComplete]);

  // 클리어 시 기록 저장 후 화면 이동
  useEffect(() => {
    if (!gameState.isComplete) return;
    saveRecord(diff, gameState.elapsedSeconds, gameState.moves);
    const timeout = setTimeout(() => {
      router.replace({
        pathname: '/clear',
        params: {
          time: gameState.elapsedSeconds,
          moves: gameState.moves,
          difficulty: diff,
        },
      });
    }, 600);
    return () => clearTimeout(timeout);
  }, [gameState.isComplete]);

  const move = useCallback((direction: Direction) => {
    setGameState((prev) => {
      const next = movePlayer(prev, direction);
      if (next !== prev) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      return next;
    });
  }, []);

  const restart = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState(buildInitialState(diff));
  }, [diff]);

  // 스와이프 제스처
  const swipe = Gesture.Pan()
    .runOnJS(true)
    .onEnd((e) => {
      const { translationX: dx, translationY: dy } = e;
      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        move(dx > 0 ? 'right' : 'left');
      } else {
        move(dy > 0 ? 'down' : 'up');
      }
    });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.diffLabel}>
          {DIFFICULTY_CONFIGS[diff].label.toUpperCase()}
        </Text>

        <GameHeader
          elapsedSeconds={gameState.elapsedSeconds}
          moves={gameState.moves}
          onRestart={restart}
        />

        <GestureDetector gesture={swipe}>
          <View style={styles.mazeWrapper}>
            <MazeBoard
              maze={gameState.maze}
              playerPos={gameState.playerPos}
              goalPos={gameState.goalPos}
              visitedCells={gameState.visitedCells}
            />
          </View>
        </GestureDetector>

        {/* 방향 버튼 */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.dirBtn} onPress={() => move('up')}>
            <Text style={styles.dirText}>▲</Text>
          </TouchableOpacity>
          <View style={styles.middleRow}>
            <TouchableOpacity style={styles.dirBtn} onPress={() => move('left')}>
              <Text style={styles.dirText}>◀</Text>
            </TouchableOpacity>
            <View style={styles.dirCenter} />
            <TouchableOpacity style={styles.dirBtn} onPress={() => move('right')}>
              <Text style={styles.dirText}>▶</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.dirBtn} onPress={() => move('down')}>
            <Text style={styles.dirText}>▼</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    alignItems: 'center',
    gap: 16,
  },
  diffLabel: {
    color: '#4a6aaa',
    fontSize: 11,
    letterSpacing: 4,
    fontWeight: '600',
  },
  mazeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controls: {
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dirBtn: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirText: {
    color: '#8090b0',
    fontSize: 18,
  },
  dirCenter: {
    width: 56,
    height: 56,
  },
});
