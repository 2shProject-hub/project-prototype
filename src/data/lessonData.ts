// 1과 1차시 "처음 인사하기" — Source B (kchao-lesson1-main/src/lessonData.js) TypeScript 포팅
export const LESSON = {
  number: '1과',
  title: '저는 흐엉이에요',
  summary: '이름, 나라, 국적, 직업을 말하며 자신을 소개하는 방법을 배웁니다.',
  summaryVi: 'Học cách tự giới thiệu bản thân bằng cách nói tên, quốc gia, quốc tịch và nghề nghiệp.',
  heroImage: require('../../assets/icon.png'), // 실제 앱에서는 Source A 에셋 경로로 교체
};

export const SESSIONS = [
  { id: 1, title: '나라와 국적 소개', titleVi: 'Giới thiệu quốc gia và quốc tịch', label: '문법과 표현', expression: '저는 N이에요/예요', locked: false },
  { id: 2, title: '직업 묻고 답하기', label: '문법과 표현', expression: 'N이에요/예요?', locked: true },
  { id: 3, title: '국적 문장 만들기', label: '문법과 표현', expression: 'N은/는', locked: true },
  { id: 4, title: '틀린 정보 정정하기', label: '문법과 표현', expression: 'N이/가 아니에요', locked: true },
  { id: 5, title: '통합 연습 1', label: '학습 성과', expression: '1~4차시 표현으로 읽고 쓰기', locked: true },
  { id: 6, title: '통합 연습 2', label: '학습 성과', expression: '1~4차시 표현으로 듣고 말하기', locked: true },
];

export type Stage = 'mission' | 'recall' | 'context' | 'vocab' | 'grammar' | 'retry' | 'report';

export const STAGE_ORDER: Stage[] = ['mission', 'recall', 'context', 'vocab', 'grammar', 'retry', 'report'];

export const STAGE_LABELS: Record<Stage, string> = {
  mission: '학습 목표', recall: '지난 내용 회상', context: '상황 만나기',
  vocab: '핵심 어휘', grammar: '표현 이해', retry: '오답 다시 풀기', report: '학습 리포트',
};

export const SKILLS = ['어휘', '문법', '듣기', '읽기', '말하기', '쓰기'];

// 단어 만들기 퀴즈: 보기 타일 개수(N) = 정답 음절 수 + 이 값
export const WORD_BUILD_DISTRACTOR_COUNT = 3;

export const SESSION1 = {
  intro: {
    badge: '오늘의 단어',
    badgeVi: 'Từ vựng hôm nay',
    icon: '📖',
    title: '나라와 국적 단어를 살펴봐요',
    titleVi: 'Cùng xem qua từ vựng về tên nước và quốc tịch nhé',
    subtitle: '단어를 하나씩 눈으로 확인하고 소리 내어 읽어봐요.',
    subtitleVi: 'Hãy nhìn từng từ và đọc to lên nhé.',
    achievement: {
      label: '학습 성과',
      labelVi: 'Kết quả học tập',
      desc: '나라와 국적 단어 15개를 알아볼 수 있어요.',
      descVi: 'Bạn có thể nhận biết 15 từ vựng về tên nước và quốc tịch.',
    },
  },
  introEvaluation: {
    badge: '실전평가',
    badgeVi: 'Đánh giá thực tế',
    icon: '🎤',
    title: '자기소개 문장을 직접 말해봐요',
    titleVi: 'Hãy nói câu tự giới thiệu của bạn',
    subtitle: '배운 표현을 사용해 자연스럽게 말해봅시다.',
    subtitleVi: 'Hãy nói một cách tự nhiên bằng cách sử dụng các biểu thức đã học.',
    achievement: {
      label: '학습 성과',
      labelVi: 'Kết quả học tập',
      desc: '이름과 국적을 말하며 자기소개 문장을 말할 수 있어요.',
      descVi: 'Bạn có thể nói câu tự giới thiệu với tên và quốc tịch.',
    },
  },
  mission: {
    ko: '나라와 국적 표현을 익혀서 한국어로 나를 소개해요.',
    vi: 'Học cách diễn đạt về quốc gia và quốc tịch để giới thiệu bản thân bằng tiếng Hàn.',
    pages: 'p16, p20–21',
    artifact: '내 프로필 카드 · 이름',
    subTitles: {
      ko: ['이름과 나라를 한국어로 말하기', '이에요/예요 규칙 이해하기', '짧은 자기소개 문장 완성하기'],
      vi: ['Nói tên và quốc gia bằng tiếng Hàn', 'Hiểu quy tắc 이에요/예요', 'Hoàn thành câu tự giới thiệu ngắn'],
    },
  },
  // 한국어 단어는 최대 7자(음절)까지 구성될 수 있음. 보기 타일 개수(N) = 정답 음절 수 + WORD_BUILD_DISTRACTOR_COUNT.
  wordBuildQuiz: [
    { id: 1, ko: '한국어능력시험', vi: 'Kỳ thi năng lực tiếng Hàn', distractors: ['급', '문', '법'] },
    { id: 2, ko: '독일',   vi: 'Đức',      distractors: ['프', '베', '중'] },
    { id: 3, ko: '태국',   vi: 'Thái Lan', distractors: ['한', '미', '인'] },
    { id: 4, ko: '프랑스', vi: 'Pháp',     distractors: ['독', '베', '러'] },
    { id: 5, ko: '베트남', vi: 'Việt Nam', distractors: ['한', '프', '중'] },
  ],
  sentenceBuildQuiz: [
    {
      id: 1,
      vi: 'Tôi là người Hàn Quốc.',
      ko: '저는 한국인 입니다.',
      answerWords: ['저는', '한국인', '입니다'],
      distractors: ['베트남', '의사예요'],
    },
  ],
  context: {
    words: [
      { ko: '베트남', vi: 'Việt Nam' },
      { ko: '한국', vi: 'Hàn Quốc' },
      { ko: '인도네시아', vi: 'Indonesia' },
      { ko: '러시아', vi: 'Nga' },
      { ko: '미국', vi: 'Mỹ' },
      { ko: '캐나다', vi: 'Canada' },
      { ko: '태국', vi: 'Thái Lan' },
      { ko: '프랑스', vi: 'Pháp' },
      { ko: '중국', vi: 'Trung Quốc' },
      { ko: '일본', vi: 'Nhật Bản' },
      { ko: '말레이시아', vi: 'Malaysia' },
      { ko: '독일', vi: 'Đức' },
      { ko: '베트남 사람', vi: 'người Việt Nam' },
      { ko: '한국 사람', vi: 'người Hàn Quốc' },
      { ko: '일본 사람', vi: 'người Nhật Bản' },
    ],
    vocabQuizItems: [
      { type: 'vi-to-ko', vi: 'Việt Nam', answer: '베트남', choices: ['베트남', '한국', '일본', '중국'] },
      { type: 'listen-choice', ko: '한국', answer: '한국', choices: ['한국', '중국', '일본', '프랑스'] },
      { type: 'listen-pick-audio', ko: '인도네시아', answer: '인도네시아', choices: ['인도네시아', '말레이시아', '태국', '베트남'] },
      { type: 'ko-to-vi', ko: '태국', answer: 'Thái Lan', choices: ['Thái Lan', 'Indonesia', 'Malaysia', 'Việt Nam'] },
      { type: 'vi-to-ko', vi: 'người Hàn Quốc', answer: '한국 사람', choices: ['한국 사람', '베트남 사람', '일본 사람', '중국 사람'] },
      { type: 'listen-assemble', ko: '미국', tiles: ['미', '국'], distractorTiles: ['한', '베'] },
      { type: 'recall-type', vi: 'Nhật Bản', tiles: ['일', '본'], distractorTiles: ['한', '국', '베', '트'] },
      { type: 'ko-to-vi', ko: '독일', answer: 'Đức', choices: ['Đức', 'Nga', 'Pháp', 'Canada'] },
      { type: 'vi-to-ko', vi: 'người Nhật Bản', answer: '일본 사람', choices: ['일본 사람', '한국 사람', '베트남 사람', '독일 사람'] },
      { type: 'listen-assemble', ko: '베트남 사람', tiles: ['베', '트', '남', '사', '람'], distractorTiles: ['한', '국', '일', '본'] },
    ] as const,
  },
  grammar: {
    label: '문법과 표현 1',
    title: '저는 N이에요/예요',
    rule: "명사 끝에 받침이 있으면 '이에요', 없으면 '예요'를 붙여요.",
    ruleVi: "Danh từ có phụ âm cuối dùng '이에요', không có phụ âm cuối dùng '예요'.",
    ruleTable: {
      left: { header: '저는 받침 O + 이에요', examples: ['저는 베트남 사람이에요', '저는 학생이에요'] },
      right: { header: '저는 받침 X + 예요', examples: ['저는 기자예요', '저는 의사예요'] },
    },
    supplement: {
      intro: "'저는 N이에요/예요'는 \"저는 ~입니다\"라는 뜻이에요. 이름, 국적, 직업을 소개할 때 써요.",
      rules: [
        {
          title: "1. 받침이 있으면 '이에요'",
          desc: "마지막 글자에 받침이 있으면 '이에요'를 써요.",
          hasBatchim: true,
          pairs: [
            { word: '사람', ending: '이에요' },
            { word: '학생', ending: '이에요' },
          ],
          examples: [
            { before: '저는 베트남 ', highlight: '사람이에요' },
            { before: '저는 ', highlight: '학생이에요' },
          ],
        },
        {
          title: "2. 받침이 없으면 '예요'",
          desc: "마지막 글자에 받침이 없으면 '예요'를 써요.",
          hasBatchim: false,
          pairs: [
            { word: '기자', ending: '예요' },
            { word: '의사', ending: '예요' },
          ],
          examples: [
            { before: '저는 ', highlight: '기자예요' },
            { before: '저는 ', highlight: '의사예요' },
          ],
        },
      ],
      summary: [['받침 O', '이에요'], ['받침 X', '예요']] as [string, string][],
    },
    examples: [
      '저는 한국 사람이에요.',
      '흐엉 씨는 베트남 사람이에요.',
      '저는 기자예요.',
      '김민준 씨는 의사예요.',
    ],
    sentenceQuiz: [
      {
        type: 'blank',
        prefix: '저는 베트남 사람',
        suffix: '.',
        answer: '이에요',
        choices: ['이에요', '예요'],
      },
      {
        type: 'translate',
        vi: 'Tôi là người Hàn Quốc.',
        answer: '저는 한국 사람이에요.',
        choices: ['저는 한국 사람이에요.', '저는 베트남 사람이에요.', '저는 기자예요.'],
      },
      {
        type: 'construct',
        vi: 'Cô ấy là phóng viên.',
        answer: '기자예요',
        tiles: ['기자예요', '학생이에요', '의사예요'],
        distractorTiles: [],
      },
      {
        type: 'constructChar',
        vi: 'Anh ấy là bác sĩ.',
        answer: '의사예요',
        tiles: ['의사예요', '기자예요', '사람이에요'],
        distractorTiles: [],
      },
      {
        type: 'listenWord',
        ko: '저는 베트남 사람이에요.',
        tiles: ['저는 베트남 사람이에요.'],
        distractorTiles: ['저는 한국 사람이에요.', '저는 기자예요.'],
      },
      {
        type: 'listenChar',
        ko: '예요',
        tiles: ['예요'],
        distractorTiles: ['이에요', '었어요', '아요'],
      },
    ] as const,
  },
};

// ─── 브릿지 스테이지 데이터 (ADMIN 연동 전 목업) ────────────────────
// 학습 단계 전환 시 맥락을 이어주는 브릿지 화면 (4종)
//
// bridgeType 별 전환 방향:
//   'vocab-to-grammar'        : 어휘 → 문법
//   'grammar-to-listening'    : 문법 → 듣고 말하기
//   'grammar-to-speaking'     : 문법 → 말하기
//   'grammar-to-writing'      : 문법 → 읽고 쓰기
//
// 이식 가이드:
//   - learnedChips: ADMIN API 직전 액티비티의 학습 완료 항목으로 동적 교체
//   - example.highlight: 예문에 쓸 대표 항목 자동 선택
//   - activityNo: ADMIN API 응답값 사용

export type BridgeType =
  | 'vocab-to-grammar'
  | 'grammar-to-listening'
  | 'grammar-to-speaking'
  | 'grammar-to-writing';

export interface BridgeChip {
  ko: string;     // 칩 메인 텍스트 (어휘 또는 문법 패턴)
  vi?: string;    // 베트남어 서브 텍스트 (어휘 칩에만 사용, 문법 칩은 생략)
}

export interface BridgeData {
  activityNo: number;
  bridgeType: BridgeType;        // 전환 유형 — 칩 스타일 및 아이콘 결정에 사용
  fromLabel: string;             // 출발 영역 레이블 (예: "어휘", "문법")
  fromLabelVi: string;
  toLabel: string;               // 도착 영역 레이블 (예: "문법", "듣고 말하기")
  toLabelVi: string;
  learnedChips: BridgeChip[];    // 직전 액티비티에서 학습한 항목 (MAX 4)
  bridgeMessage: string;
  bridgeMessageVi: string;
  example: {
    prefix: string;              // 문장 앞 고정 요소
    prefixVi: string;
    highlight: string;           // 하이라이트 요소 — 직전에 학습한 어휘/패턴
    highlightVi: string;
    suffix: string;              // 새로 적용할 문법/활동 요소
    full: string;                // 완성 문장
    fullVi: string;
  };
  nextLabel: string;             // 다음 활동 영역 배지 텍스트
  nextLabelVi: string;
  ctaLabel: string;
  ctaLabelVi: string;
}

// ── A. 어휘 → 문법 ─────────────────────────────────────────────────
// 단어 액티비티에서 배운 어휘를 문법 예문의 핵심 요소로 재활용
export const MOCK_BRIDGE_VOCAB_GRAMMAR: BridgeData = {
  activityNo: 31,
  bridgeType: 'vocab-to-grammar',
  fromLabel: '어휘',       fromLabelVi: 'Từ vựng',
  toLabel: '문법',         toLabelVi: 'Ngữ pháp',
  learnedChips: [
    { ko: '베트남 사람', vi: 'người Việt Nam' },
    { ko: '한국 사람',   vi: 'người Hàn Quốc' },
    { ko: '기자',        vi: 'phóng viên' },
  ],
  bridgeMessage: '방금 배운 단어로\n문법을 배워볼까요?',
  bridgeMessageVi: 'Hãy học ngữ pháp\nbằng từ vừa học nhé!',
  example: {
    prefix: '저는', prefixVi: 'Tôi',
    highlight: '베트남 사람', highlightVi: 'người Việt Nam',
    suffix: '이에요.',
    full: '저는 베트남 사람이에요.',
    fullVi: 'Tôi là người Việt Nam.',
  },
  nextLabel: 'N + 이에요 / 예요',
  nextLabelVi: 'N + 이에요 / 예요',
  ctaLabel: '다음',
  ctaLabelVi: '다음',
};

// ── B. 문법 → 듣고 말하기 ──────────────────────────────────────────
// 배운 문법 패턴을 실제 음성으로 듣고 따라 말하는 활동으로 연결
export const MOCK_BRIDGE_GRAMMAR_LISTENING: BridgeData = {
  activityNo: 32,
  bridgeType: 'grammar-to-listening',
  fromLabel: '문법',           fromLabelVi: 'Ngữ pháp',
  toLabel: '듣고 말하기',      toLabelVi: 'Nghe và nói',
  learnedChips: [
    { ko: 'N + 이에요 / 예요' },
    { ko: '저는 N이에요.' },
  ],
  bridgeMessage: '배운 문법을 귀로 듣고\n소리 내어 따라해봐요!',
  bridgeMessageVi: 'Hãy nghe và lặp lại\nnhững gì vừa học nhé!',
  example: {
    prefix: '저는', prefixVi: 'Tôi',
    highlight: '기자', highlightVi: 'phóng viên',
    suffix: '예요.',
    full: '저는 기자예요.',
    fullVi: 'Tôi là phóng viên.',
  },
  nextLabel: '🎧 듣고 말하기',
  nextLabelVi: '🎧 Nghe và nói',
  ctaLabel: '다음',
  ctaLabelVi: '다음',
};

// ── C. 문법 → 말하기 ───────────────────────────────────────────────
// 배운 문법 패턴을 스스로 말하는 발화 연습 활동으로 연결
export const MOCK_BRIDGE_GRAMMAR_SPEAKING: BridgeData = {
  activityNo: 33,
  bridgeType: 'grammar-to-speaking',
  fromLabel: '문법',       fromLabelVi: 'Ngữ pháp',
  toLabel: '말하기',       toLabelVi: 'Nói',
  learnedChips: [
    { ko: 'N + 이에요 / 예요' },
    { ko: '저는 N이에요.' },
  ],
  bridgeMessage: '이제 배운 문법으로\n직접 말해봐요!',
  bridgeMessageVi: 'Bây giờ hãy tự nói\nbằng ngữ pháp đã học!',
  example: {
    prefix: '저는', prefixVi: 'Tôi',
    highlight: '베트남 사람', highlightVi: 'người Việt Nam',
    suffix: '이에요.',
    full: '저는 베트남 사람이에요.',
    fullVi: 'Tôi là người Việt Nam.',
  },
  nextLabel: '🎤 말하기',
  nextLabelVi: '🎤 Nói',
  ctaLabel: '다음',
  ctaLabelVi: '다음',
};

// ── D. 문법 → 읽고 쓰기 ───────────────────────────────────────────
// 배운 문법 패턴을 읽고 직접 써보는 활동으로 연결
export const MOCK_BRIDGE_GRAMMAR_WRITING: BridgeData = {
  activityNo: 34,
  bridgeType: 'grammar-to-writing',
  fromLabel: '문법',           fromLabelVi: 'Ngữ pháp',
  toLabel: '읽고 쓰기',        toLabelVi: 'Đọc và viết',
  learnedChips: [
    { ko: 'N + 이에요 / 예요' },
    { ko: '저는 N이에요.' },
  ],
  bridgeMessage: '배운 문법으로\n읽고 써봐요!',
  bridgeMessageVi: 'Hãy đọc và viết\nbằng ngữ pháp đã học!',
  example: {
    prefix: '저는', prefixVi: 'Tôi',
    highlight: '학생', highlightVi: 'học sinh',
    suffix: '이에요.',
    full: '저는 학생이에요.',
    fullVi: 'Tôi là học sinh.',
  },
  nextLabel: '✏️ 읽고 쓰기',
  nextLabelVi: '✏️ Đọc và viết',
  ctaLabel: '다음',
  ctaLabelVi: '다음',
};

// ─── 퀵리뷰 데이터 (ADMIN 연동 전 목업) ─────────────────────────────
export interface QuickReviewItem {
  id: number;
  activityQuestionNo: number;  // Source A: activityQuestionNo (API 응답 기준)
  typeLabel: string;           // 화면에 표시할 문항 유형 레이블
  typeLabelVi?: string;
  question: string;            // 제시 질문
  questionVi?: string;
  answer: string;              // 정답 텍스트
  answerVi?: string;
  context?: string;            // 부가 설명 (optional)
  contextVi?: string;
}

export interface QuickReviewData {
  sessionLabel: string;  // 예: "1차시에서"
  sessionLabelVi?: string;
  title: string;
  titleVi?: string;
  subtitle: string;
  subtitleVi?: string;
  nextLabel: string;     // 하단 버튼 텍스트
  nextLabelVi?: string;
  items: QuickReviewItem[];  // MIN 1 ~ MAX 10
}

export const MOCK_QUICK_REVIEW: QuickReviewData = {
  sessionLabel: '1차시에서',
  sessionLabelVi: 'Trong bài 1',
  title: '1차시에서 배운 내용을 기억해봐요.',
  titleVi: 'Hãy nhớ lại những gì đã học trong bài 1.',
  subtitle: '질문에 대한 답을 떠올린 후에, 눌러서 정답을 확인해 보세요.',
  subtitleVi: 'Hãy nghĩ về câu trả lời, rồi nhấn để kiểm tra đáp án.',
  nextLabel: '다음',
  nextLabelVi: '다음',
  items: [
    {
      id: 1,
      activityQuestionNo: 1,
      typeLabel: '단어(VT-KOR)',
      typeLabelVi: 'Từ vựng (VT-HÀN)',
      question: '"Việt Nam"은 한국어로 뭐에요?',
      questionVi: '"Việt Nam" tiếng Hàn là gì?',
      answer: '베트남',
      answerVi: '베트남',
      context: '1과 핵심 어휘 15개 중 하나에요.',
      contextVi: 'Đây là một trong 15 từ vựng trọng tâm của bài 1.',
    },
    {
      id: 2,
      activityQuestionNo: 2,
      typeLabel: '단어(KOR-VT)',
      typeLabelVi: 'Từ vựng (HÀN-VT)',
      question: '"프랑스 사람"은 베트남어로 뭐에요?',
      questionVi: '"프랑스 사람" tiếng Việt là gì?',
      answer: 'người Pháp',
      answerVi: 'người Pháp',
      context: '1과 핵심 어휘 15개 중 하나에요.',
      contextVi: 'Đây là một trong 15 từ vựng trọng tâm của bài 1.',
    },
    {
      id: 3,
      activityQuestionNo: 3,
      typeLabel: '문법·받침 O',
      typeLabelVi: 'Ngữ pháp·có phụ âm cuối',
      question: '받침이 있는 "학생" 뒤에는 이에요, 예요 중 뭘 붙일까요?',
      questionVi: 'Sau danh từ có phụ âm cuối như "학생", dùng 이에요 hay 예요?',
      answer: '이에요 → 학생이에요',
      answerVi: '이에요 → 학생이에요',
    },
    {
      id: 4,
      activityQuestionNo: 4,
      typeLabel: '문법·받침 X',
      typeLabelVi: 'Ngữ pháp·không có phụ âm cuối',
      question: '받침이 없는 "기자" 뒤에는 뭘 붙일까요?',
      questionVi: 'Sau danh từ không có phụ âm cuối như "기자", dùng gì?',
      answer: '예요 → 기자예요',
      answerVi: '예요 → 기자예요',
    },
    {
      id: 5,
      activityQuestionNo: 5,
      typeLabel: '응용·자기소개',
      typeLabelVi: 'Ứng dụng·tự giới thiệu',
      question: '구조로 나의 자기소개 문장을 완성해보세요. "저는 ___이에요/예요."',
      questionVi: 'Hãy hoàn thành câu tự giới thiệu theo cấu trúc: "저는 ___이에요/예요."',
      answer: '예) 저는 베트남 사람이에요.',
      answerVi: 'Ví dụ: 저는 베트남 사람이에요.',
    },
  ],
};

export type SessionState = {
  stage: Stage;
  visited: Stage[];
  completed: boolean;
  completedAt: string;
};

export function defaultSessionState(): SessionState {
  return {
    stage: 'mission',
    visited: ['mission'],
    completed: false,
    completedAt: '',
  };
}

export const STORAGE_KEY = 'kchao.lesson1.proto.v1';

export const MOCK_ADMIN_WORDBOOK_ACTIVITY = {
  activityNo: 22,
  title: '나라와 국적',
  titleVi: 'Quốc gia và quốc tịch',
  questions: [
    {
      activityQuestionNo: 1,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'vietnam_audio.mp3', extra2: '베트남', extra3: 'Việt Nam' }
      ]
    },
    {
      activityQuestionNo: 2,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'korea_audio.mp3', extra2: '한국', extra3: 'Hàn Quốc' }
      ]
    },
    {
      activityQuestionNo: 3,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'indonesia_audio.mp3', extra2: '인도네시아', extra3: 'Indonesia' }
      ]
    },
    {
      activityQuestionNo: 4,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'russia_audio.mp3', extra2: '러시아', extra3: 'Nga' }
      ]
    },
    {
      activityQuestionNo: 5,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'usa_audio.mp3', extra2: '미국', extra3: 'Mỹ' }
      ]
    },
    {
      activityQuestionNo: 6,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'canada_audio.mp3', extra2: '캐나다', extra3: 'Canada' }
      ]
    },
    {
      activityQuestionNo: 7,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'thailand_audio.mp3', extra2: '태국', extra3: 'Thái Lan' }
      ]
    },
    {
      activityQuestionNo: 8,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'france_audio.mp3', extra2: '프랑스', extra3: 'Pháp' }
      ]
    },
    {
      activityQuestionNo: 9,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'china_audio.mp3', extra2: '중국', extra3: 'Trung Quốc' }
      ]
    },
    {
      activityQuestionNo: 10,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'japan_audio.mp3', extra2: '일본', extra3: 'Nhật Bản' }
      ]
    },
    {
      activityQuestionNo: 11,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'malaysia_audio.mp3', extra2: '말레이시아', extra3: 'Malaysia' }
      ]
    },
    {
      activityQuestionNo: 12,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'germany_audio.mp3', extra2: '독일', extra3: 'Đức' }
      ]
    },
    {
      activityQuestionNo: 13,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'vietnam_person_audio.mp3', extra2: '베트남 사람', extra3: 'người Việt Nam' }
      ]
    },
    {
      activityQuestionNo: 14,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'korea_person_audio.mp3', extra2: '한국 사람', extra3: 'người Hàn Quốc' }
      ]
    },
    {
      activityQuestionNo: 15,
      questionItems: [
        { itemCd: 'speaking_word', extra1: 'japan_person_audio.mp3', extra2: '일본 사람', extra3: 'người Nhật Bản' }
      ]
    }
  ]
};

// ─── 문화 액티비티 데이터 (ADMIN 연동 전 목업) ───────────────────────
// Source A 이식 기준: activityNo / activityQuestionNo 구조 유지

export type CultureMediaType = 'image' | 'video';

export interface CultureSubItem {
  no: string;           // "01", "02" 등 교재 번호
  title: string;        // 소항목 제목
  titleVi?: string;
  imageUri?: string;    // 삽화 이미지 URI (ADMIN 등록값, 프로토타입에선 undefined)
  description: string;
  descriptionVi?: string;
}

export interface CultureContentItem {
  activityQuestionNo: number;   // Source A: activityQuestionNo
  icon?: string;                // 이모지 아이콘
  title: string;                // 내용 제목
  titleVi?: string;
  pageRef?: string;             // 교재 페이지 참조 (예: "p35")
  description: string;          // 본문 설명
  descriptionVi?: string;
  subItems?: CultureSubItem[];  // 교재 번호별 세부 항목 (optional)
}

export interface CultureActivityData {
  activityNo: number;           // Source A: activityNo
  typeLabel: string;            // 화면 상단 타입 배지 (예: "Type 2 - 6단계: 문화 학습")
  typeLabelVi?: string;
  title: string;                // 화면 제목
  titleVi?: string;
  heroMedia?: {
    type: CultureMediaType;
    source?: any;               // 로컬 require() 에셋 (프로토타입용)
    uri?: string;               // 원격 URL (ADMIN 등록값, 이식 후 사용)
  };
  contents: CultureContentItem[];
}

export const MOCK_CULTURE_ACTIVITY: CultureActivityData = {
  activityNo: 30,
  typeLabel: 'Type 2 - 6단계: 문화 학습',
  typeLabelVi: 'Type 2 - Bước 6: Học văn hóa',
  title: '문화',
  titleVi: 'Văn hóa',
  heroMedia: { type: 'image', source: undefined },
  contents: [
    {
      activityQuestionNo: 1,
      icon: '🤝',
      title: '재미있는 한국의 상황별 인사말',
      titleVi: 'Những lời chào thú vị theo tình huống tại Hàn Quốc',
      pageRef: 'p35',
      description: '재미있는 인사말을 배워볼까요?',
      descriptionVi: 'Cùng học những lời chào thú vị nhé?',
      subItems: [
        {
          no: '01',
          title: '선물을 받았을 때',
          titleVi: 'Khi nhận quà',
          description: '선물을 받았을 때 한국 사람들은 고마움을 표현하고자 "고맙습니다.", "감사합니다."라고 인사합니다. 또 달고 미안한 마음을 "뭘 이런 걸 다..."라고도 표현합니다.',
          descriptionVi: 'Khi nhận quà, người Hàn Quốc thường nói "고맙습니다." hoặc "감사합니다." để bày tỏ lòng biết ơn. Họ cũng có thể nói "뭘 이런 걸 다..." để thể hiện sự ngại ngùng và cảm ơn.',
        },
        {
          no: '02',
          title: '전화를 끊을 때',
          titleVi: 'Khi kết thúc cuộc gọi',
          description: '헤어질 때 "안녕히 계세요.", "안녕히 가세요."라고 인사를 합니다. 하지만 전화를 끊을 때는 "그럼 들어가세요."라고 인사를 합니다.',
          descriptionVi: 'Khi chia tay, người Hàn Quốc nói "안녕히 계세요." hoặc "안녕히 가세요." Nhưng khi kết thúc cuộc gọi điện thoại, họ nói "그럼 들어가세요."',
        },
        {
          no: '03',
          title: '식사에 초대했을 때',
          titleVi: 'Khi mời ăn cơm',
          description: '집으로 초대한 손님에게 음식을 대접할 때 "차린 것은 없지만 많이 드세요."라고 겸손하게 인사합니다.',
          descriptionVi: 'Khi đãi khách tại nhà, người Hàn Quốc khiêm tốn nói "차린 것은 없지만 많이 드세요." (Không có gì nhiều nhưng mời ăn thoải mái).',
        },
        {
          no: '04',
          title: '중요한 일이 있을 때',
          titleVi: 'Khi có việc quan trọng',
          description: '시험을 보거나 면접을 보는 등 중요한 일이 있는 사람에게 "좋은 꿈 꿔!"라고 인사를 합니다. 한국에서는 좋은 꿈이 현실에 대한 예언이나 징조를 내포하고 있다고 여기는 전통적인 생각이 남아있기 때문입니다.',
          descriptionVi: 'Với người sắp thi hoặc phỏng vấn, người Hàn Quốc nói "좋은 꿈 꿔!" (Nằm mơ đẹp nhé!). Vì trong truyền thống Hàn Quốc, giấc mơ đẹp được coi là điềm lành cho những điều sắp diễn ra.',
        },
      ],
    },
  ],
};

// ────────────────────────────────────────────────────────────────
// 영상 브릿지 (VideoBridgeStage)
// Source A 참고: act01 / intro_video / PreviewVideo1
// ────────────────────────────────────────────────────────────────

export interface VideoBridgeData {
  activityNo: number;
  title: string;
  titleVi: string;
  // ADMIN 등록 원격 영상 URL. 미등록 시 프로토타입은 로컬 에셋으로 fallback.
  videoUri?: string;
  // 자막 SRT URL (선택). 미등록 시 자막 없음.
  subtitleUri?: string;
}

export const MOCK_VIDEO_BRIDGE: VideoBridgeData = {
  activityNo: 1,
  title: '오늘의 학습을 시작해볼까요?',
  titleVi: 'Hãy bắt đầu bài học hôm nay nhé!',
  // videoUri 미설정 → 프로토타입에서 로컬 MP4 에셋 사용
};

// ─── 설명 슬라이드 데이터 ────────────────────────────────────────────
// Source B (batchim-grammar-steps.html) 9단계 콘텐츠 기반 목업
// 이식 시: imageUri → ADMIN 등록 이미지 URL로 교체

export interface SlideItem {
  /** 로컬 require() 또는 { uri: string } — undefined 이면 플레이스홀더 표시 */
  image?: number | { uri: string };
  /** 이미지 하단 설명 텍스트 */
  text: string;
}

export interface SlideExplainData {
  activityNo: number;
  badge: string;
  title: string;
  slides: SlideItem[];
}

export const MOCK_SLIDE_EXPLAIN: SlideExplainData = {
  activityNo: 35,
  badge: '문법과 표현 1',
  title: '저는 N이에요/예요',
  slides: [
    {
      image: require('../../assets/14-sliders/slider-1.png'),
      text: "-이에요/-예요는 이름이나 국적 등을 말할 때 써요. '~이다'라는 뜻이고, 영어의 am/is/are와 비슷해요. 앞 단어에 받침이 있으면 -이에요, 받침이 없으면 -예요를 써요.",
    },
    {
      image: require('../../assets/14-sliders/slider-2.png'),
      text: '글자 밑에 빨간 표시를 보세요. 저게 "받침"이에요. 받침이 있는 글자도 있고, 없는 글자도 있어요.',
    },
    {
      image: require('../../assets/14-sliders/slider-3.png'),
      text: '위의 두 이름 중에서 받침이 있는 것은 무엇일까요? "유진", "타오"',
    },
    {
      image: require('../../assets/14-sliders/slider-4.png'),
      text: '"유진"은 받침이 있어요. "타오"는 받침이 없어요.',
    },
    {
      image: require('../../assets/14-sliders/slider-5.png'),
      text: '받침이 있으면 "-이에요"를 붙여요: 유진 + -이에요 = 유진이에요',
    },
    {
      image: require('../../assets/14-sliders/slider-6.png'),
      text: '문장으로 써볼까요? "안녕하세요? 저는 유진이에요."',
    },
    {
      image: require('../../assets/14-sliders/slider-7.png'),
      text: '받침이 없으면 "-예요"를 붙여요: 타오 + -예요 = 타오예요',
    },
    {
      image: require('../../assets/14-sliders/slider-8.png'),
      text: '문장으로 써볼까요? "반가워요. 저는 타오예요."',
    },
    {
      image: require('../../assets/14-sliders/slider-9.png'),
      text: '정리해요: 받침 있으면 "-이에요", 받침 없으면 "-예요"!',
    },
  ],
};

// ────────────────────────────────────────────────────────────────
// 말하기 상세 소개 데이터 (SpeakingDetailStage)
// 교재: 『ULIS Genie K 한국어 초급 1』 p.7 (말하기 구성), p.24 (말하기 1) 기반
// ────────────────────────────────────────────────────────────────

export interface DialogueLine {
  id: number;
  speaker: string;
  speakerRole?: string;
  textKo: string;
  textVi: string;
  isUserSpeaker?: boolean;
}

export interface SpeakingKeyTip {
  titleKo: string;
  titleVi: string;
  descKo: string;
  descVi: string;
}

export interface SpeakingDrillItem {
  no: number;
  name: string;
  country: string;
  countryVi: string;
  flagEmoji: string;
}

export interface SpeakingExplainData {
  activityNo: number;
  badgeKo: string;
  badgeVi: string;
  titleKo: string;
  titleVi: string;
  situation: {
    titleKo: string;
    titleVi: string;
    descKo: string;
    descVi: string;
  };
  dialogue: DialogueLine[];
  keyTips: SpeakingKeyTip[];
  drill: {
    instructionKo: string;
    instructionVi: string;
    items: SpeakingDrillItem[];
  };
}

export const MOCK_SPEAKING_EXPLAIN: SpeakingExplainData = {
  activityNo: 40,
  badgeKo: '말하기 1',
  badgeVi: 'Luyện nói 1',
  titleKo: '친구와 인사하고 국적을 물어봐요',
  titleVi: 'Chào hỏi và hỏi quốc tịch của bạn bè',
  situation: {
    titleKo: '새로운 친구와의 첫 만남',
    titleVi: 'Gặp gỡ người bạn mới',
    descKo: '흐엉과 민호가 처음 만나서 반갑게 인사하고 서로의 이름과 국적을 소개하는 상황이에요.',
    descVi: 'Hương và Minho lần đầu gặp nhau, vui vẻ chào hỏi và giới thiệu tên cũng như quốc tịch của nhau.',
  },
  dialogue: [
    {
      id: 1,
      speaker: '흐엉',
      speakerRole: '베트남 학생',
      textKo: '안녕하세요?',
      textVi: 'Xin chào?',
      isUserSpeaker: false,
    },
    {
      id: 2,
      speaker: '민호',
      speakerRole: '한국 친구',
      textKo: '안녕하세요? 저는 민호예요. 이름이 뭐예요?',
      textVi: 'Xin chào? Tôi là Minho. Bạn tên là gì?',
      isUserSpeaker: true,
    },
    {
      id: 3,
      speaker: '흐엉',
      speakerRole: '베트남 학생',
      textKo: '저는 흐엉이에요. 반가워요. 민호 씨, 어느 나라 사람이에요?',
      textVi: 'Tôi là Hương. Rất vui được gặp bạn. Minho, bạn là người nước nào?',
      isUserSpeaker: false,
    },
    {
      id: 4,
      speaker: '민호',
      speakerRole: '한국 친구',
      textKo: '저는 한국 사람이에요. 만나서 반가워요.',
      textVi: 'Tôi là người Hàn Quốc. Rất vui được gặp bạn.',
      isUserSpeaker: true,
    },
  ],
  keyTips: [
    {
      titleKo: '어느 나라 사람이에요?',
      titleVi: 'Bạn là người nước nào?',
      descKo: '상대방의 국적을 정중하게 물어볼 때 사용하는 핵심 표현이에요.',
      descVi: 'Mẫu câu cốt lõi dùng để hỏi quốc tịch của đối phương một cách lịch sự.',
    },
    {
      titleKo: "호칭 '씨'",
      titleVi: "Hậu tố xưng hô '씨'",
      descKo: '상대방의 이름 뒤에 붙여 존중과 예의를 표현해요. (예: 민호 씨, 흐엉 씨)',
      descVi: 'Gắn sau tên người để thể hiện sự tôn trọng và lịch sự (Anh, Chị, Bạn...).',
    },
  ],
  drill: {
    instructionKo: '그림을 보고 친구와 이야기해 보세요.',
    instructionVi: 'Hãy nhìn tranh và luyện nói cùng bạn nhé.',
    items: [
      {
        no: 1,
        name: '로빈',
        country: '캐나다 사람',
        countryVi: 'người Canada',
        flagEmoji: '🇨🇦',
      },
      {
        no: 2,
        name: '팅팅',
        country: '중국 사람',
        countryVi: 'người Trung Quốc',
        flagEmoji: '🇨🇳',
      },
    ],
  },
};

// ────────────────────────────────────────────────────────────────
// 읽고 쓰기 상세 소개 데이터 (ReadWriteDetailStage)
// 교재: 『ULIS Genie K 한국어 초급 1』 p.8 (읽고 쓰기 구성), p.31 (읽고 쓰기 1) 기반
// ────────────────────────────────────────────────────────────────

export interface ReadingKeyPoint {
  no: number;
  labelKo: string;
  labelVi: string;
  questionKo: string;
  questionVi: string;
}

export interface WritingFrameStep {
  step: number;
  titleKo: string;
  titleVi: string;
  exampleKo: string;
  exampleVi: string;
  slotGuideKo: string;
  slotGuideVi: string;
}

export interface ReadWriteExplainData {
  activityNo: number;
  badgeKo: string;
  badgeVi: string;
  titleKo: string;
  titleVi: string;
  preReading: {
    titleKo: string;
    titleVi: string;
    descKo: string;
    descVi: string;
    characterName: string;
    characterRole: string;
    characterRoleVi: string;
    clueQuestions: string[];
    clueQuestionsVi: string[];
  };
  readingPoints: ReadingKeyPoint[];
  writingFramework: {
    titleKo: string;
    titleVi: string;
    descKo: string;
    descVi: string;
    steps: WritingFrameStep[];
  };
}

export const MOCK_READ_WRITE_EXPLAIN: ReadWriteExplainData = {
  activityNo: 50,
  badgeKo: '읽고 쓰기',
  badgeVi: 'Đọc và viết',
  titleKo: '글을 읽고 나를 소개하는 글을 써요',
  titleVi: 'Đọc bài và viết bài tự giới thiệu bản thân',
  preReading: {
    titleKo: '읽기 전 유추하기',
    titleVi: 'Dự đoán trước khi đọc',
    descKo: '그림을 보고 어떤 사람이 쓴 글인지, 어떤 내용이 담겨 있을지 미리 생각해 봐요.',
    descVi: 'Hãy nhìn tranh và suy nghĩ trước xem bài viết của ai và có nội dung gì nhé.',
    characterName: '세나',
    characterRole: '한국어 선생님',
    characterRoleVi: 'Giáo viên tiếng Hàn',
    clueQuestions: [
      '세나 씨는 어느 나라 사람일까요?',
      '세나 씨의 직업은 무엇일까요?',
    ],
    clueQuestionsVi: [
      'Sena là người nước nào?',
      'Nghề nghiệp của Sena là gì?',
    ],
  },
  readingPoints: [
    {
      no: 1,
      labelKo: '이름 확인',
      labelVi: 'Xác nhận tên',
      questionKo: '글쓴이의 이름이 무엇인지 찾아봐요.',
      questionVi: 'Hãy tìm tên của người viết bài.',
    },
    {
      no: 2,
      labelKo: '국적 확인',
      labelVi: 'Xác nhận quốc tịch',
      questionKo: '어느 나라 사람인지 문장을 확인해요.',
      questionVi: 'Kiểm tra câu văn xem là người nước nào.',
    },
    {
      no: 3,
      labelKo: '직업 확인',
      labelVi: 'Xác nhận nghề nghiệp',
      questionKo: '어떤 일을 하는 사람인지 파악해요.',
      questionVi: 'Nắm bắt xem người đó làm công việc gì.',
    },
  ],
  writingFramework: {
    titleKo: '나만의 자기소개 글쓰기 프레임워크',
    titleVi: 'Khung tự giới thiệu bản thân',
    descKo: '읽은 글의 구조를 바탕으로 나를 소개하는 4단계 문장을 완성해 봐요.',
    descVi: 'Dựa trên cấu trúc bài đã đọc, hãy hoàn thành 4 câu tự giới thiệu nhé.',
    steps: [
      {
        step: 1,
        titleKo: '인사하기',
        titleVi: 'Chào hỏi',
        exampleKo: '안녕하세요?',
        exampleVi: 'Xin chào?',
        slotGuideKo: '반가운 인사말로 글을 시작해요.',
        slotGuideVi: 'Bắt đầu bài viết bằng lời chào vui vẻ.',
      },
      {
        step: 2,
        titleKo: '이름 소개',
        titleVi: 'Giới thiệu tên',
        exampleKo: '저는 세나예요. (저는 [이름]이에요/예요.)',
        exampleVi: 'Tôi là Sena. (Tôi là [Tên].)',
        slotGuideKo: '받침 여부에 맞춰 이에요/예요를 붙여요.',
        slotGuideVi: 'Gắn 이에요/예요 tùy thuộc vào phụ âm cuối.',
      },
      {
        step: 3,
        titleKo: '국적 & 직업 소개',
        titleVi: 'Giới thiệu quốc tịch & nghề nghiệp',
        exampleKo: '저는 한국 사람이에요. 저는 선생님이에요.',
        exampleVi: 'Tôi là người Hàn Quốc. Tôi là giáo viên.',
        slotGuideKo: '나의 나라와 직업 단어를 넣어 문장을 만들어요.',
        slotGuideVi: 'Điền quốc gia và nghề nghiệp của mình vào câu.',
      },
      {
        step: 4,
        titleKo: '끝인사',
        titleVi: 'Lời chào kết',
        exampleKo: '만나서 반가워요.',
        exampleVi: 'Rất vui được gặp bạn.',
        slotGuideKo: '친근한 마무리 인사로 글을 마쳐요.',
        slotGuideVi: 'Kết thúc bài viết bằng lời chào thân thiện.',
      },
    ],
  },
};

// ────────────────────────────────────────────────────────────────
// 듣고 말하기 상세 소개 데이터 (ListenSpeakDetailStage)
// 교재: 『ULIS Genie K 한국어 초급 1』 p.9 (듣고 말하기 구성), p.32 (듣고 말하기 1) 기반
// ────────────────────────────────────────────────────────────────

export interface ListeningCharacter {
  name: string;
  roleKo: string;
  roleVi: string;
  avatarEmoji: string;
  bgTag: string;
}

export interface ListeningMissionPoint {
  no: number;
  icon: string;
  titleKo: string;
  titleVi: string;
  descKo: string;
  descVi: string;
}

export interface SpeakingQuestionPreview {
  no: number;
  questionKo: string;
  questionVi: string;
  sampleAnswerKo: string;
  sampleAnswerVi: string;
}

export interface ListenSpeakExplainData {
  activityNo: number;
  badgeKo: string;
  badgeVi: string;
  titleKo: string;
  titleVi: string;
  situation: {
    titleKo: string;
    titleVi: string;
    descKo: string;
    descVi: string;
    characters: ListeningCharacter[];
  };
  audioTrack: {
    trackName: string;
    durationDescKo: string;
    durationDescVi: string;
  };
  listeningMission: {
    titleKo: string;
    titleVi: string;
    points: ListeningMissionPoint[];
  };
  speakingPreview: {
    titleKo: string;
    titleVi: string;
    descKo: string;
    descVi: string;
    questions: SpeakingQuestionPreview[];
  };
}

export const MOCK_LISTEN_SPEAK_EXPLAIN: ListenSpeakExplainData = {
  activityNo: 60,
  badgeKo: '듣고 말하기',
  badgeVi: 'Nghe và nói',
  titleKo: '대화를 듣고 질문에 답해요',
  titleVi: 'Nghe hội thoại và trả lời câu hỏi',
  situation: {
    titleKo: '민호와 유진의 첫 만남 대화',
    titleVi: 'Cuộc gặp gỡ đầu tiên giữa Minho và Yujin',
    descKo: '학교에서 민호와 유진이 처음 만나 인사를 나누고 서로의 이름과 국적을 이야기하는 음원이에요.',
    descVi: 'Đây là đoạn ghi âm Minho và Yujin lần đầu gặp nhau ở trường, chào hỏi và nói về tên cũng như quốc tịch.',
    characters: [
      {
        name: '민호',
        roleKo: '한국 친구',
        roleVi: 'Bạn Hàn Quốc',
        avatarEmoji: '👨‍🎓',
        bgTag: '한국 학생',
      },
      {
        name: '유진',
        roleKo: '외국인 유학생',
        roleVi: 'Du học sinh nước ngoài',
        avatarEmoji: '👩‍🎓',
        bgTag: '신입생',
      },
    ],
  },
  audioTrack: {
    trackName: 'Tr. 1',
    durationDescKo: '약 30초 대화 음원',
    durationDescVi: 'Đoạn hội thoại khoảng 30 giây',
  },
  listeningMission: {
    titleKo: '청취 집중 미션',
    titleVi: 'Nhiệm vụ tập trung khi nghe',
    points: [
      {
        no: 1,
        icon: '🏷️',
        titleKo: '인물의 이름 매칭',
        titleVi: 'Nối tên nhân vật',
        descKo: '각 사람이 누구인지 목소리와 이름을 연결해 봐요.',
        descVi: 'Hãy nối giọng nói với tên của từng người.',
      },
      {
        no: 2,
        icon: '🌍',
        titleKo: '국적 정보 파악',
        titleVi: 'Nắm bắt thông tin quốc tịch',
        descKo: '유진이 어느 나라 사람인지 주의 깊게 들어봐요.',
        descVi: 'Hãy lắng nghe xem Yujin là người nước nào nhé.',
      },
    ],
  },
  speakingPreview: {
    titleKo: '들으면서 말하기 미션 예고',
    titleVi: 'Xem trước nhiệm vụ luyện nói',
    descKo: '음원을 들은 후 아래 3가지 질문에 자신의 목소리로 대답하는 활동이 이어집니다.',
    descVi: 'Sau khi nghe, bạn sẽ trả lời 3 câu hỏi dưới đây bằng giọng nói của mình.',
    questions: [
      {
        no: 1,
        questionKo: '안녕하세요?',
        questionVi: 'Xin chào?',
        sampleAnswerKo: '안녕하세요! / 반갑습니다.',
        sampleAnswerVi: 'Xin chào! / Rất vui được gặp bạn.',
      },
      {
        no: 2,
        questionKo: '이름이 뭐예요?',
        questionVi: 'Bạn tên là gì?',
        sampleAnswerKo: '저는 [이름]이에요/예요.',
        sampleAnswerVi: 'Tôi là [Tên].',
      },
      {
        no: 3,
        questionKo: '어느 나라 사람이에요?',
        questionVi: 'Bạn là người nước nào?',
        sampleAnswerKo: '저는 [나라] 사람이에요.',
        sampleAnswerVi: 'Tôi là người [Quốc gia].',
      },
    ],
  },
};

// ────────────────────────────────────────────────────────────────
// 초급 맞춤형 활동 설명 데이터 (15-1, 16-1, 17-1)
// 초급 1 학습자의 인지 부하를 줄이고 시각적 직관성을 극대화한 단순화 데이터
// ────────────────────────────────────────────────────────────────

export const MOCK_SPEAKING_EASY = {
  badgeKo: '말하기',
  badgeVi: 'Luyện nói',
  titleKo: '친구와 이야기해요!',
  titleVi: 'Cùng trò chuyện với bạn nhé!',
  dialoguePairs: [
    {
      id: 1,
      speaker: '흐엉',
      avatar: '👩',
      textKo: '민호 씨, 어느 나라 사람이에요?',
      textVi: 'Minho, bạn là người nước nào?',
      isLeft: true,
    },
    {
      id: 2,
      speaker: '민호',
      avatar: '👨',
      textKo: '저는 한국 사람이에요.',
      textVi: 'Tôi là người Hàn Quốc.',
      isLeft: false,
    },
  ],
  substitutionDrill: {
    guideKo: '친구 이름을 넣어서 말해 봐요!',
    guideVi: 'Hãy thay tên và quốc tịch của bạn vào nhé!',
    items: [
      { id: 1, flag: '🇨🇦', name: '로빈', country: '캐나다', sentenceKo: '저는 캐나다 사람이에요.' },
      { id: 2, flag: '🇨🇳', name: '팅팅', country: '중국', sentenceKo: '저는 중국 사람이에요.' },
    ],
  },
  keyPointKo: '어느 나라 사람이에요? = Bạn là người nước nào?',
};

export const MOCK_READ_WRITE_EASY = {
  badgeKo: '읽고 쓰기',
  badgeVi: 'Đọc và viết',
  titleKo: '읽고 내 카드를 만들어요!',
  titleVi: 'Đọc và tạo thẻ của mình nhé!',
  readingCard: {
    titleKo: '세나의 자기소개',
    titleVi: 'Bài tự giới thiệu của Sena',
    avatar: '👩‍🏫',
    lines: [
      { ko: '안녕하세요? 저는 세나예요.', vi: 'Xin chào? Tôi là Sena.' },
      { ko: '저는 한국 사람이에요.', vi: 'Tôi là người Hàn Quốc.' },
      { ko: '저는 선생님이에요.', vi: 'Tôi là giáo viên.' },
    ],
  },
  writingCard: {
    titleKo: '내 카드 완성하기',
    titleVi: 'Hoàn thành thẻ của tôi',
    slots: [
      { labelKo: '이름', labelVi: 'Tên', placeholderKo: '저는 [ 흐엉 ]이에요.' },
      { labelKo: '국적', labelVi: 'Quốc tịch', placeholderKo: '저는 [ 베트남 ] 사람이에요.' },
      { labelKo: '직업', labelVi: 'Nghề nghiệp', placeholderKo: '저는 [ 학생 ]이에요.' },
    ],
  },
};

export const MOCK_LISTEN_SPEAK_EASY = {
  badgeKo: '듣고 말하기',
  badgeVi: 'Nghe và nói',
  titleKo: '듣고 말해 봐요!',
  titleVi: 'Cùng nghe và nói nhé!',
  step1Listening: {
    titleKo: '1. 귀 기울여 들어요 🎧',
    titleVi: '1. Lắng nghe thật kỹ 🎧',
    characters: [
      { name: '민호', flag: '🇰🇷', tagKo: '한국' },
      { name: '유진', flag: '🇻🇳', tagKo: '베트남' },
    ],
    missionKo: '누가 한국 사람인지 맞춰 봐요!',
    missionVi: 'Hãy đoán xem ai là người Hàn Quốc nhé!',
  },
  step2Speaking: {
    titleKo: '2. 마이크로 말해요 🎙️',
    titleVi: '2. Nói vào micro 🎙️',
    questionKo: '“어느 나라 사람이에요?”',
    questionVi: '“Bạn là người nước nào?”',
    answerGuideKo: '“저는 [ 베트남 ] 사람이에요!”',
    answerGuideVi: '“Tôi là người Việt Nam!”',
  },
};

// ────────────────────────────────────────────────────────────────
// A형: 15초 영상 시연형 데이터 (SpeakingVideoDemoStage)
// 한국어를 전혀 모르는 베트남인 초급자를 위한 숏폼 모션 비디오 데모 데이터
// ────────────────────────────────────────────────────────────────

export interface VideoActionStep {
  step: number;
  icon: string;
  actionKo: string;
  actionVi: string;
  tipKo: string;
  tipVi: string;
}

export interface SpeakingVideoDemoData {
  activityNo: number;
  badgeKo: string;
  badgeVi: string;
  titleKo: string;
  titleVi: string;
  videoSubtitleKo: string;
  videoSubtitleVi: string;
  actionSteps: VideoActionStep[];
  videoDurationText: string;
}

export const MOCK_SPEAKING_VIDEO_DEMO: SpeakingVideoDemoData = {
  activityNo: 70,
  badgeKo: '15초 영상 가이드',
  badgeVi: 'Video hướng dẫn 15s',
  titleKo: '영상으로 말하기 방법을 봐요!',
  titleVi: 'Xem cách luyện nói qua video!',
  videoSubtitleKo: '“어느 나라 사람이에요?” → 마이크 누르고 “저는 베트남 사람이에요” 말하기',
  videoSubtitleVi: '“Bạn là người nước nào?” → Bấm micro và nói “Tôi là người Việt Nam”',
  videoDurationText: '15s Demo',
  actionSteps: [
    {
      step: 1,
      icon: '👂',
      actionKo: '질문 듣기',
      actionVi: 'Nghe câu hỏi',
      tipKo: '친구가 묻는 질문을 잘 들어요.',
      tipVi: 'Lắng nghe câu hỏi của bạn bè.',
    },
    {
      step: 2,
      icon: '🎙️',
      actionKo: '마이크 터치',
      actionVi: 'Bấm micro',
      tipKo: '화면의 마이크 버튼을 눌러요.',
      tipVi: 'Bấm vào nút micro trên màn hình.',
    },
    {
      step: 3,
      icon: '🗣️',
      actionKo: '따라 말하기',
      actionVi: 'Nói theo mẫu',
      tipKo: '내 나라를 크게 말해요!',
      tipVi: 'Nói to quốc gia của mình!',
    },
  ],
};

// ────────────────────────────────────────────────────────────────
// B형: 음성 튜터 안내형 데이터 (SpeakingAudioTutorStage)
// ────────────────────────────────────────────────────────────────

export const MOCK_SPEAKING_AUDIO_TUTOR = {
  badgeKo: '음성 튜터 가이드',
  badgeVi: 'Hướng dẫn bằng giọng nói AI',
  titleKo: '튜터의 설명을 듣고 따라해요!',
  titleVi: 'Lắng nghe gia sư và nói theo nhé!',
  tutorSpeechKo: '안녕하세요! 이번 활동에서는 친구의 질문을 잘 듣고, 내 국적을 한국어로 말해보는 연습을 해요. 준비되었나요?',
  tutorSpeechVi: 'Xin chào! Trong bài học này, bạn sẽ lắng nghe câu hỏi của bạn bè và luyện nói quốc tịch của mình bằng tiếng Hàn nhé. Bạn đã sẵn sàng chưa?',
  guideChips: [
    { id: 1, icon: '🎧', titleKo: '1. 귀 기울이기', titleVi: '1. Lắng nghe', descKo: '질문을 들어요', descVi: 'Nghe câu hỏi' },
    { id: 2, icon: '🗣️', titleKo: '2. 입 열기', titleVi: '2. Mở miệng', descKo: '소리 내어 말해요', descVi: 'Nói thành tiếng' },
    { id: 3, icon: '🇻🇳', titleKo: '3. 내 나라 말하기', titleVi: '3. Nói quốc tịch', descKo: '베트남 사람이에요', descVi: 'người Việt Nam' },
  ],
};

// ────────────────────────────────────────────────────────────────
// C형: 3컷 시각 슬라이드형 데이터 (ReadWriteVisualSlideStage)
// ────────────────────────────────────────────────────────────────

export const MOCK_READ_WRITE_VISUAL_SLIDE = {
  badgeKo: '3컷 그림 가이드',
  badgeVi: 'Hướng dẫn 3 bước bằng tranh',
  titleKo: '그림으로 보는 읽고 쓰기!',
  titleVi: 'Xem cách đọc và viết qua tranh!',
  slides: [
    {
      step: 1,
      titleKo: '1. 새 친구 세나를 만나요',
      titleVi: '1. Gặp gỡ cô giáo Sena',
      emoji: '👩‍🏫',
      captionKo: '세나 선생님이 자신을 소개해요.',
      captionVi: 'Cô giáo Sena tự giới thiệu về mình.',
      audioTextVi: 'Cô giáo Sena giới thiệu bản thân.',
    },
    {
      step: 2,
      titleKo: '2. 소개글을 눈으로 읽어요',
      titleVi: '2. Đọc bài giới thiệu',
      emoji: '📖',
      captionKo: '이름과 나라를 확인해 봐요.',
      captionVi: 'Hãy tìm tên và quốc gia của cô giáo.',
      audioTextVi: 'Đọc tên và quốc tịch của cô giáo.',
    },
    {
      step: 3,
      titleKo: '3. 내 프로필 카드를 채워요',
      titleVi: '3. Điền thẻ của chính bạn',
      emoji: '✏️',
      captionKo: '나의 이름과 나라를 써 봐요!',
      captionVi: 'Hãy viết tên và quốc gia của bạn nhé!',
      audioTextVi: 'Viết tên và quốc gia của bạn vào thẻ.',
    },
  ],
};

// ────────────────────────────────────────────────────────────────
// D형: 1회 인터랙티브 체험형 데이터 (ListenSpeakInteractiveTryStage)
// ────────────────────────────────────────────────────────────────

export const MOCK_LISTEN_SPEAK_INTERACTIVE_TRY = {
  badgeKo: '1회 체험 튜토리얼',
  badgeVi: 'Trải nghiệm thử 1 lần',
  titleKo: '직접 눌러서 연습해 봐요!',
  titleVi: 'Bấm thử để luyện tập nhé!',
  step1: {
    guideKo: '먼저 스피커 버튼을 눌러 소리를 들어보세요!',
    guideVi: 'Trước tiên hãy bấm nút loa để nghe âm thanh nhé!',
    speakerTextKo: '“민호 씨, 어느 나라 사람이에요?”',
    speakerTextVi: '“Minho, bạn là người nước nào?”',
  },
  step2: {
    guideKo: '참 잘했어요! 이제 마이크를 눌러 대답해 보세요!',
    guideVi: 'Làm tốt lắm! Bây giờ hãy bấm micro để trả lời nhé!',
    sampleAnswerKo: '“저는 베트남 사람이에요!”',
    sampleAnswerVi: '“Tôi là người Việt Nam!”',
  },
  successBadge: {
    titleKo: '🎉 튜토리얼 완료! 준비 완료!',
    titleVi: '🎉 Hoàn thành thử nghiệm! Đã sẵn sàng!',
    descKo: '이제 실제 듣고 말하기 활동을 시작해 볼까요?',
    descVi: 'Bây giờ hãy bắt đầu bài học chính nhé!',
  },
};

// ────────────────────────────────────────────────────────────────
// 학습 Flow (완전한 학습 경로)
// ────────────────────────────────────────────────────────────────

export const LEARNING_FLOW = [
  { screenId: 'home', label: '1. 홈 화면 / 코스 안내', step: 1 },
  { screenId: 'mission-tutor', label: '2-1. 학습 미션(튜터)', step: 2 },
  { screenId: 'intro-word', label: '4-1. 학습소개(단어)', step: 3 },
  { screenId: 'word-intro-slides', label: '2-W. 단어 슬라이드', step: 4 },
  // 세트 1
  { screenId: 'set-wordbook-eval', label: '5-2. 단어장과 발음평가', step: 4, setNumber: 1 },
  { screenId: 'word-vn-ko-select-2', label: '29. 베트남어 단어 보고 한국어 선택', step: 6, setNumber: 1 },
  { screenId: 'listen-select-1', label: '28. 소리 듣고 단어 선택', step: 7, setNumber: 1 },
  { screenId: 'word-sound-1', label: '31. 단어를 보고 음원 선택', step: 8, setNumber: 1 },
  { screenId: 'word-letter-blank', label: '32. 소리를 듣고 빈칸 채우기', step: 9, setNumber: 1 },
  { screenId: 'set-complete', label: '33. 세트 학습 완료 (1/3)', step: 10, setNumber: 1 },
  // 세트 2
  { screenId: 'set-wordbook-eval-2', label: '5-2-2. 단어장과 발음평가', step: 11, setNumber: 2 },
  { screenId: 'word-vn-ko-select-2', label: '29. 베트남어 단어 보고 한국어 선택', step: 12, setNumber: 2 },
  { screenId: 'listen-select-1', label: '28. 소리 듣고 단어 선택', step: 13, setNumber: 2 },
  { screenId: 'word-sound-1', label: '31. 단어를 보고 음원 선택', step: 14, setNumber: 2 },
  { screenId: 'word-letter-blank', label: '32. 소리를 듣고 빈칸 채우기', step: 15, setNumber: 2 },
  { screenId: 'set-complete-2', label: '34. 세트 학습 완료 (2/3)', step: 16, setNumber: 2 },
  // 세트 3
  { screenId: 'set-wordbook-eval-3', label: '5-2-3. 단어장과 발음평가', step: 17, setNumber: 3 },
  { screenId: 'word-vn-ko-select-2', label: '29. 베트남어 단어 보고 한국어 선택', step: 18, setNumber: 3 },
  { screenId: 'listen-select-1', label: '28. 소리 듣고 단어 선택', step: 19, setNumber: 3 },
  { screenId: 'word-sound-1', label: '31. 단어를 보고 음원 선택', step: 20, setNumber: 3 },
  { screenId: 'word-letter-blank', label: '32. 소리를 듣고 빈칸 채우기', step: 21, setNumber: 3 },
  { screenId: 'set-complete-3', label: '35. 세트 학습 완료 (3/3)', step: 22, setNumber: 3 },
  { screenId: 'completion-celebration-vocab', label: '17-1. 완료 축하 화면(단어)', step: 23 },
  // 문법 학습
  { screenId: 'intro-tutor', label: '4-1. 학습 소개(문법과 표현)', step: 24 },
  { screenId: 'video-bridge', label: '13. 영상 브릿지', step: 25 },
  { screenId: 'slide-explain', label: '14. 설명 슬라이드', step: 26 },
  { screenId: 'intro-tutor-2', label: '4-1-2. 학습 소개(문법 퀴즈) - 문제를 풀면서 확인해요', step: 27 },
  { screenId: 'sentence-blank-1', label: '11. 문장 빈칸 채우기', step: 28 },
  { screenId: 'sentence-select-1', label: '14. 뜻에 맞는 문장 고르기', step: 29 },
  { screenId: 'sentence-build', label: '9. 문장 만들기 1', step: 30 },
  { screenId: 'sentence-build-2', label: '10. 문장 만들기 2', step: 31 },
  // 평가 인트로
  { screenId: 'intro-eval', label: '4-1-3. 학습 소개(실전 평가)', step: 32 },
  // 대화 실전
  { screenId: 'video-ai-tutor', label: '13-1. 영상과 AI튜터', step: 33 },
  { screenId: 'conversation-preview', label: '대화-1. 전체 대화 듣기', step: 34 },
  { screenId: 'completion-practice-listen', label: '완료-4. 실전 듣기 완료', step: 35 },
  { screenId: 'conversation-shadowing', label: '대화-2. 따라 말하기', step: 36 },
  { screenId: 'completion-practice-read', label: '완료-5. 실전 읽기 완료', step: 37 },
  { screenId: 'dialogue-listen-write', label: '대화-3. 실전 쓰기', step: 38 },
  { screenId: 'completion-practice-write', label: '완료-6. 실전 쓰기 완료', step: 39 },
  { screenId: 'practice-check', label: '대화-4. 실전 확인', step: 40 },
  { screenId: 'completion-practice-check', label: '완료-7. 실전 확인 완료', step: 41 },
  { screenId: 'completion-celebration-class', label: '완료-3. 완료 축하 화면(수업)', step: 42 },
  { screenId: 'learning-report', label: '24. 학습 리포트', step: 43 },
];

// ─── 단어 슬라이드 (Word Slides) ────────────────────────────────────────────
// kcho-dev API: 슬라이드 = question.listItems[] { itemValue(이미지URL), extra1(오디오URL), extra2(bubble.ko), extra3(bubble.vi), itemOrd }

export type WordSlideKind = 'intro' | 'quiz' | 'outro';

export interface WordSlideCard {
  ko: string;
  vi: string;
  image?: string;
}

export interface WordSlideEquation {
  left: string;
  slot: string;
  right: string;
}

export interface WordSlide {
  kind: WordSlideKind;
  audio: string;
  bubble: { ko: string; vi: string };
  showTutor: boolean;
  badge?: { ko: string; vi: string };
  // intro 전용
  title?: { ko: string; vi: string };
  cards?: WordSlideCard[];
  // quiz 전용
  question?: { ko: string; vi: string };
  choices?: string[];
  answer?: number;
  equation?: WordSlideEquation;
  // outro 전용
  image?: string;
  // 슬라이드 전체를 대체하는 이미지 (설정 시 IntroSlide/QuizSlide/OutroSlide 대신 표시)
  slideImage?: string;
}

export const MOCK_WORD_SLIDES: WordSlide[] = [
  {
    kind: 'intro',
    audio: require('../../assets/word-slides/word-intro-1.wav') as string,
    showTutor: true,
    slideImage: require('../../assets/word-slides/slide-1.png') as string,
    bubble: {
      ko: "'베트남'은 나라이고 '베트남 사람'은 국적을 나타내요. '베트남'에 '사람'을 붙이면 국적이 돼요.",
      vi: "'베트남' chỉ quốc gia và '베트남 사람' chỉ quốc tịch. Thêm '사람' vào tên nước là thành quốc tịch.",
    },
  },
  {
    kind: 'quiz',
    audio: require('../../assets/word-slides/word-intro-2.wav') as string,
    showTutor: true,
    slideImage: require('../../assets/word-slides/slide-2.png') as string,
    bubble: {
      ko: "다음 문제의 답을 맞춰 보세요. 정답이에요! '베트남'은 나라이고, '베트남 사람'은 국적을 나타내요.",
      vi: "Hãy thử trả lời câu hỏi tiếp theo. Chính xác! '베트남' là quốc gia, còn '베트남 사람' chỉ quốc tịch.",
    },
  },
  {
    kind: 'quiz',
    audio: require('../../assets/word-slides/word-intro-3.wav') as string,
    showTutor: true,
    slideImage: require('../../assets/word-slides/slide-3.png') as string,
    bubble: {
      ko: "다음 문제도 풀어 보세요. 맞았어요! 나라 이름(한국)에 '사람'을 붙이면 국적(한국 사람)을 나타낼 수 있어요.",
      vi: "Hãy thử câu tiếp theo. Đúng rồi! Thêm '사람' vào tên nước (한국) là thành quốc tịch (한국 사람).",
    },
  },
  {
    kind: 'outro',
    audio: require('../../assets/word-slides/word-intro-4.wav') as string,
    showTutor: true,
    slideImage: require('../../assets/word-slides/slide-4.png') as string,
    bubble: {
      ko: '훌륭해요! 이제 더 많은 단어를 배워봐요.',
      vi: 'Tuyệt vời! Bây giờ mình học thêm nhiều từ nữa nhé.',
    },
  },
];

// ────────────────────────────────────────────────────────────────
// 영상과 AI튜터 (VideoAITutorStage)
// kcho-dev API: videoUri, audioUri, bubbleKo, bubbleVi → question 필드로 교체
// ────────────────────────────────────────────────────────────────
export interface VideoAITutorData {
  badgeKo: string;
  badgeVi: string;
  bubbleKo: string;
  bubbleVi: string;
  videoUri?: string;
  audioUri?: string;
}

export const MOCK_VIDEO_AI_TUTOR: VideoAITutorData = {
  badgeKo: '실전 듣기',
  badgeVi: 'Nghe thực chiến',
  bubbleKo: '먼저, 오늘 배운 내용을 대화문을 통해 다시 한번 잘 들어보세요.',
  bubbleVi: 'Trước tiên, hãy nghe lại nội dung đã học hôm nay qua đoạn hội thoại nhé.',
};

// ────────────────────────────────────────────────────────────────
// AI튜터 설명 (AITutorDescStage)
// kcho-dev API: bubbleKo, bubbleVi, audioUri → question 필드로 교체
// ────────────────────────────────────────────────────────────────
export interface AITutorDescData {
  bubbleKo: string;
  bubbleVi: string;
  audioUri?: string;
}

export const MOCK_AI_TUTOR_DESC: AITutorDescData = {
  bubbleKo: '이번에는 한국어 자막과 함께 잘 들어보세요. 필요하면 베트남어 해석도 같이 볼 수 있어요.',
  bubbleVi: 'Lần này, hãy nghe kỹ cùng với phụ đề tiếng Hàn nhé. Nếu cần, bạn cũng có thể xem thêm bản dịch tiếng Việt.',
};

// ────────────────────────────────────────────────────────────────
// 대화문 액티비티 (ConversationPreviewStage / ConversationShadowingStage)
// kcho-dev API: activity.questions[].listItems.dialogue_content[]
// ────────────────────────────────────────────────────────────────
export interface ConversationLine {
  key: string;
  speaker: string;       // 화자명
  side: 'left' | 'right'; // 말풍선 정렬
  textKo: string;
  textVi: string;
  audioSrc?: string;     // 프로토타입: require() 결과 / kcho-dev: CDN URL
  avatarUri?: any;       // 화자 썸네일 이미지
}

export interface ConversationAiTutor {
  titleBadgeKo: string;
  titleBadgeVi: string;
  bubbleKo: string;
  bubbleVi: string;
  audioSrc: string;
}

export interface ConversationData {
  badgeKo: string;
  badgeVi: string;
  lines: ConversationLine[];
  aiTutor?: ConversationAiTutor; // 미등록 시 인트로 스킵
}

export const MOCK_CONVERSATION: ConversationData = {
  badgeKo: '대화 듣기',
  badgeVi: 'Nghe hội thoại',
  aiTutor: {
    titleBadgeKo: '실전 듣기',
    titleBadgeVi: 'Nghe thực chiến',
    bubbleKo: '이번에는 한국어 자막과 함께 잘 들어보세요. 필요하면 베트남어 해석도 같이 볼 수 있어요.',
    bubbleVi: 'Lần này hãy nghe kỹ cùng phụ đề tiếng Hàn. Nếu cần, bạn cũng có thể xem thêm bản dịch tiếng Việt.',
    audioSrc: require('../../assets/ai-dec/ai-dec-1.mp3') as string,
  },
  lines: [
    {
      key: 'line-1',
      speaker: '세나',
      side: 'left',
      textKo: '안녕하세요? 어느 나라 사람이에요?',
      textVi: 'Xin chào? Bạn là người nước nào vậy?',
      audioSrc: undefined,
      avatarUri: require('../../assets/WordVnKoSelect2/sena.png'),
    },
    {
      key: 'line-2',
      speaker: '유키',
      side: 'right',
      textKo: '만나서 반가워요. 저는 유키예요.',
      textVi: 'Rất vui được gặp bạn. Tôi là Yuki.',
      audioSrc: undefined,
      avatarUri: require('../../assets/WordVnKoSelect2/yuki.png'),
    },
    {
      key: 'line-3',
      speaker: '세나',
      side: 'left',
      textKo: '아, 그렇군요! 직업이 뭐예요?',
      textVi: 'À, vậy à! Bạn làm nghề gì vậy?',
      audioSrc: undefined,
      avatarUri: require('../../assets/WordVnKoSelect2/sena.png'),
    },
    {
      key: 'line-4',
      speaker: '유키',
      side: 'right',
      textKo: '저는 일본 사람이에요.',
      textVi: 'Tôi là người Nhật Bản.',
      audioSrc: undefined,
      avatarUri: require('../../assets/WordVnKoSelect2/yuki.png'),
    },
  ],
};

// ─── ConversationWritingStage ─────────────────────────────────────
// kcho-dev: dialogue_writing
export interface WritingWord {
  id: string;
  text: string;
  isPunctuation?: boolean; // true면 고정 텍스트 (사용자 입력 불필요)
}

export interface WritingLine {
  key: string;
  speaker: string;
  audioSrc?: string;
  textVi: string;
  words: WritingWord[];
}

export interface ConversationWritingData {
  instructionKo: string;
  instructionVi: string;
  lines: WritingLine[];
}

export const MOCK_CONVERSATION_WRITING: ConversationWritingData = {
  instructionKo: '대화문을 잘 듣고 써 보세요.',
  instructionVi: 'Nghe hội thoại và điền vào chỗ trống.',
  lines: [
    {
      key: 'wl-1',
      speaker: '세나',
      textVi: 'Xin chào? Bạn là người nước nào vậy?',
      words: [
        { id: 'w1-1', text: '안녕하세요' },
        { id: 'w1-2', text: '?', isPunctuation: true },
        { id: 'w1-3', text: '어느' },
        { id: 'w1-4', text: '나라' },
        { id: 'w1-5', text: '사람이에요' },
        { id: 'w1-6', text: '?', isPunctuation: true },
      ],
    },
    {
      key: 'wl-2',
      speaker: '민준',
      textVi: 'Tôi là người Việt Nam.',
      words: [
        { id: 'w2-1', text: '저는' },
        { id: 'w2-2', text: '베트남' },
        { id: 'w2-3', text: '사람이에요' },
        { id: 'w2-4', text: '.', isPunctuation: true },
      ],
    },
    {
      key: 'wl-3',
      speaker: '세나',
      textVi: 'À, vậy à! Bạn làm nghề gì vậy?',
      words: [
        { id: 'w3-1', text: '아' },
        { id: 'w3-2', text: ',', isPunctuation: true },
        { id: 'w3-3', text: '그렇군요' },
        { id: 'w3-4', text: '!', isPunctuation: true },
        { id: 'w3-5', text: '직업이' },
        { id: 'w3-6', text: '뭐예요' },
        { id: 'w3-7', text: '?', isPunctuation: true },
      ],
    },
    {
      key: 'wl-4',
      speaker: '민준',
      textVi: 'Tôi là nhân viên công ty.',
      words: [
        { id: 'w4-1', text: '저는' },
        { id: 'w4-2', text: '회사원이에요' },
        { id: 'w4-3', text: '.', isPunctuation: true },
      ],
    },
  ],
};

// ─── ConversationChoiceStage ──────────────────────────────────────
// kcho-dev: dialogue_choice (templateCd 임시값)
export interface TextSegment { type: 'text'; value: string; }
export interface BlankSegment {
  type: 'blank';
  id: string;
  options: [string, string];
  answerIndex: 0 | 1;
}
export type ChoiceSegment = TextSegment | BlankSegment;

export interface ChoiceLine {
  key: string;
  speaker: 'A' | 'B';
  segments: ChoiceSegment[];
}

export interface ChoiceQuestion {
  key: string;
  lines: ChoiceLine[];
}

export interface ConversationChoiceData {
  badgeKo: string;
  badgeVi: string;
  instructionKo: string;
  instructionVi: string;
  questions: ChoiceQuestion[];
}

export const MOCK_CONVERSATION_CHOICE: ConversationChoiceData = {
  badgeKo: '실전 확인',
  badgeVi: 'Kiểm tra thực tế',
  instructionKo: '알맞은 답을 골라 대화를 완성하세요.',
  instructionVi: 'Hãy điền từ thích hợp vào chỗ trống để hoàn thành đoạn hội thoại.',
  questions: [
    // 1/3
    {
      key: 'q1',
      lines: [
        {
          key: 'q1-l1', speaker: 'A',
          segments: [
            { type: 'text', value: '안녕하세요? 저는 레오' },
            { type: 'blank', id: 'q1-b1', options: ['예요', '이에요'], answerIndex: 0 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'q1-l2', speaker: 'A',
          segments: [
            { type: 'text', value: '저는 미국 사람' },
            { type: 'blank', id: 'q1-b2', options: ['예요', '이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'q1-l3', speaker: 'B',
          segments: [
            { type: 'text', value: '만나서 반가워요. 저는 로빈' },
            { type: 'blank', id: 'q1-b3', options: ['예요', '이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'q1-l4', speaker: 'B',
          segments: [
            { type: 'text', value: '저는 캐나다 사람' },
            { type: 'blank', id: 'q1-b4', options: ['예요', '이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
      ],
    },
    // 2/3
    {
      key: 'q2',
      lines: [
        {
          key: 'q2-l1', speaker: 'A',
          segments: [
            { type: 'text', value: '안녕하세요? 저는 유키' },
            { type: 'blank', id: 'q2-b1', options: ['예요', '이에요'], answerIndex: 0 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'q2-l2', speaker: 'A',
          segments: [
            { type: 'text', value: '저는 일본 사람' },
            { type: 'blank', id: 'q2-b2', options: ['이에요', '예요'], answerIndex: 0 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'q2-l3', speaker: 'B',
          segments: [
            { type: 'text', value: '만나서 반가워요. 저는 왕타오' },
            { type: 'blank', id: 'q2-b3', options: ['예요', '이에요'], answerIndex: 0 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'q2-l4', speaker: 'B',
          segments: [
            { type: 'text', value: '저는 ' },
            { type: 'blank', id: 'q2-b4', options: ['중국이에요', '중국 사람이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
      ],
    },
    // 3/3
    {
      key: 'q3',
      lines: [
        {
          key: 'q3-l1', speaker: 'A',
          segments: [
            { type: 'text', value: '안녕하세요? 저는 ' },
            { type: 'blank', id: 'q3-b1', options: ['하리', '하린'], answerIndex: 1 },
            { type: 'text', value: ' 이에요.' },
          ],
        },
        {
          key: 'q3-l2', speaker: 'A',
          segments: [
            { type: 'text', value: '저는 ' },
            { type: 'blank', id: 'q3-b2', options: ['베트남', '베트남 사람'], answerIndex: 1 },
            { type: 'text', value: ' 이에요.' },
          ],
        },
        {
          key: 'q3-l3', speaker: 'B',
          segments: [
            { type: 'text', value: '만나서 반가워요. 저는 ' },
            { type: 'blank', id: 'q3-b3', options: ['수지', '수진'], answerIndex: 1 },
            { type: 'text', value: ' 예요.' },
          ],
        },
        {
          key: 'q3-l4', speaker: 'B',
          segments: [
            { type: 'text', value: '저는 ' },
            { type: 'blank', id: 'q3-b4', options: ['한국', '한국 사람'], answerIndex: 1 },
            { type: 'text', value: ' 이에요.' },
          ],
        },
      ],
    },
  ],
};

// ─── DialogueListenWriteStage 데이터 ──────────────────────────────────────────

export interface DialogueWriteLine {
  key: string;
  speakerSide: 'A' | 'B';
  speaker: string;
  textKo: string;   // 한국어 전체 문장 (단어 박스 + 힌트에 사용)
  textVi: string;
  audioSrc?: string;
}

export interface DialogueListenWriteData {
  instructionKo: string;
  instructionVi: string;
  lines: DialogueWriteLine[];
  aiTutor?: ConversationAiTutor;
}

export const MOCK_DIALOGUE_LISTEN_WRITE: DialogueListenWriteData = {
  instructionKo: '대화문을 잘 듣고 써 보세요.',
  instructionVi: 'Hãy nghe kỹ hội thoại và viết lại.',
  aiTutor: {
    titleBadgeKo: '실전 쓰기',
    titleBadgeVi: 'Viết thực chiến',
    bubbleKo: '잘하고 있어요! 이제 대화문을 잘 듣고 키보드를 이용해 직접 써보세요.',
    bubbleVi: 'Bạn đang làm rất tốt! Hãy nghe kỹ hội thoại và tự gõ bàn phím nhé.',
    audioSrc: require('../../assets/ai-dec/ai-dec-1.mp3') as string,
  },
  lines: [
    {
      key: 'dlw-l1',
      speakerSide: 'A',
      speaker: '하영',
      textKo: '안녕하세요? 저는 하영이에요.',
      textVi: 'Xin chào. Tôi là Ha-young.',
      audioSrc: require('../../assets/sounds/hayoung-1.mp3') as string,
    },
    {
      key: 'dlw-l2',
      speakerSide: 'A',
      speaker: '하영',
      textKo: '저는 한국 사람이에요.',
      textVi: 'Tôi là người Hàn Quốc.',
      audioSrc: require('../../assets/sounds/korea-1.mp3') as string,
    },
    {
      key: 'dlw-l3',
      speakerSide: 'B',
      speaker: '유키',
      textKo: '만나서 반가워요. 저는 유키예요.',
      textVi: 'Rất vui được gặp bạn. Tôi là Yuki.',
      audioSrc: require('../../assets/sounds/yuki-1.mp3') as string,
    },
    {
      key: 'dlw-l4',
      speakerSide: 'B',
      speaker: '유키',
      textKo: '저는 일본 사람이에요.',
      textVi: 'Tôi là người Nhật Bản.',
      audioSrc: require('../../assets/sounds/yuki-2.mp3') as string,
    },
  ],
};

// ─── PracticeCheckStage 데이터 (실전 확인) ────────────────────────────────────

export interface PracticeCheckBlank {
  options: string[];
  answer: string;
}
export type PracticeCheckPart = string | PracticeCheckBlank;

export interface PracticeCheckLine {
  speakerSide: 'A' | 'B';
  parts: PracticeCheckPart[];
}

export interface PracticeCheckScreen {
  lines: PracticeCheckLine[];
}

export interface PracticeCheckData {
  titleKo: string;
  titleVi: string;
  screens: PracticeCheckScreen[];
}

export const MOCK_PRACTICE_CHECK: PracticeCheckData = {
  titleKo: '알맞은 답을 골라 대화를 완성하세요.',
  titleVi: 'Hãy điền từ thích hợp vào chỗ trống để hoàn thành đoạn hội thoại.',
  screens: [
    {
      lines: [
        { speakerSide: 'A', parts: ['안녕하세요? 저는 레오 ', { options: ['예요', '이에요'], answer: '예요' }, '.'] },
        { speakerSide: 'A', parts: ['저는 미국 사람 ', { options: ['예요', '이에요'], answer: '이에요' }, '.'] },
        { speakerSide: 'B', parts: ['만나서 반가워요. 저는 로빈 ', { options: ['예요', '이에요'], answer: '이에요' }, '.'] },
        { speakerSide: 'B', parts: ['저는 캐나다 사람 ', { options: ['예요', '이에요'], answer: '이에요' }, '.'] },
      ],
    },
    {
      lines: [
        { speakerSide: 'A', parts: ['안녕하세요? 저는 유키 ', { options: ['에요', '예요'], answer: '예요' }, '.'] },
        { speakerSide: 'A', parts: ['저는 일본 사람 ', { options: ['이에요', '이예요'], answer: '이에요' }, '.'] },
        { speakerSide: 'B', parts: ['만나서 반가워요. 저는 왕타오 ', { options: ['에요', '예요'], answer: '예요' }, '.'] },
        { speakerSide: 'B', parts: ['저는 ', { options: ['중국이에요', '중국 사람이에요'], answer: '중국 사람이에요' }, '.'] },
      ],
    },
    {
      lines: [
        { speakerSide: 'A', parts: ['안녕하세요? 저는 ', { options: ['하리', '하린'], answer: '하린' }, ' 이에요.'] },
        { speakerSide: 'A', parts: ['저는 ', { options: ['베트남', '베트남 사람'], answer: '베트남 사람' }, ' 이에요.'] },
        { speakerSide: 'B', parts: ['만나서 반가워요. 저는 ', { options: ['수지', '수진'], answer: '수지' }, ' 예요.'] },
        { speakerSide: 'B', parts: ['저는 ', { options: ['한국', '한국 사람'], answer: '한국 사람' }, ' 이에요.'] },
      ],
    },
  ],
};

// ─── ConversationDictationStage 데이터 (받아쓰기 + 대화문 완성 통합) ──────────────

// 받아쓰기 라인 (side 포함 — A=teal, B=amber)
export interface DictationWriteLine {
  key: string;
  side: 'A' | 'B';
  speaker: string;
  audioSrc?: string;
  textVi: string;
  words: WritingWord[];
}

// 통합 데이터 타입
export interface ConversationDictationData {
  // Phase 1 — 받아쓰기
  instructionWriteKo: string;
  instructionWriteVi: string;
  writeLines: DictationWriteLine[];
  // Phase 2 — 대화문 완성
  badgeKo: string;
  badgeVi: string;
  instructionChoiceKo: string;
  instructionChoiceVi: string;
  choiceQuestions: ChoiceQuestion[];
}

export const MOCK_CONVERSATION_DICTATION: ConversationDictationData = {
  instructionWriteKo: '대화문을 잘 듣고 써 보세요.',
  instructionWriteVi: 'Hãy nghe kỹ hội thoại và viết lại.',
  writeLines: [
    {
      key: 'wd-a1', side: 'A', speaker: '하영',
      textVi: 'Xin chào. Tôi là 하영.',
      words: [
        { id: 'wd-a1-1', text: '안녕하세요' },
        { id: 'wd-a1-p1', text: '?', isPunctuation: true },
        { id: 'wd-a1-2', text: '저는' },
        { id: 'wd-a1-3', text: '하영이에요' },
        { id: 'wd-a1-p2', text: '.', isPunctuation: true },
      ],
    },
    {
      key: 'wd-a2', side: 'A', speaker: '하영',
      textVi: 'Tôi là người Hàn Quốc.',
      words: [
        { id: 'wd-a2-1', text: '저는' },
        { id: 'wd-a2-2', text: '한국' },
        { id: 'wd-a2-3', text: '사람이에요' },
        { id: 'wd-a2-p1', text: '.', isPunctuation: true },
      ],
    },
    {
      key: 'wd-b1', side: 'B', speaker: '유키',
      textVi: 'Rất vui được gặp bạn. Tôi là 유키.',
      words: [
        { id: 'wd-b1-1', text: '만나서' },
        { id: 'wd-b1-2', text: '반가워요' },
        { id: 'wd-b1-p1', text: '.', isPunctuation: true },
        { id: 'wd-b1-3', text: '저는' },
        { id: 'wd-b1-4', text: '유키예요' },
        { id: 'wd-b1-p2', text: '.', isPunctuation: true },
      ],
    },
    {
      key: 'wd-b2', side: 'B', speaker: '유키',
      textVi: 'Tôi là người Nhật Bản.',
      words: [
        { id: 'wd-b2-1', text: '저는' },
        { id: 'wd-b2-2', text: '일본' },
        { id: 'wd-b2-3', text: '사람이에요' },
        { id: 'wd-b2-p1', text: '.', isPunctuation: true },
      ],
    },
  ],
  badgeKo: '실전 확인',
  badgeVi: 'Kiểm tra thực tế',
  instructionChoiceKo: '알맞은 답을 골라 대화를 완성하세요.',
  instructionChoiceVi: 'Hãy điền từ thích hợp vào chỗ trống để hoàn thành đoạn hội thoại.',
  choiceQuestions: [
    {
      key: 'dq1',
      lines: [
        {
          key: 'dq1-l1', speaker: 'A',
          segments: [
            { type: 'text', value: '안녕하세요? 저는 레오 ' },
            { type: 'blank', id: 'dq1-b1', options: ['예요', '이에요'], answerIndex: 0 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'dq1-l2', speaker: 'A',
          segments: [
            { type: 'text', value: '저는 미국 사람 ' },
            { type: 'blank', id: 'dq1-b2', options: ['예요', '이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'dq1-l3', speaker: 'B',
          segments: [
            { type: 'text', value: '만나서 반가워요. 저는 로빈 ' },
            { type: 'blank', id: 'dq1-b3', options: ['예요', '이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'dq1-l4', speaker: 'B',
          segments: [
            { type: 'text', value: '저는 캐나다 사람 ' },
            { type: 'blank', id: 'dq1-b4', options: ['예요', '이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
      ],
    },
    {
      key: 'dq2',
      lines: [
        {
          key: 'dq2-l1', speaker: 'A',
          segments: [
            { type: 'text', value: '안녕하세요? 저는 유키 ' },
            { type: 'blank', id: 'dq2-b1', options: ['에요', '예요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'dq2-l2', speaker: 'A',
          segments: [
            { type: 'text', value: '저는 일본 사람 ' },
            { type: 'blank', id: 'dq2-b2', options: ['이에요', '이예요'], answerIndex: 0 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'dq2-l3', speaker: 'B',
          segments: [
            { type: 'text', value: '만나서 반가워요. 저는 왕타오 ' },
            { type: 'blank', id: 'dq2-b3', options: ['에요', '예요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
        {
          key: 'dq2-l4', speaker: 'B',
          segments: [
            { type: 'text', value: '저는 ' },
            { type: 'blank', id: 'dq2-b4', options: ['중국이에요', '중국 사람이에요'], answerIndex: 1 },
            { type: 'text', value: '.' },
          ],
        },
      ],
    },
    {
      key: 'dq3',
      lines: [
        {
          key: 'dq3-l1', speaker: 'A',
          segments: [
            { type: 'text', value: '안녕하세요? 저는 ' },
            { type: 'blank', id: 'dq3-b1', options: ['하리', '하린'], answerIndex: 1 },
            { type: 'text', value: ' 이에요.' },
          ],
        },
        {
          key: 'dq3-l2', speaker: 'A',
          segments: [
            { type: 'text', value: '저는 ' },
            { type: 'blank', id: 'dq3-b2', options: ['베트남', '베트남 사람'], answerIndex: 1 },
            { type: 'text', value: ' 이에요.' },
          ],
        },
        {
          key: 'dq3-l3', speaker: 'B',
          segments: [
            { type: 'text', value: '만나서 반가워요. 저는 ' },
            { type: 'blank', id: 'dq3-b3', options: ['수지', '수진'], answerIndex: 1 },
            { type: 'text', value: ' 예요.' },
          ],
        },
        {
          key: 'dq3-l4', speaker: 'B',
          segments: [
            { type: 'text', value: '저는 ' },
            { type: 'blank', id: 'dq3-b4', options: ['한국', '한국 사람'], answerIndex: 1 },
            { type: 'text', value: ' 이에요.' },
          ],
        },
      ],
    },
  ],
};

// ─── ConversationShadowingStage 전용 Mock ────────────────────────────────────
// 대화-2 따라 말하기: 첫 번째 문항에서만 AI 튜터 인트로 노출
export const MOCK_CONVERSATION_SHADOWING: ConversationData = {
  ...MOCK_CONVERSATION,
  aiTutor: {
    titleBadgeKo: '실전 읽기',
    titleBadgeVi: 'Đọc thực chiến',
    bubbleKo: '정말 잘했어요! 이제 대화문을 보고 마이크 버튼을 누른 후 따라 읽어보세요.',
    bubbleVi: 'Thật tuyệt! Hãy nhìn vào hội thoại, nhấn nút micro và đọc theo nhé.',
    audioSrc: require('../../assets/ai-dec/ai-dec-1.mp3') as string,
  },
  lines: [
    { ...MOCK_CONVERSATION.lines[0], audioSrc: require('../../assets/sounds/con-1.mp3') as string },
    { ...MOCK_CONVERSATION.lines[1], audioSrc: require('../../assets/sounds/con-2.mp3') as string },
    { ...MOCK_CONVERSATION.lines[2], audioSrc: require('../../assets/sounds/con-3.mp3') as string },
    { ...MOCK_CONVERSATION.lines[3], audioSrc: require('../../assets/sounds/con-4.mp3') as string },
  ],
};


