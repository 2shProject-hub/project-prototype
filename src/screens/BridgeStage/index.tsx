/**
 * BridgeStage — 단어 액티비티 → 문법 액티비티 맥락 전환 화면
 *
 * ■ 화면 목적
 *   단어 학습과 문법 학습 사이의 단절을 방지하고, 직전에 배운 어휘가
 *   문법 속에서 살아 움직이는 경험을 통해 학습 몰입도를 높인다.
 *   (Spotlight Shift + Bridge Quest 패턴)
 *
 * ■ 애니메이션 흐름 (4단계 순차 페이드인)
 *   Phase 1 (0ms)   → 배운 단어 칩 목록 등장
 *   Phase 2 (500ms) → 하이라이트 단어 강조 (teal 배경 칩으로 강조)
 *   Phase 3 (950ms) → 문법 요소(suffix) 옆으로 페이드인 → 완성 문장 노출
 *   Phase 4 (1400ms)→ 문법 구조 배지 + CTA 버튼 등장
 *
 * ■ 웹 호환 주의사항
 *   react-native-web은 useNativeDriver: true를 지원하지 않으므로
 *   Platform.OS !== 'web' 조건으로 분기한다.
 *   transform.translateX interpolation은 web에서 useNativeDriver: false로만 동작.
 *   → 프로토타입에서는 opacity 애니메이션만 사용해 web 호환성을 최대화.
 *
 * ■ 이식 가이드 (Source A ActivityLayout 연동 시)
 *   1. <View style={s.screen}> → <ActivityLayout ...> 로 교체
 *   2. learnedWords → ADMIN API 직전 단어 액티비티 응답에서 동적 주입
 *   3. example.highlight → 학습 완료 단어 중 문법 예문 적합 단어 자동 선택 로직 추가
 *   4. onPressConfirm → ActivityLayout.onPressConfirm (다음 문법 액티비티 진입)
 *   5. confirmDisabled는 항상 false (브릿지는 즉시 진행 가능)
 */

import { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { MOCK_BRIDGE, type BridgeData, type BridgeWord } from '../../data/lessonData';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

// ─── Props ───────────────────────────────────────────────────────
// 이식 시: onPressConfirm → ActivityLayout.onPressConfirm
//          onClose       → ActivityLayout.onClose
interface BridgeStageProps {
  onPressConfirm: () => void;
  onClose: () => void;
  data?: BridgeData;
}

// ─── 단어 칩 (직전 액티비티에서 배운 단어 목록) ──────────────────
// 이식 시: learnedWords 배열은 ADMIN API의 직전 단어 액티비티 결과로 교체
// ko/vi를 모두 표시해 학습한 어휘를 상기시킨다
function WordChipFixed({ word }: { word: BridgeWord }) {
  return (
    <View style={chip.wrap}>
      <Text style={chip.ko}>{word.ko}</Text>
      <Text style={chip.vi}>{word.vi}</Text>
    </View>
  );
}

const chip = StyleSheet.create({
  wrap: {
    backgroundColor: '#F0FAFA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.teal,
    gap: 2,
  },
  ko: { fontSize: 14, fontWeight: '700', color: colors.ink },
  vi: { fontSize: 11, color: colors.muted },
});

// ─── 메인 화면 ────────────────────────────────────────────────────
export function BridgeStage({
  onPressConfirm,
  onClose,
  data = MOCK_BRIDGE,
}: BridgeStageProps) {
  const { lang } = useLang();

  // 웹/네이티브 분기 — react-native-web은 useNativeDriver: true 미지원
  const useND = Platform.OS !== 'web';

  // ── 4단계 순차 애니메이션 값 ──────────────────────────────────
  // Phase 1: 배운 단어 칩 목록
  const wordsOpacity = useRef(new Animated.Value(0)).current;
  // Phase 2: 하이라이트 단어 칩 (배운 어휘 강조)
  const highlightOpacity = useRef(new Animated.Value(0)).current;
  // Phase 3: 문법 요소 suffix + 완성 문장
  const suffixOpacity = useRef(new Animated.Value(0)).current;
  // Phase 4: 문법 배지 + CTA 버튼
  const ctaOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animated.sequence: 각 단계가 완료된 후 다음 단계 실행
    Animated.sequence([
      // Phase 1 — 단어 칩 목록 페이드인 (400ms)
      Animated.timing(wordsOpacity, {
        toValue: 1, duration: 400, useNativeDriver: useND,
      }),
      Animated.delay(100),
      // Phase 2 — 하이라이트 단어 강조 페이드인 (450ms)
      Animated.timing(highlightOpacity, {
        toValue: 1, duration: 450, useNativeDriver: useND,
      }),
      Animated.delay(150),
      // Phase 3 — 문법 요소 + 완성 문장 페이드인 (450ms)
      Animated.timing(suffixOpacity, {
        toValue: 1, duration: 450, useNativeDriver: useND,
      }),
      Animated.delay(200),
      // Phase 4 — 문법 배지 + CTA 버튼 페이드인 (400ms)
      Animated.timing(ctaOpacity, {
        toValue: 1, duration: 400, useNativeDriver: useND,
      }),
    ]).start();
  }, []);

  return (
    <View style={s.screen}>

      {/* ── ActivityHeader (프로그레스바 + X버튼) ── */}
      {/* 이식 시: ActivityLayout showCloseButton=true, percentage는 현재 진행 단계 기준 */}
      <ActivityHeader percentage={35} onClose={onClose} />

      <View style={s.content}>

        {/* ── 브릿지 메시지 ── */}
        {/* 직전 단어 학습과 앞으로의 문법 학습을 자연스럽게 연결하는 안내 텍스트 */}
        <Text style={s.bridgeMessage}>
          {pick(lang, data.bridgeMessage, data.bridgeMessageVi)}
        </Text>

        {/* ── Phase 1: 배운 단어 칩 목록 ── */}
        {/* 이식 시: ADMIN API 직전 단어 액티비티 응답의 학습 완료 단어로 교체 (MAX 5개 권장) */}
        <Animated.View style={[s.wordChipsRow, { opacity: wordsOpacity }]}>
          {data.learnedWords.map((word, i) => (
            <WordChipFixed key={i} word={word} />
          ))}
        </Animated.View>

        {/* ── 구분선 ── */}
        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerLabel}>
            {pick(lang, '이 단어로 문장을 만들어요', 'Tạo câu với từ này')}
          </Text>
          <View style={s.dividerLine} />
        </View>

        {/* ── Phase 2 + 3: 문장 완성 연출 (Spotlight Shift) ── */}
        {/*
         * 연출 설명:
         *  - "저는" : 고정 요소 (회색, 항상 표시)
         *  - [베트남 사람] : Phase 2에서 등장, teal 하이라이트 → 직전에 배운 단어임을 강조
         *  - "이에요." : Phase 3에서 페이드인 → 새로 배울 문법 요소임을 시각적으로 분리
         * 이식 시: prefix/highlight/suffix는 ADMIN API 응답 기반으로 동적 구성
         */}
        <View style={s.sentenceArea}>
          <View style={s.sentenceRow}>
            {/* 고정 요소 (항상 표시) */}
            <Text style={s.sentencePrefix}>{data.example.prefix}</Text>

            {/* Phase 2 — 하이라이트 단어 (배운 어휘) */}
            <Animated.View style={[s.highlightChip, { opacity: highlightOpacity }]}>
              <Text style={s.highlightText}>{data.example.highlight}</Text>
            </Animated.View>

            {/* Phase 3 — 문법 요소 (새로 배울 내용) */}
            <Animated.Text style={[s.suffixText, { opacity: suffixOpacity }]}>
              {data.example.suffix}
            </Animated.Text>
          </View>

          {/* Phase 3 — 완성 문장 전체 (번역 포함) */}
          <Animated.View style={[s.fullSentenceBox, { opacity: suffixOpacity }]}>
            <Text style={s.fullSentenceKo}>{data.example.full}</Text>
            <Text style={s.fullSentenceVi}>{data.example.fullVi}</Text>
          </Animated.View>
        </View>

        {/* ── Phase 4: 문법 구조 배지 ── */}
        {/* 이식 시: grammarLabel은 ADMIN API의 문법 액티비티 typeLabel로 교체 */}
        <Animated.View style={[s.grammarBadgeWrap, { opacity: ctaOpacity }]}>
          <View style={s.grammarBadge}>
            <Text style={s.grammarBadgeIcon}>📐</Text>
            <Text style={s.grammarBadgeText}>
              {pick(lang, data.grammarLabel, data.grammarLabelVi)}
            </Text>
          </View>
          <Text style={s.grammarBadgeDesc}>
            {pick(lang, '이 문법을 지금부터 배워요', 'Bây giờ hãy học ngữ pháp này')}
          </Text>
        </Animated.View>

      </View>

      {/* ── [bottomContent] Phase 4: CTA 버튼 ── */}
      {/* 이식 시: ActivityLayout confirmDisabled={false} onPressConfirm={onPressConfirm} 로 대체 */}
      <Animated.View style={[s.footer, { opacity: ctaOpacity }]}>
        <TouchableOpacity style={s.ctaBtn} onPress={onPressConfirm} activeOpacity={0.85}>
          <Text style={s.ctaBtnText}>
            {pick(lang, data.ctaLabel, data.ctaLabelVi)} →
          </Text>
        </TouchableOpacity>
      </Animated.View>

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

  // 브릿지 메시지
  bridgeMessage: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.ink,
    lineHeight: 30,
    textAlign: 'center',
  },

  // 단어 칩 목록
  wordChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },

  // 구분선
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerLabel: { fontSize: 12, color: colors.muted, fontWeight: '600' },

  // 문장 완성 연출 영역
  sentenceArea: {
    gap: 12,
    alignItems: 'center',
  },
  sentenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sentencePrefix: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.muted,
  },
  // 하이라이트 단어 칩 — 직전 단어 액티비티에서 배운 어휘임을 시각적으로 강조
  highlightChip: {
    backgroundColor: colors.tealSoft,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: colors.teal,
  },
  highlightText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.teal,
  },
  // 문법 요소 — 새로 배울 내용. 하이라이트 단어와 대비되는 스타일
  suffixText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.ink,
  },
  // 완성 문장 전체
  fullSentenceBox: {
    backgroundColor: '#F0FAFA',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
    alignSelf: 'stretch',
  },
  fullSentenceKo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.ink,
    textAlign: 'center',
  },
  fullSentenceVi: {
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },

  // 문법 배지
  grammarBadgeWrap: {
    alignItems: 'center',
    gap: 6,
  },
  grammarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  grammarBadgeIcon: { fontSize: 16 },
  grammarBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.teal,
  },
  grammarBadgeDesc: {
    fontSize: 12,
    color: colors.muted,
  },

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
  ctaBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
