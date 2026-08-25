/**
 * SpeakingAudioTutorStage (15-A. 말하기 - 음성 튜터 안내형 화면)
 * 
 * [목적 및 특징]
 * - 한국어를 전혀 읽지 못하는 베트남인 초급 학습자를 위한 AI 튜터 보이스 안내 화면
 * - 텍스트 대신 친근한 AI 튜터 아바타의 베트남어 음성 설명 + 3대 시각 픽토그램 안내
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { MOCK_SPEAKING_AUDIO_TUTOR } from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function SpeakingAudioTutorStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const data = MOCK_SPEAKING_AUDIO_TUTOR;
  const [isPlayingTutor, setIsPlayingTutor] = useState(true);

  const handleReplayTutor = () => {
    setIsPlayingTutor(true);
    setTimeout(() => setIsPlayingTutor(false), 2000);
  };

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={50} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 1. 상단 배지 및 타이틀 ── */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {pick(lang, data.badgeKo, data.badgeVi)}
          </Text>
        </View>
        <Text style={styles.title}>
          {pick(lang, data.titleKo, data.titleVi)}
        </Text>

        {/* ── 2. AI 튜터 보이스 카드 (파형 + 말풍선) ── */}
        <View style={styles.tutorCard}>
          <View style={styles.tutorHeader}>
            <View style={styles.tutorAvatarBox}>
              <Text style={styles.tutorAvatarEmoji}>👩‍🏫</Text>
              <View style={styles.onlineDot} />
            </View>

            <View style={styles.tutorInfo}>
              <Text style={styles.tutorName}>AI 튜터 지니 (Genie)</Text>
              <View style={styles.waveformRow}>
                {[12, 24, 18, 28, 14, 22, 10].map((h, i) => (
                  <View
                    key={i}
                    style={[
                      styles.waveBar,
                      { height: isPlayingTutor ? h : 6 },
                      isPlayingTutor && styles.waveBarActive,
                    ]}
                  />
                ))}
                <Text style={styles.waveText}>
                  {isPlayingTutor ? '음성 안내 중...' : '음성 안내 완료'}
                </Text>
              </View>
            </View>

            {/* 다시 듣기 버튼 */}
            <TouchableOpacity
              style={styles.replayBtn}
              onPress={handleReplayTutor}
              activeOpacity={0.8}
            >
              <Text style={styles.replayIcon}>🔄</Text>
              <Text style={styles.replayText}>
                {pick(lang, '다시 듣기', 'Nghe lại')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 튜터 말풍선 */}
          <View style={styles.tutorSpeechBubble}>
            <Text style={styles.speechVi}>{data.tutorSpeechVi}</Text>
            <Text style={styles.speechKo}>{data.tutorSpeechKo}</Text>
          </View>
        </View>

        {/* ── 3. 3대 시각 픽토그램 가이드 ── */}
        <View style={styles.chipsSection}>
          <Text style={styles.chipsSectionTitle}>
            {pick(lang, '이렇게 학습해요!', 'Cách thực hiện!')}
          </Text>

          <View style={styles.chipsRow}>
            {data.guideChips.map((chip) => (
              <View key={chip.id} style={styles.chipCard}>
                <Text style={styles.chipIcon}>{chip.icon}</Text>
                <Text style={styles.chipTitle}>
                  {pick(lang, chip.titleKo, chip.titleVi)}
                </Text>
                <Text style={styles.chipDesc}>
                  {pick(lang, chip.descKo, chip.descVi)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── 하단 CTA ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaBtnText}>
            {pick(lang, '말하기 연습 시작하기  →', 'Bắt đầu luyện nói  →')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 16,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.teal },
  title: { fontSize: 23, fontWeight: '800', color: colors.ink, lineHeight: 30 },

  // AI 튜터 카드
  tutorCard: {
    backgroundColor: '#F0FAFA',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFE8E6',
    gap: 14,
    ...shadow.card,
  },
  tutorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tutorAvatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.teal,
  },
  tutorAvatarEmoji: { fontSize: 26 },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  tutorInfo: { flex: 1, gap: 4 },
  tutorName: { fontSize: 13, fontWeight: '800', color: colors.ink },
  waveformRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  waveBar: {
    width: 3,
    backgroundColor: '#94A3B8',
    borderRadius: 2,
  },
  waveBarActive: { backgroundColor: colors.teal },
  waveText: { fontSize: 11, color: colors.muted, marginLeft: 6 },

  replayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  replayIcon: { fontSize: 12 },
  replayText: { fontSize: 11, fontWeight: '700', color: colors.teal },

  // 튜터 말풍선
  tutorSpeechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    gap: 6,
    borderLeftWidth: 3,
    borderLeftColor: colors.teal,
  },
  speechVi: { fontSize: 14, fontWeight: '700', color: colors.ink, lineHeight: 20 },
  speechKo: { fontSize: 12, color: colors.muted, lineHeight: 17 },

  // 3대 픽토그램 가이드
  chipsSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  chipsSectionTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  chipsRow: { flexDirection: 'row', gap: 8 },
  chipCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  chipIcon: { fontSize: 26, marginVertical: 2 },
  chipTitle: { fontSize: 11, fontWeight: '800', color: colors.ink, textAlign: 'center' },
  chipDesc: { fontSize: 10, color: colors.muted, textAlign: 'center' },

  // 하단 CTA
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  ctaBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
