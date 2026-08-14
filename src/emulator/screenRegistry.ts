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

export const SCREEN_REGISTRY: ScreenMeta[] = [
  {
    id: 'home',
    label: '1. 나의 코스',
    category: '수정',
    description: '학습자가 앱 진입 시 처음 만나는 화면. 1과 전체 차시 목록과 진도를 한눈에 보여주며, 현재 학습 가능한 차시로 빠르게 진입할 수 있도록 유도한다.',
    devNotes: '참고 파일: src/screens/home/Home.tsx (Source A)\n- SESSIONS 배열로 차시 카드 렌더링\n- sessionProgress() 함수로 각 차시 진행률 계산\n- unlocked 조건: 현재는 1차시만 열림 (서버 API 연동 후 동적 처리 예정)\n- BottomNav 공통 컴포넌트 사용',
    designNotes: '브랜드 컬러: --teal #00a8a6\n카드 모서리: borderRadius 16\n영웅 섹션 배경: tealSoft (#ddfbfa)\n그림자: shadow.card 토큰 사용\n하단 네비: 높이 56px, 상단 1px 보더',
    sourceAFile: 'src/screens/home/Home.tsx',
    sourceBRef: 'HomeScreen',
  },
  {
    id: 'mission',
    label: '2. 학습 미션',
    category: '신규',
    description: '차시 학습 시작 전 미션과 목표를 명확하게 인지시키는 신규 도입 화면. 학습자가 이번 차시에서 배울 내용과 산출물을 미리 확인하고 동기를 갖고 시작하도록 돕는다.',
    devNotes: '참고 파일: Source A에는 해당 화면 없음 (신규 구현)\n- sessionId prop으로 차시별 미션 텍스트 동적 표시\n- SESSION1.mission 데이터 참조\n- subTitles.ko / subTitles.vi로 다국어 처리\n- LangContext useLang() 훅으로 언어 전환',
    designNotes: '히어로 배너: tealSoft 배경, 보더 #b3f0ef\n미션 텍스트: fontSize 17, fontWeight 700, 최대 2줄\n불릿 리스트: teal 색 원형 도트 + 텍스트\n학습 시작 CTA: teal 배경, borderRadius 16',
    sourceAFile: undefined,
    sourceBRef: 'MissionStage',
  },
  {
    id: 'vocab-wordbook',
    label: '3. 오늘의 단어장',
    category: '신규',
    description: '한국어 단어, 베트남어 번역, 음원 등을 통해 단어를 학습하는 화면. 전체/한국어/베트남어 보기 탭 모드가 제공되며, 음성 배속 재생 조절 및 단어 발음하기 평가 기능이 포함되어 있다.',
    devNotes: '참고: Source B 오늘의 단어 (App.jsx), Source A 단어 발음 평가 (WordPronunciation1.tsx)\n- SESSION1.context.words 데이터 바인딩\n- 재생 속도(0.5x, 1.0x, 1.5x) 음원 재생 로직 포함',
    designNotes: '탭: selected 시 teal 보더 및 텍스트 적용\n단어 리스트: 15개 단어 로우 목록 렌더링\n하단 버튼: 단어 발음하기(Teal 배경) 및 바로 문제 풀기(테두리 버튼)',
    sourceAFile: 'src/screens/activity/word/WordPronunciation1.tsx',
    sourceBRef: 'vocabWordbook',
  },
  {
    id: 'intro',
    label: '4. 학습 소개',
    category: '신규',
    description: '차시 핵심 어휘 학습 시작 전 학습 내용을 간단히 안내하는 인트로 화면. 오늘 배울 단어와 학습 성과를 미리 보여주어 학습 동기를 높인다.',
    devNotes: '참고: Source A act31 PreviewIntro4 (src/screens/activity/preview/PreviewIntro4.tsx)\n- SESSION1.intro 데이터 참조\n- badge / icon / title / subtitle / achievement 구조\n- ActivityLayout 패턴: 프로그레스바 + X 버튼',
    designNotes: '배지: tealSoft 배경, teal 텍스트, borderRadius 20\n아이콘: tealSoft 원형(80px), 이모지 36px\n타이틀: 22px bold, center\n학습 성과 카드: #F0FAFA 배경, teal 체크 원형 아이콘',
    sourceAFile: 'src/screens/activity/preview/PreviewIntro4.tsx',
    sourceBRef: 'IntroStage',
  },
  {
    id: 'intro-2',
    label: '4-2. 학습 소개 2',
    category: '신규',
    description: '문법 학습 시작 전 캐릭터(K-Chao 고양이)가 말풍선으로 학습 내용을 안내하는 인트로 화면. 캐릭터 일러스트와 말풍선으로 친근한 분위기를 연출한다.',
    devNotes: '- SESSION1.intro2 데이터 참조 (badge, speech, achievement)\n- 캐릭터 이미지: assets/character-kchao.png\n- 말풍선: tealSoft 배경, teal 보더, 하단 꼬리 삼각형\n- ActivityLayout 패턴: 프로그레스바 + X 버튼',
    designNotes: '말풍선: tealSoft 배경, teal 1.5px 보더, borderRadius 20, 꼬리 아래 방향\n캐릭터: 220×220px, contain 모드\n배지: tealSoft 배경, teal 텍스트\n학습 성과 카드: #F0FAFA 배경, teal 체크 원형 아이콘',
    sourceAFile: undefined,
    sourceBRef: 'IntroStage2',
  },
  {
    id: 'word-build',
    label: '5. 단어 만들기',
    category: '신규',
    description: '음원을 듣고 제시된 글자 카드를 순서대로 선택하여 단어를 완성하는 활동. 정오답 피드백 모달, 재생 속도 선택, 힌트, 키보드 입력 모드 제공.',
    devNotes: '참고: Source A WordLetterScramble5 (src/screens/activity/word/WordLetterScramble5.tsx)\n- SESSION1.wordBuildQuiz 데이터 참조 (5문항)\n- 음절 단위 타일\n- 재생 속도: 0.5x / 1.0x / 1.5x\n- FAIL_MAX=2: 2회 오답 시 정답 공개\n- 키보드 모드: TextInput으로 직접 입력',
    designNotes: '오디오 카드: teal 보더, 스피커 버튼(48px 원형) + 답 슬롯\n타일: 48×48px, 선택 시 teal 보더+배경\n피드백 모달: bottom sheet\n힌트: amber 색상',
    sourceAFile: 'src/screens/activity/word/WordLetterScramble5.tsx',
    sourceBRef: 'WordBuildStage',
  },
  {
    id: 'sentence-build',
    label: '6. 문장 만들기 1',
    category: '신규',
    description: '음원을 듣고 제시된 단어 카드를 순서대로 선택하여 문장을 완성하는 활동. 베트남어 지문을 보고 해당하는 한국어 문장을 단어 단위 타일로 조합한다.',
    devNotes: '참고: 단어 만들기(WordBuildStage)와 동일한 구조\n- SESSION1.sentenceBuildQuiz 데이터 참조 (5문항)\n- 단어 단위 타일\n- FAIL_MAX=2: 2회 오답 시 정답 공개\n- 키보드 모드, 보기 선택 모드 제공',
    designNotes: '오디오 카드: teal 보더, 스피커 버튼(48px) + 답 영역(dashed)\n단어 타일: capsule 형태, #1A2B3C border\n하단: 확인(flex) + 💡(52px) + 키보드/보기선택 보조 버튼',
    sourceAFile: undefined,
    sourceBRef: 'SentenceBuildStage',
  },
  {
    id: 'sentence-build-2',
    label: '7. 문장 만들기 2',
    category: '신규',
    description: '베트남어 문장을 보고 해당하는 한국어 문장을 단어 카드로 조합하는 활동. 오디오 없이 지문 카드를 직접 읽고 해석한다.',
    devNotes: '참고: 문장 만들기 1(SentenceBuildStage)과 동일한 데이터(SESSION1.sentenceBuildQuiz) 사용\n- 오디오 없음, 베트남어 지문 카드 표시\n- 답 영역: 언더라인 스타일\n- 키보드 모드 제공\n- FAIL_MAX=2',
    designNotes: '지문 카드: teal 보더(1.5px), borderRadius 16, 문장 18px bold center\n답 영역: teal 언더라인(2px), 선택 단어 teal pill\n타일: capsule 형태, #1A2B3C border\n하단: 확인(flex) + 💡(52px) + 키보드 사용하기',
    sourceAFile: undefined,
    sourceBRef: 'SentenceBuildStage2',
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
    id: 'quick-review',
    label: '9. 퀵리뷰',
    category: '신규',
    description: '이전 학습(차시 또는 레슨)에서 학습한 내용에 대한 확인을 통해 이전 학습을 기억하고 있는지 확인하는 템플릿. 문항 카드를 순서대로 확인하며 "기억나요" / "기억이 안 나요"로 응답하고, 전체 완료 후 다음 차시로 진행한다.',
    devNotes: '참고: C:\\dev\\kchao-lesson1-main 2차시 퀵리뷰\n- MOCK_QUICK_REVIEW 데이터 사용 (ADMIN 연동 전 목업)\n- 문항 수: MIN 1 ~ MAX 10\n- 문항 진행: 1번부터 순서대로 잠금 해제\n- 완료 조건: 모든 문항에 응답 완료\n- props: onNext / onBack / data(optional)',
    designNotes: '상단 배지: tealSoft 배경, "퀵 리뷰" 텍스트\n활성 카드: teal 보더 1.5px, 정답 박스(tealSoft)\n잠긴 카드: line 보더, muted 텍스트\n기억나요 버튼: teal 배경\n기억이 안 나요: 테두리 버튼\n하단: 전체 완료 시 다음 차시 버튼 활성화',
    sourceAFile: undefined,
    sourceBRef: 'QuickReviewStage',
  },
  {
    id: 'culture',
    label: '10. 문화',
    category: '신규',
    description: '별도 오프라인으로 제공되는 교재에서 확인 가능한 한국 문화 정보를 앱에서도 확인할 수 있는 화면. 히어로 이미지/영상, 교재 연계 콘텐츠 카드(번호별 항목 포함)로 구성된다.',
    devNotes: 'MOCK_CULTURE_ACTIVITY 데이터 사용 (ADMIN 연동 전 목업)\n- activityNo / activityQuestionNo 구조로 Source A 이식 기준 준수\n- heroMedia: type(image|video) + uri(ADMIN 등록값, 미등록 시 플레이스홀더)\n- contents[].subItems: 교재 번호별 세부 항목 (선택적)\n- 스크롤 끝까지 읽으면 확인 버튼 활성화\n- props: onPressConfirm / onClose',
    designNotes: '타입 배지: tealSoft 배경, teal 텍스트\n히어로: aspectRatio 16/9, borderRadius 12\n콘텐츠 카드: surface 배경, line 보더, borderRadius 16\n세부 항목 번호: teal 배경 32×32 badge\n하단 버튼: 스크롤 완료 전 비활성(line 배경), 완료 후 teal 배경',
    sourceAFile: undefined,
    sourceBRef: 'CultureStage',
  },
];

export function getScreen(id: string): ScreenMeta | undefined {
  return SCREEN_REGISTRY.find((s) => s.id === id);
}
