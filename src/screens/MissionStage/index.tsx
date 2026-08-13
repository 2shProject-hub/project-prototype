import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';
import { SESSION1, STAGE_ORDER, STAGE_LABELS } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Props {
  sessionId: number;
  onNext: () => void;
  onBack: () => void;
}

const TOTAL_STAGES = STAGE_ORDER.length;

export function MissionStage({ sessionId, onNext, onBack }: Props) {
  const { lang } = useLang();
  const mission = SESSION1.mission;
  const progressPct = (1 / TOTAL_STAGES) * 100;

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={progressPct} onClose={onBack} />

      {/* ── 콘텐츠 ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. 현재 차시 배지 */}
        <View style={styles.stageBadge}>
          <Text style={styles.stageBadgeText}>{pick(lang, `${sessionId}차시 ${STAGE_LABELS.mission}`, `Mục tiêu bài ${sessionId}`)}</Text>
        </View>

        {/* 2. 일러스트 영역 */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/classroom.jpg')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* 3. 타이틀 박스 — 좌측 보더 */}
        <View style={styles.titleBox}>
          <Text style={styles.titleKo}>{mission.ko}</Text>
          <Text style={styles.titleVi}>{mission.vi}</Text>
        </View>

        {/* 4. 서브타이틀 불릿 카드 */}
        <View style={styles.subBlock}>
          {mission.subTitles.ko.map((text, i) => (
            <View key={i} style={styles.subItem}>
              <View style={styles.subDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.subTextKo}>{text}</Text>
                {mission.subTitles.vi[i] ? (
                  <Text style={styles.subTextVi}>{mission.subTitles.vi[i]}</Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

      </ScrollView>

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


  // ── Content ──
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },

  stageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stageBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.teal,
  },

  imageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },

  titleBox: {
    backgroundColor: '#f0fcfc',
    borderLeftWidth: 4,
    borderLeftColor: colors.teal,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 6,
  },
  titleKo: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 26,
  },
  titleVi: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.teal,
    lineHeight: 20,
  },

  subBlock: {
    backgroundColor: '#fafafa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8e8f0',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  subDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.teal,
    marginTop: 8,
    flexShrink: 0,
  },
  subTextKo: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
    lineHeight: 24,
  },
  subTextVi: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.muted,
    lineHeight: 20,
    marginTop: 2,
  },

  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipText: {
    fontSize: 12,
    color: colors.muted,
    fontWeight: '500',
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
  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
