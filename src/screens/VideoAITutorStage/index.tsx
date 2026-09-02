/**
 * VideoAITutorStage — 영상과 AI튜터
 *
 * 레이아웃:
 *   ActivityHeader → 배지 → 영상 영역 → AI튜터(말풍선+썸네일) → [다음] CTA
 *
 * 동작:
 *   - 진입 시 audioUri 음원 자동 재생 (300ms 딜레이)
 *   - 스피커 버튼 탭 → 반복 재생
 *   - [다음] 탭 → 음원 정지 후 onNext()
 *   - 영상: 웹 native <video controls> (브라우저 전체화면 버튼 제공)
 *
 * kcho-dev 이식 시:
 *   - audioUri → resolveAudioSource() / useAudioPlayer()
 *   - videoUri → resolveActivityVideoSource()
 *   - bubbleKo/Vi → question.extra1 / extra2
 *   - ActivityHeader → ActivityLayout (step/totalSteps)
 */

import { TypewriterText } from '../../components/TypewriterText';
import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Image,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors, spacing, radius, shadow } from '../../theme';
import { MOCK_VIDEO_AI_TUTOR, type VideoAITutorData } from '../../data/lessonData';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png') as string;

// 영상 에셋 (웹 전용)
let LOCAL_VIDEO: string | null = null;
try {
  LOCAL_VIDEO = Platform.OS === 'web'
    ? (require('../../../assets/practice-listen-sample.mp4') as string)
    : null;
} catch {
  LOCAL_VIDEO = null;
}

// 음원 에셋
let LOCAL_AUDIO: string | null = null;
try {
  LOCAL_AUDIO = Platform.OS === 'web'
    ? (require('../../../assets/practical-listening/listening-1.mp3') as string)
    : null;
} catch {
  LOCAL_AUDIO = null;
}

// ─── Props ────────────────────────────────────────────────────────
interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: VideoAITutorData;
}

// ─── 웹 전용 비디오 플레이어 ──────────────────────────────────────
function WebVideoPlayer({ src }: { src: string }) {
  return React.createElement('video', {
    src,
    controls: true,
    playsInline: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      backgroundColor: '#1A2233',
      display: 'block',
      borderRadius: 16,
    },
  });
}

// ─── 영상 없음 플레이스홀더 ──────────────────────────────────────
function VideoPlaceholder() {
  return (
    <View style={ph.wrap}>
      <View style={ph.circle}>
        <ThemedGlyph style={ph.icon} glyph="▶" />
      </View>
      <Text style={ph.text}>영상은 모바일 앱에서 재생됩니다.</Text>
    </View>
  );
}
const ph = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  circle: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  icon: { fontSize: 22, color: '#ffffff', marginLeft: 3 },
  text: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
});

// ─── 메인 화면 ────────────────────────────────────────────────────
export function VideoAITutorStage({
  onNext,
  onBack,
  data = MOCK_VIDEO_AI_TUTOR,
}: Props) {
  const { lang } = useLang();
  const { enabled: themeOn } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoSrc = data.videoUri ?? LOCAL_VIDEO;
  const audioSrc = data.audioUri ?? LOCAL_AUDIO;

  // 진입 시 음원 자동 재생
  useEffect(() => {
    if (Platform.OS !== 'web' || !audioSrc) return;
    const timer = setTimeout(() => {
      try {
        const audio = new Audio(audioSrc as string);
        audioRef.current = audio;
        audio.play().catch(() => {});
        setIsPlaying(true);
        audio.onended = () => setIsPlaying(false);
      } catch {}
    }, 300);
    return () => {
      clearTimeout(timer);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
    };
  }, [audioSrc]);

  // 스피커 버튼 — 재재생
  const handleReplay = () => {
    if (Platform.OS !== 'web' || !audioSrc) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    try {
      const audio = new Audio(audioSrc as string);
      audioRef.current = audio;
      audio.play().catch(() => {});
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
    } catch {}
  };

  // [다음] 버튼
  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    onNext();
  };

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={75} onClose={onBack} />

      {/* 배지 */}
      <View style={s.badgeWrap}>
        <View style={s.badge}>
          <Text style={s.badgeText}>
            {pick(lang, data.badgeKo, data.badgeVi)}
          </Text>
        </View>
      </View>

      {/* 영상 영역 */}
      <View style={[s.videoCard, themeOn && { height: 420, borderRadius: 18 }]}>
        {Platform.OS === 'web' && videoSrc ? (
          <WebVideoPlayer src={videoSrc as string} />
        ) : (
          <VideoPlaceholder />
        )}
      </View>

      {/* 스페이서 */}
      <View style={[s.spacer, themeOn && { flex: 0, height: 12 }]} />

      {/* AI 튜터 영역: 말풍선 + 썸네일 */}
      <View style={s.tutorRow}>
        {/* 말풍선 */}
        <View style={[s.bubble, themeOn && { borderRadius: 18, borderColor: '#E9E2FB' }]}>
          <TypewriterText
            active={themeOn}
            text={pick(lang, data.bubbleKo, data.bubbleVi)}
            style={[s.bubbleText, themeOn && { fontSize: 15, lineHeight: 23 }]}
          />
          {/* 스피커 버튼 */}
          <TouchableOpacity
            style={[s.speakerBtn, isPlaying && s.speakerBtnActive, themeOn && { backgroundColor: '#F1EDFB' }]}
            onPress={handleReplay}
            activeOpacity={0.7}
            hitSlop={8}
          >
            <ThemedGlyph style={s.speakerIcon} glyph="🔈" />
          </TouchableOpacity>
          {/* 꼬리 */}
          <View style={s.bubbleTail} />
        </View>

        {/* AI 튜터 이미지 */}
        <Image
          source={TUTOR_IMAGE as any}
          style={[s.tutorImage, themeOn && { width: 92, height: 112 }]}
          resizeMode="contain"
        />
      </View>

      {/* 하단 CTA */}
      <View style={s.footer}>
        <TouchableOpacity style={s.ctaBtn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={s.ctaBtnText}>
            {pick(lang, '다음', 'Tiếp theo')} →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  badgeWrap: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 48,
    paddingVertical: 10,
  },
  badgeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.teal,
  },
  videoCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    height: 210,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1A2233',
    ...shadow.card,
  },
  spacer: {
    flex: 1,
  },
  tutorRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
    gap: 8,
  },
  bubble: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    padding: spacing.md,
    paddingRight: 44,
    ...shadow.card,
    position: 'relative',
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 22,
  },
  bubbleTail: {
    position: 'absolute',
    bottom: 18,
    right: -10,
    width: 0,
    height: 0,
    borderTopWidth: 8,
    borderTopColor: 'transparent',
    borderBottomWidth: 8,
    borderBottomColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: colors.surface,
  },
  speakerBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerBtnActive: {
    backgroundColor: colors.teal,
  },
  speakerIcon: {
    fontSize: 15,
  },
  tutorImage: {
    width: 90,
    height: 120,
    flexShrink: 0,
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
  ctaBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
