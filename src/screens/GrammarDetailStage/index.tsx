import React, { useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform,
} from 'react-native';

// Metro가 빌드 시 asset을 처리하도록 모듈 최상단에서 require
const VIDEO_ASSET = require('../../../assets/grammar_video.mp4');
const NEXT_AUDIO = require('../../../assets/sounds/tutor_sentence.wav') as string;
import { colors, shadow } from '../../theme/colors';
import { SESSION1 } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const g = SESSION1.grammar;

// ── 웹 전용 비디오 플레이어 ──────────────────────────────────────
function WebVideoPlayer({ src }: { src: string }) {
  return React.createElement('video', {
    src,
    controls: true,
    autoPlay: true,
    playsInline: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      background: '#000',
    },
  }) as React.ReactElement;
}

// ── 받침 쌍 시각화 ────────────────────────────────────────────────
function BatchimPair({ word, ending, hasBatchim }: { word: string; ending: string; hasBatchim: boolean }) {
  const syllables = [...word];
  return (
    <View style={bp.row}>
      <View style={bp.syllablesBox}>
        <View style={bp.syllables}>
          {syllables.map((ch, i) => (
            <View key={i} style={[bp.syllableChip, i === syllables.length - 1 && bp.syllableLast]}>
              <Text style={bp.syllableText}>{ch}</Text>
            </View>
          ))}
        </View>
        <View style={[bp.batchimTag, hasBatchim ? bp.batchimO : bp.batchimX]}>
          <Text style={[bp.batchimTagText, hasBatchim ? bp.batchimOText : bp.batchimXText]}>
            {hasBatchim ? '받침 O' : '받침 X'}
          </Text>
        </View>
      </View>
      <Text style={bp.arrow}>→</Text>
      <View style={bp.result}>
        <Text style={bp.resultWord}>{word} </Text>
        <Text style={bp.resultEnding}>{ending}</Text>
      </View>
    </View>
  );
}

const bp = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 6,
  },
  syllablesBox: { alignItems: 'center', gap: 4 },
  syllables: { flexDirection: 'row', gap: 4 },
  syllableChip: {
    width: 36, height: 36, borderRadius: 8,
    backgroundColor: '#F0F4F8', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D0D8E0',
  },
  syllableLast: { borderColor: colors.teal, borderWidth: 1.5 },
  syllableText: { fontSize: 16, fontWeight: '700', color: colors.ink },
  batchimTag: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
    alignSelf: 'center',
  },
  batchimO: { backgroundColor: colors.tealSoft },
  batchimX: { backgroundColor: '#FEF3C7' },
  batchimTagText: { fontSize: 10, fontWeight: '700' },
  batchimOText: { color: colors.teal },
  batchimXText: { color: '#92400E' },
  arrow: { fontSize: 16, color: colors.muted, fontWeight: '600' },
  result: { flexDirection: 'row', alignItems: 'baseline' },
  resultWord: { fontSize: 16, fontWeight: '600', color: colors.ink },
  resultEnding: { fontSize: 16, fontWeight: '800', color: colors.teal },
});

// ── 메인 컴포넌트 ─────────────────────────────────────────────────
export function GrammarDetailStage({ onNext, onBack }: Props) {
  const { lang } = useLang();
  const [showVideo, setShowVideo] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const nextAudioRef = useRef<HTMLAudioElement | null>(null);

  const handleNext = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (Platform.OS !== 'web') {
      onNext();
      return;
    }

    try {
      const audio = new Audio(NEXT_AUDIO);
      audio.volume = 0.9;
      nextAudioRef.current = audio;
      audio.play().catch(() => { onNext(); });
      audio.onended = () => { onNext(); };
    } catch {
      onNext();
    }
  };

  // video asset - Expo Web resolves require() to a URL
  const videoSrc = Platform.OS === 'web' ? VIDEO_ASSET : null;

  return (
    <View style={styles.screen}>
      <ActivityHeader percentage={60} onClose={onBack} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── 배지 + 타이틀 + 규칙 ── */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pick(lang, g.label, 'Ngữ pháp & biểu hiện 1')}</Text>
        </View>
        <Text style={styles.title}>{g.title}</Text>
        <Text style={styles.rule}>{pick(lang, g.rule, g.ruleVi)}</Text>

        {/* ── 영상 플레이어 ── */}
        <View style={styles.videoThumb}>
          {showVideo && Platform.OS === 'web' ? (
            <WebVideoPlayer src={videoSrc!} />
          ) : (
            <TouchableOpacity
              style={styles.videoThumbInner}
              onPress={() => setShowVideo(true)}
              activeOpacity={0.9}
            >
              {/* 썸네일 배경 */}
              <View style={styles.videoThumbBg}>
                <Text style={styles.videoThumbEmoji}>🎬</Text>
              </View>
              {/* 플레이 버튼 */}
              <View style={styles.playBtn}>
                <Text style={styles.playBtnIcon}>▶</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>

        {/* ── 규칙 표 ── */}
        <View style={styles.ruleTable}>
          {[g.ruleTable.left, g.ruleTable.right].map((col, i) => (
            <View key={i} style={styles.ruleCol}>
              <View style={styles.ruleColHead}>
                <Text style={styles.ruleColHeadText}>{col.header}</Text>
              </View>
              <View style={styles.ruleColBody}>
                {col.examples.map((ex: string) => (
                  <Text key={ex} style={styles.ruleColEx}>{ex}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* ── 보충 설명 ── */}
        <View style={styles.supplement}>
          <View style={styles.supplementBadge}>
            <Text style={styles.supplementBadgeText}>보충 설명</Text>
          </View>
          <Text style={styles.supplementIntro}>{g.supplement.intro}</Text>

          {g.supplement.rules.map((rule: any) => (
            <View key={rule.title} style={styles.ruleBlock}>
              <View style={styles.ruleBlockDivider} />
              <Text style={styles.ruleBlockTitle}>{rule.title}</Text>
              <Text style={styles.ruleBlockDesc}>{rule.desc}</Text>
              <View style={styles.pairsCol}>
                {rule.pairs.map((p: any) => (
                  <BatchimPair key={p.word} word={p.word} ending={p.ending} hasBatchim={rule.hasBatchim} />
                ))}
              </View>
              <View style={styles.examplesBox}>
                {rule.examples.map((ex: any) => (
                  <Text key={ex.highlight} style={styles.exampleLine}>
                    <Text style={styles.exBefore}>예: {ex.before}</Text>
                    <Text style={styles.exHighlight}>{ex.highlight}</Text>
                  </Text>
                ))}
              </View>
            </View>
          ))}

          {/* 요약 버튼 */}
          <View style={styles.summaryRow}>
            {g.supplement.summary.map(([a, b]: [string, string]) => (
              <View key={a} style={styles.summaryBtn}>
                <Text style={styles.summaryBtnText}>{a} → {b}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── 하단 다음 버튼 ── */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, isNavigating && styles.nextBtnDisabled]}
          onPress={handleNext}
          activeOpacity={isNavigating ? 1 : 0.85}
          disabled={isNavigating}
        >
          <Text style={[styles.nextBtnText, isNavigating && styles.nextBtnTextDisabled]}>
            {pick(lang, '다음  →', 'Tiếp theo  →')}
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },


  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 8 },

  // ── Badge + Title + Rule ──
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5,
    marginBottom: 10,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.teal },
  title: {
    fontSize: 26, fontWeight: '800', color: colors.ink,
    lineHeight: 34, marginBottom: 8,
  },
  rule: {
    fontSize: 15, color: '#3D4B57', lineHeight: 24, marginBottom: 18,
  },

  // ── Video Player ──
  videoThumb: {
    borderRadius: 12, overflow: 'hidden',
    aspectRatio: 16 / 9, marginBottom: 20,
    backgroundColor: '#1A2B3C',
    ...shadow.card,
  },
  videoThumbInner: {
    flex: 1,
  },
  videoThumbBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1A2B3C',
    alignItems: 'center', justifyContent: 'center',
  },
  videoThumbEmoji: { fontSize: 64, opacity: 0.5 },
  playBtn: {
    position: 'absolute', alignSelf: 'center', top: '30%',
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  playBtnIcon: { fontSize: 22, color: colors.teal, marginLeft: 4 },
  videoOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 10, paddingBottom: 8,
  },
  videoProgress: {
    height: 3, backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2, marginBottom: 6,
  },
  videoProgressFill: {
    width: '3%', height: '100%', backgroundColor: '#F59E0B', borderRadius: 2,
  },
  videoMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  videoTime: { fontSize: 11, color: '#fff', fontWeight: '500' },
  videoCC: {
    fontSize: 10, color: '#fff', fontWeight: '700',
    borderWidth: 1, borderColor: '#fff', borderRadius: 3,
    paddingHorizontal: 4, paddingVertical: 1,
  },

  // ── Rule Table ──
  ruleTable: {
    flexDirection: 'row', borderRadius: 12, overflow: 'hidden',
    borderWidth: 1, borderColor: '#D8DDE3', marginBottom: 20,
  },
  ruleCol: { flex: 1 },
  ruleColHead: {
    backgroundColor: colors.tealSoft,
    padding: 12, alignItems: 'center',
    borderBottomWidth: 1, borderBottomColor: '#C8EAE8',
  },
  ruleColHeadText: { fontSize: 12, fontWeight: '700', color: colors.teal, textAlign: 'center' },
  ruleColBody: {
    backgroundColor: '#FAFEFF', padding: 12, gap: 8, alignItems: 'center',
  },
  ruleColEx: { fontSize: 13, color: colors.ink, textAlign: 'center', lineHeight: 20 },

  // ── Supplement ──
  supplement: {
    backgroundColor: colors.tealSoft,
    borderRadius: 16, padding: 16, gap: 10,
  },
  supplementBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.teal, borderRadius: 14,
    paddingHorizontal: 12, paddingVertical: 4, marginBottom: 4,
  },
  supplementBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  supplementIntro: { fontSize: 14, color: '#2D3E4A', lineHeight: 22 },

  // ── Rule Block ──
  ruleBlock: { gap: 10 },
  ruleBlockDivider: { height: 1, backgroundColor: 'rgba(0,168,166,0.2)', marginVertical: 4 },
  ruleBlockTitle: { fontSize: 15, fontWeight: '800', color: colors.ink },
  ruleBlockDesc: { fontSize: 13, color: '#4A6070', lineHeight: 20 },
  pairsCol: {
    backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, gap: 6,
    ...shadow.card,
  },
  examplesBox: {
    backgroundColor: '#F0FAFA', borderRadius: 10,
    padding: 12, gap: 6,
    borderWidth: 1, borderColor: '#C8E8E6',
  },
  exampleLine: { fontSize: 14, lineHeight: 22 },
  exBefore: { color: '#3D4B57' },
  exHighlight: { fontWeight: '800', color: colors.teal },

  // ── Summary ──
  summaryRow: {
    flexDirection: 'row', gap: 10, marginTop: 4,
  },
  summaryBtn: {
    flex: 1, backgroundColor: colors.teal, borderRadius: 12,
    paddingVertical: 12, alignItems: 'center',
  },
  summaryBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // ── Footer ──
  footer: {
    paddingHorizontal: 20, paddingBottom: 20, paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  nextBtn: {
    backgroundColor: colors.teal, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: colors.line },
  nextBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  nextBtnTextDisabled: { color: colors.muted },

});
