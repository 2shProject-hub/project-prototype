import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, shadow } from '../../theme/colors';
import { LangToggle } from '../../components/LangToggle';
import { useLang, pick } from '../../components/LangContext';
import { SESSION1 } from '../../data/lessonData';

type GrammarView = 'teach' | 'quiz';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

function RuleTable() {
  const { lang } = useLang();
  const g = SESSION1.grammar;

  return (
    <View style={rt.wrap}>
      <View style={rt.row}>
        {/* 받침 O */}
        <View style={[rt.col, rt.colLeft]}>
          <View style={rt.badge}>
            <Text style={rt.badgeText}>받침 O</Text>
          </View>
          <Text style={rt.ending}>이에요</Text>
          <View style={rt.examples}>
            <Text style={rt.exampleLine}>
              <Text style={rt.exampleWord}>사람</Text>
              <Text style={rt.exampleEnding}>이에요</Text>
            </Text>
            <Text style={rt.exampleLine}>
              <Text style={rt.exampleWord}>학생</Text>
              <Text style={rt.exampleEnding}>이에요</Text>
            </Text>
          </View>
        </View>
        {/* 받침 X */}
        <View style={[rt.col, rt.colRight]}>
          <View style={[rt.badge, rt.badgeRight]}>
            <Text style={rt.badgeText}>받침 X</Text>
          </View>
          <Text style={rt.ending}>예요</Text>
          <View style={rt.examples}>
            <Text style={rt.exampleLine}>
              <Text style={rt.exampleWord}>기자</Text>
              <Text style={rt.exampleEnding}>예요</Text>
            </Text>
            <Text style={rt.exampleLine}>
              <Text style={rt.exampleWord}>의사</Text>
              <Text style={rt.exampleEnding}>예요</Text>
            </Text>
          </View>
        </View>
      </View>
      {/* Rule note */}
      <View style={rt.note}>
        <Text style={rt.noteText}>{pick(lang, g.rule, g.ruleVi)}</Text>
      </View>
    </View>
  );
}

const rt = StyleSheet.create({
  wrap: { marginTop: 8, gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  col: {
    flex: 1, borderRadius: 16, padding: 16, gap: 8,
    borderWidth: 2, alignItems: 'center',
  },
  colLeft: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  colRight: { borderColor: colors.amber, backgroundColor: '#fff8eb' },
  badge: {
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
    backgroundColor: colors.teal,
  },
  badgeRight: { backgroundColor: colors.amber },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  ending: { fontSize: 24, fontWeight: '800', color: colors.ink },
  examples: { gap: 4, alignItems: 'center' },
  exampleLine: { fontSize: 13 },
  exampleWord: { fontWeight: '600', color: colors.ink },
  exampleEnding: { color: colors.teal, fontWeight: '700' },
  note: {
    backgroundColor: colors.canvas, borderRadius: 12,
    padding: 14, borderWidth: 1, borderColor: colors.line,
  },
  noteText: { fontSize: 13, color: colors.ink, lineHeight: 20, textAlign: 'center' },
});

type SentenceItem = (typeof SESSION1.grammar.sentenceQuiz)[number];

function SentenceQuiz({ items, onDone }: { items: SentenceItem[]; onDone: () => void }) {
  const { lang } = useLang();
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const item = items[idx];

  const advance = () => {
    setSelected(null);
    if (idx + 1 < items.length) setIdx(idx + 1);
    else onDone();
  };

  const choose = (v: string, correct: boolean) => {
    if (selected) return;
    setSelected(v);
    setTimeout(advance, correct ? 700 : 1200);
  };

  const pct = Math.round(((idx + 1) / items.length) * 100);

  return (
    <View style={sq.wrap}>
      {/* Mini progress */}
      <View style={sq.progressTrack}>
        <View style={[sq.progressFill, { width: `${pct}%` as `${number}%` }]} />
      </View>
      <Text style={sq.counter}>{idx + 1} / {items.length}</Text>

      {/* blank type */}
      {item.type === 'blank' && (
        <>
          <View style={sq.sentenceBox}>
            <Text style={sq.sentenceText}>
              {item.prefix}
              <Text style={sq.blank}>{selected === item.answer ? item.answer : '___'}</Text>
              {item.suffix}
            </Text>
          </View>
          <View style={sq.choices}>
            {(item.choices ?? []).map((c) => {
              const state = selected === c ? (c === item.answer ? 'correct' : 'wrong') : 'default';
              return (
                <TouchableOpacity key={c} style={[sq.choiceBtn, state === 'correct' && sq.correct, state === 'wrong' && sq.wrong]}
                  onPress={() => choose(c, c === item.answer)} disabled={!!selected} activeOpacity={0.7}>
                  <Text style={[sq.choiceBtnText, state !== 'default' && sq.choiceBtnTextAlt]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* translate type */}
      {item.type === 'translate' && (
        <>
          <View style={sq.sentenceBox}>
            <Text style={sq.viText}>{item.vi}</Text>
          </View>
          <View style={sq.choices}>
            {(item.choices ?? []).map((c) => {
              const state = selected === c ? (c === item.answer ? 'correct' : 'wrong') : 'default';
              return (
                <TouchableOpacity key={c} style={[sq.choiceBtnWide, state === 'correct' && sq.correct, state === 'wrong' && sq.wrong]}
                  onPress={() => choose(c, c === item.answer)} disabled={!!selected} activeOpacity={0.7}>
                  <Text style={[sq.choiceBtnText, state !== 'default' && sq.choiceBtnTextAlt]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}

      {/* construct / constructChar — tile assembler */}
      {(item.type === 'construct' || item.type === 'constructChar') && (
        <>
          <View style={sq.sentenceBox}>
            <Text style={sq.viText}>{item.vi}</Text>
          </View>
          <Text style={sq.tileHint}>{pick(lang, '카드를 탭해 문장을 완성하세요', 'Ghép thẻ thành câu')}</Text>
          <View style={sq.tilePool}>
            {[...(item.tiles ?? []), ...(item.distractorTiles ?? [])].sort(() => Math.random() - 0.5).map((t, i) => (
              <TouchableOpacity key={i} style={sq.tile} activeOpacity={0.7} onPress={() => choose(t, t === item.answer)}>
                <Text style={sq.tileText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* listen types */}
      {(item.type === 'listenWord' || item.type === 'listenChar') && (
        <>
          <TouchableOpacity style={sq.speakBtn} activeOpacity={0.7}>
            <ThemedGlyph style={sq.speakIcon} glyph="🔊" />
            <Text style={sq.speakLabel}>{pick(lang, '다시 듣기', 'Nghe lại')}</Text>
          </TouchableOpacity>
          <Text style={sq.tileHint}>{pick(lang, '들은 문장을 카드로 완성하세요', 'Ghép thẻ thành câu vừa nghe')}</Text>
          <View style={sq.tilePool}>
            {[...(item.tiles ?? []), ...(item.distractorTiles ?? [])].sort(() => Math.random() - 0.5).map((t, i) => (
              <TouchableOpacity key={i} style={sq.tile} activeOpacity={0.7} onPress={() => choose(t, t === (item.tiles ?? []).join(''))}>
                <Text style={sq.tileText}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const sq = StyleSheet.create({
  wrap: { gap: 16 },
  progressTrack: { height: 4, backgroundColor: colors.line, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.teal, borderRadius: 2 },
  counter: { fontSize: 12, color: colors.muted, fontWeight: '600', textAlign: 'right' },
  sentenceBox: {
    backgroundColor: colors.canvas, borderRadius: 14,
    padding: 18, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center',
  },
  sentenceText: { fontSize: 18, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  blank: { color: colors.teal, textDecorationLine: 'underline' },
  viText: { fontSize: 15, color: colors.muted, textAlign: 'center', lineHeight: 22 },
  choices: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  choiceBtn: {
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14,
    borderWidth: 2, borderColor: colors.line, backgroundColor: colors.canvas,
  },
  choiceBtnWide: {
    flex: 1, paddingVertical: 14, paddingHorizontal: 12, borderRadius: 14,
    borderWidth: 2, borderColor: colors.line, backgroundColor: colors.canvas,
  },
  correct: { borderColor: colors.green, backgroundColor: '#f0faf5' },
  wrong: { borderColor: colors.red, backgroundColor: '#fef2f2' },
  choiceBtnText: { fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  choiceBtnTextAlt: { color: colors.ink },
  tileHint: { fontSize: 13, color: colors.muted },
  tilePool: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tile: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line,
  },
  tileText: { fontSize: 15, fontWeight: '700', color: colors.ink },
  speakBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center',
    backgroundColor: colors.tealSoft, borderRadius: 50,
    paddingHorizontal: 20, paddingVertical: 14,
  },
  speakIcon: { fontSize: 22 },
  speakLabel: { fontSize: 13, fontWeight: '600', color: colors.teal },
});

export function GrammarStage({ onComplete, onBack }: Props) {
  const { lang } = useLang();
  const [view, setView] = useState<GrammarView>('teach');
  const g = SESSION1.grammar;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={view === 'quiz' ? () => setView('teach') : onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerSub}>{g.label}</Text>
          <Text style={styles.headerTitle}>{g.title}</Text>
        </View>
        <LangToggle />
      </View>

      {view === 'teach' && (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.heroText}>
              <Text style={styles.heroLabel}>{pick(lang, '핵심 문법', 'Ngữ pháp chính')}</Text>
              <Text style={styles.heroTitle2}>{g.title}</Text>
              <Text style={styles.heroRule}>{pick(lang, g.rule, g.ruleVi)}</Text>
            </View>
            <View style={styles.heroIllustration}>
              <ThemedGlyph style={styles.heroEmoji} glyph="📚" />
            </View>
          </View>

          {/* Rule Table */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{pick(lang, '규칙 비교', 'So sánh quy tắc')}</Text>
            <RuleTable />
          </View>

          {/* Examples */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>{pick(lang, '예시 문장', 'Câu ví dụ')}</Text>
            <View style={styles.examplesCard}>
              {g.examples.map((ex, i) => (
                <View key={i} style={styles.exampleRow}>
                  <Text style={styles.exampleNum}>{i + 1}</Text>
                  <Text style={styles.exampleText}>{ex}</Text>
                  <TouchableOpacity style={styles.exampleSpeak} activeOpacity={0.7}>
                    <ThemedGlyph glyph="🔊" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 24 }} />
        </ScrollView>
      )}

      {view === 'quiz' && (
        <View style={styles.quizBody}>
          <SentenceQuiz items={g.sentenceQuiz} onDone={onComplete} />
        </View>
      )}

      <View style={styles.footer}>
        {view === 'teach' ? (
          <TouchableOpacity style={styles.ctaBtn} onPress={() => setView('quiz')} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>{pick(lang, '문장 퀴즈 시작', 'Bắt đầu quiz câu')}</Text>
            <Text style={styles.ctaBtnArrow}>→</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: colors.muted }]} onPress={onComplete} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>{pick(lang, '학습 완료', 'Hoàn thành')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  header: {
    height: 64, paddingHorizontal: 16, flexDirection: 'row',
    alignItems: 'center', gap: 8,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  backBtn: { padding: 6 },
  backIcon: { fontSize: 20, color: colors.ink },
  headerCenter: { flex: 1 },
  headerSub: { fontSize: 11, fontWeight: '600', color: colors.teal },
  headerTitle: { fontSize: 15, fontWeight: '700', color: colors.ink },

  scroll: { flex: 1 },
  quizBody: { flex: 1, padding: 20 },

  hero: {
    flexDirection: 'row', padding: 20, gap: 16,
    backgroundColor: colors.tealSoft,
    borderBottomWidth: 1, borderBottomColor: '#b3f0ef',
  },
  heroText: { flex: 1, gap: 6 },
  heroLabel: { fontSize: 11, fontWeight: '700', color: colors.teal, textTransform: 'uppercase' as const },
  heroTitle2: { fontSize: 20, fontWeight: '800', color: colors.ink },
  heroRule: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  heroIllustration: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(0,168,166,0.2)', alignItems: 'center', justifyContent: 'center',
  },
  heroEmoji: { fontSize: 28 },

  section: { padding: 20, gap: 10 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: colors.muted, textTransform: 'uppercase' as const, letterSpacing: 0.5 },

  examplesCard: {
    backgroundColor: colors.surface, borderRadius: 16,
    borderWidth: 1, borderColor: colors.line, overflow: 'hidden', ...shadow.card,
  },
  exampleRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.canvas, gap: 12,
  },
  exampleNum: {
    width: 22, height: 22, borderRadius: 11, backgroundColor: colors.teal,
    textAlign: 'center', lineHeight: 22, color: '#fff', fontSize: 11, fontWeight: '700',
  },
  exampleText: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.ink },
  exampleSpeak: { padding: 4 },

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
