import { Cell, Position } from '../types/game';

function createGrid(size: number): Cell[][] {
  return Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, col) => ({
      row,
      col,
      walls: { top: true, right: true, bottom: true, left: true },
      visited: false,
    }))
  );
}

function getUnvisitedNeighbors(
  grid: Cell[][],
  row: number,
  col: number
): { cell: Cell; direction: 'top' | 'right' | 'bottom' | 'left' }[] {
  const size = grid.length;
  const neighbors: { cell: Cell; direction: 'top' | 'right' | 'bottom' | 'left' }[] = [];

  if (row > 0 && !grid[row - 1][col].visited)
    neighbors.push({ cell: grid[row - 1][col], direction: 'top' });
  if (col < size - 1 && !grid[row][col + 1].visited)
    neighbors.push({ cell: grid[row][col + 1], direction: 'right' });
  if (row < size - 1 && !grid[row + 1][col].visited)
    neighbors.push({ cell: grid[row + 1][col], direction: 'bottom' });
  if (col > 0 && !grid[row][col - 1].visited)
    neighbors.push({ cell: grid[row][col - 1], direction: 'left' });

  return neighbors;
}

function removeWall(
  current: Cell,
  neighbor: Cell,
  direction: 'top' | 'right' | 'bottom' | 'left'
) {
  const opposite: Record<string, 'top' | 'right' | 'bottom' | 'left'> = {
    top: 'bottom',
    right: 'left',
    bottom: 'top',
    left: 'right',
  };
  current.walls[direction] = false;
  neighbor.walls[opposite[direction]] = false;
}

// Recursive Backtracking 알고리즘으로 미로 생성
export function generateMaze(size: number): {
  maze: Cell[][];
  startPos: Position;
  goalPos: Position;
} {
  const grid = createGrid(size);
  const stack: Cell[] = [];

  const startCell = grid[0][0];
  startCell.visited = true;
  stack.push(startCell);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(grid, current.row, current.col);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const { cell: chosen, direction } =
        neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, chosen, direction);
      chosen.visited = true;
      stack.push(chosen);
    }
  }

  // 방문 플래그 초기화 (게임 중 visited 추적용으로 재사용)
  for (const row of grid) {
    for (const cell of row) {
      cell.visited = false;
    }
  }

  return {
    maze: grid,
    startPos: { row: 0, col: 0 },
    goalPos: { row: size - 1, col: size - 1 },
  };
}
