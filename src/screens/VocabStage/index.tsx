import { ThemedGlyph } from '../../components/ThemedGlyph';
import { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { LangToggle } from '../../components/LangToggle';
import { useLang, pick } from '../../components/LangContext';
import { SESSION1 } from '../../data/lessonData';

interface Props {
  onComplete: () => void;
  onBack: () => void;
}

type QuizItem = (typeof SESSION1.context.vocabQuizItems)[number];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUIZ_PROMPTS: Record<string, { ko: string; vi: string }> = {
  'vi-to-ko': { ko: '베트남어를 보고 한국어를 고르세요.', vi: 'Nhìn tiếng Việt, chọn tiếng Hàn.' },
  'listen-choice': { ko: '듣고 알맞은 단어를 고르세요.', vi: 'Nghe và chọn từ đúng.' },
  'listen-pick-audio': { ko: '다시 듣고 알맞은 단어를 고르세요.', vi: 'Nghe lại và chọn từ đúng.' },
  'ko-to-vi': { ko: '한국어를 보고 베트남어를 고르세요.', vi: 'Nhìn tiếng Hàn, chọn tiếng Việt.' },
  'listen-assemble': { ko: '들은 단어를 글자 카드로 완성하세요.', vi: 'Ghép thẻ chữ thành từ vừa nghe.' },
  'recall-type': { ko: '뜻을 보고 글자 카드로 단어를 완성하세요.', vi: 'Nhìn nghĩa, ghép thẻ chữ thành từ.' },
};

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100);
  return (
    <View style={pb.track}>
      <View style={[pb.fill, { width: `${pct}%` as `${number}%` }]} />
    </View>
  );
}

const pb = StyleSheet.create({
  track: { height: 4, backgroundColor: colors.line, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: colors.teal, borderRadius: 2 },
});

function ChoiceGrid({ item, selected, onChoose }: { item: QuizItem; selected: string | null; onChoose: (v: string, correct: boolean) => void }) {
  const choices = useMemo(() => shuffle(item.choices ?? []), [item]);
  const isVi = item.type === 'ko-to-vi';

  return (
    <View style={cg.grid}>
      {choices.map((opt) => {
        let state: 'default' | 'correct' | 'wrong' = 'default';
        if (selected === opt) state = opt === item.answer ? 'correct' : 'wrong';
        else if (selected && opt === item.answer) state = 'correct';

        return (
          <TouchableOpacity
            key={opt}
            style={[cg.card, state === 'correct' && cg.cardCorrect, state === 'wrong' && cg.cardWrong]}
            onPress={() => onChoose(opt, opt === item.answer)}
            disabled={!!selected}
            activeOpacity={0.7}
          >
            <Text style={[cg.cardText, isVi && cg.cardTextVi,
              state === 'correct' && cg.cardTextCorrect,
              state === 'wrong' && cg.cardTextWrong,
            ]}>
              {opt}
            </Text>
            {state === 'correct' && <Text style={cg.badge}>✓</Text>}
            {state === 'wrong' && <Text style={cg.badge}>✗</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const cg = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  card: {
    width: '47%', paddingVertical: 20, paddingHorizontal: 12,
    borderRadius: 16, borderWidth: 2, borderColor: colors.line,
    backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center',
    flexDirection: 'row', gap: 6,
  },
  cardCorrect: { borderColor: colors.green, backgroundColor: '#f0faf5' },
  cardWrong: { borderColor: colors.red, backgroundColor: '#fef2f2' },
  cardText: { fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  cardTextVi: { fontSize: 13 },
  cardTextCorrect: { color: colors.green },
  cardTextWrong: { color: colors.red },
  badge: { fontSize: 16 },
});

function TileAssembler({ item, onDone }: { item: QuizItem; onDone: (correct: boolean) => void }) {
  const allTiles = useMemo(() => shuffle([...(item.tiles ?? []), ...(item.distractorTiles ?? [])]), [item]);
  const [picked, setPicked] = useState<string[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  const correct = (item.tiles ?? []).join('');
  const isCorrect = picked.join('') === correct;

  const toggleTile = (t: string, fromPicked: boolean) => {
    if (confirmed) return;
    if (fromPicked) setPicked((p) => { const i = p.lastIndexOf(t); return [...p.slice(0, i), ...p.slice(i + 1)]; });
    else setPicked((p) => [...p, t]);
  };

  const confirm = () => { setConfirmed(true); setTimeout(() => onDone(isCorrect), 900); };

  return (
    <View style={ta.wrap}>
      {/* Answer area */}
      <View style={ta.answerRow}>
        {picked.length === 0
          ? <Text style={ta.placeholder}>카드를 탭해 단어를 완성하세요</Text>
          : picked.map((t, i) => (
            <TouchableOpacity key={i} style={ta.pickedTile} onPress={() => toggleTile(t, true)} activeOpacity={0.7}>
              <Text style={ta.tileText}>{t}</Text>
            </TouchableOpacity>
          ))}
      </View>
      {/* Pool */}
      <View style={ta.pool}>
        {allTiles.map((t, i) => {
          const used = picked.filter((p) => p === t).length > (item.tiles ?? []).filter((s) => s === t).length - 1;
          return (
            <TouchableOpacity
              key={i}
              style={[ta.poolTile, used && ta.poolTileUsed]}
              onPress={() => !used && toggleTile(t, false)}
              disabled={used || confirmed}
              activeOpacity={0.7}
            >
              <Text style={[ta.tileText, used && { color: colors.line }]}>{t}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {picked.length > 0 && !confirmed && (
        <TouchableOpacity style={ta.confirmBtn} onPress={confirm} activeOpacity={0.85}>
          <Text style={ta.confirmText}>확인</Text>
        </TouchableOpacity>
      )}
      {confirmed && (
        <View style={[ta.result, isCorrect ? ta.resultOk : ta.resultWrong]}>
          <Text style={ta.resultText}>{isCorrect ? '✓ 정확해요!' : `✗ 정답: ${correct}`}</Text>
        </View>
      )}
    </View>
  );
}

const ta = StyleSheet.create({
  wrap: { gap: 16, marginTop: 8 },
  answerRow: {
    minHeight: 52, borderRadius: 14, borderWidth: 2, borderColor: colors.teal,
    borderStyle: 'dashed', flexDirection: 'row', flexWrap: 'wrap',
    alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 6,
  },
  placeholder: { fontSize: 13, color: colors.line },
  pickedTile: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: colors.teal,
  },
  pool: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  poolTile: {
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10,
    backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.line,
  },
  poolTileUsed: { borderColor: colors.canvas },
  tileText: { fontSize: 18, fontWeight: '700', color: '#fff' },
  confirmBtn: {
    backgroundColor: colors.teal, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  result: { borderRadius: 12, padding: 14, alignItems: 'center' },
  resultOk: { backgroundColor: '#f0faf5' },
  resultWrong: { backgroundColor: '#fef2f2' },
  resultText: { fontSize: 15, fontWeight: '700', color: colors.ink },
});

export function VocabStage({ onComplete, onBack }: Props) {
  const { lang } = useLang();
  const items = SESSION1.context.vocabQuizItems;
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);

  const item = items[qIndex];
  const pct = qIndex + 1;

  const advance = () => {
    setSelected(null);
    if (qIndex + 1 < items.length) setQIndex(qIndex + 1);
    else onComplete();
  };

  const choose = (value: string, correct: boolean) => {
    if (selected) return;
    setSelected(value);
    setTimeout(advance, correct ? 650 : 1100);
  };

  const promptObj = QUIZ_PROMPTS[item.type] ?? { ko: '문제를 풀어보세요.', vi: 'Hãy làm bài tập.' };
  const prompt = pick(lang, promptObj.ko, promptObj.vi);

  const isAssemble = item.type === 'listen-assemble' || item.type === 'recall-type';
  const needsListen = ['listen-choice', 'listen-pick-audio'].includes(item.type);

  return (
    <View style={styles.screen}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <ProgressBar current={pct} total={items.length} />
        <TouchableOpacity onPress={onComplete} activeOpacity={0.7}>
          <Text style={styles.skipText}>건너뛰기</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* Counter */}
        <View style={styles.counterRow}>
          <ThemedGlyph style={styles.counterIcon} glyph="📖" />
          <Text style={styles.counter}>{pick(lang, '어휘 문제', 'Câu hỏi từ vựng')} {qIndex + 1}/{items.length}</Text>
        </View>

        {/* Prompt */}
        <Text style={styles.prompt}>{prompt}</Text>

        {/* vi-to-ko: show Vietnamese, pick Korean */}
        {item.type === 'vi-to-ko' && (
          <>
            <View style={styles.promptBox}>
              <Text style={styles.promptBoxText}>{item.vi}</Text>
            </View>
            <ChoiceGrid item={item} selected={selected} onChoose={choose} />
          </>
        )}

        {/* listen-choice / listen-pick-audio: play audio, pick */}
        {needsListen && (
          <>
            <TouchableOpacity style={styles.speakBtn} activeOpacity={0.7}>
              <ThemedGlyph style={styles.speakIcon} glyph="🔊" />
              <Text style={styles.speakLabel}>{pick(lang, '다시 듣기', 'Nghe lại')}</Text>
            </TouchableOpacity>
            <ChoiceGrid item={item} selected={selected} onChoose={choose} />
          </>
        )}

        {/* ko-to-vi: show Korean, pick Vietnamese */}
        {item.type === 'ko-to-vi' && (
          <>
            <View style={styles.promptBox}>
              <Text style={styles.promptBoxTextKo}>{item.ko}</Text>
            </View>
            <ChoiceGrid item={item} selected={selected} onChoose={choose} />
          </>
        )}

        {/* listen-assemble / recall-type: tile assembler */}
        {isAssemble && (
          <>
            {item.type === 'recall-type' && item.vi && (
              <View style={styles.promptBox}>
                <Text style={styles.promptBoxText}>{item.vi}</Text>
              </View>
            )}
            {item.type === 'listen-assemble' && (
              <TouchableOpacity style={styles.speakBtn} activeOpacity={0.7}>
                <ThemedGlyph style={styles.speakIcon} glyph="🔊" />
                <Text style={styles.speakLabel}>{pick(lang, '다시 듣기', 'Nghe lại')}</Text>
              </TouchableOpacity>
            )}
            <TileAssembler item={item} onDone={(ok) => { setTimeout(advance, ok ? 300 : 300); }} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  topBar: {
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderBottomWidth: 1, borderBottomColor: colors.line,
  },
  backBtn: { padding: 4 },
  backIcon: { fontSize: 20, color: colors.ink },
  skipText: { fontSize: 13, color: colors.muted, fontWeight: '600' },

  body: { flex: 1, padding: 20 },
  counterRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  counterIcon: { fontSize: 14 },
  counter: { fontSize: 13, fontWeight: '600', color: colors.muted },

  prompt: { fontSize: 16, fontWeight: '700', color: colors.ink, marginBottom: 20, lineHeight: 24 },

  promptBox: {
    backgroundColor: colors.canvas, borderRadius: 14,
    borderWidth: 1, borderColor: colors.line,
    padding: 20, alignItems: 'center', marginBottom: 16,
  },
  promptBoxText: { fontSize: 20, fontWeight: '700', color: colors.ink },
  promptBoxTextKo: { fontSize: 22, fontWeight: '800', color: colors.teal },

  speakBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    alignSelf: 'center',
    backgroundColor: colors.tealSoft, borderRadius: 50,
    paddingHorizontal: 24, paddingVertical: 16, marginBottom: 20,
  },
  speakIcon: { fontSize: 24 },
  speakLabel: { fontSize: 14, fontWeight: '600', color: colors.teal },
});
