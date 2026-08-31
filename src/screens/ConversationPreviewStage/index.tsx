/**
 * ConversationPreviewStage — 전체 대화 듣기
 *
 * kcho-dev: dialogue_master (act10)
 *
 * 레이아웃:
 *   [intro phase] AI튜터 오버레이 → [확인] → [main phase] 대화문 목록
 *
 * intro phase 동작:
 *   - data.aiTutor 미등록 시 스킵 → 바로 main phase
 *   - 진입 시 aiTutor.audioSrc 자동 재생
 *   - 스피커 버튼 탭 → 반복 재생
 *   - [확인] 탭 → 음원 정지 → main phase 전환
 *
 * main phase 동작:
 *   - 진입 시 첫 번째 라인 음원 자동 재생 (300ms 딜레이)
 *   - 재생 완료 시 다음 라인 자동 재생
 *   - 현재 재생 라인 하이라이트 (teal 테두리 + 배경)
 *   - 스피커 아이콘 탭 → 해당 라인 재생
 *   - [다음] 버튼: 항상 활성
 *   - [다음] 탭 → 음원 정지 후 onNext()
 *
 * kcho-dev 이식 시:
 *   - ConversationLine.audioSrc → resolveActivityAudioSource(actNo, filename)
 *   - aiTutor.audioSrc → resolveAudioSource(audioValue)
 *   - ActivityHeader → ActivityLayout (step/totalSteps)
 *   - onNext → navigateToNextActivityOrLessonComplete
 *   - lines → activity.questions[].listItems.dialogue_content[]
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Animated,
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors, spacing, radius, shadow } from '../../theme';
import {
  MOCK_CONVERSATION,
  type ConversationData,
  type ConversationLine,
} from '../../data/lessonData';

// 프로토타입 음원 (라인별 CDN 음원이 없을 때 공통 fallback)
let FALLBACK_AUDIO: string | null = null;
try {
  FALLBACK_AUDIO = Platform.OS === 'web'
    ? (require('../../../assets/practical-listening/listening-1.mp3') as string)
    : null;
} catch {
  FALLBACK_AUDIO = null;
}

// ─── Props ────────────────────────────────────────────────────────
interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: ConversationData;
}

type Phase = 'intro' | 'main';

// ─── 말풍선 컴포넌트 ──────────────────────────────────────────────
function ConversationBubble({
  line,
  isActive,
  dimmed,
  onPlay,
}: {
  line: ConversationLine;
  isActive: boolean;
  dimmed: boolean;
  onPlay: (line: ConversationLine) => void;
}) {
  const isLeft = line.side === 'left';

  return (
    <View style={[bs.row, isLeft ? bs.rowLeft : bs.rowRight, dimmed && bs.rowDimmed]}>
      {isLeft && (
        <View style={[bs.avatar, isActive && bs.avatarActive]}>
          <Text style={bs.avatarText}>{line.speaker.charAt(0)}</Text>
        </View>
      )}

      <View style={bs.bubbleWrap}>
        <Text style={[bs.speakerName, isLeft ? bs.speakerLeft : bs.speakerRight]}>
          {line.speaker}
        </Text>

        <View style={[
          bs.bubble,
          isLeft ? bs.bubbleLeft : bs.bubbleRight,
          isActive && bs.bubbleActive,
        ]}>
          <Text style={bs.textKo}>{line.textKo}</Text>
          <Text style={bs.textVi}>{line.textVi}</Text>

          <TouchableOpacity
            style={[bs.speakerBtn, isActive && bs.speakerBtnActive]}
            onPress={() => !dimmed && onPlay(line)}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <Text style={bs.speakerIcon}>🔈</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!isLeft && (
        <View style={[bs.avatar, bs.avatarRight, isActive && bs.avatarActive]}>
          <Text style={bs.avatarText}>{line.speaker.charAt(0)}</Text>
        </View>
      )}
    </View>
  );
}

// ─── AI튜터 인트로 오버레이 ───────────────────────────────────────
function AiTutorIntro({
  bubbleText,
  onPlay,
  onConfirm,
  playing,
}: {
  bubbleText: string;
  onPlay: () => void;
  onConfirm: () => void;
  playing: boolean;
}) {
  const tutorImg = require('../../../assets/word-slides/tutor.png');
  return (
    <View style={ov.container}>
      {/* 말풍선 카드 + AI튜터 */}
      <View style={ov.row}>
        <View style={ov.card}>
          <Text style={ov.bubbleText}>{bubbleText}</Text>
          <TouchableOpacity
            style={[ov.speakerBtn, playing && ov.speakerBtnActive]}
            onPress={onPlay}
            activeOpacity={0.7}
          >
            <Text style={ov.speakerIcon}>🔊</Text>
          </TouchableOpacity>
        </View>
        <Image source={tutorImg} style={ov.tutorImg} />
      </View>

      {/* 확인 버튼 */}
      <TouchableOpacity style={ov.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
        <Text style={ov.confirmBtnText}>확인</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── 메인 화면 ────────────────────────────────────────────────────
export function ConversationPreviewStage({
  onNext,
  onBack,
  data = MOCK_CONVERSATION,
}: Props) {
  const { lang } = useLang();

  // data.aiTutor 없으면 바로 main
  const [phase, setPhase] = useState<Phase>(data.aiTutor ? 'intro' : 'main');
  const [tutorPlaying, setTutorPlaying] = useState(false);
  const tutorAudioRef = useRef<HTMLAudioElement | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const lines = data.lines;

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

  // 인트로 진입 시 자동 재생
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
  const playLine = useCallback((index: number) => {
    if (Platform.OS !== 'web') return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audioSrc = lines[index]?.audioSrc ?? FALLBACK_AUDIO;
    if (!audioSrc) return;
    try {
      const audio = new Audio(audioSrc as string);
      audioRef.current = audio;
      setActiveIndex(index);
      audio.play().catch(() => {});
      audio.onended = () => {
        const next = index + 1;
        if (next < lines.length) {
          setTimeout(() => playLine(next), 400);
        } else {
          setActiveIndex(-1);
        }
      };
    } catch {}
  }, [lines]);

  // main phase 진입 시 자동 재생
  useEffect(() => {
    if (phase !== 'main') return;
    const timer = setTimeout(() => playLine(0), 300);
    return () => {
      clearTimeout(timer);
      audioRef.current?.pause();
      audioRef.current = null;
      setActiveIndex(-1);
    };
  }, [phase, playLine]);

  const handlePlayLine = (line: ConversationLine) => {
    const idx = lines.findIndex(l => l.key === line.key);
    if (idx >= 0) playLine(idx);
  };

  const handleNext = () => {
    audioRef.current?.pause();
    audioRef.current = null;
    setActiveIndex(-1);
    onNext();
  };

  const bubbleText = data.aiTutor
    ? pick(lang, data.aiTutor.bubbleKo, data.aiTutor.bubbleVi)
    : '';

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={60} onClose={onBack} />

      {/* 배지 */}
      <View style={s.badgeWrap}>
        <View style={s.badge}>
          <Text style={s.badgeText}>
            {pick(lang, data.badgeKo, data.badgeVi)}
          </Text>
        </View>
      </View>

      {/* 대화문 목록 */}
      <View style={s.scrollWrap}>
        <ScrollView
          style={s.scroll}
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={phase === 'main'}
        >
          {lines.map((line, idx) => (
            <ConversationBubble
              key={line.key}
              line={line}
              isActive={activeIndex === idx}
              dimmed={phase === 'intro'}
              onPlay={handlePlayLine}
            />
          ))}
        </ScrollView>

        {/* intro phase: 검은 딤 오버레이 */}
        {phase === 'intro' && <View style={s.dimOverlay} pointerEvents="none" />}
      </View>

      {/* intro phase: AI튜터 오버레이 */}
      {phase === 'intro' && data.aiTutor && (
        <AiTutorIntro
          bubbleText={bubbleText}
          onPlay={playTutorAudio}
          onConfirm={handleConfirm}
          playing={tutorPlaying}
        />
      )}

      {/* main phase: 하단 CTA */}
      {phase === 'main' && (
        <View style={s.footer}>
          <TouchableOpacity style={s.ctaBtn} onPress={handleNext} activeOpacity={0.85}>
            <Text style={s.ctaBtnText}>
              {pick(lang, '다음', 'Tiếp theo')} →
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── 말풍선 스타일 ────────────────────────────────────────────────
const bs = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: spacing.md,
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  rowDimmed: {},
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarRight: { backgroundColor: colors.tealSoft },
  avatarActive: { backgroundColor: colors.teal },
  avatarText: { fontSize: 14, fontWeight: '700', color: colors.surface },
  bubbleWrap: { maxWidth: '72%', gap: 4 },
  speakerName: { fontSize: 11, fontWeight: '700', color: colors.textMuted },
  speakerLeft: { textAlign: 'left', paddingLeft: 4 },
  speakerRight: { textAlign: 'right', paddingRight: 4 },
  bubble: {
    borderRadius: 16,
    padding: 12,
    paddingRight: 36,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    backgroundColor: colors.surface,
    position: 'relative',
    ...shadow.card,
  },
  bubbleLeft: { borderTopLeftRadius: 4 },
  bubbleRight: {
    borderTopRightRadius: 4,
    backgroundColor: colors.tealSoft,
    borderColor: '#BFE8E6',
  },
  bubbleActive: {
    borderColor: colors.teal,
    borderWidth: 2,
  },
  textKo: { fontSize: 15, fontWeight: '700', color: colors.ink, lineHeight: 22 },
  textVi: { fontSize: 12, color: colors.textMuted, marginTop: 3, lineHeight: 18 },
  speakerBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,168,166,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerBtnActive: { backgroundColor: colors.teal },
  speakerIcon: { fontSize: 12 },
});

// ─── 인트로 오버레이 스타일 ───────────────────────────────────────
const ov = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.canvas,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    ...shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 14,
    paddingRight: 48,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadow.card,
    position: 'relative',
    minHeight: 80,
  },
  bubbleText: {
    fontSize: 14,
    color: colors.ink,
    lineHeight: 22,
  },
  speakerBtn: {
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
  speakerBtnActive: { backgroundColor: colors.teal },
  speakerIcon: { fontSize: 18 },
  tutorImg: {
    width: 72,
    height: 90,
    borderRadius: 8,
    resizeMode: 'cover',
    flexShrink: 0,
  },
  confirmBtn: {
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  confirmBtnText: { color: colors.surface, fontSize: 16, fontWeight: '700' },
});

// ─── 화면 스타일 ──────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  badgeWrap: { paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.teal },
  scrollWrap: { flex: 1, position: 'relative' },
  dimOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: radius.lg,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  ctaBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
});
