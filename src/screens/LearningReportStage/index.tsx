/**
 * 학습 리포트 (LearningReportStage)
 * - 1차시 학습 성과 요약
 * - 어휘, 발음평가, 문제 현황
 * - 재학습 섹션
 * - AI 피드백
 */
import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import { useLang, pick } from '../../components/LangContext';
import { ActivityHeader } from '../../components/ActivityHeader';

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
        {/* 헤더 */}
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
            <Text style={s.reviewLabel}>{pick(lang, '내가 말한 음성 보기', 'Xem âm thanh của tôi')}</Text>
            <Text style={s.reviewLink}>{pick(lang, '저장됨', 'Đã lưu')} ›</Text>
          </View>
        </View>

        {/* AI 피드백 */}
        <View style={s.feedbackBox}>
          <View style={s.feedbackHeader}>
            <Text style={s.feedbackIcon}>✨</Text>
            <Text style={s.feedbackTitle}>{pick(lang, 'AI 피드백', 'Phản hồi AI')}</Text>
          </View>

          <Text style={s.feedbackText}>
            {pick(lang, data.aiFeedback, data.aiFeedbackVi)}
          </Text>

          <View style={s.feedbackNote}>
            <Text style={s.feedbackNoteText}>
              {pick(
                lang,
                "오늘의 자기소개 '발음'을 완성했어요.\n다음에는 '자는 베트남 사람이에요'를 구분해 국적 표현을 구분해 구분해 구분해야 봐요.",
                "Bạn đã hoàn thành 'phát âm' của bài tự giới thiệu hôm nay.\nLần sau, bạn nên phân biệt 'tôi là người Việt Nam' để phân biệt cách diễn đạt quốc tịch."
              )}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={s.footer}>
        <TouchableOpacity
          style={s.completeBtn}
          onPress={onNext}
          activeOpacity={0.8}
        >
          <Text style={s.completeBtnText}>
            {pick(lang, '학습 완료', 'Hoàn thành học tập')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  emptyText: { fontSize: 14, color: colors.muted, textAlign: 'center', padding: 20 },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tealSoft,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: colors.teal },

  titleBox: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '800', color: colors.ink, marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '500', color: colors.muted, lineHeight: 20 },

  summaryBox: {
    backgroundColor: '#F0FAFA',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: { fontSize: 14, fontWeight: '700', color: colors.ink, marginBottom: 16 },
  summaryGrid: { flexDirection: 'row', gap: 12 },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 4,
  },
  summaryIcon: { fontSize: 24 },
  summaryCount: { fontSize: 16, fontWeight: '800', color: colors.teal },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: colors.muted, textAlign: 'center' },

  reviewSection: { marginBottom: 24, gap: 12 },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.line,
  },
  reviewLabel: { fontSize: 14, fontWeight: '700', color: colors.ink },
  reviewCount: { fontSize: 13, fontWeight: '600', color: colors.teal },
  reviewLink: { fontSize: 13, fontWeight: '600', color: colors.teal },

  feedbackBox: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  feedbackHeader: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 10 },
  feedbackIcon: { fontSize: 16 },
  feedbackTitle: { fontSize: 13, fontWeight: '700', color: '#92400E' },
  feedbackText: { fontSize: 13, fontWeight: '600', color: '#78350F', lineHeight: 20, marginBottom: 10 },
  feedbackNote: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  feedbackNoteText: { fontSize: 12, fontWeight: '500', color: '#92400E', lineHeight: 18 },

  footer: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  completeBtn: {
    backgroundColor: colors.teal,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
