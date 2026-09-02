import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { ActivityHeader } from '../../components/ActivityHeader';
import { MOCK_SLIDE_EXPLAIN } from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function SlideExplainStage({ onNext, onBack }: Props) {
  const data = MOCK_SLIDE_EXPLAIN;
  const slides = data.slides;
  const total = slides.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSeenLast, setHasSeenLast] = useState(total <= 1);

  const slide = slides[currentIndex];
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex === total - 1;

  const goToPrev = () => {
    if (!isPrevDisabled) setCurrentIndex((i) => i - 1);
  };

  const goToNext = () => {
    if (!isNextDisabled) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      if (next === total - 1) setHasSeenLast(true);
    }
  };

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={40} onClose={onBack} />

      {/* ── 콘텐츠 ── */}
      <View style={s.content}>
        {/* 슬라이드 이미지 */}
        <View style={s.imageCard}>
          {slide.image ? (
            <Image source={slide.image} style={s.image} resizeMode="contain" />
          ) : (
            <View style={s.placeholder}>
              <ThemedGlyph style={s.placeholderIcon} glyph="🖼️" />
              <Text style={s.placeholderLabel}>슬라이드 이미지</Text>
              <Text style={s.placeholderSub}>{currentIndex + 1} / {total}</Text>
            </View>
          )}
        </View>

        {/* 설명 텍스트 */}
        <View style={s.captionBox}>
          <Text style={s.captionText}>{slide.text}</Text>
        </View>

        {/* 슬라이드 이동 버튼 */}
        <View style={s.navRow}>
          <TouchableOpacity
            style={[s.navBtn, isPrevDisabled && s.navBtnDisabled]}
            onPress={goToPrev}
            disabled={isPrevDisabled}
            activeOpacity={0.7}
          >
            <Text style={[s.navBtnText, isPrevDisabled && s.navBtnTextDisabled]}>‹ 이전</Text>
          </TouchableOpacity>

          <Text style={s.counter}>{currentIndex + 1} / {total}</Text>

          <TouchableOpacity
            style={[s.navBtn, isNextDisabled && s.navBtnDisabled]}
            onPress={goToNext}
            disabled={isNextDisabled}
            activeOpacity={0.7}
          >
            <Text style={[s.navBtnText, isNextDisabled && s.navBtnTextDisabled]}>넘기기 ›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── 하단 CTA ── */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.ctaBtn, !hasSeenLast && s.ctaBtnDisabled]}
          onPress={onNext}
          disabled={!hasSeenLast}
          activeOpacity={0.85}
        >
          <Text style={s.ctaBtnText}>다음  →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── 콘텐츠 ──
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    gap: 14,
    justifyContent: 'center',
  },

  // 슬라이드 이미지
  imageCard: {
    borderRadius: 16,
    overflow: 'hidden',
    aspectRatio: 4 / 3,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  placeholderIcon: {
    fontSize: 40,
  },
  placeholderLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.teal,
  },
  placeholderSub: {
    fontSize: 11,
    color: colors.muted,
  },

  // 설명 텍스트
  captionBox: {
    backgroundColor: colors.tealSoft,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    minHeight: 52,
    justifyContent: 'center',
  },
  captionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.teal,
    lineHeight: 22,
    textAlign: 'center',
  },

  // 슬라이드 이동 버튼
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  navBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: {
    borderColor: '#e2e8ea',
    backgroundColor: '#f8fafb',
  },
  navBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.teal,
  },
  navBtnTextDisabled: {
    color: '#b9c1c8',
  },
  counter: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
    minWidth: 36,
    textAlign: 'center',
  },

  // ── 하단 CTA ──
  footer: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: {
    backgroundColor: '#b9c1c8',
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
