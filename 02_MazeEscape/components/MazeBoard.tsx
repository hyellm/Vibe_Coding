import React, { useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Cell, Position, CELL_MOVE_MS } from '../types/game';
import Player from './Player';
import Goal from './Goal';

interface Props {
  maze: Cell[][];
  playerPos: Position;
  goalPos: Position;
  startPos: Position;
  visitedCells: Set<string>;
  movePath: Position[];
  onStepComplete?: (stepIdx: number) => void;
  onAnimationComplete?: () => void;
}

const WALL = 2.5;
const TRAIL_COLOR = '#90c4a8';
const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 16;

export default function MazeBoard({
  maze, playerPos, goalPos, startPos,
  visitedCells, movePath, onStepComplete, onAnimationComplete,
}: Props) {
  const size = maze.length;
  const cellSize = useMemo(
    () => Math.floor((SCREEN_WIDTH - PADDING * 2) / size),
    [size]
  );
  const boardSize = cellSize * size;
  const dotSize = useMemo(
    () => Math.max(2, Math.round(cellSize * 2 / 15)),
    [cellSize]
  );

  const translateX = useRef(new Animated.Value(playerPos.col * cellSize)).current;
  const translateY = useRef(new Animated.Value(playerPos.row * cellSize)).current;
  const animGenerationRef = useRef(0);
  const currentStepRef = useRef<Animated.CompositeAnimation | null>(null);
  const animatingMovePathRef = useRef<Position[]>([]);
  const onStepCompleteRef = useRef(onStepComplete);
  onStepCompleteRef.current = onStepComplete;
  const onAnimationCompleteRef = useRef(onAnimationComplete);
  onAnimationCompleteRef.current = onAnimationComplete;
  const isMountedRef = useRef(false);

  // 초기 마운트 시 1회만 위치 설정
  useEffect(() => {
    if (!isMountedRef.current) {
      translateX.setValue(playerPos.col * cellSize);
      translateY.setValue(playerPos.row * cellSize);
      isMountedRef.current = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (movePath.length === 0) {
      animatingMovePathRef.current = [];
      animGenerationRef.current++;
      if (currentStepRef.current) {
        currentStepRef.current.stop();
        currentStepRef.current = null;
      }
      return;
    }

    // 같은 movePath 참조면 이미 진행 중인 애니메이션 — 재시작 차단
    if (movePath === animatingMovePathRef.current) return;
    animatingMovePathRef.current = movePath;

    animGenerationRef.current++;
    const gen = animGenerationRef.current;

    const runStep = (stepIdx: number) => {
      if (gen !== animGenerationRef.current) return;
      if (stepIdx >= movePath.length) {
        onAnimationCompleteRef.current?.();
        return;
      }
      const pos = movePath[stepIdx];
      const anim = Animated.parallel([
        Animated.timing(translateX, {
          toValue: pos.col * cellSize,
          duration: CELL_MOVE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: pos.row * cellSize,
          duration: CELL_MOVE_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]);
      currentStepRef.current = anim;
      anim.start(({ finished }) => {
        currentStepRef.current = null;
        if (!finished || gen !== animGenerationRef.current) return;
        // JS/네이티브 값 동기화 — 다음 스텝 시작 위치 보정
        translateX.setValue(pos.col * cellSize);
        translateY.setValue(pos.row * cellSize);
        onStepCompleteRef.current?.(stepIdx);
        runStep(stepIdx + 1);
      });
    };

    runStep(0);
  }, [movePath, cellSize]);

  const trailDots = useMemo(() => {
    const n = Math.max(0, Math.round(cellSize / 10) - 1);
    const dots: { key: string; x: number; y: number }[] = [];
    maze.forEach(row =>
      row.forEach(cell => {
        if (!visitedCells.has(`${cell.row},${cell.col}`)) return;
        const cx = cell.col * cellSize + cellSize / 2;
        const cy = cell.row * cellSize + cellSize / 2;
        if (
          cell.col + 1 < size &&
          !cell.walls.right &&
          visitedCells.has(`${cell.row},${cell.col + 1}`)
        ) {
          for (let i = 1; i <= n; i++) {
            dots.push({ key: `h-${cell.row}-${cell.col}-${i}`, x: cx + i * cellSize / (n + 1), y: cy });
          }
        }
        if (
          cell.row + 1 < size &&
          !cell.walls.bottom &&
          visitedCells.has(`${cell.row + 1},${cell.col}`)
        ) {
          for (let i = 1; i <= n; i++) {
            dots.push({ key: `v-${cell.row}-${cell.col}-${i}`, x: cx, y: cy + i * cellSize / (n + 1) });
          }
        }
      })
    );
    return dots;
  }, [maze, visitedCells, cellSize, size]);

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>

      {/* 셀 배경 + 트레일 중심 점 */}
      {maze.map(row =>
        row.map(cell => {
          const isGoal = cell.row === goalPos.row && cell.col === goalPos.col;
          const isStart = cell.row === startPos.row && cell.col === startPos.col;
          const isVisited = visitedCells.has(`${cell.row},${cell.col}`);
          return (
            <View
              key={`cell-${cell.row}-${cell.col}`}
              style={[styles.cell, {
                width: cellSize,
                height: cellSize,
                top: cell.row * cellSize,
                left: cell.col * cellSize,
                backgroundColor: '#f8fff8',
              }]}
            >
              {isGoal && <Goal size={cellSize} />}
              {isVisited && !isGoal && !isStart && (
                <View style={{
                  position: 'absolute',
                  width: dotSize,
                  height: dotSize,
                  borderRadius: dotSize / 2,
                  backgroundColor: TRAIL_COLOR,
                  top: (cellSize - dotSize) / 2,
                  left: (cellSize - dotSize) / 2,
                }} />
              )}
            </View>
          );
        })
      )}

      {/* 트레일 점선 (셀 중심 사이의 연결 점들) */}
      {trailDots.map(({ key, x, y }) => (
        <View
          key={key}
          style={{
            position: 'absolute',
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: TRAIL_COLOR,
            left: x - dotSize / 2,
            top: y - dotSize / 2,
          }}
        />
      ))}

      {/* 수평 벽 */}
      {maze.flatMap(row =>
        row
          .filter(cell => cell.row > 0 && cell.walls.top)
          .map(cell => (
            <View
              key={`hw-${cell.row}-${cell.col}`}
              style={{
                position: 'absolute',
                top: cell.row * cellSize,
                left: cell.col * cellSize,
                width: cellSize,
                height: WALL,
                backgroundColor: '#1e5c28',
              }}
            />
          ))
      )}

      {/* 수직 벽 */}
      {maze.flatMap(row =>
        row
          .filter(cell => cell.col > 0 && cell.walls.left)
          .map(cell => (
            <View
              key={`vw-${cell.row}-${cell.col}`}
              style={{
                position: 'absolute',
                top: cell.row * cellSize,
                left: cell.col * cellSize,
                width: WALL,
                height: cellSize,
                backgroundColor: '#1e5c28',
              }}
            />
          ))
      )}

      {/* 플레이어 */}
      <Animated.View
        style={[styles.playerWrapper, {
          width: cellSize,
          height: cellSize,
          transform: [{ translateX }, { translateY }],
        }]}
      >
        <Player size={cellSize} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    position: 'relative',
    borderWidth: WALL,
    borderColor: '#1e5c28',
    borderRadius: 4,
    overflow: 'hidden',
  },
  cell: {
    position: 'absolute',
  },
  playerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
