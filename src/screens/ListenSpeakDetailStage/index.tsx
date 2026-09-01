/**
 * ListenSpeakDetailStage (듣고 말하기 상세 소개 화면)
 * 
 * [목적 및 역할]
 * - 활동 진입 전, 대화 상황 및 인물 관계 파악, 청취 집중 미션 안내, 듣기 후 말하기 발화 미션을 예고하는 화면
 * - 교재: 『ULIS Genie K 한국어 초급 1』 p.9 (듣고 말하기 구성 원리) 및 p.32 (1단원 듣고 말하기 본문 & 질문-답변) 반영
 * 
 * [다른 AI 및 개발자 참고사항]
 * - 데이터 바인딩: MOCK_LISTEN_SPEAK_EXPLAIN (src/data/lessonData.ts)
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
  MOCK_LISTEN_SPEAK_EXPLAIN,
  type ListenSpeakExplainData,
  type SpeakingQuestionPreview,
} from '../../data/lessonData';

interface Props {
  data?: ListenSpeakExplainData;
  onNext: () => void;
  onBack: () => void;
}

export function ListenSpeakDetailStage({
  data = MOCK_LISTEN_SPEAK_EXPLAIN,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(1);

  return (
    <View style={styles.screen}>
      {/* 상단 액티비티 헤더 */}
      <ActivityHeader percentage={80} onClose={onBack} />

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

        {/* ── 2. 대화 상황 & 등장인물 카드 (Context & Characters) ── */}
        <View style={styles.contextCard}>
          <View style={styles.contextHeader}>
            <ThemedGlyph style={styles.contextIcon} glyph="🎧" />
            <Text style={styles.contextTitle}>
              {pick(lang, data.situation.titleKo, data.situation.titleVi)}
            </Text>
          </View>
          <Text style={styles.contextDesc}>
            {pick(lang, data.situation.descKo, data.situation.descVi)}
          </Text>

          {/* 등장인물 카드 목록 */}
          <View style={styles.charactersRow}>
            {data.situation.characters.map((char, idx) => (
              <View key={idx} style={styles.characterCard}>
                <View style={styles.charAvatar}>
                  <Text style={styles.charAvatarEmoji}>{char.avatarEmoji}</Text>
                </View>
                <Text style={styles.charName}>{char.name}</Text>
                <View style={styles.charRoleBadge}>
                  <Text style={styles.charRoleText}>
                    {pick(lang, char.roleKo, char.roleVi)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── 3. 청취 집중 미션 (Listening Mission) ── */}
        <View style={styles.missionSection}>
          <View style={styles.missionHeaderRow}>
            <View style={styles.sectionTitleWrap}>
              <Text style={styles.sectionIcon}>🎯</Text>
              <Text style={styles.sectionTitle}>
                {pick(
                  lang,
                  data.listeningMission.titleKo,
                  data.listeningMission.titleVi
                )}
              </Text>
            </View>

            {/* 오디오 트랙 뱃지 */}
            <View style={styles.trackBadge}>
              <Text style={styles.trackBadgeText}>
                {data.audioTrack.trackName}
              </Text>
            </View>
          </View>

          <Text style={styles.trackDurationText}>
            {pick(
              lang,
              data.audioTrack.durationDescKo,
              data.audioTrack.durationDescVi
            )}
          </Text>

          <View style={styles.pointsList}>
            {data.listeningMission.points.map((p) => (
              <View key={p.no} style={styles.pointRow}>
                <View style={styles.pointIconBox}>
                  <ThemedGlyph style={styles.pointIcon} glyph={p.icon} />
                </View>
                <View style={styles.pointTextWrap}>
                  <Text style={styles.pointTitle}>
                    {pick(lang, p.titleKo, p.titleVi)}
                  </Text>
                  <Text style={styles.pointDesc}>
                    {pick(lang, p.descKo, p.descVi)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── 4. 말하기 발화 미션 예고 (Speaking Mission Preview) ── */}
        <View style={styles.speakingSection}>
          <View style={styles.sectionHeaderRow}>
            <ThemedGlyph style={styles.sectionIcon} glyph="🎙️" />
            <Text style={styles.speakingSectionTitle}>
              {pick(
                lang,
                data.speakingPreview.titleKo,
                data.speakingPreview.titleVi
              )}
            </Text>
          </View>
          <Text style={styles.speakingDesc}>
            {pick(
              lang,
              data.speakingPreview.descKo,
              data.speakingPreview.descVi
            )}
          </Text>

          {/* 3대 질문 카드 목록 */}
          <View style={styles.questionsList}>
            {data.speakingPreview.questions.map(
              (q: SpeakingQuestionPreview) => {
                const isActive = activeQuestionId === q.no;

                return (
                  <TouchableOpacity
                    key={q.no}
                    style={[
                      styles.questionCard,
                      isActive && styles.questionCardActive,
                    ]}
                    onPress={() => setActiveQuestionId(q.no)}
                    activeOpacity={0.85}
                  >
                    {/* 질문 영역 */}
                    <View style={styles.questionHeader}>
                      <View
                        style={[
                          styles.questionNoBadge,
                          isActive && styles.questionNoBadgeActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.questionNoText,
                            isActive && styles.questionNoTextActive,
                          ]}
                        >
                          Q{q.no}
                        </Text>
                      </View>
                      <View style={styles.questionTextWrap}>
                        <Text style={styles.questionKo}>{q.questionKo}</Text>
                        <Text style={styles.questionVi}>{q.questionVi}</Text>
                      </View>
                    </View>

                    {/* 예시 답변 박스 */}
                    <View
                      style={[
                        styles.answerBox,
                        isActive && styles.answerBoxActive,
                      ]}
                    >
                      <View style={styles.answerLabelRow}>
                        <Text style={styles.answerLabel}>
                          {pick(lang, '💬 대답 예시', '💬 Mẫu câu trả lời')}
                        </Text>
                      </View>
                      <Text style={styles.answerKo}>{q.sampleAnswerKo}</Text>
                      <Text style={styles.answerVi}>{q.sampleAnswerVi}</Text>
                    </View>
                  </TouchableOpacity>
                );
              }
            )}
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
            {pick(lang, '듣고 말하기 시작하기  →', 'Bắt đầu nghe và nói  →')}
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

  // ── 2. 대화 상황 & 등장인물 카드 ──
  contextCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
    ...shadow.card,
  },
  contextHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contextIcon: {
    fontSize: 20,
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  contextDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  charactersRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  characterCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.line,
  },
  charAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.tealSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  charAvatarEmoji: {
    fontSize: 26,
  },
  charName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  charRoleBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  charRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.teal,
  },

  // ── 3. 청취 집중 미션 ──
  missionSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
  },
  missionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleWrap: {
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
  trackBadge: {
    backgroundColor: colors.teal,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trackBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trackDurationText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: -4,
  },
  pointsList: {
    gap: 10,
    marginTop: 4,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.canvas,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pointIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pointIcon: {
    fontSize: 18,
  },
  pointTextWrap: {
    flex: 1,
    gap: 2,
  },
  pointTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.ink,
  },
  pointDesc: {
    fontSize: 12,
    color: '#475569',
  },

  // ── 4. 말하기 발화 미션 섹션 ──
  speakingSection: {
    backgroundColor: '#FAFCFD',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  speakingSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  speakingDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginTop: -6,
  },
  questionsList: {
    gap: 12,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 10,
    ...shadow.card,
  },
  questionCardActive: {
    borderColor: colors.teal,
    borderWidth: 1.5,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  questionNoBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  questionNoBadgeActive: {
    backgroundColor: colors.tealSoft,
  },
  questionNoText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.muted,
  },
  questionNoTextActive: {
    color: colors.teal,
  },
  questionTextWrap: {
    flex: 1,
    gap: 2,
  },
  questionKo: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  questionVi: {
    fontSize: 11,
    color: colors.muted,
  },
  answerBox: {
    backgroundColor: colors.canvas,
    borderRadius: 10,
    padding: 10,
    gap: 3,
    borderLeftWidth: 3,
    borderLeftColor: colors.line,
  },
  answerBoxActive: {
    backgroundColor: '#F0FAFA',
    borderLeftColor: colors.teal,
  },
  answerLabelRow: {
    marginBottom: 2,
  },
  answerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.teal,
  },
  answerKo: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 19,
  },
  answerVi: {
    fontSize: 11,
    color: colors.muted,
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
