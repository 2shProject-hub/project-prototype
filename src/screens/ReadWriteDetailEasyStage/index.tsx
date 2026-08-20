/**
 * ReadWriteDetailEasyStage (16-1. 읽고 쓰기 상세 소개 - 초급 맞춤형)
 * 
 * [목적 및 특징]
 * - 초급 1 학습자가 직관적으로 '읽기'와 '쓰기'의 연계 구조를 파악할 수 있도록 구성
 * - 세나의 3줄 소개 카드(읽기)와 나만의 프로필 카드(쓰기) 2단계 시각화
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
import { MOCK_READ_WRITE_EASY } from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function ReadWriteDetailEasyStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const data = MOCK_READ_WRITE_EASY;
  const [activeTab, setActiveTab] = useState<'read' | 'write'>('read');

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={65} onClose={onBack} />

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

        {/* ── 2단계 전환 탭 (읽기 ↔ 쓰기) ── */}
        <View style={styles.stepToggle}>
          <TouchableOpacity
            style={[
              styles.stepToggleBtn,
              activeTab === 'read' && styles.stepToggleBtnActive,
            ]}
            onPress={() => setActiveTab('read')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.stepToggleText,
                activeTab === 'read' && styles.stepToggleTextActive,
              ]}
            >
              📖 1. 따라 읽기 (Đọc)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.stepToggleBtn,
              activeTab === 'write' && styles.stepToggleBtnActive,
            ]}
            onPress={() => setActiveTab('write')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.stepToggleText,
                activeTab === 'write' && styles.stepToggleTextActive,
              ]}
            >
              ✏️ 2. 직접 쓰기 (Viết)
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── 1. 읽기 모드 카드 ── */}
        {activeTab === 'read' && (
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardAvatar}>{data.readingCard.avatar}</Text>
              <View style={styles.cardHeaderTextWrap}>
                <Text style={styles.cardTitle}>
                  {pick(
                    lang,
                    data.readingCard.titleKo,
                    data.readingCard.titleVi
                  )}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {pick(
                    lang,
                    '소리 내어 따라 읽어 보세요!',
                    'Hãy đọc to theo bài nhé!'
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.linesList}>
              {data.readingCard.lines.map((line, idx) => (
                <View key={idx} style={styles.lineItem}>
                  <View style={styles.lineBullet}>
                    <Text style={styles.bulletText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.lineTextWrap}>
                    <Text style={styles.lineKo}>{line.ko}</Text>
                    <Text style={styles.lineVi}>{line.vi}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── 2. 쓰기 모드 카드 ── */}
        {activeTab === 'write' && (
          <View style={styles.mainCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardAvatar}>📝</Text>
              <View style={styles.cardHeaderTextWrap}>
                <Text style={styles.cardTitle}>
                  {pick(
                    lang,
                    data.writingCard.titleKo,
                    data.writingCard.titleVi
                  )}
                </Text>
                <Text style={styles.cardSubtitle}>
                  {pick(
                    lang,
                    '나의 정보를 넣어 카드를 완성해요!',
                    'Điền thông tin của bạn vào thẻ nhé!'
                  )}
                </Text>
              </View>
            </View>

            <View style={styles.slotsList}>
              {data.writingCard.slots.map((slot, idx) => (
                <View key={idx} style={styles.slotCard}>
                  <View style={styles.slotLabelBadge}>
                    <Text style={styles.slotLabelText}>
                      {pick(lang, slot.labelKo, slot.labelVi)}
                    </Text>
                  </View>
                  <Text style={styles.slotPlaceholder}>
                    {slot.placeholderKo}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 하단 친절 팁 박스 */}
        <View style={styles.hintBox}>
          <Text style={styles.hintIcon}>💡</Text>
          <Text style={styles.hintText}>
            {pick(
              lang,
              '세나의 글을 보고 내 이름과 나라를 써 봐요!',
              'Dựa vào bài của Sena, hãy viết tên và quốc gia của bạn nhé!'
            )}
          </Text>
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
            {pick(lang, '읽고 쓰기 시작하기  →', 'Bắt đầu đọc và viết  →')}
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

  // 2단계 토글
  stepToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  stepToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  stepToggleBtnActive: {
    backgroundColor: '#FFFFFF',
    ...shadow.card,
  },
  stepToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.muted,
  },
  stepToggleTextActive: {
    color: colors.teal,
    fontWeight: '800',
  },

  // 메인 카드
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#BFE8E6',
    gap: 14,
    ...shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  cardAvatar: { fontSize: 32 },
  cardHeaderTextWrap: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  cardSubtitle: { fontSize: 12, color: colors.muted },

  // 읽기 라인
  linesList: { gap: 10 },
  lineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  lineBullet: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  bulletText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  lineTextWrap: { flex: 1, gap: 2 },
  lineKo: { fontSize: 15, fontWeight: '700', color: colors.ink },
  lineVi: { fontSize: 11, color: colors.muted },

  // 쓰기 슬롯
  slotsList: { gap: 10 },
  slotCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  slotLabelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  slotLabelText: { fontSize: 11, fontWeight: '700', color: colors.teal },
  slotPlaceholder: { fontSize: 14, fontWeight: '700', color: colors.ink },

  // 힌트 박스
  hintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  hintIcon: { fontSize: 16 },
  hintText: { fontSize: 12, fontWeight: '700', color: '#92400E', flex: 1 },

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
