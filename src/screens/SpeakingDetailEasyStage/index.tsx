/**
 * SpeakingDetailEasyStage (15-1. 말하기 상세 소개 - 초급 맞춤형)
 * 
 * [목적 및 특징]
 * - 초급 1 학습자의 눈높이에 맞추어 텍스트 분량을 최소화하고 직관적인 시각 요소 중심으로 구성
 * - 큼직한 2턴 롤플레잉 말풍선 + 국기/인물 교체 카드 중심의 초간결 UI
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
import { MOCK_SPEAKING_EASY } from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function SpeakingDetailEasyStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const data = MOCK_SPEAKING_EASY;
  const [activeDrillId, setActiveDrillId] = useState<number>(1);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const handlePlayAudio = (id: number) => {
    setPlayingId(id);
    setTimeout(() => setPlayingId(null), 1200);
  };

  const selectedDrill =
    data.substitutionDrill.items.find((item) => item.id === activeDrillId) ??
    data.substitutionDrill.items[0];

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={50} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 배지 & 타이틀 */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {pick(lang, data.badgeKo, data.badgeVi)}
          </Text>
        </View>
        <Text style={styles.title}>
          {pick(lang, data.titleKo, data.titleVi)}
        </Text>

        {/* ── 1. 핵심 대화 롤플레잉 카드 (대형 말풍선) ── */}
        <View style={styles.dialogueBox}>
          {data.dialoguePairs.map((pair) => {
            const isPlaying = playingId === pair.id;

            return (
              <View
                key={pair.id}
                style={[
                  styles.chatRow,
                  pair.isLeft ? styles.chatRowLeft : styles.chatRowRight,
                ]}
              >
                {/* 좌측 아바타 */}
                {pair.isLeft && (
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarEmoji}>{pair.avatar}</Text>
                    <Text style={styles.speakerName}>{pair.speaker}</Text>
                  </View>
                )}

                {/* 말풍선 */}
                <TouchableOpacity
                  style={[
                    styles.chatBubble,
                    pair.isLeft ? styles.chatBubbleLeft : styles.chatBubbleRight,
                    isPlaying && styles.chatBubblePlaying,
                  ]}
                  onPress={() => handlePlayAudio(pair.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.bubbleContent}>
                    <Text
                      style={[
                        styles.bubbleKo,
                        !pair.isLeft && styles.bubbleKoRight,
                        isPlaying && styles.bubbleKoPlaying,
                      ]}
                    >
                      {pair.textKo}
                    </Text>
                    <Text style={styles.bubbleVi}>{pair.textVi}</Text>
                  </View>
                  <Text style={styles.speakerIcon}>
                    {isPlaying ? '🔊' : '🔈'}
                  </Text>
                </TouchableOpacity>

                {/* 우측 아바타 */}
                {!pair.isLeft && (
                  <View style={styles.avatarWrap}>
                    <Text style={styles.avatarEmoji}>{pair.avatar}</Text>
                    <Text style={styles.speakerName}>{pair.speaker}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── 2. 원포인트 핵심 표현 배너 ── */}
        <View style={styles.keyPointBanner}>
          <Text style={styles.keyPointIcon}>💡</Text>
          <Text style={styles.keyPointText}>{data.keyPointKo}</Text>
        </View>

        {/* ── 3. 단어만 쏙! 바꿔서 말하기 ── */}
        <View style={styles.drillSection}>
          <Text style={styles.drillGuide}>
            {pick(
              lang,
              data.substitutionDrill.guideKo,
              data.substitutionDrill.guideVi
            )}
          </Text>

          {/* 국기/인물 선택 탭 카드 */}
          <View style={styles.drillTabsRow}>
            {data.substitutionDrill.items.map((item) => {
              const isSelected = activeDrillId === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.drillTab,
                    isSelected && styles.drillTabSelected,
                  ]}
                  onPress={() => setActiveDrillId(item.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.tabFlag}>{item.flag}</Text>
                  <Text
                    style={[
                      styles.tabName,
                      isSelected && styles.tabNameSelected,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 선택된 교체 문장 프리뷰 */}
          <View style={styles.drillPreviewCard}>
            <View style={styles.drillResultRow}>
              <Text style={styles.drillFlagLarge}>{selectedDrill.flag}</Text>
              <View style={styles.drillResultTextWrap}>
                <Text style={styles.drillResultKo}>
                  저는 <Text style={styles.drillHighlight}>{selectedDrill.country} 사람</Text>이에요.
                </Text>
                <Text style={styles.drillResultVi}>
                  Tôi là người {selectedDrill.country}.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* 하단 CTA */}
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
  badgeText: { fontSize: 13, fontWeight: '700', color: colors.teal },
  title: { fontSize: 24, fontWeight: '800', color: colors.ink },

  // ── 1. 핵심 대화 카드 ──
  dialogueBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
    ...shadow.card,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  chatRowLeft: { justifyContent: 'flex-start' },
  chatRowRight: { justifyContent: 'flex-end' },
  avatarWrap: { alignItems: 'center', width: 44 },
  avatarEmoji: { fontSize: 28 },
  speakerName: { fontSize: 11, fontWeight: '700', color: colors.muted, marginTop: 2 },
  chatBubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
  },
  chatBubbleLeft: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.line,
  },
  chatBubbleRight: {
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: '#B2EBE8',
  },
  chatBubblePlaying: {
    borderColor: colors.teal,
    borderWidth: 1.5,
  },
  bubbleContent: { flex: 1, gap: 3 },
  bubbleKo: { fontSize: 15, fontWeight: '700', color: colors.ink, lineHeight: 21 },
  bubbleKoRight: { color: '#005E5D' },
  bubbleKoPlaying: { color: colors.teal },
  bubbleVi: { fontSize: 11, color: colors.muted },
  speakerIcon: { fontSize: 18, marginLeft: 8 },

  // ── 2. 원포인트 핵심 표현 배너 ──
  keyPointBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  keyPointIcon: { fontSize: 16 },
  keyPointText: { fontSize: 12, fontWeight: '700', color: '#92400E', flex: 1 },

  // ── 3. 단어만 쏙 바꿔서 말하기 ──
  drillSection: {
    backgroundColor: '#FAFCFD',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  drillGuide: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  drillTabsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  drillTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  drillTabSelected: {
    borderColor: colors.teal,
    backgroundColor: colors.tealSoft,
  },
  tabFlag: { fontSize: 20 },
  tabName: { fontSize: 14, fontWeight: '700', color: colors.ink },
  tabNameSelected: { color: colors.teal, fontWeight: '800' },

  drillPreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFE8E6',
    ...shadow.card,
  },
  drillResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  drillFlagLarge: { fontSize: 32 },
  drillResultTextWrap: { flex: 1, gap: 2 },
  drillResultKo: { fontSize: 15, fontWeight: '700', color: colors.ink },
  drillHighlight: { color: colors.teal, fontWeight: '800' },
  drillResultVi: { fontSize: 12, color: colors.muted },

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
