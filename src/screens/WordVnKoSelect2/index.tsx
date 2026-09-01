/**
 * 베트남어 단어 보고 한국어 선택 (WordVnKoSelect2)
 * - 프로그레스바 헤더
 * - 공통 ActivityHeader, ChoiceChip, CtaButton, QuizFeedbackModal 적용
 */
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Image } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Word {
  text: string;
  textVi: string;
  audioUri?: string;
  imageUri?: any;
}

interface Question {
  no: number;
  desc: string;
  viText?: string;
  answer: string;
  words: Word[];
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function WordVnKoSelect2({
  questions = [],
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const sfx = useSfx();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const toastAudioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<'correct' | 'wrong' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(currentSetNumber === 1);
  const [isToastAudioPlaying, setIsToastAudioPlaying] = useState(false);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const playToastAudio = () => {
    if (Platform.OS !== 'web') return;

    try {
      const audioSrc = require('../../../assets/sounds/wordsound_set_1.mp3');
      if (!audioSrc) return;

      if (toastAudioRef.current) {
        toastAudioRef.current.pause();
      }

      const audio = new Audio(audioSrc);
      toastAudioRef.current = audio;
      setIsToastAudioPlaying(true);

      audio.play().catch(() => {
        setIsToastAudioPlaying(false);
      });

      audio.onended = () => {
        setIsToastAudioPlaying(false);
      };

      audio.onerror = () => {
        setIsToastAudioPlaying(false);
      };
    } catch {
      setIsToastAudioPlaying(false);
    }
  };

  const handleCloseToast = () => {
    if (toastAudioRef.current) {
      toastAudioRef.current.pause();
      toastAudioRef.current = null;
    }
    setIsToastAudioPlaying(false);
    setShowToast(false);
  };

  useEffect(() => {
    if (currentSetNumber === 1 && showToast) {
      const timer = setTimeout(() => {
        playToastAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentSetNumber, showToast]);

  const playAudio = (audioUri?: string) => {
    if (!audioUri || Platform.OS !== 'web') return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    try {
      const audio = new Audio(audioUri);
      audioRef.current = audio;
      setIsPlaying(true);

      audio.play().catch(() => setIsPlaying(false));
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => setIsPlaying(false);
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSelect = (word: Word, idx: number) => {
    if (showModal || isPlaying) return;

    const isCorrect = word.text === currentQuestion.answer;
    setSelectedIdx(idx);
    setSelectedState(isCorrect ? 'correct' : 'wrong');
    setShowModal(true);

    if (isCorrect) {
      sfx.play('correct');
    } else {
      sfx.play('wrong');
    }
  };

  const handleNextFromModal = () => {
    setShowModal(false);

    if (selectedState === 'correct') {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedIdx(null);
        setSelectedState(null);
      } else {
        onNext?.();
      }
    }
  };

  const progressPct = (currentSetNumber / totalSets) * 100;
  const selectedWordObj = selectedIdx !== null ? currentQuestion.words[selectedIdx] : null;

  return (
    <View style={s.root}>
      <ActivityHeader
        percentage={progressPct}
        onClose={onBack || (() => {})}
      />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* 질문 제목 */}
        <View style={s.titleBox}>
          <Text style={s.title}>
            {pick(lang, '알맞은 단어를 고르세요', 'Hãy chọn từ phù hợp nhé.')}
          </Text>
          <Text style={s.subtitle}>
            {pick(lang, 'Hãy chọn từ phù hợp nhé.', '알맞은 단어를 고르세요')}
          </Text>
        </View>

        {/* 베트남어 단어 카드 */}
        <View style={s.viCardBoxContainer}>
          <View style={s.viCardBox}>
            <Text style={s.viCardText}>{currentQuestion.viText || 'người'}</Text>
          </View>
        </View>

        {/* 1번 세트 안내 토스트 팝업 */}
        {showToast && currentSetNumber === 1 && (
          <View style={s.toastBox}>
            <TouchableOpacity
              style={s.toastCloseBtn}
              onPress={handleCloseToast}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={s.toastCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={s.toastMessage}>
              Nghe bằng tai rồi giải. Nghe âm thanh và chọn chữ đúng.
            </Text>

            <View style={s.toastBottomRow}>
              <TouchableOpacity
                style={[s.toastSpeakerBtn, isToastAudioPlaying && s.toastSpeakerPlaying]}
                onPress={playToastAudio}
                activeOpacity={0.7}
              >
                <Text style={s.toastSpeakerIcon}>{isToastAudioPlaying ? '🔊' : '🔈'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 한국어 선택지 목록 */}
        <View style={s.cardGrid}>
          {currentQuestion.words.map((word, idx) => {
            const isSelected = selectedIdx === idx;
            const choiceState: 'default' | 'correct' | 'wrong' =
              !isSelected ? 'default' : selectedState === 'correct' ? 'correct' : 'wrong';

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  s.imageCard,
                  choiceState === 'correct' && s.imageCard_correct,
                  choiceState === 'wrong' && s.imageCard_wrong,
                ]}
                onPress={() => handleSelect(word, idx)}
                disabled={showModal}
                activeOpacity={0.75}
              >
                {word.imageUri ? (
                  <Image
                    source={word.imageUri}
                    style={s.imageCardImg}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={s.imageCardPlaceholder} />
                )}
                <Text
                  style={[
                    s.imageCardText,
                    choiceState === 'correct' && s.imageCardText_correct,
                    choiceState === 'wrong' && s.imageCardText_wrong,
                  ]}
                >
                  {word.text}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '확인', 'Xác nhận')}
          onPress={onNext}
          size="lg"
        />
      </View>

      {/* 공통 정답/오답 모달 */}
      <QuizFeedbackModal
        visible={showModal}
        isCorrect={selectedState === 'correct'}
        answerText={selectedWordObj?.text || currentQuestion.answer}
        explanation={selectedWordObj?.textVi || currentQuestion.viText}
        onNext={handleNextFromModal}
        onClose={() => setShowModal(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  titleBox: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.ink,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
    marginTop: spacing.xs,
  },
  viCardBoxContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  viCardBox: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
    borderWidth: 2,
    borderRadius: radius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    width: '100%',
    alignItems: 'center',
    ...shadow.soft,
  },
  viCardText: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.tealDark,
  },
  toastBox: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
    position: 'relative',
    ...shadow.soft,
  },
  toastCloseBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastCloseText: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '700',
  },
  toastMessage: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginRight: spacing.xl,
    fontWeight: '500',
  },
  toastBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  toastSpeakerBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  toastSpeakerPlaying: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  toastSpeakerIcon: {
    fontSize: 14,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  imageCard: {
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
    ...shadow.soft,
  },
  imageCard_correct: {
    borderColor: colors.correct,
    borderStyle: 'solid',
    backgroundColor: colors.correctLight,
  },
  imageCard_wrong: {
    borderColor: colors.wrong,
    borderStyle: 'solid',
    backgroundColor: colors.wrongLight,
  },
  imageCardImg: {
    width: 80,
    height: 56,
    borderRadius: 6,
  },
  imageCardPlaceholder: {
    width: 80,
    height: 56,
    borderRadius: 6,
    backgroundColor: colors.bgSubtle,
  },
  imageCardText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  imageCardText_correct: {
    color: colors.correct,
  },
  imageCardText_wrong: {
    color: colors.wrong,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
