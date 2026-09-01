/**
 * 세트 학습 완료 (SetCompleteStage)
 * - 프로그레스바 헤더
 * - 체크마크 아이콘
 * - 완료 메시지 (한국어/베트남어)
 * - 공통 ActivityHeader, CtaButton 적용
 */
import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';
import { useTheme } from '../../theme/ThemeContext';
import { ThemedCelebrationBody } from '../../components/themed/ThemedCelebrationBody';

interface Props {
  setNumber?: number;
  totalSets?: number;
  onNext?: () => void;
  onBack?: () => void;
}

export function SetCompleteStage({
  setNumber = 1,
  totalSets = 3,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const { theme, enabled: themeEnabled } = useTheme();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const playAudio = () => {
    if (Platform.OS !== 'web') return;

    try {
      const audioSrc = require('../../../assets/sounds/260825_setcomplete.mp3');
      if (!audioSrc) return;

      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioSrc);
      audioRef.current = audio;
      setIsAudioPlaying(true);

      audio.play().catch(() => {
        setIsAudioPlaying(false);
      });

      audio.onended = () => {
        setIsAudioPlaying(false);
      };

      audio.onerror = () => {
        setIsAudioPlaying(false);
      };
    } catch {
      setIsAudioPlaying(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      playAudio();
    }, 500);
    return () => {
      clearTimeout(timer);
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const progressPct = (setNumber / totalSets) * 100;

  if (themeEnabled) {
    return (
      <ThemedCelebrationBody
        theme={theme}
        lang={lang}
        progressPct={progressPct}
        onBack={onBack || (() => {})}
        onNext={onNext}
        titleKo={`${setNumber} 세트 학습을 완료했습니다!`}
        titleVi={`Bạn đã hoàn thành ${setNumber} set học rồi!`}
        noteKo={setNumber === totalSets ? '다음 단계로 넘어가세요.' : '다음 단어로 넘어가세요.'}
        noteVi={setNumber === totalSets ? 'Hãy chuyển sang giai đoạn tiếp theo nhé.' : 'Hãy chuyển sang từ tiếp theo nhé.'}
        ctaKo="다음"
        ctaVi="Tiếp tục"
        setNumber={setNumber}
        totalSets={totalSets}
      />
    );
  }

  return (
    <View style={s.root}>
      <ActivityHeader
        percentage={progressPct}
        onClose={onBack || (() => {})}
      />

      <View style={s.container}>
        {/* 체크마크 아이콘 */}
        <View style={s.iconContainer}>
          <View style={s.iconCircle}>
            <Text style={s.icon}>✓</Text>
          </View>
        </View>

        {/* 텍스트 영역 */}
        <View style={s.textContainer}>
          <Text style={s.mainText}>
            {pick(
              lang,
              `${setNumber} 세트 학습을 완료했습니다!`,
              `Bạn đã hoàn thành ${setNumber} set học rồi!`
            )}
          </Text>

          <Text style={s.subTextVi}>
            {pick(
              lang,
              `Bạn đã hoàn thành ${setNumber} set học rồi!`,
              `${setNumber} 세트 학습을 완료했습니다!`
            )}
          </Text>

          <Text style={s.instructionText}>
            {setNumber === totalSets
              ? pick(lang, '다음 단계로 넘어가세요.', 'Hãy chuyển sang giai đoạn tiếp theo nhé.')
              : pick(lang, '다음 단어로 넘어가세요.', 'Hãy chuyển sang từ tiếp theo nhé.')}
          </Text>
        </View>
      </View>

      {/* 하단 액션 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '다음', 'Tiếp tục')}
          onPress={onNext}
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  iconContainer: {
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: radius.pill,
    backgroundColor: colors.correctLight,
    borderWidth: 3,
    borderColor: colors.correct,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.strong,
  },
  icon: {
    fontSize: 44,
    color: colors.correct,
    fontWeight: '900',
  },
  textContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  mainText: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 30,
  },
  subTextVi: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.tealDark,
    textAlign: 'center',
    lineHeight: 22,
  },
  instructionText: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
