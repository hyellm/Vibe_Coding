import AsyncStorage from '@react-native-async-storage/async-storage';
import { Direction, Difficulty, GameState, Position, Records, BestRecord } from '../types/game';

const STORAGE_KEY = 'maze_escape_records';
const LAST_DIFFICULTY_KEY = 'maze_escape_last_difficulty';

export function canMove(state: GameState, direction: Direction): boolean {
  const { maze, playerPos } = state;
  const { row, col } = playerPos;
  const cell = maze[row][col];

  switch (direction) {
    case 'up':    return !cell.walls.top;
    case 'down':  return !cell.walls.bottom;
    case 'left':  return !cell.walls.left;
    case 'right': return !cell.walls.right;
  }
}

export function getNextPosition(pos: Position, direction: Direction): Position {
  switch (direction) {
    case 'up':    return { row: pos.row - 1, col: pos.col };
    case 'down':  return { row: pos.row + 1, col: pos.col };
    case 'left':  return { row: pos.row, col: pos.col - 1 };
    case 'right': return { row: pos.row, col: pos.col + 1 };
  }
}

export function movePlayer(state: GameState, direction: Direction): GameState {
  if (!canMove(state, direction)) return state;

  const nextPos = getNextPosition(state.playerPos, direction);
  const cellKey = `${nextPos.row},${nextPos.col}`;
  const newVisited = new Set(state.visitedCells);
  newVisited.add(cellKey);

  const isComplete =
    nextPos.row === state.goalPos.row && nextPos.col === state.goalPos.col;

  return {
    ...state,
    playerPos: nextPos,
    moves: state.moves + 1,
    visitedCells: newVisited,
    isComplete,
  };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}m ${s}s`;
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
