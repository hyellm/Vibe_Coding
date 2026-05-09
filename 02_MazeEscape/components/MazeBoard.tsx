import React, { useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Cell, Position } from '../types/game';
import Player from './Player';
import Goal from './Goal';

interface Props {
  maze: Cell[][];
  playerPos: Position;
  goalPos: Position;
  visitedCells: Set<string>;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 16;

export default function MazeBoard({ maze, playerPos, goalPos, visitedCells }: Props) {
  const size = maze.length;
  const cellSize = useMemo(
    () => Math.floor((SCREEN_WIDTH - PADDING * 2) / size),
    [size]
  );

  const boardSize = cellSize * size;

  return (
    <View style={[styles.board, { width: boardSize, height: boardSize }]}>
      {maze.map((row) =>
        row.map((cell) => {
          const isPlayer = cell.row === playerPos.row && cell.col === playerPos.col;
          const isGoal = cell.row === goalPos.row && cell.col === goalPos.col;
          const isVisited = visitedCells.has(`${cell.row},${cell.col}`);

          return (
            <View
              key={`${cell.row}-${cell.col}`}
              style={[
                styles.cell,
                {
                  width: cellSize,
                  height: cellSize,
                  top: cell.row * cellSize,
                  left: cell.col * cellSize,
                  backgroundColor: isVisited ? '#1a2a3a' : '#0d1520',
                  borderTopWidth: cell.walls.top ? 1.5 : 0,
                  borderRightWidth: cell.walls.right ? 1.5 : 0,
                  borderBottomWidth: cell.walls.bottom ? 1.5 : 0,
                  borderLeftWidth: cell.walls.left ? 1.5 : 0,
                },
              ]}
            >
              {isPlayer && <Player size={cellSize} />}
              {isGoal && !isPlayer && <Goal size={cellSize} />}
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    position: 'relative',
    borderWidth: 2,
    borderColor: '#2a4a6a',
    borderRadius: 4,
    overflow: 'hidden',
  },
  cell: {
    position: 'absolute',
    borderColor: '#1e3a5a',
  },
});
