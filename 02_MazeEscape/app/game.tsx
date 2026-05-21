import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { Difficulty, Direction, GameState, DIFFICULTY_CONFIGS } from '../types/game';
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
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const isAnimatingRef = useRef(false);
  const pendingDirectionRef = useRef<Direction | null>(null);
  // isBacktrack: true=remove cells, false=add cells; cells: ordered keys to update per step
  const trailUpdateRef = useRef<{ isBacktrack: boolean; cells: string[] } | null>(null);

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

  // Called by MazeBoard each time a single step animation completes.
  // stepIdx = index of movePath that just finished (pointer just arrived at movePath[stepIdx]).
  // For forward move: add trail for the cell the pointer just LEFT (movePath[stepIdx-1]).
  // For backtrack: remove trail for the cell the pointer just LEFT (cells[stepIdx]).
  const handleStepComplete = useCallback((stepIdx: number) => {
    const info = trailUpdateRef.current;
    if (!info) return;
    if (info.isBacktrack) {
      const key = info.cells[stepIdx];
      if (!key) return;
      setGameState(s => {
        const v = new Set(s.visitedCells);
        v.delete(key);
        return { ...s, visitedCells: v };
      });
    } else {
      if (stepIdx === 0) return;
      const key = info.cells[stepIdx - 1];
      if (!key) return;
      setGameState(s => {
        const v = new Set(s.visitedCells);
        v.add(key);
        return { ...s, visitedCells: v };
      });
    }
  }, []);

  const moveRef = useRef<(direction: Direction) => void>();

  const move = useCallback((direction: Direction) => {
    if (isAnimatingRef.current) {
      pendingDirectionRef.current = direction;
      return;
    }

    const prev = gameStateRef.current;
    if (prev.isComplete) return;
    const next = movePlayer(prev, direction);
    if (next === prev) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    isAnimatingRef.current = true;
    pendingDirectionRef.current = null;

    const isBacktrack = next.pathHistory.length < prev.pathHistory.length;
    const baseVisited = new Set(prev.pathHistory);

    if (isBacktrack) {
      const cellsToErase = [
        `${prev.playerPos.row},${prev.playerPos.col}`,
        ...next.lastMovePath.slice(0, -1).map(p => `${p.row},${p.col}`),
      ];
      trailUpdateRef.current = { isBacktrack: true, cells: cellsToErase };
    } else {
      trailUpdateRef.current = {
        isBacktrack: false,
        cells: next.lastMovePath.map(p => `${p.row},${p.col}`),
      };
    }

    setGameState({ ...next, visitedCells: baseVisited });
  }, []);

  moveRef.current = move;

  const handleAnimationComplete = useCallback(() => {
    isAnimatingRef.current = false;
    setGameState(s => ({ ...s, visitedCells: new Set(s.pathHistory) }));
    const pending = pendingDirectionRef.current;
    if (pending !== null) {
      pendingDirectionRef.current = null;
      moveRef.current?.(pending);
    }
  }, []);

  const restart = useCallback(() => {
    trailUpdateRef.current = null;
    isAnimatingRef.current = false;
    pendingDirectionRef.current = null;
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
              startPos={gameState.startPos}
              visitedCells={gameState.visitedCells}
              movePath={gameState.lastMovePath}
              onStepComplete={handleStepComplete}
              onAnimationComplete={handleAnimationComplete}
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
