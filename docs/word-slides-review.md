# 단어 슬라이드 (WordIntroSlidesStage) — 개발 검토 문서

> 작성일: 2026-08-31 | 대상: 개발팀 코드 리뷰 및 kcho-dev 이식 작업 참고용

---

## 개요

핵심 어휘를 슬라이드 시퀀스로 소개하는 범용 뷰어 템플릿.  
AI 튜터 나레이션 + 오디오 자동 재생 + [이전/넘기기] 네비게이션으로 학습자가 자기 속도로 콘텐츠를 탐색한다.  
마지막 슬라이드 도달 후 [다음] 버튼이 활성화되어 다음 액티비티로 진행한다.

### 슬라이드 구성 (Min 1 ~ Max 10)

| 타입 | 설명 | Mock 슬라이드 |
|---|---|---|
| `intro` | 단어 카드 소개 (이미지+KO+VI) | 슬라이드 1 — 나라와 국적 |
| `quiz` | 선택지 퀴즈 (선택 시 정답 공개) | 슬라이드 2 — 문제1, 슬라이드 3 — 문제2/방정식 |
| `outro` | 완료 이미지 | 슬라이드 4 — excellent.png |

---

## 파일 구조

```
project-prototype-master/
├── src/screens/WordIntroSlidesStage/
│   └── index.tsx                    ← 메인 컴포넌트 (전면 재작성 2026-08-31)
├── src/data/lessonData.ts           ← WordSlide 타입 + MOCK_WORD_SLIDES
├── src/emulator/screenRegistry.ts   ← id: 'word-intro-slides', label: '2-W. 단어 슬라이드'
├── src/emulator/EmulatorShell.tsx   ← case 'word-intro-slides' (onNext/onBack)
├── assets/word-slides/
│   ├── tutor.png                    ← AI 튜터 썸네일
│   ├── vietnam-flag.png             ← 슬라이드 1 카드 이미지
│   ├── vietnam-person.png           ← 슬라이드 1 카드 이미지
│   ├── excellent.png                ← 슬라이드 4 (outro) 이미지
│   └── word-intro-{1..4}.wav       ← 각 슬라이드 오디오 나레이션
└── docs/word-slides-review.md      ← 이 문서
```

---

## 데이터 인터페이스

```ts
// src/data/lessonData.ts
export type WordSlideKind = 'intro' | 'quiz' | 'outro';

export interface WordSlide {
  kind: WordSlideKind;
  audio: string;                        // 오디오 파일 경로 (require() 결과)
  bubble: { ko: string; vi: string };   // 튜터 말풍선 텍스트
  showTutor: boolean;                   // AI 튜터 표시 여부
  badge?: { ko: string; vi: string };   // 슬라이드 상단 배지
  // intro 전용
  title?: { ko: string; vi: string };
  cards?: WordSlideCard[];              // { ko, vi, image? }
  // quiz 전용
  question?: { ko: string; vi: string };
  choices?: string[];                   // 선택지 텍스트 배열
  answer?: number;                      // 정답 인덱스 (0-based)
  equation?: WordSlideEquation;         // { left, slot, right }
  // outro 전용
  image?: string;                       // 완료 이미지 경로
}
```

---

## 컴포넌트 Props

```tsx
interface Props {
  onNext: () => void;      // [다음] 버튼 → 다음 액티비티 이동
  onBack: () => void;      // ActivityHeader ✕ → 학습 종료
  slides?: WordSlide[];    // 미전달 시 MOCK_WORD_SLIDES 사용
}
```

---

## 핵심 동작

| 동작 | 구현 방식 |
|---|---|
| 슬라이드 전환 시 오디오 자동 재생 | `useEffect([index])` → `new Audio(slide.audio).play()` + Platform.OS 웹가드 |
| 오디오 재생 실패 시 폴백 | `setNeedsTap(true)` → 스피커 버튼 색상 강조 |
| 🔊 스피커 버튼 | `audio.currentTime = 0; audio.play()` (반복 재생) |
| [이전] 클릭 시 | `stopAudio()` → `setIndex(i - 1)` |
| [넘기기] 클릭 시 | `stopAudio()` → `setIndex(i + 1)` |
| [다음] 활성화 조건 | `isLast === true` 시 `visitedLast = true` (유지됨) |
| quiz 정답 공개 | 선택지 클릭 즉시 공개 (Source B의 2.2초 자동공개 제거 — 사용자 인터랙션으로 단순화) |

---

## Source B → prototype 변경점

| 항목 | Source B (WordIntroTemplate.jsx) | prototype |
|---|---|---|
| 레이아웃 래퍼 | 커스텀 `div.wordintro-overlay` | `ActivityHeader` |
| 오디오 | `<audio>` HTML 엘리먼트 | `new Audio()` + Platform.OS 가드 |
| 스타일 | CSS 클래스 | `StyleSheet.create` + `colors` 토큰 |
| 언어 | `pick(lang, ko, vi)` (직접 prop) | `useLang()` + `pick()` |
| quiz 정답 공개 | 오디오 종료 또는 2.2초 타이머 | 선택지 클릭 즉시 |
| 프로그레스 표시 | teal 세그먼트 바 (커스텀) | `ActivityHeader` (프로토타입 표준) |
| 넘기기 네비 | 없음 | [이전] / N/총 / [넘기기] 추가 |
| [다음] 조건 | 마지막 슬라이드에서 버튼명 변경 | 마지막 슬라이드 도달 후 활성화 |

---

## kcho-dev 이식 체크리스트

### 레이아웃
- [ ] `ActivityHeader` → `ActivityLayout` (props: `step`, `totalSteps`, `showProgressBar`, `showCloseButton`, `onClose`)
- [ ] `percentage` → `step / totalSteps` 정수 쌍으로 변환

### 라우팅
- [ ] `onNext()` → `navigateToNextActivityOrLessonComplete(navigation, route)`
- [ ] `onBack()` → `navigation.goBack()` 또는 `onClose` 핸들러

### 오디오
- [ ] `new Audio()` + Platform 가드 → `useAudioPlayer()` + `resolveAudioSource(url)`
- [ ] `stopAudio()` → `useAudioPlayer`의 stop 메서드 확인

### 언어
- [ ] `useLang()` + `pick(lang, ko, vi)` → `useTranslation()` + `i18n.language === 'ko' ? ko : vi`

### 데이터
- [ ] `MOCK_WORD_SLIDES` → `getActivityQuestions(activity)`로 교체
- [ ] `question.listItems[]` 파서 작성: `itemValue`(이미지URL), `extra1`(오디오URL), `extra2`(bubble.ko), `extra3`(bubble.vi)
- [ ] 슬라이드 타입(intro/quiz/outro)은 `fieldValues` 또는 `listItem.extra4` 등 백오피스 협의 필요

### 완료 처리
- [ ] `visitedLast` → `useActivityQuestionHistory`의 `completeActivity` 호출로 교체
- [ ] `activityFinishNo` prop → `ActivityLayout`에 전달

### 등록
- [ ] `activityTemplateMap.ts`: `word_slides: { stackName: 'PreviewWordSlides', actNo: 'actXX', judgementRequired: false }` (TBD)
- [ ] `src/screens/activity/index.tsx`: barrel export 추가
- [ ] `src/navigation/Stacks.tsx`: 라우트 추가

---

## 미해결 결정사항

| 항목 | 현황 | 담당 |
|---|---|---|
| `templateCd` | `word_slides` 제안, 백오피스 미확정 | 백오피스 협의 |
| `actNo` | TBD | 백오피스 협의 |
| 슬라이드 타입 API 매핑 | `intro/quiz/outro` → listItem 필드 미확정 | 개발+백오피스 |
| 실제 슬라이드 이미지 | 현재 구성 요소 이미지(flag/person/excellent)로 코드 렌더링 | 디자인팀 |
| quiz 타임 자동 공개 | Source B 2.2초 자동공개 제거, 선택 즉시 공개로 단순화 — 재검토 가능 | 기획 확인 |
