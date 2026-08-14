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
    titleVi: 'Hãy xem từ vựng về quốc gia và quốc tịch',
    subtitle: '단어를 하나씩 눈으로 확인하고 소리 내어 읽어봐요.',
    subtitleVi: 'Hãy nhìn từng từ bằng mắt và đọc to lên.',
    achievement: {
      label: '학습 성과',
      labelVi: 'Kết quả học tập',
      desc: '나라와 국적 단어 15개를 알아볼 수 있어요.',
      descVi: 'Bạn có thể tìm hiểu 15 từ vựng về quốc gia và quốc tịch.',
    },
  },
  intro2: {
    badge: '문법과 표현',
    badgeVi: 'Ngữ pháp và biểu đạt',
    speech: '지금부터 문법을\n함께 배워볼 거예요!',
    speechVi: 'Từ bây giờ chúng ta sẽ\ncùng nhau học ngữ pháp nhé!',
    achievement: {
      label: '학습 성과',
      labelVi: 'Kết quả học tập',
      desc: '이에요/예요 문법 규칙을 이해하고 활용할 수 있어요.',
      descVi: 'Bạn có thể hiểu và sử dụng quy tắc ngữ pháp 이에요/예요.',
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
      vi: 'Tuân là người Việt Nam.',
      ko: '튀안은 베트남 사람이에요.',
      answerWords: ['튀안은', '베트남', '사람이에요'],
      distractors: ['한국', '기자예요'],
    },
    {
      id: 2,
      vi: 'Tôi là người Hàn Quốc.',
      ko: '저는 한국 사람이에요.',
      answerWords: ['저는', '한국', '사람이에요'],
      distractors: ['베트남', '의사예요'],
    },
    {
      id: 3,
      vi: 'Cô ấy là phóng viên.',
      ko: '그녀는 기자예요.',
      answerWords: ['그녀는', '기자예요'],
      distractors: ['의사예요', '학생이에요'],
    },
    {
      id: 4,
      vi: 'Anh ấy là bác sĩ.',
      ko: '그는 의사예요.',
      answerWords: ['그는', '의사예요'],
      distractors: ['기자예요', '한국'],
    },
    {
      id: 5,
      vi: 'Minjeong là học sinh.',
      ko: '민정 씨는 학생이에요.',
      answerWords: ['민정 씨는', '학생이에요'],
      distractors: ['의사예요', '베트남'],
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
  nextLabel: '2차시 시작하기',
  nextLabelVi: 'Bắt đầu bài 2',
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

