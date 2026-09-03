import { TypewriterText } from '../../components/TypewriterText';
import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors, spacing, radius, shadow } from '../../theme';
import { isMb } from '../../theme/mb/mbSkin';
import {
  DialogueListenWriteData,
  MOCK_DIALOGUE_LISTEN_WRITE,
} from '../../data/lessonData';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png');

const SPEAKER_IMAGES: Record<string, any> = {
  '하영': require('../../../assets/WordVnKoSelect2/sena.png'),
  '유키': require('../../../assets/WordVnKoSelect2/yuki.png'),
};

interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: DialogueListenWriteData;
}

// ─── syllable utilities (ported from Source B) ──────────────────────────────
const isSyl = (ch: string) => !/[\s.,?!·]/.test(ch);
const sylsOf = (s: string) => [...s].filter(isSyl).join('');
function splitWord(w: string): { core: string; punct: string } {
  const m = w.match(/^(.*?)([\s.,?!·]*)$/u)!;
  return { core: sylsOf(m[1]), punct: m[2] };
}

// ─── WordBoxes ───────────────────────────────────────────────────────────────
interface WordBoxesProps {
  target: string;
  values: string[];
  disabled: boolean;
  wrong: boolean;
  onChange: (index: number, val: string) => void;
}
function WordBoxes({ target, values, disabled, wrong, onChange }: WordBoxesProps) {
  const words = target.split(' ').map(splitWord);
  return (
    <View style={styles.wordBoxesRow}>
      {words.map((w, i) => (
        <View key={i} style={styles.wordBoxWrap}>
          <TextInput
            style={[
              styles.wordBox,
              { width: Math.max(52, w.core.length * 22) },
              wrong && styles.wordBoxWrong,
              disabled && styles.wordBoxDone,
            ]}
            value={values[i] ?? ''}
            editable={!disabled}
            onChangeText={(t) => onChange(i, sylsOf(t))}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {!!w.punct && <Text style={styles.wordBoxPunct}>{w.punct}</Text>}
        </View>
      ))}
    </View>
  );
}

type Phase = 'intro' | 'main';

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function DialogueListenWriteStage({ onNext, onBack, data }: Props) {
  const d = data ?? MOCK_DIALOGUE_LISTEN_WRITE;
  const { lang } = useLang();
  const { theme: __mbBT, enabled: __mbBE } = useTheme();
  const __mbBtn = __mbBE && isMb(__mbBT.id) ? { height: 40, minHeight: 0, paddingVertical: 0, justifyContent: 'center' as const } : null;

  const [phase, setPhase] = useState<Phase>(d.aiTutor ? 'intro' : 'main');
  const [tutorPlaying, setTutorPlaying] = useState(false);
  const tutorAudioRef = useRef<HTMLAudioElement | null>(null);

  const [lineIndex, setLineIndex] = useState(0);
  const [vals, setVals] = useState<string[]>([]);
  const [result, setResult] = useState<'ok' | 'no' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const panelY = useRef(new Animated.Value(300)).current;

  const line = d.lines[lineIndex];
  const words = line.textKo.split(' ').map(splitWord);
  const cores = words.map((w) => w.core);
  const total = d.lines.length;
  const percentage = Math.round((lineIndex / total) * 100);

  // ── 인트로 음원 ──────────────────────────────────────────────────
  const playTutorAudio = useCallback(() => {
    if (Platform.OS !== 'web' || !d.aiTutor) return;
    tutorAudioRef.current?.pause();
    tutorAudioRef.current = null;
    try {
      const audio = new Audio(d.aiTutor.audioSrc as string);
      tutorAudioRef.current = audio;
      setTutorPlaying(true);
      audio.play().catch(() => setTutorPlaying(false));
      audio.onended = () => setTutorPlaying(false);
    } catch {
      setTutorPlaying(false);
    }
  }, [d.aiTutor]);

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(playTutorAudio, 300);
      return () => {
        clearTimeout(timer);
        tutorAudioRef.current?.pause();
        tutorAudioRef.current = null;
      };
    }
  }, [phase, playTutorAudio]);

  const handleConfirmIntro = () => {
    tutorAudioRef.current?.pause();
    tutorAudioRef.current = null;
    setTutorPlaying(false);
    setPhase('main');
  };

  // reset + auto-play when lineIndex changes (intro phase에서는 문제 음원 재생 안 함)
  useEffect(() => {
    setVals(cores.map(() => ''));
    setResult(null);
    setShowHint(false);
    setNeedsTap(false);

    if (Platform.OS !== 'web' || phase !== 'main') return;
    audioRef.current?.pause();
    audioRef.current = null;
    if (line.audioSrc) {
      const audio = new Audio(line.audioSrc);
      audioRef.current = audio;
      audio.play().catch(() => setNeedsTap(true));
    } else {
      setNeedsTap(true);
    }
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineIndex, phase]);

  // slide-up feedback panel
  useEffect(() => {
    if (result) {
      Animated.spring(panelY, { toValue: 0, useNativeDriver: true }).start();
    } else {
      panelY.setValue(300);
    }
  }, [result, panelY]);

  function playAudio() {
    if (Platform.OS !== 'web') return;
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    } else if (line.audioSrc) {
      const audio = new Audio(line.audioSrc);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }
  }

  function handleCheck() {
    const ok = vals.every((v, i) => v === cores[i]);
    setResult(ok ? 'ok' : 'no');
  }

  function handleRetry() {
    setVals(cores.map(() => ''));
    setResult(null);
    setShowHint(false);
  }

  function handleNext() {
    if (lineIndex < total - 1) {
      setLineIndex((i) => i + 1);
    } else {
      onNext();
    }
  }

  const instruction = pick(lang, d.instructionKo, d.instructionVi);
  const tutorBubble = d.aiTutor ? pick(lang, d.aiTutor.bubbleKo, d.aiTutor.bubbleVi) : '';
  const titleBadge = d.aiTutor ? pick(lang, d.aiTutor.titleBadgeKo, d.aiTutor.titleBadgeVi) : '';
  const avatarSrc = SPEAKER_IMAGES[line.speaker] ?? TUTOR_IMAGE;

  return (
    <View style={styles.root}>
      <ActivityHeader percentage={percentage} onClose={onBack} />

      {/* intro phase: 전체 딤 + 타이틀 배지 + AI 튜터 */}
      {phase === 'intro' && d.aiTutor && (
        <View style={[StyleSheet.absoluteFill, styles.introOverlay]} pointerEvents="box-none">
          <View style={[StyleSheet.absoluteFill, styles.introDim]} pointerEvents="none" />

          <View style={styles.introBadgeWrap} pointerEvents="none">
            <View style={styles.introBadge}>
              <Text style={styles.introBadgeText}>{titleBadge}</Text>
            </View>
          </View>

          <View style={[styles.introTutorSection, __mbBtn && { paddingBottom: 8 }]}>
            <View style={styles.introTutorRow}>
              <View style={styles.introTutorCard}>
                <TypewriterText active={!!__mbBtn} text={tutorBubble} style={[styles.introTutorText, __mbBtn && { fontSize: 15, lineHeight: 23 }]} />
                <TouchableOpacity
                  style={[styles.introSpeakerBtn, tutorPlaying && styles.introSpeakerBtnActive]}
                  onPress={playTutorAudio}
                  activeOpacity={0.7}
                >
                  <ThemedGlyph style={styles.introSpeakerIcon} glyph="🔊" />
                </TouchableOpacity>
              </View>
              <Image source={TUTOR_IMAGE as any} style={styles.introTutorImg} resizeMode="contain" />
            </View>
            <TouchableOpacity style={[styles.introConfirmBtn, __mbBtn]} onPress={handleConfirmIntro} activeOpacity={0.85}>
              <Text style={styles.introConfirmBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* instruction */}
        <Text style={styles.instruction}>{instruction}</Text>

        {/* speaker card */}
        <View style={styles.speakerRow}>
          <Image source={avatarSrc as any} style={styles.avatar} />
          <TouchableOpacity
            style={[styles.playBtn, needsTap && styles.playBtnPulse]}
            onPress={playAudio}
          >
            <ThemedGlyph style={styles.playIcon} glyph="🔊" />
          </TouchableOpacity>
        </View>

        {/* input card */}
        <View style={styles.inputCard}>
          <WordBoxes
            target={line.textKo}
            values={vals}
            disabled={result !== null}
            wrong={result === 'no'}
            onChange={(i, v) => {
              const next = [...vals];
              next[i] = v;
              setVals(next);
            }}
          />
        </View>

        {/* Vietnamese translation + hint */}
        <View style={styles.viRow}>
          <Text style={styles.viText}>{line.textVi}</Text>
          <TouchableOpacity onPress={() => setShowHint((h) => !h)}>
            <ThemedGlyph style={styles.hintIcon} glyph="💡" />
          </TouchableOpacity>
        </View>
        {showHint && (
          <View style={styles.hintBox}>
            <Text style={styles.hintText}>{line.textKo}</Text>
          </View>
        )}
      </ScrollView>

      {/* fixed footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.confirmBtn,
            result !== null && styles.confirmBtnDisabled,
          ]}
          onPress={handleCheck}
          disabled={result !== null}
        >
          <Text style={styles.confirmBtnText}>확인</Text>
        </TouchableOpacity>
      </View>

      {/* slide-up feedback panel */}
      {result && (
        <Animated.View
          style={[styles.panel, { transform: [{ translateY: panelY }] }]}
        >
          {result === 'no' ? (
            <>
              <Text style={styles.panelLabel}>정답</Text>
              <Text style={styles.panelAnswer}>{line.textKo}</Text>
              <View style={styles.panelBtns}>
                <TouchableOpacity
                  style={[styles.panelBtn, styles.panelBtnOutline]}
                  onPress={handleRetry}
                >
                  <Text style={styles.panelBtnOutlineText}>다시하기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.panelBtn, styles.panelBtnFill]}
                  onPress={handleNext}
                >
                  <Text style={styles.panelBtnFillText}>다음</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.panelCorrect}>정답이에요! 🎉</Text>
              <View style={styles.panelBtns}>
                <TouchableOpacity
                  style={[styles.panelBtn, styles.panelBtnFill, { flex: 1 }]}
                  onPress={handleNext}
                >
                  <Text style={styles.panelBtnFillText}>
                    {lineIndex < total - 1 ? '다음' : '완료'}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.canvas },

  // ── intro overlay ──
  introOverlay: { zIndex: 100 },
  introDim: { backgroundColor: 'rgba(0,0,0,0.55)' },
  introBadgeWrap: {
    position: 'absolute',
    top: 64,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  introBadge: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 48,
    paddingVertical: 10,
  },
  introBadgeText: { fontSize: 20, fontWeight: '700', color: colors.teal },
  introTutorSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  introTutorRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  introTutorCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: colors.borderLight,
    position: 'relative',
    minHeight: 80,
    ...shadow.card,
  },
  introTutorText: { fontSize: 14, color: colors.ink, lineHeight: 22 },
  introSpeakerBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introSpeakerBtnActive: { backgroundColor: colors.teal },
  introSpeakerIcon: { fontSize: 18 },
  introTutorImg: { width: 80, height: 110, flexShrink: 0 },
  introConfirmBtn: {
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  introConfirmBtnText: { color: colors.surface, fontSize: 16, fontWeight: '700' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.ink,
    marginBottom: 20,
    textAlign: 'center',
  },

  speakerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnPulse: { opacity: 0.7 },
  playIcon: { fontSize: 20 },
  speakerName: { fontSize: 14, color: colors.muted, fontWeight: '600' },

  inputCard: {
    backgroundColor: colors.tealSoft,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  wordBoxesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wordBoxWrap: { flexDirection: 'row', alignItems: 'center' },
  wordBox: {
    minWidth: 60,
    height: 44,
    borderBottomWidth: 2,
    borderBottomColor: colors.teal,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    color: colors.ink,
    textAlign: 'center',
  },
  wordBoxWrong: { borderBottomColor: colors.wrong },
  wordBoxDone: { opacity: 0.6 },
  wordBoxPunct: { fontSize: 16, color: colors.ink, marginLeft: 2 },

  viRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  viText: { fontSize: 13, color: colors.muted, flex: 1 },
  hintIcon: { fontSize: 22, marginLeft: 8 },

  hintBox: {
    backgroundColor: colors.warningLight,
    borderRadius: 10,
    padding: 10,
    marginTop: 4,
  },
  hintText: { fontSize: 15, color: colors.ink },

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
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 10,
  },
  panelLabel: { fontSize: 13, color: colors.inkLight, marginBottom: 6 },
  panelAnswer: { fontSize: 18, fontWeight: '700', color: colors.ink, marginBottom: 20 },
  panelCorrect: { fontSize: 18, fontWeight: '700', color: colors.correct, marginBottom: 20 },
  panelBtns: { flexDirection: 'row', gap: 12 },
  panelBtn: { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  panelBtnOutline: { borderWidth: 2, borderColor: colors.teal },
  panelBtnOutlineText: { color: colors.teal, fontWeight: '700', fontSize: 15 },
  panelBtnFill: { backgroundColor: colors.teal },
  panelBtnFillText: { color: colors.surface, fontWeight: '700', fontSize: 15 },
});
