# 프로젝트 마스터 가이드

> 작성일: 2026-08-29 | 대상: 개발팀 + 멀티 AI 협업

---

## 프로젝트 목적

이 저장소(`project-prototype-master`)는 **UI 미리보기 전용 프로토타입**이다.
기획·디자인 검증 후 `C:\dev\kcho-dev` (프로덕션 React Native 앱)로 이식하는 것이 최종 목표다.

---

## 세 저장소 역할

| 저장소 | 스택 | 역할 |
|---|---|---|
| `kchao-lesson1-feature-*` | React 19 + Vite | Source B. 콘텐츠/UX 기획 검증 |
| `project-prototype-master` (이 저장소) | Expo 57 + RN Web | Prototype. 화면 미리보기 + 이식 설계 |
| `kcho-dev` | RN 0.83 bare + Expo 55 | Production. 실제 서비스 앱 |

---

## EmulatorShell 동작 원리

```
ScreenComboBox (드롭다운)
  → screenId 선택
  → ScreenRenderer switch (EmulatorShell.tsx)
  → 해당 컴포넌트 렌더링 (디바이스 프레임 안에서)
```

화면 목록은 `screenRegistry.ts`의 `BASE_SCREEN_REGISTRY` 배열로 관리된다.
라벨의 숫자 prefix로 드롭다운 정렬이 결정된다.

---

## 신규 화면 추가 절차 (요약)

1. `src/data/lessonData.ts` 말미 — 타입 + Mock 데이터 추가
2. `src/screens/<Name>/index.tsx` 신규 생성
3. `src/emulator/screenRegistry.ts` — `BASE_SCREEN_REGISTRY` 말미에 append
4. `src/emulator/EmulatorShell.tsx` — import + case 추가
5. `docs/<name>-review.md` 핸드오프 문서 생성 (필수)

자세한 규칙은 `AGENTS.md` 또는 `screen-registrar` 에이전트 참조.

---

## kcho-dev 아키텍처 요약

### 템플릿 등록 경로
```
백오피스 templateCd
  → activityTemplateMap.ts (templateCd → stackName 매핑)
  → Stacks.tsx (stackName → 화면 컴포넌트)
  → src/screens/activity/preview/Preview<Name>.tsx
```

### 핵심 훅
| 훅 | 위치 | 용도 |
|---|---|---|
| `useActivityQuestionHistory` | `hooks/activity/` | 답변 기록 + 완료 처리 |
| `useAudioPlayer` | `utils/activityMedia` | 음원 재생 |
| `getActivityRouteContext` | `utils/activityRoute` | route params → activity 데이터 |
| `navigateToNextActivityOrLessonComplete` | `utils/activityRoute` | 다음 화면 이동 |

### API 데이터 구조
```ts
// 백오피스 ADMIN API → question 목록
interface ActivityQuestion {
  activityQuestionNo: number;
  listItems: ListItem[];     // 슬라이드/선택지 배열
  fieldValues: FieldValue[]; // 단일 값 필드
}

interface ListItem {
  itemValue: string;   // 주 값
  extra1?: string;     // 보조 값 1
  extra2?: string;     // 보조 값 2
  extra3?: string;     // 보조 값 3
  itemOrd: number;     // 정렬 순서
}
```

### ActivityLayout props 참조
```tsx
<ActivityLayout
  showProgressBar={boolean}    // 진행바 표시
  showCloseButton={boolean}    // 닫기 버튼 표시
  step={number}                // 현재 스텝 (1-based)
  totalSteps={number}          // 전체 스텝 수
  onPressConfirm={Function}    // 다음 버튼 핸들러
  showConfirmButton={boolean}  // 다음 버튼 표시
  onClose={Function}           // 닫기 핸들러
  activityFinishNo={number}    // useActivityQuestionHistory에서 받음
  backgroundColor={string}     // 화면 배경색 (선택)
>
  {/* 화면 콘텐츠 */}
</ActivityLayout>
```

---

## 디자인 토큰 요약 (`src/theme/colors.ts`)

| 용도 | 토큰 | 값 |
|---|---|---|
| 브랜드 주색 | `colors.teal` | `#00a8a6` |
| 기본 텍스트 | `colors.ink` / `colors.textPrimary` | `#04303d` |
| 보조 텍스트 | `colors.muted` | `#61727a` |
| 구분선 | `colors.line` | `#dce5e7` |
| 화면 배경 | `colors.canvas` | `#f5f8f8` |
| 카드 배경 | `colors.surface` | `#ffffff` |
| 정답 | `colors.correct` | `#249b5b` |
| 오답 | `colors.wrong` | `#ef5e62` |

---

## 멀티 AI 협업 규칙

1. **코드 추가만, 수정 최소화**: 기존 파일은 말미에 append. 리팩토링 금지.
2. **핸드오프 문서 필수**: `docs/<name>-review.md` 없이 작업 완료 선언 금지.
3. **명명 규약 통일**: prototype `WordIntroStage` ↔ kcho-dev `PreviewWordIntro6`.
4. **TBD 명시**: 백오피스 협의 필요 사항은 코드에 `// TBD:` 주석으로 표시.
5. **하드코딩 금지**: 색상, 폰트 크기, 간격 모두 토큰 사용.

---

## 기등록 화면 목록

현재 등록된 화면은 `src/emulator/screenRegistry.ts`의 `BASE_SCREEN_REGISTRY` 참조.

### 핸드오프 문서 현황

| 화면 | docs 파일 | 상태 |
|---|---|---|
| BridgeStage (4종) | `docs/bridge-stage-review.md` | ✅ 완료 |
| (공통 이식 가이드) | `docs/prototype-review.md` | ✅ 완료 |
| WordIntroStage | `docs/word-intro-stage-review.md` | 🔲 미작성 |
