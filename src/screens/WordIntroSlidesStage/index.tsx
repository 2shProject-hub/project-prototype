/**
 * 단어 슬라이드 (WordIntroSlidesStage)
 * Source B: kchao-lesson1-feature-word-intro-slides / WordIntroTemplate.jsx
 * kcho-dev 목적지: src/screens/activity/preview/PreviewWordSlides.tsx (TBD)
 *
 * 레이아웃: ActivityHeader → 슬라이드 콘텐츠 → AI튜터+말풍선 → [이전/N/넘기기] → [다음]
 * [다음] 버튼은 마지막 슬라이드 도달 후 활성화
 */
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, Image, StyleSheet, Platform,
} from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick, type Lang } from '../../components/LangContext';
import { colors, shadow } from '../../theme';
import { MOCK_WORD_SLIDES, type WordSlide } from '../../data/lessonData';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png') as string;

interface Props {
  onNext: () => void;
  onBack: () => void;
  slides?: WordSlide[];
}

export function WordIntroSlidesStage({ onNext, onBack, slides }: Props) {
  const { lang } = useLang();
  const data = slides ?? MOCK_WORD_SLIDES;

  const [index, setIndex] = useState(0);
  const [visitedLast, setVisitedLast] = useState(data.length === 1);
  const [needsTap, setNeedsTap] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const slide = data[index];
  const isFirst = index === 0;
  const isLast = index === data.length - 1;
  const total = data.length;
  const percentage = Math.round(((index + 1) / total) * 100);

  // 슬라이드 전환: 음원 정지 → 새 음원 자동 재생
  useEffect(() => {
    setNeedsTap(false);
    if (Platform.OS !== 'web' || !slide.audio) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(slide.audio);
    audioRef.current = audio;
    audio.play().catch(() => setNeedsTap(true));

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [index]);

  // 마지막 슬라이드 도달 시 [다음] 버튼 활성화
  useEffect(() => {
    if (isLast) setVisitedLast(true);
  }, [isLast]);

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const replayAudio = () => {
    if (Platform.OS !== 'web' || !audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
    setNeedsTap(false);
  };

  const goPrev = () => {
    if (isFirst) return;
    stopAudio();
    setIndex(i => i - 1);
  };

  const goSkip = () => {
    if (isLast) return;
    stopAudio();
    setIndex(i => i + 1);
  };

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={percentage} onClose={onBack} />

      {/* 슬라이드 콘텐츠 */}
      <View style={s.slideArea}>
        {slide.slideImage ? (
          <Image
            source={slide.slideImage as any}
            style={s.slideImage}
            resizeMode="contain"
          />
        ) : (
          <View style={{ flex: 1 }}>
            {slide.kind === 'intro' && <IntroSlide slide={slide} lang={lang} />}
            {slide.kind === 'quiz' && <QuizSlide slide={slide} />}
            {slide.kind === 'outro' && <OutroSlide slide={slide} />}
          </View>
        )}
      </View>

      {/* AI 튜터 + 말풍선 */}
      {slide.showTutor && (
        <View style={s.tutorRow}>
          <View style={s.bubbleWrap}>
            <Text style={s.bubbleText} numberOfLines={3}>
              {pick(lang, slide.bubble.ko, slide.bubble.vi)}
            </Text>
            <TouchableOpacity
              style={[s.speakerBtn, needsTap && s.speakerBtnActive]}
              onPress={replayAudio}
              activeOpacity={0.7}
            >
              <ThemedGlyph style={s.speakerIcon} glyph="🔊" />
            </TouchableOpacity>
          </View>
          <Image source={TUTOR_IMAGE as any} style={s.tutorImg} resizeMode="contain" />
        </View>
      )}

      {/* [이전] / N/총 / [넘기기] 네비게이션 */}
      <View style={s.navRow}>
        <TouchableOpacity
          style={[s.navBtn, isFirst && s.navBtnDisabled]}
          onPress={goPrev}
          disabled={isFirst}
          activeOpacity={0.7}
        >
          <Text style={[s.navBtnText, isFirst && s.navBtnTextDisabled]}>‹ 이전</Text>
        </TouchableOpacity>

        <Text style={s.pageLabel}>{index + 1} / {total}</Text>

        <TouchableOpacity
          style={[s.navBtn, isLast && s.navBtnDisabled]}
          onPress={goSkip}
          disabled={isLast}
          activeOpacity={0.7}
        >
          <Text style={[s.navBtnText, isLast && s.navBtnTextDisabled]}>넘기기 ›</Text>
        </TouchableOpacity>
      </View>

      {/* [다음] 버튼 — 마지막 슬라이드 도달 후 활성 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.nextBtn, !visitedLast && s.nextBtnDisabled]}
          onPress={visitedLast ? onNext : undefined}
          disabled={!visitedLast}
          activeOpacity={0.85}
        >
          <Text style={[s.nextBtnText, !visitedLast && s.nextBtnTextDisabled]}>
            다음 →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── 슬라이드 타입별 렌더러 ────────────────────────────────────────────────────

function IntroSlide({ slide, lang }: { slide: WordSlide; lang: Lang }) {
  return (
    <View style={sc.introWrap}>
      {slide.badge && (
        <View style={sc.badge}>
          <Text style={sc.badgeText}>{pick(lang, slide.badge.ko, slide.badge.vi)}</Text>
        </View>
      )}
      {slide.title && (
        <View style={sc.titleWrap}>
          <Text style={sc.titleKo}>{slide.title.ko}</Text>
          <Text style={sc.titleVi}>{slide.title.vi}</Text>
        </View>
      )}
      <View style={sc.cardRow}>
        {slide.cards?.map((card, i) => (
          <View key={i} style={sc.card}>
            {card.image ? (
              <Image source={card.image as any} style={sc.cardImg} resizeMode="cover" />
            ) : (
              <View style={sc.cardImgPlaceholder} />
            )}
            <Text style={sc.cardKo}>{card.ko}</Text>
            <Text style={sc.cardVi}>{card.vi}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function QuizSlide({ slide }: { slide: WordSlide }) {
  const [selected, setSelected] = useState<number | null>(null);
  const revealed = selected !== null;

  return (
    <View style={sc.quizWrap}>
      {slide.badge && (
        <View style={sc.badge}>
          <Text style={sc.badgeText}>{slide.badge.ko}</Text>
        </View>
      )}
      {slide.question && (
        <View style={sc.titleWrap}>
          <Text style={sc.titleKo}>{slide.question.ko}</Text>
          <Text style={sc.titleVi}>{slide.question.vi}</Text>
        </View>
      )}
      {slide.equation && (
        <View style={sc.equationRow}>
          <Text style={sc.eqText}>{slide.equation.left}</Text>
          <Text style={sc.eqOp}>+</Text>
          <View style={[sc.eqSlot, revealed && sc.eqSlotFilled]}>
            <Text style={sc.eqSlotText}>
              {revealed && slide.answer !== undefined ? slide.choices?.[slide.answer] : ''}
            </Text>
          </View>
          <Text style={sc.eqOp}>=</Text>
          <Text style={sc.eqText}>{slide.equation.right}</Text>
        </View>
      )}
      <View style={sc.choiceList}>
        {slide.choices?.map((choice, i) => {
          const isAnswer = slide.answer === i;
          const isSelected = selected === i;
          return (
            <TouchableOpacity
              key={i}
              style={[
                sc.choiceItem,
                revealed && isAnswer && sc.choiceCorrect,
                revealed && isSelected && !isAnswer && sc.choiceWrong,
              ]}
              onPress={() => !revealed && setSelected(i)}
              activeOpacity={revealed ? 1 : 0.75}
              disabled={revealed}
            >
              <Text style={sc.choiceNum}>{i + 1}</Text>
              <Text style={[sc.choiceText, revealed && isAnswer && sc.choiceTextCorrect]}>
                {choice}
              </Text>
              {revealed && isAnswer && <Text style={sc.choiceCheck}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function OutroSlide({ slide }: { slide: WordSlide }) {
  return (
    <View style={sc.outroWrap}>
      {slide.image && (
        <Image source={slide.image as any} style={sc.outroImg} resizeMode="contain" />
      )}
    </View>
  );
}

// ── 메인 스타일 ───────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },

  slideArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  slideImage: {
    flex: 1,
    width: '100%' as any,
  },

  tutorRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  bubbleWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
    ...shadow.soft,
  },
  bubbleText: {
    flex: 1,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 19,
  },
  speakerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerBtnActive: { backgroundColor: colors.teal },
  speakerIcon: { fontSize: 16 },
  tutorImg: { width: 64, height: 80 },

  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  navBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    minWidth: 80,
    alignItems: 'center',
  },
  navBtnDisabled: {
    borderColor: colors.bgDisabled,
    backgroundColor: colors.canvas,
  },
  navBtnText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  navBtnTextDisabled: { color: colors.textDisabled },
  pageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.muted,
    minWidth: 40,
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  nextBtn: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnDisabled: { backgroundColor: colors.bgDisabled },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: colors.textWhite },
  nextBtnTextDisabled: { color: colors.textDisabled },
});

// ── 슬라이드 콘텐츠 스타일 ──────────────────────────────────────────────────

const sc = StyleSheet.create({
  badge: {
    alignSelf: 'center',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.teal },

  titleWrap: { alignItems: 'center', gap: 4 },
  titleKo: { fontSize: 22, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  titleVi: { fontSize: 14, color: colors.muted, textAlign: 'center' },

  // intro
  introWrap: { flex: 1, gap: 16, alignItems: 'center', justifyContent: 'center' },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    maxWidth: 160,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    alignItems: 'center',
    gap: 10,
    ...shadow.card,
  },
  cardImg: { width: '100%' as any, aspectRatio: 1.2, borderRadius: 10 },
  cardImgPlaceholder: {
    width: '100%' as any,
    aspectRatio: 1.2,
    borderRadius: 10,
    backgroundColor: colors.canvas,
  },
  cardKo: { fontSize: 16, fontWeight: '700', color: colors.ink },
  cardVi: { fontSize: 13, color: colors.muted },

  // quiz
  quizWrap: { flex: 1, gap: 14 },
  equationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: colors.canvas,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  eqText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  eqOp: { fontSize: 16, fontWeight: '700', color: colors.muted },
  eqSlot: {
    minWidth: 60,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
  },
  eqSlotFilled: { backgroundColor: colors.tealSoft },
  eqSlotText: { fontSize: 14, color: colors.teal, fontWeight: '700' },
  choiceList: { gap: 10 },
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.surface,
  },
  choiceCorrect: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  choiceWrong: { borderColor: colors.wrong, backgroundColor: colors.wrongLight },
  choiceNum: { fontSize: 14, fontWeight: '700', color: colors.muted, width: 20 },
  choiceText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.ink },
  choiceTextCorrect: { color: colors.teal },
  choiceCheck: { fontSize: 18, color: colors.teal, fontWeight: '700' },

  // outro
  outroWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  outroImg: { width: 220, height: 220 },
});
