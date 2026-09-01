/**
 * AITutorDescStage — AI튜터 설명
 *
 * 레이아웃:
 *   ActivityHeader → 빈 공간(flex:1) → AI튜터(말풍선+썸네일) → [다음] CTA
 *
 * 동작:
 *   - 진입 시 audioUri 음원 자동 재생 (300ms 딜레이)
 *   - 스피커 버튼 탭 → 반복 재생
 *   - [다음] 탭 → 음원 정지 후 onNext()
 *
 * kcho-dev 이식 시:
 *   - audioUri → useAudioPlayer() + resolveAudioSource()
 *   - bubbleKo/Vi → question.extra1 / extra2
 *   - ActivityHeader → ActivityLayout (step/totalSteps)
 */

import { ThemedGlyph } from '../../components/ThemedGlyph';
import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Image,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors, spacing, radius, shadow } from '../../theme';
import { MOCK_AI_TUTOR_DESC, type AITutorDescData } from '../../data/lessonData';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png') as string;

let LOCAL_AUDIO: string | null = null;
try {
  LOCAL_AUDIO = Platform.OS === 'web'
    ? (require('../../../assets/ai-dec/ai-dec-1.mp3') as string)
    : null;
} catch {
  LOCAL_AUDIO = null;
}

// ─── Props ────────────────────────────────────────────────────────
interface Props {
  onNext: () => void;
  onBack: () => void;
  data?: AITutorDescData;
}

// ─── 메인 화면 ────────────────────────────────────────────────────
export function AITutorDescStage({
  onNext,
  onBack,
  data = MOCK_AI_TUTOR_DESC,
}: Props) {
  const { lang } = useLang();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  // 스피커 버튼 — 반복 재생
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

      {/* 빈 공간 */}
      <View style={s.spacer} />

      {/* AI 튜터 영역: 말풍선 + 썸네일 */}
      <View style={s.tutorRow}>
        {/* 말풍선 */}
        <View style={s.bubble}>
          <Text style={s.bubbleText}>
            {pick(lang, data.bubbleKo, data.bubbleVi)}
          </Text>
          {/* 스피커 버튼 */}
          <TouchableOpacity
            style={[s.speakerBtn, isPlaying && s.speakerBtnActive]}
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
          style={s.tutorImage}
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
