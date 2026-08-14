# 프로토타입 전체 이식 검토 문서 (1~10번 템플릿)

> 작성일: 2026-08-14 | 대상: 개발팀 Source A 이식 작업 참고용  
> 참조 경로: `C:\dev\kchao_reproto\source-a-app`

---

## Source A 공통 구조 참조

### ActivityLayout 주요 Props

| prop | 타입 | 기본값 | 설명 |
|---|---|---|---|
| `step` | `number` | `1` | 현재 진행 단계 (ProgressBar 계산용) |
| `totalSteps` | `number` | `1` | 전체 단계 수 |
| `showBackButton` | `boolean` | `true` | 뒤로가기 버튼 (onBack 없으면 미렌더링) |
| `showCloseButton` | `boolean` | `false` | X 닫기 버튼 |
| `showSkipButton` | `boolean` | `false` | 건너뛰기 버튼 (**ActivityLayout 내부에서 강제 true 전달**) |
| `showConfirmButton` | `boolean` | `false` | 공통 확인 버튼 노출 |
| `confirmText` | `string` | `t('common.confirm')` | 확인 버튼 문구 |
| `confirmDisabled` | `boolean` | `false` | 확인 버튼 비활성화 |
| `onPressConfirm` | `() => void` | — | 확인 버튼 핸들러 |
| `onClose` | `() => void` | — | 닫기 버튼 핸들러 |
| `onBack` | `() => void` | — | 뒤로가기 핸들러 |
| `useScrollView` | `boolean` | `true` | 스크롤 레이아웃 |
| `bottomContent` | `ReactNode` | — | 하단 고정 영역 (확인 버튼 대체) |
| `containerStyle` | `StyleProp<ViewStyle>` | — | 배경색 등 오버라이드 |
| `activityFinishNo` | `number \| null` | — | ABANDONED 전송용 |
| `children` | `ReactNode` | — | 본문 콘텐츠 |

기본 배경색: `#F4F5F7`

### API 데이터 구조 (`src/api/kchao/learning.ts`)

```ts
type ActivityNode = {
  activityVersionNo: number;
  activityNo: number;
  templateCd: string;       // 화면 라우팅 키
  fieldValues?: Record<string, string>;           // 스칼라 값
  listItems?: Record<string, QuestionItemDto[]>;  // 리스트 값
  questions?: QuestionNode[];
};

type QuestionNode = {
  activityQuestionNo: number;
  fieldValues?: Record<string, string>;
  listItems?: Record<string, QuestionItemDto[]>;
};

type QuestionItemDto = {
  itemKey?: string;
  itemValue: string;
  itemOrd: number;
};
```

### 완료 이력 패턴 (`useActivityQuestionHistory`)

```ts
const { activityFinishNo, recordQuestionAttempt, completeActivity } =
  useActivityQuestionHistory({
    memberNo,
    activityVersionNo: activity?.activityVersionNo,
    questionKey: currentIndex,  // 문항 전환 시 타이머 리셋
  });

// 문항 제출
await recordQuestionAttempt({
  activityQuestionNo: question.activityQuestionNo,
  answerValue: answer,
  isCorrect: 'Y' | 'N',
  score: 100,
});

// 액티비티 완료
await completeActivity({ statusCd: 'COMPLETED' });
```

### 네비게이션 패턴

```ts
// CTA 완료 시
navigateToNextActivityOrLessonComplete(navigation, route.params, route.name);
```

### 다국어

Source A 전체는 `react-i18next` 사용. 프로토타입의 `useLang/pick()` 패턴과 불일치.

```ts
// Source A
const { t } = useTranslation();
t('common.confirm')           // "확인"
t('activity.common.skip')     // "건너뛰기"

// 프로토타입 (이식 시 전환 필요)
pick(lang, '확인', 'Xác nhận')
```

### 폰트 / 색상

```ts
// 폰트 (src/constants/fonts.ts)
fontFamily: fonts.pretendard[700]   // 'Pretendard-Bold'

// 색상 (src/constants/colors.ts)
COLORS.background   // '#F4F5F7'
COLORS.gray900      // '#1E1E1E'
COLORS.green500     // '#00C37D'
COLORS.red500       // '#F04438'
```

### templateCd 등록 현황 (`activityTemplateMap.ts`)

현재 등록된 주요 templateCd:

| templateCd | 화면 컴포넌트 | act코드 |
|---|---|---|
| `intro_lesson` | PreviewIntro4 | act31 |
| `activity_divider` | PreviewIntro5 | act32 |
| `scramble_word` | WordLetterScramble5 | act23 |
| `scramble_words` | WordScramble4 | act24 |
| `sentence_puzzle` | SentenceScramble3 | act08 |
| `sentence_completion` | SentenceTyping4 | act09 |
| `study_video` | PreviewVideo2 | act14 |
| `word_pronuciation` | WordPronunciation1 | act02 |

---

## 화면별 이식 검토

### 판정 기준

- ✅ 문제 없음 — 이식 시 변경 최소
- ⚠️ 주의 필요 — 수정 필요하나 구조적으로 가능
- ❌ 문제 있음 — 재구현 또는 협의 필요

---

### 1. 나의 코스 (`HomeScreen`)

**Source A 대응**: 홈 화면 — 액티비티 템플릿 아님, 별도 분류

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 레이아웃 | 커스텀 View + ScrollView. ActivityLayout 미사용 | ✅ | 홈 화면은 ActivityLayout 비적용 유지 |
| 헤더 | 인라인 커스텀 헤더. ActivityHeader 미사용 | ✅ | 홈 화면 전용 헤더 유지 |
| 하단 네비 | `BottomNav` 컴포넌트 사용 | ⚠️ | Source A BottomNav 컴포넌트로 교체 |
| 데이터 | `SESSIONS`, `LESSON` 모듈 상수 직접 참조. data prop 없음 | ⚠️ | API 응답 기반 세션 목록으로 교체 |
| 다국어 | `useLang/pick()` + `Vi` suffix 필드 | ⚠️ | `useTranslation` + i18n key 전환 |
| 학습 이력 | 없음 (홈이므로 불필요) | ✅ | — |
| 진행률 | `sessions` prop으로 수신, 퍼센트 계산 인라인 | ⚠️ | API 응답 기반 동적 계산으로 교체 |

---

### 2. 학습 미션 (`MissionStage`)

**Source A 대응**: 신규 템플릿 (templateCd 미등록)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>` + 내부 `<ScrollView>`. 배경 `#FFFFFF` | ⚠️ | `<ActivityLayout containerStyle={{ backgroundColor: '#FFFFFF' }}>` |
| 헤더 | `ActivityHeader percentage={progressPct}` | ⚠️ | `step` / `totalSteps` 정수 쌍으로 교체 |
| 닫기/뒤로가기 | `onClose={onBack}` (X 버튼에 onBack 매핑) | ⚠️ | `showBackButton={true} onBack={onBack}` 또는 `showCloseButton` 명확히 분리 |
| CTA 버튼 | `pick(lang,'다음 →','Tiếp theo →')` 하드코딩 | ⚠️ | `confirmText` prop 또는 i18n key 전환 |
| 데이터 | `SESSION1.mission` 상수 직접 참조. data prop 없음 | ❌ | `fieldValues.MISSION_TEXT_KO/VI`, `listItems.MISSION_ITEMS` 등으로 주입 구조 필요 |
| 다국어 | `useLang/pick()` + `.ko/.vi` 필드 | ⚠️ | `useTranslation` 전환 |
| 학습 이력 | 없음 | ❌ | `completeActivity` 호출 추가 필요 |
| templateCd | 미등록 | ❌ | ADMIN 협의 후 신규 templateCd 등록 필요 |

---

### 3. 오늘의 단어장 (`VocabWordbookStage`)

**Source A 대응**: `word_pronuciation` → `WordPronunciation1` (act02)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>` + `<ScrollView>`. 배경 `#FFFFFF` | ⚠️ | `<ActivityLayout>` 교체 |
| 헤더 | **인라인 커스텀 헤더** (ActivityHeader 미사용) | ❌ | ActivityHeader 또는 ActivityLayout 헤더로 교체 |
| 오디오 재생 | **`window.speechSynthesis` 웹 전용 API** | ❌ | 네이티브 오디오 라이브러리(Sound 등)로 교체 필수 |
| CTA 버튼 | "단어 발음하기" / "바로 문제 풀기" 2개 (하드코딩 한국어) | ⚠️ | i18n key 전환 + bottomContent prop |
| `alert()` 직접 호출 | `alert('모든 단어의 발음 평가가 완료...')` (line 82) | ❌ | 앱 내 토스트/모달로 교체 |
| Modal 2중 중첩 | 발음 모달 안에 결과 모달 | ⚠️ | Source A Modal 패턴으로 교체 |
| 데이터 | `MOCK_ADMIN_WORDBOOK_ACTIVITY` 직접 참조. data prop 없음 | ❌ | `ActivityNode.questions[].listItems` 구조로 주입 |
| 다국어 | CTA 등 일부 한국어 하드코딩 | ⚠️ | 전면 i18n key 전환 |
| 학습 이력 | 없음 | ❌ | 발음 평가 결과마다 `recordQuestionAttempt` 호출 |
| `setTimeout` 시뮬레이션 | 녹음 결과 랜덤 생성 (line 60~82) | ❌ | 실제 발음 평가 API 연동으로 교체 |

---

### 4. 학습 소개 (`IntroStage`)

**Source A 대응**: `intro_lesson` → `PreviewIntro4` (act31)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>` (flex:1). 배경 `#FFFFFF`. ScrollView 없음 | ⚠️ | `<ActivityLayout useScrollView={false} containerStyle={{ backgroundColor: '#FFFFFF' }}>` |
| 헤더 | `ActivityHeader percentage={40}` **하드코딩** | ❌ | `step` / `totalSteps` 동적 값으로 교체 |
| 닫기 버튼 | `onClose={onBack}` | ⚠️ | `showBackButton` 또는 `showCloseButton` 명확히 분리 |
| CTA 버튼 | `pick(lang,'다음 →','Tiếp theo →')` 하드코딩 | ⚠️ | `confirmText` 또는 i18n key |
| 데이터 | `SESSION1.intro` 상수 직접 참조. data prop 없음 | ❌ | `ActivityNode.fieldValues` (BADGE, TITLE, SUBTITLE 등) + `listItems.ACHIEVEMENTS` 구조로 주입 |
| 다국어 | `useLang/pick()` + `.badgeVi/.titleVi` 등 이중 필드 전면 적용 | ⚠️ | `useTranslation` + i18n key 전환 |
| 학습 이력 | 없음 | ❌ | `completeActivity` 호출 추가 |
| Source A 대응 templateCd | `intro_lesson` (act31) 등록되어 있음 | ✅ | 기존 등록 활용 |

---

### 5. 단어 만들기 (`WordBuildStage`)

**Source A 대응**: `scramble_word` → `WordLetterScramble5` (act23)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>` (flex:1). 배경 `#FFFFFF`. ScrollView 없음 | ⚠️ | `<ActivityLayout useScrollView={false}>` |
| 헤더 | `ActivityHeader percentage={progressPct}` + children stepBadge | ⚠️ | `step` / `totalSteps`로 교체 (stepBadge는 children 슬롯 활용 가능) |
| CTA 버튼 | `pick(lang,'확인','Xác nhận')`. 비활성: `!allFilled` | ✅ | `confirmText` + `confirmDisabled={!allFilled}` |
| 힌트 버튼 | 별도 💡 버튼 병렬 배치 | ⚠️ | `showHintButton` + `onPressHint` prop 활용 |
| 애니메이션 | `Animated + Easing` 스피커 펄스. `useNativeDriver: true` | ✅ | 네이티브 호환 — 이식 안전 |
| Modal 피드백 | bottom-sheet 스타일 `Modal` (animationType="slide") | ⚠️ | Source A 공통 피드백 모달 패턴으로 교체 |
| TextInput (키보드 모드) | 대안 입력 방식 | ✅ | 이식 가능 |
| FAIL_MAX 로직 | 2회 오답 시 정답 공개 | ✅ | 이식 가능 (Source A act23과 동일 로직) |
| 데이터 | `SESSION1.wordBuildQuiz` 직접 참조. data prop 없음 | ❌ | `ActivityNode.questions[].listItems` 구조로 주입 |
| 다국어 | `useLang/pick()` 전면 적용 | ⚠️ | `useTranslation` 전환 |
| 학습 이력 | 없음 | ❌ | 문항별 `recordQuestionAttempt` + 완료 시 `completeActivity` |
| Source A 대응 templateCd | `scramble_word` (act23) 등록되어 있음 | ✅ | 기존 등록 활용 |

---

### 6. 문장 만들기 1 (`SentenceBuildStage`)

**Source A 대응**: `sentence_puzzle` → `SentenceScramble3` (act08) 또는 `sentence_comp` → `SentenceBlank1` (act06)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>`. 배경 `#FFFFFF` 하드코딩 | ⚠️ | `<ActivityLayout useScrollView={false}>` |
| 헤더 | `ActivityHeader percentage={progressPct}` + stepBadge | ⚠️ | `step` / `totalSteps`로 교체 |
| CTA 버튼 | `pick(lang,'확인','Xác nhận')`. 비활성: `!allFilled` | ✅ | `confirmText` + `confirmDisabled` |
| 오디오 재생 | `Animated` 스피커 펄스 애니메이션 (시뮬레이션) | ❌ | 실제 오디오 파일 재생 연동 필요 |
| 재생 속도 | `Speed` 타입 (0.5x/1.0x/1.5x) UI 있음 | ⚠️ | 실제 오디오 재생과 연동 필요 |
| Modal 피드백 | bottom-sheet (animationType="slide") | ⚠️ | Source A 공통 피드백 모달로 교체 |
| TextInput (키보드 모드) | 대안 입력 | ✅ | 이식 가능 |
| 데이터 | `SESSION1.sentenceBuildQuiz` 직접 참조. data prop 없음 | ❌ | `ActivityNode.questions[]` 구조로 주입 |
| 다국어 | `useLang/pick()` 전면 적용 | ⚠️ | `useTranslation` 전환 |
| 학습 이력 | 없음 | ❌ | 문항별 `recordQuestionAttempt` + `completeActivity` |
| Source A 대응 templateCd | act08(`sentence_puzzle`) 또는 act06(`sentence_comp`) — 기존 등록 | ✅ | ADMIN과 매핑 확인 필요 |

---

### 7. 문장 만들기 2 (`SentenceBuildStage2`)

**Source A 대응**: `sentence_completion` → `SentenceTyping4` (act09) 또는 신규

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>`. 배경 `#FFFFFF` 하드코딩 | ⚠️ | `<ActivityLayout useScrollView={false}>` |
| 헤더 | `ActivityHeader percentage={progressPct}` + stepBadge | ⚠️ | `step` / `totalSteps`로 교체 |
| 오디오 | **없음** (화면6과 차이점) | ✅ | 음원 불필요 — 이식 안전 |
| 지문 방향 | `quiz.vi`를 지문으로, 한국어 문장을 조합하는 방식 | ✅ | Source A `sentence_completion`과 유사 |
| CTA 버튼 | `pick(lang,'확인','Xác nhận')`. 비활성: `!allFilled` / `keyboardText` | ✅ | `confirmText` + `confirmDisabled` |
| Modal 피드백 | bottom-sheet (animationType="slide") | ⚠️ | Source A 공통 피드백 모달로 교체 |
| 데이터 | `SESSION1.sentenceBuildQuiz` 직접 참조. data prop 없음 | ❌ | `ActivityNode.questions[]` 구조로 주입 |
| 다국어 | `useLang/pick()` 전면 적용 | ⚠️ | `useTranslation` 전환 |
| 학습 이력 | 없음 | ❌ | 문항별 `recordQuestionAttempt` + `completeActivity` |
| Source A 대응 templateCd | act09(`sentence_completion`) 또는 신규 — ADMIN 확인 필요 | ⚠️ | ADMIN과 templateCd 매핑 협의 |

---

### 8. 학습 상세 소개 (`GrammarDetailStage`)

**Source A 대응**: `study_video` → `PreviewVideo2` (act14)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>` + `<ScrollView>`. 배경 `#FFFFFF` 하드코딩 | ⚠️ | `<ActivityLayout containerStyle={{ backgroundColor: '#FFFFFF' }}>` |
| 헤더 | `ActivityHeader percentage={60}` **하드코딩** | ❌ | `step` / `totalSteps` 동적 값으로 교체 |
| 비디오 재생 | **`Platform.OS === 'web'`** 분기로 `<video>` 태그 사용. 모바일은 플레이스홀더만 표시 | ❌ | 네이티브 비디오 플레이어 구현 필요 (expo-video 또는 react-native-video) |
| 비디오 에셋 | `require('../../../assets/M_1_L1_1080p.mp4')` 로컬 파일 | ❌ | ADMIN 등록 URL 또는 CDN URL로 교체 |
| CTA 버튼 | `pick(lang,'다음 →','Tiếp theo →')`. 항상 활성 | ✅ | `confirmText` + `onPressConfirm` |
| Modal 비디오 | `animationType="fade"` 전체화면 Modal | ⚠️ | Source A Modal 패턴 또는 비디오 플레이어 내장 전체화면 활용 |
| 데이터 | `SESSION1.grammar` 직접 참조. data prop 없음 | ❌ | `ActivityNode.fieldValues` + `listItems` 구조로 주입 |
| 다국어 | `useLang/pick()` 부분 적용 (일부 단일 언어값) | ⚠️ | `useTranslation` 전환 + 미적용 텍스트 i18n 추가 |
| 학습 이력 | 없음 | ❌ | `completeActivity` 호출 추가 |
| Source A 대응 templateCd | `study_video` (act14) 등록되어 있음 | ✅ | 기존 등록 활용 |

---

### 9. 퀵리뷰 (`QuickReviewStage`)

**Source A 대응**: 신규 템플릿 (templateCd 미등록)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>` + `<ScrollView>`. 배경 `colors.surface` | ⚠️ | `<ActivityLayout>` 교체 |
| 헤더 | `ActivityHeader percentage={progressPercentage}` **동적 계산** (완료 문항 비율) | ⚠️ | `step` / `totalSteps`로 교체 |
| CTA 버튼 | `pick(lang, data.nextLabel, data.nextLabelVi)` — 데이터에서 수신 | ✅ | `confirmText` prop 활용 가능 |
| 비활성 조건 | `allDone && !confirmDisabled` (전체 완료 시 활성) | ✅ | `confirmDisabled={!allDone}` |
| data prop | **존재함** (기본값 = MOCK, 외부 주입 가능) | ✅ | API 주입 구조 준비됨 |
| 데이터 구조 | `QuickReviewItem.activityQuestionNo` 포함. Source A 구조 유사 | ✅ | `ActivityNode.questions[]` 매핑 검토 |
| 카드 순차 잠금 | `activeIndex` 이전 카드만 활성 | ✅ | 이식 가능 |
| 다국어 | `Vi` suffix fallback 패턴 일관 적용 (`item.questionVi ?? item.question`) | ⚠️ | `useTranslation` 전환 |
| 학습 이력 | 없음 | ❌ | 카드별 `recordQuestionAttempt` + `completeActivity` |
| templateCd | 미등록 | ❌ | ADMIN 협의 후 신규 templateCd 등록 필요 |

---

### 10. 문화 (`CultureStage`)

**Source A 대응**: 신규 템플릿 (templateCd 미등록)

| 항목 | 현황 | 판정 | 처리 방안 |
|---|---|---|---|
| 루트 컨테이너 | `<View>` + `<ScrollView>`. 배경 `colors.surface` | ⚠️ | `<ActivityLayout>` 교체 |
| 헤더 | `ActivityHeader percentage={read ? 100 : 0}` **이진 토글 (0 or 100)** | ⚠️ | `step` / `totalSteps`로 교체. 스크롤 완료 전후로 단계 분리 고려 |
| CTA 버튼 | `pick(lang,'다음','다음') + ' →'` — **베트남어 미입력 버그** | ❌ | `'다음'` → `'Tiếp theo'` 수정 필요 |
| 비활성 조건 | `read` (스크롤 완료 여부) | ✅ | `confirmDisabled={!read}` |
| data prop | **존재함** (기본값 = MOCK, 외부 주입 가능) | ✅ | API 주입 구조 준비됨 |
| 데이터 구조 | `CultureActivityData`. `data.heroMedia`, `data.contents[].activityQuestionNo` 포함 | ✅ | `ActivityNode` 매핑 검토 |
| 히어로 미디어 | `source` (로컬 require) + `uri` (원격 URL) 양쪽 지원 | ✅ | ADMIN URL 방식으로 전환 시 uri 분기 그대로 활용 |
| 다국어 | `Vi` suffix fallback 패턴. 단 CTA 버튼 베트남어 누락 | ⚠️ | CTA 수정 + `useTranslation` 전환 |
| 학습 이력 | 없음 | ❌ | `completeActivity` 호출 추가 |
| templateCd | 미등록 | ❌ | ADMIN 협의 후 신규 templateCd 등록 필요 |

---

## 공통 이슈 요약

### 전 화면 공통

| 이슈 | 대상 | 처리 방안 |
|---|---|---|
| `ActivityHeader percentage` → `step/totalSteps` | 1~10 전체 | Source A ActivityHeader는 step/totalSteps 정수 쌍 사용. 동적 계산 로직으로 교체 |
| `useLang/pick()` → `react-i18next` | 1~10 전체 | `useTranslation` + i18n key 전환. ko.json/vi.json에 bridge/mission/culture 키 추가 |
| `SESSION1.*` 직접 참조 | 2,3,4,5,6,7,8 | data prop 추가 + `ActivityNode` API 주입 구조로 교체 |
| `completeActivity` 미호출 | 1~10 전체 | 각 화면 CTA 완료 시점에 `useActivityQuestionHistory` 연동 필요 |
| `navigateToNextActivityOrLessonComplete` 미적용 | 1~10 전체 | `onPressConfirm/onNext/onComplete` 콜백을 Source A 네비게이션 패턴으로 교체 |
| `fontWeight: '700'` 직접 지정 | 1~10 전체 | `fonts.pretendard[700]` 상수로 교체 |
| 배경색 하드코딩 | 대부분 | `COLORS.*` 또는 `containerStyle` prop으로 교체 |

---

## ADMIN 신규 templateCd 등록 필요 목록

| 화면 | 제안 templateCd | 비고 |
|---|---|---|
| 학습 미션 (2) | `mission_intro` | 신규 |
| 오늘의 단어장 (3) | `word_pronuciation` (act02) | 기존 act02 활용 또는 신규 |
| 퀵리뷰 (9) | `quick_review` | 신규 |
| 문화 (10) | `culture_content` | 신규 |
| 브릿지 A (11-A) | `bridge_vocab_grammar` | 신규 |
| 브릿지 B (11-B) | `bridge_grammar_listening` | 신규 |
| 브릿지 C (11-C) | `bridge_grammar_speaking` | 신규 |
| 브릿지 D (11-D) | `bridge_grammar_writing` | 신규 |

---

## 이식 우선순위 제안

| 우선순위 | 화면 | 이유 |
|---|---|---|
| 높음 | 4. 학습 소개, 5. 단어 만들기, 8. 학습 상세 소개 | Source A templateCd 기존 등록. 구조 유사성 높음 |
| 중간 | 6. 문장 만들기 1, 7. 문장 만들기 2, 9. 퀵리뷰, 10. 문화 | data prop 구조 준비됨. templateCd 신규 등록 후 진행 가능 |
| 낮음 | 1. 나의 코스, 2. 학습 미션 | 홈/신규 템플릿으로 구조적 재설계 또는 ADMIN 등록 선행 필요 |
| 별도 협의 | 3. 오늘의 단어장 | 음성 합성 API 교체, 발음 평가 연동 등 추가 작업량 큼 |
