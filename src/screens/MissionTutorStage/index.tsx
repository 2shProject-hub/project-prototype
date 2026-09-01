import { useEffect, useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { colors } from '../../theme/colors';
import { SESSION1, STAGE_ORDER, STAGE_LABELS } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

const TUTOR_AUDIO = require('../../../assets/sounds/tutor_mission_ko_f.wav') as string;
const TUTOR_THUMB = require('../../../assets/tutor_thumb_w.png');
const BUBBLE_LINES = [
  'Hôm nay chúng mình sẽ cùng học từ vựng và các mẫu câu về tên nước cũng như quốc tịch nhé.',
  'Sau đó, chúng ta sẽ thử dùng tiếng Hàn để giới thiệu bản thân kèm tên và quốc tịch của mình. Hãy cùng làm từng bước một nào!',
];

interface Props {
  sessionId: number;
  onNext: () => void;
  onBack: () => void;
}

const TOTAL_STAGES = STAGE_ORDER.length;

export function MissionTutorStage({ sessionId, onNext, onBack }: Props) {
  const { lang } = useLang();
  const mission = SESSION1.mission;
  const progressPct = (1 / TOTAL_STAGES) * 100;

  const [showTutor, setShowTutor] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!showTutor || Platform.OS !== 'web') return;

    try {
      const audio = new Audio(TUTOR_AUDIO);
      audio.volume = 0.9;
      audioRef.current = audio;
      audio.play().catch(() => {});
      audio.onended = () => setTimeout(() => setShowTutor(false), 500);
    } catch {}

    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dismissTutor = () => {
    if (audioRef.current) {
      audioRef.current.onended = null;
      audioRef.current.pause();
      audioRef.current = null;
    }
    setShowTutor(false);
  };

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
            source={require('../../../assets/sample/class-room.png')}
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

      {/* ── AI 튜터 오버레이 ── */}
      {showTutor && (
        <TouchableOpacity
          style={styles.dim}
          onPress={dismissTutor}
          activeOpacity={1}
        >
          {/* 말풍선 */}
          <View style={styles.bubble}>
            {BUBBLE_LINES.map((line, i) => (
              <Text key={i} style={[styles.bubbleText, i > 0 && styles.bubbleTextGap]}>{line}</Text>
            ))}
            {/* 말풍선 꼬리 */}
            <View style={styles.bubbleTail} />
          </View>

          {/* 하단 영역: 썸네일(위) + 확인 버튼(아래) */}
          <View style={styles.dimBottom}>
            {/* 튜터 썸네일 — 버튼 위, 우측 정렬 */}
            <View style={styles.thumbRow}>
              <Image
                source={TUTOR_THUMB}
                style={styles.tutorThumb}
                resizeMode="contain"
              />
            </View>

            {/* 확인 버튼 — 풀 width */}
            <TouchableOpacity style={styles.confirmBtn} onPress={dismissTutor} activeOpacity={0.85}>
              <Text style={styles.ctaBtnText}>확인</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
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

  // ── AI 튜터 오버레이 ──
  dim: {
    position: 'absolute',
    top: 0, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    position: 'absolute',
    bottom: 300,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bubbleText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.ink,
    lineHeight: 22,
  },
  bubbleTextGap: {
    marginTop: 10,
  },
  // 말풍선 꼬리 (우측 하단 방향)
  bubbleTail: {
    position: 'absolute',
    bottom: -10,
    right: 24,
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FFFFFF',
  },
  dimBottom: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  thumbRow: {
    alignItems: 'flex-end',
  },
  tutorThumb: {
    width: 140,
    height: 200,
  },
  confirmBtn: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
