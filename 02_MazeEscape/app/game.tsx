import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Difficulty, Direction, GameState, DIFFICULTY_CONFIGS, CELL_MOVE_MS } from '../types/game';
import { generateMaze } from '../utils/mazeGenerator';
import { movePlayer, saveRecord } from '../utils/gameLogic';
import MazeBoard from '../components/MazeBoard';
import GameHeader from '../components/GameHeader';

const SWIPE_THRESHOLD = 20;

function buildInitialState(difficulty: Difficulty): GameState {
  const { size } = DIFFICULTY_CONFIGS[difficulty];
  const { maze, startPos, goalPos } = generateMaze(size);
  const startKey = `${startPos.row},${startPos.col}`;
  return {
    maze,
    playerPos: startPos,
    goalPos,
    startPos,
    moves: 0,
    elapsedSeconds: 0,
    isComplete: false,
    difficulty,
    visitedCells: new Set([startKey]),
    pathHistory: [startKey],
    lastMovePath: [],
  };
}

export default function GameScreen() {
  const { difficulty } = useLocalSearchParams<{ difficulty: Difficulty }>();
  const router = useRouter();
  const diff: Difficulty = difficulty ?? 'normal';

  const [gameState, setGameState] = useState<GameState>(() => buildInitialState(diff));
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const eraseTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  useEffect(() => () => { eraseTimersRef.current.forEach(clearTimeout); }, []);

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
    const prev = gameStateRef.current;
    const next = movePlayer(prev, direction);
    if (next === prev) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // 진행 중인 흔적 제거 애니메이션 취소
    eraseTimersRef.current.forEach(clearTimeout);
    eraseTimersRef.current = [];

    const isBacktrack = next.pathHistory.length < prev.pathHistory.length;

    // pathHistory 기준으로 올바른 시작 상태 복원 (취소된 애니메이션 잔여 셀 정리)
    const baseVisited = new Set(prev.pathHistory);

    if (isBacktrack) {
      setGameState({ ...next, visitedCells: baseVisited });

      // 포인터가 셀을 떠나는 순서대로 제거 — 목적지는 포인터가 도착하므로 유지
      const cellsToErase = [
        `${prev.playerPos.row},${prev.playerPos.col}`,
        ...next.lastMovePath.slice(0, -1).map(p => `${p.row},${p.col}`),
      ];

      cellsToErase.forEach((key, idx) => {
        const t = setTimeout(() => {
          setGameState((s) => {
            const v = new Set(s.visitedCells);
            v.delete(key);
            return { ...s, visitedCells: v };
          });
        }, (idx + 1) * CELL_MOVE_MS);
        eraseTimersRef.current.push(t);
      });
    } else {
      setGameState({ ...next, visitedCells: baseVisited });

      // 포인터가 셀에 도착하는 순서대로 추가 — 목적지도 도착 시 하이라이팅
      next.lastMovePath.forEach((pos, idx) => {
        const key = `${pos.row},${pos.col}`;
        const t = setTimeout(() => {
          setGameState((s) => {
            const v = new Set(s.visitedCells);
            v.add(key);
            return { ...s, visitedCells: v };
          });
        }, (idx + 1) * CELL_MOVE_MS);
        eraseTimersRef.current.push(t);
      });
    }
  }, []);

  const restart = useCallback(() => {
    eraseTimersRef.current.forEach(clearTimeout);
    eraseTimersRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState(buildInitialState(diff));
  }, [diff]);

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
          onRestart={restart}
        />

        <GestureDetector gesture={swipe}>
          <View style={styles.mazeWrapper}>
            <MazeBoard
              maze={gameState.maze}
              playerPos={gameState.playerPos}
              goalPos={gameState.goalPos}
              visitedCells={gameState.visitedCells}
              movePath={gameState.lastMovePath}
            />
          </View>
        </GestureDetector>

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
    backgroundColor: '#e8f5e3',
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
    color: '#3d6b3d',
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
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(30,92,40,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dirText: {
    color: '#2e7d32',
    fontSize: 18,
  },
  dirCenter: {
    width: 56,
    height: 56,
  },
});
