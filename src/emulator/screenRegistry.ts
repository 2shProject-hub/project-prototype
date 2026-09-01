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
    description: '차시 학습 시작 전 AI 튜터가 미션과 목표를 음성과 말풍선으로 안내하는 화면.',
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
    id: 'picture-word-2',
    label: '30. 이미지 보고 단어 선택',
    category: '신규',
    description: '이미지를 보고 해당하는 단어 선택지를 고르는 액티비티. 시각적 학습 강화.',
    devNotes: 'PictureWord2 / props: questions, onNext, onBack / 이미지 표시 및 선택지 카드',
    designNotes: '상단: 질문 제목 / 중앙: 이미지 컨테이너 + 단어 선택지 카드 / 하단: 돌아가기',
    sourceAFile: 'src/screens/activity/picture/PictureWord2.tsx',
    sourceBRef: 'PictureWord2',
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
    label: '16. 학습 리포트',
    category: '신규',
    description: '1차시 학습 완료 후 전체 학습 성과를 요약하는 최종 리포트. 어휘, 발음평가, 문제 현황 및 AI 피드백을 포함한다.',
    devNotes: 'LearningReportStage / props: data, onNext, onBack / 학습 성과 요약(어휘 수, 발음평가 점수, 확인 문제 점수) / 재학습 섹션(단어, 문법, 음성) / AI 피드백 영역 / 다국어 지원',
    designNotes: '상단: 배지(학습 리포트) + 프로그레스바 / 제목 및 설명 / 요약 카드(3개 항목: 어휘, 발음평가, 확인문제) / 재학습 섹션(3개 항목) / AI 피드백 영역(노란 배경) / 하단: 학습 완료 버튼',
    sourceAFile: 'src/screens/LearningReportStage/index.tsx',
    sourceBRef: 'LearningReportStage',
  },
  {
    id: 'practical-listening',
    label: '21. 실전 듣기',
    category: '신규',
    description: '문장을 듣고 핵심 단어를 확인하는 실전 듣기 활동. 스피커 아이콘 탭 시 문장 음원 재생. 이어지는 실전 말하기의 참고 문장을 미리 익힌다.',
    devNotes: 'PracticalListeningStage / props: onNext, onBack, data(optional) / 음원 재생 인터랙션 / 하이라이트 박스로 핵심 단어 표시 / KO-VI 다국어 지원',
    designNotes: '배지: tealSoft bg / 타이틀 22px bold / 문장 카드: #FAFCFD bg, line border / 스피커 버튼: tealSoft 원형 44px / 하이라이트 박스: teal border + #E6F7F7 bg',
    sourceAFile: undefined,
    sourceBRef: 'PracticalListeningStage',
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
    description: '이미지 슬라이드 뷰어(Min 1~Max 10장). AI튜터+말풍선+오디오 자동재생, [이전/넘기기] 슬라이드 네비, [다음] 마지막 슬라이드 도달 후 활성. intro(카드)/quiz(선택지)/outro(완료) 3종 콘텐츠 타입 지원.',
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
