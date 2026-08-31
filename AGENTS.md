# 프로젝트 에이전트 가이드

> 이 파일은 Claude Code, Antigravity, Codex 등 **모든 AI 에이전트**가 읽는 마스터 가이드다.
> 코드 작성 전에 반드시 읽고 따른다.

---

## 1. 저장소 구조 (Three-Layer Architecture)

```
Source B (콘텐츠 원본)                기획·콘텐츠 검증용 레퍼런스
C:\dev\kchao-lesson1-feature-*        React 19 + Vite + DOM/CSS
        ↓ 콘텐츠·로직 이식
Prototype (UI 미리보기)               화면 디자인 검증 + kcho-dev 이식 준비
C:\dev\project-prototype-master       Expo 57 / React Native Web
        ↓ RN 컴포넌트 이식
Production (실제 앱)                  프로덕션 빌드
C:\dev\kcho-dev                       React Native 0.83 bare + Expo 55
```

**이 저장소(`project-prototype-master`)는 2단계 Prototype이다.**
모든 작업은 3단계(`kcho-dev`) 이식을 전제로 설계되어야 한다.

---

## 2. Expo 버전 주의

Expo API가 버전마다 다르다. 코드 작성 전 **반드시** 버전 문서를 확인한다.

```
https://docs.expo.dev/versions/v57.0.0/
```

---

## 3. 프로토타입 핵심 파일

| 파일 | 역할 |
|---|---|
| `src/emulator/screenRegistry.ts` | `BASE_SCREEN_REGISTRY` — 화면 목록 메타데이터 |
| `src/emulator/EmulatorShell.tsx` | `ScreenRenderer` switch — screenId → 컴포넌트 매핑 |
| `src/data/lessonData.ts` | Mock 데이터 (API 구조 모사) |
| `src/components/ActivityHeader.tsx` | 진행바 + 닫기 버튼 (모든 액티비티 화면에 사용) |
| `src/components/LangContext.tsx` | `useLang()`, `pick(lang, ko, vi)` |
| `src/theme/colors.ts` | 디자인 토큰 (하드코딩 금지) |
| `docs/` | AI 간 핸드오프 문서 (필수 생성) |

---

## 4. 코딩 규칙

### 4-1. 레이아웃 (ActivityHeader)
```tsx
import ActivityHeader from '../../components/ActivityHeader';
// percentage: 0~100 숫자. onClose: 뒤로가기 핸들러.
<ActivityHeader percentage={50} onClose={onBack} />
```

### 4-2. 오디오 (웹 전용 가드 필수)
```tsx
import { Platform } from 'react-native';
// Platform 가드 없이 new Audio() 사용 금지.
useEffect(() => {
  if (Platform.OS !== 'web') return;
  const audio = new Audio(require('../../../assets/sounds/file.wav') as string);
  audioRef.current = audio;
  audio.play().catch(() => setNeedsTap(true));
  audio.onended = () => { /* 다음 동작 */ };
  return () => { audioRef.current?.pause(); audioRef.current = null; };
}, []);
```

### 4-3. 다국어
```tsx
import { useLang, pick } from '../../components/LangContext';
const { lang } = useLang();
const title = pick(lang, '한국어', 'Tiếng Việt');
```

### 4-4. 색상 — 하드코딩 절대 금지
```tsx
import { colors } from '../../theme';
// ✅ 올바름
backgroundColor: colors.canvas
// ❌ 금지
backgroundColor: '#f5f8f8'
```

### 4-5. Mock 데이터 — kcho-dev API 구조 모사 (중요)
```ts
// kcho-dev에서 백오피스 API는 question.listItems[] 구조를 사용한다.
// Mock 데이터도 이 구조를 미리 모사해야 이식 비용이 줄어든다.
export const MOCK_EXAMPLE = [
  { itemValue: '베트남', extra1: '/images/flag.png', extra2: 'Việt Nam', itemOrd: 1 },
];
```

### 4-6. 화면 컴포넌트 props 시그니처
```tsx
// 모든 화면은 onNext/onBack props를 받는다.
// kcho-dev 이식 시 navigation 객체로 교체된다.
interface Props { onNext: () => void; onBack: () => void; }
```

---

## 5. 파일 수정 규칙 (멀티 AI 충돌 방지)

| 파일 | 규칙 |
|---|---|
| `screenRegistry.ts` | `BASE_SCREEN_REGISTRY` 배열 **말미에 append만**. 기존 항목 재정렬 금지. |
| `EmulatorShell.tsx` | import 블록 **끝에 추가**, case **default: 바로 위에 추가**. 기존 case 수정 금지. |
| `lessonData.ts` | 파일 **말미에** 새 export 블록 추가. 기존 SESSION1 객체 내부 수정 금지. |
| `src/theme/colors.ts` | 토큰 **추가만** 허용. 기존 토큰 값 변경은 디자인 담당자 확인 후. |

---

## 6. ScreenMeta 등록 형식

```ts
{
  id: 'kebab-case-id',
  label: 'N-X. 화면명',         // 숫자 prefix — ScreenComboBox가 자동 정렬
  category: '신규',              // '신규' | '수정' | '기존'
  description: '한 줄 설명',
  devNotes: `
    - kcho-dev 목적지: src/screens/activity/preview/Preview<Name>.tsx
    - templateCd: word_intro_slides (TBD)
    - ActivityLayout으로 교체 필요 (step/totalSteps)
    - audio: useAudioPlayer() + resolveAudioSource()
  `,
  designNotes: 'UX 흐름 설명',
  sourceBRef: 'WordIntroStage',  // Source B 컴포넌트명
  sourceAFile: 'TBD',            // kcho-dev 목적지 파일 (확정 전 TBD)
}
```

---

## 7. kcho-dev 이식 대응표

| prototype | kcho-dev | 처리 방법 |
|---|---|---|
| `ActivityHeader` | `ActivityLayout` | props 교체: percentage → step/totalSteps |
| `new Audio()` + Platform가드 | `useAudioPlayer()` + `resolveAudioSource()` | 훅 교체 |
| `pick(lang, ko, vi)` | `useTranslation()` + `i18n.language` | i18n 키 추가 |
| `onNext()` | `navigateToNextActivityOrLessonComplete` | 라우팅 유틸 사용 |
| Mock 상수 | `question.listItems[]` 파서 | `buildQuizItems` 패턴 참조 |
| 완료 없음 | `recordQuestionAttempt` + `completeActivity` | `useActivityQuestionHistory` |
| `screenRegistry` 등록 | `activityTemplateMap.ts` + `Stacks.tsx` | templateCd 백오피스 협의 |

---

## 8. 핸드오프 문서 (docs/) — 필수

화면을 신규 추가할 때는 **반드시** `docs/<name>-review.md`를 생성한다.
다른 AI가 대화 맥락 없이 이 문서만 읽고 이식 작업을 할 수 있어야 한다.

**최소 포함 내용:**
- 개요 (화면 목적, 슬라이드/스텝 구성)
- 파일 구조 (prototype 기준)
- 데이터 인터페이스 (TypeScript 타입)
- Source B → prototype 변경점
- kcho-dev 이식 체크리스트
- 미해결 결정사항 (templateCd, actNo 등)

기존 예시: `docs/bridge-stage-review.md`

---

## 9. 사용 가능한 전문 에이전트

| 에이전트 | 호출 방법 | 용도 |
|---|---|---|
| `screen-registrar` | Agent 도구로 호출 | 신규 화면 등록 (5단계 전체) |
| `transplant-planner` | Agent 도구로 호출 | kcho-dev 이식 계획 분석 |
| `design-reviewer` | Agent 도구로 호출 | UI/UX/색상 변경 검토 및 적용 |

---

## 10. 절대 금지

- 하드코딩 색상값 (`#xxxxxx`)
- Platform 가드 없이 `new Audio()` 사용
- 기존 화면 코드 무단 수정 (요청 없는 리팩토링)
- 핸드오프 문서 없이 신규 화면 등록 완료 선언
- `docs/` 파일 삭제 또는 덮어쓰기 (append/update만)
