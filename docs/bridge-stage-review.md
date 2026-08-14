# BridgeStage 프로토타입 — 개발 검토 문서

> 작성일: 2026-08-14 | 대상: 개발팀 코드 리뷰 및 이식 작업 참고용

---

## 개요

학습 단계 전환 시 직전 활동에서 배운 내용을 다음 활동과 자연스럽게 연결하는 맥락 전환 화면.
Spotlight Shift(배운 항목 하이라이트 순차 등장) + Bridge Quest(배운 내용으로 예문 구성 안내) 패턴을 결합한 신규 템플릿.

단일 `BridgeStage` 컴포넌트에서 `bridgeType` prop으로 4종 변형을 분기한다.

---

## 4종 구성

| screenId | 레이블 | 전환 방향 | 칩 스타일 |
|---|---|---|---|
| `bridge-vocab-grammar` | 11-A. 어휘 → 문법 | 어휘 액티비티 → 문법 액티비티 | VocabChip (teal 보더, ko+vi 2줄) |
| `bridge-grammar-listening` | 11-B. 문법 → 듣고 말하기 | 문법 → 듣고 말하기 | GrammarChip (ink 보더, ko만) |
| `bridge-grammar-speaking` | 11-C. 문법 → 말하기 | 문법 → 말하기 | GrammarChip (ink 보더, ko만) |
| `bridge-grammar-writing` | 11-D. 문법 → 읽고 쓰기 | 문법 → 읽고 쓰기 | GrammarChip (ink 보더, ko만) |

애니메이션: 5단계 순차 페이드인 — 방향 배지 → 칩 목록 → 하이라이트 → 문법 요소 → CTA  
프로토타입은 웹 호환을 위해 opacity만 사용 (`useNativeDriver: Platform.OS !== 'web'`)

---

## 파일 구조

```
project-prototype/src/
├── screens/BridgeStage/
│   └── index.tsx              ← 컴포넌트 본체 (4종 공통)
├── data/
│   └── lessonData.ts          ← BridgeType, BridgeChip, BridgeData 인터페이스
│                                 MOCK_BRIDGE_VOCAB_GRAMMAR
│                                 MOCK_BRIDGE_GRAMMAR_LISTENING
│                                 MOCK_BRIDGE_GRAMMAR_SPEAKING
│                                 MOCK_BRIDGE_GRAMMAR_WRITING
└── emulator/
    ├── screenRegistry.ts      ← 뷰어 목록 메타데이터
    └── EmulatorShell.tsx      ← 화면 라우터 (case 'bridge-*')
```

---

## Source A 이식 검토

참조 경로: `C:\dev\kchao_reproto\source-a-app`

### ActivityLayout 호환성

| 항목 | 현황 | 판정 | 이식 시 처리 |
|---|---|---|---|
| 루트 컨테이너 | `<View style={s.screen}>` | ✅ 문제 없음 | `<ActivityLayout>`으로 교체. `children` + `bottomContent` prop 분리 |
| 프로그레스바 | `percentage={35}` 직접 값 | ⚠️ 주의 필요 | Source A는 `step` / `totalSteps` 정수 쌍 사용 → 변환 필요 |
| 닫기 버튼 | `onClose` prop | ⚠️ 주의 필요 | `showBackButton={false}` + `showCloseButton={true}` + `onClose` 조합 명시 |
| CTA 버튼 | 커스텀 `s.ctaBtn` (teal 배경) | ⚠️ 주의 필요 | Source A ConfirmButton 스타일과 상이 → `bottomContent` prop에 직접 주입 권장 |
| confirmDisabled | 미사용 (항상 활성) | ✅ 문제 없음 | ActivityLayout 기본값 `false` → 생략 가능 |
| 배경색 | `#FFFFFF` | ⚠️ 주의 필요 | ActivityLayout 기본값 `#F4F5F7` → `containerStyle={{ backgroundColor: '#FFFFFF' }}` 오버라이드 |
| ScrollView | 스크롤 없는 고정 레이아웃 | ⚠️ 주의 필요 | `useScrollView={false}` + footer를 `bottomContent`로 분리 |
| SafeAreaView | 미적용 | ✅ 문제 없음 | ActivityLayout 내부에서 자동 처리 |
| useNativeDriver | `Platform.OS !== 'web'` 분기 | ✅ 문제 없음 | Source A는 네이티브 전용 → `true`로 단순화 가능 |
| 폰트 | `fontWeight: '700'` 직접 지정 | ⚠️ 주의 필요 | Source A `fonts.pretendard[700]` 상수로 교체 |

### 다국어 처리 — 방식 불일치

| 구분 | 프로토타입 | Source A |
|---|---|---|
| 라이브러리 | 자체 `LangContext` | `react-i18next` |
| 훅 | `useLang() → { lang }` | `useTranslation() → { t }` |
| 사용법 | `pick(lang, '방금 배운…', 'Hãy học…')` | `t('bridge.message')` |

이식 시 `pick()` 호출을 `i18n.language === 'ko' ? ko : vi` 인라인 분기 또는 i18n key 방식으로 전환.  
`FLOW_LABELS`, `bridgeMessage/Vi` 등 이중 필드 구조도 재설계 필요.

### 기타 주의사항

- **❌ 학습 이력 기록 hook 미포함**: Source A의 모든 액티비티는 CTA 누를 때 `completeActivity({ statusCd: 'COMPLETED' })` 호출. BridgeStage에는 없어 이식 후 이력 누락 가능. `useActivityQuestionHistory` 훅 추가 필요.
- **⚠️ 네비게이션 패턴 교체 필요**: 프로토타입의 `onPressConfirm` 콜백은 Source A의 `navigateToNextActivityOrLessonComplete(navigation, routeParams, routeName)`으로 교체.
- **❌ activityTemplateMap 미등록**: bridge 전용 templateCd 4종이 `activityTemplateMap.ts`에 아직 없음.
- **⚠️ 미사용 필드**: `BridgeData.example.prefixVi`, `example.highlightVi`가 인터페이스에 있으나 렌더링 코드 없음. 활용하거나 제거 필요.

---

## API 연동 설계 (안)

### Option A — ADMIN fieldValues로 전달

ADMIN이 `ActivityNode.fieldValues`에 아래 키를 포함해 내려주는 방식.

```ts
// ActivityNode.fieldValues (bridge 전용 키)
BRIDGE_TYPE              : 'vocab-to-grammar' | 'grammar-to-listening' | 'grammar-to-speaking' | 'grammar-to-writing'
BRIDGE_MESSAGE_KO        : string   // "방금 배운 단어로\n문법을 배워볼까요?"
BRIDGE_MESSAGE_VI        : string
BRIDGE_EXAMPLE_PREFIX    : string   // "저는"
BRIDGE_EXAMPLE_SUFFIX    : string   // "이에요."
BRIDGE_EXAMPLE_FULL      : string   // "저는 베트남 사람이에요."
BRIDGE_EXAMPLE_FULL_VI   : string
BRIDGE_NEXT_LABEL_KO     : string   // "N + 이에요 / 예요"
BRIDGE_NEXT_LABEL_VI     : string
BRIDGE_CTA_LABEL_KO      : string   // "문법 배우러 가기"
BRIDGE_CTA_LABEL_VI      : string

// learnedChips는 직전 ActivityNode에서 프론트가 변환 (→ Option B)
```

### Option B — 프론트 어댑터로 직전 액티비티 데이터 변환 (권장)

`learnedChips`는 직전 액티비티의 `questions[].listItems`를 프론트 어댑터가 변환하는 방식.
중복 데이터 없이 최신성 보장.

```ts
// ActivityDataAdapter.ts에 추가 제안
function adaptLearnedChips(
  prevActivity: ActivityNode,
  bridgeType: BridgeType
): BridgeChip[] {
  // 어휘 → 문법: 직전 단어 액티비티의 speaking_word listItems에서 추출
  if (bridgeType === 'vocab-to-grammar') {
    return prevActivity.questions
      .flatMap(q => q.listItems['speaking_word'] ?? [])
      .map(item => ({ ko: item.extra2, vi: item.extra3 }))
      .slice(0, 4);    // MAX 4개
  }
  // 문법 → *: 직전 문법 액티비티의 패턴 목록에서 추출
  return prevActivity.questions
    .map(q => ({ ko: q.grammarPattern ?? q.questionText }))
    .slice(0, 4);
}
```

---

## 이식 전 협의 필요 사항

| # | 사항 | 관련 팀 | 영향 범위 |
|---|---|---|---|
| 1 | bridge 전용 `templateCd` 4종 정의 및 ADMIN 등록<br>`bridge_vocab_grammar` / `bridge_grammar_listening` / `bridge_grammar_speaking` / `bridge_grammar_writing` | BE / ADMIN | `activityTemplateMap.ts` 등록 + 화면 라우팅 |
| 2 | `learnedChips` 공급 방식 결정<br>ADMIN fieldValues 직접 전달 vs. 프론트 어댑터 변환 | FE / BE | 어댑터 구현 또는 ADMIN 스키마 추가 |
| 3 | 문장 예문 데이터(`prefix / suffix / full`) 관리 주체<br>ADMIN 등록 vs. 프론트 하드코딩 vs. 규칙 기반 자동 생성 | 기획 / BE | `BRIDGE_EXAMPLE_*` fieldValues 정의 |
| 4 | 완료 이력 기록 여부 및 `activityVersionNo` 부여<br>브릿지도 `completeActivity` 호출이 필요한지 | 기획 / BE | `useActivityQuestionHistory` 훅 추가 여부 |

---

## 이식 체크리스트

- [ ] `activityTemplateMap.ts`에 bridge templateCd 4종 등록 (ADMIN 등록 후 진행)
- [ ] `<View style={s.screen}>` → `<ActivityLayout useScrollView={false} showBackButton={false} showCloseButton={true} containerStyle={{ backgroundColor: '#FFFFFF' }}>` 교체
- [ ] `ActivityHeader percentage={35}` 제거 → `step / totalSteps`로 ActivityLayout에 전달
- [ ] `s.footer` / `s.ctaBtn` → ActivityLayout `bottomContent` prop으로 이동
- [ ] `useLang / pick()` → `useTranslation` + i18n key 방식으로 전환
- [ ] `fontWeight: '700'` 등 직접 지정값 → `fonts.pretendard[700]` 상수로 교체
- [ ] `useNativeDriver: Platform.OS !== 'web'` → `useNativeDriver: true` 단순화
- [ ] CTA onPress에 `completeActivity({ statusCd: 'COMPLETED' })` 추가
- [ ] CTA onPress에 `navigateToNextActivityOrLessonComplete(navigation, routeParams, routeName)` 패턴 적용
- [ ] `BridgeData.example.prefixVi` / `highlightVi` — 렌더링 추가 또는 인터페이스에서 제거
- [ ] `learnedChips` 어댑터 함수 구현 및 `ActivityDataAdapter.ts`에 추가
- [ ] `MOCK_BRIDGE_*` 고정 데이터 → ADMIN API 응답(`route.params` → `getActivityRouteContext()`)으로 교체
