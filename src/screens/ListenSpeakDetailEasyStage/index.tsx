/**
 * ListenSpeakDetailEasyStage (17-1. 듣고 말하기 상세 소개 - 초급 맞춤형)
 * 
 * [목적 및 특징]
 * - 초급 1 학습자가 '잘 듣고(1단계)' -> '따라 말하는(2단계)' 과정을 한눈에 이해할 수 있도록 구성
 * - 귀여운 캐릭터 국기 뱃지 + 대형 마이크 발화 가이드 카드 중심의 직관적 UI
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
import { MOCK_LISTEN_SPEAK_EASY } from '../../data/lessonData';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function ListenSpeakDetailEasyStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const data = MOCK_LISTEN_SPEAK_EASY;
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 1500);
  };

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={80} onClose={onBack} />

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

        {/* ── 1. 잘 듣기 카드 (Listening Step) ── */}
        <View style={styles.stepCard}>
          <View style={styles.stepCardHeader}>
            <Text style={styles.stepTitle}>
              {pick(
                lang,
                data.step1Listening.titleKo,
                data.step1Listening.titleVi
              )}
            </Text>
            <TouchableOpacity
              style={[
                styles.audioPlayBtn,
                isPlayingAudio && styles.audioPlayBtnPlaying,
              ]}
              onPress={handlePlayAudio}
              activeOpacity={0.8}
            >
              <ThemedGlyph style={styles.audioPlayIcon} glyph={isPlayingAudio ? '🔊' : '▶'} />
              <Text style={styles.audioPlayText}>
                {isPlayingAudio
                  ? pick(lang, '듣는 중...', 'Đang nghe...')
                  : pick(lang, '미리듣기', 'Nghe thử')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* 인물 캐릭터 카드 2명 */}
          <View style={styles.charsRow}>
            {data.step1Listening.characters.map((char, idx) => (
              <View key={idx} style={styles.charPill}>
                <Text style={styles.charFlag}>{char.flag}</Text>
                <View style={styles.charTextWrap}>
                  <Text style={styles.charName}>{char.name}</Text>
                  <Text style={styles.charTag}>{char.tagKo}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.missionPill}>
            <Text style={styles.missionText}>
              🎯 {pick(
                lang,
                data.step1Listening.missionKo,
                data.step1Listening.missionVi
              )}
            </Text>
          </View>
        </View>

        {/* ── 2. 따라 말하기 카드 (Speaking Step) ── */}
        <View style={[styles.stepCard, styles.speakingCard]}>
          <Text style={styles.stepTitle}>
            {pick(
              lang,
              data.step2Speaking.titleKo,
              data.step2Speaking.titleVi
            )}
          </Text>

          {/* 질문 & 대답 말풍선 */}
          <View style={styles.qnaWrap}>
            {/* 질문 */}
            <View style={styles.questionBubble}>
              <Text style={styles.qLabel}>질문 (Hỏi)</Text>
              <Text style={styles.questionText}>
                {data.step2Speaking.questionKo}
              </Text>
              <Text style={styles.questionTextVi}>
                {data.step2Speaking.questionVi}
              </Text>
            </View>

            {/* 답변 가이드 */}
            <View style={styles.answerBubble}>
              <Text style={styles.aLabel}>내 대답 (Trả lời)</Text>
              <Text style={styles.answerText}>
                {data.step2Speaking.answerGuideKo}
              </Text>
              <Text style={styles.answerTextVi}>
                {data.step2Speaking.answerGuideVi}
              </Text>
            </View>
          </View>

          <View style={styles.micGuideBox}>
            <ThemedGlyph style={styles.micGuideIcon} glyph="🎙️" />
            <Text style={styles.micGuideText}>
              {pick(
                lang,
                '문제를 듣고 마이크를 눌러 크게 말해 보세요!',
                'Nghe câu hỏi và bấm micro để nói thật to nhé!'
              )}
            </Text>
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
            {pick(lang, '듣고 말하기 시작하기  →', 'Bắt đầu nghe và nói  →')}
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

  // 스텝 카드 공통
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 12,
    ...shadow.card,
  },
  speakingCard: {
    borderColor: '#BFE8E6',
    backgroundColor: '#FAFCFD',
  },
  stepCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTitle: { fontSize: 16, fontWeight: '800', color: colors.ink },
  audioPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.tealSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  audioPlayBtnPlaying: { backgroundColor: '#C8EAE8' },
  audioPlayIcon: { fontSize: 12, color: colors.teal },
  audioPlayText: { fontSize: 11, fontWeight: '700', color: colors.teal },

  // 인물 필
  charsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  charPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  charFlag: { fontSize: 26 },
  charTextWrap: { gap: 2 },
  charName: { fontSize: 14, fontWeight: '800', color: colors.ink },
  charTag: { fontSize: 11, color: colors.muted },

  missionPill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  missionText: { fontSize: 12, fontWeight: '700', color: '#334155' },

  // Q&A 영역
  qnaWrap: { gap: 10 },
  questionBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    gap: 2,
  },
  qLabel: { fontSize: 10, fontWeight: '800', color: colors.muted, marginBottom: 2 },
  questionText: { fontSize: 14, fontWeight: '700', color: colors.ink },
  questionTextVi: { fontSize: 11, color: colors.muted },

  answerBubble: {
    backgroundColor: colors.tealSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#B2EBE8',
    gap: 2,
  },
  aLabel: { fontSize: 10, fontWeight: '800', color: colors.teal, marginBottom: 2 },
  answerText: { fontSize: 15, fontWeight: '800', color: '#005E5D' },
  answerTextVi: { fontSize: 11, color: colors.muted },

  micGuideBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 10,
    gap: 8,
  },
  micGuideIcon: { fontSize: 18 },
  micGuideText: { fontSize: 12, fontWeight: '700', color: '#92400E', flex: 1 },

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
