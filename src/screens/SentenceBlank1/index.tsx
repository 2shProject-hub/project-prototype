/**
 * 문장 빈칸 채우기 (SentenceBlank1)
 * - 베트남어 지문을 읽고 한국어 문장의 빈칸에 알맞은 단어를 선택
 * - FAIL_MAX=2: 2회 오답 시 정답 공개
 * - Source A: SentenceBlank1 / templateCd: sentence_comp / Act06
 */
import { useTheme } from '../../theme/ThemeContext';
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Question {
  no: number;
  viText?: string;
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

const FAIL_MAX = 2;

export function SentenceBlank1({
  questions = [],
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const { theme: __mbBtnT, enabled: __mbBtnE } = useTheme();
  const __mbBtn = __mbBtnE && __mbBtnT.id === 'malhaeboka';
  const sfx = useSfx();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [failCount, setFailCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentQuestion = questions[currentIdx];

  if (!currentQuestion) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const progressPct = (currentSetNumber / totalSets) * 100;

  // koText의 ___를 앞/뒤로 분리
  const parts = currentQuestion.koText.split('___');
  const before = parts[0] ?? '';
  const after = parts[1] ?? '';

  const choiceState = (word: string): 'default' | 'correct' | 'wrong' | 'revealed' => {
    if (!selected) return 'default';
    if (showAnswer && word === currentQuestion.blankWord) return 'revealed';
    if (word !== selected) return 'default';
    return isCorrect ? 'correct' : 'wrong';
  };

  const handleSelect = (word: string) => {
    if (showModal || showAnswer) return;
    setSelected(word);
  };

  const handleConfirm = () => {
    if (!selected) return;
    const correct = selected === currentQuestion.blankWord;
    setIsCorrect(correct);

    if (correct) {
      sfx.play('correct');
      setShowModal(true);
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      if (newFail >= FAIL_MAX) {
        sfx.play('wrong');
        setShowAnswer(true);
        setShowModal(true);
      } else {
        sfx.play('incorrect');
        setShowModal(true);
      }
    }
  };

  const handleNextFromModal = () => {
    setShowModal(false);

    if (isCorrect || failCount >= FAIL_MAX) {
      const next = currentIdx + 1;
      if (next < questions.length) {
        setCurrentIdx(next);
        setSelected(null);
        setFailCount(0);
        setIsCorrect(false);
        setShowAnswer(false);
      } else {
        onNext?.();
      }
    } else {
      setSelected(null);
    }
  };

  const isRetry = !isCorrect && failCount > 0 && failCount < FAIL_MAX;
  const feedbackState = isCorrect ? 'correct' : showAnswer ? 'wrong' : 'retry';

  return (
    <View style={s.root}>
      <ActivityHeader percentage={progressPct} onClose={onBack || (() => {})} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* 지시문 */}
        <Text style={s.instruction}>
          {pick(lang, '빈칸에 알맞은 단어를 고르세요', 'Chọn từ thích hợp điền vào chỗ trống')}
        </Text>

        {/* 한국어 빈칸 문장 */}
        <View style={s.sentenceRow}>
          <Text style={s.sentenceText}>{before}</Text>
          <View style={[
            s.blankBox,
            selected && !showAnswer && (isCorrect ? s.blankCorrect : s.blankFilled),
            showAnswer && s.blankRevealed,
          ]}>
            <Text style={[
              s.blankText,
              selected && !showAnswer && (isCorrect ? s.blankTextCorrect : s.blankTextFilled),
              showAnswer && s.blankTextRevealed,
            ]}>
              {showAnswer ? currentQuestion.blankWord : (selected ?? '　　')}
            </Text>
          </View>
          <Text style={s.sentenceText}>{after}</Text>
        </View>

        {/* 선택지 */}
        <View style={s.choicesGrid}>
          {currentQuestion.choices.map((word, idx) => {
            const state = choiceState(word);
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  s.choiceBtn,
                  __mbBtn && { minHeight: 54, paddingHorizontal: 20, borderRadius: 16, borderColor: '#E5DFF7' },
                  selected === word && !showAnswer && s.choiceBtnSelected,
                  state === 'correct' && s.choiceBtnCorrect,
                  state === 'wrong' && s.choiceBtnWrong,
                  state === 'revealed' && s.choiceBtnRevealed,
                ]}
                onPress={() => handleSelect(word)}
                activeOpacity={0.75}
                disabled={showModal || showAnswer}
              >
                <Text style={[
                  s.choiceText,
                  __mbBtn && { fontSize: 16.5 },
                  selected === word && !showAnswer && s.choiceTextSelected,
                  state === 'correct' && s.choiceTextCorrect,
                  state === 'wrong' && s.choiceTextWrong,
                  state === 'revealed' && s.choiceTextRevealed,
                ]}>
                  {word}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 오답 횟수 안내 */}
        {failCount > 0 && !isCorrect && !showAnswer && (
          <Text style={s.retryHint}>
            {pick(
              lang,
              `${FAIL_MAX - failCount}번의 기회가 남았어요`,
              `Còn ${FAIL_MAX - failCount} lần thử`,
            )}
          </Text>
        )}
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '확인', 'Xác nhận')}
          onPress={handleConfirm}
          disabled={!selected || showModal}
          size="lg"
        />
      </View>

      {/* 피드백 모달 */}
      <QuizFeedbackModal
        visible={showModal}
        isCorrect={isCorrect && !isRetry}
        answerText={currentQuestion.blankWord}
        explanation={currentQuestion.viText ?? ''}
        onNext={handleNextFromModal}
        onClose={handleNextFromModal}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
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
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center' },

  instruction: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },

  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.sm,
  },
  sentenceText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 32,
  },
  blankBox: {
    minWidth: 72,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blankFilled: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.sm,
    borderBottomWidth: 0,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  blankCorrect: {
    backgroundColor: colors.correctLight,
    borderRadius: radius.sm,
    borderBottomWidth: 0,
    borderWidth: 1.5,
    borderColor: colors.correct,
  },
  blankRevealed: {
    backgroundColor: '#FFF3F3',
    borderRadius: radius.sm,
    borderBottomWidth: 0,
    borderWidth: 1.5,
    borderColor: colors.wrong,
  },
  blankText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.muted,
    lineHeight: 28,
  },
  blankTextFilled: { color: colors.tealDark },
  blankTextCorrect: { color: colors.correct },
  blankTextRevealed: { color: colors.wrong },

  choicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  choiceBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    minWidth: '44%',
    alignItems: 'center',
    ...shadow.soft,
  },
  choiceBtnSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  choiceBtnCorrect: {
    borderColor: colors.correct,
    backgroundColor: colors.correctLight,
  },
  choiceBtnWrong: {
    borderColor: colors.wrong,
    backgroundColor: colors.wrongLight,
  },
  choiceBtnRevealed: {
    borderColor: colors.correct,
    backgroundColor: colors.correctLight,
  },
  choiceText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  choiceTextSelected: { color: colors.tealDark },
  choiceTextCorrect: { color: colors.correct },
  choiceTextWrong: { color: colors.wrong },
  choiceTextRevealed: { color: colors.correct },

  retryHint: {
    fontSize: 13,
    color: colors.wrong,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.md,
  },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
