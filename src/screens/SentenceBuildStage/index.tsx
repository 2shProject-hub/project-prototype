import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput,
  Animated, Easing, Platform,
} from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { SESSION1 } from '../../data/lessonData';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';
import { useSfx } from '../../hooks/useSfx';

interface Props {
  sessionId?: number;
  onComplete: () => void;
  onBack: () => void;
}

type Speed = '0.5' | '1.0' | '1.5';
type Feedback = null | 'correct' | 'retry' | 'wrong';

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

export function SentenceBuildStage({ onComplete, onBack }: Props) {
  const { lang } = useLang();
  const { theme: __mbBT, enabled: __mbBE } = useTheme();
  const __mbBtn = __mbBE && __mbBT.id === 'malhaeboka' ? { height: 40, minHeight: 0, paddingVertical: 0, justifyContent: 'center' as const } : null;
  const sfx = useSfx();

  const [quizIdx, setQuizIdx] = useState(0);
  const [shuffledTiles, setShuffledTiles] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const quiz = QUIZ_LIST[quizIdx];
  const totalSlots = quiz.answerWords.length;
  const allFilled = selected.length === totalSlots;

  // ── 퀴즈 초기화 ──────────────────────────────────────────────
  useEffect(() => {
    setShuffledTiles(shuffle([...quiz.answerWords, ...quiz.distractors]));
    setSelected([]);
    setFailCount(0);
    setFeedback(null);
    setShowHint(false);
    setIsPlaying(false);
    setShowKeyboard(false);
    setKeyboardText('');
  }, [quizIdx]);

  // ── 음원 재생 ────────────────────────────────────────────────
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    if (isPlaying) {
      const audio = new Audio(require('../../../assets/sounds/ikorea.mp3') as string);
      audio.playbackRate = parseFloat(speed);
      audioRef.current = audio;

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 350, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 350, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ]),
      ).start();

      audio.play().catch(() => {});
      audio.onended = () => {
        setIsPlaying(false);
        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
        audioRef.current = null;
      };
    } else {
      audioRef.current?.pause();
      audioRef.current = null;
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
      if (playTimerRef.current) clearTimeout(playTimerRef.current);
    };
  }, [isPlaying]);

  // ── 속도 변경 시 재생 중 오디오에 즉시 반영 ─────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = parseFloat(speed);
  }, [speed]);

  // ── 타일 모드 ─────────────────────────────────────────────────
  const onTileTap = (tileIdx: number) => {
    if (selected.includes(tileIdx) || selected.length >= totalSlots) return;
    setSelected(prev => [...prev, tileIdx]);
  };

  const onAnswerWordTap = (pos: number) => {
    setSelected(prev => prev.filter((_, i) => i !== pos));
  };

  // ── 정답 검증 ─────────────────────────────────────────────────
  const checkAnswer = (answer: string) => {
    const isCorrect = answer.trim() === quiz.ko || answer === quiz.answerWords.join('§');
    if (isCorrect) {
      sfx.play('correct'); setFeedback('correct');
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      sfx.play('incorrect'); setFeedback(newFail >= FAIL_MAX ? 'wrong' : 'retry');
    }
  };

  const onTileConfirm = () => {
    // 단어 구분은 공백 처리
    const built = selected.map(i => shuffledTiles[i]).join(' ');
    // 정답 체크 시 공백 보완(구분자 매핑 유연성 보장)
    const isCorrect = built.trim() === quiz.ko || built.replace(/\s+/g, '') === quiz.ko.replace(/\s+/g, '');
    if (isCorrect) {
      sfx.play('correct'); setFeedback('correct');
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      sfx.play('incorrect'); setFeedback(newFail >= FAIL_MAX ? 'wrong' : 'retry');
    }
  };

  const onKeyboardConfirm = () => {
    const isCorrect = keyboardText.trim() === quiz.ko || keyboardText.replace(/\s+/g, '') === quiz.ko.replace(/\s+/g, '');
    if (isCorrect) {
      sfx.play('correct'); setFeedback('correct');
    } else {
      const newFail = failCount + 1;
      setFailCount(newFail);
      sfx.play('incorrect'); setFeedback(newFail >= FAIL_MAX ? 'wrong' : 'retry');
    }
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
        {pick(lang,
          '베트남어 뜻에 맞게 단어를 순서에 맞게 조합하세요',
          'Sắp xếp các từ theo đúng nghĩa tiếng Việt'
        )}
      </Text>

      {/* ── 음원 + 답 카드 ── */}
      <View style={styles.audioCard}>
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

        {/* 답 조립 영역 */}
        <View style={styles.answerBox}>
          {showKeyboard ? (
            <Text style={[styles.answerWordText, !keyboardText && styles.answerPlaceholder]}>
              {keyboardText || pick(lang, '한국어 문장을 입력하세요', 'Nhập câu tiếng Hàn')}
            </Text>
          ) : (
            selected.length === 0 ? (
              <Text style={styles.answerPlaceholder}>
                {pick(lang, '단어를 선택하세요', 'Chọn từ để điền vào đây')}
              </Text>
            ) : (
              <View style={styles.answerWords}>
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
              </View>
            )
          )}
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
              <Text style={[styles.speedOptionText, speed === s && styles.speedOptionTextActive]}>{s}x</Text>
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

      {/* ── 키보드 모드 ── */}
      {showKeyboard && (
        <View style={styles.keyboardArea}>
          <TextInput
            style={styles.keyboardInput}
            value={keyboardText}
            onChangeText={setKeyboardText}
            placeholder={pick(lang, '한국어 문장을 입력하세요', 'Nhập câu tiếng Hàn')}
            autoFocus
          />
          <View style={__mbBtn ? { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8, marginTop: 12 } : null}>
          <TouchableOpacity
            style={[styles.ctaBtn, __mbBtn ? { flex: 1 } : { marginTop: 12 }, !keyboardText.trim() && styles.ctaBtnDisabled]}
            onPress={onKeyboardConfirm}
            disabled={!keyboardText.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>{pick(lang, '확인', 'Xác nhận')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keyboardBtn, __mbBtn, __mbBtn && { width: 40, height: 40, borderRadius: 20, paddingHorizontal: 0, paddingVertical: 0, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#EFEAFF', borderColor: '#DDD2F7', flexShrink: 0, marginTop: 0, alignSelf: 'auto' as const }]}
            onPress={() => { setShowKeyboard(false); setSelected([]); }}
            activeOpacity={0.7}
          >
            {__mbBtn ? <ThemedGlyph glyph="🃏" style={{ fontSize: 20 }} /> : <Text style={styles.keyboardBtnText}>🃏 {pick(lang, '단어 카드로 풀기', 'Quay lại thẻ từ')}</Text>}
          </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── 타일 모드 ── */}
      {!showKeyboard && (
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
      {!showKeyboard && (
        <View style={[styles.footer, __mbBtn && { paddingBottom: 2, flexDirection: 'row' as const, alignItems: 'center' as const, gap: 8 }]}>
          <View style={[styles.footerRow, __mbBtn && { flex: 1 }]}>
            <View style={{ flex: 1 }}>
              <CtaButton
                title={pick(lang, '확인', 'Xác nhận')}
                onPress={onTileConfirm}
                disabled={!allFilled}
                size="lg"
              />
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

          <TouchableOpacity
            style={[styles.keyboardBtn, __mbBtn, __mbBtn && { width: 40, height: 40, borderRadius: 20, paddingHorizontal: 0, paddingVertical: 0, alignItems: 'center' as const, justifyContent: 'center' as const, backgroundColor: '#EFEAFF', borderColor: '#DDD2F7', flexShrink: 0, marginTop: 0, alignSelf: 'auto' as const }]}
            onPress={() => setShowKeyboard(true)}
            activeOpacity={0.7}
          >
            {__mbBtn ? <ThemedGlyph glyph="⌨" style={{ fontSize: 20 }} /> : <Text style={styles.keyboardBtnText}>⌨ {pick(lang, '키보드 사용하기', 'Dùng bàn phím')}</Text>}
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

  // ── Audio Card ──
  audioCard: {
    marginHorizontal: 20,
    borderRadius: 16, borderWidth: 1, borderColor: colors.line,
    backgroundColor: colors.surface,
    paddingVertical: 14, paddingHorizontal: 14, gap: 14,
    ...shadow.card,
  },
  audioCardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  speakerBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  speakerBtnActive: { backgroundColor: colors.tealDark },
  speakerIcon: { fontSize: 22 },
  speedToggle: {
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: colors.teal,
    backgroundColor: colors.tealSoft, flexShrink: 0,
  },
  speedToggleText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  // ── 답 조립 영역 ──
  answerBox: {
    minHeight: 56, borderWidth: 1.5, borderStyle: 'dashed',
    borderColor: '#A0B4C0', borderRadius: 12, padding: 10, justifyContent: 'center',
  },
  answerPlaceholder: { fontSize: 14, color: '#B0BEC5', textAlign: 'center', fontStyle: 'italic' },
  answerWords: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  answerWordPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.tealSoft, borderWidth: 1, borderColor: colors.teal,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5,
  },
  answerWordText: { fontSize: 15, fontWeight: '700', color: colors.teal },
  answerWordRemove: { fontSize: 14, color: colors.teal, fontWeight: '400' },

  // ── Speed Picker ──
  speedPicker: {
    marginHorizontal: 20, marginTop: 8,
    flexDirection: 'row', justifyContent: 'center', gap: 8,
  },
  speedOption: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1, borderColor: colors.line, backgroundColor: '#F5F8F8',
  },
  speedOptionActive: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  speedOptionText: { fontSize: 13, fontWeight: '600', color: colors.muted },
  speedOptionTextActive: { color: colors.teal },

  // ── Hint ──
  hintBox: {
    marginHorizontal: 20, marginTop: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#FFFBEB', borderRadius: 10,
    paddingVertical: 8, paddingHorizontal: 12,
    borderWidth: 1, borderColor: '#FDE68A',
  },
  hintLabel: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  hintText: { fontSize: 13, color: '#78350F', fontWeight: '500', flex: 1 },

  spacer: { flex: 1 },

  // ── 키보드 모드 ──
  keyboardArea: { paddingHorizontal: 20, paddingBottom: 8 },
  keyboardInput: {
    borderWidth: 1.5, borderColor: colors.teal, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    fontSize: 16, color: colors.ink, backgroundColor: '#FAFFFE',
  },

  // ── 타일 ──
  tilesRow: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    gap: 8, paddingHorizontal: 20, paddingBottom: 12,
  },
  tile: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 24, borderWidth: 1.5, borderColor: '#1A2B3C', backgroundColor: '#FFFFFF',
  },
  tileUsed: { borderColor: '#C8D0D8', backgroundColor: '#F0F2F4', opacity: 0.5 },
  tileText: { fontSize: 16, fontWeight: '600', color: '#1A2B3C' },
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
  keyboardBtn: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#DCE5E7',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  keyboardBtnText: { fontSize: 13, color: colors.ink, fontWeight: '700' },

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
