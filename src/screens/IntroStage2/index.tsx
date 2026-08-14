import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { SESSION1 } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function IntroStage2({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const intro2 = SESSION1.intro2;

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={55} onClose={onBack} />

      {/* ── 캐릭터 + 말풍선 영역 ── */}
      <View style={styles.characterArea}>

        {/* 말풍선 */}
        <View style={styles.bubbleWrap}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{pick(lang, intro2.speech, intro2.speechVi)}</Text>
          </View>
          {/* 말풍선 꼬리 (캐릭터 방향) */}
          <View style={styles.bubbleTail} />
        </View>

        {/* 캐릭터 이미지 */}
        <Image
          source={require('../../../assets/character-kchao.png')}
          style={styles.character}
          resizeMode="contain"
        />
      </View>

      {/* ── 하단 정보 영역 ── */}
      <View style={styles.infoArea}>
        {/* 배지 */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pick(lang, intro2.badge, intro2.badgeVi)}</Text>
        </View>

        {/* 학습 성과 카드 */}
        <View style={styles.achievementCard}>
          <View style={styles.checkCircle}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
          <View style={styles.achievementText}>
            <Text style={styles.achievementLabel}>
              {pick(lang, intro2.achievement.label, intro2.achievement.labelVi)}
            </Text>
            <Text style={styles.achievementDesc}>
              {pick(lang, intro2.achievement.desc, intro2.achievement.descVi)}
            </Text>
          </View>
        </View>
      </View>

      {/* ── 하단 CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>{pick(lang, '다음  →', 'Tiếp theo  →')}</Text>
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

  // ── 캐릭터 영역 ──
  characterArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 16,
    paddingBottom: 8,
  },

  // 말풍선
  bubbleWrap: {
    alignItems: 'center',
    marginBottom: 4,
  },
  bubble: {
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    maxWidth: 280,
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  bubbleText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 26,
  },
  // 말풍선 꼬리 — 아래를 향하는 삼각형
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.teal,
    marginTop: -1,
  },

  // 캐릭터 이미지
  character: {
    width: 220,
    height: 220,
  },

  // ── 하단 정보 ──
  infoArea: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 12,
    alignItems: 'flex-start',
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

  // ── 푸터 ──
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
  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
