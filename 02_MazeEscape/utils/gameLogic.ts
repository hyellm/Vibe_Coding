import AsyncStorage from '@react-native-async-storage/async-storage';
import { Direction, Difficulty, GameState, Position, Records, BestRecord, Cell } from '../types/game';

const STORAGE_KEY = 'maze_escape_records';
const LAST_DIFFICULTY_KEY = 'maze_escape_last_difficulty';

function getWall(cell: Cell, direction: Direction): boolean {
  switch (direction) {
    case 'up':    return cell.walls.top;
    case 'down':  return cell.walls.bottom;
    case 'left':  return cell.walls.left;
    case 'right': return cell.walls.right;
  }
}

function oppositeDir(d: Direction): Direction {
  switch (d) {
    case 'up':    return 'down';
    case 'down':  return 'up';
    case 'left':  return 'right';
    case 'right': return 'left';
  }
}

export function canMove(state: GameState, direction: Direction): boolean {
  const cell = state.maze[state.playerPos.row][state.playerPos.col];
  return !getWall(cell, direction);
}

export function getNextPosition(pos: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':    return { row: pos.row - 1, col: pos.col };
    case 'down':  return { row: pos.row + 1, col: pos.col };
    case 'left':  return { row: pos.row, col: pos.col - 1 };
    case 'right': return { row: pos.row, col: pos.col + 1 };
  }
}

const ALL_DIRS: Direction[] = ['up', 'down', 'left', 'right'];

// 버튼 입력 방향에서 출발해, 코너를 포함해 교차로(또는 막힘·골)까지의 경로를 반환
function computeMovePath(
  maze: Cell[][],
  playerPos: Position,
  goalPos: Position,
  direction: Direction,
): Position[] {
  const path: Position[] = [];
  let currentPos = playerPos;
  let moveDir = direction;

  while (true) {
    const currentCell = maze[currentPos.row][currentPos.col];
    if (getWall(currentCell, moveDir)) break;

    const nextPos = getNextPosition(currentPos, moveDir);
    path.push(nextPos);
    currentPos = nextPos;

    if (nextPos.row === goalPos.row && nextPos.col === goalPos.col) break;

    const backDir = oppositeDir(moveDir);
    const nextCell = maze[nextPos.row][nextPos.col];
    const exits = ALL_DIRS.filter(d => d !== backDir && !getWall(nextCell, d));

    if (exits.length !== 1) break; // 0=막힌 곳, 2+=교차로 → 정지
    moveDir = exits[0];            // 유일한 출구 방향으로 계속 진행
  }

  return path;
}

export function movePlayer(state: GameState, direction: Direction): GameState {
  const movePath = computeMovePath(
    state.maze, state.playerPos, state.goalPos, direction,
  );

  if (movePath.length === 0) return state;

  const targetPos = movePath[movePath.length - 1];
  const firstKey = `${movePath[0].row},${movePath[0].col}`;

  let newPathHistory: string[];
  let newVisitedCells: Set<string>;

  const pathSet = new Set(state.pathHistory);
  if (pathSet.has(firstKey)) {
    // 되돌아가는 이동: 목적지까지 pathHistory를 잘라내고 흔적 제거
    const destKey = `${targetPos.row},${targetPos.col}`;
    const idx = state.pathHistory.lastIndexOf(destKey);
    newPathHistory = idx >= 0
      ? state.pathHistory.slice(0, idx + 1)
      : state.pathHistory;
    newVisitedCells = new Set(newPathHistory);
  } else {
    // 새 영역으로 전진: 경로에 추가
    const addedKeys = movePath.map(p => `${p.row},${p.col}`);
    newPathHistory = [...state.pathHistory, ...addedKeys];
    newVisitedCells = new Set([...state.visitedCells, ...addedKeys]);
  }

  const isComplete =
    targetPos.row === state.goalPos.row && targetPos.col === state.goalPos.col;

  return {
    ...state,
    playerPos: targetPos,
    moves: state.moves + 1,
    visitedCells: newVisitedCells,
    pathHistory: newPathHistory,
    lastMovePath: movePath,
    isComplete,
  };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}분 ${s}초`;
}

export async function loadRecords(): Promise<Records> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveRecord(
  difficulty: Difficulty,
  time: number,
  moves: number
): Promise<void> {
  try {
    const records = await loadRecords();
    const existing: BestRecord | undefined = records[difficulty];

    const isBetter =
      !existing ||
      time < existing.time ||
      (time === existing.time && moves < existing.moves);

    if (isBetter) {
      records[difficulty] = { time, moves };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }
  } catch {
    // 저장 실패 시 무시
  }
}

export async function loadLastDifficulty(): Promise<Difficulty | null> {
  try {
    const raw = await AsyncStorage.getItem(LAST_DIFFICULTY_KEY);
    return raw as Difficulty | null;
  } catch {
    return null;
  }
}

export async function saveLastDifficulty(difficulty: Difficulty): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_DIFFICULTY_KEY, difficulty);
  } catch {
    // 무시
  }
}
