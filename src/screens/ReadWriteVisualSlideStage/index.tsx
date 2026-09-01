/**
 * ReadWriteVisualSlideStage (16-S. 읽고 쓰기 - 3컷 직관 그림 슬라이드 화면)
 * 
 * [목적 및 특징]
 * - 한국어를 전혀 읽지 못하는 베트남인 초급 학습자를 위한 3컷 그림 카드 슬라이드 화면
 * - 텍스트 없이 그림 1장 + 음성 1개로 1컷 만남 -> 2컷 읽기 -> 3컷 쓰기의 3단계를 시각적으로 전달
 */

import { ThemedGlyph } from '../../components/ThemedGlyph';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { MOCK_READ_WRITE_VISUAL_SLIDE } from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function ReadWriteVisualSlideStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const data = MOCK_READ_WRITE_VISUAL_SLIDE;
  const total = data.slides.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSeenLast, setHasSeenLast] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const currentSlide = data.slides[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleNext = () => {
    if (currentIndex < total - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      if (next === total - 1) setHasSeenLast(true);
    }
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={65} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. 상단 배지 및 타이틀 ── */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {pick(lang, data.badgeKo, data.badgeVi)}
            </Text>
          </View>
          <Text style={styles.counterText}>
            {currentIndex + 1} / {total}
          </Text>
        </View>

        <Text style={styles.title}>
          {pick(lang, data.titleKo, data.titleVi)}
        </Text>

        {/* ── 2. 3컷 카드 슬라이드 뷰어 ── */}
        <View style={styles.slideCard}>
          {/* 슬라이드 대형 일러스트 영역 */}
          <View style={styles.illustrationArea}>
            <Text style={styles.slideEmoji}>{currentSlide.emoji}</Text>
            <TouchableOpacity
              style={[
                styles.audioCircleBtn,
                isPlayingAudio && styles.audioCircleBtnPlaying,
              ]}
              onPress={handlePlayAudio}
              activeOpacity={0.8}
            >
              <ThemedGlyph style={styles.audioIcon} glyph={isPlayingAudio ? '🔊' : '🔈'} />
            </TouchableOpacity>
          </View>

          {/* 슬라이드 텍스트 박스 */}
          <View style={styles.slideTextBox}>
            <Text style={styles.slideStepTitle}>
              {pick(lang, currentSlide.titleKo, currentSlide.titleVi)}
            </Text>
            <Text style={styles.slideCaptionVi}>{currentSlide.captionVi}</Text>
            <Text style={styles.slideCaptionKo}>{currentSlide.captionKo}</Text>
          </View>

          {/* 3단계 점 인디케이터 */}
          <View style={styles.dotsRow}>
            {data.slides.map((s, idx) => (
              <View
                key={s.step}
                style={[
                  styles.dot,
                  idx === currentIndex && styles.dotActive,
                  idx < currentIndex && styles.dotPassed,
                ]}
              />
            ))}
          </View>
        </View>

        {/* ── 3. 슬라이드 이동 컨트롤 ── */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navBtnText,
                currentIndex === 0 && styles.navBtnTextDisabled,
              ]}
            >
              ‹ {pick(lang, '이전', 'Trước')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navBtn,
              styles.navBtnNext,
              currentIndex === total - 1 && styles.navBtnDisabled,
            ]}
            onPress={handleNext}
            disabled={currentIndex === total - 1}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.navBtnText,
                styles.navBtnTextNext,
                currentIndex === total - 1 && styles.navBtnTextDisabled,
              ]}
            >
              {pick(lang, '다음 컷', 'Tiếp')} ›
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── 하단 CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.ctaBtn, !hasSeenLast && styles.ctaBtnDisabled]}
          onPress={onNext}
          disabled={!hasSeenLast}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {pick(lang, '읽고 쓰기 시작하기  →', 'Bắt đầu đọc và viết  →')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 16,
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.teal },
  counterText: { fontSize: 13, fontWeight: '800', color: colors.muted },
  title: { fontSize: 23, fontWeight: '800', color: colors.ink, lineHeight: 30 },

  // 슬라이드 카드
  slideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#BFE8E6',
    overflow: 'hidden',
    ...shadow.card,
  },
  illustrationArea: {
    height: 180,
    backgroundColor: '#F0FAFA',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slideEmoji: { fontSize: 72 },
  audioCircleBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  audioCircleBtnPlaying: { backgroundColor: colors.tealSoft },
  audioIcon: { fontSize: 20 },

  slideTextBox: {
    padding: 16,
    gap: 6,
    alignItems: 'center',
  },
  slideStepTitle: { fontSize: 16, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  slideCaptionVi: { fontSize: 13, fontWeight: '700', color: colors.teal, textAlign: 'center' },
  slideCaptionKo: { fontSize: 12, color: colors.muted, textAlign: 'center' },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 16,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0' },
  dotActive: { width: 24, backgroundColor: colors.teal },
  dotPassed: { backgroundColor: '#A5E6E4' },

  // 네비게이션 버튼
  navRow: { flexDirection: 'row', gap: 10 },
  navBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnNext: { backgroundColor: colors.tealSoft, borderColor: '#BFE8E6' },
  navBtnDisabled: { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
  navBtnText: { fontSize: 14, fontWeight: '700', color: colors.ink },
  navBtnTextNext: { color: colors.teal, fontWeight: '800' },
  navBtnTextDisabled: { color: '#CBD5E1' },

  // 하단 CTA
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  ctaBtnDisabled: { backgroundColor: '#CBD5E1' },
  ctaBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
