## 엔화 환율 확인기

실시간 JPY → KRW 환율 조회 및 최근 7일 환율 변동을 보여주는 웹페이지

---

### 주요 화면

| 항목 | 내용 |
|------|------|
| 현재 환율 | 100엔 = X원 (실시간) |
| 7일 그래프 | 최고 · 최저 · 현재 마커 포함 |
| 새로고침 버튼 | 버튼 클릭 시 즉시 재조회 |

---

### 기능

- **실시간 환율 표시** — 페이지 실행 시 자동으로 최신 JPY/KRW 환율을 불러옴
- **7일 추이 그래프** — Canvas API로 그린 라인 차트 (최고/최저 기준선 포함)
- **새로고침 버튼** — 로딩 중 스핀 애니메이션 및 비활성화 처리
- **반응형 레이아웃** — 창 크기 변경 시 그래프 자동 재렌더링
- **빌드 도구 없음** — `index.html`을 바로 브라우저에서 열어 사용 가능

---

### 기술 스택

| 분류 | 사용 기술 |
|------|-----------|
| 마크업 | HTML5 |
| 스타일 | CSS3 (Flexbox, CSS Variables, Keyframe Animation) |
| 로직 | Vanilla JavaScript (ES2020+, async/await) |
| 차트 | Canvas API (라이브러리 없음) |
| 폰트 | Google Fonts — Poppins, DM Sans |
| 환율 API 정보 | [Fawaz Ahmed Currency API](https://github.com/fawazahmed0/exchange-api) (무료, CORS 허용) |

---

### 파일 구조

```
01_CheckJPY/
├── index.html   # 레이아웃 및 마크업
├── style.css    # 전체 스타일 (카드, 버튼, 그래프 영역)
└── script.js    # 환율 API 호출, Canvas 그래프 렌더링
```

---

### 수정 이력

| 날짜 | 구분 | 내용 |
|------|------|------|
| 2026-05-04 | 최초 생성 | 프로젝트 생성, 환율 조회 기본 기능 구현 |
| 2026-05-04 | 정리 | 임시 파일 삭제 및 폴더 구조 정비 |
| 2026-05-06 | 기능 추가 | 7일 환율 추이 그래프 추가, 새로고침 버튼명 수정 |
| 2026-05-07 | 수정 | 7일 환율 변동 그래프 디자인 및 버튼 스타일 개선 |
| 2026-05-07 | 정리 | 중첩된 폴더 구조 제거, 파일을 루트로 이동 |

---

### 시작하기

별도 설치나 빌드 과정 없음

```bash
# 저장소 클론
git clone https://github.com/hyellm/Vibe_Coding.git

# 프로젝트 폴더 이동
cd Vibe_Coding/01_CheckJPY
```

이후 `index.html`을 브라우저에서 직접 열거나, VS Code의 **Live Server** 확장으로 실행합니다.

---

### 사용 API

| 항목 | 내용 |
|------|------|
| 제공처 | [fawazahmed0/exchange-api](https://github.com/fawazahmed0/exchange-api) |
| 방식 | jsDelivr CDN을 통한 GET 요청 (서버 불필요) |
| 비용 | 무료 |
| 최신 환율 | `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json` |
| 날짜별 환율 | `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@YYYY-MM-DD/v1/currencies/jpy.json` |

> KEB 하나은행 등 국내 은행 API는 서버사이드 인증 및 CORS 제한으로 브라우저에서 직접 호출이 불가합니다.

---

### 라이선스

개인 학습 및 포트폴리오 목적의 프로젝트
