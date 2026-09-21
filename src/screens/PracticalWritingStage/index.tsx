import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { colors, radius } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';
import { MOCK_PRACTICAL_WRITING } from '../../data/lessonData';
import type { PracticalWritingData } from '../../data/lessonData';

interface Props {
  data?: PracticalWritingData;
  onComplete: (isCorrect: boolean) => void;
  onBack: () => void;
}

type BankChip = { id: string; text: string };
type SlotEntry = { chipId: string; text: string };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PracticalWritingStage({ data = MOCK_PRACTICAL_WRITING, onComplete, onBack }: Props) {
  const { lang } = useLang();

  const [lineSlots, setLineSlots] = useState<SlotEntry[][]>(() => data.sentences.map(() => []));
  const [bankChips, setBankChips] = useState<BankChip[]>(() =>
    shuffle(data.wordBank.map(c => ({ id: String(c.id), text: c.text })))
  );
  const [feedback, setFeedback] = useState<null | 'correct' | 'wrong'>(null);

  const activeLineIdx = data.sentences.findIndex((s, i) => lineSlots[i].length < s.koCorrectTokens.length);
  const allDone = activeLineIdx === -1;

  const usedChipIds = new Set(lineSlots.flat().map(e => e.chipId));

  const onBankChipTap = (chip: BankChip) => {
    if (activeLineIdx === -1 || usedChipIds.has(chip.id)) return;
    setLineSlots(prev => {
      const next = prev.map(s => [...s]);
      next[activeLineIdx] = [...next[activeLineIdx], { chipId: chip.id, text: chip.text }];
      return next;
    });
  };

  const onSlotTap = (lineIdx: number, slotPos: number) => {
    setLineSlots(prev => {
      const next = prev.map(s => [...s]);
      next[lineIdx] = next[lineIdx].filter((_, i) => i !== slotPos);
      return next;
    });
  };

  const onConfirm = () => {
    const allCorrect = data.sentences.every((s, i) =>
      lineSlots[i].map(e => e.text).join('') === s.koCorrectTokens.join('')
    );
    setFeedback(allCorrect ? 'correct' : 'wrong');
  };

  const onFeedbackClose = () => {
    const wasCorrect = feedback === 'correct';
    setFeedback(null);
    onComplete(wasCorrect);
  };

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={50} onClose={onBack} />

      <View style={styles.titleArea}>
        {data.title.ko ? <Text style={styles.titleKo}>{data.title.ko}</Text> : null}
        {data.title.vi ? <Text style={styles.titleVi}>{data.title.vi}</Text> : null}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* VI 문제 박스 — 전체 문장 묶음 */}
        <View style={styles.viBox}>
          {data.sentences.map(s => (
            <Text key={String(s.id)} style={styles.viBoxText}>{s.viTargetSentence}</Text>
          ))}
        </View>

        {/* KO 슬롯 라인 */}
        {data.sentences.map((sentence, lineIdx) => {
          const isActive = lineIdx === activeLineIdx;
          return (
            <View key={String(sentence.id)} style={styles.lineRow}>
              <View style={[styles.slotArea, isActive && styles.slotAreaActive]}>
                {lineSlots[lineIdx].map((entry, slotPos) => (
                  <TouchableOpacity
                    key={entry.chipId}
                    style={styles.filledChip}
                    onPress={() => onSlotTap(lineIdx, slotPos)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.filledChipText}>{entry.text}</Text>
                    <Text style={styles.filledChipX}> ×</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {sentence.punctuation ? (
                <Text style={styles.punct}>{sentence.punctuation}</Text>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bankArea}>
        <View style={styles.bankWrap}>
          {bankChips.map(chip => {
            const isUsed = usedChipIds.has(chip.id);
            return (
              <TouchableOpacity
                key={chip.id}
                style={[styles.bankChip, isUsed && styles.bankChipUsed]}
                onPress={() => onBankChipTap(chip)}
                activeOpacity={isUsed ? 1 : 0.75}
                disabled={isUsed}
              >
                <Text style={[styles.bankChipText, isUsed && styles.bankChipTextUsed]}>{chip.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <CtaButton
          title={pick(lang, '다음 →', 'Tiếp theo →')}
          disabled={!allDone}
          onPress={onConfirm}
        />
      </View>

      {feedback ? (
        <TouchableOpacity style={styles.overlay} onPress={onFeedbackClose} activeOpacity={1}>
          <View style={[styles.feedbackSheet, feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong]}>
            <Text style={styles.feedbackEmoji}>{feedback === 'correct' ? '🎉' : '😅'}</Text>
            <Text style={styles.feedbackTitle}>
              {feedback === 'correct'
                ? pick(lang, '정답이에요!', 'Chính xác!')
                : pick(lang, '다시 확인해보세요', 'Hãy xem lại nhé')}
            </Text>
            <Text style={styles.feedbackSub}>{pick(lang, '탭하여 계속', 'Nhấn để tiếp tục')}</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },

  titleArea: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12 },
  titleKo: { fontSize: 22, fontWeight: '700', color: colors.ink },
  titleVi: { fontSize: 13, color: colors.muted, marginTop: 4 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 12 },

  // VI 문제 박스: teal 테두리, 흰 배경, 전체 문장 묶음
  viBox: {
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    padding: 16,
    marginBottom: 20,
    gap: 2,
  },
  viBoxText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 26,
  },

  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    minHeight: 40,
  },
  slotArea: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
    paddingBottom: 6,
    minHeight: 36,
  },
  slotAreaActive: { borderBottomColor: colors.teal },

  filledChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.teal,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  filledChipText: { fontSize: 14, fontWeight: '600', color: colors.surface },
  filledChipX: { fontSize: 14, color: colors.surface, opacity: 0.8 },

  punct: { fontSize: 16, color: colors.muted, marginLeft: 6 },

  bankArea: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  bankWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bankChip: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.surface,
  },
  bankChipUsed: { borderColor: '#C8D0D8', backgroundColor: '#F0F2F4', opacity: 0.5 },
  bankChipText: { fontSize: 14, fontWeight: '500', color: colors.ink },
  bankChipTextUsed: { color: '#A0ACB8' },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  feedbackSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  feedbackCorrect: { backgroundColor: colors.correctLight },
  feedbackWrong: { backgroundColor: colors.wrongLight },
  feedbackEmoji: { fontSize: 40, marginBottom: 8 },
  feedbackTitle: { fontSize: 20, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  feedbackSub: { fontSize: 13, color: colors.muted },
});
