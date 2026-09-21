import { useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { colors, radius } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';
import { MOCK_DIRECT_WRITING } from '../../data/lessonData';
import type { DirectWritingData } from '../../data/lessonData';

interface Props {
  data?: DirectWritingData;
  onComplete: (isCorrect: boolean) => void;
  onBack: () => void;
}

export function DirectWritingStage({ data = MOCK_DIRECT_WRITING, onComplete, onBack }: Props) {
  const { lang } = useLang();
  const [inputs, setInputs] = useState<string[]>(() => data.sentences.map(() => ''));
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<null | 'correct' | 'wrong'>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const allFilled = inputs.every(v => v.trim().length > 0);

  const onConfirm = () => {
    const allCorrect = data.sentences.every((s, i) =>
      inputs[i].trim() === s.koCorrectAnswer.trim()
    );
    setFeedback(allCorrect ? 'correct' : 'wrong');
  };

  const onFeedbackClose = () => {
    const wasCorrect = feedback === 'correct';
    setFeedback(null);
    onComplete(wasCorrect);
  };

  const focusCurrentLine = () => {
    const idx = inputs.findIndex(v => v.trim().length === 0);
    const target = idx === -1 ? inputs.length - 1 : idx;
    inputRefs.current[target]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ActivityHeader percentage={50} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleArea}>
          {data.title.ko ? <Text style={styles.titleKo}>{data.title.ko}</Text> : null}
          {data.title.vi ? <Text style={styles.titleVi}>{data.title.vi}</Text> : null}
        </View>

        {/* VI 문제 박스 */}
        <View style={styles.viBox}>
          {data.sentences.map(s => (
            <Text key={String(s.id)} style={styles.viBoxText}>{s.viTargetSentence}</Text>
          ))}
        </View>

        {/* KO 입력 라인 */}
        {data.sentences.map((sentence, idx) => (
          <View key={String(sentence.id)} style={styles.lineRow}>
            <TextInput
              ref={el => { inputRefs.current[idx] = el; }}
              style={[styles.textInput, focusedIdx === idx && styles.textInputFocused]}
              value={inputs[idx]}
              onChangeText={text => setInputs(prev => {
                const next = [...prev];
                next[idx] = text;
                return next;
              })}
              onFocus={() => setFocusedIdx(idx)}
              onBlur={() => setFocusedIdx(null)}
              returnKeyType={idx < data.sentences.length - 1 ? 'next' : 'done'}
              onSubmitEditing={() => {
                if (idx < data.sentences.length - 1) {
                  inputRefs.current[idx + 1]?.focus();
                }
              }}
              underlineColorAndroid="transparent"
            />
            {sentence.punctuation ? (
              <Text style={styles.punct}>{sentence.punctuation}</Text>
            ) : null}
          </View>
        ))}

        {/* 힌트 박스 */}
        {showHint ? (
          <View style={styles.hintBox}>
            <Text style={styles.hintHeader}>💡 {pick(lang, '힌트', 'Gợi ý')}</Text>
            {data.hintLines.map((line, i) => (
              <Text key={i} style={styles.hintText}>{line}</Text>
            ))}
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerRow}>
          <View style={styles.confirmWrap}>
            <CtaButton
              title={pick(lang, '확인', 'Xác nhận')}
              disabled={!allFilled}
              onPress={onConfirm}
            />
          </View>
          <TouchableOpacity
            style={[styles.hintBtn, showHint && styles.hintBtnActive]}
            onPress={() => setShowHint(v => !v)}
            activeOpacity={0.75}
          >
            <Text style={styles.hintBtnIcon}>💡</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.keyboardBtn} onPress={focusCurrentLine} activeOpacity={0.75}>
          <Text style={styles.keyboardBtnText}>
            ⌨️ {pick(lang, '키보드 사용하기', 'Dùng bàn phím')}
          </Text>
        </TouchableOpacity>
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 12 },

  titleArea: { paddingTop: 16, paddingBottom: 12 },
  titleKo: { fontSize: 22, fontWeight: '700', color: colors.ink },
  titleVi: { fontSize: 13, color: colors.muted, marginTop: 4 },

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
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: colors.ink,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.line,
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',
  } as any,
  textInputFocused: {
    borderBottomColor: colors.teal,
  },
  punct: { fontSize: 16, color: colors.muted, marginLeft: 6 },

  hintBox: {
    backgroundColor: colors.hintBg,
    borderWidth: 1,
    borderColor: colors.hintBorder,
    borderRadius: radius.md,
    padding: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  hintHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.hintText,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 14,
    color: colors.hintText,
    lineHeight: 22,
  },

  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  confirmWrap: { flex: 1 },
  hintBtn: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.hintBg,
    borderWidth: 1,
    borderColor: colors.hintBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBtnActive: {
    backgroundColor: colors.hintBorder,
  },
  hintBtnIcon: { fontSize: 24 },

  keyboardBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  keyboardBtnText: { fontSize: 14, color: colors.muted },

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
