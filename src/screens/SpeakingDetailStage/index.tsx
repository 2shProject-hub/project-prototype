/**
 * SpeakingDetailStage (말하기 상세 소개 화면)
 * 
 * [목적 및 역할]
 * - 활동 진입 전, 대화의 맥락(상황), 핵심 대화문 롤플레잉, 필수 표현 및 문화 팁, 교체 연습 패턴을 학습자에게 안내하는 화면
 * - 교재: 『ULIS Genie K 한국어 초급 1』 p.7 (말하기 구성 원리) 및 p.24 (말하기 1: 흐엉-민호 대화) 반영
 * 
 * [다른 AI 및 개발자 참고사항]
 * - 데이터 바인딩: MOCK_SPEAKING_EXPLAIN (src/data/lessonData.ts)
 * - 다국어 지원: useLang() 훅 및 pick(lang, ko, vi) 유틸리티 함수 적용
 * - 디자인 토큰: src/theme/colors.ts (colors, shadow)
 * - Source A/B 이식 시: props.data를 통해 외부 CMS/ADMIN API 데이터 주입 가능
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
import {
  MOCK_SPEAKING_EXPLAIN,
  type SpeakingExplainData,
  type DialogueLine,
} from '../../data/lessonData';

interface Props {
  data?: SpeakingExplainData;
  onNext: () => void;
  onBack: () => void;
}

export function SpeakingDetailStage({
  data = MOCK_SPEAKING_EXPLAIN,
  onNext,
  onBack,
}: Props) {
  const { lang } = useLang();
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);

  // 대화 음성 듣기 시뮬레이션 (인터랙션 피드백)
  const handlePlayDialogueLine = (id: number) => {
    setActiveAudioId(id);
    setTimeout(() => {
      setActiveAudioId((current) => (current === id ? null : current));
    }, 1500);
  };

  const handlePlayAll = () => {
    setIsPlayingAll(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < data.dialogue.length) {
        setActiveAudioId(data.dialogue[step].id);
        step += 1;
      } else {
        clearInterval(interval);
        setActiveAudioId(null);
        setIsPlayingAll(false);
      }
    }, 1400);
  };

  return (
    <View style={styles.screen}>
      {/* 상단 액티비티 헤더 */}
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

        {/* ── 2. 상황 맥락 카드 (Context Card) ── */}
        <View style={styles.situationCard}>
          <View style={styles.situationHeader}>
            <Text style={styles.situationIcon}>🤝</Text>
            <Text style={styles.situationTitle}>
              {pick(lang, data.situation.titleKo, data.situation.titleVi)}
            </Text>
          </View>
          <Text style={styles.situationDesc}>
            {pick(lang, data.situation.descKo, data.situation.descVi)}
          </Text>
        </View>

        {/* ── 3. 대화문 롤플레잉 프리뷰 (Dialogue Preview) ── */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWrap}>
            <Text style={styles.sectionIcon}>💬</Text>
            <Text style={styles.sectionTitle}>
              {pick(lang, '대화 미리보기', 'Xem trước hội thoại')}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.playAllBtn, isPlayingAll && styles.playAllBtnActive]}
            onPress={handlePlayAll}
            activeOpacity={0.8}
          >
            <Text style={styles.playAllBtnIcon}>{isPlayingAll ? '⏹' : '▶'}</Text>
            <Text style={styles.playAllBtnText}>
              {isPlayingAll
                ? pick(lang, '재생 중...', 'Đang phát...')
                : pick(lang, '전체 듣기', 'Nghe tất cả')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 말풍선 목록 */}
        <View style={styles.dialogueList}>
          {data.dialogue.map((line: DialogueLine) => {
            const isUser = line.isUserSpeaker;
            const isActive = activeAudioId === line.id;

            return (
              <View
                key={line.id}
                style={[
                  styles.bubbleRow,
                  isUser ? styles.bubbleRowRight : styles.bubbleRowLeft,
                ]}
              >
                {/* 좌측 아바타 (상대방) */}
                {!isUser && (
                  <View style={styles.avatarBox}>
                    <View style={styles.avatarCircle}>
                      <Text style={styles.avatarInitial}>{line.speaker[0]}</Text>
                    </View>
                    <Text style={styles.speakerName}>{line.speaker}</Text>
                  </View>
                )}

                {/* 말풍선 본문 */}
                <TouchableOpacity
                  style={[
                    styles.bubble,
                    isUser ? styles.bubbleRight : styles.bubbleLeft,
                    isActive && styles.bubbleActive,
                  ]}
                  onPress={() => handlePlayDialogueLine(line.id)}
                  activeOpacity={0.85}
                >
                  <View style={styles.bubbleTextWrap}>
                    <Text
                      style={[
                        styles.bubbleKo,
                        isUser && styles.bubbleKoUser,
                        isActive && styles.bubbleKoActive,
                      ]}
                    >
                      {line.textKo}
                    </Text>
                    <Text style={styles.bubbleVi}>{line.textVi}</Text>
                  </View>

                  <View
                    style={[
                      styles.bubbleAudioBtn,
                      isActive && styles.bubbleAudioBtnActive,
                    ]}
                  >
                    <Text style={styles.bubbleAudioIcon}>
                      {isActive ? '🔊' : '🔈'}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* 우측 아바타 (본인/사용자) */}
                {isUser && (
                  <View style={styles.avatarBox}>
                    <View style={[styles.avatarCircle, styles.avatarCircleUser]}>
                      <Text style={styles.avatarInitialUser}>{line.speaker[0]}</Text>
                    </View>
                    <Text style={styles.speakerName}>{line.speaker}</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── 4. 핵심 표현 & 문화 팁 (Key Tips) ── */}
        <View style={styles.tipsSection}>
          <View style={styles.tipsSectionHeader}>
            <Text style={styles.tipsSectionIcon}>💡</Text>
            <Text style={styles.tipsSectionTitle}>
              {pick(lang, '핵심 표현 및 팁', 'Biểu hiện & Mẹo quan trọng')}
            </Text>
          </View>

          <View style={styles.tipsGrid}>
            {data.keyTips.map((tip, idx) => (
              <View key={idx} style={styles.tipCard}>
                <View style={styles.tipCardTop}>
                  <Text style={styles.tipTitleKo}>
                    {pick(lang, tip.titleKo, tip.titleVi)}
                  </Text>
                  <Text style={styles.tipTitleVi}>{tip.titleVi}</Text>
                </View>
                <Text style={styles.tipDesc}>
                  {pick(lang, tip.descKo, tip.descVi)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── 5. 교체 연습 미리보기 (Substitution Drill Guide) ── */}
        <View style={styles.drillSection}>
          <View style={styles.drillHeader}>
            <Text style={styles.drillHeaderIcon}>🔄</Text>
            <View style={styles.drillHeaderTextWrap}>
              <Text style={styles.drillTitle}>
                {pick(lang, '바꿔서 말하기 연습', 'Luyện nói thay thế')}
              </Text>
              <Text style={styles.drillSubtitle}>
                {pick(
                  lang,
                  data.drill.instructionKo,
                  data.drill.instructionVi
                )}
              </Text>
            </View>
          </View>

          <View style={styles.drillCardsRow}>
            {data.drill.items.map((item) => (
              <View key={item.no} style={styles.drillCard}>
                <View style={styles.drillCardBadge}>
                  <Text style={styles.drillCardBadgeText}>연습 {item.no}</Text>
                </View>
                <Text style={styles.drillFlag}>{item.flagEmoji}</Text>
                <Text style={styles.drillName}>{item.name}</Text>
                <View style={styles.drillCountryPill}>
                  <Text style={styles.drillCountryText}>{item.country}</Text>
                </View>
              </View>
            ))}
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
            {pick(lang, '말하기 연습 시작하기  →', 'Bắt đầu luyện nói  →')}
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
    gap: 18,
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

  // ── 2. 상황 맥락 카드 ──
  situationCard: {
    backgroundColor: colors.canvas,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 8,
  },
  situationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  situationIcon: {
    fontSize: 20,
  },
  situationTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
  },
  situationDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },

  // ── 3. 대화문 롤플레잉 섹션 ──
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sectionTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionIcon: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.ink,
  },
  playAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.tealSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  playAllBtnActive: {
    backgroundColor: '#C8EAE8',
  },
  playAllBtnIcon: {
    fontSize: 11,
    color: colors.teal,
  },
  playAllBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.teal,
  },

  // 말풍선 리스트
  dialogueList: {
    gap: 14,
  },
  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bubbleRowLeft: {
    justifyContent: 'flex-start',
    paddingRight: 28,
  },
  bubbleRowRight: {
    justifyContent: 'flex-end',
    paddingLeft: 28,
  },
  avatarBox: {
    alignItems: 'center',
    gap: 4,
    width: 44,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  avatarCircleUser: {
    backgroundColor: colors.tealSoft,
    borderColor: colors.teal,
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
  },
  avatarInitialUser: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.teal,
  },
  speakerName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.muted,
  },

  // 말풍선 본문
  bubble: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    ...shadow.card,
  },
  bubbleLeft: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.line,
    borderBottomLeftRadius: 4,
  },
  bubbleRight: {
    backgroundColor: colors.tealSoft,
    borderWidth: 1,
    borderColor: '#B2EBE8',
    borderBottomRightRadius: 4,
  },
  bubbleActive: {
    borderColor: colors.teal,
    borderWidth: 1.5,
  },
  bubbleTextWrap: {
    flex: 1,
    gap: 4,
  },
  bubbleKo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.ink,
    lineHeight: 20,
  },
  bubbleKoUser: {
    color: '#005E5D',
  },
  bubbleKoActive: {
    color: colors.teal,
  },
  bubbleVi: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
  },
  bubbleAudioBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  bubbleAudioBtnActive: {
    backgroundColor: 'rgba(0, 168, 166, 0.15)',
  },
  bubbleAudioIcon: {
    fontSize: 14,
  },

  // ── 4. 핵심 표현 & 팁 섹션 ──
  tipsSection: {
    backgroundColor: '#FAFCFD',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tipsSectionIcon: {
    fontSize: 18,
  },
  tipsSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  tipsGrid: {
    gap: 10,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 6,
  },
  tipCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  tipTitleKo: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.teal,
  },
  tipTitleVi: {
    fontSize: 11,
    color: colors.muted,
  },
  tipDesc: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },

  // ── 5. 교체 연습 섹션 ──
  drillSection: {
    backgroundColor: colors.tealSoft,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  drillHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  drillHeaderIcon: {
    fontSize: 20,
    marginTop: 2,
  },
  drillHeaderTextWrap: {
    flex: 1,
    gap: 2,
  },
  drillTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  drillSubtitle: {
    fontSize: 12,
    color: '#3D5554',
  },
  drillCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  drillCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    ...shadow.card,
  },
  drillCardBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  drillCardBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
  },
  drillFlag: {
    fontSize: 32,
    marginVertical: 2,
  },
  drillName: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.ink,
  },
  drillCountryPill: {
    backgroundColor: colors.tealSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  drillCountryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.teal,
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
