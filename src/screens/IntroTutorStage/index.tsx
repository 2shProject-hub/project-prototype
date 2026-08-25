import { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { SESSION1 } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

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
        <View style={styles.card}>
          {/* 1. 배지 */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pick(lang, intro.badge, intro.badgeVi)}</Text>
          </View>

          {/* 2. 아이콘 */}
          <View style={styles.iconCircle}>
            <Text style={styles.iconEmoji}>{intro.icon}</Text>
          </View>

          {/* 3. 타이틀 */}
          <Text style={styles.title}>{pick(lang, intro.title, intro.titleVi)}</Text>

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
        <TouchableOpacity
          style={[styles.ctaBtn, isAudioPlaying && styles.ctaBtnDisabled]}
          onPress={isAudioPlaying ? undefined : onNext}
          activeOpacity={isAudioPlaying ? 1 : 0.85}
        >
          <Text style={[styles.ctaBtnText, isAudioPlaying && styles.ctaBtnTextDisabled]}>
            {pick(lang, '다음  →', 'Tiếp theo  →')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // ── Content ──
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  card: {
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEDF0',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },

  badge: {
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.teal,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {
    fontSize: 36,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.teal,
    textAlign: 'center',
    lineHeight: 22,
  },

  achievementCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F0FAFA',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignSelf: 'stretch',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  achievementText: {
    flex: 1,
    gap: 3,
  },
  achievementLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  achievementDesc: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.muted,
    lineHeight: 20,
  },

  // ── Footer ──
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
    backgroundColor: colors.line,
  },
  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaBtnTextDisabled: {
    color: colors.muted,
  },
});
