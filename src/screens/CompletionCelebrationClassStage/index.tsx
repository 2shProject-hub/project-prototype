import { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import LottieView from 'lottie-react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';
import { useTheme } from '../../theme/ThemeContext';
import { ThemedCelebrationBody } from '../../components/themed/ThemedCelebrationBody';

const TUTOR_IMAGE = require('../../../assets/word-slides/tutor.png') as string;
const COMPLETE_AUDIO = require('../../../assets/sounds/complete_vi.mp3') as string;

interface Props {
  title?: string;
  titleVi?: string;
  description?: string;
  descriptionVi?: string;
  nextButtonText?: string;
  nextButtonTextVi?: string;
  onNext?: () => void;
  onBack?: () => void;
}

export function CompletionCelebrationClassStage({
  title = '학습 완료!',
  titleVi = 'Hoàn thành bài học!',
  description = '오늘 배운 내용을 잘 기억해 보세요.',
  descriptionVi = 'Hãy nhớ kỹ những gì bạn đã học hôm nay nhé.',
  nextButtonText = '홈으로 가기',
  nextButtonTextVi = 'Về trang chủ',
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const { theme, enabled: themeEnabled } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    const timer = setTimeout(() => {
      try {
        const audio = new Audio(COMPLETE_AUDIO);
        audioRef.current = audio;
        audio.play().catch(() => {});
      } catch {}
    }, 300);
    return () => {
      clearTimeout(timer);
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    };
  }, []);

  const handleConfirm = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    onNext?.();
  };

  if (themeEnabled) {
    return (
      <ThemedCelebrationBody
        theme={theme}
        lang={lang}
        progressPct={100}
        onBack={onBack || (() => {})}
        onNext={onNext}
        titleKo={title}
        titleVi={titleVi}
        descKo={description}
        descVi={descriptionVi}
        ctaKo={nextButtonText}
        ctaVi={nextButtonTextVi}
        tutor={<Image source={TUTOR_IMAGE as any} style={s.tutorImage} resizeMode="contain" />}
      />
    );
  }

  return (
    <View style={s.root}>
      <ActivityHeader percentage={100} onClose={onBack || (() => {})} />

      <View style={s.content}>
        {/* Lottie 파티클 애니메이션 */}
        <View style={s.lottieContainer} pointerEvents="none">
          <LottieView
            source={require('../../../assets/particle-rain.json')}
            autoPlay
            loop
            style={s.lottieAnimation}
          />
        </View>

        {/* 메인 콘텐츠 카드 */}
        <View style={s.card}>
          <View style={s.iconContainer}>
            <Text style={s.icon}>🎓</Text>
          </View>

          {/* 한국어 */}
          <Text style={s.titleKo}>{title}</Text>
          <Text style={s.descriptionKo}>{description}</Text>

          {/* 구분선 */}
          <View style={s.divider} />

          {/* 베트남어 */}
          <Text style={s.titleVi}>{titleVi}</Text>
          <Text style={s.descriptionVi}>{descriptionVi}</Text>
        </View>

        {/* AI 튜터 썸네일 */}
        <Image source={TUTOR_IMAGE as any} style={s.tutorImage} resizeMode="contain" />
      </View>

      {/* 하단 액션 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, nextButtonText, nextButtonTextVi)}
          onPress={handleConfirm}
          size="lg"
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: 0,
  },
  tutorImage: {
    width: 160,
    height: 200,
    alignSelf: 'center',
  },
  lottieContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 380,
    overflow: 'hidden',
  },
  lottieAnimation: {
    width: '100%',
    height: '100%',
  },
  card: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    ...shadow.strong,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.pill,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 44,
  },
  titleKo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  descriptionKo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  divider: {
    width: 60,
    height: 2,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.lg,
  },
  titleVi: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.tealDark,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  descriptionVi: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
