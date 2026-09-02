/**
 * 소리 듣고 단어 선택 (ListenSelect1)
 * - 프로그레스바 헤더
 * - 공통 ActivityHeader, AudioPlayButton, ChoiceChip, QuizFeedbackModal, CtaButton 적용
 */
import { useTheme } from '../../theme/ThemeContext';
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal, ChoiceChip, AudioPlayButton } from '../../components';
import { useSfx } from '../../hooks/useSfx';
import { playExclusive, stopExclusive } from '../../utils/audioPlayer';

interface Question {
  no: number;
  desc: string;
  words: string[];
  answer: string;
  viText?: string;
  audioUrl?: string;
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function ListenSelect1({
  questions = [],
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const { theme: __mbBT, enabled: __mbBE } = useTheme();
  const __mbBtn = __mbBE && __mbBT.id === 'malhaeboka';
  const sfx = useSfx();
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
      stopExclusive();
    };
  }, []);

  const playAudio = () => {
    if (!currentQuestion.audioUrl || Platform.OS !== 'web') return;

    setIsPlaying(true);

    playExclusive(currentQuestion.audioUrl, {
      onEnded: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  };

  const handleSelect = (word: string, idx: number) => {
    if (showModal || isPlaying) return;

    const isCorrect = word === currentQuestion.answer;
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

  return (
    <View style={s.root}>
      <ActivityHeader
        percentage={progressPct}
        onClose={onBack || (() => {})}
      />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* 질문 제목 */}
        <View style={s.titleBox}>
          <Text style={[s.title, __mbBtn && { fontSize: 19.5, lineHeight: 27 }]}>{currentQuestion.desc}</Text>
          {currentQuestion.viText && (
            <Text style={[s.subtitle, __mbBtn && { fontSize: 14.5, lineHeight: 21 }]}>{currentQuestion.viText}</Text>
          )}
        </View>

        {/* 표준 음성 재생 버튼 */}
        <View style={s.audioBtnContainer}>
          <AudioPlayButton
            isPlaying={isPlaying}
            onPress={playAudio}
            size="lg"
            label={pick(lang, '듣기', 'Nghe')}
            disabled={!currentQuestion.audioUrl}
          />
        </View>

        {/* 선택지 카드들 (Grid / List) */}
        <View style={s.cardGrid}>
          {currentQuestion.words.map((word, idx) => {
            let choiceState: 'default' | 'selected' | 'correct' | 'wrong' = 'default';
            if (selectedIdx === idx) {
              choiceState = selectedState === 'correct' ? 'correct' : 'wrong';
            }

            return (
              <View key={idx} style={s.gridItem}>
                <ChoiceChip
                  text={word}
                  badge={idx + 1}
                  state={choiceState}
                  onPress={() => handleSelect(word, idx)}
                  disabled={showModal}
                  size="lg"
                />
              </View>
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
        answerText={currentQuestion.answer}
        explanation={currentQuestion.viText}
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
  audioBtnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xl,
  },
  cardGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  gridItem: {
    width: '100%',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
