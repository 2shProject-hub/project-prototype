/**
 * 학습 리포트 (LearningReportStage)
 * - 1차시 학습 성과 요약
 * - 어휘, 발음평가, 문제 현황
 * - 재학습 섹션
 * - AI 피드백
 * - 공통 ActivityHeader, CtaButton 적용
 */
import { svgDataUri, icon } from '../../theme/graphics';
import { useTheme } from '../../theme/ThemeContext';
import { ThemedGlyph } from '../../components/ThemedGlyph';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
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

// 도넛 차트 — SVG 데이터 URI (라이브러리 없이 코드 렌더)
function mbReportDonut(pct: number, label: string): string {
  // svgDataUri 는 btoa(Latin1) — 한글은 숫자 엔티티로 이스케이프해야 한다
  const esc = (t: string) => t.replace(/[^ -~]/g, (ch) => '&#' + ch.charCodeAt(0) + ';');
  label = esc(label);
  const r = 44;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return svgDataUri(
    `<svg xmlns="http://www.w3.org/2000/svg" width="110" height="110" viewBox="0 0 110 110">` +
    `<defs><linearGradient id="mbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7B2FF2"/><stop offset="0.55" stop-color="#A855F7"/><stop offset="1" stop-color="#0EA5E9"/></linearGradient></defs>` +
    `<circle cx="55" cy="55" r="${r}" fill="none" stroke="#F0EEF9" stroke-width="12"/>` +
    `<circle cx="55" cy="55" r="${r}" fill="none" stroke="url(#mbg)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 55 55)"/>` +
    `<text x="55" y="53" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="23" font-weight="800" fill="#1B1926">${pct}%</text>` +
    `<text x="55" y="73" text-anchor="middle" font-family="Pretendard, sans-serif" font-size="11.5" font-weight="700" fill="#6D6A7C">${label}</text>` +
    `</svg>`,
  );
}

export function LearningReportStage({ data, onNext, onBack }: Props) {
  const { lang } = useLang();
  const { theme: __mbRpT, enabled: __mbRpE } = useTheme();
  const __mbRp = __mbRpE && __mbRpT.id === 'malhaeboka';

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

        {/* 말해보카: 학습 분석 차트 — 도넛(정답률) + 세트별 막대 + 스탯 칩 */}
        {__mbRp ? (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 18, borderWidth: 1.5, borderColor: '#ECE7FA', padding: 18, gap: 16, marginBottom: 14, shadowColor: '#3E6D96', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } }}>
            <Text style={{ fontSize: 16.5, fontWeight: '800', color: '#1B1926', letterSpacing: -0.3 }}>{pick(lang, '학습 분석', 'Phân tích học tập')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
              <Image source={{ uri: mbReportDonut(82, pick(lang, '정답률', 'Đúng')) }} style={{ width: 110, height: 110 }} />
              <View style={{ flex: 1, gap: 9 }}>
                {([
                  [pick(lang, '어휘', 'Từ vựng'), 92, '#7B2FF2', '#EFEAFF'],
                  [pick(lang, '듣기', 'Nghe'), 85, '#0EA5E9', '#E0F2FE'],
                  [pick(lang, '발음', 'Phát âm'), 78, '#F59E0B', '#FEF3C7'],
                  [pick(lang, '문법', 'Ngữ pháp'), 88, '#10B981', '#D1FAE5'],
                ] as Array<[string, number, string, string]>).map(([k, v, fill, track]) => (
                  <View key={k} style={{ gap: 3 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 12.5, fontWeight: '700', color: '#4B4660' }}>{k}</Text>
                      <Text style={{ fontSize: 12.5, fontWeight: '800', color: fill }}>{v}%</Text>
                    </View>
                    <View style={{ height: 9, borderRadius: 5, backgroundColor: track, overflow: 'hidden' }}>
                      <View style={{ width: `${v}%`, height: 9, borderRadius: 5, backgroundColor: fill }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {([[pick(lang, '학습 12분', 'Học 12 phút'), '#EFEAFF', '#4C34C2'], [pick(lang, '연속 3일', 'Chuỗi 3 ngày'), '#FFF1E4', '#B45309'], [pick(lang, '별 24개', '24 sao'), '#EAF8EF', '#1E7A45']] as Array<[string, string, string]>).map(([t, bg, fg]) => (
                <View key={t} style={{ flex: 1, backgroundColor: bg, borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '800', color: fg }}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* 학습 요약 카드 */}
        <View style={s.summaryBox}>
          <Text style={s.summaryTitle}>{pick(lang, '1차시 완료 요약', 'Tóm tắt hoàn thành buổi 1')}</Text>

          <View style={s.summaryGrid}>
            {/* 어휘 */}
            <View style={[s.summaryItem, __mbRp && { gap: 7 }]}>
              {__mbRp ? (
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#EFEAFF', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={{ uri: icon('bookopen', '#5B3DF5', 22, 2) }} style={{ width: 22, height: 22 }} />
                </View>
              ) : (
                <ThemedGlyph style={s.summaryIcon} glyph="📚" />
              )}
              <Text style={[s.summaryCount, __mbRp && { fontSize: 18, color: '#1B1926' }]}>{data.vocabCount}개</Text>
              <Text style={[s.summaryLabel, __mbRp && { fontSize: 12.5 }]}>{pick(lang, '학습 어휘', 'Từ vựng học')}</Text>
            </View>

            {/* 발음평가 */}
            <View style={[s.summaryItem, __mbRp && { gap: 7 }]}>
              {__mbRp ? (
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={{ uri: icon('mic', '#0284C7', 22, 2) }} style={{ width: 22, height: 22 }} />
                </View>
              ) : (
                <ThemedGlyph style={s.summaryIcon} glyph="🎤" />
              )}
              <Text style={[s.summaryCount, __mbRp && { fontSize: 18, color: '#1B1926' }]}>{data.speakingScore}/{data.speakingTotal}</Text>
              <Text style={[s.summaryLabel, __mbRp && { fontSize: 12.5 }]}>{pick(lang, '발음평가', 'Đánh giá phát âm')}</Text>
            </View>

            {/* 확인 문제 */}
            <View style={[s.summaryItem, __mbRp && { gap: 7 }]}>
              {__mbRp ? (
                <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: '#D1FAE5', alignItems: 'center', justifyContent: 'center' }}>
                  <Image source={{ uri: icon('check', '#059669', 22, 2.4) }} style={{ width: 22, height: 22 }} />
                </View>
              ) : (
                <Text style={s.summaryIcon}>✓</Text>
              )}
              <Text style={[s.summaryCount, __mbRp && { fontSize: 18, color: '#1B1926' }]}>{data.testScore}/{data.testTotal}</Text>
              <Text style={[s.summaryLabel, __mbRp && { fontSize: 12.5 }]}>{pick(lang, '확인 문제', 'Câu hỏi xác nhận')}</Text>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <ThemedGlyph style={s.feedbackTitle} glyph="💡" />
            <Text style={s.feedbackTitle}>{pick(lang, 'AI 튜터 피드백', 'Phản hồi của AI Tutor')}</Text>
          </View>
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
