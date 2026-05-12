import React, { useMemo, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Cell, Position, CELL_MOVE_MS } from '../types/game';
import Player from './Player';
import Goal from './Goal';

interface Props {
  maze: Cell[][];
  playerPos: Position;
  goalPos: Position;
  visitedCells: Set<string>;
  movePath: Position[];
}

const WALL = 2.5;
const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 16;

export default function MazeBoard({ maze, playerPos, goalPos, visitedCells, movePath }: Props) {
  const size = maze.length;
  const cellSize = useMemo(
    () => Math.floor((SCREEN_WIDTH - PADDING * 2) / size),
    [size]
  );
  const boardSize = cellSize * size;

  const translateX = useRef(new Animated.Value(playerPos.col * cellSize)).current;
  const translateY = useRef(new Animated.Value(playerPos.row * cellSize)).current;

  useEffect(() => {
    if (movePath.length === 0) {
      // 게임 시작 또는 재시작: 즉시 위치 이동 (애니메이션 없음)
      translateX.setValue(playerPos.col * cellSize);
      translateY.setValue(playerPos.row * cellSize);
      return;
    }

    // 경로의 각 셀을 일정 속도(CELL_MOVE_MS)로 순서대로 통과
    const anims = movePath.map(pos =>
      Animated.parallel([
        Animated.timing(translateX, {
          toValue: pos.col * cellSize,
          duration: CELL_MOVE_MS,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: pos.row * cellSize,
          duration: CELL_MOVE_MS,
          useNativeDriver: true,
        }),
      ])
    );
    Animated.sequence(anims).start();
  }, [movePath, playerPos, cellSize]);

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>
      {/* 셀 배경색 (방문 여부, 목표) */}
      {maze.map(row =>
        row.map(cell => {
          const isGoal = cell.row === goalPos.row && cell.col === goalPos.col;
          const isVisited = visitedCells.has(`${cell.row},${cell.col}`);
          return (
            <View
              key={`cell-${cell.row}-${cell.col}`}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  top: cell.row * cellSize,
                  left: cell.col * cellSize,
                  backgroundColor: isVisited ? '#d4edda' : '#f8fff8',
                },
              ]}
            >
              {isGoal && <Goal size={cellSize} />}
            </View>
          );
        })
      )}

      {/* 수평 벽: row > 0 이고 walls.top = true 인 셀의 상단 */}
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

      {/* 수직 벽: col > 0 이고 walls.left = true 인 셀의 좌측 */}
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

      {/* 플레이어: 벽 위에 렌더링 */}
      <Animated.View
        style={[
          styles.playerWrapper,
          {
            width: cellSize,
            height: cellSize,
            transform: [{ translateX }, { translateY }],
          },
        ]}
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
