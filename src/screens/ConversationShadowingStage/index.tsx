/**
 * ConversationShadowingStage — 따라 말하기
 *
 * kcho-dev: dialogue_speaking (act11)
 *
 * 레이아웃:
 *   [intro phase — 첫 문항에서만] AI튜터 오버레이 → [확인] → [main phase]
 *   ActivityHeader → 현재 라인 말풍선 → 마이크 버튼 → 피드백 모달
 *
 * intro phase 동작 (lineIndex === 0 && data.aiTutor 있을 때만):
 *   - 진입 시 aiTutor.audioSrc 자동 재생
 *   - 스피커 버튼 탭 → 반복 재생
 *   - [확인] 탭 → 음원 정지 → main phase 전환
 *
 * main phase 동작:
 *   - 진입 시 현재 라인 음원 자동 재생 (300ms 딜레이)
 *   - 스피커 버튼: 현재 라인 재생
 *   - 마이크 버튼: 탭 → 2초 녹음 애니메이션 → 발음 평가 결과 모달
 *   - 피드백 모달: 점수(0~100) + 등급 + 재시도 / 다음 버튼
 *   - [다음]: 마지막 라인이면 onNext(), 아니면 다음 라인으로 (인트로 없음)
 *
 * kcho-dev 이식 시:
 *   - 마이크: useAudioRecorder → 실제 녹음 파일 전송
 *   - 점수: 발음 평가 API 응답값으로 교체
 *   - recordQuestionAttempt(score) 호출
 *   - aiTutor.audioSrc → resolveAudioSource(audioValue)
 *   - ActivityHeader → ActivityLayout (step/totalSteps)
 *   - onNext → navigateToNextActivityOrLessonComplete
 *   - lines → activity.questions[].listItems.dialogue_content[]
 */

import { TypewriterText } from '../../components/TypewriterText';
import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { icon } from '../../theme/graphics';
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Platform, Image,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors, spacing, radius, shadow } from '../../theme';
import { MOCK_CONVERSATION_SHADOWING, type ConversationData } from '../../data/lessonData';

import { isMb } from '../../theme/mb/mbSkin';
let FALLBACK_AUDIO: string | null = null;
try {
  FALLBACK_AUDIO = Platform.OS === 'web'
    ? (require('../../../assets/practical-listening/listening-1.mp3') as string)
    : null;
} catch {
  FALLBACK_AUDIO = null;
}

type Phase = 'intro' | 'main';

// ─── 피드백 등급 ──────────────────────────────────────────────────
interface FeedbackGrade {
  stars: number;
  color: string;
  labelKo: string;
  labelVi: string;
  descKo: string;
  descVi: string;
}

function getGrade(score: number): FeedbackGrade {
  if (score >= 85) {
    return {
      stars: 3,
      color: colors.correct,
      labelKo: '훌륭해요!',
      labelVi: 'Xuất sắc!',
      descKo: '발음이 아주 정확해요.',
      descVi: 'Phát âm rất chính xác.',
    };
  }
  if (score >= 65) {
    return {
      stars: 2,
      color: colors.teal,
      labelKo: '잘했어요!',
      labelVi: 'Tốt lắm!',
      descKo: '조금 더 연습하면 완벽해요.',
      descVi: 'Luyện thêm một chút là hoàn hảo rồi.',
    };
  }
  return {
    stars: 1,
    color: colors.warning,
    labelKo: '다시 해볼까요?',
    labelVi: 'Thử lại nhé!',
    descKo: '원어민 발음을 듣고 따라해 보세요.',
    descVi: 'Hãy nghe và lặp lại theo người bản ngữ.',
  };
}

function mockScore(): number {
  return Math.floor(Math.random() * 41) + 60;
}

// ─── 별 컴포넌트 ──────────────────────────────────────────────────
function Stars({ count, color }: { count: number; color: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {[1, 2, 3].map(i => (
        <Text key={i} style={{ fontSize: 28, opacity: i <= count ? 1 : 0.2 }}>⭐</Text>
      ))}
    </View>
  );
}

// ─── 발음 피드백 모달 ─────────────────────────────────────────────
function FeedbackModal({
  visible, score, grade, lineKo, lang, onRetry, onNext, isLast,
}: {
  visible: boolean;
  score: number;
  grade: FeedbackGrade;
  lineKo: string;
  lang: string;
  onRetry: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const slideAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }).start();
    } else {
      slideAnim.setValue(400);
    }
  }, [visible, slideAnim]);

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFill, { zIndex: 200 }]}>
      <View style={m.overlay}>
        <Animated.View style={[m.sheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={m.handle} />
          <View style={[m.scoreRow, { borderColor: grade.color + '40', backgroundColor: grade.color + '10' }]}>
            <View style={m.scoreLeft}>
              <Text style={[m.scoreNum, { color: grade.color }]}>{score}</Text>
              <Text style={m.scoreMax}>/100</Text>
            </View>
            <Stars count={grade.stars} color={grade.color} />
          </View>
          <Text style={[m.gradeLabel, { color: grade.color }]}>
            {lang === 'ko' ? grade.labelKo : grade.labelVi}
          </Text>
          <Text style={m.gradeDesc}>
            {lang === 'ko' ? grade.descKo : grade.descVi}
          </Text>
          <View style={m.sentenceBox}>
            <Text style={m.sentenceHint}>{lang === 'ko' ? '평가 문장' : 'Câu đánh giá'}</Text>
            <Text style={m.sentenceText}>{lineKo}</Text>
          </View>
          <View style={m.btnRow}>
            <TouchableOpacity style={m.retryBtn} onPress={onRetry} activeOpacity={0.8}>
              <Text style={m.retryBtnText}>{lang === 'ko' ? '다시 시도' : 'Thử lại'} 🔄</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[m.nextBtn, { backgroundColor: grade.color }]} onPress={onNext} activeOpacity={0.8}>
              <Text style={m.nextBtnText}>
                {isLast ? (lang === 'ko' ? '완료' : 'Hoàn thành') : (lang === 'ko' ? '다음' : 'Tiếp theo')} →
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </View>
  );
}

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png');

// ─── Props ────────────────────────────────────────────────────────
interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: ConversationData;
}

// ─── 메인 화면 ────────────────────────────────────────────────────
export function ConversationShadowingStage({
  onNext,
  onBack,
  data = MOCK_CONVERSATION_SHADOWING,
}: Props) {
  const { lang } = useLang();
  const { theme: __mbBT, enabled: __mbBE } = useTheme();
  const __mbBtn = __mbBE && isMb(__mbBT.id) ? { height: 40, minHeight: 0, paddingVertical: 0, justifyContent: 'center' as const } : null;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const micTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tutorAudioRef = useRef<HTMLAudioElement | null>(null);

  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>(data.aiTutor ? 'intro' : 'main');
  const [tutorPlaying, setTutorPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [evalScore, setEvalScore] = useState(0);
  const [recorded, setRecorded] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pulseLoop = useRef<Animated.CompositeAnimation | null>(null);

  const lines = data.lines;
  const currentLine = lines[lineIndex];
  const isLast = lineIndex === lines.length - 1;
  const grade = getGrade(evalScore);

  // ── 인트로 음원 ──────────────────────────────────────────────────
  const playTutorAudio = useCallback(() => {
    if (Platform.OS !== 'web' || !data.aiTutor) return;
    tutorAudioRef.current?.pause();
    tutorAudioRef.current = null;
    try {
      const audio = new Audio(data.aiTutor.audioSrc as string);
      tutorAudioRef.current = audio;
      setTutorPlaying(true);
      audio.play().catch(() => setTutorPlaying(false));
      audio.onended = () => setTutorPlaying(false);
    } catch {
      setTutorPlaying(false);
    }
  }, [data.aiTutor]);

  // 인트로 진입 시 자동 재생 (첫 문항에서만)
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

  const handleConfirm = () => {
    tutorAudioRef.current?.pause();
    tutorAudioRef.current = null;
    setTutorPlaying(false);
    setPhase('main');
  };

  // ── 대화 라인 재생 ──────────────────────────────────────────────
  const playCurrentLine = useCallback(() => {
    if (Platform.OS !== 'web') return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const src = currentLine?.audioSrc ?? FALLBACK_AUDIO;
    if (!src) return;
    try {
      const audio = new Audio(src as string);
      audioRef.current = audio;
      setIsPlaying(true);
      audio.play().catch(() => {});
      audio.onended = () => setIsPlaying(false);
    } catch {}
  }, [currentLine]);

  // main phase 진입 또는 라인 변경 시 자동 재생 + 상태 초기화
  useEffect(() => {
    if (phase !== 'main') return;
    setRecorded(false);
    setIsRecording(false);
    setModalVisible(false);
    const timer = setTimeout(() => playCurrentLine(), 300);
    return () => {
      clearTimeout(timer);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      setIsPlaying(false);
    };
  }, [lineIndex, phase, playCurrentLine]);

  // 화면 종료 시 정리
  useEffect(() => {
    return () => {
      if (micTimerRef.current) clearTimeout(micTimerRef.current);
      pulseLoop.current?.stop();
      tutorAudioRef.current?.pause();
    };
  }, []);

  // ── 마이크 ───────────────────────────────────────────────────────
  const startPulse = () => {
    pulseLoop.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.25, duration: 500, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
    );
    pulseLoop.current.start();
  };

  const stopPulse = () => {
    pulseLoop.current?.stop();
    pulseAnim.setValue(1);
  };

  const handleMic = () => {
    if (isRecording || recorded) return;
    setIsRecording(true);
    startPulse();
    micTimerRef.current = setTimeout(() => {
      stopPulse();
      setIsRecording(false);
      const score = mockScore();
      setEvalScore(score);
      setModalVisible(true);
    }, 2000);
  };

  // ── 피드백 모달 액션 ─────────────────────────────────────────────
  const handleRetry = () => {
    setModalVisible(false);
    setRecorded(false);
  };

  const handleModalNext = () => {
    setModalVisible(false);
    setRecorded(true);
    if (isLast) {
      onNext();
    } else {
      setLineIndex(i => i + 1);
      // lineIndex > 0이면 인트로 없음 (phase는 'main' 유지)
    }
  };

  const isLeft = currentLine?.side === 'left';
  const bubbleText = data.aiTutor ? pick(lang, data.aiTutor.bubbleKo, data.aiTutor.bubbleVi) : '';
  const titleBadge = data.aiTutor ? pick(lang, data.aiTutor.titleBadgeKo, data.aiTutor.titleBadgeVi) : '';

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={70} onClose={onBack} />

      {/* 콘텐츠 영역 */}
      <View style={s.contentArea}>
        {/* 현재 라인 말풍선 */}
        <View style={s.bubbleArea}>
          <View style={[s.bubbleRow, !isLeft && s.bubbleRowRight]}>
            {isLeft && (
              currentLine?.avatarUri
                ? <Image source={currentLine.avatarUri} style={s.avatar} resizeMode="cover" />
                : <View style={s.avatarFallback}><Text style={s.avatarText}>{currentLine?.speaker.charAt(0)}</Text></View>
            )}
            <View style={[s.bubble, isLeft ? s.bubbleLeft : s.bubbleRight, s.bubbleFlex]}>
              <View style={s.bubbleContent}>
                <View style={s.bubbleTexts}>
                  <Text style={s.textKo}>{currentLine?.textKo}</Text>
                  <Text style={s.textVi}>{currentLine?.textVi}</Text>
                </View>
                <TouchableOpacity
                  style={[s.speakerBtn, isPlaying && s.speakerBtnActive]}
                  onPress={phase === 'main' ? playCurrentLine : undefined}
                  disabled={isRecording || phase === 'intro'}
                  activeOpacity={0.7}
                >
                  <ThemedGlyph style={s.speakerIcon} glyph={isPlaying ? '🔊' : '🔈'} />
                </TouchableOpacity>
              </View>
            </View>
            {!isLeft && (
              currentLine?.avatarUri
                ? <Image source={currentLine.avatarUri} style={s.avatar} resizeMode="cover" />
                : <View style={s.avatarFallback}><Text style={s.avatarText}>{currentLine?.speaker.charAt(0)}</Text></View>
            )}
          </View>
        </View>

        {/* main phase: 마이크 영역 */}
        {phase === 'main' && (
          <View style={s.micArea}>
            {isRecording && (
              <Text style={s.recordingLabel}>{pick(lang, '말하는 중...', 'Đang nói...')}</Text>
            )}
            {!recorded && !isRecording && (
              <Text style={s.tapHint}>{pick(lang, '탭하여 말하기', 'Nhấn để nói')}</Text>
            )}
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity
                style={[s.micBtn, isRecording && s.micBtnRecording]}
                onPress={handleMic}
                disabled={isRecording}
                activeOpacity={0.8}
              >
                {__mbBtn ? (
                  <Image source={{ uri: icon(isRecording ? 'pause' : 'headphones', '#FFFFFF', 38, 2.1) }} style={{ width: 38, height: 38 }} />
                ) : (
                  <ThemedGlyph style={s.micIcon} glyph={isRecording ? '⏺' : '🎤'} />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        )}

      </View>

      {/* intro phase: 전체 딤 오버레이 (screen 루트 레벨 — ActivityHeader 포함 전체 커버) */}
      {phase === 'intro' && data.aiTutor && (
        <View style={[StyleSheet.absoluteFill, s.introOverlayRoot]} pointerEvents="box-none">
          {/* 딤 */}
          <View style={[StyleSheet.absoluteFill, s.dim]} pointerEvents="none" />

          {/* 타이틀 배지 */}
          <View style={s.introBadgeWrap} pointerEvents="none">
            <View style={s.introBadge}>
              <Text style={s.introBadgeText}>{titleBadge}</Text>
            </View>
          </View>

          {/* AI 튜터 하단 */}
          <View style={[s.introTutorSection, __mbBtn && { paddingBottom: 1 }]}>
            <View style={s.introTutorRow}>
              <View style={[s.introTutorCard, __mbBtn && { borderRadius: 18, borderWidth: 1.5, borderColor: '#E9E2FB' }]}>
                <TypewriterText active={!!__mbBtn} text={bubbleText} style={[s.introTutorText, __mbBtn && { fontSize: 15, lineHeight: 23 }]} />
                <TouchableOpacity
                  style={[s.introSpeakerBtn, tutorPlaying && s.introSpeakerBtnActive, __mbBtn && { backgroundColor: '#EFEAFF' }]}
                  onPress={playTutorAudio}
                  activeOpacity={0.7}
                >
                  <ThemedGlyph style={s.introSpeakerIcon} glyph="🔊" />
                </TouchableOpacity>
              </View>
              <Image source={TUTOR_IMAGE as any} style={s.introTutorImg} resizeMode="contain" />
            </View>
            <TouchableOpacity style={[s.introConfirmBtn, __mbBtn]} onPress={handleConfirm} activeOpacity={0.85}>
              <Text style={s.introConfirmBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 피드백 모달 */}
      <FeedbackModal
        visible={modalVisible}
        score={evalScore}
        grade={grade}
        lineKo={currentLine?.textKo ?? ''}
        lang={lang}
        onRetry={handleRetry}
        onNext={handleModalNext}
        isLast={isLast}
      />
    </View>
  );
}


// ─── 모달 스타일 ──────────────────────────────────────────────────
const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(4,48,61,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: 12,
    paddingBottom: spacing.xl,
    gap: spacing.md,
    ...shadow.strong,
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.borderLight, alignSelf: 'center', marginBottom: spacing.sm },
  scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: radius.lg, borderWidth: 1.5 },
  scoreLeft: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  scoreNum: { fontSize: 48, fontWeight: '800', lineHeight: 56 },
  scoreMax: { fontSize: 16, fontWeight: '600', color: colors.textMuted },
  gradeLabel: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  gradeDesc: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 20 },
  sentenceBox: { backgroundColor: colors.bgSubtle, borderRadius: radius.md, padding: 12, gap: 4 },
  sentenceHint: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  sentenceText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: spacing.sm },
  retryBtn: { flex: 1, height: 50, borderRadius: radius.lg, borderWidth: 2, borderColor: colors.borderDark, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface },
  retryBtnText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  nextBtn: { flex: 1, height: 50, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  nextBtnText: { fontSize: 15, fontWeight: '700', color: '#ffffff' },
});

// ─── 화면 스타일 ──────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  contentArea: { flex: 1, position: 'relative' },
  bubbleArea: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
    gap: 6,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubbleFlex: { flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    flexShrink: 0,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: colors.surface },

  // ── intro overlay ──
  dim: { backgroundColor: 'rgba(0,0,0,0.55)' },
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
  introOverlayRoot: { zIndex: 100 },
  introConfirmBtnText: { color: colors.surface, fontSize: 16, fontWeight: '700' },
  speakerName: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  speakerLeft: { textAlign: 'left', paddingLeft: 4 },
  speakerRight: { textAlign: 'right', paddingRight: 4 },
  bubble: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  bubbleLeft: { borderTopLeftRadius: 4 },
  bubbleRight: { borderTopRightRadius: 4, backgroundColor: colors.tealSoft, borderColor: '#BFE8E6' },
  bubbleContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bubbleTexts: { flex: 1, gap: 4 },
  textKo: { fontSize: 17, fontWeight: '700', color: colors.ink, lineHeight: 24 },
  textVi: { fontSize: 13, color: colors.textMuted, lineHeight: 19 },
  speakerBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(0,168,166,0.12)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  speakerBtnActive: { backgroundColor: colors.teal },
  speakerIcon: { fontSize: 18 },
  micArea: { alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl, gap: 12 },
  recordingLabel: { fontSize: 14, fontWeight: '700', color: colors.wrong },
  tapHint: { fontSize: 13, color: colors.textMuted },
  micBtn: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center', ...shadow.card },
  micBtnRecording: { backgroundColor: colors.wrong },
  micIcon: { fontSize: 32 },
});
