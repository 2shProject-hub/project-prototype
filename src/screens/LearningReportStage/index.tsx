/**
 * 학습 리포트 (LearningReportStage)
 * - 1차시 학습 성과 요약
 * - 어휘, 발음평가, 문제 현황
 * - 재학습 섹션
 * - AI 피드백
 * - 공통 ActivityHeader, CtaButton 적용
 */
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';

interface ReportData {
  sessionNumber: number;
  sessionTitle: string;
  sessionTitleVi: string;
  description: string;
  descriptionVi: string;
  vocabCount: number;
  speakingScore: number;
  speakingTotal: number;
  testScore: number;
  testTotal: number;
  aiFeedback: string;
  aiFeedbackVi: string;
}

interface Props {
  data?: ReportData;
  onNext?: () => void;
  onBack?: () => void;
}

export function LearningReportStage({ data, onNext, onBack }: Props) {
  const { lang } = useLang();

  if (!data) {
    return (
      <View style={s.container}>
        <Text style={s.emptyText}>{pick(lang, '데이터가 없습니다', 'Không có dữ liệu')}</Text>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <ActivityHeader percentage={100} onClose={onBack || (() => {})} />

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* 헤더 배지 */}
        <View style={s.badge}>
          <Text style={s.badgeText}>✓ {pick(lang, '학습 리포트', 'Báo cáo học tập')}</Text>
        </View>

        {/* 제목 */}
        <View style={s.titleBox}>
          <Text style={s.title}>{pick(lang, data.sessionTitle, data.sessionTitleVi)}</Text>
          <Text style={s.subtitle}>{pick(lang, data.description, data.descriptionVi)}</Text>
        </View>

        {/* 학습 요약 카드 */}
        <View style={s.summaryBox}>
          <Text style={s.summaryTitle}>{pick(lang, '1차시 완료 요약', 'Tóm tắt hoàn thành buổi 1')}</Text>

          <View style={s.summaryGrid}>
            {/* 어휘 */}
            <View style={s.summaryItem}>
              <Text style={s.summaryIcon}>📚</Text>
              <Text style={s.summaryCount}>{data.vocabCount}개</Text>
              <Text style={s.summaryLabel}>{pick(lang, '학습 어휘', 'Từ vựng học')}</Text>
            </View>

            {/* 발음평가 */}
            <View style={s.summaryItem}>
              <Text style={s.summaryIcon}>🎤</Text>
              <Text style={s.summaryCount}>{data.speakingScore}/{data.speakingTotal}</Text>
              <Text style={s.summaryLabel}>{pick(lang, '발음평가', 'Đánh giá phát âm')}</Text>
            </View>

            {/* 확인 문제 */}
            <View style={s.summaryItem}>
              <Text style={s.summaryIcon}>✓</Text>
              <Text style={s.summaryCount}>{data.testScore}/{data.testTotal}</Text>
              <Text style={s.summaryLabel}>{pick(lang, '확인 문제', 'Câu hỏi xác nhận')}</Text>
            </View>
          </View>
        </View>

        {/* 재학습 섹션 */}
        <View style={s.reviewSection}>
          <View style={s.reviewItem}>
            <Text style={s.reviewLabel}>{pick(lang, '단어 다시 보기', 'Xem lại từ vựng')}</Text>
            <Text style={s.reviewCount}>15개 ›</Text>
          </View>

          <View style={s.reviewItem}>
            <Text style={s.reviewLabel}>{pick(lang, '문법 다시 보기', 'Xem lại ngữ pháp')}</Text>
            <Text style={s.reviewLink}>{pick(lang, '이에요/예요', 'này/đây')} ›</Text>
          </View>

          <View style={s.reviewItem}>
            <Text style={s.reviewLabel}>{pick(lang, '음성 발화 평가 다시 보기', 'Xem lại đánh giá phát âm')}</Text>
            <Text style={s.reviewLink}>›</Text>
          </View>
        </View>

        {/* AI 피드백 영역 */}
        <View style={s.feedbackBox}>
          <Text style={s.feedbackTitle}>💡 {pick(lang, 'AI 튜터 피드백', 'Phản hồi của AI Tutor')}</Text>
          <Text style={s.feedbackText}>{pick(lang, data.aiFeedback, data.aiFeedbackVi)}</Text>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '학습 완료', 'Hoàn thành học tập')}
          onPress={onNext}
          size="lg"
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.md,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.tealDark,
  },
  titleBox: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  summaryBox: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.ink,
    marginBottom: spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  summaryIcon: {
    fontSize: 24,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.teal,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  reviewSection: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    gap: spacing.md,
    ...shadow.soft,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgSubtle,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewCount: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.tealDark,
  },
  reviewLink: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.teal,
  },
  feedbackBox: {
    backgroundColor: colors.warningLight,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.warning,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  feedbackText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
});
