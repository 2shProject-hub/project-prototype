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
      '[진입 및 분기 Flow]\n' +
      '① 소셜 로그인 (Google / Apple / Facebook OAuth)\n' +
      '   ↓\n' +
      '② 연령 확인 (생년월일 8자리 입력 + 필수 약관 동의)\n' +
      '   ↓\n' +
      '③ 만 14세 판정\n' +
      '   ├─ Yes (만 14세 이상) ──> 통과 팝업 ──> 레벨 선택(온보딩) ──> 홈\n' +
      '   └─ No  (만 14세 미만) ──> 차단 팝업 ──> 세션 초기화 후 소셜 로그인 복귀\n\n' +
      '[기능 명세]\n' +
      '1. 기본 정책\n' +
      '- 진행 시점: 최초 소셜 로그인 성공 직후, 회원가입 절차 1단계에서만 노출 (기존 가입 완료 계정은 미노출).\n' +
      '- 연령 기준: 사용자 입력 생년월일 기준 시스템 당일 일자(Today)로 만 나이 계산.\n' +
      '- 만 14세 미만: 서비스 가입 불가\n' +
      '- 만 14세 이상: 정상 가입 진행\n\n' +
      '2. 분기 처리 및 팝업/이동 시나리오\n' +
      '- CASE A: 만 14세 미만인 경우\n' +
      '  * [확인] 선택 시 시스템 검증 후 안내 팝업 노출.\n' +
      '  * 팝업 문구:\n' +
      '    - 타이틀: 가입 불가 안내\n' +
      '    - 본문: 만 14세 미만은 서비스 이용이 제한됩니다.\n' +
      '    - 버튼: 확인\n' +
      '  * 팝업의 [확인] 선택 시 회원가입 절차 중단 및 소셜 로그인 메인 화면으로 이동.\n' +
      '- CASE B: 만 14세 이상인 경우\n' +
      '  * [확인] 선택 시 연령 검증 통과 팝업 노출.\n' +
      '  * 팝업 문구:\n' +
      '    - 타이틀: 인증 완료\n' +
      '    - 본문: 연령 확인이 완료되었습니다.\n' +
      '    - 버튼: 확인\n' +
      '  * 팝업의 [확인] 선택 시 다음 단계인 레벨 선택 화면으로 이동.\n\n' +
      '4. 개발/QA 예외 확인 사항 (Notes)\n' +
      '- 만 나이 계산 기준: 현재 연도 - 출생 연도 (생일이 지나지 않은 경우 추가 -1).',
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
      '[기능 명세] AI 튜터 가이드 및 학습 목표 모달/화면\n' +
      '1. AI 튜터 말풍선 (텍스트 영역)\n' +
      '- 텍스트 서식 및 줄바꿈:\n' +
      '  * CMS/관리자 또는 데이터셋에서 전달되는 개행 문자(\\n, <br/>)를 파싱하여 줄바꿈 및 빈 줄 처리를 지원해야 함.\n' +
      '  * 단어 단위 줄바꿈(word-break: keep-all 또는 언어별 최적화) 적용.\n' +
      '- 장문 대응 및 영역 확장:\n' +
      '  * 기본 높이는 콘텐츠 길이에 맞춰 유동적으로 확장(Auto-height).\n' +
      '  * 디바이스 세로 해상도를 초과하는 극단적 장문일 경우, 전체 팝업/모달 내부 스크롤 처리.\n\n' +
      '2. AI 튜터 음원 (오디오 및 Dim 레이어)\n' +
      '- 자동 닫힘(Auto Close):\n' +
      '  * 화면 진입 시 오디오가 자동 재생(Auto-play)되는 경우, 음원 재생이 끝나면(onEnded) Dim 처리된 모달/화면이 자동으로 닫힘.\n' +
      '- 수동 닫힘(CTA 액션):\n' +
      '  * 음원 재생 중 사용자가 하단 [확인] 버튼을 탭하면, 즉시 오디오 재생을 중단(stop/pause)하고 메모리를 해제한 뒤 Dim 화면을 닫음.\n' +
      '- 재생 제한 정책:\n' +
      '  * 본 화면의 음원은 1회성 안내 음원으로, 한 번 재생이 완료된 후에는 재진입 전까지 반복 재생(Loop/Replay) 버튼 및 기능을 제공하지 않음.\n\n' +
      '3. 학습 목표 영역 (리스트 및 스크롤)\n' +
      '- 노출 개수 규칙:\n' +
      '  * 불릿 항목은 최소 1개(Min: 1)에서 최대 5개(Max: 5)까지 노출.\n' +
      '- 스크롤 및 레이아웃 정책:\n' +
      '  * 디바이스 높이 대비 불릿 개수(또는 텍스트 길이)로 인해 화면 영역을 벗어날 경우, 학습 목표 영역(또는 팝업 본문)에 세로 스크롤(Y-scroll) 생성.\n' +
      '  * 하단 [확인] 버튼은 스크롤과 무관하게 항상 하단에 고정 노출(Sticky/Fixed CTA)되도록 구성.\n\n' +
      '4. 개발 및 QA 체크포인트\n' +
      '- 음원 백그라운드 예외: 음원 재생 중 앱 백그라운드 전환 또는 디바이스 잠금 시 즉시 음원 일시정지 처리 여부 확인.\n' +
      '- 네트워크 지연: 음원 버퍼링 지연 시에도 [확인] 버튼 선택을 통한 Dim 닫기가 막힘 없이 동작하는지 확인.\n' +
      '- 불릿 데이터 정합성: 불릿 데이터가 0개이거나 5개를 초과하여 인입될 경우의 방어 로직(예: 0개면 영역 숨김, 5개 초과 시 상위 5개만 렌더링 등) 확인.',
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
    description: '차시 문법 학습 시작 전 학습 내용을 간단히 안내하는 인트로 화면. 문법 표현과 학습 성과를 미리 보여주어 학습 동기를 높인다.',
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
      '[화면설계서 디스크립션] 음원 재생 & 다국어 텍스트 노출 정책\n\n' +
      '1. 음원 재생 및 [확인] 버튼 인터랙션 정책\n' +
      '- 음원 등록 여부에 따른 분기:\n' +
      '  * 음원은 어드민/콘텐츠 등록 시 선택 사항(Optional)으로 제공.\n' +
      '  * 등록 여부에 따라 진입 시 [확인] 버튼의 기본 상태가 분기됨.\n' +
      '  * [음원 미등록 시]\n' +
      '    - 진입 시 버튼 상태: [확인] 버튼 활성화 (Enable)\n' +
      '    - 재생 동작: 음원 없음 (재생 스킵)\n' +
      '    - 재생 완료 후: -\n' +
      '    - 버튼 인터랙션: 탭 시 다음 단계/화면으로 즉시 이동\n' +
      '  * [음원 등록 시]\n' +
      '    - 진입 시 버튼 상태: [확인] 버튼 비활성화 (Disable)\n' +
      '    - 재생 동작: 화면 진입 시 음원 자동 1회 재생 (Auto-play)\n' +
      '    - 재생 완료 후: 재생 정상 종료 시 [확인] 버튼 활성화 (Enable) 전환\n' +
      '    - 버튼 인터랙션: 활성화 전환 후 탭 시 다음 단계/화면으로 이동\n' +
      '- 오디오 제어 및 제약 사항:\n' +
      '  * 반복 불가: 음원은 1회만 재생되며, 재생 완료 후 재재생(Replay) 버튼이나 인터랙션은 미제공.\n' +
      '  * 중복/누수 방지: 백그라운드 전환, 화면 이탈, 또는 오류 발생 시 재생 인스턴스를 즉시 정지(Stop & Release) 처리.\n\n' +
      '2. 텍스트 영역 정책 (장문 / 개행 / 다국어)\n' +
      '- 텍스트 길이 및 줄 바꿈 (Format & Line-break):\n' +
      '  * 단문부터 다중 단락의 장문까지 등록 및 노출 지원.\n' +
      '  * 영역 지정 높이 초과 시 내부 세로 스크롤(Vertical Scroll) 동작.\n' +
      '  * 개행 문자(\\n) 및 HTML 줄 바꿈 태그(<br>, <br/>)를 모두 파싱하여 줄 바꿈 및 문단 간격(빈 줄) 렌더링.\n' +
      '- 다국어(i18n) 지원 정책:\n' +
      '  * 기본 언어 외 베트남어(VI) 다국어 리소스 매핑 구조 적용.\n' +
      '  * 사용자 앱 언어 설정값 또는 상단 언어 토글이 베트남어(VI)로 선택될 경우, 해당 위치의 텍스트를 등록된 베트남어 리소스로 실시간 치환 노출.\n' +
      '  * Fallback 정책: 만약 베트남어(VI) 텍스트가 미등록된 경우, 기본 설정 언어(한국어 등 Default 리소스)를 대체 노출.\n\n' +
      '3. 개발 & QA 예외 처리 체크포인트 (Exception Notes)\n' +
      '1) 음원 로딩 지연/실패 예외:\n' +
      '   - 네트워크 장애나 파일 깨짐 등으로 음원 로딩이 실패(Audio Load Error/Timeout)할 경우, 무한 대기를 방지하기 위해 즉시 [확인] 버튼을 활성화(Enable) 처리.\n' +
      '2) 다국어 성조/특수문자 표기:\n' +
      '   - 베트남어는 고유 성조 및 특수 라틴 문자(ơ, ư, đ, ê, â 등)가 포함되므로, 텍스트 폰트가 깨지지 않고 정상 렌더링되는 웹폰트/시스템 폰트 적용 확인.\n' +
      '3) 버튼 연타 방지:\n' +
      '   - [확인] 버튼 활성화 후 다음 화면 전환 트리거 시 중복 호출 방지를 위해 디바운스(Debounce) 또는 로딩 가드 적용.',
    devNotes: '참고: IntroTutorStage 재사용\n- badge / icon / title / subtitle / achievement 구조\n- AI 튜터 오버레이: 진입 시 dim + 썸네일 + 말풍선 + 음원 자동 재생',
    designNotes: '4-1-2와 동일 구조 (텍스트만 변경). 배지: 오늘의 단어, 아이콘: 📖',
    sourceAFile: 'src/screens/activity/preview/PreviewIntro4.tsx',
    sourceBRef: 'IntroTutorStage',
  },
  {
    id: 'intro-tutor-2',
    label: '4-1-2. 학습 소개(문법 퀴즈)',
    category: '신규',
    description: '차시 문법 학습의 형성평가(퀴즈) 진입 전 학습 내용을 간단히 안내하는 인트로 화면. 문법 퀴즈와 학습 성과를 미리 보여주어 학습 동기를 높인다.',
    devNotes: '참고: IntroTutorStage 복사본\n- SESSION1.intro 데이터 참조\n- badge / icon / title / subtitle / achievement 구조\n- AI 튜터 오버레이: 진입 시 dim + 썸네일 + 말풍선 + 음원 자동 재생',
    designNotes: '4-1과 동일 구조 (텍스트만 변경)',
    sourceAFile: 'src/screens/activity/preview/PreviewIntro4.tsx',
    sourceBRef: 'IntroTutorStage',
  },
  {
    id: 'intro-eval',
    label: '4-1-3. 학습 소개(실전 평가)',
    category: '신규',
    description: '차시 학습의 실전평가(형성평가) 진입 전 학습 내용을 간단히 안내하는 인트로 화면. 마이크 아이콘과 발화 평가 안내를 통해 음성 발화 활동으로의 전환을 준비한다.',
    devNotes: '참고: IntroTutorStage 복사본\n- SESSION1.introEvaluation 데이터 참조\n- badge / icon / title / subtitle / achievement 구조\n- AI 튜터 오버레이: 진입 시 dim + 썸네일 + 말풍선 + 음원 자동 재생',
    designNotes: '4-1과 동일 구조 (배지: 실전평가, 아이콘: 🎤, 텍스트 변경)',
    sourceAFile: 'src/screens/IntroEvalStage/index.tsx',
    sourceBRef: 'IntroEvalStage',
  },
  {
    id: 'set-wordbook-eval',
    label: '5-2. 단어장과 발음평가',
    category: '신규',
    description: '세트별(1~3) 핵심 어휘(Min 1 ~ Max 5)를 학습하고 발음 평가 및 세트 문제 풀기로 연계되는 템플릿. 1번 세트에는 베트남어 안내 토스트 팝업 및 자동 음원 재생이 지원된다.',
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
    description: '음원을 듣고 제시된 단어 카드를 순서대로 선택하여 문장을 완성하는 활동. 베트남어 지문을 보고 해당하는 한국어 문장을 단어 단위 타일로 조합한다.',
    devNotes: '참고: 단어 만들기(WordBuildStage)와 동일한 구조\n- SESSION1.sentenceBuildQuiz 데이터 참조 (5문항)\n- 단어 단위 타일\n- FAIL_MAX=2: 2회 오답 시 정답 공개\n- 키보드 모드, 보기 선택 모드 제공',
    designNotes: '오디오 카드: teal 보더, 스피커 버튼(48px) + 답 영역(dashed)\n단어 타일: capsule 형태, #1A2B3C border\n하단: 확인(flex) + 💡(52px) + 키보드/보기선택 보조 버튼',
    sourceAFile: undefined,
    sourceBRef: 'SentenceBuildStage',
  },
  {
    id: 'sentence-build-2',
    label: '10. 문장 만들기 2',
    category: '신규',
    description: '베트남어 문장을 보고 해당하는 한국어 문장을 단어 카드로 조합하는 활동. 오디오 없이 지문 카드를 직접 읽고 해석한다.',
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
    description: '학습 이동 시 영상으로 학습해야 하는 정보를 알려주는 활동. 전체화면 영상 플레이어로 구성되며, 영상 시청 후 다음 액티비티로 진행한다.',
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
    description: '관리자(ADMIN)가 등록한 슬라이드(이미지)와 설명 텍스트를 한 쌍(set)으로 구성하여 순서대로 확인하는 활동. 사용자가 직접 슬라이드를 넘기며 학습하고, 마지막 슬라이드 확인 후 다음 단계로 진행할 수 있다.',
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
    description: '베트남어 단어를 보고 해당하는 한국어 선택지를 고르는 액티비티. 프로그레스바 헤더 및 1번 세트 안내 토스트 팝업 포함.',
    devNotes: 'WordVnKoSelect2 / props: questions, onNext, onBack, currentSetNumber, totalSets / 정답/오답 피드백 모달 포함 / Set 1 전용 토스트 팝업',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 베트남어 단어 카드(토스트 overlaid) + 한국어 선택지 카드(음성버튼) / MissionStage와 동일한 색상 구조(배경 #FFFFFF)',
    sourceAFile: 'src/screens/WordVnKoSelect2/index.tsx',
    sourceBRef: 'WordVnKoSelect2',
  },
  {
    id: 'word-sound-1',
    label: '31. 단어를 보고 음원 선택',
    category: '신규',
    description: '한국어/베트남어 단어를 보고 해당하는 음원 선택지 중 정답을 고르는 액티비티. 프로그레스바 헤더 및 1번 세트 안내 토스트 팝업 포함.',
    devNotes: 'WordSound1 / props: questions, onNext, onBack, currentSetNumber, totalSets / 정답/오답 피드백 모달 포함 / Set 1 전용 토스트 팝업(260825_word_1.mp3)',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 단어 텍스트 카드(토스트 overlaid) + 2x2 음원 버튼 그리드 / MissionStage와 동일한 색상 구조(배경 #FFFFFF)',
    sourceAFile: 'src/screens/WordSound1/index.tsx',
    sourceBRef: 'WordSound1',
  },
  {
    id: 'word-letter-blank',
    label: '32. 소리를 듣고 빈칸을 채우기',
    category: '신규',
    description: '음원을 듣고 제시된 글자 타일을 순서대로 선택하여 빈칸을 채우는 액티비티. 프로그레스바 헤더 및 1번 세트 안내 토스트 팝업 포함.',
    devNotes: 'WordLetterBlank / props: questions, onNext, onBack, currentSetNumber, totalSets / 정답/오답 피드백 모달 포함 / Set 1 전용 토스트 팝업(260825_word_2.mp3)',
    designNotes: '상단: ActivityHeader 프로그레스바 / 중앙: 음성 버튼 + 빈칸 보드 + 글자 타일 그리드 + 초기화 버튼 / MissionStage와 동일한 색상 구조(배경 #FFFFFF)',
    sourceAFile: 'src/screens/WordLetterBlank/index.tsx',
    sourceBRef: 'WordLetterBlank',
  },
  {
    id: 'set-complete',
    label: '33. 세트 학습 완료 (1/3)',
    category: '신규',
    description: '1 세트 학습 완료 후 노출되는 축하 화면. 체크마크 아이콘과 완료 메시지, 자동 음원 재생 포함.',
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
    description: '베트남어 지문을 읽고 한국어 문장의 빈칸을 선택지에서 고르는 활동. 문법 이해 강화.',
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
    description: '베트남어 문장을 읽고 한국어 문장 선택지 중 뜻에 맞는 것을 고르는 활동. 문장 이해력 강화.',
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
    description: '단어 학습 완료 시 축하와 격려를 표현하는 화면. 파티클 애니메이션과 함께 "대단해요!" 메시지 표시.',
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
    description: '영상 시청 + AI튜터 말풍선/음원 안내 화면. 진입 시 음원 자동 재생, 스피커 버튼으로 반복 재생 가능.',
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
      '1. 상단 슬라이드 영역\n' +
      '- 데이터 연동: CMS / Admin에 등록된 이미지 및 연결 데이터를 바인딩하여 노출.\n' +
      '- 수량 제약: Min 1개 ~ Max 10개 지원.\n' +
      '- 슬라이드-콘텐츠 매핑 구조:\n' +
      '  * 슬라이드(이미지)마다 1:1로 매핑되는 [AI 튜터 텍스트] 및 [AI 튜터 음원] 데이터를 가짐.\n\n' +
      '2. AI 튜터 말풍선 및 음원 재생 정책\n' +
      '- UI 노출 조건 (예외 처리):\n' +
      '  * [정상 노출]: 현재 슬라이드에 텍스트 또는 음원 데이터가 존재하는 경우, AI 튜터 썸네일 캐릭터 및 말풍선 UI 정상 노출.\n' +
      '  * [영역 미노출 (Hidden)]: 현재 슬라이드에 텍스트와 음원 데이터가 모두 미등록된 경우, AI 튜터 썸네일과 말풍선 영역 전체를 화면에서 숨김 처리(GNB/슬라이드 레이아웃 유지).\n' +
      '- 오디오 재생 및 인터랙션 흐름:\n' +
      '  * 슬라이드 전환 시 자동 동작: 슬라이드가 전환되어 화면에 안착하는 즉시 매핑된 텍스트가 표시되고, 음원은 1회 자동 재생(Auto-play).\n' +
      '  * 반복 재생(Replay): 음원 1회 재생이 완료되면 말풍선 내(또는 썸네일 인근)에 [다시 듣기 / Replay] 버튼이 활성화됨. 사용자가 선택 시 해당 슬라이드의 음원을 처음부터 다시 재생 지원.\n' +
      '  * 오디오 세션 해제(Stop & Release): 슬라이드를 이동하거나 화면을 이탈할 경우 재생 중인 이전 음원은 즉시 정지 및 메모리 해제.\n\n' +
      '3. 네비게이션 컨트롤 (이전 / 넘기기 / 인디케이터)\n' +
      '- 페이지 인디케이터 (Pagination):\n' +
      '  * 포맷: [현재 슬라이드 Index] / [전체 슬라이드 수] (예: 5개 중 3번째일 경우 3/5로 표기).\n' +
      '- [이전] 버튼 상태 및 인터랙션:\n' +
      '  * 첫 번째 슬라이드 (Index = 1): 비활성화(Disable).\n' +
      '  * 이후 슬라이드 (Index > 1): 활성화(Enable).\n' +
      '  * 탭 시 동작: 현재 재생 중인 음원을 즉시 정지(Stop)한 뒤 이전 슬라이드로 이동.\n' +
      '- [넘기기] 버튼 상태 및 인터랙션:\n' +
      '  * 마지막 슬라이드 (Index = Total): 비활성화(Disable).\n' +
      '  * 마지막 이전 슬라이드 (Index < Total): 활성화(Enable).\n' +
      '  * 탭 시 동작: 현재 재생 중인 음원을 즉시 정지(Stop)한 뒤 다음 슬라이드로 이동.\n\n' +
      '4. 하단 [다음] CTA 버튼 정책\n' +
      '- 버튼 활성화(Enable) 조건:\n' +
      '  * 슬라이드가 마지막 슬라이드(Index = Total)에 도달했을 때 비활성화(Disable)에서 활성화(Enable)로 전환.\n' +
      '  * (참고: 첫 번째 ~ 마지막 이전 슬라이드까지는 비활성화 상태 유지)\n' +
      '- 버튼 선택 인터랙션:\n' +
      '  * 마지막 슬라이드에서 음원이 재생 중인 상태라도, 활성화된 [다음] 버튼을 탭하면 즉시 음원을 정지(Stop)하고 다음 단계(학습 본문 화면 또는 완료 화면)로 이동.\n\n' +
      '5. 개발 및 QA 예외 확인 사항 (Exception Notes)\n' +
      '1) 슬라이드 제스처(Swipe) 연동:\n' +
      '   - 사용자가 버튼이 아닌 손가락 스와이프로 슬라이드를 빠르게 넘길 때도, 이전 슬라이드의 음원 중복 재생(오버랩)이 없도록 Audio Player Stop 로직이 철저히 호출되는지 확인.\n' +
      '2) 단일 슬라이드 등록 시 (Min=1):\n' +
      '   - 슬라이드가 1장만 등록된 경우 [이전], [넘기기] 버튼은 모두 Disable 처리되고, 인디케이터는 1/1로 표시되며 진입 즉시 하단 [다음] 버튼이 활성화(Enable) 상태로 시작되는지 확인.\n' +
      '3) 네트워크 에러/음원 누락 시:\n' +
      '   - 음원 파일 다운로드 실패 시에도 텍스트 말풍선은 정상 표기되어야 하며, [다음] 버튼 동작 및 슬라이드 이동에 병목이 발생하지 않아야 함.',
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
    description: '전체 대화문을 말풍선 목록으로 표시하고 라인별 순차 자동 재생. 활성 라인 teal 하이라이트.',
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
    description: '한 라인씩 표시하고 자동 재생 후 마이크 버튼으로 따라 말하기. 프로토타입은 2초 자동 완료.',
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
    description: '대화 한 줄을 듣고 단어 박스에 받아쓰는 액티비티. 음절 비교 채점 + 슬라이드업 피드백 패널.',
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
    description: '문법 학습 단원 완료 화면. 체크마크 아이콘 + 완료 메시지.',
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
    description: '대화 빈칸에 알맞은 단어를 골라 완성하는 액티비티. 3세트 화면 페이지네이션 + 슬라이드업 피드백 패널.',
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
];

export const SCREEN_REGISTRY: ScreenMeta[] = [
  ...BASE_SCREEN_REGISTRY,
];

export function getScreen(id: string): ScreenMeta | undefined {
  return SCREEN_REGISTRY.find((s) => s.id === id);
}
