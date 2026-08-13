import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const EXPRESSIONS = [
  {
    id: 'expr1',
    titleKo: '(명사)를 좋아하다 = (명사)가 좋다',
    titleEn: 'like {noun}',
    illustEmoji: '📺',
    illustDesc: '한국을 좋아하는 사람',
    sentences: [
      { ko: '저는 한국을 ', highlight: '좋아합니다.', en: 'I like Korea.' },
      { ko: '= 저는 한국이 ', highlight: '좋습니다.', en: 'I like Korea.' },
    ],
  },
  {
    id: 'expr2',
    titleKo: '무슨+(명사)',
    titleEn: 'what + (noun)',
    illustEmoji: '🎵',
    illustDesc: '무슨 노래를 묻는 장면',
    sentences: [
      { ko: '무슨 ', highlight: '노래를 듣습니까?', en: 'What song do you listen to?' },
    ],
  },
];

function IllustPlaceholder({ emoji, desc }: { emoji: string; desc: string }) {
  return (
    <View style={illust.box}>
      <Text style={illust.emoji}>{emoji}</Text>
      <Text style={illust.desc}>{desc}</Text>
    </View>
  );
}

const illust = StyleSheet.create({
  box: {
    width: 120,
    height: 100,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    flexShrink: 0,
  },
  emoji: { fontSize: 32 },
  desc: { fontSize: 10, color: colors.muted, textAlign: 'center', paddingHorizontal: 6 },
});

export function WordDetailStage({ onNext, onBack }: Props) {
  const { lang } = useLang();

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={70} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 표현 배지 ── */}
        <View style={styles.topBadgeRow}>
          <View style={styles.topBadge}>
            <Text style={styles.topBadgeKo}>표현</Text>
            <Text style={styles.topBadgeEn}>Expressions</Text>
          </View>
        </View>

        {/* ── 표현 카드 목록 ── */}
        {EXPRESSIONS.map((expr, idx) => (
          <View key={expr.id} style={[styles.exprCard, idx > 0 && styles.exprCardBorder]}>
            <View style={styles.exprRow}>
              {/* 삽화 */}
              <IllustPlaceholder emoji={expr.illustEmoji} desc={expr.illustDesc} />

              {/* 텍스트 내용 */}
              <View style={styles.exprContent}>
                <Text style={styles.exprTitle}>{expr.titleKo}</Text>
                <Text style={styles.exprTitleEn}>{expr.titleEn}</Text>
                <View style={styles.sentencesBox}>
                  {expr.sentences.map((s, si) => (
                    <View key={si} style={styles.sentenceRow}>
                      <Text style={styles.sentenceKo}>
                        <Text style={styles.sentenceBefore}>{s.ko}</Text>
                        <Text style={styles.sentenceHighlight}>{s.highlight}</Text>
                      </Text>
                      <Text style={styles.sentenceEn}>{s.en}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── 하단 다음 버튼 ── */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.nextBtnText}>{pick(lang, '다음  →', 'Tiếp theo  →')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },

  // 상단 표현 배지
  topBadgeRow: { marginBottom: 20 },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: colors.tealSoft,
    borderWidth: 1.5,
    borderColor: colors.teal,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    // 말풍선 느낌을 위한 borderBottomLeftRadius 강조
    borderBottomLeftRadius: 4,
  },
  topBadgeKo: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
  },
  topBadgeEn: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.muted,
  },

  // 표현 카드
  exprCard: {
    backgroundColor: '#FAFEFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.line,
    ...shadow.card,
  },
  exprCardBorder: {},
  exprRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  exprContent: { flex: 1, gap: 6 },
  exprTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 22,
  },
  exprTitleEn: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 4,
  },

  // 예문
  sentencesBox: { gap: 6 },
  sentenceRow: { gap: 1 },
  sentenceKo: { fontSize: 14, lineHeight: 22 },
  sentenceBefore: { color: colors.ink },
  sentenceHighlight: {
    color: colors.teal,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  sentenceEn: { fontSize: 12, color: colors.muted },

  // 푸터
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
  },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
