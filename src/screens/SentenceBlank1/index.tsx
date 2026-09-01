/**
 * 문장 빈칸 채우기 (SentenceBlank1)
 * - 베트남어 지문을 읽고 한국어 문장의 빈칸을 단어로 채우기
 * - 공통 ActivityHeader, ChoiceChip, CtaButton, QuizFeedbackModal 적용
 */
import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal, ChoiceChip } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Question {
  no: number;
  viText: string;
  koText: string;
  blankWord: string;
  choices: string[];
}

interface Props {
  questions?: Question[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function SentenceBlank1({
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

    const correct = selectedAnswer === currentQuestion.blankWord;
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
            {pick(lang, '뜻에 맞는 말을 고르세요', 'Hãy chọn từ phù hợp với nghĩa')}
          </Text>
        </View>

        {/* 베트남어 지문 */}
        <View style={s.textCard}>
          <Text style={s.viText}>{currentQuestion.viText}</Text>
        </View>

        {/* 한국어 문장 (빈칸 슬롯 표시) */}
        <View style={s.sentenceCard}>
          <View style={s.sentenceContent}>
            {currentQuestion.koText.split('___').map((part, idx, arr) => (
              <View key={idx} style={s.sentencePart}>
                <Text style={s.koText}>{part}</Text>
                {idx < arr.length - 1 && (
                  <View style={[s.blankSlot, selectedAnswer ? s.blankSlotFilled : null]}>
                    <Text style={s.blankSlotText}>{selectedAnswer || ' '}</Text>
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

      {/* 하단 액션 버튼 바 */}
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
        answerText={currentQuestion.blankWord}
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
    marginBottom: spacing.xl,
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
    marginBottom: spacing.lg,
    borderWidth: 1.5,
    borderColor: colors.teal,
    ...shadow.soft,
  },
  viText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 24,
  },
  sentenceCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  sentenceContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sentencePart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  koText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
  },
  blankSlot: {
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    minWidth: 70,
    alignItems: 'center',
  },
  blankSlotFilled: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.xs,
  },
  blankSlotText: {
    fontSize: 16,
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
