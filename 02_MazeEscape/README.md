# Maze Escape

React Native + Expo로 만든 모바일 미로 퍼즐 게임입니다.

---

## 스크린샷

| 시작 화면 | 난이도 선택 | 게임 화면 | 클리어 화면 |
|:---------:|:----------:|:--------:|:---------:|
| Start | Difficulty | Game | Clear |

---

## 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 프레임워크 | React Native + Expo SDK 54 |
| 언어 | TypeScript |
| 라우팅 | Expo Router (파일 기반) |
| 제스처 | React Native Gesture Handler (스와이프 입력) |
| 애니메이션 | React Native Animated API |
| UI | Expo Linear Gradient, Expo Haptics |
| 저장소 | AsyncStorage (최고 기록 저장) |

---

## 폴더 구조

```
02_MazeEscape/
├── app/
│   ├── _layout.tsx      # 루트 레이아웃 (Expo Router)
│   ├── index.tsx        # 시작 화면
│   ├── difficulty.tsx   # 난이도 선택 화면
│   ├── game.tsx         # 게임 화면
│   └── clear.tsx        # 클리어 화면
├── components/
│   ├── MazeBoard.tsx    # 미로 렌더링 (벽 + 플레이어 애니메이션)
│   ├── Player.tsx       # 플레이어 오브
│   ├── Goal.tsx         # 목표 오브
│   ├── GameHeader.tsx   # 타이머 + 재시작 버튼
│   └── DifficultySelector.tsx
├── utils/
│   ├── mazeGenerator.ts # Recursive Backtracking 미로 생성
│   └── gameLogic.ts     # 이동 로직, 기록 저장
└── types/
    └── game.ts          # TypeScript 타입 정의
```

---

## 설치 및 실행

```bash
# 의존성 설치
npm install

# Expo 개발 서버 시작
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

---

## 게임 규칙

- **스와이프** 또는 **방향 버튼**으로 이동합니다.
- 이동 시 교차로(갈림길)가 나타날 때까지 자동으로 이동합니다.
- 현재 위치는 항상 하이라이트 표시되며, 이동 속도에 맞춰 흔적이 자연스럽게 늘어나거나 줄어듭니다.
- 벽은 통과할 수 없습니다.
- 출구(초록 오브)에 도달하면 스테이지 클리어!

---

## 난이도별 미로 크기

| 난이도 | 크기 |
|--------|------|
| Easy | 8×8 |
| Normal | 12×12 |
| Hard | 16×16 |
| Very Hard | 20×20 |

---

## 미로 생성 알고리즘

**Recursive Backtracking (DFS)** 알고리즘을 사용합니다.
- 항상 시작점에서 출구까지 유효한 경로가 존재함을 보장합니다.
- 매 게임마다 다른 미로가 생성됩니다.

---

## 수정 이력

| 날짜 | 구분 | 내용 |
|------|------|------|
| 2026-05-09 | 최초 생성 | React Native 미로 게임 프로젝트 생성 및 기본 기능 구현 |
| 2026-05-09 | 수정 | Babel 설정 및 패키지 의존성 수정 |
| 2026-05-12 | 개선 | 미로 UI 개선 및 이동 방식 변경 |
| 2026-05-13 | 개선 | 벽 코너 렌더링 개선, 되돌아가기 흔적 제거, 교차로 자동 이동, 일정 속도 애니메이션 적용 |
| 2026-05-13 | 정리 | 이동 횟수 표시 제거, 시작·클리어 화면 UI 간소화, 난이도 화면 "선택" 텍스트 제거 |
| 2026-05-13 | 개선 | 현재 위치 항상 하이라이팅, 이동 속도에 맞춰 흔적이 자연스럽게 표시·제거 |
| 2026-05-13 | 버그 수정 | 버튼 연속 입력 시 포인터 깜빡임 수정 |
| 2026-05-13 | 개선 | 포인터 이동 버퍼링 제거 (보완 필요) |
| 2026-05-21 | 버그 수정 | 교차로·벽 막힘 위치 도착 시 포인터가 한 칸 뒤로 튀는 현상 수정 |

---

## 라이선스

개인 학습 및 포트폴리오 목적의 프로젝트
