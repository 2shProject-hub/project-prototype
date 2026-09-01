/**
 * 에뮬레이터 쉘 — 웹 전용 (Platform.OS === 'web')
 * 구성: 좌측 컨트롤 패널 | 중앙 디바이스 프레임 | 우측 정보 패널
 */
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { colors } from '../theme/colors';
import { LangProvider } from '../components/LangContext';
import { SCREEN_REGISTRY, getScreen } from './screenRegistry';
import { ThemeProvider, useTheme } from '../theme/ThemeContext';
import { ThemeGalleryScreen } from '../screens/ThemeGalleryScreen';
import { applyThemeToDom } from '../theme/applyThemeToDom';
import { themeAssets } from '../theme/themeAssets';
import type { Theme } from '../theme/themeTypes';

// 화면 컴포넌트 임포트
import { HomeScreen } from '../screens/HomeScreen';
import { MissionTutorStage } from '../screens/MissionTutorStage';
import { IntroTutorStage } from '../screens/IntroTutorStage';
import { IntroEvalStage } from '../screens/IntroEvalStage';
import { WordBuildStage } from '../screens/WordBuildStage';
import { SentenceBuildStage } from '../screens/SentenceBuildStage';
import { SentenceBuildStage2 } from '../screens/SentenceBuildStage2';
import { VocabWordbookVoiceStage } from '../screens/VocabWordbookVoiceStage';
import { SetWordbookEvalStage } from '../screens/SetWordbookEvalStage';
import { GrammarDetailStage } from '../screens/GrammarDetailStage';
import { QuickReviewStage } from '../screens/QuickReviewStage';
import { CultureStage } from '../screens/CultureStage';
import { WordDetailStage } from '../screens/WordDetailStage';
import { VideoBridgeStage } from '../screens/VideoBridgeStage';
import { SlideExplainStage } from '../screens/SlideExplainStage';
import { ListenSelect1 } from '../screens/ListenSelect1';
import { WordVnKoSelect2 } from '../screens/WordVnKoSelect2';
import { WordSound1 } from '../screens/WordSound1';
import { WordLetterBlank } from '../screens/WordLetterBlank';
import { SetCompleteStage } from '../screens/SetCompleteStage';
import { SentenceBlank1 } from '../screens/SentenceBlank1';
import { WordBlank1 } from '../screens/WordBlank1';
import { ListenTyping1 } from '../screens/ListenTyping1';
import { SentenceSelect1 } from '../screens/SentenceSelect1';
import { SpeakingEvalStage } from '../screens/SpeakingEvalStage';
import { LearningReportStage } from '../screens/LearningReportStage';
import { PracticalSpeakingStage } from '../screens/PracticalSpeakingStage';
import { CompletionCelebrationVocabStage } from '../screens/CompletionCelebrationVocabStage';
import { CompletionCelebrationGrammarStage } from '../screens/CompletionCelebrationGrammarStage';
import { CompletionCelebrationClassStage } from '../screens/CompletionCelebrationClassStage';
import { WordIntroSlidesStage } from '../screens/WordIntroSlidesStage';
import { VideoAITutorStage } from '../screens/VideoAITutorStage';
import { AITutorDescStage } from '../screens/AITutorDescStage';
import { ConversationPreviewStage } from '../screens/ConversationPreviewStage';
import { ConversationShadowingStage } from '../screens/ConversationShadowingStage';
import DialogueListenWriteStage from '../screens/DialogueListenWriteStage';
import PracticeCheckStage from '../screens/PracticeCheckStage';
import { defaultSessionState, LEARNING_FLOW } from '../data/lessonData';
import { useLang, pick, type Lang } from '../components/LangContext';

// ─── 디바이스 프리셋 ───────────────────────────────────────────────
const DEVICES = [
  { id: 'iphone15', label: 'iPhone 15', os: 'iOS', w: 390, h: 844 },
  { id: 'iphone-se', label: 'iPhone SE', os: 'iOS', w: 375, h: 667 },
  { id: 'android-std', label: 'Android 표준', os: 'AOS', w: 360, h: 800 },
  { id: 'android-budget', label: '보급형 Android', os: 'AOS', w: 360, h: 640 },
  { id: 'android-lg', label: 'Android 대형', os: 'AOS', w: 412, h: 917 },
];

// ─── 화면 → 컴포넌트 렌더러 ────────────────────────────────────────
// 브랜드 자산 테마: 화면마다 다른 캐릭터가 응원 말풍선과 함께 우하단에서 빼꼼 (터치 통과).
// 자체 캐릭터가 있는 화면(홈·5-2·세트완료·축하)과 튜터 아바타·화자 썸네일이 있는 화면은 제외 —
// 캐릭터가 아바타를 가리면 안 된다.
const STICKER_EXCLUDE = new Set([
  'home', 'mission-tutor', 'intro-tutor', 'intro-tutor-2', 'intro-eval',
  'video-ai-tutor', 'ai-tutor-desc', 'conversation-preview', 'conversation-shadowing',
  'dialogue-listen-write', 'practice-check', 'word-intro-slides', 'grammar-detail',
  'vocab-wordbook-voice',
]);
const CHEERS: Array<[string, string]> = [
  ['잘하고 있어요!', 'Bạn đang làm rất tốt!'],
  ['조금만 더 힘내요!', 'Cố lên chút nữa nhé!'],
  ['오늘도 화이팅!', 'Hôm nay cũng cố lên!'],
  ['멋져요, 바로 그거예요!', 'Tuyệt lắm, chính là như vậy!'],
  ['천천히 해도 괜찮아요', 'Từ từ cũng không sao đâu'],
  ['거의 다 왔어요!', 'Sắp xong rồi!'],
];
function ScreenSticker({ theme, enabled, screenId }: { theme: Theme; enabled: boolean; screenId: string }) {
  const { lang } = useLang();
  const stickers = enabled ? themeAssets(theme.id)?.stickers : undefined;
  if (!stickers || !stickers.length) return null;
  if (STICKER_EXCLUDE.has(screenId) || screenId.startsWith('set-') || screenId.startsWith('completion-')) return null;
  let h = 0;
  for (let i = 0; i < screenId.length; i++) h = (h * 31 + screenId.charCodeAt(i)) >>> 0;
  const st = stickers[h % stickers.length];
  const cheer = CHEERS[h % CHEERS.length];
  const c = theme.colors;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', right: 2, bottom: 88, alignItems: 'flex-end' }}>
      {/* 응원 말풍선 */}
      <View style={{ maxWidth: 190, marginRight: st.w - 14, marginBottom: -6 }}>
        <View
          style={{
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.line,
            borderRadius: 14,
            paddingHorizontal: 11,
            paddingVertical: 7,
            shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ fontSize: 12, color: c.ink, fontWeight: '600' }}>{pick(lang, cheer[0], cheer[1])}</Text>
        </View>
        {/* 꼬리 */}
        <View
          style={{
            alignSelf: 'flex-end', marginRight: 10, marginTop: -1,
            width: 10, height: 10, backgroundColor: c.surface,
            borderRightWidth: 1, borderBottomWidth: 1, borderColor: c.line,
            transform: [{ rotate: '45deg' }],
          }}
        />
      </View>
      <Image source={st.img} style={{ width: st.w, height: st.h }} resizeMode="contain" />
    </View>
  );
}

function ScreenRenderer({ screenId, onNavigate }: { screenId: string; onNavigate: (id: string) => void }) {
  const [sessions] = useState({ 1: defaultSessionState() });

  // LEARNING_FLOW에서 현재 화면의 setNumber 추출
  const flowScreenInfo = LEARNING_FLOW.find(s => s.screenId === screenId);
  const currentSetNumber = flowScreenInfo?.setNumber || 1;
  const totalSets = 3;

  // ──── Mock 데이터 ────────────────────────────────────────────
  const listenSelectQuestions = [
    { no: 1, desc: '다음 음성을 듣고 맞는 단어를 선택하세요', viText: 'Nghe âm thanh và chọn từ đúng', words: ['베트남', '한국', '일본'], answer: '베트남', audioUrl: '' },
    { no: 2, desc: '다음 음성을 듣고 맞는 단어를 선택하세요', viText: 'Nghe âm thanh và chọn từ đúng', words: ['인도네시아', '러시아', '태국'], answer: '인도네시아', audioUrl: '' },
  ];

  const wordSoundQuestions = [
    {
      no: 1,
      desc: '음성을 듣고 맞는 단어를 선택하세요',
      viText: 'Nghe âm thanh và chọn từ đúng',
      items: [
        { value: 1, audioSrc: '' },
        { value: 2, audioSrc: '' },
        { value: 3, audioSrc: '' },
        { value: 4, audioSrc: '' },
      ],
      answer: 1,
    },
    {
      no: 2,
      desc: '음성을 듣고 맞는 단어를 선택하세요',
      viText: 'Nghe âm thanh và chọn từ đúng',
      items: [
        { value: 1, audioSrc: '' },
        { value: 2, audioSrc: '' },
        { value: 3, audioSrc: '' },
        { value: 4, audioSrc: '' },
      ],
      answer: 2,
    },
  ];

  const wordLetterBlankQuestions = [
    {
      no: 1,
      desc: '음성을 듣고 빈칸을 채우세요',
      viText: 'Điền vào chỗ trống',
      audioUrl: '',
      answer: '베트남',
      slots: ['_', '_', '_'],
      tiles: ['베', '트', '남', '한', '국', '일'],
      displayFormat: '___',
    },
    {
      no: 2,
      desc: '음성을 듣고 빈칸을 채우세요',
      viText: 'Điền vào chỗ trống',
      audioUrl: '',
      answer: '한국',
      slots: ['_', '_'],
      tiles: ['한', '국', '베', '트', '남', '일'],
      displayFormat: '__',
    },
  ];

  const wordVnKoSelectQuestions = [
    {
      no: 1,
      desc: '다음 베트남어 단어에 맞는 한국어를 선택하세요',
      viText: 'người',
      answer: '사람',
      words: [
        { text: '사람', textVi: 'người', imageUri: require('../../assets/SetWordbookEvalStage/preson.png') },
        { text: '학생', textVi: 'học sinh', imageUri: require('../../assets/SetWordbookEvalStage/1_student.png') },
        { text: '선생님', textVi: 'giáo viên', imageUri: require('../../assets/SetWordbookEvalStage/2_teacher.png') },
        { text: '친구', textVi: 'bạn bè', imageUri: require('../../assets/SetWordbookEvalStage/friend.png') },
      ],
    },
    {
      no: 2,
      desc: '다음 베트남어 단어에 맞는 한국어를 선택하세요',
      viText: 'học sinh',
      answer: '학생',
      words: [
        { text: '사람', textVi: 'người', imageUri: require('../../assets/SetWordbookEvalStage/preson.png') },
        { text: '학생', textVi: 'học sinh', imageUri: require('../../assets/SetWordbookEvalStage/1_student.png') },
        { text: '선생님', textVi: 'giáo viên', imageUri: require('../../assets/SetWordbookEvalStage/2_teacher.png') },
        { text: '친구', textVi: 'bạn bè', imageUri: require('../../assets/SetWordbookEvalStage/friend.png') },
      ],
    },
  ];

  const sentenceBlankQuestions = [
    {
      no: 1,
      viText: 'Tôi thích xem phim.',
      koText: '나는 ___을 좋아해요.',
      blankWord: '영화',
      choices: ['영화', '책', '음악', '게임'],
    },
    {
      no: 2,
      viText: 'Tôi là người Việt Nam.',
      koText: '나는 ___ 사람입니다.',
      blankWord: '베트남',
      choices: ['베트남', '한국', '일본', '태국'],
    },
  ];

  const sentenceSelectQuestions = [
    {
      no: 1,
      viSentence: 'Tôi là học sinh.',
      koCorrectSentence: '나는 학생입니다.',
      choices: ['나는 학생입니다.', '나는 선생님입니다.', '나는 의사입니다.'],
    },
    {
      no: 2,
      viSentence: 'Tôi đến từ Việt Nam.',
      koCorrectSentence: '나는 베트남에서 왔어요.',
      choices: ['나는 베트남에서 왔어요.', '나는 한국에서 왔어요.', '나는 일본에서 왔어요.'],
    },
  ];

  const speakingEvalQuestions = [
    {
      step: 1,
      totalSteps: 4,
      sentence: '저는 ___이에요. 저는 ___에서 왔어요.',
      sentenceVi: 'Tôi là ___. Tôi đến từ ___.',
      blanks: [
        { placeholder: '이름', placeholderVi: 'tên' },
        { placeholder: '나라', placeholderVi: 'quốc gia' },
      ],
    },
    {
      step: 2,
      totalSteps: 4,
      sentence: '나는 ___을/를 좋아해요.',
      sentenceVi: 'Tôi thích ___.',
      blanks: [
        { placeholder: '취미', placeholderVi: 'sở thích' },
      ],
    },
  ];

  const reportData = {
    sessionNumber: 1,
    sessionTitle: '저는 흐엉이에요',
    sessionTitleVi: 'Tôi là Hương',
    description: '나라와 국적 표현을 배웠습니다.',
    descriptionVi: 'Bạn đã học về cách diễn đạt quốc gia và quốc tịch.',
    vocabCount: 12,
    speakingScore: 3,
    speakingTotal: 4,
    testScore: 5,
    testTotal: 6,
    aiFeedback: '좋은 발음으로 완성했습니다!',
    aiFeedbackVi: 'Bạn đã hoàn thành với phát âm tốt!',
  };

  // 기본 프로토타입 화면 분기
  switch (screenId) {
    case 'set-wordbook-eval':
      return (
        <SetWordbookEvalStage
          setNumber={1}
          totalSets={3}
          onNext={() => onNavigate('word-vnko-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-wordbook-eval-2':
      return (
        <SetWordbookEvalStage
          setNumber={2}
          totalSets={3}
          onNext={() => onNavigate('word-vnko-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-wordbook-eval-3':
      return (
        <SetWordbookEvalStage
          setNumber={3}
          totalSets={3}
          onNext={() => onNavigate('word-vnko-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'home':
      return (
        <HomeScreen
          sessions={sessions}
          setView={(v: any) => onNavigate(v)}
          onStartSession={(id) => id === 2 ? onNavigate('quick-review') : onNavigate('mission')}
        />
      );
    case 'mission-tutor':
      return (
        <MissionTutorStage
          sessionId={1}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'vocab-wordbook-voice':
      return (
        <VocabWordbookVoiceStage
          onNext={() => onNavigate('intro')}
          onBack={() => onNavigate('mission')}
        />
      );
    case 'intro-tutor':
      return (
        <IntroTutorStage
          onNext={() => onNavigate('vocab-wordbook')}
          onBack={() => onNavigate('quick-review')}
          introData={{
            badge: '문법과 표현 1',
            badgeVi: 'Ngữ pháp & Biểu đạt 1',
            icon: '📝',
            title: '저는 N이에요/예요 표현을 배워요',
            titleVi: 'Tôi học cách dùng N이에요/예요',
            subtitle: '받침 확인 > 뜻 고르기 > 문장 만들기 순서로 연습해요',
            subtitleVi: 'Luyện tập: kiểm tra phụ âm cuối > chọn nghĩa > tạo câu',
            achievement: {
              label: '학습 성과',
              labelVi: 'Kết quả học tập',
              desc: "'이에요/예요'를 구분해 이름과 국적을 말할 수 있어요",
              descVi: "Bạn có thể phân biệt '이에요/예요' và nói tên, quốc tịch của mình",
            },
          }}
        />
      );
    case 'intro-tutor-2':
      return (
        <IntroTutorStage
          onNext={() => onNavigate('grammar-detail')}
          onBack={() => onNavigate('quick-review')}
          introData={{
            badge: '문법과 표현 1',
            badgeVi: 'Ngữ pháp & Biểu đạt 1',
            icon: '📝',
            title: '문법 내용을 잘 이해했는지 문제를 풀면서 확인해요.',
            titleVi: 'Hãy kiểm tra xem bạn đã hiểu nội dung ngữ pháp chưa bằng cách làm bài tập.',
            subtitle: '',
            subtitleVi: '',
            achievement: {
              label: '학습 성과',
              labelVi: 'Kết quả học tập',
              desc: "'이에요/예요'를 구분하여 사용할 수 있어요.",
              descVi: "Bạn có thể phân biệt và sử dụng đúng '이에요/예요'.",
            },
          }}
        />
      );
    case 'intro-eval':
      return (
        <IntroEvalStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('quick-review')}
        />
      );
    case 'word-build':
      return (
        <WordBuildStage
          onComplete={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-vnko-select':
      return (
        <WordVnKoSelect2
          questions={wordVnKoSelectQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => onNavigate('listen-select')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'listen-select':
      return (
        <ListenSelect1
          questions={listenSelectQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => onNavigate('word-sound')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-sound':
      return (
        <WordSound1
          questions={wordSoundQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => onNavigate('word-letter-blank')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-letter-blank':
      return (
        <WordLetterBlank
          questions={wordLetterBlankQuestions}
          currentSetNumber={currentSetNumber}
          totalSets={totalSets}
          onNext={() => {
            if (currentSetNumber === 1) return onNavigate('set-complete');
            if (currentSetNumber === 2) return onNavigate('set-complete-2');
            if (currentSetNumber === 3) return onNavigate('set-complete-3');
            return onNavigate('set-complete');
          }}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete':
      return (
        <SetCompleteStage
          setNumber={1}
          totalSets={3}
          onNext={() => onNavigate('set-wordbook-eval-2')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-2':
      return (
        <SetCompleteStage
          setNumber={2}
          totalSets={3}
          onNext={() => onNavigate('set-wordbook-eval-3')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-3':
      return (
        <SetCompleteStage
          setNumber={3}
          totalSets={3}
          onNext={() => onNavigate('intro-tutor')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'intro-tutor-2':
      return (
        <IntroTutorStage
          sessionId={1}
          onNext={() => onNavigate('sentence-blank-1')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-blank-1':
      return (
        <SentenceBlank1
          questions={sentenceBlankQuestions}
          onNext={() => onNavigate('sentence-select-1')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-select-1':
      return (
        <SentenceSelect1
          questions={sentenceSelectQuestions}
          onNext={() => onNavigate('sentence-build-2')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'intro-eval':
      return (
        <IntroEvalStage
          onNext={() => onNavigate('speaking-eval')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'speaking-eval':
      return (
        <SpeakingEvalStage
          questions={speakingEvalQuestions}
          onNext={() => onNavigate('learning-report')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'learning-report':
      return (
        <LearningReportStage
          data={reportData}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'practical-speaking':
      return (
        <PracticalSpeakingStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-celebration-vocab':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description={"오늘의 단어를 모두 학습했어요.\n이제 문법을 배워볼까요?"}
          descriptionVi={"Bạn đã học xong tất cả các từ vựng hôm nay.\nBây giờ, chúng ta cùng học ngữ pháp nhé!"}
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-celebration-grammar':
      return (
        <CompletionCelebrationGrammarStage
          title="훌륭해요!"
          titleVi="Tuyệt lắm!"
          description={"오늘의 문법을 모두 학습했어요.\n이제 오늘 배운 내용을 실전에서 직접 말해봐요."}
          descriptionVi={"Bạn đã học xong toàn bộ ngữ pháp hôm nay.\nBây giờ, hãy trực tiếp sử dụng những nội dung đã học hôm nay trong tình huống thực tế nhé."}
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-celebration-class':
      return (
        <CompletionCelebrationClassStage
          title="수고했어요!"
          titleVi="Bạn đã làm rất tốt!"
          description={"오늘 수업을 모두 완료했어요.\n나의 학습 리포트를 확인해 보세요."}
          descriptionVi={"Bạn đã hoàn thành toàn bộ bài học hôm nay.\nHãy xem báo cáo học tập của bạn nhé."}
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-listen':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description="실전 듣기를 완료했어요!"
          descriptionVi="Bạn đã hoàn thành phần nghe thực hành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-read':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description={"실전 읽기 및 발음평가를\n완료했어요!"}
          descriptionVi="Thực hành đọc và đánh giá phát âm đã hoàn thành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-write':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description="실전 쓰기를 완료했어요!"
          descriptionVi="Bạn đã hoàn thành phần viết thực hành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'completion-practice-check':
      return (
        <CompletionCelebrationVocabStage
          title="대단해요!"
          titleVi="Tuyệt vời!"
          description="실전 확인을 완료했어요!"
          descriptionVi="Bạn đã hoàn thành phần kiểm tra thực hành!"
          nextButtonText="확인"
          nextButtonTextVi="Xác nhận"
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-build':
      return (
        <SentenceBuildStage
          onComplete={() => onNavigate('sentence-build-2')}
          onBack={() => onNavigate('grammar-act-start')}
        />
      );
    case 'sentence-build-2':
      return (
        <SentenceBuildStage2
          onComplete={() => onNavigate('eval-start')}
          onBack={() => onNavigate('sentence-build')}
        />
      );
    case 'video-bridge':
      return (
        <VideoBridgeStage
          onPressConfirm={() => onNavigate('slide-explain')}
          onClose={() => onNavigate('grammar-start')}
        />
      );
    case 'slide-explain':
      return (
        <SlideExplainStage
          onNext={() => onNavigate('grammar-act-start')}
          onBack={() => onNavigate('video-bridge')}
        />
      );
    case 'quick-review':
      return (
        <QuickReviewStage
          onPressConfirm={() => onNavigate('intro-tutor')}
          onClose={() => onNavigate('home')}
        />
      );
    case 'culture':
      return (
        <CultureStage
          onPressConfirm={() => onNavigate('home')}
          onClose={() => onNavigate('home')}
        />
      );
    case 'grammar-detail':
      return (
        <GrammarDetailStage
          onNext={() => onNavigate('sentence-build')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-detail':
      return (
        <WordDetailStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'slide-explain':
      return (
        <SlideExplainStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'video-bridge':
      return (
        <VideoBridgeStage
          onPressConfirm={() => onNavigate('home')}
          onClose={() => onNavigate('home')}
        />
      );
    case 'listen-select-1':
      return (
        <ListenSelect1
          questions={[
            { no: 1, desc: '소리를 듣고 단어를 고르세요', words: ['베트남', '한국', '인도네시아', '러시아'], answer: '베트남', viText: 'Hãy nghe đoạn âm thanh rồi chọn từ tương ứng nhé.' },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-vn-ko-select-2':
      return (
        <WordVnKoSelect2
          questions={[
            {
              no: 1, desc: '', viText: 'người', answer: '사람',
              words: [
                { text: '사람', textVi: 'người', imageUri: require('../../assets/SetWordbookEvalStage/preson.png') },
                { text: '학생', textVi: 'học sinh', imageUri: require('../../assets/SetWordbookEvalStage/1_student.png') },
                { text: '선생님', textVi: 'giáo viên', imageUri: require('../../assets/SetWordbookEvalStage/2_teacher.png') },
                { text: '친구', textVi: 'bạn bè', imageUri: require('../../assets/SetWordbookEvalStage/friend.png') },
              ],
            },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-sound-1':
      return (
        <WordSound1
          questions={[
            { no: 1, desc: '미국', viText: 'Hoa Kỳ', answer: 1, items: [{ value: 1, audioSrc: 'https://via.placeholder.com/audio?text=america' }, { value: 2, audioSrc: 'https://via.placeholder.com/audio?text=japan' }, { value: 3, audioSrc: 'https://via.placeholder.com/audio?text=korea' }, { value: 4, audioSrc: 'https://via.placeholder.com/audio?text=vietnam' }] },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-letter-blank':
      return (
        <WordLetterBlank
          questions={[
            { no: 1, desc: '단어를 완성하세요', viText: 'Hoàn thành từ', audioUrl: 'https://via.placeholder.com/audio?text=word', answer: '미국', slots: ['미', '국'], tiles: ['미', '국', '일', '본'], displayFormat: '___ ___' },
          ]}
          currentSetNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete':
      return (
        <SetCompleteStage
          setNumber={1}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-2':
      return (
        <SetCompleteStage
          setNumber={2}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'set-complete-3':
      return (
        <SetCompleteStage
          setNumber={3}
          totalSets={3}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'sentence-blank-1':
      return (
        <SentenceBlank1
          questions={[
            { no: 1, viText: 'Tôi là người Việt Nam.', koText: '저는 _____ 사람이에요.', blankWord: '베트남', choices: ['베트남', '한국', '일본', '중국'] },
            { no: 2, viText: 'Tôi là học sinh.', koText: '저는 _____ 이에요.', blankWord: '학생', choices: ['학생', '선생님', '의사', '회사원'] },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'word-blank-1':
      return (
        <WordBlank1
          questions={[
            { no: 1, viWord: 'Việt Nam', koWord: '베___', answer: '트남', choices: ['트남', '한국', '일본', '중국'] },
            { no: 2, viWord: 'người', koWord: '사___', answer: '람', choices: ['람', '원', '님', '자'] },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'listen-typing-1':
      return (
        <ListenTyping1
          questions={[
            { no: 1, audioUrl: require('../../assets/sounds/word_set_1.mp3'), answer: 'Việt Nam', answerVi: '베트남', hint: '국가 이름' },
            { no: 2, audioUrl: require('../../assets/sounds/word_set_1.mp3'), answer: 'người', answerVi: '사람', hint: '사람을 뜻하는 단어' },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'sentence-select-1':
      return (
        <SentenceSelect1
          questions={[
            {
              no: 1,
              viSentence: 'Tôi không phải là nhân viên công ty.',
              koCorrectSentence: '저는 회사원이 아니에요.',
              choices: ['저는 회사원이 아니에요.', '저는 회사원이에요.', '저는 학생이에요.', '저는 의사에요.']
            },
            {
              no: 2,
              viSentence: 'Tôi là người Việt Nam.',
              koCorrectSentence: '저는 베트남 사람이에요.',
              choices: ['저는 한국 사람이에요.', '저는 베트남 사람이에요.', '저는 일본 사람이에요.', '저는 중국 사람이에요.']
            },
          ]}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'speaking-eval':
      return (
        <SpeakingEvalStage
          questions={[
            {
              step: 1,
              totalSteps: 4,
              sentence: '안녕하세요? 저는 _____ 사람이에요.',
              sentenceVi: 'Xin chào? Tôi là người _____.',
              blanks: [
                { placeholder: '이름', placeholderVi: 'tên' },
                { placeholder: '국적', placeholderVi: 'quốc tịch' }
              ]
            },
            {
              step: 2,
              totalSteps: 4,
              sentence: '저는 _____ 이에요.',
              sentenceVi: 'Tôi là _____.',
              blanks: [
                { placeholder: '직업', placeholderVi: 'nghề nghiệp' }
              ]
            },
            {
              step: 3,
              totalSteps: 4,
              sentence: '만나서 _____ 해요.',
              sentenceVi: 'Rất _____ gặp bạn.',
              blanks: [
                { placeholder: '감정', placeholderVi: 'cảm xúc' }
              ]
            },
            {
              step: 4,
              totalSteps: 4,
              sentence: '저는 _____ 을/를 좋아해요.',
              sentenceVi: 'Tôi thích _____.',
              blanks: [
                { placeholder: '취미', placeholderVi: 'sở thích' }
              ]
            }
          ]}
          onNext={() => onNavigate('learning-report')}
          onBack={() => onNavigate('home')}
          currentSetNumber={1}
          totalSets={3}
        />
      );
    case 'learning-report':
      return (
        <LearningReportStage
          data={{
            sessionNumber: 1,
            sessionTitle: '나라와 국적 소개',
            sessionTitleVi: 'Giới thiệu quốc gia và quốc tịch',
            description: '오늘 학습한 단어, 문법, 발음기 결정해 확인해 보세요.',
            descriptionVi: 'Hãy xem lại từ vựng, ngữ pháp, phát âm mà bạn học hôm nay.',
            vocabCount: 15,
            speakingScore: 4,
            speakingTotal: 4,
            testScore: 6,
            testTotal: 6,
            aiFeedback: '오늘의 자기소개 발음을 완성했어요. 다음에는 받침 있는 단어를 정확하게 구분해 말해봅시다.',
            aiFeedbackVi: 'Bạn đã hoàn thành bài tự giới thiệu hôm nay. Lần sau, hãy phân biệt chính xác các từ có phụ âm cuối.'
          }}
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'word-intro-slides':
      return (
        <WordIntroSlidesStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'video-ai-tutor':
      return (
        <VideoAITutorStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'ai-tutor-desc':
      return (
        <AITutorDescStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'conversation-preview':
      return (
        <ConversationPreviewStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'conversation-shadowing':
      return (
        <ConversationShadowingStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'dialogue-listen-write':
      return (
        <DialogueListenWriteStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    case 'practice-check':
      return (
        <PracticeCheckStage
          onNext={() => onNavigate('home')}
          onBack={() => onNavigate('home')}
        />
      );
    default:
      return (
        <View style={placeholder.wrap}>
          <Text style={placeholder.emoji}>🚧</Text>
          <Text style={placeholder.title}>준비 중</Text>
          <Text style={placeholder.sub}>이 화면은 현재 구현 중입니다.</Text>
        </View>
      );
  }
}

const placeholder = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.canvas },
  emoji: { fontSize: 40 },
  title: { fontSize: 18, fontWeight: '700', color: colors.ink },
  sub: { fontSize: 13, color: colors.muted },
});

// ─── 에뮬레이터 쉘 ────────────────────────────────────────────────
function LangSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <View style={ls.row}>
      {(['ko', 'vi'] as Lang[]).map((l) => (
        <TouchableOpacity
          key={l}
          style={[ls.btn, lang === l && ls.btnActive]}
          onPress={() => setLang(l)}
          activeOpacity={0.7}
        >
          <Text style={[ls.label, lang === l && ls.labelActive]}>
            {l === 'ko' ? '🇰🇷 한국어' : '🇻🇳 Tiếng Việt'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const ls = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6 },
  btn: {
    flex: 1, paddingVertical: 7, borderRadius: 10,
    borderWidth: 1, borderColor: colors.line, alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  btnActive: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  label: { fontSize: 11, fontWeight: '600', color: colors.muted },
  labelActive: { color: colors.teal },
});

// ─── 화면 선택 콤보박스 ──────────────────────────────────────────
function ScreenComboBox({
  currentScreenId,
  onSelectScreen,
}: {
  currentScreenId: string;
  onSelectScreen: (id: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentScreen = getScreen(currentScreenId) ?? SCREEN_REGISTRY[0];

  const sortedRegistry = [...SCREEN_REGISTRY].sort((a, b) => {
    const numA = parseFloat(a.label.match(/^[\d.]+/)?.[0] ?? '9999');
    const numB = parseFloat(b.label.match(/^[\d.]+/)?.[0] ?? '9999');
    if (numA !== numB) return numA - numB;
    return a.label.localeCompare(b.label, 'ko');
  });

  return (
    <View style={combo.container}>
      {/* 콤보박스 선택 헤더 */}
      <TouchableOpacity
        style={[combo.trigger, isOpen && combo.triggerOpen]}
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <View style={combo.triggerContent}>
          <Text style={combo.triggerLabel} numberOfLines={1}>
            {currentScreen.label}
          </Text>
          <View style={[shell.categoryBadge, currentScreen.category === '신규' && shell.badgeNew, currentScreen.category === '수정' && shell.badgeMod]}>
            <Text style={shell.categoryBadgeText}>{currentScreen.category}</Text>
          </View>
        </View>
        <Text style={combo.arrowIcon}>{isOpen ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {/* 드롭다운 리스트 */}
      {isOpen && (
        <View style={combo.dropdown}>
          <ScrollView
            style={combo.listScroll}
            nestedScrollEnabled
            showsVerticalScrollIndicator={true}
          >
            {sortedRegistry.map((s) => {
              const isSelected = s.id === currentScreenId;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[combo.optionItem, isSelected && combo.optionItemActive]}
                  onPress={() => {
                    onSelectScreen(s.id);
                    setIsOpen(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[combo.optionLabel, isSelected && combo.optionLabelActive]}
                    numberOfLines={1}
                  >
                    {s.label}
                  </Text>
                  <View
                    style={[
                      shell.categoryBadge,
                      s.category === '신규' && shell.badgeNew,
                      s.category === '수정' && shell.badgeMod,
                    ]}
                  >
                    <Text style={shell.categoryBadgeText}>{s.category}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const combo = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: colors.line,
  },
  triggerOpen: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  triggerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 6,
    gap: 4,
  },
  triggerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.ink,
    flex: 1,
  },
  arrowIcon: {
    fontSize: 10,
    color: colors.muted,
    marginLeft: 2,
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    maxHeight: 320,
    overflow: 'hidden',
  },
  listScroll: {
    maxHeight: 320,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    gap: 6,
  },
  optionItemActive: {
    backgroundColor: colors.tealSoft,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.ink,
    flex: 1,
  },
  optionLabelActive: {
    fontWeight: '700',
    color: colors.teal,
  },
});

// ─── 헤더 테마 셀렉트 박스 ─────────────────────────────────────────
function ThemeSelect() {
  const { themes, themeId, setThemeId, theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <View style={ts.wrap}>
      <TouchableOpacity style={[ts.trigger, open && ts.triggerOpen]} onPress={() => setOpen(!open)} activeOpacity={0.75}>
        <View style={[ts.dot, { backgroundColor: theme.colors.primary, borderColor: theme.colors.primaryDark }]} />
        <Text style={ts.triggerText} numberOfLines={1}>{theme.name}</Text>
        <Text style={ts.arrow}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {open && (
        <View style={ts.dropdown}>
          <ScrollView style={{ maxHeight: 420 }} nestedScrollEnabled showsVerticalScrollIndicator>
            {themes.map((t, i) => {
              const sel = t.id === themeId;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[ts.option, sel && ts.optionOn]}
                  onPress={() => { setThemeId(t.id); setOpen(false); }}
                  activeOpacity={0.75}
                >
                  <Text style={ts.optionNo}>{String(i + 1).padStart(2, '0')}</Text>
                  <View style={ts.swatchRow}>
                    <View style={[ts.swatch, { backgroundColor: t.colors.canvas }]} />
                    <View style={[ts.swatch, { backgroundColor: t.colors.primary }]} />
                    <View style={[ts.swatch, { backgroundColor: t.colors.ink }]} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[ts.optionLabel, sel && ts.optionLabelOn]} numberOfLines={1}>{t.name}</Text>
                    <Text style={ts.optionSub} numberOfLines={1}>{t.type.display} · {t.layout.header}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const ts = StyleSheet.create({
  wrap: { position: 'relative', zIndex: 50, width: 190 },
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 9, paddingVertical: 6, borderRadius: 9,
    borderWidth: 1, borderColor: colors.line, backgroundColor: '#f9fafb',
  },
  triggerOpen: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1 },
  triggerText: { flex: 1, fontSize: 12, fontWeight: '700', color: colors.ink },
  arrow: { fontSize: 9, color: colors.muted },
  dropdown: {
    position: 'absolute', top: 38, right: 0, width: 262,
    backgroundColor: colors.surface, borderRadius: 10,
    borderWidth: 1, borderColor: colors.line,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.14, shadowRadius: 18, elevation: 12,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 10, paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: '#f3f4f6',
  },
  optionOn: { backgroundColor: colors.tealSoft },
  optionNo: { fontSize: 10, fontWeight: '700', color: colors.muted, width: 16 },
  swatchRow: { flexDirection: 'row', gap: 2 },
  swatch: { width: 9, height: 16, borderRadius: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)' },
  optionLabel: { fontSize: 12, fontWeight: '600', color: colors.ink },
  optionLabelOn: { fontWeight: '800', color: colors.teal },
  optionSub: { fontSize: 9.5, color: colors.muted, marginTop: 1 },
});

function EmulatorShellInner() {
  const [deviceId, setDeviceId] = useState('iphone15');
  const [screenId, setScreenId] = useState('set-wordbook-eval');
  const [infoTab, setInfoTab] = useState<'desc' | 'dev' | 'design'>('desc');
  const [flowMode, setFlowMode] = useState(false);
  const [currentFlowStep, setCurrentFlowStep] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  // 헤더에서 고른 테마를 가운데 폰 화면에도 실제로 입힌다.
  // 아직 테마 버전이 있는 화면(단어장 5-2)에만 적용되고, 나머지는 원본 그대로 나온다.
  const { theme: activeTheme, enabled: applyTheme, setEnabled: setApplyTheme } = useTheme();


  // Flow 모드일 때 현재 screenId 결정
  const activeScreenId = flowMode ? LEARNING_FLOW[currentFlowStep]?.screenId : screenId;
  // 고른 테마를 실제 화면들에 입힌다. 화면 컴포넌트는 건드리지 않으므로 기능은 그대로 동작한다.
  useEffect(() => {
    const t = applyTheme ? activeTheme : null;
    applyThemeToDom(t);
    // 화면 전환 직후에는 아직 DOM 이 다 그려지지 않았을 수 있어 한 번 더 입힌다
    const again = setTimeout(() => applyThemeToDom(t), 350);
    return () => clearTimeout(again);
  }, [applyTheme, activeTheme, activeScreenId, screenId]);

  const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[0];
  const screen = getScreen(activeScreenId || screenId);

  // 프레임 스케일 — 최대 높이 제약에 맞춤
  const maxH = 780;
  const scale = Math.min(1, maxH / device.h);
  const frameW = device.w * scale;
  const frameH = device.h * scale;

  // onNavigate 콜백 - flow 모드에 따라 다르게 처리
  const handleNavigate = (nextScreenId: string) => {
    if (flowMode) {
      // flow 모드: 다음 단계로 이동
      if (currentFlowStep < LEARNING_FLOW.length - 1) {
        setCurrentFlowStep(currentFlowStep + 1);
      } else {
        // flow 끝 - 일반 모드로 복귀
        setFlowMode(false);
        setCurrentFlowStep(0);
        setScreenId('home');
      }
    } else {
      // 일반 모드: 단순히 screenId 변경
      setScreenId(nextScreenId);
    }
  };

  if (Platform.OS !== 'web') return null;

  return (
    <LangProvider>
    <View style={shell.root}>
      {/* ── 상단 타이틀 바 ── */}
      <View style={shell.topBar}>
        <View style={shell.topBarBrand}>
          <Text style={shell.topBarLogo}>K-Chao</Text>
          <Text style={shell.topBarSub}>리뉴얼 프로토타입 뷰어</Text>
        </View>
        <View style={shell.topBarRight}>
          <Text style={shell.topBarFieldLabel}>테마</Text>
          <ThemeSelect />
          <TouchableOpacity
            style={[shell.applyBtn, applyTheme && shell.applyBtnOn]}
            onPress={() => setApplyTheme(!applyTheme)}
            activeOpacity={0.8}
          >
            <Text style={[shell.applyBtnText, applyTheme && shell.applyBtnTextOn]}>
              {applyTheme ? '테마 적용 ON' : '테마 적용 OFF'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[shell.galleryBtn, showGallery && shell.galleryBtnOn]}
            onPress={() => setShowGallery(!showGallery)}
            activeOpacity={0.8}
          >
            <Text style={[shell.galleryBtnText, showGallery && shell.galleryBtnTextOn]}>
              {showGallery ? '× 갤러리 닫기' : '🎨 테마 갤러리'}
            </Text>
          </TouchableOpacity>
          <Text style={shell.topBarVersion}>v0.1 · Expo Web</Text>
        </View>
      </View>

      {showGallery ? (
        <ThemeGalleryScreen onClose={() => setShowGallery(false)} />
      ) : (
      <View style={shell.body}>
        {/* ── 좌측 컨트롤 패널 ── */}
        <View style={shell.leftPanel}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={shell.panelTitle}>언어</Text>
            <LangSwitcher />
            <View style={shell.divider} />
            <Text style={shell.panelTitle}>디바이스</Text>
            {DEVICES.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[shell.selectItem, deviceId === d.id && shell.selectItemActive]}
                onPress={() => setDeviceId(d.id)}
                activeOpacity={0.7}
              >
                <Text style={[shell.selectItemOs, deviceId === d.id && shell.selectItemOsActive]}>
                  {d.os}
                </Text>
                <Text style={[shell.selectItemLabel, deviceId === d.id && shell.selectItemLabelActive]}>
                  {d.label}
                </Text>
                <Text style={shell.selectItemSize}>{d.w}×{d.h}</Text>
              </TouchableOpacity>
            ))}

            <View style={shell.divider} />
            <Text style={shell.panelTitle}>화면 선택</Text>
            <ScreenComboBox currentScreenId={screenId} onSelectScreen={setScreenId} />

            <View style={shell.divider} />
            <Text style={shell.panelTitle}>학습 Flow</Text>
            {!flowMode ? (
              <TouchableOpacity
                style={[shell.selectItem, { backgroundColor: colors.tealSoft }]}
                onPress={() => {
                  setFlowMode(true);
                  setCurrentFlowStep(0);
                }}
                activeOpacity={0.7}
              >
                <Text style={[shell.selectItemLabel, { color: colors.teal, fontWeight: '700' }]}>
                  📚 Flow 시작
                </Text>
              </TouchableOpacity>
            ) : (
              <View>
                <View style={[shell.selectItem, { backgroundColor: '#FFE6E6' }]}>
                  <Text style={[shell.selectItemLabel, { color: '#D32F2F', fontWeight: '700' }]}>
                    🎯 Step {currentFlowStep + 1}/{LEARNING_FLOW.length}
                  </Text>
                </View>
                <Text style={[shell.panelTitle, { marginTop: 8, fontSize: 12 }]}>
                  {LEARNING_FLOW[currentFlowStep]?.label || '완료'}
                </Text>
                <TouchableOpacity
                  style={[shell.selectItem, { backgroundColor: '#E0E0E0', marginTop: 8 }]}
                  onPress={() => {
                    setFlowMode(false);
                    setCurrentFlowStep(0);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[shell.selectItemLabel, { color: '#424242' }]}>
                    × Flow 종료
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[shell.selectItem, { backgroundColor: currentFlowStep <= 0 ? '#F5F5F5' : '#E8EAF6', marginTop: 8 }]}
                  onPress={() => {
                    if (currentFlowStep > 0) {
                      setCurrentFlowStep(currentFlowStep - 1);
                    }
                  }}
                  disabled={currentFlowStep <= 0}
                  activeOpacity={0.7}
                >
                  <Text style={[shell.selectItemLabel, { color: currentFlowStep <= 0 ? '#BDBDBD' : '#3949AB', fontWeight: '700' }]}>
                    ⏮️ 이전 Step
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[shell.selectItem, { backgroundColor: '#FFF3E0', marginTop: 8 }]}
                  onPress={() => {
                    if (currentFlowStep < LEARNING_FLOW.length - 1) {
                      setCurrentFlowStep(currentFlowStep + 1);
                    }
                  }}
                  disabled={currentFlowStep >= LEARNING_FLOW.length - 1}
                  activeOpacity={0.7}
                >
                  <Text style={[shell.selectItemLabel, { color: '#E65100', fontWeight: '700' }]}>
                    ⏭️ 다음 Step
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>

        {/* ── 중앙 디바이스 프레임 ── */}
        <View style={shell.centerPanel}>
          <View style={[shell.deviceOuter, { width: frameW + 24, height: frameH + 48 }]}>
            {/* OS 상단 노치/Dynamic Island 표시 */}
            <View style={[shell.statusBar, { width: frameW }]}>
              <Text style={shell.statusBarText}>9:41</Text>
              <View style={shell.notch} />
              <Text style={shell.statusBarText}>● ● ●</Text>
            </View>
            {/* 화면 렌더링 영역 */}
            <View style={[shell.deviceScreen, { width: frameW, height: frameH - 24 }]}>
              <View style={{ flex: 1 }} {...({ dataSet: applyTheme ? { themed: 'on' } : undefined } as any)}>
                <ScreenRenderer screenId={activeScreenId || screenId} onNavigate={handleNavigate} />
                <ScreenSticker theme={activeTheme} enabled={applyTheme} screenId={activeScreenId || screenId} />
              </View>
            </View>
          </View>

          {/* 디바이스 정보 */}
          <View style={shell.deviceInfo}>
            <Text style={shell.deviceInfoText}>
              {device.label} · {device.w}×{device.h}px · {device.os}
              {scale < 1 ? ` · ${Math.round(scale * 100)}% 스케일` : ''}
            </Text>
          </View>
        </View>

        {/* ── 우측 정보 패널 ── */}
        <View style={shell.rightPanel}>
          {screen ? (
            <>
              <View style={shell.screenHeader}>
                <Text style={shell.screenName}>{screen.label}</Text>
                <View style={[shell.categoryBadge, screen.category === '신규' && shell.badgeNew, screen.category === '수정' && shell.badgeMod]}>
                  <Text style={shell.categoryBadgeText}>{screen.category}</Text>
                </View>
              </View>

              {/* 탭 */}
              <View style={shell.tabs}>
                {([['desc', '화면 설명'], ['dev', '개발 참고'], ['design', '디자인 참고']] as const).map(([key, label]) => (
                  <TouchableOpacity
                    key={key}
                    style={[shell.tab, infoTab === key && shell.tabActive]}
                    onPress={() => setInfoTab(key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[shell.tabText, infoTab === key && shell.tabTextActive]}>{label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <ScrollView style={shell.tabContent} showsVerticalScrollIndicator={false}>
                {infoTab === 'desc' && (
                  <View style={shell.infoBlock}>
                    <Text style={shell.infoText}>{screen.description}</Text>
                  </View>
                )}
                {infoTab === 'dev' && (
                  <View style={shell.infoBlock}>
                    {screen.sourceAFile && (
                      <View style={shell.codeChip}>
                        <Text style={shell.codeChipLabel}>Source A</Text>
                        <Text style={shell.codeChipValue}>{screen.sourceAFile}</Text>
                      </View>
                    )}
                    {screen.sourceBRef && (
                      <View style={[shell.codeChip, shell.codeChipB]}>
                        <Text style={shell.codeChipLabel}>Source B</Text>
                        <Text style={shell.codeChipValue}>{screen.sourceBRef}</Text>
                      </View>
                    )}
                    <Text style={shell.infoText}>{screen.devNotes}</Text>
                  </View>
                )}
                {infoTab === 'design' && (
                  <View style={shell.infoBlock}>
                    <Text style={shell.infoText}>{screen.designNotes}</Text>
                  </View>
                )}
              </ScrollView>
            </>
          ) : (
            <View style={{ padding: 20 }}>
              <Text style={shell.infoText}>화면을 선택하세요.</Text>
            </View>
          )}
        </View>
      </View>
      )}
    </View>
    </LangProvider>
  );
}

const shell = StyleSheet.create({
  root: { flex: 1, flexDirection: 'column', backgroundColor: colors.backdrop },
  topBar: {
    height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  topBarBrand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topBarLogo: { fontSize: 15, fontWeight: '800', color: colors.teal },
  topBarSub: { fontSize: 13, color: colors.muted },
  topBarVersion: { fontSize: 12, color: colors.muted },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10, zIndex: 50 },
  topBarFieldLabel: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.4 },
  galleryBtn: {
    paddingHorizontal: 11, paddingVertical: 7, borderRadius: 9,
    borderWidth: 1, borderColor: colors.teal, backgroundColor: colors.tealSoft,
  },
  galleryBtnOn: { backgroundColor: colors.teal, borderColor: colors.teal },
  galleryBtnText: { fontSize: 12, fontWeight: '800', color: colors.teal },
  galleryBtnTextOn: { color: '#ffffff' },
  applyBtn: {
    paddingHorizontal: 10, paddingVertical: 7, borderRadius: 9,
    borderWidth: 1, borderColor: colors.line, backgroundColor: '#f9fafb',
  },
  applyBtnOn: { backgroundColor: colors.ink, borderColor: colors.ink },
  applyBtnText: { fontSize: 11.5, fontWeight: '700', color: colors.muted },
  applyBtnTextOn: { color: '#ffffff' },
  body: { flex: 1, flexDirection: 'row' },

  // Left panel
  leftPanel: {
    width: 220, backgroundColor: colors.surface,
    borderRightWidth: 1, borderRightColor: colors.line,
    padding: 16,
  },
  panelTitle: { fontSize: 11, fontWeight: '700', color: colors.muted, letterSpacing: 0.6, marginBottom: 8, marginTop: 4, textTransform: 'uppercase' as const },
  selectItem: {
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, marginBottom: 4,
  },
  selectItemActive: { backgroundColor: colors.tealSoft },
  selectItemOs: { fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 0.4 },
  selectItemOsActive: { color: colors.teal },
  selectItemLabel: { fontSize: 13, fontWeight: '500', color: colors.ink },
  selectItemLabelActive: { fontWeight: '700', color: colors.teal },
  selectItemSize: { fontSize: 11, color: colors.muted },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 16 },
  screenItemTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },

  // Center
  centerPanel: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 16,
  },
  deviceOuter: {
    borderRadius: 32, backgroundColor: '#1a1a2e',
    padding: 12, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 24 }, shadowOpacity: 0.25, shadowRadius: 48, elevation: 24,
    overflow: 'hidden',
  },
  statusBar: {
    height: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, backgroundColor: '#1a1a2e',
  },
  statusBarText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  notch: { width: 80, height: 16, backgroundColor: '#1a1a2e', borderRadius: 12 },
  deviceScreen: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.surface },
  deviceInfo: { alignItems: 'center' },
  deviceInfoText: { fontSize: 11, color: colors.muted },

  // Right panel
  rightPanel: {
    width: 420, backgroundColor: colors.surface,
    borderLeftWidth: 1, borderLeftColor: colors.line,
    flexDirection: 'column',
  },
  screenHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  screenName: { fontSize: 14, fontWeight: '700', color: colors.ink, flex: 1, marginRight: 8 },
  tabs: {
    flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.teal },
  tabText: { fontSize: 12, color: colors.muted, fontWeight: '500' },
  tabTextActive: { color: colors.teal, fontWeight: '700' },
  tabContent: { flex: 1, padding: 16 },
  infoBlock: { gap: 12 },
  infoText: { fontSize: 13, color: colors.ink, lineHeight: 20 },
  codeChip: {
    borderRadius: 10, padding: 10,
    backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line,
  },
  codeChipB: { borderColor: colors.tealSoft, backgroundColor: '#f0fcfc' },
  codeChipLabel: { fontSize: 10, fontWeight: '700', color: colors.muted, letterSpacing: 0.4 },
  codeChipValue: { fontSize: 12, fontWeight: '600', color: colors.teal, marginTop: 2 },

  // Badges
  categoryBadge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
    backgroundColor: colors.canvas,
  },
  badgeNew: { backgroundColor: '#e8f8f0' },
  badgeMod: { backgroundColor: '#fff4e6' },
  categoryBadgeText: { fontSize: 10, fontWeight: '700', color: colors.muted },
});

// 테마 컨텍스트로 감싼 최종 export
export function EmulatorShell() {
  return (
    <ThemeProvider>
      <EmulatorShellInner />
    </ThemeProvider>
  );
}
