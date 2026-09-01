/**
 * ReadWriteDetailStage (읽고 쓰기 상세 소개 화면)
 * 
 * [목적 및 역할]
 * - 활동 진입 전, 읽기 전 유추 스키마 활성화, 읽기 체크 포인트 안내, 읽기 후 작문 4단계 프레임워크를 제공하는 화면
 * - 교재: 『ULIS Genie K 한국어 초급 1』 p.8 (읽고 쓰기 구성 원리) 및 p.31 (1단원 읽고 쓰기 본문 & 작문) 반영
 * 
 * [다른 AI 및 개발자 참고사항]
 * - 데이터 바인딩: MOCK_READ_WRITE_EXPLAIN (src/data/lessonData.ts)
 * - 다국어 지원: useLang() 훅 및 pick(lang, ko, vi) 유틸리티 함수 적용
 * - 디자인 토큰: src/theme/colors.ts (colors, shadow)
 * - Source A/B 이식 시: props.data를 통해 외부 CMS/ADMIN API 데이터 주입 가능
 */

import { ThemedGlyph } from '../../components/ThemedGlyph';
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
import {
  MOCK_READ_WRITE_EXPLAIN,
  type ReadWriteExplainData,
  type WritingFrameStep,
} from '../../data/lessonData';

interface Props {
  data?: ReadWriteExplainData;
  onNext: () => void;
  onBack: () => void;
}

export function ReadWriteDetailStage({
  data = MOCK_READ_WRITE_EXPLAIN,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const [selectedStep, setSelectedStep] = useState<number>(1);

  return (
    <View style={styles.screen}>
      {/* 상단 액티비티 헤더 */}
      <ActivityHeader percentage={65} onClose={onBack} />

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

        {/* ── 2. 읽기 전 유추 카드 (Pre-reading Schema) ── */}
        <View style={styles.preReadingCard}>
          <View style={styles.preReadingHeader}>
            <Text style={styles.preReadingIcon}>🔍</Text>
            <Text style={styles.preReadingTitle}>
              {pick(lang, data.preReading.titleKo, data.preReading.titleVi)}
            </Text>
          </View>
          <Text style={styles.preReadingDesc}>
            {pick(lang, data.preReading.descKo, data.preReading.descVi)}
          </Text>

          {/* 인물 프로필 박스 */}
          <View style={styles.characterBox}>
            <View style={styles.characterAvatar}>
              <Text style={styles.characterEmoji}>👩‍🏫</Text>
            </View>
            <View style={styles.characterInfo}>
              <View style={styles.characterNameRow}>
                <Text style={styles.characterName}>
                  {data.preReading.characterName}
                </Text>
                <View style={styles.characterRoleBadge}>
                  <Text style={styles.characterRoleText}>
                    {pick(
                      lang,
                      data.preReading.characterRole,
                      data.preReading.characterRoleVi
                    )}
                  </Text>
                </View>
              </View>
              <Text style={styles.characterSub}>
                {pick(lang, '본문의 주인공이에요', 'Nhân vật chính của bài đọc')}
              </Text>
            </View>
          </View>

          {/* 생각 열기 질문 칩 목록 */}
          <View style={styles.clueChipsList}>
            {data.preReading.clueQuestions.map((q, idx) => (
              <View key={idx} style={styles.clueChip}>
                <Text style={styles.clueChipIcon}>💭</Text>
                <View style={styles.clueChipTextWrap}>
                  <Text style={styles.clueChipTextKo}>{q}</Text>
                  <Text style={styles.clueChipTextVi}>
                    {data.preReading.clueQuestionsVi[idx]}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── 3. 읽기 체크 포인트 (Reading Key Points) ── */}
        <View style={styles.readingPointsSection}>
          <View style={styles.sectionHeaderRow}>
            <ThemedGlyph style={styles.sectionIcon} glyph="📖" />
            <Text style={styles.sectionTitle}>
              {pick(lang, '읽기 핵심 체크 포인트', 'Điểm kiểm tra khi đọc')}
            </Text>
          </View>
          <Text style={styles.sectionSubtitle}>
            {pick(
              lang,
              '글을 읽으며 아래 3가지 정보를 찾아보세요.',
              'Hãy tìm 3 thông tin dưới đây khi đọc bài.'
            )}
          </Text>

          <View style={styles.pointsGrid}>
            {data.readingPoints.map((point) => (
              <View key={point.no} style={styles.pointCard}>
                <View style={styles.pointNoBadge}>
                  <Text style={styles.pointNoText}>{point.no}</Text>
                </View>
                <View style={styles.pointContent}>
                  <Text style={styles.pointLabel}>
                    {pick(lang, point.labelKo, point.labelVi)}
                  </Text>
                  <Text style={styles.pointQuestion}>
                    {pick(lang, point.questionKo, point.questionVi)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── 4. 글쓰기 4단계 프레임워크 (Writing Framework) ── */}
        <View style={styles.frameworkSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionIcon}>✏️</Text>
            <Text style={styles.frameworkTitle}>
              {pick(
                lang,
                data.writingFramework.titleKo,
                data.writingFramework.titleVi
              )}
            </Text>
          </View>
          <Text style={styles.frameworkDesc}>
            {pick(
              lang,
              data.writingFramework.descKo,
              data.writingFramework.descVi
            )}
          </Text>

          {/* 4단계 스텝 목록 */}
          <View style={styles.stepsList}>
            {data.writingFramework.steps.map((item: WritingFrameStep) => {
              const isSelected = selectedStep === item.step;

              return (
                <TouchableOpacity
                  key={item.step}
                  style={[
                    styles.stepCard,
                    isSelected && styles.stepCardSelected,
                  ]}
                  onPress={() => setSelectedStep(item.step)}
                  activeOpacity={0.85}
                >
                  {/* 스텝 헤더 */}
                  <View style={styles.stepTopRow}>
                    <View
                      style={[
                        styles.stepBadge,
                        isSelected && styles.stepBadgeSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.stepBadgeText,
                          isSelected && styles.stepBadgeTextSelected,
                        ]}
                      >
                        Step {item.step}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.stepTitle,
                        isSelected && styles.stepTitleSelected,
                      ]}
                    >
                      {pick(lang, item.titleKo, item.titleVi)}
                    </Text>
                  </View>

                  {/* 예시 문장 박스 */}
                  <View
                    style={[
                      styles.exampleBox,
                      isSelected && styles.exampleBoxSelected,
                    ]}
                  >
                    <Text style={styles.exampleKo}>{item.exampleKo}</Text>
                    <Text style={styles.exampleVi}>{item.exampleVi}</Text>
                  </View>

                  {/* 슬롯 가이드 */}
                  <View style={styles.guideRow}>
                    <ThemedGlyph style={styles.guideIcon} glyph="💡" />
                    <Text style={styles.guideText}>
                      {pick(lang, item.slotGuideKo, item.slotGuideVi)}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 28 }} />
      </ScrollView>

      {/* ── 하단 액션 버튼 (CTA) ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextBtn}
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextBtnText}>
            {pick(lang, '읽고 쓰기 시작하기  →', 'Bắt đầu đọc và viết  →')}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 20,
  },

  // ── 1. 배지 및 타이틀 ──
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.teal,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 31,
  },

  // ── 2. 읽기 전 유추 카드 ──
  preReadingCard: {
    backgroundColor: '#F0FAFA',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFE8E6',
    gap: 12,
    ...shadow.card,
  },
  preReadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  preReadingIcon: {
    fontSize: 20,
  },
  preReadingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  preReadingDesc: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },

  // 캐릭터 프로필 박스
  characterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D2ECEB',
  },
  characterAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  characterEmoji: {
    fontSize: 24,
  },
  characterInfo: {
    flex: 1,
    gap: 3,
  },
  characterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  characterName: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  characterRoleBadge: {
    backgroundColor: colors.tealSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  characterRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.teal,
  },
  characterSub: {
    fontSize: 11,
    color: colors.muted,
  },

  // 생각 칩 목록
  clueChipsList: {
    gap: 8,
  },
  clueChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clueChipIcon: {
    fontSize: 15,
    marginTop: 1,
  },
  clueChipTextWrap: {
    flex: 1,
    gap: 2,
  },
  clueChipTextKo: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.ink,
  },
  clueChipTextVi: {
    fontSize: 11,
    color: colors.muted,
  },

  // ── 3. 읽기 포인트 섹션 ──
  readingPointsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.muted,
    marginTop: -6,
  },
  pointsGrid: {
    gap: 8,
  },
  pointCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.canvas,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pointNoBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointNoText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pointContent: {
    flex: 1,
    gap: 2,
  },
  pointLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
  pointQuestion: {
    fontSize: 12,
    color: '#475569',
  },

  // ── 4. 글쓰기 프레임워크 섹션 ──
  frameworkSection: {
    backgroundColor: '#FAFCFD',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  frameworkTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  frameworkDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginTop: -6,
  },
  stepsList: {
    gap: 12,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
    ...shadow.card,
  },
  stepCardSelected: {
    borderColor: colors.teal,
    borderWidth: 1.5,
    backgroundColor: '#FFFFFF',
  },
  stepTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stepBadgeSelected: {
    backgroundColor: colors.tealSoft,
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
  },
  stepBadgeTextSelected: {
    color: colors.teal,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  stepTitleSelected: {
    color: colors.teal,
    fontWeight: '800',
  },
  exampleBox: {
    backgroundColor: colors.canvas,
    borderRadius: 10,
    padding: 10,
    gap: 4,
    borderLeftWidth: 3,
    borderLeftColor: colors.line,
  },
  exampleBoxSelected: {
    backgroundColor: '#F0FAFA',
    borderLeftColor: colors.teal,
  },
  exampleKo: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 19,
  },
  exampleVi: {
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  guideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guideIcon: {
    fontSize: 13,
  },
  guideText: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
  },

  // ── 하단 액션 버튼 (CTA) ──
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  nextBtn: {
    backgroundColor: colors.teal,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
