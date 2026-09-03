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
import { useTheme } from '../../theme/ThemeContext';

import { isMb } from '../../theme/mb/mbSkin';
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
  const { enabled: __mbOn, theme: __mbTheme } = useTheme();
  const mbFill = __mbOn && isMb(__mbTheme.id);
  const sfx = useSfx();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<'correct' | 'wrong' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

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
                  mbFill && { paddingVertical: 0, paddingHorizontal: 0, borderStyle: 'solid' as const, overflow: 'hidden' as const, borderRadius: 14 },
                  // 사진은 테두리 없이 시원하게 — 선택/정오답 상태일 때만 컬러 보더
                  mbFill && choiceState === 'default' && { borderColor: 'transparent', backgroundColor: '#FFFFFF', shadowColor: '#3E6D96', shadowOpacity: 0.14, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
                ]}
                onPress={() => handleSelect(word, idx)}
                disabled={showModal}
                activeOpacity={0.75}
              >
                {word.imageUri ? (
                  <Image
                    source={word.imageUri}
                    style={mbFill ? { width: '100%', height: 148, borderTopLeftRadius: 14, borderTopRightRadius: 14 } : s.imageCardImg}
                    resizeMode={mbFill ? 'cover' : 'contain'}
                  />
                ) : (
                  <View style={s.imageCardPlaceholder} />
                )}
                <Text
                  style={[
                    s.imageCardText,
                    mbFill && { marginTop: 5, marginBottom: 0 },
                    choiceState === 'correct' && s.imageCardText_correct,
                    choiceState === 'wrong' && s.imageCardText_wrong,
                  ]}
                >
                  {word.text}
                </Text>
                {mbFill ? <View style={{ height: 6 }} /> : null}
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
    width: 120,
    height: 88,
    borderRadius: 8,
  },
  imageCardPlaceholder: {
    width: 120,
    height: 88,
    borderRadius: 8,
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
