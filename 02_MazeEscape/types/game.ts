export type Difficulty = 'easy' | 'normal' | 'hard' | 'very_hard';

export interface DifficultyConfig {
  label: string;
  size: number;
}

export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: { label: 'Easy', size: 8 },
  normal: { label: 'Normal', size: 12 },
  hard: { label: 'Hard', size: 16 },
  very_hard: { label: 'Very Hard', size: 20 },
};

export interface Wall {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

export interface Cell {
  row: number;
  col: number;
  walls: Wall;
  visited: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface GameState {
  maze: Cell[][];
  playerPos: Position;
  goalPos: Position;
  startPos: Position;
  moves: number;
  elapsedSeconds: number;
  isComplete: boolean;
  difficulty: Difficulty;
  visitedCells: Set<string>;
  pathHistory: string[];    // start→current 순서 경로, 되돌아가기 감지용
  lastMovePath: Position[]; // 마지막 이동에서 통과한 셀 목록, 애니메이션용
}

export interface BestRecord {
  time: number;
  moves: number;
}

export type Records = Partial<Record<Difficulty, BestRecord>>;

export type Direction = 'up' | 'down' | 'left' | 'right';
