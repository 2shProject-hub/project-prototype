/**
 * 16. 학습 리포트 (LearningReportStage)
 * - 개편 레이아웃 (말해보카 타입 기반 레이아웃 & 테마 off 기본/뉴트럴 디자인 시스템)
 * - 한국어 / 베트남어 다국어(i18n) 완벽 지원
 * - 5단계 정답률 구간별 고정 총평 자동 매핑
 * - 종합 성취도 도넛 차트 (정답률)
 * - 4대 영역별 막대 프로그레스 (어휘, 듣기, 발음, 문법)
 * - 하단 3단 스탯 칩 (학습 시간, 연속 학습일, 별 보상)
 * - 1차시 완료 요약 (학습 단어, 발음평가, 문항 풀이)
 * - 발음평가 3축 방사형(레이더) 삼각형 차트 (정확도, 완성도, 유창성)
 * - 고정 Footer CTA 버튼
 */
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { colors, radius, spacing, shadow } from '../../theme';
import { useTheme } from '../../theme/ThemeContext';
import { useLang, pick, ActivityHeader, CtaButton } from '../../components';
import { ReportRadarChart } from './ReportRadarChart';
import { ReportDonutChart } from './ReportDonutChart';
import { getFeedbackByAccuracy } from './feedbackUtils';

export interface ReportData {
  sessionNumber?: number;
  sessionTitle?: string;
  sessionTitleVi?: string;
  description?: string;
  descriptionVi?: string;
  // 종합 성취도
  totalAccuracy?: number;
  // 4대 영역별 성취도
  vocabScore?: number;
  listenScore?: number;
  pronScore?: number;
  grammarScore?: number;
  // 스탯 지표
  studyMinutes?: number;
  streakDays?: number;
  starsEarned?: number;
  // 차시 요약 지표
  vocabCount?: number;
  speakingScore?: number;
  speakingTotal?: number;
  testScore?: number;
  testTotal?: number;
  // 발음평가 3축
  accuracyScore?: number;
  fluencyScore?: number;
  completenessScore?: number;
  // 수동 총평 오버라이드 (지정하지 않으면 정답률 구간 5단계 정책 자동 매핑)
  aiFeedback?: string;
  aiFeedbackVi?: string;
}

interface Props {
  data?: ReportData;
  onNext?: () => void;
  onBack?: () => void;
}

const DEFAULT_REPORT_DATA: ReportData = {
  sessionNumber: 1,
  sessionTitle: '저는 흐엉이에요',
  sessionTitleVi: 'Tôi là Hương',
  description: '나라와 국적 표현을 배웠습니다.',
  descriptionVi: 'Bạn đã học về cách diễn đạt quốc gia và quốc tịch.',
  totalAccuracy: 82,
  vocabScore: 92,
  listenScore: 85,
  pronScore: 78,
  grammarScore: 88,
  studyMinutes: 12,
  streakDays: 3,
  starsEarned: 24,
  vocabCount: 12,
  speakingScore: 3,
  speakingTotal: 4,
  testScore: 5,
  testTotal: 6,
  accuracyScore: 34,
  fluencyScore: 60,
  completenessScore: 96,
};

export function LearningReportStage({ data, onNext, onBack }: Props) {
  const { lang } = useLang();
  const { theme: currentTheme, enabled: themeEnabled } = useTheme();
  const isMalhaeboka = themeEnabled && currentTheme.id === 'malhaeboka';

  const report = { ...DEFAULT_REPORT_DATA, ...data };

  // 3대 영역(어휘, 발음, 문법) 기반 종합 정답률 계산 (직접 전달된 totalAccuracy가 없을 경우 3개 평균 산출)
  const computedAccuracy =
    report.totalAccuracy ??
    Math.round(((report.vocabScore ?? 92) + (report.pronScore ?? 78) + (report.grammarScore ?? 88)) / 3);

  // 5단계 정답률 구간별 고정 총평 매핑 데이터 적용
  const mappedFeedback = getFeedbackByAccuracy(computedAccuracy);
  const feedbackKo =
    report.aiFeedback && report.aiFeedback !== '좋은 발음으로 완성했습니다!'
      ? report.aiFeedback
      : mappedFeedback.ko;
  const feedbackVi =
    report.aiFeedbackVi && report.aiFeedbackVi !== 'Bạn đã hoàn thành với phát âm tốt!'
      ? report.aiFeedbackVi
      : mappedFeedback.vi;

  // 테마별 색상 정의 ('테마 off' 뉴트럴 시스템 vs '말해보카 테마 on')
  const themeColors = isMalhaeboka
    ? {
        primary: '#7B2FF2',
        secondary: '#A855F7',
        badgeBg: '#F3E8FF',
        badgeText: '#7B2FF2',
        donutStart: '#7B2FF2',
        donutEnd: '#0EA5E9',
        radarAccent: '#0284C7',
        radarFill: 'rgba(14, 165, 233, 0.22)',
        chipStudyBg: '#EFEAFF',
        chipStudyFg: '#4C34C2',
        chipStreakBg: '#FFF1E4',
        chipStreakFg: '#B45309',
        chipStarBg: '#EAF8EF',
        chipStarFg: '#1E7A45',
        cardBorder: '#ECE7FA',
        summaryBg: '#FFFFFF',
        feedbackBg: '#F5F3FF',
        feedbackBorder: '#DDD6FE',
      }
    : {
        primary: colors.teal,
        secondary: colors.tealDark,
        badgeBg: colors.tealSoft,
        badgeText: colors.tealDark,
        donutStart: '#00A8A6',
        donutEnd: '#0EA5E9',
        radarAccent: '#FF5B29',
        radarFill: 'rgba(255, 91, 41, 0.20)',
        chipStudyBg: '#F0FAFA',
        chipStudyFg: '#007A78',
        chipStreakBg: '#FFF7ED',
        chipStreakFg: '#C2410C',
        chipStarBg: '#ECFDF5',
        chipStarFg: '#047857',
        cardBorder: '#E2E8F0',
        summaryBg: '#FFFFFF',
        feedbackBg: '#F8FAFC',
        feedbackBorder: '#E2E8F0',
      };

  // '듣기' 제외 3대 핵심 영역 (어휘 / 발음 / 문법)
  const domainScores = [
    {
      label: pick(lang, '어휘', 'Từ vựng'),
      score: report.vocabScore ?? 92,
      color: isMalhaeboka ? '#7B2FF2' : '#00A8A6',
      track: isMalhaeboka ? '#EFEAFF' : '#E0F2FE',
    },
    {
      label: pick(lang, '발음', 'Phát âm'),
      score: report.pronScore ?? 78,
      color: '#F59E0B',
      track: '#FEF3C7',
    },
    {
      label: pick(lang, '문법', 'Ngữ pháp'),
      score: report.grammarScore ?? 88,
      color: '#10B981',
      track: '#D1FAE5',
    },
  ];

  return (
    <View style={s.root}>
      <ActivityHeader percentage={100} onClose={onBack || (() => {})} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 상단 태그 배지 */}
        <View style={[s.badge, { backgroundColor: themeColors.badgeBg }]}>
          <Text style={[s.badgeText, { color: themeColors.badgeText }]}>
            ✓ {pick(lang, '학습 리포트', 'Báo cáo học tập')}
          </Text>
        </View>

        {/* 차시 타이틀 & 3D 학사모 일러스트 */}
        <View style={s.titleBox}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <Text style={s.title}>
              {pick(lang, report.sessionTitle ?? '', report.sessionTitleVi ?? '')}
            </Text>
            <Text style={s.subtitle}>
              {pick(lang, report.description ?? '', report.descriptionVi ?? '')}
            </Text>
          </View>
          <Image
            source={require('../../../assets/themes/malhaeboka/icon-graduation.png')}
            style={s.graduationIcon}
            resizeMode="contain"
          />
        </View>

        {/* 1. 학습 분석 카드 (종합 정답률 + 4대 영역 바 + 3단 스탯 칩) */}
        <View style={[s.card, { borderColor: themeColors.cardBorder }]}>
          <Text style={s.cardTitle}>{pick(lang, '학습 분석', 'Phân tích học tập')}</Text>

          <View style={s.analysisRow}>
            {/* 좌측 도넛 차트 (다국어 라벨 적용) */}
            <ReportDonutChart
              percentage={computedAccuracy}
              label={pick(lang, '정답률', 'Đúng')}
              size={116}
              strokeWidth={13}
              startColor={themeColors.donutStart}
              endColor={themeColors.donutEnd}
            />

            {/* 우측 3대 영역 프로그레스 바 */}
            <View style={s.domainList}>
              {domainScores.map((item) => (
                <View key={item.label} style={s.domainItem}>
                  <View style={s.domainLabelRow}>
                    <Text style={s.domainLabelText}>{item.label}</Text>
                    <Text style={[s.domainScoreText, { color: item.color }]}>
                      {item.score}%
                    </Text>
                  </View>
                  <View style={[s.domainTrack, { backgroundColor: item.track }]}>
                    <View
                      style={[
                        s.domainFill,
                        { width: `${item.score}%`, backgroundColor: item.color },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 3단 스탯 칩 */}
          <View style={s.statChipsRow}>
            <View style={[s.statChip, { backgroundColor: themeColors.chipStudyBg }]}>
              <Text style={[s.statChipText, { color: themeColors.chipStudyFg }]}>
                {pick(lang, `학습 ${report.studyMinutes}분`, `Học ${report.studyMinutes} phút`)}
              </Text>
            </View>
            <View style={[s.statChip, { backgroundColor: themeColors.chipStreakBg }]}>
              <Text style={[s.statChipText, { color: themeColors.chipStreakFg }]}>
                {pick(lang, `연속 ${report.streakDays}일`, `Chuỗi ${report.streakDays} ngày`)}
              </Text>
            </View>
            <View style={[s.statChip, { backgroundColor: themeColors.chipStarBg }]}>
              <Text style={[s.statChipText, { color: themeColors.chipStarFg }]}>
                {pick(lang, `별 ${report.starsEarned}개`, `${report.starsEarned} sao`)}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. 1차시 완료 요약 카드 */}
        <View style={[s.card, { borderColor: themeColors.cardBorder }]}>
          <Text style={s.cardTitle}>
            {pick(
              lang,
              `${report.sessionNumber ?? 1}차시 완료 요약`,
              `Tóm tắt hoàn thành buổi ${report.sessionNumber ?? 1}`,
            )}
          </Text>

          <View style={s.summaryGrid}>
            {/* 어휘 수 */}
            <View style={s.summaryCol}>
              <Image
                source={require('../../../assets/themes/malhaeboka/thumb-vocab.png')}
                style={s.summaryThumb}
                resizeMode="cover"
              />
              <Text style={s.summaryValue}>
                {report.vocabCount ?? 12}{pick(lang, '개', ' từ')}
              </Text>
              <Text style={s.summaryLabel}>{pick(lang, '학습 단어', 'Từ vựng học')}</Text>
            </View>

            {/* 발음평가 */}
            <View style={s.summaryCol}>
              <Image
                source={require('../../../assets/themes/malhaeboka/thumb-speak.png')}
                style={s.summaryThumb}
                resizeMode="cover"
              />
              <Text style={s.summaryValue}>
                {report.speakingScore ?? 3}/{report.speakingTotal ?? 4}
              </Text>
              <Text style={s.summaryLabel}>{pick(lang, '발음평가', 'Đánh giá phát âm')}</Text>
            </View>

            {/* 문항 풀이 */}
            <View style={s.summaryCol}>
              <Image
                source={require('../../../assets/themes/malhaeboka/thumb-check.png')}
                style={s.summaryThumb}
                resizeMode="cover"
              />
              <Text style={s.summaryValue}>
                {report.testScore ?? 5}/{report.testTotal ?? 6}
              </Text>
              <Text style={s.summaryLabel}>{pick(lang, '문항 풀이', 'Câu hỏi 풀이')}</Text>
            </View>
          </View>
        </View>

        {/* 3. 발음평가 3축 방사형 차트 카드 */}
        <View style={[s.card, { borderColor: themeColors.cardBorder }]}>
          <Text style={s.cardTitle}>{pick(lang, '발음평가', 'Đánh giá phát âm')}</Text>

          <ReportRadarChart
            accuracy={report.accuracyScore ?? 34}
            fluency={report.fluencyScore ?? 60}
            completeness={report.completenessScore ?? 96}
            labels={{
              accuracy: pick(lang, '정확도', 'Độ chính xác'),
              fluency: pick(lang, '유창성', 'Độ lưu loát'),
              completeness: pick(lang, '완성도', 'Độ hoàn thành'),
            }}
            accentColor={themeColors.radarAccent}
            fillColor={themeColors.radarFill}
          />
        </View>

        {/* 4. AI 튜터 총평 카드 (5단계 정답률 구간별 고정 총평 자동 매핑) */}
        <View
          style={[
            s.feedbackCard,
            {
              backgroundColor: themeColors.feedbackBg,
              borderColor: themeColors.feedbackBorder,
            },
          ]}
        >
          <Text style={s.feedbackTitle}>{pick(lang, '총평', 'Nhận xét chung')}</Text>
          <Text style={s.feedbackText}>{pick(lang, feedbackKo, feedbackVi)}</Text>
        </View>
      </ScrollView>

      {/* 최하단 고정 CTA 버튼 */}
      <View style={s.footer}>
        <CtaButton
          title={pick(lang, '학습 완료', 'Hoàn thành học tập')}
          onPress={onNext || (() => {})}
          size="lg"
        />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    gap: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
  titleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#64748B',
    lineHeight: 19,
  },
  graduationIcon: {
    width: 90,
    height: 86,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.2,
    padding: 18,
    gap: 16,
    ...shadow.soft,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  domainList: {
    flex: 1,
    gap: 8,
  },
  domainItem: {
    gap: 3,
  },
  domainLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  domainLabelText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  domainScoreText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  domainTrack: {
    height: 8.5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  domainFill: {
    height: 8.5,
    borderRadius: 5,
  },
  statChipsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
  },
  statChip: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statChipText: {
    fontSize: 12.5,
    fontWeight: '800',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  summaryCol: {
    alignItems: 'center',
    gap: 6,
  },
  summaryThumb: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  feedbackCard: {
    borderRadius: 18,
    borderWidth: 1.2,
    padding: 18,
    gap: 8,
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  feedbackText: {
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
