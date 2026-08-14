/**
 * BridgeStage — 학습 단계 전환 맥락 연결 화면 (4종)
 *
 * ■ bridgeType 별 전환 방향
 *   'vocab-to-grammar'      : 어휘 → 문법     (A형)
 *   'grammar-to-listening'  : 문법 → 듣고말하기 (B형)
 *   'grammar-to-speaking'   : 문법 → 말하기    (C형)
 *   'grammar-to-writing'    : 문법 → 읽고쓰기  (D형)
 *
 * ■ 칩 스타일
 *   vocab-to-grammar: teal 테두리 칩 (어휘, ko+vi 양국어 표시)
 *   grammar-to-*    : ink 테두리 칩  (문법 패턴, ko만 표시)
 *
 * ■ 애니메이션 흐름 (4단계 순차 페이드인)
 *   Phase 1 (0ms)    → 방향 표시 배지 + 브릿지 메시지
 *   Phase 2 (500ms)  → 배운 항목 칩 목록 등장
 *   Phase 3 (950ms)  → 하이라이트 예문 연출 + 완성 문장
 *   Phase 4 (1400ms) → 다음 활동 배지 + CTA 버튼
 *
 * ■ 웹 호환: opacity 애니메이션만 사용 (useNativeDriver: Platform.OS !== 'web')
 *
 * ■ 이식 가이드 (Source A ActivityLayout 연동 시)
 *   1. <View style={s.screen}> → <ActivityLayout ...> 로 교체
 *   2. learnedChips → ADMIN API 직전 액티비티 응답에서 동적 주입
 *   3. example.highlight → 학습 완료 항목 중 예문 적합 항목 자동 선택
 *   4. onPressConfirm → ActivityLayout.onPressConfirm
 *   5. confirmDisabled는 항상 false (브릿지는 즉시 진행 가능)
 */

import { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import {
  MOCK_BRIDGE_VOCAB_GRAMMAR,
  type BridgeData,
  type BridgeChip,
  type BridgeType,
} from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

// ─── 방향 배지 레이블 ─────────────────────────────────────────────
const FLOW_LABELS: Record<BridgeType, { icon: string; koLabel: string; viLabel: string }> = {
  'vocab-to-grammar':       { icon: '📝', koLabel: '어휘 → 문법',       viLabel: 'Từ vựng → Ngữ pháp' },
  'grammar-to-listening':   { icon: '🎧', koLabel: '문법 → 듣고 말하기', viLabel: 'Ngữ pháp → Nghe & nói' },
  'grammar-to-speaking':    { icon: '🎤', koLabel: '문법 → 말하기',      viLabel: 'Ngữ pháp → Nói' },
  'grammar-to-writing':     { icon: '✏️', koLabel: '문법 → 읽고 쓰기',   viLabel: 'Ngữ pháp → Đọc & viết' },
};

// ─── Props ────────────────────────────────────────────────────────
interface BridgeStageProps {
  onPressConfirm: () => void;
  onClose: () => void;
  data?: BridgeData;
}

// ─── 어휘 칩 (vocab-to-grammar용, teal 스타일, ko + vi 양국어) ────
function VocabChip({ chip }: { chip: BridgeChip }) {
  return (
    <View style={chipS.vocabWrap}>
      <Text style={chipS.ko}>{chip.ko}</Text>
      {chip.vi ? <Text style={chipS.vi}>{chip.vi}</Text> : null}
    </View>
  );
}

// ─── 문법 칩 (grammar-to-* 용, ink 스타일, ko만 표시) ────────────
function GrammarChip({ chip }: { chip: BridgeChip }) {
  return (
    <View style={chipS.grammarWrap}>
      <Text style={chipS.grammarKo}>{chip.ko}</Text>
    </View>
  );
}

const chipS = StyleSheet.create({
  vocabWrap: {
    backgroundColor: '#F0FAFA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.teal,
    gap: 2,
  },
  grammarWrap: {
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ink,
  },
  ko:        { fontSize: 14, fontWeight: '700', color: colors.ink },
  vi:        { fontSize: 11, color: colors.muted },
  grammarKo: { fontSize: 14, fontWeight: '700', color: colors.ink },
});

// ─── 메인 화면 ────────────────────────────────────────────────────
export function BridgeStage({
  onPressConfirm,
  onClose,
  data = MOCK_BRIDGE_VOCAB_GRAMMAR,
}: BridgeStageProps) {
  const { lang } = useLang();
  const useND = Platform.OS !== 'web';
  const hideUI = Platform.OS === 'web' && typeof window !== 'undefined' && window.location.search.includes('recording=true');

  const flowOpacity      = useRef(new Animated.Value(0)).current;
  const chipsOpacity     = useRef(new Animated.Value(0)).current;
  const highlightOpacity = useRef(new Animated.Value(0)).current;
  const suffixOpacity    = useRef(new Animated.Value(0)).current;
  const ctaOpacity       = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (hideUI) {
      Animated.sequence([
        // Phase 1 (0ms)
        Animated.timing(flowOpacity, { toValue: 1, duration: 500, useNativeDriver: useND }),
        // Phase 2 (3.8s 시작을 위한 3.3s delay)
        Animated.delay(3300),
        Animated.timing(chipsOpacity, { toValue: 1, duration: 500, useNativeDriver: useND }),
        // Phase 3 (9.9s 시작을 위한 5.6s delay)
        Animated.delay(5600),
        Animated.timing(highlightOpacity, { toValue: 1, duration: 500, useNativeDriver: useND }),
        Animated.delay(300),
        Animated.timing(suffixOpacity, { toValue: 1, duration: 500, useNativeDriver: useND }),
        // Phase 4 (16.8s 시작을 위한 5.0s delay)
        Animated.delay(5000),
        Animated.timing(ctaOpacity, { toValue: 1, duration: 500, useNativeDriver: useND }),
      ]).start();
    } else {
      Animated.sequence([
        Animated.timing(flowOpacity, { toValue: 1, duration: 350, useNativeDriver: useND }),
        Animated.delay(50),
        Animated.timing(chipsOpacity, { toValue: 1, duration: 400, useNativeDriver: useND }),
        Animated.delay(100),
        Animated.timing(highlightOpacity, { toValue: 1, duration: 450, useNativeDriver: useND }),
        Animated.delay(150),
        Animated.timing(suffixOpacity, { toValue: 1, duration: 450, useNativeDriver: useND }),
        Animated.delay(200),
        Animated.timing(ctaOpacity, { toValue: 1, duration: 400, useNativeDriver: useND }),
      ]).start();
    }
  }, []);

  const flow = FLOW_LABELS[data.bridgeType];
  const isVocabToGrammar = data.bridgeType === 'vocab-to-grammar';

  return (
    <View style={s.screen}>
      {!hideUI && <ActivityHeader percentage={35} onClose={onClose} />}

      <View style={s.content}>

        {/* ── Phase 1: 전환 방향 배지 + 브릿지 메시지 ── */}
        <Animated.View style={[s.flowSection, { opacity: flowOpacity }]}>
          <View style={s.flowBadge}>
            <Text style={s.flowIcon}>{flow.icon}</Text>
            <Text style={s.flowLabel}>
              {pick(lang, flow.koLabel, flow.viLabel)}
            </Text>
          </View>
          <Text style={s.bridgeMessage}>
            {pick(lang, data.bridgeMessage, data.bridgeMessageVi)}
          </Text>
        </Animated.View>

        {/* ── Phase 2: 배운 항목 칩 목록 ── */}
        {/* vocab-to-grammar: teal 어휘 칩 / grammar-to-*: ink 문법 칩 */}
        <Animated.View style={[s.chipsRow, { opacity: chipsOpacity }]}>
          {data.learnedChips.map((chip, i) =>
            isVocabToGrammar
              ? <VocabChip key={i} chip={chip} />
              : <GrammarChip key={i} chip={chip} />
          )}
        </Animated.View>

        {/* ── 구분선 ── */}
        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerLabel}>
            {pick(lang, '이걸로 연습해봐요', 'Hãy luyện tập với điều này')}
          </Text>
          <View style={s.dividerLine} />
        </View>

        {/* ── Phase 2 + 3: 문장 연출 ── */}
        <View style={s.sentenceArea}>
          <View style={s.sentenceRow}>
            {data.example.prefix ? (
              <Text style={s.sentencePrefix}>{data.example.prefix}</Text>
            ) : null}

            {/* Phase 2 — 하이라이트 요소 */}
            <Animated.View style={[s.highlightChip, { opacity: highlightOpacity }]}>
              <Text style={s.highlightText}>{data.example.highlight}</Text>
            </Animated.View>

            {/* Phase 3 — 문법/활동 요소 */}
            {data.example.suffix ? (
              <Animated.Text style={[s.suffixText, { opacity: suffixOpacity }]}>
                {data.example.suffix}
              </Animated.Text>
            ) : null}
          </View>

          {/* Phase 3 — 완성 문장 */}
          <Animated.View style={[s.fullSentenceBox, { opacity: suffixOpacity }]}>
            <Text style={s.fullSentenceKo}>{data.example.full}</Text>
            <Text style={s.fullSentenceVi}>{data.example.fullVi}</Text>
          </Animated.View>
        </View>

        {/* ── Phase 4: 다음 활동 배지 ── */}
        <Animated.View style={[s.nextBadgeWrap, { opacity: ctaOpacity }]}>
          <View style={s.nextBadge}>
            <Text style={s.nextBadgeText}>
              {pick(lang, data.nextLabel, data.nextLabelVi)}
            </Text>
          </View>
          <Text style={s.nextBadgeDesc}>
            {pick(lang, '다음 활동이에요', 'Đây là hoạt động tiếp theo')}
          </Text>
        </Animated.View>

      </View>

      {/* ── Phase 4: CTA 버튼 ── */}
      {!hideUI && (
        <Animated.View style={[s.footer, { opacity: ctaOpacity }]}>
          <TouchableOpacity style={s.ctaBtn} onPress={onPressConfirm} activeOpacity={0.85}>
            <Text style={s.ctaBtnText}>
              {pick(lang, data.ctaLabel, data.ctaLabelVi)} →
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FFFFFF' },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 20,
  },

  // Phase 1: 방향 배지 + 메시지
  flowSection: { alignItems: 'center', gap: 12 },
  flowBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EEF9F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.teal,
  },
  flowIcon: { fontSize: 14 },
  flowLabel: { fontSize: 13, fontWeight: '700', color: colors.teal },
  bridgeMessage: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 30,
    textAlign: 'center',
  },

  // Phase 2: 칩 목록
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },

  // 구분선
  divider: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },

  // 문장 연출
  sentenceArea: { gap: 12, alignItems: 'center' },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sentencePrefix: { fontSize: 20, fontWeight: '600', color: colors.muted },
  highlightChip: {
    backgroundColor: colors.tealSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: colors.teal,
  },
  highlightText: { fontSize: 20, fontWeight: '800', color: colors.teal },
  suffixText: { fontSize: 20, fontWeight: '600', color: colors.ink },
  fullSentenceBox: {
    backgroundColor: '#F0FAFA',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
    alignSelf: 'stretch',
  },
  fullSentenceKo: { fontSize: 16, fontWeight: '700', color: colors.ink, textAlign: 'center' },
  fullSentenceVi: { fontSize: 13, color: colors.muted, textAlign: 'center' },

  // Phase 4: 다음 활동 배지
  nextBadgeWrap: { alignItems: 'center', gap: 6 },
  nextBadge: {
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  nextBadgeText: { fontSize: 14, fontWeight: '700', color: colors.teal },
  nextBadgeDesc: { fontSize: 12, color: colors.muted },

  // 푸터
  footer: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  ctaBtn: {
    backgroundColor: colors.teal,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
