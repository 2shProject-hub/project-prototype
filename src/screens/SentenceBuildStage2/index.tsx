import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
} from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { SESSION1 } from '../../data/lessonData';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

type Feedback = null | 'correct' | 'retry' | 'wrong';
type InputMode = 'tile' | 'keyboard';

const FAIL_MAX = 2;
const QUIZ_LIST = SESSION1.sentenceBuildQuiz;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SentenceBuildStage2({ onComplete, onBack }: Props) {
  const { lang } = useLang();
  const { theme: __mbBT, enabled: __mbBE } = useTheme();
  const __mbBtn = __mbBE && __mbBT.id === 'malhaeboka' ? { height: 40, minHeight: 0, paddingVertical: 0, justifyContent: 'center' as const } : null;
  const sfx = useSfx();

  const [quizIdx, setQuizIdx] = useState(0);
  const [shuffledTiles, setShuffledTiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [failCount, setFailCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [inputMode, setInputMode] = useState<InputMode>('tile');
  const [keyboardText, setKeyboardText] = useState('');

  const quiz = QUIZ_LIST[quizIdx];
  const totalSlots = quiz.answerWords.length;
  const allFilled = selected.length === totalSlots;

  useEffect(() => {
    setShuffledTiles(shuffle([...quiz.answerWords, ...quiz.distractors]));
    setSelected([]);
    setFailCount(0);
    setFeedback(null);
    setShowHint(false);
    setInputMode('tile');
    setKeyboardText('');
  }, [quizIdx]);

  const onTileTap = (tileIdx: number) => {
    if (selected.includes(tileIdx) || selected.length >= totalSlots) return;
    setSelected(prev => [...prev, tileIdx]);
  };

  const onAnswerWordTap = (pos: number) => {
    setSelected(prev => prev.filter((_, i) => i !== pos));
  };

  const checkAnswer = (answer: string) => {
    const isCorrect = answer.trim() === quiz.ko;
    if (isCorrect) {
      sfx.play('correct'); setFeedback('correct');
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      sfx.play('incorrect'); setFeedback(newFail >= FAIL_MAX ? 'wrong' : 'retry');
    }
  };

  const onTileConfirm = () => {
    checkAnswer(selected.map(i => shuffledTiles[i]).join(''));
  };

  const onKeyboardConfirm = () => {
    checkAnswer(keyboardText.trim());
  };

  const onFeedbackClose = () => {
    if (feedback === 'correct' || feedback === 'wrong') {
      setFeedback(null);
      if (quizIdx + 1 >= QUIZ_LIST.length) {
        onComplete();
      } else {
        setQuizIdx(q => q + 1);
      }
    } else {
      setSelected([]);
      setKeyboardText('');
      setFeedback(null);
    }
  };

  const switchMode = (mode: InputMode) => {
    setInputMode(mode);
    setSelected([]);
    setKeyboardText('');
  };

  const progressPct = ((quizIdx + 1) / QUIZ_LIST.length) * 100;

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={progressPct} onClose={onBack}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{quizIdx + 1} / {QUIZ_LIST.length}</Text>
        </View>
      </ActivityHeader>

      {/* ── 지시문 ── */}
      <Text style={styles.instruction}>
        {pick(lang, '다음 문장을 해석하세요', 'Hãy dịch câu sau')}
      </Text>

      {/* ── 베트남어 지문 카드 ── */}
      <View style={styles.promptCard}>
        <Text style={styles.promptText}>{quiz.vi}</Text>
      </View>

      {/* ── 답 영역 (언더라인) ── */}
      <View style={styles.answerArea}>
        {inputMode === 'tile' ? (
          selected.length === 0 ? (
            <View style={styles.answerUnderline} />
          ) : (
            <View style={styles.answerWordsRow}>
              {selected.map((tileIdx, pos) => (
                <TouchableOpacity
                  key={pos}
                  style={styles.answerWordPill}
                  onPress={() => onAnswerWordTap(pos)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.answerWordText}>{shuffledTiles[tileIdx]}</Text>
                  <Text style={styles.answerWordRemove}>×</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.answerUnderlineFill} />
            </View>
          )
        ) : (
          <TextInput
            style={styles.keyboardInput}
            value={keyboardText}
            onChangeText={setKeyboardText}
            placeholder={pick(lang, '한국어 문장을 입력하세요', 'Nhập câu tiếng Hàn')}
            autoFocus
          />
        )}
      </View>

      {/* ── 힌트 ── */}
      {showHint && (
        <View style={styles.hintBox}>
          <ThemedGlyph style={styles.hintLabel} glyph="💡" /><Text style={styles.hintLabel}> {pick(lang, '힌트', 'Gợi ý')}</Text>
          <Text style={styles.hintText}>{quiz.ko}</Text>
        </View>
      )}

      <View style={styles.spacer} />

      {/* ── 타일 ── */}
      {inputMode === 'tile' && (
        <View style={styles.tilesRow}>
          {shuffledTiles.map((word, i) => {
            const isUsed = selected.includes(i);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.tile, isUsed && styles.tileUsed]}
                onPress={() => onTileTap(i)}
                activeOpacity={isUsed ? 1 : 0.75}
                disabled={isUsed}
              >
                <Text style={[styles.tileText, isUsed && styles.tileTextUsed]}>{word}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ── Footer ── */}
      <View style={[styles.footer, __mbBtn && { paddingBottom: 2, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 }]}>
        <View style={[styles.footerRow, __mbBtn && { flex: 1 }]}>
          <View style={{ flex: 1 }}>
            {inputMode === 'tile' ? (
              <CtaButton
                title={pick(lang, '확인', 'Xác nhận')}
                onPress={onTileConfirm}
                disabled={!allFilled}
                size="lg"
              />
            ) : (
              <CtaButton
                title={pick(lang, '확인', 'Xác nhận')}
                onPress={onKeyboardConfirm}
                disabled={!keyboardText.trim()}
                size="lg"
              />
            )}
          </View>

          <TouchableOpacity
            style={[styles.hintBtn, __mbBtn && { height: 40, width: 40, borderRadius: 20, backgroundColor: '#EFEAFF', borderColor: '#DDD2F7' }]}
            onPress={() => setShowHint(h => !h)}
            activeOpacity={0.8}
          >
            <ThemedGlyph style={styles.hintBtnIcon} glyph="💡" />
            {!showHint && <View style={styles.hintBtnBadge} />}
          </TouchableOpacity>
        </View>

        {inputMode === 'tile' ? (
          <TouchableOpacity style={[styles.modeBtn, __mbBtn, __mbBtn && { width: 40, height: 40, borderRadius: 20, paddingHorizontal: 0, paddingVertical: 0, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#EFEAFF', borderColor: '#DDD2F7', flexShrink: 0, marginTop: 0, alignSelf: 'auto' as const }]} onPress={() => switchMode('keyboard')} activeOpacity={0.7}>
            {__mbBtn ? <ThemedGlyph glyph="⌨" style={{ fontSize: 20 }} /> : <Text style={styles.modeBtnText}>⌨ {pick(lang, '키보드 사용하기', 'Dùng bàn phím')}</Text>}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.modeBtn, __mbBtn, __mbBtn && { width: 40, height: 40, borderRadius: 20, paddingHorizontal: 0, paddingVertical: 0, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#EFEAFF', borderColor: '#DDD2F7', flexShrink: 0, marginTop: 0, alignSelf: 'auto' as const }]} onPress={() => switchMode('tile')} activeOpacity={0.7}>
            {__mbBtn ? <ThemedGlyph glyph="🃏" style={{ fontSize: 20 }} /> : <Text style={styles.modeBtnText}>🃏 {pick(lang, '단어 카드로 풀기', 'Dùng thẻ từ')}</Text>}
          </TouchableOpacity>
        )}
      </View>

      {/* ── 피드백 모달 (absolute — 에뮬레이터 프레임 안에 표시) ── */}
      {feedback !== null && (
        <View style={[styles.modalBackdrop, __mbBtn && { backgroundColor: 'rgba(22,20,32,0.06)' }]}>
          <View style={styles.modalSheet}>
            {feedback === 'correct' && (
              <>
                <Text style={styles.modalEmoji}>✅</Text>
                <Text style={styles.modalTitle}>{pick(lang, '정답이에요!', 'Chính xác!')}</Text>
                <Text style={styles.modalAnswer}>{quiz.ko}  ·  {quiz.vi}</Text>
                <TouchableOpacity style={styles.modalBtn} onPress={onFeedbackClose} activeOpacity={0.85}>
                  <Text style={styles.modalBtnText}>{pick(lang, '다음', 'Tiếp theo')}</Text>
                </TouchableOpacity>
              </>
            )}
            {feedback === 'retry' && (
              <>
                <Text style={styles.modalEmoji}>❌</Text>
                <Text style={styles.modalTitle}>{pick(lang, '다시 해봐요', 'Thử lại nhé')}</Text>
                <Text style={styles.modalSub}>
                  {pick(lang, `${FAIL_MAX - failCount}번의 기회가 남았어요`, `Còn ${FAIL_MAX - failCount} lần thử`)}
                </Text>
                <TouchableOpacity style={styles.modalBtn} onPress={onFeedbackClose} activeOpacity={0.85}>
                  <Text style={styles.modalBtnText}>{pick(lang, '다시 시도', 'Thử lại')}</Text>
                </TouchableOpacity>
              </>
            )}
            {feedback === 'wrong' && (
              <>
                <Text style={styles.modalEmoji}>❌</Text>
                <Text style={styles.modalTitle}>{pick(lang, '다시 한번 생각해 보세요', 'Hãy thử nghĩ lại nhé')}</Text>
                
                <TouchableOpacity style={styles.modalBtn} onPress={onFeedbackClose} activeOpacity={0.85}>
                  <Text style={styles.modalBtnText}>{pick(lang, '다음', 'Tiếp theo')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  // ── Header ──
  stepBadge: {
    position: 'absolute', right: 52,
    paddingHorizontal: 8, paddingVertical: 2,
    backgroundColor: colors.tealSoft, borderRadius: 10,
  },
  stepText: { fontSize: 11, fontWeight: '700', color: colors.teal },

  // ── Instruction ──
  instruction: {
    marginHorizontal: 20, marginTop: 12, marginBottom: 16,
    fontSize: 15, fontWeight: '600', color: colors.ink, textAlign: 'center',
  },

  // ── 지문 카드 ──
  promptCard: {
    marginHorizontal: 20,
    borderRadius: 16, borderWidth: 1.5, borderColor: colors.teal,
    backgroundColor: '#FFFFFF',
    paddingVertical: 20, paddingHorizontal: 20,
    alignItems: 'center', justifyContent: 'center',
    minHeight: 80,
    ...shadow.card,
  },
  promptText: {
    fontSize: 18, fontWeight: '700', color: colors.ink,
    textAlign: 'center', lineHeight: 28,
  },

  // ── 답 영역 ──
  answerArea: {
    marginHorizontal: 20, marginTop: 24, minHeight: 44, justifyContent: 'flex-end',
  },
  answerUnderline: {
    height: 2, backgroundColor: colors.teal, borderRadius: 1,
  },
  answerWordsRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'flex-end',
    paddingBottom: 6, borderBottomWidth: 2, borderBottomColor: colors.teal,
  },
  answerUnderlineFill: { flex: 1, height: 2 },
  answerWordPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: colors.tealSoft, borderWidth: 1, borderColor: colors.teal,
    borderRadius: 16, paddingHorizontal: 9, paddingVertical: 4,
  },
  answerWordText: { fontSize: 15, fontWeight: '700', color: colors.teal },
  answerWordRemove: { fontSize: 13, color: colors.teal, fontWeight: '400' },
  keyboardInput: {
    borderWidth: 0, borderBottomWidth: 2, borderBottomColor: colors.teal,
    paddingHorizontal: 4, paddingVertical: 8,
    fontSize: 16, color: colors.ink, backgroundColor: 'transparent',
  },

  // ── 힌트 ──
  hintBox: {
    marginHorizontal: 20, marginTop: 12,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFBEB', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  hintLabel: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  hintText: { fontSize: 13, color: '#78350F', fontWeight: '500', flex: 1 },

  spacer: { flex: 1 },

  // ── 타일 ──
  tilesRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: 8, paddingHorizontal: 20, paddingBottom: 16,
  },
  tile: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 22, borderWidth: 1.5, borderColor: '#1A2B3C', backgroundColor: '#FFFFFF',
  },
  tileUsed: { borderColor: '#C8D0D8', backgroundColor: '#F0F2F4', opacity: 0.5 },
  tileText: { fontSize: 15, fontWeight: '600', color: '#1A2B3C' },
  tileTextUsed: { color: '#A0ACB8' },

  // ── Footer ──
  footer: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  footerRow: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  ctaBtn: {
    backgroundColor: colors.teal, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center', justifyContent: 'center',
  },
  ctaBtnFlex: { flex: 1 },
  ctaBtnDisabled: { backgroundColor: '#B0C8C8' },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hintBtn: {
    width: 52, borderRadius: 14,
    backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  hintBtnIcon: { fontSize: 20 },
  hintBtnBadge: {
    position: 'absolute', top: 6, right: 6,
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B',
  },
  modeBtn: {
    alignItems: 'center', paddingVertical: 10, borderRadius: 14,
    borderWidth: 1, borderColor: colors.line,
  },
  modeBtnText: { fontSize: 13, color: colors.muted, fontWeight: '600' },

  // ── Feedback Modal ──
  modalBackdrop: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 24, paddingTop: 28, paddingBottom: 36,
    alignItems: 'center', gap: 12,
  },
  modalEmoji: { fontSize: 48 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  modalSub: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  modalAnswerBox: { alignItems: 'center', gap: 4 },
  modalAnswerLabel: { fontSize: 12, fontWeight: '600', color: colors.muted },
  modalAnswer: { fontSize: 18, fontWeight: '700', color: colors.teal, textAlign: 'center' },
  modalBtn: {
    marginTop: 8, width: '100%', backgroundColor: colors.teal,
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
