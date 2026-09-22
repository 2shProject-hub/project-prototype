/**
 * 단어에 맞는 한국어 쓰기 (WordTextBlankStage)
 * - WordLetterBlank 기반, AudioPlayButton → 텍스트 표시 카드로 교체
 * - displayText: KO 또는 VI 단어 노출, tiles는 항상 한국어 글자
 */
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton, QuizFeedbackModal } from '../../components';
import { useSfx } from '../../hooks/useSfx';
import { MOCK_WORD_TEXT_BLANK } from '../../data/lessonData';
import type { WordTextBlankQuestion } from '../../data/lessonData';

interface Props {
  questions?: WordTextBlankQuestion[];
  onNext?: () => void;
  onBack?: () => void;
  currentSetNumber?: number;
  totalSets?: number;
}

export function WordTextBlankStage({
  questions = MOCK_WORD_TEXT_BLANK,
  onNext,
  onBack,
  currentSetNumber = 1,
  totalSets = 1,
}: Props) {
  const { lang } = useLang();
  const sfx = useSfx();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [usedTileIndices, setUsedTileIndices] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentQuestion = questions[currentIdx];
  if (!currentQuestion) {
    return (
      <View style={s.root}>
        <Text style={s.emptyText}>{pick(lang, '문제가 없습니다', 'Không có câu hỏi')}</Text>
      </View>
    );
  }

  const handleSelectTile = (tileIndex: number) => {
    if (usedTileIndices.has(tileIndex)) return;
    if (selectedTiles.length >= currentQuestion.slots.length) return;
    const next = new Set(usedTileIndices);
    next.add(tileIndex);
    setUsedTileIndices(next);
    setSelectedTiles([...selectedTiles, currentQuestion.tiles[tileIndex]]);
  };

  const handleRemoveTile = (slotIndex: number) => {
    const newSelected = [...selectedTiles];
    const removedTile = newSelected.splice(slotIndex, 1)[0];
    const tileIndex = currentQuestion.tiles.indexOf(removedTile);
    const next = new Set(usedTileIndices);
    next.delete(tileIndex);
    setSelectedTiles(newSelected);
    setUsedTileIndices(next);
  };

  const handleConfirm = () => {
    if (selectedTiles.length !== currentQuestion.slots.length) return;
    const correct = selectedTiles.join('') === currentQuestion.answer;
    setIsCorrect(correct);
    setShowModal(true);
    sfx.play(correct ? 'correct' : 'wrong');
  };

  const handleNextFromModal = () => {
    setShowModal(false);
    if (isCorrect) {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedTiles([]);
        setUsedTileIndices(new Set());
      } else {
        onNext?.();
      }
    } else {
      setSelectedTiles([]);
      setUsedTileIndices(new Set());
    }
  };

  const progressPct = (currentSetNumber / totalSets) * 100;
  const isFilled = selectedTiles.length === currentQuestion.slots.length;

  return (
    <View style={s.root}>
      <ActivityHeader percentage={progressPct} onClose={onBack || (() => {})} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* 타이틀 */}
        <View style={s.titleBox}>
          <Text style={s.title}>
            {pick(lang, '단어에 맞는 한국어를 써 보세요.', 'Hãy viết tiếng Hàn phù hợp với từ dưới đây.')}
          </Text>
          <Text style={s.subtitle}>
            {pick(lang, 'Hãy viết tiếng Hàn phù hợp với từ dưới đây.', '단어에 맞는 한국어를 써 보세요.')}
          </Text>
        </View>

        {/* 텍스트 표시 카드 */}
        <View style={s.displayCard}>
          <Text style={s.displayText}>{currentQuestion.displayText}</Text>
        </View>

        {/* 빈칸 보드 */}
        <View style={s.boardContainer}>
          <View style={s.slotsContainer}>
            {currentQuestion.slots.map((_, idx) => {
              const filledValue = selectedTiles[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  style={[s.slot, filledValue !== undefined && s.slotFilled]}
                  onPress={() => handleRemoveTile(idx)}
                  disabled={filledValue === undefined}
                  activeOpacity={0.7}
                >
                  <Text style={[s.slotText, filledValue !== undefined && s.slotTextFilled]}>
                    {filledValue ?? ''}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={s.boardHintText}>
            {pick(lang, '글자를 탭하여 빈칸에 채우세요', 'Chạm vào chữ để điền vào chỗ trống')}
          </Text>
        </View>

        {/* 글자 타일 */}
        <View style={s.tilesContainer}>
          {currentQuestion.tiles.map((tile, idx) => {
            const isUsed = usedTileIndices.has(idx);
            return (
              <TouchableOpacity
                key={idx}
                style={[s.tile, isUsed && s.tileUsed]}
                onPress={() => handleSelectTile(idx)}
                disabled={isUsed}
                activeOpacity={0.7}
              >
                <Text style={[s.tileText, isUsed && s.tileTextUsed]}>{tile}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* 하단 확인 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '확인', 'Xác nhận')}
          onPress={handleConfirm}
          disabled={!isFilled}
          size="lg"
        />
      </View>

      <QuizFeedbackModal
        visible={showModal}
        isCorrect={isCorrect}
        answerText={isCorrect ? currentQuestion.answer : undefined}
        explanation={currentQuestion.desc}
        onNext={handleNextFromModal}
        onClose={() => setShowModal(false)}
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
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center' },

  titleBox: { marginBottom: spacing.lg },
  title: { fontSize: 18, fontWeight: '800', color: colors.ink },
  subtitle: { fontSize: 14, fontWeight: '600', color: colors.muted, marginTop: spacing.xs },

  // 텍스트 표시 카드 — 기존 speechResult/culture 토큰 활용
  displayCard: {
    backgroundColor: colors.speechResultBg,
    borderWidth: 1.5,
    borderColor: colors.cultureBorder,
    borderRadius: radius.xl,
    paddingVertical: 22,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadow.soft,
  },
  displayText: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.speechResultText,
    textAlign: 'center',
  },

  // 빈칸 보드 (WordLetterBlank 동일)
  boardContainer: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  slotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  slot: {
    width: 54, height: 58,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.teal,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgSubtle,
  },
  slotFilled: {
    borderStyle: 'solid',
    backgroundColor: colors.tealSoft,
    borderColor: colors.tealDark,
  },
  slotText: { fontSize: 22, fontWeight: '800', color: colors.textMuted },
  slotTextFilled: { color: colors.tealDark },
  boardHintText: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },

  // 글자 타일 (WordLetterBlank 동일)
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  tile: {
    minWidth: 54, height: 54,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  tileUsed: {
    backgroundColor: colors.bgDisabled,
    borderColor: colors.borderLight,
    opacity: 0.5,
  },
  tileText: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  tileTextUsed: { color: colors.textDisabled },

  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
