/**
 * 뜻에 맞는 문장 고르기 (SentenceSelect1)
 * - 베트남어 문장을 읽고 한국어 문장 선택지 중 뜻에 맞는 것 고르기
 * - 공통 ActivityHeader, ChoiceChip, CtaButton, QuizFeedbackModal 적용
 */
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal, ChoiceChip } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Question {
  no: number;
  viSentence: string;
  koCorrectSentence: string;
  choices: string[];
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function SentenceSelect1({
  questions = [],
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const sfx = useSfx();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const handleSelectAnswer = (choice: string) => {
    setSelectedAnswer(choice);
  };

  const handleConfirm = () => {
    if (!selectedAnswer) return;

    const correct = selectedAnswer === currentQuestion.koCorrectSentence;
    setIsCorrect(correct);
    setShowModal(true);

    if (correct) {
      sfx.play('correct');
    } else {
      sfx.play('wrong');
    }
  };

  const handleNextFromModal = () => {
    setShowModal(false);

    if (isCorrect) {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedAnswer(null);
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
          <Text style={s.title}>
            {pick(lang, '뜻에 맞는 문장을 고르세요', 'Hãy chọn câu có nghĩa phù hợp')}
          </Text>
        </View>

        {/* 베트남어 지문 카드 */}
        <View style={s.textCard}>
          <Text style={s.subtitle}>
            {pick(lang, 'Tiếng Việt:', 'Tiếng Việt:')}
          </Text>
          <Text style={s.viSentence}>{currentQuestion.viSentence}</Text>
        </View>

        {/* 한국어 문장 선택지 */}
        <View style={s.choicesSection}>
          <Text style={s.choiceSectionLabel}>
            {pick(lang, '한국어 선택지:', 'Lựa chọn Tiếng Hàn:')}
          </Text>
          <View style={s.choicesList}>
            {currentQuestion.choices.map((choice, idx) => (
              <ChoiceChip
                key={idx}
                text={choice}
                badge={idx + 1}
                selected={selectedAnswer === choice}
                onPress={() => handleSelectAnswer(choice)}
                size="lg"
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '확인', 'Xác nhận')}
          onPress={handleConfirm}
          disabled={!selectedAnswer}
          size="lg"
        />
      </View>

      {/* 공통 정답/오답 모달 */}
      <QuizFeedbackModal
        visible={showModal}
        isCorrect={isCorrect}
        answerText={currentQuestion.koCorrectSentence}
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
  textCard: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.teal,
    ...shadow.soft,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  viSentence: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 24,
    textAlign: 'center',
  },
  choicesSection: {
    marginBottom: spacing.xl,
  },
  choiceSectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  choicesList: {
    gap: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
