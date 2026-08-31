import React, { useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors } from '../../theme';
import {
  PracticeCheckData,
  PracticeCheckPart,
  MOCK_PRACTICE_CHECK,
} from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: PracticeCheckData;
}

type Picks = Record<string, string>;

function blankKey(lineIdx: number, partIdx: number) {
  return `${lineIdx}-${partIdx}`;
}

function isBlank(part: PracticeCheckPart): part is { options: string[]; answer: string } {
  return typeof part === 'object';
}

// ─── Bubble with inline choice chips ─────────────────────────────────────────
function PracticeCheckBubble({
  line,
  lineIdx,
  picks,
  submitted,
  onPick,
}: {
  line: { speakerSide: 'A' | 'B'; parts: PracticeCheckPart[] };
  lineIdx: number;
  picks: Picks;
  submitted: boolean;
  onPick: (key: string, val: string) => void;
}) {
  const isA = line.speakerSide === 'A';
  return (
    <View style={[styles.bubbleRow, isA ? styles.bubbleRowA : styles.bubbleRowB]}>
      <View style={[styles.bubble, isA ? styles.bubbleA : styles.bubbleB]}>
        {/* flex-wrap row: text spans + chip groups */}
        <View style={styles.partsRow}>
          {line.parts.map((part, pi) => {
            if (!isBlank(part)) {
              return <Text key={pi} style={styles.partText}>{part}</Text>;
            }
            const key = blankKey(lineIdx, pi);
            const chosen = picks[key];
            return (
              <View key={pi} style={styles.chipGroup}>
                {part.options.map((opt, oi) => {
                  let bg = isA ? colors.teal : colors.amber;
                  if (!submitted && chosen === opt) bg = isA ? colors.tealDark : '#b07a20';
                  if (submitted && chosen === opt) {
                    bg = opt === part.answer ? colors.correct : colors.wrong;
                  }
                  return (
                    <TouchableOpacity
                      key={oi}
                      style={[styles.chip, { backgroundColor: bg }]}
                      onPress={submitted ? undefined : () => onPick(key, opt)}
                      disabled={submitted}
                      activeOpacity={0.75}
                    >
                      <Text style={styles.chipText}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function PracticeCheckStage({ onNext, onBack, data }: Props) {
  const d = data ?? MOCK_PRACTICE_CHECK;
  const { lang } = useLang();

  const [screenIndex, setScreenIndex] = useState(0);
  const [picks, setPicks] = useState<Picks>({});
  const [submitted, setSubmitted] = useState(false);
  const panelY = useRef(new Animated.Value(300)).current;

  const screen = d.screens[screenIndex];
  const total = d.screens.length;
  const percentage = Math.round((screenIndex / total) * 100);

  // collect all blanks for this screen
  const blanks: [number, number][] = [];
  screen.lines.forEach((ln, li) => {
    ln.parts.forEach((pt, pi) => { if (isBlank(pt)) blanks.push([li, pi]); });
  });
  const allChosen = blanks.every(([li, pi]) => picks[blankKey(li, pi)]);

  // wrong lines
  const wrongLines = screen.lines.filter((ln, li) =>
    ln.parts.some((pt, pi) => isBlank(pt) && picks[blankKey(li, pi)] !== pt.answer)
  );
  const allCorrect = submitted && wrongLines.length === 0;

  function lineText(ln: { parts: PracticeCheckPart[] }) {
    return ln.parts.map(pt => (isBlank(pt) ? pt.answer : pt)).join('').replace(/\s+/g, ' ').trim();
  }

  function handleSubmit() {
    setSubmitted(true);
    Animated.spring(panelY, { toValue: 0, useNativeDriver: true }).start();
  }

  function handleRetry() {
    setPicks({});
    setSubmitted(false);
    panelY.setValue(300);
  }

  function handleNext() {
    if (screenIndex < total - 1) {
      setScreenIndex(i => i + 1);
      setPicks({});
      setSubmitted(false);
      panelY.setValue(300);
    } else {
      onNext();
    }
  }

  const title = pick(lang, d.titleKo, d.titleVi);

  return (
    <View style={styles.root}>
      <ActivityHeader percentage={percentage} onClose={onBack} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* 배지 */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>실전 확인 · {screenIndex + 1}/{total}</Text>
          </View>
        </View>

        {/* 제목 */}
        <Text style={styles.title}>{title}</Text>

        {/* 대화 라인 */}
        <View style={styles.chatArea}>
          {screen.lines.map((ln, li) => (
            <PracticeCheckBubble
              key={li}
              line={ln}
              lineIdx={li}
              picks={picks}
              submitted={submitted}
              onPick={(key, val) => setPicks(p => ({ ...p, [key]: val }))}
            />
          ))}
        </View>
      </ScrollView>

      {/* 고정 footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmBtn, (!allChosen || submitted) && styles.confirmBtnDisabled]}
          onPress={handleSubmit}
          disabled={!allChosen || submitted}
        >
          <Text style={styles.confirmBtnText}>확인</Text>
        </TouchableOpacity>
      </View>

      {/* 피드백 패널 */}
      {submitted && (
        <Animated.View
          style={[
            styles.panel,
            allCorrect ? styles.panelCorrect : styles.panelWrong,
            { transform: [{ translateY: panelY }] },
          ]}
        >
          <View style={styles.panelHeader}>
            <Text style={styles.panelIcon}>{allCorrect ? '✓' : '✗'}</Text>
            <Text style={[styles.panelTitle, allCorrect ? styles.panelTitleCorrect : styles.panelTitleWrong]}>
              {allCorrect ? '정답이에요' : '틀린 부분을 확인해 보세요'}
            </Text>
          </View>
          {!allCorrect && wrongLines.map((ln, i) => (
            <Text key={i} style={styles.panelAnswer}>{lineText(ln)}</Text>
          ))}
          <View style={styles.panelBtns}>
            {!allCorrect && (
              <TouchableOpacity style={[styles.panelBtn, styles.panelBtnOutline]} onPress={handleRetry}>
                <Text style={styles.panelBtnOutlineText}>다시하기</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.panelBtn, allCorrect ? styles.panelBtnFillCorrect : styles.panelBtnFill]}
              onPress={handleNext}
            >
              <Text style={styles.panelBtnFillText}>
                {screenIndex < total - 1 ? '다음' : '완료'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  badgeRow: { marginBottom: 12 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  title: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 20 },

  chatArea: { gap: 10 },

  bubbleRow: { flexDirection: 'row', marginBottom: 2 },
  bubbleRowA: { justifyContent: 'flex-start' },
  bubbleRowB: { justifyContent: 'flex-end' },

  bubble: {
    maxWidth: '90%',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bubbleA: { backgroundColor: colors.tealSoft, borderTopLeftRadius: 4 },
  bubbleB: { backgroundColor: colors.warningLight, borderTopRightRadius: 4 },
  partsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 },
  partText: { fontSize: 15, color: colors.ink, lineHeight: 28 },

  chipGroup: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  chip: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: { color: colors.surface, fontWeight: '700', fontSize: 14 },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
    backgroundColor: colors.canvas,
  },
  confirmBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmBtnText: { fontSize: 16, fontWeight: '700', color: colors.surface },

  panel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  panelCorrect: { backgroundColor: colors.correctLight },
  panelWrong: { backgroundColor: colors.wrongLight },

  panelHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 },
  panelIcon: { fontSize: 20, fontWeight: '800' },
  panelTitle: { fontSize: 16, fontWeight: '700' },
  panelTitleCorrect: { color: colors.correct },
  panelTitleWrong: { color: colors.wrong },

  panelAnswer: { fontSize: 14, color: colors.ink, marginBottom: 4, paddingLeft: 4 },

  panelBtns: { flexDirection: 'row', gap: 12, marginTop: 16 },
  panelBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  panelBtnOutline: { borderWidth: 2, borderColor: colors.teal },
  panelBtnOutlineText: { color: colors.teal, fontWeight: '700', fontSize: 15 },
  panelBtnFill: { backgroundColor: colors.teal },
  panelBtnFillCorrect: { backgroundColor: colors.correct },
  panelBtnFillText: { color: colors.surface, fontWeight: '700', fontSize: 15 },
});
