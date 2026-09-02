import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  Animated, Easing,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { SESSION1, WORD_BUILD_DISTRACTOR_COUNT } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useSfx } from '../../hooks/useSfx';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

type Speed = '0.5' | '1.0' | '1.5';
type Feedback = null | 'correct' | 'retry' | 'wrong';

const FAIL_MAX = 2;
const QUIZ_LIST = SESSION1.wordBuildQuiz;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function WordBuildStage({ onComplete, onBack }: Props) {
  const { lang } = useLang();
  const { theme: __mbBT, enabled: __mbBE } = useTheme();
  const __mbBtn = __mbBE && __mbBT.id === 'malhaeboka' ? { height: 40, minHeight: 0, paddingVertical: 0, justifyContent: 'center' as const } : null;
  const sfx = useSfx();

  const [quizIdx, setQuizIdx] = useState(0);
  const [shuffledTiles, setShuffledTiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);   // indices into shuffledTiles
  const [speed, setSpeed] = useState<Speed>('1.0');
  const [showSpeedPicker, setShowSpeedPicker] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [failCount, setFailCount] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [keyboardText, setKeyboardText] = useState('');

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const quiz = QUIZ_LIST[quizIdx];
  const syllables = quiz.ko.split('');
  const totalSlots = syllables.length;
  const allFilled = selected.length === totalSlots;

  // ── 퀴즈 초기화 ──────────────────────────────────────────────
  useEffect(() => {
    const pool = [...syllables, ...quiz.distractors.slice(0, WORD_BUILD_DISTRACTOR_COUNT)];
    setShuffledTiles(shuffle(pool));
    setSelected([]);
    setFailCount(0);
    setFeedback(null);
    setShowHint(false);
    setShowKeyboard(false);
    setKeyboardText('');
    setIsPlaying(false);
  }, [quizIdx]);

  // ── 음원 재생 시뮬레이션 ──────────────────────────────────────
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 350, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 350, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ]),
      ).start();

      const playDuration = speed === '0.5' ? 2400 : speed === '1.5' ? 800 : 1200;
      playTimerRef.current = setTimeout(() => {
        setIsPlaying(false);
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
      }, playDuration);
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    }
    return () => { if (playTimerRef.current) clearTimeout(playTimerRef.current); };
  }, [isPlaying]);

  // ── 타일 선택 ──────────────────────────────────────────────────
  const onTileTap = (tileIdx: number) => {
    if (selected.includes(tileIdx)) return;
    if (selected.length >= totalSlots) return;
    setSelected(prev => [...prev, tileIdx]);
  };

  const onSlotTap = (slotPos: number) => {
    setSelected(prev => prev.filter((_, i) => i !== slotPos));
  };

  // ── 확인 ──────────────────────────────────────────────────────
  const onConfirm = () => {
    const built = selected.map(i => shuffledTiles[i]).join('');
    if (built === quiz.ko) {
      sfx.play('correct');
      setFeedback('correct');
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      sfx.play('incorrect');
      setFeedback(newFail >= FAIL_MAX ? 'wrong' : 'retry');
    }
  };

  const onFeedbackClose = () => {
    if (feedback === 'correct' || feedback === 'wrong') {
      advanceQuiz();
    } else {
      // retry: clear wrong tiles
      setSelected([]);
      setFeedback(null);
    }
  };

  const advanceQuiz = () => {
    setFeedback(null);
    if (quizIdx + 1 >= QUIZ_LIST.length) {
      onComplete();
    } else {
      setQuizIdx(q => q + 1);
    }
  };

  // ── 키보드 확인 ────────────────────────────────────────────────
  const onKeyboardConfirm = () => {
    if (keyboardText.trim() === quiz.ko) {
      sfx.play('correct');
      setFeedback('correct');
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      sfx.play('incorrect');
      setFeedback(newFail >= FAIL_MAX ? 'wrong' : 'retry');
    }
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
        {pick(lang, '소리를 듣고 글자 카드를 순서대로 놓으세요', 'Nghe âm thanh và đặt các thẻ chữ theo thứ tự')}
      </Text>

      {/* ── 음원 + 답 카드 ── */}
      <View style={styles.audioCard}>
        {/* 상단: 스피커 + 재생 속도 */}
        <View style={styles.audioCardTopRow}>
          <TouchableOpacity
            onPress={() => { setIsPlaying(p => !p); setShowSpeedPicker(false); }}
            activeOpacity={0.8}
          >
            <Animated.View style={[styles.speakerBtn, isPlaying && styles.speakerBtnActive, { transform: [{ scale: pulseAnim }] }]}>
              <ThemedGlyph style={styles.speakerIcon} glyph="🔊" />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.speedToggle}
            onPress={() => setShowSpeedPicker(p => !p)}
            activeOpacity={0.7}
          >
            <Text style={styles.speedToggleText}>{speed}x</Text>
          </TouchableOpacity>
        </View>

        {/* 답 슬롯 (조립 결과) */}
        <View style={styles.answerSlots}>
          {Array.from({ length: totalSlots }).map((_, pos) => {
            const tileIdx = selected[pos];
            const filled = tileIdx !== undefined;
            return (
              <TouchableOpacity
                key={pos}
                style={[styles.slot, filled && styles.slotFilled]}
                onPress={() => filled && onSlotTap(pos)}
                activeOpacity={filled ? 0.7 : 1}
              >
                <Text style={[styles.slotText, !filled && styles.slotPlaceholder]}>
                  {filled ? shuffledTiles[tileIdx] : '_'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 속도 선택 ── */}
      {showSpeedPicker && (
        <View style={styles.speedPicker}>
          {(['0.5', '1.0', '1.5'] as Speed[]).map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.speedOption, speed === s && styles.speedOptionActive]}
              onPress={() => { setSpeed(s); setShowSpeedPicker(false); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.speedOptionText, speed === s && styles.speedOptionTextActive]}>
                {s}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ── 힌트 ── */}
      {showHint && (
        <View style={styles.hintBox}>
          <ThemedGlyph style={styles.hintLabel} glyph="💡" /><Text style={styles.hintLabel}> {pick(lang, '힌트', 'Gợi ý')}</Text>
          <Text style={styles.hintText}>{quiz.vi}</Text>
        </View>
      )}

      <View style={styles.spacer} />

      {/* ── 키보드 입력 모드 ── */}
      {showKeyboard && (
        <View style={styles.keyboardArea}>
          <TextInput
            style={styles.keyboardInput}
            value={keyboardText}
            onChangeText={setKeyboardText}
            placeholder={pick(lang, '한국어로 입력하세요', 'Nhập bằng tiếng Hàn')}
            autoFocus
          />
          <View style={__mbBtn ? { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginTop: 12 } : null}>
          <TouchableOpacity
            style={[styles.ctaBtn, __mbBtn && { flex: 1 }, !keyboardText.trim() && styles.ctaBtnDisabled]}
            onPress={onKeyboardConfirm}
            disabled={!keyboardText.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>{pick(lang, '확인', 'Xác nhận')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keyboardBtn, __mbBtn, __mbBtn && { paddingHorizontal: 12, flexShrink: 1, marginTop: 0, alignSelf: 'auto' as const }]}
            onPress={() => setShowKeyboard(false)}
            activeOpacity={0.7}
          >
            <Text style={styles.keyboardBtnText}>
              🔤 {pick(lang, '글자 카드로 돌아가기', 'Quay lại thẻ chữ')}
            </Text>
          </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── 타일 ── */}
      {!showKeyboard && (
        <View style={styles.tilesRow}>
          {shuffledTiles.map((tile, i) => {
            const isSelected = selected.includes(i);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.tile, isSelected && styles.tileSelected]}
                onPress={() => onTileTap(i)}
                activeOpacity={isSelected ? 1 : 0.75}
              >
                <Text style={[styles.tileText, isSelected && styles.tileTextSelected]}>
                  {tile}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ── 확인 + 힌트 ── */}
      {!showKeyboard && (
        <View style={[styles.footer, __mbBtn && { paddingBottom: 6, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 }]}>
          <View style={[styles.footerRow, __mbBtn && { flex: 1 }]}>
            <TouchableOpacity
              style={[styles.ctaBtn, styles.ctaBtnFlex, __mbBtn, !allFilled && styles.ctaBtnDisabled]}
              onPress={onConfirm}
              disabled={!allFilled}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaBtnText}>{pick(lang, '확인', 'Xác nhận')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.hintBtn, __mbBtn && { height: 40 }]}
              onPress={() => setShowHint(h => !h)}
              activeOpacity={0.8}
            >
              <ThemedGlyph style={styles.hintBtnIcon} glyph="💡" />
              {!showHint && <View style={styles.hintBtnBadge} />}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.keyboardBtn, __mbBtn, __mbBtn && { paddingHorizontal: 12, flexShrink: 1, marginTop: 0, alignSelf: 'auto' as const }]}
            onPress={() => setShowKeyboard(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.keyboardBtnText}>
              ⌨ {pick(lang, '키보드 사용하기', 'Dùng bàn phím')}
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
                <Text style={styles.modalSub}>{pick(lang, `${FAIL_MAX - failCount}번의 기회가 남았어요`, `Còn ${FAIL_MAX - failCount} lần thử`)}</Text>
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
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Header ──
  stepBadge: {
    position: 'absolute',
    right: 52,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: colors.tealSoft,
    borderRadius: 10,
  },
  stepText: { fontSize: 11, fontWeight: '700', color: colors.teal },

  // ── Instruction ──
  instruction: {
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 16,
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    textAlign: 'center',
  },

  // ── Audio Card ──
  audioCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingVertical: 14,
    paddingHorizontal: 14,
    gap: 14,
    ...shadow.card,
  },
  audioCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  speakerBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  speakerBtnActive: {
    backgroundColor: colors.tealDark,
  },
  speakerIcon: { fontSize: 22 },
  answerSlots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  slot: {
    minWidth: 48,
    height: 48,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotFilled: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  slotText: { fontSize: 20, fontWeight: '700', color: colors.ink },
  slotPlaceholder: { color: '#C0CDD5', fontWeight: '400' },
  speedToggle: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
    flexShrink: 0,
  },
  speedToggleText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  // ── Speed Picker ──
  speedPicker: {
    marginHorizontal: 20,
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  speedOption: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#F5F8F8',
  },
  speedOptionActive: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  speedOptionText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  speedOptionTextActive: { color: colors.teal },

  // ── Hint ──
  hintBox: {
    marginHorizontal: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  hintLabel: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  hintText: { fontSize: 13, color: '#78350F', fontWeight: '500' },

  spacer: { flex: 1 },

  // ── Keyboard area ──
  keyboardArea: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 10,
  },
  keyboardInput: {
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    color: colors.ink,
    backgroundColor: '#FAFFFE',
  },

  // ── Tiles ──
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  tile: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D1D9E0',
    backgroundColor: '#F5F8F8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  tileText: { fontSize: 19, fontWeight: '700', color: colors.ink },
  tileTextSelected: { color: colors.teal },

  // ── Footer ──
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnFlex: {
    flex: 1,
  },
  ctaBtnDisabled: {
    backgroundColor: '#B0C8C8',
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  hintBtn: {
    width: 52,
    borderRadius: 14,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  hintBtnIcon: { fontSize: 20 },
  hintBtnBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  keyboardBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  keyboardBtnText: { fontSize: 13, color: colors.muted, fontWeight: '600' },

  // ── Feedback Modal ──
  modalBackdrop: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
    alignItems: 'center',
    gap: 12,
  },
  modalEmoji: { fontSize: 48 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  modalSub: { fontSize: 14, color: colors.muted, textAlign: 'center' },
  modalAnswerBox: { alignItems: 'center', gap: 4 },
  modalAnswerLabel: { fontSize: 12, fontWeight: '600', color: colors.muted },
  modalAnswer: { fontSize: 18, fontWeight: '700', color: colors.teal, textAlign: 'center' },
  modalBtn: {
    marginTop: 8,
    width: '100%',
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
