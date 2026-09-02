import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { SESSION1 } from '../../data/lessonData';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';

const TUTOR_AUDIO = require('../../../assets/sounds/tutor_intro_5.wav') as string;

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function IntroEvalStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const { theme: __mbT, enabled: __mbE } = useTheme();
  const __mbBig = __mbE && __mbT.id === 'malhaeboka';
  const intro = SESSION1.introEvaluation;

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
      <ActivityHeader percentage={60} onClose={onBack} />

      {/* ── 콘텐츠 (수직 중앙 정렬) ── */}
      <View style={styles.content}>
        <View style={[styles.card, __mbBig && { alignSelf: 'stretch' as const, flexGrow: 1, justifyContent: 'center' as const, paddingVertical: 34, marginHorizontal: 4 }]}>
          {/* 1. 배지 */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pick(lang, intro.badge, intro.badgeVi)}</Text>
          </View>

          {/* 2. 아이콘 */}
          <View style={styles.iconCircle}>
            <ThemedGlyph style={[styles.iconEmoji, __mbBig && { fontSize: 46 }]} glyph={intro.icon} />
          </View>

          {/* 3. 타이틀 */}
          <Text style={[styles.title, __mbBig && { fontSize: 26, lineHeight: 36 }]}>{pick(lang, intro.title, intro.titleVi)}</Text>

          {/* 4. 서브타이틀 */}
          <Text style={styles.subtitle}>{pick(lang, intro.subtitle, intro.subtitleVi)}</Text>

          {/* 5. 학습 성과 카드 */}
          <View style={styles.achievementCard}>
            <View style={styles.checkCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
            <View style={styles.achievementText}>
              <Text style={styles.achievementLabel}>{pick(lang, intro.achievement.label, intro.achievement.labelVi)}</Text>
              <Text style={styles.achievementDesc}>{pick(lang, intro.achievement.desc, intro.achievement.descVi)}</Text>
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
