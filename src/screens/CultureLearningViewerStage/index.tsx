/**
 * CultureLearningViewerStage — 문화 학습 뷰어
 *
 * Step 1: AI 튜터 인트로 dim 오버레이 (VideoBridgeStage 패턴)
 * Step 2: 타이틀 + 이미지 + 텍스트/오디오 통합 카드 (순수 열람)
 */
import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { colors, radius, shadow } from '../../theme';
import { MOCK_CULTURE_LEARNING_VIEWER } from '../../data/lessonData';
import type { CultureLearningViewerData } from '../../data/lessonData';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png');

type Step = 1 | 2;

interface Props {
  data?: CultureLearningViewerData;
  onNext: () => void;
  onBack: () => void;
}

export function CultureLearningViewerStage({
  data = MOCK_CULTURE_LEARNING_VIEWER,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const [step, setStep] = useState<Step>(1);
  const [isPlayingIntro, setIsPlayingIntro] = useState(false);
  const [isPlayingContent, setIsPlayingContent] = useState(false);

  const introAudioRef = useRef<HTMLAudioElement | null>(null);
  const contentAudioRef = useRef<HTMLAudioElement | null>(null);

  // ── Step 1: 튜터 오디오 자동 재생 ─────────────────────────────
  useEffect(() => {
    if (step !== 1 || Platform.OS !== 'web' || !data.intro.audioUri) return;
    const timer = setTimeout(() => {
      try {
        const audio = new Audio(data.intro.audioUri as string);
        introAudioRef.current = audio;
        audio.play().catch(() => {});
        setIsPlayingIntro(true);
        audio.onended = () => setIsPlayingIntro(false);
      } catch {}
    }, 300);
    return () => {
      clearTimeout(timer);
      introAudioRef.current?.pause();
      introAudioRef.current = null;
      setIsPlayingIntro(false);
    };
  }, [step]);

  // unmount cleanup
  useEffect(() => () => {
    introAudioRef.current?.pause();
    contentAudioRef.current?.pause();
  }, []);

  const handleReplayIntro = () => {
    if (Platform.OS !== 'web' || !data.intro.audioUri) return;
    introAudioRef.current?.pause();
    try {
      const audio = new Audio(data.intro.audioUri as string);
      introAudioRef.current = audio;
      audio.play().catch(() => {});
      setIsPlayingIntro(true);
      audio.onended = () => setIsPlayingIntro(false);
    } catch {}
  };

  const handleConfirmIntro = () => {
    introAudioRef.current?.pause();
    introAudioRef.current = null;
    setIsPlayingIntro(false);
    setStep(2);
  };

  const toggleContentAudio = () => {
    if (Platform.OS !== 'web' || !data.content.audioUri) return;
    if (isPlayingContent) {
      contentAudioRef.current?.pause();
      setIsPlayingContent(false);
    } else {
      try {
        if (!contentAudioRef.current) {
          contentAudioRef.current = new Audio(data.content.audioUri as string);
          contentAudioRef.current.onended = () => setIsPlayingContent(false);
        }
        contentAudioRef.current.currentTime = 0;
        contentAudioRef.current.play().catch(() => {});
        setIsPlayingContent(true);
      } catch {}
    }
  };

  const handleNext = () => {
    contentAudioRef.current?.pause();
    contentAudioRef.current = null;
    setIsPlayingContent(false);
    onNext();
  };

  // title 병기 순서
  const { firstLang, ko: titleKo, vi: titleVi } = data.content.title;
  const titlePrimary   = firstLang === 'ko' ? titleKo  : titleVi;
  const titleSecondary = firstLang === 'ko' ? titleVi  : titleKo;

  return (
    <View style={s.screen}>
      <ActivityHeader percentage={step === 1 ? 50 : 100} onClose={onBack} />

      {/* ── Step 2 본 화면 (항상 렌더) ───────────────────────── */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={step === 2}
      >
        {/* 타이틀 */}
        <View style={s.titleBlock}>
          {titlePrimary   ? <Text style={s.titlePrimary}>{titlePrimary}</Text>   : null}
          {titleSecondary ? <Text style={s.titleSecondary}>{titleSecondary}</Text> : null}
        </View>

        {/* 이미지 */}
        <View style={s.imageContainer}>
          <Image source={data.content.imageUri} style={s.image} resizeMode="cover" />
        </View>

        {/* 텍스트 + 오디오 통합 카드 */}
        <View style={s.textCard}>
          <TouchableOpacity
            style={[s.audioBtn, isPlayingContent && s.audioBtnPlaying]}
            onPress={toggleContentAudio}
            activeOpacity={0.8}
          >
            <Text style={s.audioBtnIcon}>🔊</Text>
          </TouchableOpacity>
          <Text style={s.textKo}>{data.content.text.ko}</Text>
          <Text style={s.textVi}>{data.content.text.vi}</Text>
        </View>
      </ScrollView>

      {/* Step 2 하단 다음 버튼 */}
      {step === 2 && (
        <View style={s.footer}>
          <TouchableOpacity style={s.nextBtn} onPress={handleNext} activeOpacity={0.9}>
            <Text style={s.nextBtnText}>{pick(lang, '다음 →', 'Tiếp theo →')}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Step 1: dim 오버레이 ─────────────────────────────── */}
      {step === 1 && (
        <View style={s.dimOverlay}>
          {/* 상단 배지 */}
          <View style={s.badgeWrap}>
            <Text style={s.badgeText}>{pick(lang, '문화', 'Văn hóa')}</Text>
          </View>

          {/* 하단: 말풍선 + 튜터 + 확인 버튼 */}
          <View style={s.introContent}>
            <View style={s.introTutorRow}>
              <View style={s.bubbleCard}>
                <Text style={s.bubbleText}>{data.intro.bubbleText}</Text>
                <TouchableOpacity
                  style={[s.speakerBtn, isPlayingIntro && s.speakerBtnPlaying]}
                  onPress={handleReplayIntro}
                  activeOpacity={0.8}
                >
                  <Text style={s.speakerIcon}>🔊</Text>
                </TouchableOpacity>
              </View>
              <Image source={TUTOR_IMAGE} style={s.tutorImage} resizeMode="contain" />
            </View>

            <TouchableOpacity style={s.confirmBtn} onPress={handleConfirmIntro} activeOpacity={0.9}>
              <Text style={s.confirmBtnText}>{pick(lang, '확인', 'Xác nhận')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },

  // ── Step 2 ─────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 24, gap: 16 },

  titleBlock: { gap: 4 },
  titlePrimary: { fontSize: 22, fontWeight: '800', color: colors.ink, lineHeight: 30 },
  titleSecondary: { fontSize: 14, color: colors.muted, lineHeight: 20 },

  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  image: { width: '100%', height: '100%' },

  textCard: {
    backgroundColor: colors.cultureBg,
    borderRadius: radius.md,
    padding: 16,
    paddingTop: 48,   // 오디오 버튼 공간 확보
    gap: 12,
    position: 'relative',
  },
  audioBtn: {
    position: 'absolute',
    top: 12, right: 12,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: colors.surface,
    alignItems: 'center', justifyContent: 'center',
    ...shadow.soft,
  },
  audioBtnPlaying: { backgroundColor: colors.teal },
  audioBtnIcon: { fontSize: 18 },
  textKo: { fontSize: 15, fontWeight: '700', color: colors.ink, lineHeight: 24 },
  textVi: { fontSize: 13, color: colors.muted, lineHeight: 21 },

  footer: {
    paddingHorizontal: 20, paddingBottom: 28, paddingTop: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  nextBtn: {
    backgroundColor: colors.teal, borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center',
  },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: colors.textWhite },

  // ── Step 1: Dim 오버레이 (VideoBridge 패턴) ─────────────────────
  dimOverlay: {
    // @ts-ignore — absoluteFillObject 타입 정의 누락 (Expo 57 알려진 이슈)
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 20,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  badgeWrap: {
    alignSelf: 'center',
    backgroundColor: '#D7F8F7',
    paddingHorizontal: 32, paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 3,
  },
  badgeText: { fontSize: 20, fontWeight: '800', color: colors.teal, letterSpacing: -0.3 },
  introContent: { width: '100%', gap: 16 },
  introTutorRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, width: '100%' },
  bubbleCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 20,
    paddingVertical: 18, paddingLeft: 18, paddingRight: 52,
    minHeight: 96, position: 'relative', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 8, elevation: 5,
  },
  bubbleText: { fontSize: 15, fontWeight: '700', color: '#111111', lineHeight: 23 },
  speakerBtn: {
    position: 'absolute', top: 12, right: 12,
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#D7F8F7',
    alignItems: 'center', justifyContent: 'center',
  },
  speakerBtnPlaying: { backgroundColor: colors.teal },
  speakerIcon: { fontSize: 18 },
  tutorImage: { width: 88, height: 122, flexShrink: 0 },
  confirmBtn: {
    backgroundColor: colors.teal, borderRadius: 14, height: 52,
    alignItems: 'center', justifyContent: 'center', width: '100%',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  confirmBtnText: { color: colors.textWhite, fontSize: 18, fontWeight: '700' },
});
