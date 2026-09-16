// 에뮬레이터에 표시할 화면 목록 및 메타데이터 레지스트리
export type ScreenCategory = '기존' | '신규' | '수정';

export interface ScreenMeta {
  id: string;
  label: string;
  category: ScreenCategory;
  description: string;
  devNotes: string;
  designNotes: string;
  sourceAFile?: string;
  sourceBRef?: string;
}

export const BASE_SCREEN_REGISTRY: ScreenMeta[] = [
  {
    id: 'age-verification',
    label: '0. 연령 확인 (만 14세 미만 제한)',
    category: '신규',
    description:
      '소셜 로그인 직후 만 14세 미만 가입 제한 정책에 따라 생년월일을 확인하고 분기 처리하는 진입 게이트 화면입니다.\n\n' +
      '**[진입 및 분기 Flow]**\n' +
      '① 소셜 로그인 (Google / Apple / Facebook OAuth)\n' +
      '   ↓\n' +
      '② 연령 확인 (생년월일 8자리 입력 + 필수 약관 동의)\n' +
      '   ↓\n' +
      '③ 만 14세 판정\n' +
      '   ├─ **Yes (만 14세 이상)** ──> 통과 팝업 ──> 레벨 선택(온보딩) ──> 홈\n' +
      '   └─ **No  (만 14세 미만)** ──> 차단 팝업 ──> 세션 초기화 후 소셜 로그인 복귀\n\n' +
      '**[기능 명세]**\n' +
      '**1. 기본 정책**\n' +
      '- **진행 시점:** 최초 소셜 로그인 성공 직후, 회원가입 절차 1단계에서만 노출 (기존 가입 완료 계정은 미노출).\n' +
      '- **연령 기준:** 사용자 입력 생년월일 기준 시스템 당일 일자(Today)로 만 나이 계산.\n' +
      '- **만 14세 미만:** 서비스 가입 불가\n' +
      '- **만 14세 이상:** 정상 가입 진행\n\n' +
      '**2. 분기 처리 및 팝업/이동 시나리오**\n' +
      '- **CASE A: 만 14세 미만인 경우**\n' +
      '  * **[확인]** 선택 시 시스템 검증 후 안내 팝업 노출.\n' +
      '  * **팝업 문구:**\n' +
      '    - 타이틀: **가입 불가 안내**\n' +
      '    - 본문: 만 14세 미만은 서비스 이용이 제한됩니다.\n' +
      '    - 버튼: 확인\n' +
      '  * 팝업의 **[확인]** 선택 시 회원가입 절차 중단 및 소셜 로그인 메인 화면으로 이동.\n' +
      '- **CASE B: 만 14세 이상인 경우**\n' +
      '  * **[확인]** 선택 시 연령 검증 통과 팝업 노출.\n' +
      '  * **팝업 문구:**\n' +
      '    - 타이틀: **인증 완료**\n' +
      '    - 본문: 연령 확인이 완료되었습니다.\n' +
      '    - 버튼: 확인\n' +
      '  * 팝업의 **[확인]** 선택 시 다음 단계인 레벨 선택 화면으로 이동.\n\n' +
      '**4. 개발/QA 예외 확인 사항 (Notes)**\n' +
      '- **만 나이 계산 기준:** 현재 연도 - 출생 연도 (생일이 지나지 않은 경우 추가 -1).',
    devNotes: '참고 파일: src/screens/AgeVerificationScreen/index.tsx\n- checkAgeRestriction 유틸 기반 윤년/월별일수/생일 경과 만 나이 계산\n- 확인 버튼 탭 시 결과 팝업(KO/VI 상하 병기) 노출 후 분기 라우팅\n  * 통과: onNext() -> 레벨 선택 화면 이동\n  * 차단: onBack() -> 세션 정리 후 소셜 로그인 복귀\n- 우측 ✕ 버튼 탭 시 소셜 로그인 복귀',
    designNotes: '테마 적용 OFF (기본/뉴트럴 스타일)\n- 상단: 타이틀 "연령 확인" + 우측 ✕ 버튼 (뒤로가기/언어탭 제거)\n- 인풋: YYYY.MM.DD 자동 마스킹 (인라인 피드백 배너 제거)\n- 하단: "확인" 단일 버튼 (유효 입력 시 활성화)\n- 팝업: 한국어/베트남어 상하 병기 모달',
    sourceAFile: 'src/screens/login/AgeVerificationScreen.tsx',
    sourceBRef: 'AgeVerificationScreen',
  },
  {
    id: 'home',
    label: '1. 홈 화면 / 코스 안내',
    category: '수정',
    description: '학습자가 앱 진입 시 처음 만나는 화면. 1과 전체 차시 목록과 진도를 한눈에 보여주며, 현재 학습 가능한 차시로 빠르게 진입할 수 있도록 유도한다.',
    devNotes: '참고 파일: src/screens/home/Home.tsx (Source A)\n- SESSIONS 배열로 차시 카드 렌더링\n- sessionProgress() 함수로 각 차시 진행률 계산',
    designNotes: '브랜드 컬러: --teal #00a8a6\n카드 모서리: borderRadius 16',
    sourceAFile: 'src/screens/home/Home.tsx',
    sourceBRef: 'HomeScreen',
  },
  // ─── [기타 프로토타입 템플릿 목록] ───────────────────────────
  {
    id: 'mission-tutor',
    label: '2-1. 학습 미션(튜터)',
    category: '신규',
    description:
      '차시 학습 시작 전 AI 튜터가 미션과 목표를 음성과 말풍선으로 안내하는 화면.\n\n' +
      '**[기능 명세] AI 튜터 가이드 및 학습 목표 모달/화면**\n' +
      '**1. AI 튜터 말풍선 (텍스트 영역)**\n' +
      '- **텍스트 서식 및 줄바꿈:**\n' +
      '  * CMS/관리자 또는 데이터셋에서 전달되는 개행 문자(\\n, <br/>)를 파싱하여 줄바꿈 및 빈 줄 처리를 지원해야 함.\n' +
      '  * 단어 단위 줄바꿈(word-break: keep-all 또는 언어별 최적화) 적용.\n' +
      '- **장문 대응 및 영역 확장:**\n' +
      '  * 기본 높이는 콘텐츠 길이에 맞춰 유동적으로 확장(Auto-height).\n' +
      '  * 디바이스 세로 해상도를 초과하는 극단적 장문일 경우, 전체 팝업/모달 내부 스크롤 처리.\n\n' +
      '**2. AI 튜터 음원 (오디오 및 Dim 레이어)**\n' +
      '- **자동 닫힘(Auto Close):**\n' +
      '  * 화면 진입 시 오디오가 자동 재생(Auto-play)되는 경우, 음원 재생이 끝나면(onEnded) Dim 처리된 모달/화면이 자동으로 닫힘.\n' +
      '- **수동 닫힘(CTA 액션):**\n' +
      '  * 음원 재생 중 사용자가 하단 **[확인]** 버튼을 탭하면, 즉시 오디오 재생을 중단(stop/pause)하고 메모리를 해제한 뒤 Dim 화면을 닫음.\n' +
      '- **재생 제한 정책:**\n' +
      '  * 본 화면의 음원은 1회성 안내 음원으로, 한 번 재생이 완료된 후에는 재진입 전까지 반복 재생(Loop/Replay) 버튼 및 기능을 제공하지 않음.\n\n' +
      '**3. 학습 목표 영역 (리스트 및 스크롤)**\n' +
      '- **노출 개수 규칙:**\n' +
      '  * 불릿 항목은 **최소 1개(Min: 1)에서 최대 5개(Max: 5)**까지 노출.\n' +
      '- **스크롤 및 레이아웃 정책:**\n' +
      '  * 디바이스 높이 대비 불릿 개수(또는 텍스트 길이)로 인해 화면 영역을 벗어날 경우, 학습 목표 영역(또는 팝업 본문)에 세로 스크롤(Y-scroll) 생성.\n' +
      '  * 하단 **[확인]** 버튼은 스크롤과 무관하게 항상 하단에 고정 노출(Sticky/Fixed CTA)되도록 구성.\n\n' +
      '**4. 개발 및 QA 체크포인트**\n' +
      '- **음원 백그라운드 예외:** 음원 재생 중 앱 백그라운드 전환 또는 디바이스 잠금 시 즉시 음원 일시정지 처리 여부 확인.\n' +
      '- **네트워크 지연:** 음원 버퍼링 지연 시에도 **[확인]** 버튼 선택을 통한 Dim 닫기가 막힘 없이 동작하는지 확인.\n' +
      '- **불릿 데이터 정합성:** 불릿 데이터가 0개이거나 5개를 초과하여 인입될 경우의 방어 로직(예: 0개면 영역 숨김, 5개 초과 시 상위 5개만 렌더링 등) 확인.',
    devNotes: 'MissionTutorStage',
    designNotes: 'AI 튜터 아바타 및 말풍선',
    sourceAFile: undefined,
    sourceBRef: 'MissionTutorStage',
  },
  {
    id: 'quick-review',
    label: '3. 퀵리뷰',
    category: '신규',
    description: '이전 학습(차시 또는 레슨)에서 학습한 내용에 대한 확인을 통해 이전 학습을 기억하고 있는지 확인하는 템플릿. 문항 카드를 순서대로 확인하며 "기억나요" / "기억이 안 나요"로 응답하고, 전체 완료 후 다음 차시로 진행한다.',
    devNotes: '참고: C:\\dev\\kchao-lesson1-main 2차시 퀵리뷰\n- MOCK_QUICK_REVIEW 데이터 사용 (ADMIN 연동 전 목업)\n- 문항 수: MIN 1 ~ MAX 10\n- 문항 진행: 1번부터 순서대로 잠금 해제\n- 완료 조건: 모든 문항에 응답 완료\n- props: onNext / onBack / data(optional)',
    designNotes: '상단 배지: tealSoft 배경, "퀵 리뷰" 텍스트\n활성 카드: teal 보더 1.5px, 정답 박스(tealSoft)\n잠긴 카드: line 보더, muted 텍스트\n기억나요 버튼: teal 배경\n기억이 안 나요: 테두리 버튼\n하단: 전체 완료 시 다음 차시 버튼 활성화',
    sourceAFile: undefined,
    sourceBRef: 'QuickReviewStage',
  },
  {
    id: 'intro-tutor',
    label: '4-1. 학습 소개(문법과 표현)',
    category: '신규',
    description:
      '차시 문법 학습 시작 전 학습 내용을 간단히 안내하는 인트로 화면입니다. 문법 표현과 학습 성과를 미리 보여주어 학습 동기를 높입니다.\n\n' +
      '**1. 기본 사항 (다국어 텍스트 노출 공통 정책)**\n' +
      '- **다국어 데이터 관리:**\n' +
      '  * 기본 텍스트(한국어) 외 다국어 지원을 위한 **베트남어(VI) 전용 텍스트 필드를 CMS/Admin에 별도 등록**하여 관리.\n' +
      '- **언어 전환 노출 규칙 (Language Switching):**\n' +
      '  * 사용자의 앱 설정 언어 또는 화면 상단 언어 토글/선택값에 따라 매핑된 언어 리소스 렌더링.\n' +
      '  * **[한국어 설정 시]:** 기본 등록된 한국어 텍스트 노출.\n' +
      '  * **[베트남어 설정 시]:** 별도 등록된 베트남어 텍스트로 실시간 변경 노출.\n' +
      '  * **Fallback 정책:** 특정 영역에 베트남어 데이터가 미등록된 경우, 기본 언어(한국어)를 대체 노출하여 공백 방지.\n' +
      '- **텍스트 처리:** 개행 문자(`\\n`) 및 HTML 줄 바꿈 태그(`<br>`) 파싱 지원, 문장 길이에 따른 영역 유동 높이(Flexible Height) 적용.\n\n' +
      '**2. 음원 제어 및 하단 [다음] 버튼 정책**\n' +
      '- **음원 등록 여부 (Optional):** 각 템플릿(액티비티) 내 음원 등록은 **선택 사항**임.\n' +
      '- **재생 정책:**\n' +
      '  * **1회 자동 재생:** 액티비티 화면 진입 시 등록된 음원을 **1회 자동 재생 (Auto-play)**.\n' +
      '  * **반복 불가:** 음원은 1회만 재생되며, 재생 완료 후 재재생(Replay) 기능은 제공하지 않음.\n' +
      '- **하단 [다음] CTA 버튼 제어 인터랙션:**\n' +
      '  * **[음원 미등록 시]:** 화면 진입 즉시 **활성화 (Enable)** 상태로 노출 (탭 시 다음 단계/화면으로 이동).\n' +
      '  * **[음원 등록 시 - 재생 중]:** **비활성화 (Disable)** 상태 유지 (터치 불가).\n' +
      '  * **[음원 등록 시 - 재생 정상 완료 시]:** **활성화 (Enable)** 상태로 자동 전환.\n\n' +
      '**3. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **음원 로딩 실패/에러 대응 (Fail-safe):** 음원이 등록되어 있으나 네트워크 단절, 리소스 404/타임아웃 등으로 재생 실패(`Audio Load/Play Error`)가 발생할 경우, 화면 멈춤을 방지하기 위해 **즉시 하단 [다음] 버튼을 활성화(Enable)** 처리.\n' +
      '2) **화면 이탈 및 백그라운드 전환:** 음원 재생 중 뒤로가기, 홈 화면 전환, 다른 탭 이동 시 오디오 인스턴스를 즉시 정지 및 메모리 해제(`Stop & Release`)하여 백그라운드 소리 누수 차단.\n' +
      '3) **베트남어 폰트 및 성조 렌더링:** 베트남어 고유 성조 기호(ơ, ư, đ, ê 등) 표기 시 폰트 깨짐이나 위/아래 텍스트 짤림이 없도록 `line-height` 및 `word-break: keep-all` 스타일 적용 확인.',
    devNotes: '참고: Source A act31 PreviewIntro4 (src/screens/activity/preview/PreviewIntro4.tsx)\n- SESSION1.intro 데이터 참조\n- badge / icon / title / subtitle / achievement 구조\n- AI 튜터 오버레이: 진입 시 dim + 썸네일 + 말풍선 + 음원 자동 재생',
    designNotes: '배지: tealSoft 배경, teal 텍스트, borderRadius 20\n아이콘: tealSoft 원형(80px), 이모지 36px\n타이틀: 22px bold, center\n학습 성과 카드: #F0FAFA 배경, teal 체크 원형 아이콘',
    sourceAFile: 'src/screens/activity/preview/PreviewIntro4.tsx',
    sourceBRef: 'IntroTutorStage',
  },
  {
    id: 'intro-word',
    label: '4-1. 학습소개(단어)',
    category: '신규',
    description:
      '단어 학습 시작 전 오늘의 단어와 학습 성과를 미리 안내하는 인트로 화면. 나라/국적 단어 15개 학습 동기를 높인다.\n\n' +
      '**[화면설계서 디스크립션] 음원 재생 & 다국어 텍스트 노출 정책**\n\n' +
      '**1. 음원 재생 및 [확인] 버튼 인터랙션 정책**\n' +
      '- **음원 등록 여부에 따른 분기:**\n' +
      '  * 음원은 어드민/콘텐츠 등록 시 선택 사항(Optional)으로 제공.\n' +
      '  * 등록 여부에 따라 진입 시 **[확인]** 버튼의 기본 상태가 분기됨.\n' +
      '  * **[음원 미등록 시]**\n' +
      '    - 진입 시 버튼 상태: **[확인]** 버튼 **활성화 (Enable)**\n' +
      '    - 재생 동작: 음원 없음 (재생 스킵)\n' +
      '    - 재생 완료 후: -\n' +
      '    - 버튼 인터랙션: 탭 시 다음 단계/화면으로 즉시 이동\n' +
      '  * **[음원 등록 시]**\n' +
      '    - 진입 시 버튼 상태: **[확인]** 버튼 **비활성화 (Disable)**\n' +
      '    - 재생 동작: 화면 진입 시 음원 **자동 1회 재생 (Auto-play)**\n' +
      '    - 재생 완료 후: 재생 정상 종료 시 **[확인]** 버튼 **활성화 (Enable)** 전환\n' +
      '    - 버튼 인터랙션: 활성화 전환 후 탭 시 다음 단계/화면으로 이동\n' +
      '- **오디오 제어 및 제약 사항:**\n' +
      '  * **반복 불가:** 음원은 1회만 재생되며, 재생 완료 후 재재생(Replay) 버튼이나 인터랙션은 미제공.\n' +
      '  * **중복/누수 방지:** 백그라운드 전환, 화면 이탈, 또는 오류 발생 시 재생 인스턴스를 즉시 정지(**Stop & Release**) 처리.\n\n' +
      '**2. 텍스트 영역 정책 (장문 / 개행 / 다국어)**\n' +
      '- **텍스트 길이 및 줄 바꿈 (Format & Line-break):**\n' +
      '  * 단문부터 다중 단락의 장문까지 등록 및 노출 지원.\n' +
      '  * 영역 지정 높이 초과 시 내부 **세로 스크롤(Vertical Scroll)** 동작.\n' +
      '  * 개행 문자(`\\n`) 및 HTML 줄 바꿈 태그(`<br>`, `<br/>`)를 모두 파싱하여 줄 바꿈 및 문단 간격(빈 줄) 렌더링.\n' +
      '- **다국어(i18n) 지원 정책:**\n' +
      '  * 기본 언어 외 **베트남어(VI)** 다국어 리소스 매핑 구조 적용.\n' +
      '  * 사용자 앱 언어 설정값 또는 상단 언어 토글이 베트남어(VI)로 선택될 경우, 해당 위치의 텍스트를 등록된 베트남어 리소스로 실시간 치환 노출.\n' +
      '  * **Fallback 정책:** 만약 베트남어(VI) 텍스트가 미등록된 경우, 기본 설정 언어(한국어 등 Default 리소스)를 대체 노출.\n\n' +
      '**3. 개발 & QA 예외 처리 체크포인트 (Exception Notes)**\n' +
      '1) **음원 로딩 지연/실패 예외:**\n' +
      '   - 네트워크 장애나 파일 깨짐 등으로 음원 로딩이 실패(Audio Load Error/Timeout)할 경우, 무한 대기를 방지하기 위해 **즉시 [확인] 버튼을 활성화(Enable)** 처리.\n' +
      '2) **다국어 성조/특수문자 표기:**\n' +
      '   - 베트남어는 고유 성조 및 특수 라틴 문자(ơ, ư, đ, ê, â 등)가 포함되므로, 텍스트 폰트가 깨지지 않고 정상 렌더링되는 웹폰트/시스템 폰트 적용 확인.\n' +
      '3) **버튼 연타 방지:**\n' +
      '   - **[확인]** 버튼 활성화 후 다음 화면 전환 트리거 시 중복 호출 방지를 위해 **디바운스(Debounce) 또는 로딩 가드** 적용.',
    devNotes: '참고: IntroTutorStage 재사용\n- badge / icon / title / subtitle / achievement 구조\n- AI 튜터 오버레이: 진입 시 dim + 썸네일 + 말풍선 + 음원 자동 재생',
    designNotes: '4-1-2와 동일 구조 (텍스트만 변경). 배지: 오늘의 단어, 아이콘: 📖',
    sourceAFile: 'src/screens/activity/preview/PreviewIntro4.tsx',
    sourceBRef: 'IntroTutorStage',
  },
  {
    id: 'intro-tutor-2',
    label: '4-1-2. 학습 소개(문법 퀴즈)',
    category: '신규',
    description:
      '차시 문법 학습의 형성평가(퀴즈) 진입 전 학습 내용을 간단히 안내하는 인트로 화면입니다. 문법 퀴즈와 학습 성과를 미리 보여주어 학습 동기를 높입니다.\n\n' +
      '**1. 기본 사항 (다국어 텍스트 노출 공통 정책)**\n' +
      '- **다국어 데이터 관리:** 기본 텍스트(한국어) 외 다국어 지원을 위한 **베트남어(VI) 전용 텍스트 필드를 CMS/Admin에 별도 등록**하여 관리.\n' +
      '- **언어 전환 노출 규칙 (Language Switching):** 사용자의 앱 설정 언어 또는 화면 상단 언어 토글/선택값에 따라 매핑된 언어 리소스 렌더링.\n' +
      '  * **[한국어 설정 시]:** 기본 등록된 한국어 텍스트 노출.\n' +
      '  * **[베트남어 설정 시]:** 별도 등록된 베트남어 텍스트로 실시간 변경 노출.\n' +
      '  * **Fallback 정책:** 특정 영역에 베트남어 데이터가 미등록된 경우, 기본 언어(한국어)를 대체 노출하여 공백 방지.\n' +
      '- **텍스트 처리:** 개행 문자(`\\n`) 및 HTML 줄 바꿈 태그(`<br>`) 파싱 지원, 문장 길이에 따른 영역 유동 높이(Flexible Height) 적용.\n\n' +
      '**2. 음원 제어 및 하단 [다음] 버튼 정책**\n' +
      '- **음원 등록 여부 (Optional):** 각 템플릿(액티비티) 내 음원 등록은 **선택 사항**임.\n' +
      '- **재생 정책:** 화면 진입 시 등록된 음원을 **1회 자동 재생 (Auto-play)**하며, 재재생(Replay) 기능은 미제공.\n' +
      '- **하단 [다음] CTA 버튼 제어 인터랙션:**\n' +
      '  * **[음원 미등록 시]:** 화면 진입 즉시 **활성화 (Enable)** 상태로 노출 (탭 시 다음 단계/화면 이동).\n' +
      '  * **[음원 등록 시 - 재생 중]:** **비활성화 (Disable)** 상태 유지 (터치 불가).\n' +
      '  * **[음원 등록 시 - 재생 정상 완료 시]:** **활성화 (Enable)** 상태로 자동 전환.\n\n' +
      '**3. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **음원 로딩 실패/에러 대응 (Fail-safe):** 음원 404/타임아웃 등으로 재생 실패 시 화면 멈춤 방지를 위해 **즉시 하단 [다음] 버튼을 활성화(Enable)** 처리.\n' +
      '2) **화면 이탈 및 백그라운드 전환:** 음원 재생 중 뒤로가기/앱 전환 시 오디오 인스턴스 즉시 정지 및 메모리 해제(`Stop & Release`).\n' +
      '3) **베트남어 폰트 및 성조 렌더링:** 베트남어 특수 문자 폰트 깨짐 방지 및 `word-break: keep-all` 적용.',
    devNotes: '참고: IntroTutorStage 복사본\n- SESSION1.intro 데이터 참조\n- badge / icon / title / subtitle / achievement 구조\n- AI 튜터 오버레이: 진입 시 dim + 썸네일 + 말풍선 + 음원 자동 재생',
    designNotes: '4-1과 동일 구조 (텍스트만 변경)',
    sourceAFile: 'src/screens/activity/preview/PreviewIntro4.tsx',
    sourceBRef: 'IntroTutorStage',
  },
  {
    id: 'intro-eval',
    label: '4-1-3. 학습 소개(실전 평가)',
    category: '신규',
    description:
      '차시 학습의 실전평가(형성평가) 진입 전 학습 내용을 간단히 안내하는 인트로 화면입니다. 마이크 아이콘과 발화 평가 안내를 통해 음성 발화 활동으로의 전환을 준비합니다.\n\n' +
      '**1. 기본 사항 (다국어 텍스트 노출 공통 정책)**\n' +
      '- **다국어 데이터 관리:** 한국어 원문 외 **베트남어(VI) 번역 필드 CMS/Admin 별도 등록** 및 연동.\n' +
      '- **언어 전환 노출 규칙:** 사용자 설정을 따라 실시간 변경 렌더링, 미등록 시 기본 언어(한국어) Fallback.\n' +
      '- **텍스트 처리:** 개행 문자 파싱 및 Flexible Height 적용.\n\n' +
      '**2. 음원 제어 및 하단 [평가 시작] 버튼 정책**\n' +
      '- **1회 자동 재생:** 진입 시 AI 튜터 안내 음원 1회 Auto-play.\n' +
      '- **하단 버튼 분기:** 음원 재생 중 비활성화(Disable) → 재생 완료 시 활성화(Enable) 전환.\n' +
      '- **탭 시 동작:** 하단 **[평가 시작]** 버튼 탭 시 재생 중인 음원을 즉시 정지(`Stop & Release`)하고 평가 본문 진입.\n\n' +
      '**3. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **마이크 권한 사전 점검:** 실전 평가 진입 전 디바이스 오디오 입력 권한 상태를 확인하고 필요 시 권한 안내 모달 연동.\n' +
      '2) **음원 로딩 Fail-safe:** 오디오 다운로드 실패 시에도 즉시 [평가 시작] 버튼 활성화하여 진행 차단 방지.\n' +
      '3) **메모리 해제:** 화면 전환 시 오디오 세션 릴리즈.',
    devNotes: '참고: IntroTutorStage 복사본\n- SESSION1.introEvaluation 데이터 참조\n- badge / icon / title / subtitle / achievement 구조\n- AI 튜터 오버레이: 진입 시 dim + 썸네일 + 말풍선 + 음원 자동 재생',
    designNotes: '4-1과 동일 구조 (배지: 실전평가, 아이콘: 🎤, 텍스트 변경)',
    sourceAFile: 'src/screens/IntroEvalStage/index.tsx',
    sourceBRef: 'IntroEvalStage',
  },
  {
    id: 'set-wordbook-eval',
    label: '5-2. 단어장과 발음평가',
    category: '신규',
    description:
      '**1. 공통 정책 (어휘 목록 & 음원 제어)**\n' +
      '- **세트 구성 공통성:** 세트 1, 2, 3 등 모든 세트는 동일한 UI 컴포넌트 및 인터랙션 규칙을 공유함.\n' +
      '- **어휘 노출 수량:** 각 세트당 **Min 1개 ~ Max 20개** 등록 및 리스트 노출 지원.\n' +
      '- **음원 재생 인터랙션:**\n' +
      '  * 각 단어 우측 **[스피커]** 아이콘 탭 시 해당 단어 음원 스트리밍 재생.\n' +
      '  * **중복 방지 (Stop & Action):** 음원 재생 중 다른 단어의 스피커, 하단 버튼, 탭 전환 등 타 UI 요소를 탭할 경우 재생 중인 음원을 즉시 정지(`Stop`)한 후 해당 액션을 수행.\n' +
      '- **음원 미등록 예외 처리:**\n' +
      '  * 음원 파일이 매핑되지 않은 단어의 **[스피커]** 아이콘 탭 시 시스템 알럿(Alert) 노출.\n' +
      '  * 알럿 문구: `"등록된 음원이 없습니다."` (확인 탭 시 닫힘).\n\n' +
      '**2. 세트 정보 표시 (Header / Indicator)**\n' +
      '- **세트 운영 범위:** **Min 1개 ~ Max 5개** 구성 가능.\n' +
      '- **타이틀 표기 규칙:**\n' +
      '  * **복수 세트 (2개 이상 등록 시):** `단어장 [현재 세트 번호]/[전체 세트 수]` (예: 총 5개 중 2번째 세트 진입 시 `단어장 2/5`).\n' +
      '  * **단일 세트 (1개만 등록 시):** 분수 표기 없이 `단어장` 단독 텍스트 노출.\n\n' +
      '**3. 재생 속도 컨트롤**\n' +
      '- **기본값 (Default):** `1.0x`\n' +
      '- **옵션 구성:** `0.5x`, `1.0x`, `1.5x` (추후 배속 옵션값 변경이 용이하도록 변수/상수화 처리).\n' +
      '- **동작 방식:** 속도 토글/피커 변경 시 이후 재생되는 모든 단어 음원에 변경된 배속 즉시 적용.\n\n' +
      '**4. 보기 Tab (Filter)**\n' +
      '- **초기 상태:** 화면 진입 시 **[전체 보기]** 탭이 활성화(Default Selected)된 상태로 렌더링.\n\n' +
      '**5. 하단 CTA 버튼 인터랙션**\n' +
      '- **[단어 발음하기]:**\n' +
      '  * 단어 발음 평가 액티비티 호출 (*기존 발음 평가 액티비티 `#17` 딥링크/라우트 연동*).\n' +
      '  * 재생 중인 음원 즉시 정지(`Stop`) 후 액티비티 호출.\n' +
      '- **[세트 문제 풀기]:**\n' +
      '  * 해당 세트에 매핑된 퀴즈 액티비티 호출.\n' +
      '  * 재생 중인 음원 즉시 정지(`Stop`) 후 액티비티 호출.\n\n' +
      '**6. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **오디오 채널 누수 방지:** 발음 평가 액티비티(`#17`)는 마이크 권한을 사용하므로, **[단어 발음하기]** 진입 전 재생 중이던 배경/단어 오디오 인스턴스가 완전히 릴리즈(Audio Track Release)되었는지 필수 검증.\n' +
      '2) **배속 변경 중 재생:** 오디오가 재생 중인 상태에서 재생 속도 변경 시 실시간 반영 또는 다음 재생부터 적용 정책 동기화 확인.\n' +
      '3) **네트워크 에러:** 음원 다운로드 타임아웃 발생 시에도 `"등록된 음원이 없습니다."` 또는 네트워크 확인 토스트 노출 후 화면 멈춤이 없도록 처리.',
    devNotes: 'SetWordbookEvalStage / 세트 번호(1~3), Set 1 전용 토스트 팝업(word_set_1.mp3), 발음 평가 모달 연동',
    designNotes: '상단 단어장 1/3 배지, 핵심 어휘를 확인해요 타이틀, 토스트 팝업(스피커+닫기), 단어 발음하기 & 세트 문제 풀기 하단 버튼',
    sourceAFile: undefined,
    sourceBRef: 'SetWordbookEvalStage',
  },
  {
    id: 'set-wordbook-eval-2',
    label: '5-2-2. 단어장과 발음평가',
    category: '신규',
    description: '세트 2 핵심 어휘를 학습하고 발음 평가 및 세트 문제 풀기로 연계되는 템플릿. 5-2와 동일한 구조이며 다른 단어 데이터를 포함한다.',
    devNotes: 'SetWordbookEvalStage / 세트 번호(2), Set 2 데이터 사용, 발음 평가 모달 연동',
    designNotes: '5-2와 동일 구조 (setNumber만 2로 변경)',
    sourceAFile: undefined,
    sourceBRef: 'SetWordbookEvalStage',
  },
  {
    id: 'set-wordbook-eval-3',
    label: '5-2-3. 단어장과 발음평가',
    category: '신규',
    description: '세트 3 핵심 어휘를 학습하고 발음 평가 및 세트 문제 풀기로 연계되는 템플릿. 5-2와 동일한 구조이며 다른 단어 데이터를 포함한다.',
    devNotes: 'SetWordbookEvalStage / 세트 번호(3), Set 3 데이터 사용, 발음 평가 모달 연동',
    designNotes: '5-2와 동일 구조 (setNumber만 3으로 변경)',
    sourceAFile: undefined,
    sourceBRef: 'SetWordbookEvalStage',
  },
  // {
  //   id: 'vocab-wordbook-voice',
  //   label: '5-1. 오늘의 단어장(음성)',
  //   category: '신규',
  //   description: '한국어 단어, 베트남어 번역, 음원 등을 통해 단어를 학습하는 화면. 전체/한국어/베트남어 보기 탭 모드가 제공되며, 음성 배속 재생 조절 및 단어 발음하기 평가 기능이 포함되어 있다.',
  //   devNotes: '참고: Source B 오늘의 단어 (App.jsx), Source A 단어 발음 평가 (WordPronunciation1.tsx)\n- SESSION1.context.words 데이터 바인딩\n- 재생 속도(0.5x, 1.0x, 1.5x) 음원 재생 로직 포함',
  //   designNotes: '탭: selected 시 teal 보더 및 텍스트 적용\n단어 리스트: 15개 단어 로우 목록 렌더링\n하단 버튼: 단어 발음하기(Teal 배경) 및 바로 문제 풀기(테두리 버튼)',
  //   sourceAFile: 'src/screens/activity/word/WordPronunciation1.tsx',
  //   sourceBRef: 'VocabWordbookVoiceStage',
  // },
  {
    id: 'word-build',
    label: '6. 단어 만들기',
    category: '신규',
    description: '음원을 듣고 제시된 글자 카드를 순서대로 선택하여 단어를 완성하는 활동. 정오답 피드백 모달, 재생 속도 선택, 힌트, 키보드 입력 모드 제공.',
    devNotes: '참고: Source A WordLetterScramble5 (src/screens/activity/word/WordLetterScramble5.tsx)\n- SESSION1.wordBuildQuiz 데이터 참조 (5문항)\n- 음절 단위 타일\n- 재생 속도: 0.5x / 1.0x / 1.5x\n- FAIL_MAX=2: 2회 오답 시 정답 공개\n- 키보드 모드: TextInput으로 직접 입력',
    designNotes: '오디오 카드: teal 보더, 스피커 버튼(48px 원형) + 답 슬롯\n타일: 48×48px, 선택 시 teal 보더+배경\n피드백 모달: bottom sheet\n힌트: amber 색상',
    sourceAFile: 'src/screens/activity/word/WordLetterScramble5.tsx',
    sourceBRef: 'WordBuildStage',
  },
  {
    id: 'grammar-detail',
    label: '8. 학습 상세 소개',
    category: '신규',
    description: '문법과 표현 학습을 위한 상세 소개 화면. 문법 규칙 배지·타이틀·설명, 유튜브 스타일 영상 썸네일(탭 시 전체화면 재생), 2열 규칙 표, 받침 쌍 시각화가 포함된 보충 설명을 제공한다.',
    devNotes: "참고: Source B 문법과 표현 1 (C:\\dev\\kchao-lesson1-main\\src\\lessonData.js)\n- SESSION1.grammar 데이터 참조 (ruleTable, supplement 포함)\n- 영상: assets/M_1_L1_1080p.mp4 (require로 로드)\n- 전체화면 Modal: Platform.OS === 'web'에서 React.createElement('video', ...) 사용\n- 하단 고정: 다음 버튼",
    designNotes: '배지: tealSoft 배경, teal 텍스트, borderRadius 20\n영상 썸네일: aspectRatio 16/9, 반투명 오버레이 + 재생 버튼\n규칙 표: 2열 flex, tealSoft 헤더\n보충 설명: tealSoft 배경 블록, 받침 시각화 카드(흰 배경+shadow)\n요약 버튼: teal 배경 flex row',
    sourceAFile: undefined,
    sourceBRef: 'GrammarDetailStage',
  },
  {
    id: 'sentence-build',
    label: '9. 문장 만들기 1',
    category: '신규',
    description:
      '음원을 듣고 제시된 단어 카드를 순서대로 선택하여 문장을 완성하는 활동입니다.\n\n' +
      '**1. 상단 타이틀 영역**\n' +
      '- **다국어 매핑 정책:** 한국어(KO) 원문과 베트남어(VI) 번역문을 상/하 병기 노출.\n' +
      '- **단일 언어 예외 처리:** CMS / Admin에 등록된 타이틀이 1개 언어만 존재하는 경우 해당 언어 텍스트만 단독 노출하며 영역 여백 자동 조정.\n\n' +
      '**2. 문제 영역 (오디오 컨트롤 & 가변 빈칸 슬롯)**\n' +
      '- **음원 재생 및 반복 정책:** `[헤드폰]` 아이콘 탭 시 매핑된 문제 음원 스트리밍 재생, 1회 재생 종료 후에도 횟수 제한 없이 반복 청취(Replay) 가능.\n' +
      '- **재생 속도 컨트롤:** 기본 재생 배속 `1.0x` (Default), 추후 배속 변경 및 옵션 확장(0.8x, 1.2x 등)에 유연하게 대응하도록 배속 파라미터 모듈/상수화 처리.\n' +
      '- **빈칸 슬롯(Slot) 가변 사이즈 정책:** 등록된 정답 텍스트의 실제 길이(문장 수 및 글자 수)에 따라 빈칸 컨테이너의 높이와 너비가 자동 확장됨(Auto-fit / Flexible Height - 2문장 이상 장문 대응).\n\n' +
      '**3. 보기 영역 (Options Bank)**\n' +
      '- **보기 수량 제약:** **Min 2개 ~ Max 8개** 노출 지원.\n' +
      '- **선택 인터랙션:** 보기 탭 시 해당 보기 타일 활성화(Selected Highlight) 및 상단 빈칸 슬롯에 해당 텍스트 바인딩, 타 보기 탭 시 단일 선택 전환, 선택 완료 시 하단 `[확인]` 버튼 활성화 전환.\n\n' +
      '**4. [힌트] 버튼 정책**\n' +
      '- **버튼 활성화 분기:** 데이터 등록 시 **활성화 (Enable)** 노출 / 데이터 미등록 시 **비활성화 (Disable)** 노출 (터치/탭 차단).\n' +
      '- **버튼 탭 시 인터랙션:** 활성화 상태 탭 시 힌트 텍스트 노출 (툴팁, 말풍선, 또는 바텀시트 형태), 외부 탭 또는 [닫기] 선택 시 종료.\n\n' +
      '**5. 하단 [확인] CTA 버튼 및 정/오답 판정**\n' +
      '- **버튼 활성화 정책:** 초기 상태 미선택 시 **비활성화 (Disable)** → 보기 선택 완료 시 **활성화 (Enable)** 전환.\n' +
      '- **버튼 선택 인터랙션 (Stop & Action):** 음원 재생 중 탭 시 **재생 중인 음원을 즉시 강제 정지(`Stop & Release`)**하고 사용자가 선택한 보기에 대한 정/오답 유효성 판정 로직 및 결과 피드백 표출.\n\n' +
      '**6. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **힌트 데이터 미등록 상태 검증:** CMS/Admin 힌트가 공란(빈 값 또는 null)인 경우 버튼이 비활성화(Disable) 스타일로 렌더링되고 터치가 차단되는지 확인.\n' +
      '2) **가변 빈칸 줄바꿈 및 전체 레이아웃 점검:** 2문장 이상의 장문 정답 바인딩 시 하단 보기 및 [확인] 버튼이 화면 밖으로 밀리지 않도록 반응형 세로 스크롤(Vertical Scroll) 동작 확인.\n' +
      '3) **보기 타일 그리드 래핑(Wrap):** 보기가 최대 8개 노출되거나 텍스트 길이가 다를 때 2열 배치(`Flex-wrap/Grid`) 균일 정렬 확인.\n' +
      '4) **오디오 충돌 방지:** 문제 음원 재생 중 [확인] 탭 시 피드백 사운드와 사운드 오버랩이 발생하지 않고 기존 음원이 즉시 정지되는지 검증.',
    devNotes: '참고: 단어 만들기(WordBuildStage)와 동일한 구조\n- SESSION1.sentenceBuildQuiz 데이터 참조 (5문항)\n- 단어 단위 타일\n- FAIL_MAX=2: 2회 오답 시 정답 공개\n- 키보드 모드, 보기 선택 모드 제공',
    designNotes: '오디오 카드: teal 보더, 스피커 버튼(48px) + 답 영역(dashed)\n단어 타일: capsule 형태, #1A2B3C border\n하단: 확인(flex) + 💡(52px) + 키보드/보기선택 보조 버튼',
    sourceAFile: undefined,
    sourceBRef: 'SentenceBuildStage',
  },
  {
    id: 'sentence-build-2',
    label: '10. 문장 만들기 2',
    category: '신규',
    description:
      '베트남어 문장을 보고 해당하는 한국어 문장을 선택지에서 조합/선택하여 완성하는 활동입니다.\n\n' +
      '**1. 상단 타이틀 영역**\n' +
      '- **다국어 매핑 정책:** 한국어(KO) 원문과 베트남어(VI) 번역문을 상/하 병기 노출.\n' +
      '- **단일 언어 예외 처리:** CMS / Admin에 등록된 타이틀이 1개 언어만 존재하는 경우 해당 언어 텍스트만 단독 노출하며 영역 여백 자동 조정.\n\n' +
      '**2. 문제(문항) 텍스트 영역**\n' +
      '- **텍스트 노출 및 개행 정책:** CMS / Admin에 등록된 문항 텍스트 바인딩 노출.\n' +
      '- **장문 대응 (줄바꿈/띄어쓰기):**\n' +
      '  * 개행 문자(`\\n`) 및 HTML 태그(`<br>`, `<br/>`) 파싱을 지원하여 줄바꿈 및 문단 간격(빈 줄) 반영.\n' +
      '  * 가독성을 위한 단어 단위 자동 줄바꿈(`word-break: keep-all`) 적용.\n' +
      '  * 텍스트 길이에 따라 문제 영역의 세로 높이가 유연하게 확장(Flexible Height)됨.\n\n' +
      '**3. 보기 영역 (Options Bank)**\n' +
      '- **보기 수량 제약:** **Min 2개 ~ Max 8개** 노출 지원.\n' +
      '- **선택 인터랙션 (Single Choice):** 보기 탭 시 해당 보기 타일 활성화(Selected Highlight), 타 보기 탭 시 단일 선택 전환, 보기 선택 완료 시 하단 `[확인]` 버튼 활성화 전환.\n\n' +
      '**4. [힌트] 버튼 정책**\n' +
      '- **버튼 활성화 분기:**\n' +
      '  * **[데이터 등록 시]:** **활성화 (Enable)** 상태로 노출.\n' +
      '  * **[데이터 미등록 시]:** **비활성화 (Disable)** 상태로 노출 (터치/탭 인터랙션 차단).\n' +
      '- **버튼 탭 시 인터랙션:** 활성화 상태 탭 시 힌트 텍스트 노출 (툴팁, 말풍선, 또는 바텀시트 형태), 외부 탭 또는 [닫기] 선택 시 종료.\n\n' +
      '**5. 하단 [확인] CTA 버튼 및 정/오답 판정**\n' +
      '- **버튼 활성화 정책:** 초기 상태 미선택 시 **비활성화 (Disable)** → 보기 선택 완료 시 **활성화 (Enable)** 전환.\n' +
      '- **버튼 탭 시 동작:** 사용자가 선택한 보기에 대한 **정/오답 유효성 판정 로직 실행** 및 결과 피드백(바텀시트/팝업, 효과음, 다음 이동 등) 표출.\n\n' +
      '**6. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **문제 텍스트 장문 입력 시 스크롤/레이아웃:** 문제 문장이 길어질 경우 하단 보기 및 [확인] 버튼이 잘리지 않도록 화면 전체 세로 스크롤(Vertical Scroll) 동작 확인.\n' +
      '2) **힌트 데이터 빈 값(Null/Empty) 처리:** CMS/Admin 힌트가 빈 문자열(`""`) 또는 `null`로 하향될 때 안정적인 비활성화(Disable) 스타일 렌더링 검증.\n' +
      '3) **보기 타일 그리드 배치 (2~8개 대응):** 보기가 최대 8개 노출되거나 텍스트 길이가 다를 때 1열/2열 그리드(`Flex-wrap/Grid`) 정렬 검증.\n' +
      '4) **더블탭 및 중복 호출 방지:** `[확인]` 탭 시 판정 로직 및 피드백 호출 중복 방지 디바운스(Debounce) 적용.',
    devNotes: '참고: 문장 만들기 1(SentenceBuildStage)과 동일한 데이터(SESSION1.sentenceBuildQuiz) 사용\n- 오디오 없음, 베트남어 지문 카드 표시\n- 답 영역: 언더라인 스타일\n- 키보드 모드 제공\n- FAIL_MAX=2',
    designNotes: '지문 카드: teal 보더(1.5px), borderRadius 16, 문장 18px bold center\n답 영역: teal 언더라인(2px), 선택 단어 teal pill\n타일: capsule 형태, #1A2B3C border\n하단: 확인(flex) + 💡(52px) + 키보드 사용하기',
    sourceAFile: undefined,
    sourceBRef: 'SentenceBuildStage2',
  },
  {
    id: 'culture',
    label: '11. 문화',
    category: '신규',
    description: '별도 오프라인으로 제공되는 교재에서 확인 가능한 한국 문화 정보를 앱에서도 확인할 수 있는 화면. 히어로 이미지/영상, 교재 연계 콘텐츠 카드(번호별 항목 포함)로 구성된다.',
    devNotes: 'MOCK_CULTURE_ACTIVITY 데이터 사용 (ADMIN 연동 전 목업)\n- activityNo / activityQuestionNo 구조로 Source A 이식 기준 준수\n- heroMedia: type(image|video) + uri(ADMIN 등록값, 미등록 시 플레이스홀더)\n- contents[].subItems: 교재 번호별 세부 항목 (선택적)\n- 스크롤 끝까지 읽으면 확인 버튼 활성화\n- props: onPressConfirm / onClose',
    designNotes: '타입 배지: tealSoft 배경, teal 텍스트\n히어로: aspectRatio 16/9, borderRadius 12\n콘텐츠 카드: surface 배경, line 보더, borderRadius 16\n세부 항목 번호: teal 배경 32×32 badge\n하단 버튼: 스크롤 완료 전 비활성(line 배경), 완료 후 teal 배경',
    sourceAFile: undefined,
    sourceBRef: 'CultureStage',
  },
  {
    id: 'video-bridge',
    label: '13. 영상 브릿지',
    category: '신규',
    description:
      '학습 이동 시 영상으로 학습해야 하는 정보를 알려주는 활동입니다. 전체화면 영상 플레이어로 구성되며, 영상 시청 후 다음 액티비티로 진행합니다.\n\n' +
      '**[기능 명세]**\n' +
      '**1. AI 튜터 인트로(Dim) 레이어 조건부 노출 정책**\n' +
      '- **조건부 진입 (Step 1):** 백오피스 데이터에 AI 튜터 안내 설정(말풍선 텍스트 또는 음원 URI)이 등록되어 있거나 `showAiTutorIntro`가 true인 경우 활동 시작 전 Dim 오버레이 레이어를 먼저 노출함.\n' +
      '- **기존 화면 직행 (Step 2):** 인트로 설정 데이터가 없는 경우 딤 레이어 없이 즉시 본 활동(영상 시청) 화면으로 진입하여 하위 호환성 유지.\n' +
      '- **오디오 자동재생 및 튜터 UI:** Dim 레이어 진입 시 AI 튜터 안내 음원 1회 자동 재생, 말풍선 우상단 스피커 아이콘 터치 시 음원 반복 재생(Replay) 가능. 말풍선 카드 우측에 AI 튜터 썸네일 수평 배치.\n' +
      '- **확인 탭 및 영상 전환:** 하단 [확인] 버튼 탭 시 현재 재생 중인 인트로 음원을 즉시 정지(Stop & Release)하고 Dim 레이어를 닫은 후 본 활동(영상 시청) 재생 시작.\n\n' +
      '**2. 비디오 플레이어 제어 정책**\n' +
      '- **진입 시 재생 (Auto-play):** Dim 레이어 해제(또는 인트로 미설정 진입) 시 등록된 영상이 1회 자동 재생됨. Dim 레이어 노출 중에는 동영상 자동재생 일시 보류.\n' +
      '- **재생 중 화면 이탈:** 백그라운드 전환, 앱 최소화, 뒤로가기 시 영상 재생을 즉시 정지(Pause/Stop)하고 비디오 세션 및 메모리 해제 처리.\n\n' +
      '**3. 자막(Caption/Subtitle) 노출 정책**\n' +
      '- **자막 파일 등록 시:** 플레이어 내 [자막] 버튼 노출, 기본 자막 ON 상태로 렌더링, 탭 시 ON ↔ OFF 토글 전환.\n' +
      '- **자막 파일 미등록 시:** [자막] 버튼 미노출 (Hidden).\n\n' +
      '**4. 하단 [다음] CTA 버튼 정책**\n' +
      '- **버튼 활성화 상태:** 영상 재생 여부와 무관하게 상시 활성화 (Enable) 상태 제공.\n' +
      '- **버튼 탭 시 인터랙션 (Stop & Action):** 영상이 재생 중인 상태에서 [다음] 버튼을 탭하면, 재생 중인 영상을 즉시 강제 정지 및 종료(Stop & Release)한 뒤 다음 단계/화면으로 이동.\n\n' +
      '**5. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **AI 튜터 오디오 및 비디오 중첩 재생 방지:** Step 1 Dim 레이어 노출 동안 영상 비디오 오디오가 동시 재생되지 않는지 확인. [확인] 탭 또는 화면 이탈 시 오디오 객체(.pause(), null)가 정상 해제되는지 점검.\n' +
      '2) **영상 리소스 누수/사운드 오버랩 방지:** [다음] 버튼 탭 시 다음 화면으로 넘어가면서 이전 영상의 오디오 트랙이 백그라운드에서 계속 재생되는 현상이 없도록 비디오 인스턴스 파기 확인.\n' +
      '3) **자막 싱크 및 다국어 렌더링:** 영상 타임스탬프와 자막 텍스트 싱크 일치 확인. 자막에 성조 기호나 특수문자가 포함될 경우 폰트 깨짐 없이 영상 하단 오버레이 영역에 안정적으로 렌더링되는지 점검.\n' +
      '4) **네트워크 지연 및 스트리밍 에러:** 동영상 로딩 버퍼링 중 또는 로딩 실패 시 플레이어 로딩 인디케이터를 노출하며, 에러 발생 시에도 하단 [다음] 버튼을 통해 사용자가 다음 액티비티로 넘어갈 수 있도록 차단 해제 보장.',
    devNotes: [
      '■ Source A 참고: act01 / intro_video / PreviewVideo1',
      '  src/screens/activity/preview/PreviewVideo1.tsx',
      '',
      '■ 이식 시 주요 변경사항',
      '1. <View> → <ActivityLayout showHeader={false} useScrollView={false}>',
      '2. LOCAL_VIDEO_ASSET → resolveActivityVideoSource(activity, videoValue)',
      '3. WebVideoPlayer → MissionSummaryVideoPlayer (captionsAvailable, subtitlesText, forcePause, bottomUi)',
      '4. handleConfirm → recordQuestionAttempt + completeActivity + navigateToNextActivityOrLessonComplete',
      '',
      '■ Source A API 데이터 매핑',
      '- getActivityQuestions(activity)[0] → firstQuestion',
      '- getQuestionListItems(question, ["video_subtitles"])[0] → firstItem',
      '- getListItemValueByColumnHeader(firstItem, ["portrait_video"]) → videoValue',
      '- resolveActivityVideoSource(activity, videoValue) → videoSource',
      '',
      '■ 프로토타입 영상 에셋',
      '  assets/video_bridge_intro.mp4 (ADMIN 등록 전 로컬 fallback)',
      '',
      '■ 하단 버튼: "다음" (Source A "학습 시작"에서 변경)',
    ].join('\n'),
    designNotes: [
      '■ 전체 배경: #111111 (다크)',
      '■ 영상 영역: flex:1, objectFit contain',
      '■ 닫기 버튼: 우상단 고정, 반투명 원형 36px',
      '■ 하단 버튼: 흰색 배경(#FFFFFF), teal 텍스트(#00a8a6), borderRadius 14, height 52',
      '■ 이식 시: Source A startButton 스타일(color #2E89FC, pretendard[700]) 참고',
    ].join('\n'),
    sourceAFile: 'src/screens/activity/preview/PreviewVideo1.tsx',
    sourceBRef: undefined,
  },
  {
    id: 'slide-explain',
    label: '14. 설명 슬라이드',
    category: '신규',
    description:
      '관리자(ADMIN)가 등록한 슬라이드(이미지)와 설명 텍스트를 한 쌍(set)으로 구성하여 순서대로 확인하는 활동입니다.\n\n' +
      '**[기능 명세]**\n' +
      '**1. 슬라이드 영역 (Image Slider)**\n' +
      '- **데이터 연동:** CMS / Admin에 등록된 이미지를 바인딩하여 렌더링.\n' +
      '- **수량 제약:** Min 1개 ~ Max 10개 노출 지원.\n' +
      '- **표시 방식:** 가로 스와이프(Swipe) 또는 네비게이션 버튼을 통한 1장 단위 페이징 전환.\n\n' +
      '**2. 슬라이드별 음원 재생 정책 (Optional)**\n' +
      '- **음원 매핑 (선택 사항):** 각 슬라이드마다 음원을 개별 매핑할 수 있으며, 음원이 등록되지 않은 슬라이드가 존재할 수 있음.\n' +
      '- **재생 정책:** 슬라이드 전환 안착 시 해당 슬라이드에 매핑된 음원이 있다면 1회 자동 재생(Auto-play). 첫 진입 시 1번 슬라이드 음원 1회 자동 재생. 음원 미매핑 시 이미지만 표시.\n' +
      '- **반복 불가:** 음원은 1회만 재생되며, 재생 완료 후 재재생(Replay) 기능은 미제공.\n\n' +
      '**3. 슬라이드 네비게이션 컨트롤 (이전 / 다음 버튼 & 인디케이터)**\n' +
      '- **페이지 인디케이터 (Pagination):** `[현재 슬라이드 번호] / [전체 슬라이드 수]` (예: 3/10 표기).\n' +
      '- **[이전] / [다음] 슬라이드 이동 버튼 상태 분기:**\n' +
      '  * **첫 번째 슬라이드 (Index = 1):** [이전] 비활성화 (Disable) / [다음] 활성화 (Enable)\n' +
      '  * **중간 슬라이드 (1 < Index < Total):** [이전] 활성화 (Enable) / [다음] 활성화 (Enable)\n' +
      '  * **마지막 슬라이드 (Index = Total):** [이전] 활성화 (Enable) / [다음] 비활성화 (Disable)\n' +
      '  * *(단, 슬라이드가 1장만 등록된 경우(1/1), [이전] 및 [다음] 이동 버튼은 모두 Disable 처리)*\n' +
      '- **버튼 탭 인터랙션 (Stop & Move & Play):** 활성화된 이동 버튼 탭 시 현재 재생 중인 음원을 즉시 정지(Stop & Release) 후 이동, 전환 완료 시 새 음원 1회 자동 재생.\n\n' +
      '**4. 하단 고정 [다음] CTA 버튼 정책**\n' +
      '- **버튼 상태:** 상시 활성화 (Enable) 제공.\n' +
      '- **버튼 탭 시 동작:** 음원 재생 중 탭 시 재생 중인 음원을 즉시 강제 정지(Stop & Release) 후 다음 액티비티 이동 Action 수행.\n\n' +
      '**5. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **스와이프 제스처 시 오디오 정지:** 손가락 스와이프로 슬라이드 전환 시 이전 음원 즉시 중단 및 다음 음원 정상 자동 재생 확인.\n' +
      '2) **빠른 연타 예외:** 슬라이드 이동 버튼 연타 시 오디오 중복(Audio Overlap) 방지 및 기존 트랙 파기 후 전환.\n' +
      '3) **화면 이탈 및 백그라운드:** 앱 최소화, 백그라운드 전환, 상단 뒤로가기 탭 시 오디오 즉시 정지 검증.',
    devNotes: '참고: Source B batchim-grammar-steps.html (9단계 콘텐츠 기반 목업)\n- MOCK_SLIDE_EXPLAIN 데이터 참조 (lessonData.ts)\n- SlideItem: { imageUri?: string; text: string } 구조\n- imageUri 미등록 시 플레이스홀더 표시\n- hasSeenLast 상태로 하단 CTA 활성화 제어\n- 이식 시: slides 배열 → ADMIN API 응답으로 교체\n- props: onNext / onBack',
    designNotes: '상단: ActivityHeader (프로그레스바 + X 버튼)\n진행 점: teal 채움(완료) / #e2e8ea(미완료), flex 분할\n이미지 카드: aspectRatio 4/3, borderRadius 16, tealSoft 배경(플레이스홀더)\n캡션 박스: tealSoft 배경, teal 텍스트 bold, borderRadius 14\n이전 버튼: ghost(흰 배경 + line 보더) / 비활성 시 #e2e8ea 보더 + #f8fafb 배경\n넘기기 버튼: ghost(흰 배경 + line 보더) / 비활성 시 동일\n하단 CTA: teal 배경 / 비활성 시 #b9c1c8',
    sourceAFile: undefined,
    sourceBRef: 'SlideExplainStage',
  },
  {
    id: 'listen-select-1',
    label: '28. 소리 듣고 단어 선택',
    category: '신규',
    description: '음성을 듣고 제시된 단어 선택지 중 정답을 고르는 액티비티. 프로그레스바 헤더 포함.',
    devNotes: 'ListenSelect1 / props: questions, onNext, onBack, currentSetNumber, totalSets / 정답/오답 피드백 모달 포함',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 질문 + 크기 확대된 음성 버튼(80x80) + 선택지 카드 / MissionStage와 동일한 색상 구조(배경 #FFFFFF)',
    sourceAFile: 'src/screens/ListenSelect1/index.tsx',
    sourceBRef: 'ListenSelect1',
  },
  {
    id: 'word-vn-ko-select-2',
    label: '29. 베트남어 단어 보고 한국어 선택',
    category: '신규',
    description:
      '**1. 상단 텍스트 영역 (가이드/타이틀)**\n' +
      '- **데이터 매핑:** 한국어 원문 텍스트 기준, 베트남어(VI) 번역 텍스트 병기 지원.\n' +
      '- **베트남어 노출 정책 (Optional):**\n' +
      '  * **[데이터 있음]:** 한국어 하단(또는 우측 지정 위치)에 베트남어 번역문 서브 텍스트로 병기 노출.\n' +
      '  * **[데이터 없음]:** 베트남어 영역은 렌더링하지 않으며(Hidden), 상단 영역 여백(Padding)을 재조정하여 한국어 텍스트만 단독 노출.\n\n' +
      '**2. 문제(문항) 텍스트 영역**\n' +
      '- **다국어 매핑 및 우선순위 정책:**\n' +
      '  * 문항 텍스트는 한국어(KO), 베트남어(VI) 2종 언어 데이터를 지원하며, 단일 언어 또는 병기 노출 가능.\n' +
      '  * CMS/Admin 등록 기준에 따라 **Primary(메인 텍스트) / Secondary(병기 서브 텍스트)** 분기 렌더링.\n' +
      '  * **[단일 언어 등록]:** 베트남어 단독(기본형) 또는 한국어 단독 노출.\n' +
      '  * **[한국어 메인 + 베트남어 등록]:** 상단: 한국어(강조 폰트) / 하단: 베트남어 병기.\n' +
      '  * **[베트남어 메인 + 한국어 등록]:** 상단: 베트남어(강조 폰트) / 하단: 한국어 병기.\n' +
      '- **텍스트 처리:** 줄 바꿈(`\\n`, `<br>`) 파싱 지원 및 문장 길이에 따른 유동 높이 적용.\n\n' +
      '**3. 보기 영역 (Image Cards)**\n' +
      '- **이미지 렌더링 비율:**\n' +
      '  * 사전에 정의된 **고정 종횡비(Fixed Aspect Ratio)** 컨테이너를 유지하여 노출.\n' +
      '  * CSS/컴포넌트 속성: `object-fit: cover` (또는 필요 시 `contain`)를 적용하여 왜곡 방지.\n' +
      '- **운영 가이드:** CMS 등록 시 규격에 맞춘 가이드 이미지 등록 기준을 따름.\n\n' +
      '**4. 정/오답 인터랙션 및 피드백 정책**\n' +
      '- **보기 선택 시 인터랙션:**\n' +
      '  * 보기 탭 즉시 해당 카드의 선택 UI 활성화(선택 테두리, 하이라이트 등).\n' +
      '  * 중복 탭 방지(Disable 처리) 후 정/오답 판정 로직 실행.\n' +
      '- **피드백 노출:**\n' +
      '  * **[정답 (Correct)]:** 선택한 보기 카드 정답 상태(Green 테두리/아이콘) 전환, 정답 효과음 재생 및 하단 정답 피드백 팝업/바텀시트 노출 → **[다음]** 버튼 활성화.\n' +
      '  * **[오답 (Incorrect)]:** 선택한 보기 카드 오답 상태(Red 테두리/아이콘/진동 효과) 전환, 오답 효과음 재생 및 재시도 유도 또는 오답 피드백 노출.\n\n' +
      '**5. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **성조/특수문자 줄 바꿈:** 베트남어 장문 노출 시 단어 단위 줄 바꿈(`word-break: keep-all` / `break-word`)이 적절히 적용되어 가독성을 해치지 않는지 확인.\n' +
      '2) **이미지 로딩 예외:** 네트워크 지연 시 스켈레톤 UI 또는 플레이스홀더를 제공하며, 로딩 실패(Error) 시 대체 기본 이미지 노출.\n' +
      '3) **효과음 중복 제어:** 사용자가 보기를 연속 탭할 때 오디오 버퍼 중복 호출이 발생하지 않도록 버튼 입력 잠금(Debounce) 확인.',
    devNotes: 'WordVnKoSelect2 / props: questions, onNext, onBack, currentSetNumber, totalSets / 정답/오답 피드백 모달 포함 / Set 1 전용 토스트 팝업',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 베트남어 단어 카드(토스트 overlaid) + 한국어 선택지 카드(음성버튼) / MissionStage와 동일한 색상 구조(배경 #FFFFFF)',
    sourceAFile: 'src/screens/WordVnKoSelect2/index.tsx',
    sourceBRef: 'WordVnKoSelect2',
  },
  {
    id: 'word-sound-1',
    label: '31. 단어를 보고 음원 선택',
    category: '신규',
    description:
      '한국어/베트남어 단어를 보고 해당하는 음원 선택지 중 정답을 고르는 액티비티. 프로그레스바 헤더 및 1번 세트 안내 토스트 팝업 포함.\n\n' +
      '**1. 상단 텍스트 영역 (가이드/타이틀)**\n' +
      '- **데이터 매핑:** 한국어(KO) 원문 텍스트 기준, 베트남어(VI) 번역 텍스트 병기 지원.\n' +
      '- **베트남어 노출 정책 (Optional):**\n' +
      '  * **[데이터 등록 시]:** 한국어 하단(또는 우측 지정 위치)에 베트남어 번역문 서브 텍스트로 병기 노출.\n' +
      '  * **[데이터 미등록 시]:** 베트남어 영역은 DOM 미노출(Hidden) 처리하며, 상단 레이아웃 여백을 자동 재조정하여 한국어 텍스트만 단독 노출.\n\n' +
      '**2. 문제(문항) 텍스트 영역**\n' +
      '- **다국어 매핑 및 우선순위 정책:**\n' +
      '  * 문항 텍스트는 한국어(KO), 베트남어(VI) 2종 언어 데이터를 지원하며, 단일 언어 또는 병기 노출 가능.\n' +
      '  * CMS/Admin 등록 기준(우선순위/순서)에 따라 **Main(주 텍스트) / Sub(병기 텍스트)** 분기 렌더링.\n' +
      '  * **[단일 언어 등록]:** 베트남어 단독(기본형) 또는 한국어 단독 노출.\n' +
      '  * **[한국어 Main + 베트남어 Sub]:** 상단: 한국어(강조 폰트) / 하단: 베트남어 병기.\n' +
      '  * **[베트남어 Main + 한국어 Sub]:** 상단: 베트남어(강조 폰트) / 하단: 한국어 병기.\n' +
      '- **텍스트 처리:** 줄 바꿈(`\\n`, `<br>`) 파싱 지원 및 문장 길이에 따른 유동 높이 적용.\n\n' +
      '**3. 보기 영역 (Audio Options)**\n' +
      '- **보기 선택 및 음원 재생 인터랙션:**\n' +
      '  * 사용자가 보기 카드를 탭(선택)하면 해당 보기가 선택 상태(Selected Highlight)로 전환되고, 매핑된 **보기 음원이 즉시 재생**.\n' +
      '  * **음원 오버랩 방지 (Stop & Play):** 보기 A의 음원이 재생 중인 상태에서 보기 B를 탭할 경우, 재생 중이던 보기 A의 음원을 즉시 정지(`Stop`)하고 보기 B의 선택 상태 전환 및 보기 B 음원 재생 시작.\n' +
      '  * 동일한 보기를 재선택할 경우 음원 처음부터 재재생 지원.\n\n' +
      '**4. 하단 [확인] CTA 버튼 정책**\n' +
      '- **버튼 활성화(Enable) 조건:**\n' +
      '  * **초기 상태 (진입 시):** 보기 미선택 상태이므로 **비활성화 (Disable)**.\n' +
      '  * **보기 선택 완료 시:** **활성화 (Enable)** 전환.\n' +
      '- **버튼 선택 시 동작 (정/오답 판정 및 오디오 제어):**\n' +
      '  * 보기 음원이 재생 중인 상태에서 **[확인]** 버튼을 탭하면, **재생 중인 음원을 즉시 강제 정지(`Stop & Release`)**.\n' +
      '  * 음원 정지와 동시에 사용자가 선택한 보기에 대한 **정/오답 유효성 판정 로직 실행**.\n' +
      '  * 판정 결과에 따른 정/오답 인터랙션(결과 팝업, 피드백 사운드, 다음 단계 이동 등) 진행.\n\n' +
      '**5. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **오디오 세션 충돌 방지:** **[확인]** 버튼 선택 시 보기 음원 정지 처리가 미흡하여 결과 사운드(정/오답 효과음)와 보기 음원이 겹쳐 재생되는 현상이 없도록 보장.\n' +
      '2) **연타/더블탭 방지 (Debounce):** **[확인]** 버튼을 빠르게 여러 번 탭할 때 판정 API나 화면 전환 로직이 중복 호출되지 않도록 터치 잠금 처리.\n' +
      '3) **보기 음원 로딩 실패 예외:** 네트워크 오류 등으로 보기 음원 로딩이 실패하더라도 보기의 선택(Select) 및 **[확인]** 버튼 판정 동작 자체는 정상적으로 진행될 수 있도록 예외 분기 처리.',
    devNotes: 'WordSound1 / props: questions, onNext, onBack, currentSetNumber, totalSets / 정답/오답 피드백 모달 포함 / Set 1 전용 토스트 팝업(260825_word_1.mp3)',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 단어 텍스트 카드(토스트 overlaid) + 2x2 음원 버튼 그리드 / MissionStage와 동일한 색상 구조(배경 #FFFFFF)',
    sourceAFile: 'src/screens/WordSound1/index.tsx',
    sourceBRef: 'WordSound1',
  },
  {
    id: 'word-letter-blank',
    label: '32. 소리를 듣고 빈칸을 채우기',
    category: '신규',
    description:
      '음원을 듣고 제시된 글자 타일을 순서대로 선택하여 빈칸을 채우는 액티비티입니다. 프로그레스바 헤더 및 1번 세트 안내 토스트 팝업을 포함합니다.\n\n' +
      '**1. 상단 텍스트 영역 (가이드/타이틀)**\n' +
      '- **데이터 매핑:** 한국어(KO) 원문 텍스트 기준, 베트남어(VI) 번역 텍스트 병기 지원.\n' +
      '- **베트남어 노출 정책 (Optional):**\n' +
      '  * **[데이터 등록 시]:** 한국어 하단에 베트남어 번역문 서브 텍스트로 병기 노출.\n' +
      '  * **[데이터 미등록 시]:** 베트남어 영역은 DOM 미노출(Hidden) 처리하며, 상단 레이아웃 여백을 자동 재조정하여 한국어 텍스트만 단독 노출.\n\n' +
      '**2. 문제 영역 - 음원 제어**\n' +
      '- **스피커 인터랙션:**\n' +
      '  * **[스피커]** 아이콘 탭 시 문제 음원 스트리밍 재생.\n' +
      '  * 재생 종료 후에도 아이콘을 탭하여 **무제한 반복 재생(Replay)** 가능.\n' +
      '- **재생 중 중단 정책 (Stop on Action):**\n' +
      '  * 음원이 재생 중인 상태에서 하단 **보기 타일을 탭(선택)할 경우, 재생 중인 음원을 즉시 정지(`Stop`)** 처리.\n\n' +
      '**3. 빈칸 영역 (Answer Slots)**\n' +
      '- **빈칸 수량 제약:** **Min 2개 ~ Max 7개** 노출 지원 (문항 정답 글자/단어 수에 따라 가변 렌더링).\n' +
      '- **입력(채우기) 인터랙션:**\n' +
      '  * 사용자가 하단 보기를 선택할 때마다 **왼쪽 빈칸부터 순차적으로 채워짐(Left-to-Right)**.\n' +
      '  * 이미 빈칸이 모두 채워진 상태에서는 추가 보기 선택 불가.\n' +
      '- **삭제 및 재정렬(Shift) 인터랙션:**\n' +
      '  * 채워진 빈칸 타일을 탭하면 해당 글자가 빈칸에서 **삭제**되고, 하단 보기 영역의 해당 타일은 **선택 전 원상태로 복구**.\n' +
      '  * **좌측 당김 정렬 (Left Shift):** 중간에 위치한 빈칸을 삭제할 경우, **그 뒤에 있던 텍스트들이 한 칸씩 좌측으로 이동**하여 빈틈없이 연속으로 채워짐.\n' +
      '  * *예시: `[1:가][2:나][3:다]` 상태에서 2번째 `[나]`를 탭하여 삭제 시 → `[1:가][2:다][3:빈칸]`으로 재정렬.*\n\n' +
      '**4. 보기 영역 (Word/Character Bank)**\n' +
      '- **보기 수량 제약:** **Min 5개 ~ Max 10개** 노출 지원.\n' +
      '- **보기 타일 상태 인터랙션:**\n' +
      '  * **기본(Default):** 탭 가능 상태.\n' +
      '  * **선택 시(Selected):** 탭 시 빈칸 영역으로 텍스트 전달. 해당 보기 타일은 선택 불가 상태(비활성화 or 숨김/블러 처리)로 전환.\n' +
      '  * **빈칸에서 삭제 시:** 빈칸에서 해제된 타일은 보기 영역에서 다시 선택 가능(Default) 상태로 복귀.\n\n' +
      '**5. 하단 [확인] CTA 버튼 정책**\n' +
      '- **버튼 활성화 조건:**\n' +
      '  * **비활성화 (Disable):** 빈칸이 1개라도 비어 있는 상태 (초기 진입 포함).\n' +
      '  * **활성화 (Enable):** 노출된 **모든 빈칸 슬롯이 채워진 순간(Full)** 즉시 활성화 전환.\n' +
      '  * **재-비활성화 (Disable 전환):** 빈칸 텍스트를 탭/삭제하여 **단 1칸이라도 빈칸이 다시 발생하는 순간** 즉시 비활성화 상태로 복귀.\n' +
      '- **버튼 탭 시 인터랙션:**\n' +
      '  * 사용자가 채운 슬롯 텍스트와 정답 데이터 비교를 통한 **정/오답 판정 로직 실행**.\n' +
      '  * 판정 결과에 따른 인터랙션(성공/실패 효과음, 피드백 바텀시트/팝업, 다음 단계 이동 등) 호출.\n\n' +
      '**6. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **타일 Shift 애니메이션 동기화:** 빈칸 삭제 시 뒤의 글자가 앞으로 당겨지는(Shift) 도중에 사용자가 빈칸이나 보기를 빠르게 연타(Multi-touch)할 경우 배열 인덱스(Index) 꼬임이 없는지 검증.\n' +
      '2) **동일 글자 중복 처리:** 보기에 같은 글자(예: "사"가 2개 이상)가 존재할 경우, 빈칸에서 삭제했을 때 어떤 보기 타일이 복구되어야 하는지 매핑 ID(Unique Tile ID) 기반으로 동작하는지 확인.\n' +
      '3) **음원 동시 재생 방지:** 음원 재생 중에 보기 타일을 탭했을 때 오디오 플레이어가 즉각 정지되는지 확인.',
    devNotes: 'WordLetterBlank / props: questions, onNext, onBack, currentSetNumber, totalSets / 정답/오답 피드백 모달 포함 / Set 1 전용 토스트 팝업(260825_word_2.mp3)',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 음성 버튼 + 빈칸 보드 + 글자 타일 그리드 + 초기화 버튼 / MissionStage와 동일한 색상 구조(배경 #FFFFFF)',
    sourceAFile: 'src/screens/WordLetterBlank/index.tsx',
    sourceBRef: 'WordLetterBlank',
  },
  {
    id: 'set-complete',
    label: '33. 세트 학습 완료 (1/3)',
    category: '신규',
    description:
      '1개 세트(Set) 학습 완료 시 노출되는 축하 및 전이 화면입니다. 체크마크 아이콘, 완료 메시지 및 자동 음원 재생을 지원합니다.\n\n' +
      '**1. 기본 사항 (다국어 텍스트 노출 공통 정책)**\n' +
      '- **지원 언어:** 한국어(KO), 베트남어(VI) 2종 언어 데이터 지원.\n' +
      '- **노출 방식 및 계층 구조:**\n' +
      '  * 단일 언어 또는 2개 언어 병기 노출을 모두 지원.\n' +
      '  * CMS/Admin 등록 순서(또는 Primary 설정값)에 따라 **Main(주 텍스트) / Sub(병기 텍스트)**를 동적으로 분기 렌더링.\n' +
      '  * **[단일 언어 등록]:** 등록된 1개 언어(한국어 또는 베트남어)만 단독 노출.\n' +
      '  * **[한국어 우선 등록]:** 상단: 한국어(강조 폰트) / 하단: 베트남어 병기.\n' +
      '  * **[베트남어 우선 등록]:** 상단: 베트남어(강조 폰트) / 하단: 한국어 병기.\n' +
      '- **텍스트 처리:** 개행 문자(`\\n`) 및 HTML 태그(`<br>`) 파싱 지원, 문장 길이에 따른 유동 높이(Flexible Height) 적용.\n\n' +
      '**2. 음원 재생 및 하단 [다음] 버튼 제어 정책**\n' +
      '- **음원 등록 여부 (Optional):** 액티비티/템플릿 내 축하 음원은 **선택 사항**으로, 미등록될 수 있음.\n' +
      '- **진입 및 재생 인터랙션:**\n' +
      '  * **1회성 자동 재생:** 화면 진입 시 등록된 음원을 **1회 자동 재생(Auto-play)**.\n' +
      '  * **반복 불가:** 재생 완료 후 재재생(Replay) 인터랙션 미제공.\n' +
      '- **하단 [다음] 버튼 활성화 분기:**\n' +
      '  * **[음원 미등록 시]:** 화면 진입 즉시 **활성화 (Enable)** 상태로 시작 (탭 시 즉시 다음 단계 이동).\n' +
      '  * **[음원 등록 시 - 재생 중]:** 화면 진입 및 음원 재생 중에는 **비활성화 (Disable)** 유지.\n' +
      '  * **[음원 등록 시 - 재생 완료]:** 음원 재생이 정상 종료되는 순간 즉시 **활성화 (Enable)** 전환.\n\n' +
      '**3. 테마 적용 시 썸네일 이미지 노출 정책**\n' +
      '- **노출 방식 검토 (우선순위 분기):**\n' +
      '  * **[1안 - 자동 추출 (권장안)]:** 별도 대표 썸네일 등록 없이, 해당 단어장에 등록된 단어 이미지 중 **랜덤 3종을 자동 추출하여 조합 노출** (이미지 부족 시 등록 수량만 노출하거나 디폴트 플레이스홀더 대체).\n' +
      '  * **[2안 - 수동 등록 (Fallback안)]:** 1안 구현이 기술적/성능상 제약이 있는 경우, CMS/Admin에서 테마 대표 썸네일 이미지를 직접 등록하는 구조 유지.\n\n' +
      '**4. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **음원 로딩 실패/에러 대응 (Fail-safe):** 음원이 등록되어 있으나 네트워크 단절, 파일 손상 등으로 로딩 타임아웃 또는 재생 에러(Audio Error) 발생 시, 화면 멈춤을 방지하기 위해 **즉시 [다음] 버튼을 활성화(Enable)** 처리.\n' +
      '2) **화면 이탈 및 백그라운드 전환:** 음원 재생 중 사용자가 뒤로가기, 홈 화면 전환, 액티비티 이탈 시 오디오 재생 인스턴스를 즉시 정지(`Stop & Release`) 처리.\n' +
      '3) **랜덤 썸네일 깜빡임 방지:** 1안 적용 시 썸네일 이미지가 화면을 새로고침할 때마다 바뀌어 레이아웃 시각적 피로감을 주지 않도록, 세션/조회 단위 고정(캐싱) 처리 확인.',
    devNotes: 'SetCompleteStage / props: setNumber, totalSets, onNext, onBack / 화면 진입 500ms 후 자동 음원 재생(260825_setcomplete.mp3) / 다국어 지원(한국어/베트남어)',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 체크마크 아이콘(teal 원형, 80px) + 완료 메시지 3줄 / 하단: 다음→ 버튼(teal soft 배경) / MissionStage와 동일한 색상 구조',
    sourceAFile: 'src/screens/SetCompleteStage/index.tsx',
    sourceBRef: 'SetCompleteStage',
  },
  {
    id: 'set-complete-2',
    label: '34. 세트 학습 완료 (2/3)',
    category: '신규',
    description: '2 세트 학습 완료 후 노출되는 축하 화면. 33번과 동일한 구조.',
    devNotes: 'SetCompleteStage / props: setNumber={2}, totalSets={3}, onNext, onBack',
    designNotes: '33번과 동일 (setNumber만 2로 변경)',
    sourceAFile: 'src/screens/SetCompleteStage/index.tsx',
    sourceBRef: 'SetCompleteStage',
  },
  {
    id: 'set-complete-3',
    label: '35. 세트 학습 완료 (3/3)',
    category: '신규',
    description: '3 세트 학습 완료 후 노출되는 축하 화면. 33번과 동일한 구조.',
    devNotes: 'SetCompleteStage / props: setNumber={3}, totalSets={3}, onNext, onBack',
    designNotes: '33번과 동일 (setNumber만 3으로 변경)',
    sourceAFile: 'src/screens/SetCompleteStage/index.tsx',
    sourceBRef: 'SetCompleteStage',
  },
  {
    id: 'sentence-blank-1',
    label: '18. 문장 빈칸 채우기',
    category: '신규',
    description:
      '베트남어 지문을 읽고 한국어 문장의 빈칸을 선택지에서 고르는 활동입니다.\n\n' +
      '**[기능 명세]**\n' +
      '**1. 상단 타이틀 영역**\n' +
      '- **다국어 매핑 정책:** 기본적으로 한국어(KO) 원문과 베트남어(VI) 번역문을 병기 노출.\n' +
      '- **단일 언어 예외 처리:** CMS/Admin에 등록된 텍스트가 1개 언어만 존재하는 경우, 해당 언어 텍스트만 단독 노출하며 영역 여백 자동 조정.\n\n' +
      '**2. 문제 문장 및 빈칸 영역 (Question Slot)**\n' +
      '- **문장 렌더링 및 빈칸 위치 가변화:** 문장 텍스트 중간에 정답을 채워 넣는 빈칸(Slot) UI 제공. 치환자({{blank}}) 위치에 따라 문장 시작/중간/끝 등 가변 배치 지원.\n' +
      '- **빈칸 상태:** 보기 미선택 시 빈칸 상태 유지(플레이스홀더), 보기 탭 시 선택된 보기 텍스트가 빈칸 내에 실시간 바인딩 노출.\n\n' +
      '**3. 보기 영역 (Options Bank)**\n' +
      '- **보기 수량 제약:** Min 1개 ~ Max 4개 노출 지원.\n' +
      '- **보기 텍스트:** 단일 언어(한국어 또는 베트남어 중 1종) 텍스트 렌더링.\n' +
      '- **선택 인터랙션:** 보기 탭 시 해당 보기 선택 상태(Selected Highlight) 변경 및 빈칸 즉시 반영, 타 보기 탭 시 기존 선택 해제 및 신규 보기 교체(Single Choice). 선택 완료 시 하단 [확인] 버튼 활성화.\n\n' +
      '**4. 정/오답 판정 및 피드백/음원 정책**\n' +
      '- **판정 트리거:** 보기 선택 후 활성화된 하단 [확인] 버튼 탭 시 정/오답 유효성 판정 실행.\n' +
      '- **시나리오별 피드백 및 음원 재생 정책:**\n' +
      '  * **정답:** 정답 피드백 팝업/바텀시트 노출 + 하단 [다음] 버튼 + 매핑된 정답 음원 1회 자동 재생 (피드백 내 스피커 탭 시 반복 재생 가능)\n' +
      '  * **오답 1회차:** 오답 1차 피드백 노출 (힌트/재시도 안내) + 하단 [다시 풀기] 버튼 + 음원 미재생 (피드백 UI만 제공)\n' +
      '  * **오답 2회차 (최종):** 오답 2차 피드백 노출 (정답 공개/해설) + 하단 [다음] 버튼 + 매핑된 해설/오답 음원 1회 자동 재생 (피드백 내 스피커 탭 시 반복 재생 가능)\n' +
      '- **피드백 하단 버튼 탭 시 오디오 제어 (Stop & Action):** 음원 재생 중 하단 버튼([다음], [다시 풀기]) 탭 시 재생 중인 음원을 즉시 강제 정지(Stop & Release) 후 이동/재시도 수행.\n\n' +
      '**5. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **음원 반복 재생 중 이동 처리:** 반복 재생 중 하단 버튼 탭 시 오디오 버퍼가 즉각 파기되어 다음 화면으로 사운드가 넘어가지 않는지 검증.\n' +
      '2) **음원 미등록 예외:** 정답 및 오답 2회차 음원 미등록 시 음원 재생만 건너뛰고 피드백 UI 정상 노출.\n' +
      '3) **오답 카운트 초기화 시점:** 해당 문항 내 오답 횟수(1회/2회) 유지, 다음 문항 이동 시 오답 카운터 0으로 초기화.',
    devNotes: 'SentenceBlank1 / Source A SentenceBlank1 참고 / props: questions, onNext, onBack, currentSetNumber, totalSets / 단어 선택 기반 답변 / 다국어 지원',
    designNotes: '상단: ActivityHeader 프로그레스바 / 베트남어 지문 카드(#F0FAFA bg, teal border) / 한국어 문장(빈칸 표시___) / 선택지 버튼 / 하단: 확인 버튼 / 피드백 모달',
    sourceAFile: 'src/screens/SentenceBlank1/index.tsx',
    sourceBRef: 'SentenceBlank1',
  },
  {
    id: 'word-blank-1',
    label: '12. 단어 빈칸 채우기',
    category: '신규',
    description: '베트남어 단어를 읽고 한국어 단어의 빈칸을 선택지에서 고르는 활동. 어휘 이해 강화.',
    devNotes: 'WordBlank1 / Source A WordBlank3 참고 / props: questions, onNext, onBack, currentSetNumber, totalSets / 단어 선택 기반 답변 / 다국어 지원',
    designNotes: '상단: ActivityHeader 프로그레스바 / 베트남어 단어 카드 / 한국어 단어(빈칭 표시___) / 선택지 버튼 / 하단: 확인 버튼 / 피드백 모달',
    sourceAFile: 'src/screens/WordBlank1/index.tsx',
    sourceBRef: 'WordBlank1',
  },
  {
    id: 'listen-typing-1',
    label: '19. 음원 듣고 입력하기',
    category: '신규',
    description: '음원을 듣고 베트남어/한국어를 텍스트로 입력하는 활동. 청취 및 입력 능력 강화.',
    devNotes: 'ListenTyping1 / Source A ListenTyping4 참고 / props: questions, onNext, onBack, currentSetNumber, totalSets / 텍스트 입력 기반 답변 / 음원 재생 버튼 / 힌트 표시 가능 / 다국어 지원',
    designNotes: '상단: ActivityHeader 프로그레스바 / 음원 재생 카드(원형 버튼, teal 테두리) / 힌트 카드(옵션) / 텍스트 입력 필드 / 하단: 확인 버튼 / 피드백 모달',
    sourceAFile: 'src/screens/ListenTyping1/index.tsx',
    sourceBRef: 'ListenTyping1',
  },
  {
    id: 'sentence-select-1',
    label: '20. 뜻에 맞는 문장 고르기',
    category: '신규',
    description:
      '베트남어 문장을 읽고 한국어 문장 선택지 중 뜻에 맞는 것을 고르는 활동입니다.\n\n' +
      '**[기능 명세]**\n' +
      '**1. 상단 타이틀 영역**\n' +
      '- **다국어 매핑 정책:** 기본적으로 한국어(KO) 원문과 베트남어(VI) 번역문을 병기 노출.\n' +
      '- **단일 언어 예외 처리:** CMS/Admin에 등록된 텍스트가 1개 언어만 존재하는 경우, 해당 언어 텍스트만 단독 노출하며 상단 영역 여백을 자동 조정.\n\n' +
      '**2. 문제(문항) 텍스트 영역**\n' +
      '- **텍스트 노출 및 개행 정책:** 등록된 문제 문장 텍스트 바인딩 노출.\n' +
      '- 문장 길이에 따라 1줄 또는 2줄 이상 유동적으로 확장(Flexible Height) 지원.\n' +
      '- 개행 문자(\\n) 및 HTML 태그(<br>, <br/>) 파싱을 지원하여 등록자가 원하는 위치에서 줄바꿈이 정상 렌더링되도록 구성.\n\n' +
      '**3. 보기 영역 (Options Bank)**\n' +
      '- **보기 수량 제약:** Min 1개 ~ Max 4개 노출 지원.\n' +
      '- **텍스트 노출:** 각 보기에 매핑된 등록 텍스트 렌더링.\n' +
      '- **선택 인터랙션 (Single Choice):** 보기 탭 시 해당 보기 카드 활성화(Selected Highlight), 타 보기 탭 시 기존 선택 해제 및 신규 선택 단일 전환.\n\n' +
      '**4. 하단 [확인] CTA 버튼 및 정/오답 판정**\n' +
      '- **버튼 활성화(Enable) 정책:** 초기 진입 시 비활성화(Disable) → 보기 선택 완료 시 활성화(Enable) 전환.\n' +
      '- **버튼 선택 시 동작:** 선택된 보기에 대한 정/오답 유효성 판정 로직 실행 및 피드백(팝업/바텀시트, 효과음, 다음 이동 버튼 등) 화면 표출.\n\n' +
      '**5. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **더블탭 및 중복 호출 방지:** [확인] 버튼 탭 시 정/오답 판정 API 또는 상태 전이 로직 중복 실행 방지 디바운스(Debounce) 및 터치 잠금 적용.\n' +
      '2) **줄바꿈 및 긴 텍스트 UI 대응:** 문제 영역 2줄 이상 확장 시 보기 및 하단 버튼이 잘리지 않도록 반응형 스크롤/패딩 처리 확인.\n' +
      '3) **보기 텍스트 줄바꿈:** 보기 카드 내 텍스트 말줄임표(...) 대신 단어 단위 줄바꿈(word-break: keep-all) 안정 적용 검증.',
    devNotes: 'SentenceSelect1 / Source A SentenceBlank1 참고 / props: questions, onNext, onBack, currentSetNumber, totalSets / 문장 선택 기반 답변 (라디오 버튼) / 다국어 지원',
    designNotes: '상단: ActivityHeader 프로그레스바 / 베트남어 지문 카드(#F0FAFA bg, teal border) / 한국어 문장 선택지 (라디오 버튼 + 텍스트) / 하단: 확인 버튼 / 피드백 모달',
    sourceAFile: 'src/screens/SentenceSelect1/index.tsx',
    sourceBRef: 'SentenceSelect1',
  },
  {
    id: 'speaking-eval',
    label: '15. 실전평가 (음성 발화)',
    category: '신규',
    description: '빈칸을 채우고 음성으로 발화하는 형성평가 활동. 4단계(1/4~4/4)로 구성되며 각 단계에서 텍스트 입력 후 마이크로 녹음하는 방식으로 진행된다.',
    devNotes: 'SpeakingEvalStage / props: questions, onNext, onBack, currentSetNumber, totalSets / 여러 단계의 빈칙 채우기 / 마이크 음성 녹음 기능 / 다국어 지원',
    designNotes: '상단: 단계 표시(실전평가 · 1/4 등) / 안내 문장(리스트) / 입력 필드들 / 마이크 버튼(원형, teal) / 하단: 다음/제출 버튼',
    sourceAFile: 'src/screens/SpeakingEvalStage/index.tsx',
    sourceBRef: 'SpeakingEvalStage',
  },
  {
    id: 'learning-report',
    label: '16. 학습 리포트 (개편)',
    category: '수정',
    description: '1차시 학습 완료 후 전체 학습 성과를 요약하는 최종 리포트. 정답률 도넛 차트, 4대 영역별 성취도(어휘/듣기/발음/문법), 1차시 요약, 발음평가 3축(정확도/완성도/유창성) 방사형 레이더 차트 및 5단계 정답률 구간별 자동 총평(다국어 KO/VI 지원)을 포함한다.',
    devNotes: 'LearningReportStage / props: data, onNext, onBack / 도넛 차트(ReportDonutChart), 3축 레이더 차트(ReportRadarChart) SVG 컴포넌트 탑재 / 5단계 정답률 구간 총평 헬퍼(feedbackUtils) / 다국어(KO/VI) 100% 지원',
    designNotes: '상단: ActivityHeader + 학습 리포트 배지 + 3D 학사모 / 학습 분석 카드(도넛+4개영역+3단스탯칩) / 1차시 요약 그리드 / 발음평가 3축 방사형 차트 / AI 튜터 총평 카드 / 하단: 학습 완료 CTA',
    sourceAFile: 'src/screens/activity/lessoncomplete/LessonReportModal.tsx',
    sourceBRef: 'LearningReportStage',
  },
  {
    id: 'practical-speaking',
    label: '22. 실전 말하기',
    category: '신규',
    description: '빈칸을 채우고 소리 내어 말하는 실전 말하기 활동. 키보드 입력 또는 마이크 음성 인식으로 빈칸 작성. 다단계(1/N) 진행. 정/오답 평가는 추후 제공 예정.',
    devNotes: 'PracticalSpeakingStage / props: onNext, onBack, data(optional) / TextInput 빈칸 입력 / 마이크 버튼(프로토타입: 2초 후 자동 해제) / 힌트 표시 / KO-VI 다국어 지원',
    designNotes: '단계 배지: 실전 말하기 · N/M / 문장 카드: 밑줄 TextInput 빈칸 / 힌트 블록: border-top 구분 / 툴바: 키보드(44px)·마이크(64px teal)·힌트(44px) / 마이크 활성: 빨간색',
    sourceAFile: undefined,
    sourceBRef: 'PracticalSpeakingStage',
  },
  {
    id: 'completion-celebration-vocab',
    label: '완료-1. 완료 축하 화면(단어)',
    category: '신규',
    description:
      '단어 학습 완료 시 축하와 격려를 표현하는 화면입니다. 파티클 애니메이션과 함께 축하 메시지 및 자동 음원 재생을 제공합니다.\n\n' +
      '**1. 기본 사항 (다국어 텍스트 노출 공통 정책)**\n' +
      '- **지원 언어:** 한국어(KO), 베트남어(VI) 2종 언어 데이터 지원.\n' +
      '- **노출 방식 및 계층 구조:**\n' +
      '  * 단일 언어 또는 2개 언어 병기 노출을 모두 지원.\n' +
      '  * CMS/Admin 등록 순서(또는 Primary 설정값)에 따라 **Main(주 텍스트) / Sub(병기 텍스트)**를 동적으로 분기 렌더링.\n' +
      '  * **[단일 언어 등록]:** 등록된 1개 언어(한국어 또는 베트남어)만 단독 노출.\n' +
      '  * **[한국어 우선 등록]:** 상단: 한국어(강조 폰트) / 하단: 베트남어 병기.\n' +
      '  * **[베트남어 우선 등록]:** 상단: 베트남어(강조 폰트) / 하단: 한국어 병기.\n' +
      '- **텍스트 처리:** 개행 문자(`\\n`) 및 HTML 태그(`<br>`) 파싱 지원, 문장 길이에 따른 유동 높이(Flexible Height) 적용.\n\n' +
      '**2. 음원 제어 및 하단 [다음] 버튼 정책**\n' +
      '- **음원 등록 여부 (Optional):** 액티비티/템플릿 내 축하 음원은 **선택 사항**으로 제공.\n' +
      '- **재생 정책:**\n' +
      '  * **1회 자동 재생:** 화면(액티비티) 진입 시 매핑된 음원을 **1회 자동 재생 (Auto-play)**.\n' +
      '  * **반복 불가:** 음원은 1회만 재생되며, 재생 종료 후 재재생(Replay) 기능은 미제공.\n' +
      '- **하단 [다음] CTA 버튼 제어 인터랙션:**\n' +
      '  * **[음원 미등록 시]:** 화면 진입 즉시 **활성화 (Enable)** 상태로 시작 (탭 시 다음 단계/화면 이동).\n' +
      '  * **[음원 등록 시 - 재생 중]:** **비활성화 (Disable)** 유지 (터치 불가).\n' +
      '  * **[음원 등록 시 - 재생 정상 완료 시]:** **활성화 (Enable)** 상태로 자동 전환.\n\n' +
      '**3. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **음원 로딩 실패/타임아웃 대응 (Fail-safe):** 음원이 등록되어 있으나 네트워크 불안정, 파일 누락/손상으로 인해 재생 에러(`Audio Error`) 또는 로딩 타임아웃 발생 시, 화면 인터랙션 멈춤 방지를 위해 **즉시 [다음] 버튼을 활성화(Enable)** 처리.\n' +
      '2) **화면 이탈 및 백그라운드 전환 시:** 음원 재생 중 사용자가 화면을 이탈하거나 앱을 백그라운드로 내릴 경우, 오디오 재생 인스턴스를 즉시 정지 및 메모리 해제(`Stop & Release`)하여 소리 누수 방지.\n' +
      '3) **다국어 성조 렌더링:** 베트남어 고유 성조 및 특수 라틴 문자(ơ, ư, đ 등) 적용 시 텍스트 잘림 현상 방지를 위해 여백(Line-height) 및 줄 바꿈 규칙 점검(`word-break: keep-all`).',
    devNotes: 'CompletionCelebrationVocabStage / props: title, titleVi, description, descriptionVi, nextButtonText, nextButtonTextVi, onNext, onBack / CSS 파티클 애니메이션(60개 이모지) / 다국어 지원',
    designNotes: '상단: 파티클 애니메이션(🎉✨🎊 이모지) / 아이콘 원형 배경(tealSoft) / 제목("대단해요!") / 설명 텍스트 / 하단: 확인 버튼(teal 배경)',
    sourceAFile: undefined,
    sourceBRef: 'CompletionCelebrationVocabStage',
  },
  {
    id: 'completion-celebration-grammar',
    label: '완료-2. 완료 축하 화면(문법)',
    category: '신규',
    description: '문법 학습 완료 시 축하와 격려를 표현하는 화면. 파티클 애니메이션과 함께 "대단해요!" 메시지 표시.',
    devNotes: 'CompletionCelebrationGrammarStage / props: title, titleVi, description, descriptionVi, nextButtonText, nextButtonTextVi, onNext, onBack / CSS 파티클 애니메이션(60개 이모지) / 다국어 지원',
    designNotes: '상단: 파티클 애니메이션(🎉✨🎊 이모지) / 아이콘 원형 배경(tealSoft) / 제목("대단해요!") / 설명 텍스트 / 하단: 확인 버튼(teal 배경)',
    sourceAFile: undefined,
    sourceBRef: 'CompletionCelebrationGrammarStage',
  },
  {
    id: 'completion-celebration-class',
    label: '완료-3. 완료 축하 화면(수업)',
    category: '신규',
    description: '수업 전체 완료 시 축하와 격려를 표현하는 화면. 파티클 애니메이션과 함께 "대단해요!" 메시지 표시.',
    devNotes: 'CompletionCelebrationClassStage / props: title, titleVi, description, descriptionVi, nextButtonText, nextButtonTextVi, onNext, onBack / CSS 파티클 애니메이션(60개 이모지) / 다국어 지원',
    designNotes: '상단: 파티클 애니메이션(🎉✨🎊 이모지) / 아이콘 원형 배경(tealSoft) / 제목("대단해요!") / 설명 텍스트 / 하단: 확인 버튼(teal 배경)',
    sourceAFile: undefined,
    sourceBRef: 'CompletionCelebrationClassStage',
  },
  {
    id: 'completion-practice-listen',
    label: '완료-4. 실전 듣기 완료',
    category: '신규',
    description: '실전 듣기 완료 시 축하 화면. CompletionCelebrationVocabStage를 텍스트만 변경하여 재사용.',
    devNotes: 'CompletionCelebrationVocabStage 재사용 / description: 실전 듣기를 완료했어요!',
    designNotes: '완료-1과 동일한 레이아웃, 텍스트만 변경.',
    sourceAFile: undefined,
    sourceBRef: 'CompletionCelebrationVocabStage',
  },
  {
    id: 'completion-practice-read',
    label: '완료-5. 실전 읽기 완료',
    category: '신규',
    description: '실전 읽기 완료 시 축하 화면. CompletionCelebrationVocabStage를 텍스트만 변경하여 재사용.',
    devNotes: 'CompletionCelebrationVocabStage 재사용 / description: 실전 읽기 및 발음평가를 완료했어요!',
    designNotes: '완료-1과 동일한 레이아웃, 텍스트만 변경.',
    sourceAFile: undefined,
    sourceBRef: 'CompletionCelebrationVocabStage',
  },
  {
    id: 'completion-practice-write',
    label: '완료-6. 실전 쓰기 완료',
    category: '신규',
    description: '실전 쓰기 완료 시 축하 화면. CompletionCelebrationVocabStage를 텍스트만 변경하여 재사용.',
    devNotes: 'CompletionCelebrationVocabStage 재사용 / description: 실전 쓰기를 완료했어요!',
    designNotes: '완료-1과 동일한 레이아웃, 텍스트만 변경.',
    sourceAFile: undefined,
    sourceBRef: 'CompletionCelebrationVocabStage',
  },
  {
    id: 'completion-practice-check',
    label: '완료-7. 실전 확인 완료',
    category: '신규',
    description: '실전 확인 완료 시 축하 화면. CompletionCelebrationVocabStage를 텍스트만 변경하여 재사용.',
    devNotes: 'CompletionCelebrationVocabStage 재사용 / description: 실전 확인을 완료했어요!',
    designNotes: '완료-1과 동일한 레이아웃, 텍스트만 변경.',
    sourceAFile: undefined,
    sourceBRef: 'CompletionCelebrationVocabStage',
  },
  {
    id: 'video-ai-tutor',
    label: '13-1. 영상과 AI튜터',
    category: '신규',
    description:
      '영상 시청과 AI 튜터의 가이드 안내가 결합된 듣기/시청 학습 화면입니다.\n\n' +
      '**1. 상단 텍스트 영역 (다국어 지원)**\n' +
      '- **데이터 매핑:** Admin에 등록된 타이틀 및 가이드 텍스트 바인딩 노출.\n' +
      '- **다국어 노출 정책:**\n' +
      '  * 기본 언어 외 언어별 번역 텍스트 필드를 개별 관리하여, 사용자 앱 설정 언어(한국어/베트남어)에 따라 등록 텍스트로 치환 노출.\n' +
      '  * 번역 데이터가 미등록된 경우 기본 등록 텍스트(한국어)를 대체 노출(Fallback).\n\n' +
      '**2. 비디오 플레이어 영역**\n' +
      '- **영상 재생:** Admin에 등록된 스트리밍 URL(HLS, MP4 등)을 바인딩하여 플레이어 로드 및 재생.\n' +
      '- **자막(Caption) 노출 정책 (Optional):**\n' +
      '  * **[자막 리소스 등록 시]:** 플레이어 내 `[자막]` 아이콘 **노출**, 탭 시 자막 켜짐(ON) ↔ 꺼짐(OFF) 토글.\n' +
      '  * **[자막 리소스 미등록 시]:** `[자막]` 버튼 **미노출 (Hidden)**.\n' +
      '- **오디오 충돌 방지:** 사용자가 영상 재생(`Play`)을 시작할 경우, 하단 AI 튜터 가이드 음원이 재생 중이었다면 **튜터 음원을 즉시 강제 정지(`Stop & Release`)** 처리.\n\n' +
      '**3. AI 튜터 & 말풍선 (가이드 텍스트 및 음원)**\n' +
      '- **말풍선 텍스트 다국어 노출:** 한국어 또는 베트남어 단독/병기 등록 지원, 앱 언어 설정에 맞춰 치환 렌더링.\n' +
      '- **가변 사이즈 (Auto-fit):** 등록된 텍스트 분량(단문/장문)에 따라 말풍선 높이/너비가 유연하게 자동 조절됨.\n' +
      '- **음원 재생 및 반복 정책:**\n' +
      '  * **화면 진입 시:** 화면 로딩 완료 즉시 AI 튜터 가이드 음원 **1회 자동 재생 (Auto-play)**.\n' +
      '  * **반복 재생 (Replay):** 1회 재생 종료 후 활성화되는 `[헤드폰]` 아이콘 탭 시 음원 무제한 반복 재생 지원.\n' +
      '- **오디오 자동 중단 (Stop on Action):** AI 튜터 음원이 재생 중인 상태에서 영상을 재생하거나 하단 `[다음]` 버튼을 탭할 경우, 즉시 음원 재생을 정지 및 메모리 해제(`Stop & Release`).\n\n' +
      '**4. 하단 [다음] CTA 버튼 정책**\n' +
      '- **버튼 활성화 상태:** 화면 진입 시점부터 상시 **활성화 (Enable)** 상태 제공.\n' +
      '- **버튼 탭 시 인터랙션:** 영상 시청 완료 여부와 무관하게 자유 스킵 가능, 탭 시 현재 재생 중인 모든 미디어(영상 및 AI 튜터 음원)를 즉시 정지(`Stop & Release`) 후 화면 전환.\n\n' +
      '**5. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **미디어 오버랩(Overlap) 차단:** AI 튜터 음원이 나오는 중에 영상 플레이를 누르거나 반대로 영상 재생 중 튜터 음원 탭 시 두 사운드가 겹치지 않고 상호 독점(Exclusive Audio Focus)되는지 검증.\n' +
      '2) **자막 폰트 인코딩:** 자막 파일 내 베트남어 특수 성조(ơ, ư, đ 등) 표기 시 글자 깨짐 없이 정상 렌더링되는지 점검.\n' +
      '3) **스트리밍 URL 에러 대응:** 등록된 영상 URL 오류/로딩 실패 시 플레이어 에러 인디케이터를 표출하며 하단 `[다음]` 버튼은 정상 동작하도록 예외 처리.',
    devNotes: `VideoAITutorStage / props: onNext, onBack, data(optional)
kcho-dev 이식 시:
- audioUri → useAudioPlayer() + resolveAudioSource()
- videoUri → resolveActivityVideoSource()
- bubbleKo/Vi → question.extra1 / extra2
- ActivityHeader → ActivityLayout (step/totalSteps)`,
    designNotes: '배지(실전 듣기) → 영상 카드(210h, 다크) → 스페이서 → AI튜터(말풍선+썸네일) → [다음] teal CTA',
    sourceAFile: undefined,
    sourceBRef: 'VideoAITutorStage',
  },
  {
    id: 'ai-tutor-desc',
    label: '13-2. AI튜터 설명',
    category: '신규',
    description: 'AI 튜터 썸네일 + 말풍선으로 학습 내용을 소개하는 화면. 진입 시 음원 자동 재생, 스피커 버튼으로 반복 재생 가능.',
    devNotes: `AITutorDescStage / props: onNext, onBack, data(optional)
kcho-dev 이식 시:
- audioUri → useAudioPlayer() + resolveAudioSource()
- bubbleKo/Vi → question.extra1 / extra2
- ActivityHeader → ActivityLayout (step/totalSteps)`,
    designNotes: '빈 공간(flex:1, 흰 배경) → AI튜터(말풍선+썸네일) → [다음] teal CTA / 영상 없음',
    sourceAFile: undefined,
    sourceBRef: 'AITutorDescStage',
  },
  // ─── [WordIntroSlidesStage] ──────────────────────────────
  {
    id: 'word-intro-slides',
    label: '2-W. 단어 슬라이드',
    category: '수정',
    description:
      '**1. 상단 슬라이드 영역**\n' +
      '- **데이터 연동:** CMS / Admin에 등록된 이미지 및 연결 데이터를 바인딩하여 노출.\n' +
      '- **수량 제약:** **Min 1개 ~ Max 10개** 지원.\n' +
      '- **슬라이드-콘텐츠 매핑 구조:**\n' +
      '  * 슬라이드(이미지)마다 1:1로 매핑되는 **[AI 튜터 텍스트]** 및 **[AI 튜터 음원]** 데이터를 가짐.\n\n' +
      '**2. AI 튜터 말풍선 및 음원 재생 정책**\n' +
      '- **UI 노출 조건 (예외 처리):**\n' +
      '  * **[정상 노출]:** 현재 슬라이드에 텍스트 또는 음원 데이터가 존재하는 경우, AI 튜터 썸네일 캐릭터 및 말풍선 UI 정상 노출.\n' +
      '  * **[영역 미노출 (Hidden)]:** 현재 슬라이드에 **텍스트와 음원 데이터가 모두 미등록된 경우**, AI 튜터 썸네일과 말풍선 영역 전체를 화면에서 숨김 처리(GNB/슬라이드 레이아웃 유지).\n' +
      '- **오디오 재생 및 인터랙션 흐름:**\n' +
      '  * **슬라이드 전환 시 자동 동작:** 슬라이드가 전환되어 화면에 안착하는 즉시 매핑된 텍스트가 표시되고, 음원은 **1회 자동 재생(Auto-play)**.\n' +
      '  * **반복 재생(Replay):** 음원 1회 재생이 완료되면 말풍선 내(또는 썸네일 인근)에 **[다시 듣기 / Replay]** 버튼이 활성화됨. 사용자가 선택 시 해당 슬라이드의 음원을 처음부터 다시 재생 지원.\n' +
      '  * **오디오 세션 해제(Stop & Release):** 슬라이드를 이동하거나 화면을 이탈할 경우 재생 중인 이전 음원은 즉시 정지 및 메모리 해제.\n\n' +
      '**3. 네비게이션 컨트롤 (이전 / 넘기기 / 인디케이터)**\n' +
      '- **페이지 인디케이터 (Pagination):**\n' +
      '  * 포맷: `[현재 슬라이드 Index] / [전체 슬라이드 수]` (예: 5개 중 3번째일 경우 `3/5`로 표기).\n' +
      '- **[이전] 버튼 상태 및 인터랙션:**\n' +
      '  * **첫 번째 슬라이드 (Index = 1):** 비활성화(Disable).\n' +
      '  * **이후 슬라이드 (Index > 1):** 활성화(Enable).\n' +
      '  * **탭 시 동작:** 현재 재생 중인 음원을 즉시 정지(`Stop`)한 뒤 이전 슬라이드로 이동.\n' +
      '- **[넘기기] 버튼 상태 및 인터랙션:**\n' +
      '  * **마지막 슬라이드 (Index = Total):** 비활성화(Disable).\n' +
      '  * **마지막 이전 슬라이드 (Index < Total):** 활성화(Enable).\n' +
      '  * **탭 시 동작:** 현재 재생 중인 음원을 즉시 정지(`Stop`)한 뒤 다음 슬라이드로 이동.\n\n' +
      '**4. 하단 [다음] CTA 버튼 정책**\n' +
      '- **버튼 활성화(Enable) 조건:**\n' +
      '  * 슬라이드가 **마지막 슬라이드(Index = Total)**에 도달했을 때 비활성화(Disable)에서 **활성화(Enable)**로 전환.\n' +
      '  * *(참고: 첫 번째 ~ 마지막 이전 슬라이드까지는 비활성화 상태 유지)*\n' +
      '- **버튼 선택 인터랙션:**\n' +
      '  * 마지막 슬라이드에서 음원이 재생 중인 상태라도, 활성화된 **[다음]** 버튼을 탭하면 즉시 음원을 정지(`Stop`)하고 다음 단계(학습 본문 화면 또는 완료 화면)로 이동.\n\n' +
      '**5. 개발 및 QA 예외 확인 사항 (Exception Notes)**\n' +
      '1) **슬라이드 제스처(Swipe) 연동:**\n' +
      '   - 사용자가 버튼이 아닌 손가락 스와이프로 슬라이드를 빠르게 넘길 때도, 이전 슬라이드의 음원 중복 재생(오버랩)이 없도록 `Audio Player Stop` 로직이 철저히 호출되는지 확인.\n' +
      '2) **단일 슬라이드 등록 시 (Min=1):**\n' +
      '   - 슬라이드가 1장만 등록된 경우 `[이전]`, `[넘기기]` 버튼은 모두 Disable 처리되고, 인디케이터는 `1/1`로 표시되며 진입 즉시 하단 **[다음]** 버튼이 활성화(Enable) 상태로 시작되는지 확인.\n' +
      '3) **네트워크 에러/음원 누락 시:**\n' +
      '   - 음원 파일 다운로드 실패 시에도 텍스트 말풍선은 정상 표기되어야 하며, `[다음]` 버튼 동작 및 슬라이드 이동에 병목이 발생하지 않아야 함.',
    devNotes: `Source B: kchao-lesson1-feature-word-intro-slides / WordIntroTemplate.jsx
kcho-dev 목적지: src/screens/activity/preview/PreviewWordSlides.tsx (TBD)
templateCd: word_slides (TBD — 백오피스 협의 필요)

이식 체크리스트:
- ActivityHeader → ActivityLayout (step/totalSteps 변환)
- onNext → navigateToNextActivityOrLessonComplete
- new Audio() + Platform가드 → useAudioPlayer() + resolveAudioSource()
- pick(lang, ko, vi) → useTranslation() + i18n.language 분기
- MOCK_WORD_SLIDES → question.listItems[] API 파서
- visitedLast 완료 조건 → completeActivity (useActivityQuestionHistory)

핸드오프 문서: docs/word-slides-review.md`,
    designNotes: `ActivityHeader: teal 프로그레스바
슬라이드 콘텐츠: flex:1, paddingHorizontal 20
AI튜터 행: 말풍선(shadow.soft, borderRadius 14) + 스피커 버튼(tealSoft→teal 활성) + 튜터 썸네일(64×80)
[이전/넘기기] 네비: 비활성=bgDisabled 배경+textDisabled 텍스트
[다음] 버튼: teal 배경 / 비활성=bgDisabled / 마지막 슬라이드 도달 후 활성
intro 카드: shadow.card, 2열, aspectRatio 1.2
quiz 선택지: 정답=teal 보더+tealSoft / 오답=wrong 보더+wrongLight
outro: excellent.png 220×220 중앙`,
    sourceAFile: 'TBD',
    sourceBRef: 'WordIntroTemplate',
  },
  // ─── [ConversationPreviewStage] ─────────────────────────────
  {
    id: 'conversation-preview',
    label: '대화-1. 전체 대화 듣기',
    category: '신규',
    description:
      '전체 대화문을 확인하고 화자별 음원을 순차적으로 청취하는 대화 학습 화면입니다.\n\n' +
      '**1. AI 튜터 안내 영역 (초기 진입 Dim 모달/레이어)**\n' +
      '- **텍스트 및 다국어 지원:** CMS / Admin 바인딩 텍스트 노출, 사용자 언어(한국어/베트남어)에 맞춰 실시간 전환 (미등록 시 Fallback).\n' +
      '- **음원 자동 재생 및 반복 정책:** 진입 시 가이드 음원 **1회 자동 재생 (Auto-play)**, 종료 후 `[스피커]` 아이콘 탭 시 **무제한 반복 재생 (Replay)** 가능.\n' +
      '- **[확인] 버튼 인터랙션 (Stop & Close):** 하단 `[확인]` 탭 시 재생 중인 AI 튜터 음원을 즉시 **강제 정지 및 메모리 해제(`Stop & Release`)**하고 Dim 레이어 닫힘. 닫힌 후 메인 대화문 오디오 시퀀스 시작.\n\n' +
      '**2. 대화문 영역 (Dialogue List)**\n' +
      '- **대화문 아이템 구성:** 화자명, 화자 프로필 썸네일, 대화 말풍선(KO/VI 병기), 개별 음원.\n' +
      '- **음원 순차 자동 재생 (Sequential Play):** 1번 말풍선부터 마지막까지 순차 자동 재생, 현재 재생 중인 대화문에 **실시간 활성화 하이라이트(Focus UI)** 및 자동 스크롤.\n' +
      '- **반복 청취 및 개별 재생 (Replay):** 순차 재생 완료 후 `[전체 다시 듣기]` 또는 각 말풍선 `[스피커]` 탭 시 개별/전체 반복 청취 지원 (타 말풍선 탭 시 기존 재생 즉시 정지 후 새로 선택한 항목 재생).\n\n' +
      '**3. 하단 [다음] CTA 버튼 정책**\n' +
      '- **버튼 활성화 상태:** 음원 재생 여부 무관 상시 **활성화 (Enable)** 상태 제공 (자유 스킵 보장).\n' +
      '- **버튼 탭 시 인터랙션 (Stop & Navigate):** `[다음]` 탭 시 **재생 중인 모든 오디오 인스턴스 및 대기 큐 즉시 강제 정지(`Stop & Release`)** 후 다음 단계 이동.\n\n' +
      '**4. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **오디오 큐(Queue) 에러 핸들링:** 특정 대화문 음원 404/타임아웃 시 전체 멈춤 없이 다음 항목으로 통과.\n' +
      '2) **Dim 닫힘과 대화문 오디오 시작 동기화:** Dim 닫힘 시 튜터 음원 완벽 파기 후 대화문 오디오 시작하여 오버랩 차단.\n' +
      '3) **더블탭 및 중복 라우팅 방지:** `[다음]` 버튼 연타 시 화면 이동 1회만 트리거되도록 디바운스(Debounce) 적용.\n' +
      '4) **화면 이탈 예외:** 백그라운드 전환/뒤로가기 시 오디오 큐 즉시 정지.',
    devNotes: `ConversationPreviewStage / props: onNext, onBack, data(optional)
kcho-dev 이식 시:
- templateCd: dialogue_master
- lines[].audioSrc → resolveActivityAudioSource(actNo, filename)
- ActivityHeader → ActivityLayout (step/totalSteps)
- lines → activity.questions[].listItems.dialogue_content[]
- onNext → navigateToNextActivityOrLessonComplete`,
    designNotes: '배지(대화 듣기) → ScrollView 말풍선(left/right) → [다음] teal CTA. 활성 라인: teal border + 아바타 teal 배경.',
    sourceAFile: 'TBD',
    sourceBRef: 'TBD',
  },
  // ─── [ConversationShadowingStage] ───────────────────────────
  {
    id: 'conversation-shadowing',
    label: '대화-2. 따라 말하기',
    category: '신규',
    description:
      '대화문 각 문장의 원어민 모델 음원을 듣고 마이크로 직접 따라 말하며 발음을 평가받는 롤플레잉 섀도잉 활동입니다.\n\n' +
      '**1. AI 튜터 가이드 영역 (초기 진입 Dim 모달/레이어)**\n' +
      '- **텍스트 및 다국어 지원:** CMS / Admin 바인딩 텍스트 노출, 사용자 언어(한국어/베트남어)에 맞춰 실시간 전환 (미등록 시 Fallback).\n' +
      '- **음원 재생 및 반복 정책:** 진입 시 AI 튜터 안내 음원 **1회 자동 재생 (Auto-play)**, 종료 후 `[스피커]` 아이콘 탭 시 **반복 재생 (Replay)** 가능.\n' +
      '- **[확인] 버튼 인터랙션 (Stop & Close):** 하단 `[확인]` 탭 시 **재생 중인 AI 튜터 음원 즉시 정지 및 메모리 해제(`Stop & Release`)** 후 Dim 레이어 닫힘 및 메인 롤플레잉 진입.\n\n' +
      '**2. 따라 말하기 영역 (문장 롤플레잉)**\n' +
      '- **대화문 구성:** 화자 프로필 썸네일, 대화 말풍선(KO/VI 병기), 기준 모델 음원.\n' +
      '- **모델 음원 재생 정책:** 단계 진입 시 매핑된 **모델 음원 1회 자동 재생 (Auto-play)**, 종료 후 `[스피커]` 탭 시 **무제한 반복 청취 가능**.\n' +
      '- **하단 [마이크] 녹음 및 발음평가 인터랙션:** 모델 음원 완료 후 `[마이크]` 활성화 → 탭 시 녹음 시작 및 발화 종료 시 음성 분석 진행. **Echo 방지:** 모델 음원 재생 중 `[마이크]` 탭 시 **재생 중인 음원 즉시 강제 정지(`Stop & Release`)** 후 녹음 시작.\n\n' +
      '**3. 문장 발음평가 결과 피드백 및 화면 전환**\n' +
      '- **피드백 모달 노출:** 발음 분석 완료 시 피드백 모달(점수, 정확도 등) 노출.\n' +
      '- **[다음] CTA 버튼 분기 시나리오:**\n' +
      '  * **[CASE A: 후속 대화문 존재 시 (Index < Total)]:** 피드백 모달 닫힘 → 다음 대화문 이동 → 이동 즉시 다음 모델 음원 1회 자동 재생.\n' +
      '  * **[CASE B: 마지막 대화문 완료 시 (Index = Total)]:** 피드백 모달 닫힘 → 액티비티 최종 학습 완료 화면 이동.\n\n' +
      '**4. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **오디오 세션 충돌 및 수음 방지 (Stop & Release):** 모델 음원 출력 도중 녹음 시작 시 스피커 소리가 마이크 인풋에 섞이지 않도록 출력 트랙 완벽 해제 후 녹음 시작.\n' +
      '2) **마이크 권한 예외:** 권한 거절 시 설정 이동 안내 팝업 분기.\n' +
      '3) **발음평가 타임아웃 대응 (Fail-safe):** 네트워크 지연 타임아웃 시 에러 안내 노출 후 `[마이크]` 재시도 복구.\n' +
      '4) **화면 이탈 예외:** 앱 백그라운드 전환/홈 이동 시 오디오 및 마이크 세션 안전 종료.',
    devNotes: `ConversationShadowingStage / props: onNext, onBack, data(optional)
kcho-dev 이식 시:
- templateCd: dialogue_speaking
- 마이크: useAudioRecorder + recordQuestionAttempt
- ActivityHeader → ActivityLayout (step/totalSteps)
- lines → activity.questions[].listItems.dialogue_content[]
- onNext → navigateToNextActivityOrLessonComplete`,
    designNotes: '진행바(N/Total) → 현재 라인 말풍선(크게) → 마이크 버튼(80px 원) → [다음] CTA(녹음 완료 후 활성).',
    sourceAFile: 'TBD',
    sourceBRef: 'TBD',
  },
  {
    id: 'dialogue-listen-write',
    label: '대화-3. 실전 쓰기',
    category: '신규',
    description:
      '대화문 음원을 듣고 문장 내 빈칸에 알맞은 단어/표현을 키보드로 직접 받아쓰는 실전 쓰기 활동입니다.\n\n' +
      '**1. AI 튜터 안내 영역 (초기 진입 Dim 모달/레이어)**\n' +
      '- **텍스트 및 다국어 지원:** CMS / Admin 바인딩 텍스트 노출, 사용자 언어(한국어/베트남어) 실시간 전환 (미등록 시 Fallback).\n' +
      '- **음원 자동 재생 및 반복 정책:** 진입 시 가이드 음원 **1회 자동 재생 (Auto-play)**, 종료 후 `[스피커]` 탭 시 **무제한 반복 재생 (Replay)** 가능.\n' +
      '- **[확인] 버튼 인터랙션 (Stop & Close):** 하단 `[확인]` 탭 시 재생 중인 AI 튜터 음원을 즉시 **강제 정지 및 메모리 해제(`Stop & Release`)**하고 Dim 레이어 닫힘.\n\n' +
      '**2. 쓰기 활동 영역**\n' +
      '- **2-1 상단 타이틀:** KO/VI 상하 병기 노출, 1개 언어 등록 시 단독 노출 및 여백 자동 최적화.\n' +
      '- **2-2 문제 영역 (오디오 컨트롤):** `[스피커]` 탭 시 문항 음원 스트리밍 재생 (종료 후 반복 청취 가능).\n' +
      '- **2-3 빈칸 영역 (인라인 텍스트 입력 필드):** CMS 치환자(중괄호 `{}`)를 파싱하여 문장 내 인라인 텍스트 인풋 슬롯으로 렌더링. 슬롯 탭 시 가상 키보드 활성화 및 뷰포트 자동 스크롤(Keyboard Pan).\n' +
      '- **2-4 힌트 영역:** `[💡 힌트]` 탭 시 Admin 힌트 텍스트(말풍선/툴팁/모달) 노출.\n\n' +
      '**3. 하단 [확인] CTA 버튼 및 정/오답 판정**\n' +
      '- **버튼 활성화 상태:** 진입 시점부터 상시 **활성화 (Enable)** 상태 제공 (미입력 상태에서도 제출 가능).\n' +
      '- **버튼 탭 시 인터랙션 (Stop & Grade):** 재생 중인 음원 즉시 **강제 정지(`Stop & Release`)**, 키보드 **강제 닫힘(Blur)** 처리, 입력 텍스트 앞뒤 공백 제거(`trim()`) 후 정답 대조 및 유효성 판정 결과 피드백 노출.\n\n' +
      '**4. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **가상 키보드 오버랩 방지:** 키보드 활성화 시 인풋 및 하단 버튼이 가려지지 않도록 뷰포트 스크롤 점검.\n' +
      '2) **양끝 공백(Trim) 판정:** 입력 단어 앞뒤 공백(`whitespace`) 자동 잘라내기(`trim()`) 정답 판정 검증.\n' +
      '3) **미입력 제출 시 오답 처리 (Fail-safe):** 빈칸이 비어 있는 제출 시 런타임 에러 없이 오답(0점) 안전 처리.\n' +
      '4) **오디오 충돌 방지:** 문제 음원 청취 중 [확인] 탭 시 피드백 사운드와 겹치지 않고 기존 음원 즉시 파기.\n' +
      '5) **화면 이탈 예외:** 앱 백그라운드 전환/홈 이동 시 오디오 정지.',
    devNotes: `
- kcho-dev 목적지: src/screens/activity/preview/PreviewDialogueListenWrite.tsx
- templateCd: dialogue_listen_write (TBD — 백오피스 협의 필요)
- ActivityHeader → ActivityLayout (step/totalSteps)
- new Audio() + Platform가드 → useAudioPlayer() + resolveAudioSource()
- sylsOf/splitWord 유틸 → 공통 util 파일로 이동 또는 인라인 유지
- pick(lang, ko, vi) → useTranslation() + i18n 키
- onNext → navigateToNextActivityOrLessonComplete
- Mock lines → question.listItems[] 파서`,
    designNotes: '튜터 아바타(폴백: tutor.png) + 🔊 재생 → tealSoft 카드 안 단어 박스(자연 줄바꿈) → 베트남어 번역 + 💡 힌트 토글 → 고정 footer [확인] → 슬라이드업 패널(오답: 정답+[다시하기][다음], 정답: [다음/완료]).',
    sourceAFile: 'TBD',
    sourceBRef: 'PracWrite / WordBoxes',
  },
  {
    id: 'grammar-complete',
    label: '완료-8. 문법 학습 완료',
    category: '신규',
    description:
      '문법 학습 단원 완료 화면입니다. 체크마크 아이콘 및 완료 축하 메시지와 함께 다음 학습 단계로 이동을 유도합니다.\n\n' +
      '**1. 텍스트 영역 (다국어 병기 정책)**\n' +
      '- **데이터 매핑:** 기본적으로 한국어(KO) 원문과 베트남어(VI) 번역문을 상/하 병기 노출.\n' +
      '- **단일 언어 예외 처리:** CMS / Admin에 등록된 텍스트가 1개 언어만 존재하는 경우 해당 언어 텍스트만 단독 렌더링, 미등록 영역 숨김(Hidden) 및 여백 자동 최적화.\n\n' +
      '**2. 음원 제어 및 하단 [다음] 버튼 정책**\n' +
      '- **음원 등록 여부 (Optional):** 단원 완료 축하 음원은 선택 사항임.\n' +
      '- **재생 정책:** 등록 시 **1회 자동 재생 (Auto-play)**, 완료 후 재재생(Replay) 미제공, 하단 [다음] 버튼 상시 **활성화 (Enable)**.\n' +
      '- **하단 [다음] CTA 버튼 탭 시 인터랙션 (Stop & Action):** 음원 재생 중 탭 시 **재생 중인 음원을 즉시 강제 정지 및 메모리 해제(`Stop & Release`)** 후 다음 단계 이동.\n\n' +
      '**3. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **오디오 세션 누수 방지:** 화면 전환 시(`Unmount`) 음원 오토 트랙 파기(`Stop & Release`) 필수 검증.\n' +
      '2) **다국어 성조 렌더링:** 베트남어 특수 문자 폰트 짤림 방지 및 단어 단위 줄바꿈(`word-break: keep-all`) 점검.\n' +
      '3) **화면 이탈 및 백그라운드 전환 예외:** 앱 최소화/홈 이동 시 오디오 정지 확인.\n' +
      '4) **음원 로딩 실패 대응 (Fail-safe):** 오디오 404/타임아웃 시에도 UI 및 [다음] 버튼 터치 동작 정상 유지.',
    devNotes: `
- kcho-dev 목적지: src/screens/activity/preview/PreviewGrammarComplete.tsx
- templateCd: grammar_complete (TBD)
- ActivityHeader → ActivityLayout (step/totalSteps)
- pick(lang, ko, vi) → useTranslation() + i18n 키
- onNext → navigateToNextActivityOrLessonComplete`,
    designNotes: '체크마크 원형 아이콘(correctLight + correct border) → 한국어 타이틀 → 베트남어 서브텍스트(muted) → 고정 footer [다음].',
    sourceAFile: 'TBD',
    sourceBRef: 'TBD',
  },
  {
    id: 'practice-check',
    label: '대화-4. 실전 확인',
    category: '신규',
    description:
      '대화 빈칸에 알맞은 단어를 2지선다 보기 중에서 골라 대화를 완성하는 실전 확인 액티비티입니다.\n\n' +
      '**[기능 명세]**\n' +
      '**1. AI 튜터 안내 영역 (초기 진입 Dim 레이어)**\n' +
      '- **텍스트 및 다국어 지원:** Admin에 등록된 타이틀 및 말풍선 텍스트 바인딩, 사용자 언어 설정(KO/VI) 번역 노출 (미등록 시 Fallback).\n' +
      '- **음원 재생 및 반복 정책:** 진입 완료 시 가이드 음원 1회 자동 재생(Auto-play), 재생 종료 후 [스피커] 탭 시 무제한 반복 재생(Replay) 가능.\n' +
      '- **[확인] 버튼 인터랙션 (Stop & Close):** 하단 [확인] 버튼 탭 시 재생 중인 음원을 즉시 정지(Stop & Release)하고 Dim 레이어를 닫음.\n\n' +
      '**2. 실전 확인 활동 영역**\n' +
      '- **2-1. 단계 배지 (Indicator):** 단일 문항(실전 확인) vs 복수 문항(실전 확인 N/M) 분수 표기 지원.\n' +
      '- **2-2. 타이틀 영역:** 한국어(KO) 원문과 베트남어(VI) 번역문 상/하 병기 노출, 1개 언어만 등록 시 단독 노출 및 여백 자동 조정.\n' +
      '- **2-3. 세부 문제 영역 (Sub-questions):** 한 화면당 Min 1개 ~ Max 10개 세로 스크롤 지원, 2개 단위 배경 교차(Striped Layout: Math.floor(index / 2) % 2), 2지선다 고정(Fixed 2 Options) 보기 선택 하이라이트.\n\n' +
      '**3. 하단 [확인] CTA 버튼 및 판정 정책**\n' +
      '- **버튼 활성화 분기:** 미선택 항목 존재 시 비활성화(Disable) → 노출된 모든 세부 문제 보기 선택 100% 완료 시 활성화(Enable) 전환.\n' +
      '- **버튼 탭 시 인터랙션:** 정/오답 유효성 판정 로직 실행 및 피드백 화면(팝업/바텀시트) 노출 또는 다음 문항/완료 전환 Action 수행.\n\n' +
      '**4. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **스크롤 및 하단 CTA 버튼 고정:** 세부 문제 최대 10개 세로 스크롤(Vertical Scroll) 처리 및 하단 [확인] 버튼 플로팅/고정(Fixed) 상태 확인.\n' +
      '2) **2개 단위 색상 인덱싱:** Math.floor(index / 2) % 2 짝/홀수 색상 토글이 1~10개 범위에서 안정적 매핑되는지 점검.\n' +
      '3) **선택 변경 및 상태 동기화:** 모든 항목 선택 완료 후 보기를 변경해도 활성화 상태가 안전하게 유지되는지 확인.\n' +
      '4) **미선택 상태 터치 잠금:** 비활성화 상태 탭 시 판정 로직이 실행되지 않도록 이벤트 차단(pointer-events: none) 적용.',
    devNotes: `
- kcho-dev 목적지: src/screens/activity/preview/PreviewPracticeCheck.tsx
- templateCd: practice_check (TBD — 백오피스 협의 필요)
- ActivityHeader → ActivityLayout (step/totalSteps)
- pick(lang, ko, vi) → useTranslation() + i18n 키
- onNext → navigateToNextActivityOrLessonComplete
- Mock screens → question.listItems[] 파서`,
    designNotes: '배지(실전 확인 · N/3) → 제목 → A(tealSoft)/B(warningLight) 말풍선 + 인라인 칩 → 고정 footer [확인] → 슬라이드업 패널(정답: correctLight, 오답: wrongLight + 틀린 문장 나열).',
    sourceAFile: 'TBD',
    sourceBRef: 'PracQuiz',
  },
  {
    id: 'practical-reading-viewer',
    label: '읽기-1. 실전 읽기 뷰어',
    category: '신규',
    description:
      '차시에서 학습한 내용을 시각적 삽화 및 1:1 한/베 문장과 함께 정독하는 콘텐츠 학습 뷰어 액티비티입니다.\n\n' +
      '**[기능 명세]**\n' +
      '**1. AI 튜터 안내 영역 (초기 진입 Dim 레이어)**\n' +
      '- **조건부 진입 (Step 1):** 백오피스 데이터에 AI 튜터 안내 설정이 등록되어 있거나 showIntro가 true인 경우 Dim 오버레이 레이어를 먼저 노출함.\n' +
      '- **음원 재생 및 반복 정책:** 진입 완료 시 안내 음원 1회 자동 재생(Auto-play), 재생 종료 후 [스피커] 탭 시 무제한 반복 재생(Replay) 가능.\n' +
      '- **[확인] 버튼 인터랙션 (Stop & Close):** 하단 [확인] 버튼 탭 시 재생 중인 음원을 즉시 정지(Stop & Release)하고 Dim 레이어를 닫은 후 Step 2로 전환.\n\n' +
      '**2. 콘텐츠 학습 뷰어 본 화면 (Step 2)**\n' +
      '- **2-1. 지시문 타이틀:** 한국어/베트남어 다국어 병기 지원 (둘 다 존재 시 상/하 병기, 1종 존재 시 단독 노출).\n' +
      '- **2-2. 중앙 미디어 카드:** 삽화 이미지 렌더링 카드 (Admin URL 바인딩 및 로컬 에셋 fallback 지원).\n' +
      '- **2-3. 하단 본문 문장 리스트:** 1:1 한국어-베트남어 문장 카드. 베트남어 누락 번호에 대해 빈 줄(공백)을 유지하여 인덱스 매핑을 보호하며, 문장 데이터 전체 부재 시 영역 비노출.\n' +
      '- **2-4. 하단 [다음] 버튼:** 탭 시 다음 학습 단계/액티비티로 이동.\n' +
      '- **2-5. 별도 정/오답 판정 미적용 및 완료 처리:** 본 화면은 정/오답 피드백이나 채점 과정이 없는 읽기 전용 학습 단계입니다. 하단 [다음] 버튼 선택 시 해당 액티비티를 \'완료(Completed)\' 상태로 처리하고 다음 학습 단계(Action)로 이동합니다.\n\n' +
      '**3. 개발 및 QA 체크포인트 (Exception Notes)**\n' +
      '1) **오디오 세션 누수 방지:** [확인] 탭 또는 화면 전환 시 오디오 인스턴스 정지 및 memory cleanup 필수 검증.\n' +
      '2) **1:1 문장 인덱스 매핑:** 베트남어 텍스트 누락 시 빈 공간 유지로 한국어 문장과의 줄 위치가 어긋나지 않는지 점검.',
    devNotes: `
- PracticalReadingViewerStage
- templateCd: practical_reading_viewer
- ActivityHeader → ActivityLayout
- pick(lang, ko, vi) → 다국어 매핑`,
    designNotes: 'ActivityHeader → 한/베 지시문 → 미디어 카드 → 1:1 문장 카드 → 고정 footer [다음 →]',
    sourceAFile: 'TBD',
    sourceBRef: 'TBD',
  },
];

export const SCREEN_REGISTRY: ScreenMeta[] = [
  ...BASE_SCREEN_REGISTRY,
];

export function getScreen(id: string): ScreenMeta | undefined {
  return SCREEN_REGISTRY.find((s) => s.id === id);
}
