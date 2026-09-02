import { useTheme } from '../../theme/ThemeContext';

// 말해보카: 벡터 글리프 대신 상황 실사진 — 키보드(문법 연습)·마이크(말하기 평가)
const MB_ICON_PHOTOS: Record<string, { img: any; fit: 'cover' | 'contain' }> = {
  '📖': { img: require('../../../assets/themes/malhaeboka/thumb-vocab.png'), fit: 'cover' },
  '📝': { img: require('../../../assets/themes/malhaeboka/icon-keyboard-sphere.png'), fit: 'contain' },
  '⌨': { img: require('../../../assets/themes/malhaeboka/icon-keyboard-sphere.png'), fit: 'contain' },
  '🎤': { img: require('../../../assets/themes/malhaeboka/photo-mic.png'), fit: 'cover' },
};
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, Image } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { SESSION1 } from '../../data/lessonData';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';

const TUTOR_AUDIO = require('../../../assets/sounds/tutor_intro_5.wav') as string;

interface IntroData {
  badge: string;
  badgeVi: string;
  icon: string;
  title: string;
  titleVi: string;
  subtitle: string;
  subtitleVi: string;
  achievement: {
    label: string;
    labelVi: string;
    desc: string;
    descVi: string;
  };
}

interface Props {
  onNext: () => void;
  onBack: () => void;
  introData?: IntroData;
}

export function IntroTutorStage({ onNext, onBack, introData }: Props) {
  const { lang } = useLang();
  const { theme: __mbT, enabled: __mbE } = useTheme();
  const __mbBig = __mbE && __mbT.id === 'malhaeboka';
  const intro = introData ?? SESSION1.intro;

  const [isAudioPlaying, setIsAudioPlaying] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    try {
      const audio = new Audio(TUTOR_AUDIO);
      audio.volume = 0.9;
      audioRef.current = audio;
      audio.play().catch(() => { setIsAudioPlaying(false); });
      audio.onended = () => setIsAudioPlaying(false);
    } catch {
      setIsAudioPlaying(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={40} onClose={onBack} />

      {/* ── 콘텐츠 (수직 중앙 정렬) ── */}
      <View style={styles.content}>
        <View style={[styles.card, __mbBig && { alignSelf: 'stretch' as const, flexGrow: 1, justifyContent: 'center' as const, paddingVertical: 30, paddingHorizontal: 18, marginHorizontal: 0, gap: 24 }]}>
          {/* 1. 배지 */}
          <View style={styles.badge}>
            <Text style={[styles.badgeText, __mbBig && { fontSize: 14 }]}>{pick(lang, intro.badge, intro.badgeVi)}</Text>
          </View>

          {/* 2. 아이콘 */}
          <View style={[styles.iconCircle, __mbBig && { width: 150, height: 150, borderRadius: 75, overflow: 'visible' as const }]}>
            {__mbBig && MB_ICON_PHOTOS[intro.icon] ? (
              <Image
                source={MB_ICON_PHOTOS[intro.icon].img}
                style={MB_ICON_PHOTOS[intro.icon].fit === 'contain' ? { width: '112%', height: '112%' } : { width: '100%', height: '100%', borderRadius: 75 }}
                resizeMode={MB_ICON_PHOTOS[intro.icon].fit}
              />
            ) : (
              <ThemedGlyph style={[styles.iconEmoji, __mbBig && { fontSize: 46 }]} glyph={intro.icon} />
            )}
          </View>

          {/* 3. 타이틀 */}
          <Text style={[styles.title, __mbBig && { fontSize: 26, lineHeight: 36 }]}>{pick(lang, intro.title, intro.titleVi)}</Text>

          {/* 4. 서브타이틀 */}
          <Text style={[styles.subtitle, __mbBig && { fontSize: 17, lineHeight: 26, color: '#4B4660' }]}>{pick(lang, intro.subtitle, intro.subtitleVi)}</Text>

          {/* 5. 학습 성과 카드 */}
          <View style={styles.achievementCard}>
            <View style={[styles.checkCircle, __mbBig && { backgroundColor: 'transparent', width: 44, height: 44, borderWidth: 0 }]}>
              {__mbBig ? (
                <Image source={require('../../../assets/themes/malhaeboka/icon-check-egg.png')} style={{ width: 38, height: 38 }} resizeMode="contain" />
              ) : (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </View>
            <View style={styles.achievementText}>
              <Text style={[styles.achievementLabel, __mbBig && { fontSize: 16 }]}>{pick(lang, intro.achievement.label, intro.achievement.labelVi)}</Text>
              <Text style={[styles.achievementDesc, __mbBig && { fontSize: 14.5, lineHeight: 21 }]}>{pick(lang, intro.achievement.desc, intro.achievement.descVi)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── 하단 CTA ── */}
      <View style={styles.footer}>
        <CtaButton
          title={pick(lang, '다음  →', 'Tiếp theo  →')}
          onPress={onNext}
          disabled={isAudioPlaying}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  card: {
    alignItems: 'center',
    gap: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.xl,
    ...shadow.card,
  },
  badge: {
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    color: colors.tealDark,
    fontSize: 13,
    fontWeight: '700',
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 34,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: -spacing.xs,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    padding: spacing.md,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  checkCircle: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: colors.correctLight,
    borderWidth: 1.5,
    borderColor: colors.correct,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: colors.correct,
    fontWeight: '900',
    fontSize: 16,
  },
  achievementText: {
    flex: 1,
    gap: 2,
  },
  achievementLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  achievementDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
