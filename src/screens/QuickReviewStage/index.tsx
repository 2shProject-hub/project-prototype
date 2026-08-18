import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { colors } from '../../theme/colors';
import { MOCK_QUICK_REVIEW, type QuickReviewItem } from '../../data/lessonData';
import { ActivityHeader } from '../../components/ActivityHeader';
import { useLang, pick } from '../../components/LangContext';
import { useSfx } from '../../hooks/useSfx';

// ─── Props — Source A ActivityLayout 이식 기준으로 네이밍 정렬 ──────
// 이식 시: onPressConfirm → ActivityLayout.onPressConfirm
//          onClose       → ActivityLayout.onClose (showCloseButton=true)
//          confirmDisabled → ActivityLayout.confirmDisabled
interface QuickReviewStageProps {
  onPressConfirm: () => void;   // Source A: onPressConfirm
  onClose: () => void;          // Source A: onClose (X버튼)
  confirmDisabled?: boolean;    // Source A: confirmDisabled (외부 강제 비활성화)
  data?: typeof MOCK_QUICK_REVIEW;
}

// ─── 문항 상태 — complete: boolean 기반 (Source A 패턴) ──────────────
// Source A: totalAct 배열의 complete 필드 하나로 관리
// 현재 활성 문항 = complete=false 인 첫 번째 항목
// revealed: 정답 공개 여부 (퀵리뷰 전용 추가 상태)
interface ItemRunState {
  complete: boolean;    // Source A 기준 완료 여부
  revealed: boolean;    // 정답 공개 여부 (퀵리뷰 전용)
  remembered: boolean;  // 기억나요 선택 여부
}

// ─── 개별 문항 카드 ───────────────────────────────────────────────
function ReviewCard({
  item,
  runState,
  isActive,
  lang,
  onReveal,
  onRemembered,
  onForgot,
}: {
  item: QuickReviewItem;
  runState: ItemRunState;
  isActive: boolean;
  lang: string;
  onReveal: () => void;
  onRemembered: () => void;
  onForgot: () => void;
}) {
  const isLocked = !isActive && !runState.complete;
  const isDone = runState.complete;
  const isRevealed = runState.revealed;

  const typeLabel = pick(lang, item.typeLabel, item.typeLabelVi ?? item.typeLabel);
  const question = pick(lang, item.question, item.questionVi ?? item.question);
  const answer = pick(lang, item.answer, item.answerVi ?? item.answer);
  const context = item.context ? pick(lang, item.context, item.contextVi ?? item.context) : undefined;

  return (
    <View style={[card.wrap, isLocked && card.wrapLocked, isDone && card.wrapDone]}>

      {/* [questionContent 영역] — Source A: ActivityLayout.questionContent 에 해당 */}
      {/* 문항 번호 + 유형 배지 */}
      <View style={card.header}>
        <View style={[card.numBadge, isDone && (runState.remembered ? card.numRemembered : card.numForgot)]}>
          {isDone ? (
            <Text style={card.numText}>{runState.remembered ? '✓' : '✗'}</Text>
          ) : (
            <Text style={card.numText}>{item.activityQuestionNo}</Text>
          )}
        </View>
        {/* 배지 — Source A: questionContent 내부 커스텀 View (헤더 슬롯 없음) */}
        <View style={[card.typeBadge, isLocked && card.typeBadgeLocked]}>
          <Text style={[card.typeText, isLocked && card.typeTextLocked]}>{typeLabel}</Text>
        </View>
      </View>

      {/* 질문 텍스트 */}
      <Text style={[card.question, isLocked && card.questionLocked]}>{question}</Text>
      {/* [/questionContent 영역] */}

      {/* [answerContent 영역] — Source A: ActivityLayout.answerContent 에 해당 */}
      {/* 정답 공개 전 힌트 */}
      {isActive && !isRevealed && (
        <TouchableOpacity style={card.revealHint} onPress={onReveal} activeOpacity={0.7}>
          <Text style={card.revealHintText}>{pick(lang, '눌러서 정답 확인', 'Nhấn để xem đáp án')}</Text>
        </TouchableOpacity>
      )}

      {/* 정답 박스 (공개 후 또는 완료) */}
      {(isRevealed || isDone) && (
        <View style={[card.answerBox, isDone && card.answerBoxDone]}>
          {isRevealed && !isDone && <Text style={card.answerLabel}>{pick(lang, '정답', 'Đáp án')}</Text>}
          <Text style={card.answerText}>{answer}</Text>
          {context && !isDone && <Text style={card.contextText}>{context}</Text>}
        </View>
      )}

      {/* 응답 버튼 — Source A: AnswerFeedBackModal 의 DuoButton 역할 */}
      {isActive && isRevealed && !isDone && (
        <View style={card.btnRow}>
          <TouchableOpacity style={card.btnRemember} onPress={onRemembered} activeOpacity={0.8}>
            <Text style={card.btnRememberText}>{pick(lang, '기억나요', 'Nhớ rồi')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={card.btnForgot} onPress={onForgot} activeOpacity={0.8}>
            <Text style={card.btnForgotText}>{pick(lang, '기억이 안 나요', 'Chưa nhớ')}</Text>
          </TouchableOpacity>
        </View>
      )}
      {/* [/answerContent 영역] */}

      {/* 완료 상태 레이블 */}
      {isDone && (
        <Text style={[card.doneLabel, runState.remembered ? card.doneLabelGreen : card.doneLabelRed]}>
          {runState.remembered
            ? pick(lang, '기억했어요!', 'Đã nhớ!')
            : pick(lang, '다시 확인해요', 'Cần xem lại')}
        </Text>
      )}
    </View>
  );
}

// ─── 메인 화면 ────────────────────────────────────────────────────
// 이식 가이드:
//   1. <View style={s.root}> → <ActivityLayout ...> 로 교체
//   2. topBar → ActivityLayout의 showCloseButton=true, showBackButton=false
//   3. questionContent 슬롯 → ScrollView + 배지 + 제목 + 카드 목록
//   4. bottomContent 슬롯 → 하단 버튼 (confirmDisabled 연동)
//   5. step/totalSteps → items 진행 인덱스 연동
export function QuickReviewStage({
  onPressConfirm,
  onClose,
  confirmDisabled = false,
  data = MOCK_QUICK_REVIEW,
}: QuickReviewStageProps) {
  const { lang } = useLang();
  const sfx = useSfx();
  const items = data.items.slice(0, 10); // MAX 10

  // Source A 패턴: complete: boolean 기반 상태 배열
  const [runStates, setRunStates] = useState<ItemRunState[]>(
    items.map(() => ({ complete: false, revealed: false, remembered: false }))
  );

  // Source A 패턴: 현재 활성 문항 = complete=false 인 첫 번째 항목
  const activeIndex = runStates.findIndex((s) => !s.complete);
  const allDone = activeIndex === -1;
  const rememberedCount = runStates.filter((s) => s.remembered).length;
  const completedCount = runStates.filter((s) => s.complete).length;
  const progressPercentage = Math.round((completedCount / items.length) * 100);

  // confirmDisabled: 외부 prop 또는 미완료 상태
  const isConfirmDisabled = confirmDisabled || !allDone;

  const updateRunState = (index: number, patch: Partial<ItemRunState>) => {
    setRunStates((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const handleResponse = (index: number, remembered: boolean) => {
    // Source A 패턴: complete=true 로 설정 → activeIndex 자동으로 다음 항목으로 이동
    updateRunState(index, { complete: true, remembered });
  };

  return (
    <View style={s.root}>

      {/* ── 상단 바 — ActivityHeader (프로그레스바 + X버튼 + 종료 확인 팝업) ── */}
      {/* 이식 시: ActivityLayout showCloseButton=true, showBackButton=false 로 대체 */}
      <ActivityHeader percentage={progressPercentage} onClose={onClose} />

      {/* ── [questionContent] ScrollView ─────────────────────────── */}
      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 제목 / 안내 */}
        <Text style={s.title}>{pick(lang, data.title, data.titleVi ?? data.title)}</Text>
        <Text style={s.subtitle}>{pick(lang, data.subtitle, data.subtitleVi ?? data.subtitle)}</Text>

        {/* 문항 카드 목록 */}
        <View style={s.cardList}>
          {items.map((item, i) => (
            <ReviewCard
              key={item.activityQuestionNo}
              item={item}
              runState={runStates[i]}
              isActive={i === activeIndex}
              lang={lang}
              onReveal={() => { sfx.play(); updateRunState(i, { revealed: true }); }}
              onRemembered={() => { sfx.play(); handleResponse(i, true); }}
              onForgot={() => { sfx.play(); handleResponse(i, false); }}
            />
          ))}
        </View>

        {/* 완료 요약 */}
        {allDone && (
          <View style={s.summaryBox}>
            <Text style={s.summaryEmoji}>🎉</Text>
            <Text style={s.summaryTitle}>
              {pick(
                lang,
                `${items.length}개 중 ${rememberedCount}개 기억했어요!`,
                `Đã nhớ ${rememberedCount}/${items.length} câu!`
              )}
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
      {/* ── [/questionContent] ───────────────────────────────────── */}

      {/* ── [bottomContent] 하단 버튼 ────────────────────────────── */}
      {/* 이식 시: ActivityLayout confirmDisabled={isConfirmDisabled} onPressConfirm={onPressConfirm} 로 대체 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={[s.nextBtn, isConfirmDisabled && s.nextBtnDisabled]}
          onPress={isConfirmDisabled ? undefined : () => { sfx.play(); onPressConfirm(); }}
          activeOpacity={isConfirmDisabled ? 1 : 0.8}
        >
          <Text style={[s.nextBtnText, isConfirmDisabled && s.nextBtnTextDisabled]}>
            {pick(lang, data.nextLabel, data.nextLabelVi ?? data.nextLabel)} →
          </Text>
        </TouchableOpacity>
      </View>
      {/* ── [/bottomContent] ─────────────────────────────────────── */}

    </View>
  );
}

// ─── 스타일 ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  headerBadge: {
    position: 'absolute', left: 12,
    paddingHorizontal: 12, paddingVertical: 4,
    backgroundColor: colors.tealSoft, borderRadius: 20,
  },
  headerBadgeText: { fontSize: 12, fontWeight: '700', color: colors.teal },

  scroll: { flex: 1 },
  scrollContent: { padding: 20 },

  title: { fontSize: 22, fontWeight: '800', color: colors.ink, marginBottom: 8, lineHeight: 30 },
  subtitle: { fontSize: 14, color: colors.muted, lineHeight: 20, marginBottom: 24 },

  cardList: { gap: 12 },

  summaryBox: {
    marginTop: 24, padding: 20,
    backgroundColor: colors.tealSoft, borderRadius: 16,
    alignItems: 'center', gap: 6,
  },
  summaryEmoji: { fontSize: 32 },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.teal },

  footer: {
    padding: 16, backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.line,
  },
  nextBtn: {
    backgroundColor: colors.teal, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: colors.line },
  nextBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  nextBtnTextDisabled: { color: colors.muted },
});

const card = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface, borderRadius: 16,
    padding: 16, gap: 10,
    borderWidth: 1.5, borderColor: colors.teal,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  wrapLocked: { borderColor: colors.line, backgroundColor: '#fafafa' },
  wrapDone: { borderColor: colors.line },

  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  numBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.teal, alignItems: 'center', justifyContent: 'center',
  },
  numRemembered: { backgroundColor: '#22c55e' },
  numForgot: { backgroundColor: '#f97316' },
  numText: { fontSize: 13, fontWeight: '700', color: '#fff' },

  typeBadge: {
    paddingHorizontal: 10, paddingVertical: 3,
    backgroundColor: colors.tealSoft, borderRadius: 20,
  },
  typeBadgeLocked: { backgroundColor: '#f0f0f0' },
  typeText: { fontSize: 11, fontWeight: '700', color: colors.teal },
  typeTextLocked: { color: colors.muted },

  question: { fontSize: 15, fontWeight: '600', color: colors.ink, lineHeight: 22 },
  questionLocked: { color: colors.muted },

  answerBox: {
    backgroundColor: colors.tealSoft, borderRadius: 10, padding: 12, gap: 4,
  },
  answerBoxDone: { backgroundColor: '#f5f5f5' },
  answerLabel: { fontSize: 11, fontWeight: '700', color: colors.teal },
  answerText: { fontSize: 17, fontWeight: '800', color: colors.ink },
  contextText: { fontSize: 12, color: colors.muted, marginTop: 2 },

  btnRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  btnRemember: {
    flex: 1, backgroundColor: colors.teal, borderRadius: 12,
    paddingVertical: 11, alignItems: 'center',
  },
  btnRememberText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  btnForgot: {
    flex: 1, borderRadius: 12, borderWidth: 1.5, borderColor: colors.line,
    paddingVertical: 11, alignItems: 'center', backgroundColor: colors.surface,
  },
  btnForgotText: { fontSize: 14, fontWeight: '600', color: colors.ink },

  revealHint: { paddingVertical: 4 },
  revealHintText: { fontSize: 12, color: colors.muted },

  doneLabel: { fontSize: 12, fontWeight: '700' },
  doneLabelGreen: { color: '#22c55e' },
  doneLabelRed: { color: '#f97316' },
});
