/**
 * 단어 빈칸 채우기 (WordBlank1)
 * - 베트남어 단어를 읽고 한국어 단어의 빈칸을 선택지에서 고르기
 * - 공통 ActivityHeader, ChoiceChip, CtaButton, QuizFeedbackModal 적용
 */
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal, ChoiceChip } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Question {
  no: number;
  viWord: string;
  koWord: string;
  answer: string;
  choices: string[];
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function WordBlank1({
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

    const correct = selectedAnswer === currentQuestion.answer;
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
            {pick(lang, '빈칸에 알맞은 말을 고르세요', 'Hãy chọn từ phù hợp cho chỗ trống')}
          </Text>
        </View>

        {/* 베트남어 단어 카드 */}
        <View style={s.viCard}>
          <Text style={s.subtitle}>{pick(lang, 'Từ tiếng Việt:', 'Tiếng Việt:')}</Text>
          <Text style={s.viWord}>{currentQuestion.viWord}</Text>
        </View>

        {/* 한국어 단어 (빈칸 슬롯 표시) */}
        <View style={s.koCard}>
          <Text style={s.subtitle}>{pick(lang, '한국어:', 'Tiếng Hàn:')}</Text>
          <View style={s.koWordContainer}>
            {currentQuestion.koWord.split('___').map((part, idx, arr) => (
              <View key={idx} style={s.wordPart}>
                <Text style={s.koWord}>{part}</Text>
                {idx < arr.length - 1 && (
                  <View style={[s.blankSlot, selectedAnswer ? s.blankSlotFilled : null]}>
                    <Text style={s.blankSlotText}>{selectedAnswer || '____'}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* 선택지 목록 */}
        <View style={s.choicesContainer}>
          {currentQuestion.choices.map((choice, idx) => (
            <ChoiceChip
              key={choice}
              text={choice}
              badge={idx + 1}
              selected={selectedAnswer === choice}
              onPress={() => handleSelectAnswer(choice)}
            />
          ))}
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

      {/* 공통 정답/오답 피드백 모달 */}
      <QuizFeedbackModal
        visible={showModal}
        isCorrect={isCorrect}
        answerText={currentQuestion.answer}
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
  viCard: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.teal,
    ...shadow.soft,
  },
  koCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
    marginBottom: spacing.xs,
  },
  viWord: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  koWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  wordPart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  koWord: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.ink,
  },
  blankSlot: {
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    minWidth: 50,
    alignItems: 'center',
  },
  blankSlotFilled: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.xs,
  },
  blankSlotText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.teal,
  },
  choicesContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
