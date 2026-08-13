import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { LangToggle } from '../../components/LangToggle';
import { useLang, pick } from '../../components/LangContext';
import { SESSION1 } from '../../data/lessonData';

type Tab = 'all' | 'ko' | 'vi';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export function ContextStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const [tab, setTab] = useState<Tab>('all');
  const words = SESSION1.context.words;

  const TABS: { key: Tab; label: string }[] = [
    { key: 'all', label: pick(lang, '전체 보기', 'Xem tất cả') },
    { key: 'ko', label: pick(lang, '한국어 보기', 'Tiếng Hàn') },
    { key: 'vi', label: pick(lang, '베트남어 보기', 'Tiếng Việt') },
  ];

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{pick(lang, '오늘의 단어', 'Từ vựng hôm nay')}</Text>
        </View>
        <LangToggle />
      </View>

      {/* Kicker */}
      <View style={styles.kickerRow}>
        <Text style={styles.kicker}>📖 {pick(lang, '나라와 국적', 'Quốc gia và Quốc tịch')}</Text>
        <Text style={styles.kickerSub}>{pick(lang, '단어의 철자, 발음, 뜻을 학습해요.', 'Học chính tả, phát âm và nghĩa của từ.')}</Text>
      </View>

      {/* Tab Filter */}
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
            onPress={() => setTab(t.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabBtnText, tab === t.key && styles.tabBtnTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Word List */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.wordList}>
          {words.map((w, i) => (
            <View key={w.ko} style={[styles.wordRow, i === words.length - 1 && { borderBottomWidth: 0 }]}>
              <View style={styles.wordIndex}>
                <Text style={styles.wordIndexText}>{i + 1}</Text>
              </View>
              <View style={styles.wordTexts}>
                {tab !== 'vi' && (
                  <Text style={styles.wordKo}>{w.ko}</Text>
                )}
                {tab !== 'ko' && (
                  <Text style={styles.wordVi}>{w.vi}</Text>
                )}
              </View>
              <TouchableOpacity style={styles.speakBtn} activeOpacity={0.7}>
                <Text style={styles.speakIcon}>🔊</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.ctaBtn} onPress={onNext} activeOpacity={0.85}>
          <Text style={styles.ctaBtnText}>{pick(lang, '어휘 퀴즈 시작', 'Bắt đầu quiz từ vựng')}</Text>
          <Text style={styles.ctaBtnArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  header: {
    height: 60, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', gap: 8,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  backBtn: { padding: 6 },
  backIcon: { fontSize: 20, color: colors.ink },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: colors.ink },

  kickerRow: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  kicker: { fontSize: 15, fontWeight: '700', color: colors.ink, marginBottom: 4 },
  kickerSub: { fontSize: 13, color: colors.muted },

  tabRow: {
    flexDirection: 'row', paddingHorizontal: 16, gap: 8, marginBottom: 4,
  },
  tabBtn: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20,
    backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line,
  },
  tabBtnActive: { backgroundColor: colors.teal, borderColor: colors.teal },
  tabBtnText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  tabBtnTextActive: { color: '#fff' },

  scroll: { flex: 1 },
  wordList: {
    marginHorizontal: 16, marginTop: 8,
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.line,
    overflow: 'hidden', ...shadow.card,
  },
  wordRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.canvas,
    gap: 12,
  },
  wordIndex: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center',
  },
  wordIndexText: { fontSize: 11, fontWeight: '700', color: colors.muted },
  wordTexts: { flex: 1, gap: 2 },
  wordKo: { fontSize: 16, fontWeight: '700', color: colors.ink },
  wordVi: { fontSize: 13, color: colors.muted },
  speakBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center',
  },
  speakIcon: { fontSize: 16 },

  footer: {
    padding: 16, paddingBottom: 20,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  ctaBtn: {
    backgroundColor: colors.teal, borderRadius: 16, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  ctaBtnArrow: { color: '#fff', fontSize: 18 },
});
