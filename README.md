# Vibe Coding

바이브 코딩으로 만든 개인 프로젝트

---

## 프로젝트 목록

| # | 프로젝트 | 분류 | 기술 스택 |
|---|----------|------|-----------|
| 01 | [CheckJPY](#01-checkjpy--엔화-환율-확인기) | 웹 유틸리티 | HTML · CSS · Vanilla JS |
| 02 | [MazeEscape](#02-mazeescape--미로-탈출-게임) | 모바일 게임 | React Native · Expo · TypeScript |
| 03 | [TinyCafe Playable](#03-tinycafe-playable--카페-아이들-게임) | 브라우저 게임 | React · TypeScript · Vite · Zustand |

---

## 01. CheckJPY — 엔화 환율 확인기

: 실시간 JPY → KRW 환율을 조회하고 최근 7일 변동 그래프를 보여주는 정적 웹페이지

- 실시간 환율 표시 및 새로고침 버튼
- Canvas API로 직접 그린 7일 라인 차트 (최고·최저 기준선 포함)
- 빌드 도구 없이 `index.html`을 브라우저에서 바로 실행 가능
- 환율 데이터: [Fawaz Ahmed Currency API](https://github.com/fawazahmed0/exchange-api) (무료·CORS 허용)

**→** [01_CheckJPY/](01_CheckJPY/)

---

## 02. MazeEscape — 미로 탈출 게임

:  React Native + Expo로 만든 모바일 미로 퍼즐 게임

- 스와이프 또는 방향 버튼으로 조작, 교차로까지 자동 이동
- Recursive Backtracking(DFS) 알고리즘으로 매 판 새로운 미로 생성
- Easy(8×8) / Normal(12×12) / Hard(16×16) / Very Hard(20×20) 네 가지 난이도
- 이동 경로 점선 표시, 최고 기록(시간) 저장(AsyncStorage)

**→** [02_MazeEscape/](02_MazeEscape/)

---

## 03. TinyCafe Playable — 플레이어블 게임

Nanali Studios의 모바일 게임 "Tiny Cafe"를 참고해 React + TypeScript로 구현한 브라우저 플레이어블 게임

- 장비 자동 생산 → 코인 슬롯 탭 수집 → 업그레이드 반복 루프
- CSS/SVG로 그린 고양이 손님 3종(나비·루나·모카)이 창밖에서 주문
- 브루 버튼 탭으로 음료 서빙 → 보너스 코인 획득
- localStorage 자동저장 + 오프라인 보상(최대 8시간)
- Zustand + persist로 상태 관리, Framer Motion 애니메이션

**→** [03_TinyCafe_Playable/](03_TinyCafe_Playable/)

---

## 라이선스

개인 학습 및 포트폴리오 목적의 프로젝트
